"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import type { ViewerRole } from "@/lib/mock-data";
import { resolveViewerRoleRecord } from "@/lib/auth/permissions";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { hasSupabasePublicConfig } from "@/lib/config";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  viewerRole: ViewerRole;
  isActive: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  viewerRole: "public",
  isActive: false,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabaseConfigured = hasSupabasePublicConfig();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [viewerRole, setViewerRole] = useState<ViewerRole>("public");
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(supabaseConfigured);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    async function syncProfile(nextSession: Session | null) {
      if (!nextSession?.user) {
        if (isMounted) {
          setViewerRole("public");
          setIsActive(false);
        }
        return;
      }

      const supabase = createSupabaseBrowser();
      const { data } = await supabase
        .from("users")
        .select("role, active")
        .eq("id", nextSession.user.id)
        .maybeSingle();

      if (!isMounted) {
        return;
      }

      const role = resolveViewerRoleRecord(
        data as { role?: string | null; active?: boolean | null } | null,
      );
      setViewerRole(role);
      setIsActive(data?.active !== false);
    }

    if (!supabaseConfigured) {
      return () => {
        isMounted = false;
      };
    }

    const supabase = createSupabaseBrowser();

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) {
        return;
      }

      setSession(session);
      setUser(session?.user ?? null);
      await syncProfile(session);
      if (isMounted) {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      void syncProfile(session);
      
      if (_event === "SIGNED_OUT") {
        setViewerRole("public");
        setIsActive(false);
        router.refresh();
        router.push("/");
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router, supabaseConfigured]);

  const signOut = async () => {
    if (!hasSupabasePublicConfig()) return;
    const supabase = createSupabaseBrowser();

    localStorage.removeItem("user_recent_activity");
    localStorage.removeItem("user_preferences");
    localStorage.removeItem("palenke-biblioteca-search-history-v3");
    
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, viewerRole, isActive, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
