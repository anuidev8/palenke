export const VISUAL_CONTENT_ADMIN_EMAIL = "angelarrieta34@gmail.com";

const HIDDEN_ADMIN_NAV_IDS = new Set(["accs", "campanas"]);

export function normalizeAdminEmail(email: string | null | undefined) {
  return (email ?? "").trim().toLowerCase();
}

export function canAccessVisualContentAdmin(email: string | null | undefined) {
  return normalizeAdminEmail(email) === VISUAL_CONTENT_ADMIN_EMAIL;
}

export function isAdminNavItemVisible(
  navId: string,
  email: string | null | undefined,
) {
  if (HIDDEN_ADMIN_NAV_IDS.has(navId)) {
    return false;
  }

  if (navId === "contenido-visual") {
    return canAccessVisualContentAdmin(email);
  }

  return true;
}

export function getVisibleAdminNavItems<T extends { id: string }>(
  items: readonly T[],
  email: string | null | undefined,
) {
  return items.filter((item) => isAdminNavItemVisible(item.id, email));
}
