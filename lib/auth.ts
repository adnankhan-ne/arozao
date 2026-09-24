export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "customer" | "seller" | "admin";
};

const SESSION_KEY = "arozao-session";
const USERS_KEY = "arozao-users";
const DEMO_PASSWORD = "demo-password";

function readUsers(): Array<{ id: string; name: string; email: string; passwordHash: string; role: SessionUser["role"] }> {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(USERS_KEY);
    if (!stored) {
      const seeded = [{
        id: "demo-customer",
        name: "Demo Customer",
        email: "demo@arozao.com",
        passwordHash: DEMO_PASSWORD,
        role: "customer" as const,
      }];
      localStorage.setItem(USERS_KEY, JSON.stringify(seeded));
      return seeded;
    }

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getSessionUser(): SessionUser | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && typeof parsed.email === "string" ? parsed : null;
  } catch {
    return null;
  }
}

export function setSessionUser(user: SessionUser | null) {
  if (typeof window === "undefined") return;
  if (!user) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function loginUser(email: string, password: string): SessionUser | null {
  if (typeof window === "undefined") return null;

  const users = readUsers();
  const user = users.find((entry) => entry.email.toLowerCase() === email.trim().toLowerCase());
  if (!user || user.passwordHash !== password) return null;

  const normalizedUser = { id: user.id, name: user.name, email: user.email, role: user.role };
  setSessionUser(normalizedUser);
  return normalizedUser;
}

export function registerUser(input: { name: string; email: string; password: string; role?: SessionUser["role"] }) {
  if (typeof window === "undefined") return null;

  const users = readUsers();
  if (users.some((entry) => entry.email.toLowerCase() === input.email.trim().toLowerCase())) {
    return null;
  }

  const newUser = {
    id: `user-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    name: input.name.trim(),
    email: input.email.trim(),
    passwordHash: input.password,
    role: input.role || "customer",
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
  setSessionUser(sessionUser);
  return sessionUser;
}

export function logoutUser() {
  setSessionUser(null);
}

export function getDemoLoginLink() {
  return { email: "demo@arozao.com", password: "demo-password" };
}
