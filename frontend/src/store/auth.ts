import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "employee" | "recruiter";
export type User = { id: string; name: string; email: string; role: Role };

type AuthState = {
  user: User | null;
  token: string | null;
  cvSkills: string[];
  cvFileName: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  setCv: (fileName: string, skills: string[]) => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      cvSkills: [],
      cvFileName: null,
      login: (user, token) => {
        localStorage.setItem("tt_token", token);
        set({ user, token });
      },
      logout: () => {
        localStorage.removeItem("tt_token");
        set({ user: null, token: null, cvSkills: [], cvFileName: null });
      },
      setCv: (cvFileName, cvSkills) => set({ cvFileName, cvSkills }),
    }),
    { name: "tanittalent-auth" }
  )
);
