"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasSupabaseServiceConfig } from "@/lib/config";
import { createSupabaseService } from "@/lib/supabase/service";
import { createSupabaseServer } from "@/lib/supabase/server";
import { displayNameFromEmail, logAdminActivity } from "@/lib/admin-activity";
import { getViewerRoleFromSession } from "@/lib/viewer-server";
import { isAdmin } from "@/lib/viewer";

function asText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function asOptionalText(formData: FormData, key: string) {
  const value = asText(formData, key);
  return value || null;
}

function asBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function toDbRole(role: string): "admin" | "internal" {
  return role === "Admin" ? "admin" : "internal";
}

function toLabelRole(role: string): "Admin" | "Interno" {
  return role === "Admin" ? "Admin" : "Interno";
}

async function getSessionUserId() {
  const supabaseServer = await createSupabaseServer();
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();
  return user?.id ?? null;
}

async function ensureNotLastActiveAdmin(
  supabase: ReturnType<typeof createSupabaseService>,
  userId: string,
  nextRole: "admin" | "internal",
  nextActive: boolean,
) {
  const { data: current, error: currentError } = await supabase
    .from("users")
    .select("id, role, active")
    .eq("id", userId)
    .maybeSingle();

  if (currentError) {
    throw new Error(`No se pudo validar el usuario: ${currentError.message}`);
  }

  if (!current) {
    throw new Error("El usuario no existe o ya fue eliminado.");
  }

  const adminLosesAccess = current.role === "admin" && current.active === true && (nextRole !== "admin" || !nextActive);
  if (!adminLosesAccess) {
    return;
  }

  const { count, error: countError } = await supabase
    .from("users")
    .select("id", { count: "exact", head: true })
    .eq("role", "admin")
    .eq("active", true);

  if (countError) {
    throw new Error(`No se pudo contar administradores activos: ${countError.message}`);
  }

  if ((count ?? 0) <= 1) {
    throw new Error("No puedes dejar el sistema sin administradores activos.");
  }
}

async function assertAdmin() {
  const role = await getViewerRoleFromSession();
  if (!isAdmin(role)) {
    throw new Error("Unauthorized");
  }
}

function rethrowIfRedirectError(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "digest" in error &&
    typeof error.digest === "string" &&
    error.digest.startsWith("NEXT_REDIRECT")
  ) {
    throw error;
  }
}

export async function createUserAction(formData: FormData) {
  await assertAdmin();

  if (!hasSupabaseServiceConfig()) {
    redirect("/admin/usuarios/nuevo?error=missing-config");
  }

  try {
    const name = asText(formData, "name");
    const email = asText(formData, "email").toLowerCase();
    const role = toLabelRole(asText(formData, "role"));
    const organization = asOptionalText(formData, "organization");
    const password = asText(formData, "password");
    const active = asBoolean(formData, "active");
    const mustChangePassword = asBoolean(formData, "must_change_password");

    if (!name || !email || !password) {
      throw new Error("Nombre, correo y contraseña son obligatorios.");
    }
    if (password.length < 8) {
      throw new Error("La contraseña debe tener al menos 8 caracteres.");
    }

    const supabase = createSupabaseService();
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        must_change_password: mustChangePassword,
      },
    });

    if (createError || !created.user?.id) {
      throw new Error(`No se pudo crear el usuario de autenticación: ${createError?.message ?? "create failed"}`);
    }

    const { error: profileError } = await supabase.from("users").upsert({
      id: created.user.id,
      email,
      role: toDbRole(role),
      organization,
      active,
    });

    if (profileError) {
      // Roll back auth user to avoid orphaned account.
      await supabase.auth.admin.deleteUser(created.user.id);
      throw new Error(`No se pudo crear el perfil del usuario: ${profileError.message}`);
    }

    await logAdminActivity({
      kind: "user_created",
      title: `${name} — cuenta creada`,
      section: "Usuarios",
      entityType: "user",
      entityId: created.user.id,
    });

    revalidatePath("/admin");
    revalidatePath("/admin/usuarios");
    revalidatePath("/admin/usuarios/nuevo");
    redirect("/admin/usuarios?notice=created");
  } catch (error) {
    rethrowIfRedirectError(error);
    const message = error instanceof Error ? error.message : "No se pudo crear el usuario.";
    redirect(`/admin/usuarios/nuevo?error=${encodeURIComponent(message)}`);
  }
}

export async function updateUserAction(id: string, formData: FormData) {
  await assertAdmin();

  if (!hasSupabaseServiceConfig()) {
    redirect(`/admin/usuarios/${id}/editar?error=missing-config`);
  }

  try {
    const name = asText(formData, "name");
    const email = asText(formData, "email").toLowerCase();
    const role = toLabelRole(asText(formData, "role"));
    const organization = asOptionalText(formData, "organization");
    const active = asBoolean(formData, "active");
    const mustChangePassword = asBoolean(formData, "must_change_password");
    const newPassword = asText(formData, "new_password");
    const sessionUserId = await getSessionUserId();

    if (!name || !email) {
      throw new Error("Nombre y correo son obligatorios.");
    }
    if (newPassword && newPassword.length < 8) {
      throw new Error("La nueva contraseña debe tener al menos 8 caracteres.");
    }

    const supabase = createSupabaseService();
    const { data: current } = await supabase.from("users").select("email, role, active").eq("id", id).maybeSingle();
    await ensureNotLastActiveAdmin(supabase, id, toDbRole(role), active);

    if (sessionUserId === id && (!active || toDbRole(role) !== "admin")) {
      throw new Error("No puedes desactivarte ni quitarte el rol admin desde tu propia cuenta.");
    }

    const { error: authUpdateError } = await supabase.auth.admin.updateUserById(id, {
      email,
      ...(newPassword ? { password: newPassword } : {}),
      user_metadata: {
        name,
        must_change_password: mustChangePassword,
      },
    });

    if (authUpdateError) {
      throw new Error(`No se pudo actualizar credenciales del usuario: ${authUpdateError.message}`);
    }

    const { error: profileError } = await supabase
      .from("users")
      .update({
        email,
        role: toDbRole(role),
        organization,
        active,
      })
      .eq("id", id);

    if (profileError) {
      throw new Error(`No se pudo actualizar perfil del usuario: ${profileError.message}`);
    }

    const subjectName = name || displayNameFromEmail(current?.email ?? email);
    if (newPassword) {
      await logAdminActivity({
        kind: "password_reset",
        title: `${subjectName} — contraseña restablecida`,
        section: "Usuarios",
        entityType: "user",
        entityId: id,
      });
    }
    if (current?.active === true && !active) {
      await logAdminActivity({
        kind: "user_deactivated",
        title: `${subjectName} — cuenta desactivada`,
        section: "Usuarios",
        entityType: "user",
        entityId: id,
      });
    }
    if (current?.role && current.role !== toDbRole(role)) {
      await logAdminActivity({
        kind: "user_role_changed",
        title: `${subjectName} — rol actualizado a ${role}`,
        section: "Usuarios",
        entityType: "user",
        entityId: id,
      });
    }

    revalidatePath("/admin");
    revalidatePath("/admin/usuarios");
    revalidatePath(`/admin/usuarios/${id}/editar`);
    redirect(`/admin/usuarios/${id}/editar?notice=saved`);
  } catch (error) {
    rethrowIfRedirectError(error);
    const message = error instanceof Error ? error.message : "No se pudo actualizar el usuario.";
    redirect(`/admin/usuarios/${id}/editar?error=${encodeURIComponent(message)}`);
  }
}

export async function deleteUserAction(id: string) {
  await assertAdmin();

  if (!hasSupabaseServiceConfig()) {
    redirect("/admin/usuarios?error=missing-config");
  }

  try {
    const sessionUserId = await getSessionUserId();

    if (!id) {
      throw new Error("ID de usuario inválido.");
    }

    if (sessionUserId === id) {
      throw new Error("No puedes eliminar tu propia cuenta.");
    }

    const supabase = createSupabaseService();
    const { data: current } = await supabase.from("users").select("email").eq("id", id).maybeSingle();
    await ensureNotLastActiveAdmin(supabase, id, "internal", false);

    const { error: deleteError } = await supabase.auth.admin.deleteUser(id);
    if (deleteError) {
      throw new Error(`No se pudo eliminar el usuario: ${deleteError.message}`);
    }

    const deletedName = displayNameFromEmail(current?.email ?? "usuario");
    await logAdminActivity({
      kind: "user_deactivated",
      title: `${deletedName} — cuenta eliminada`,
      section: "Usuarios",
      entityType: "user",
      entityId: id,
    });

    revalidatePath("/admin");
    revalidatePath("/admin/usuarios");
    redirect("/admin/usuarios?notice=deleted");
  } catch (error) {
    rethrowIfRedirectError(error);
    const message = error instanceof Error ? error.message : "No se pudo eliminar el usuario.";
    redirect(`/admin/usuarios?error=${encodeURIComponent(message)}`);
  }
}
