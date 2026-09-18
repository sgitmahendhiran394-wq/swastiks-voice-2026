import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Employee = {
  id: string;
  name: string;
  firstName: string;
  email: string;
  employeeId: string | null;
  department: string | null;
  avatarUrl: string | null;
};

export function employeeFromUser(user: User): Employee {
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const email = user.email ?? String(meta["email"] ?? "");
  const name =
    String(meta["full_name"] ?? meta["name"] ?? "").trim() ||
    email.split("@")[0]?.replace(/[._-]+/g, " ") ||
    "Engineer";
  const firstName = name.split(/\s+/)[0] ?? name;
  return {
    id: user.id,
    name,
    firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
    email,
    employeeId: (meta["employee_id"] as string | undefined) ?? null,
    department: (meta["department"] as string | undefined) ?? null,
    avatarUrl: (meta["avatar_url"] as string | undefined) ?? (meta["picture"] as string | undefined) ?? null,
  };
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const { data } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!mounted) return;
      setSession(s);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!mounted) return;
      setSession(s);
      setLoading(false);
    });
    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const user = session?.user ?? null;
  return {
    session,
    user,
    employee: user ? employeeFromUser(user) : null,
    loading,
    isAuthenticated: !!user,
  };
}
