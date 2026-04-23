import { api, MOCK_MODE } from "@/lib/api";
import type { Role, User } from "@/store/auth";

export async function loginRequest(email: string, password: string) {
  if (MOCK_MODE) {
    await new Promise((r) => setTimeout(r, 400));
    const role: Role = email.includes("recruiter") ? "recruiter" : "employee";
    return {
      user: { id: "u_" + email, name: email.split("@")[0], email, role } as User,
      token: "mock.jwt." + btoa(email),
    };
  }
  const { data } = await api.post("/api/auth/login", { email, password });
  return data as { user: User; token: string };
}

export async function registerRequest(
  name: string,
  email: string,
  password: string,
  role: Role
) {
  if (MOCK_MODE) {
    await new Promise((r) => setTimeout(r, 400));
    return {
      user: { id: "u_" + email, name, email, role } as User,
      token: "mock.jwt." + btoa(email),
    };
  }
  const { data } = await api.post("/api/auth/register", { name, email, password, role });
  return data as { user: User; token: string };
}
