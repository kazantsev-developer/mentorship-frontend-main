import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/components/api";

export interface AuthUser {
  id: string;
  login: string;
  display_name: string;
  roles: string[];
  avatar_url?: string;
  telegram_username?: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api
      .get<AuthUser>("/api/user/profile")
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (login: string, password: string) => {
    const data = await api.post<{
      token: string;
      user: AuthUser;
      roles?: string[];
    }>("/api/auth/login", { login, password });
    const userData = data.user;
    const rolesArray = data.roles || (userData as any).roles || [];
    const fullUser: AuthUser = {
      id: userData.id,
      login: userData.login,
      display_name: userData.display_name,
      roles: rolesArray,
      avatar_url: userData.avatar_url,
      telegram_username: userData.telegram_username,
    };
    document.cookie = `token=${data.token}; path=/; max-age=604800`;
    setUser(fullUser);
    return fullUser;
  };

  const logout = async () => {
    document.cookie = "token=; path=/; max-age=0";
    setUser(null);
    router.push("/login");
  };

  const selectRole = (role: string) => {
    if (typeof window !== "undefined")
      localStorage.setItem("selectedRole", role);
  };
  const getSelectedRole = () => {
    if (typeof window !== "undefined")
      return localStorage.getItem("selectedRole");
    return null;
  };

  return { user, loading, login, logout, selectRole, getSelectedRole };
}
