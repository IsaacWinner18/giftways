const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface RegisterData {
  name: string;
  email: string;
  password: string;
  socialLinks?: Record<string, string>;
  fingerprint?: string;
}

interface UpdateProfileData {
  name?: string;
  email?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  phoneNumber?: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  token?: string;
  resetToken?: string;
  user?: {
    id: string;
    _id?: string;
    name: string;
    email: string;
    avatar?: string;
    isVerified?: boolean;
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
    phoneNumber?: string;
    isAdmin?: boolean;
    participatedCampaigns?: string[];
    balance?: number; // Added balance field
    campaignsCreatedCount?: number; // Added campaignsCreatedCount field
  };
}

// JWT helpers
const TOKEN_KEY = "jwt_token";
export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
}
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function login(
  email: string,
  password: string,
  fingerprint?: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      fingerprint ? { email, password, fingerprint } : { email, password }
    ),
  });
  return res.json();
}

export async function getProfile(): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/users/profile`, {
    headers: { ...authHeaders() },
  });
  return res.json();
}

export async function updateProfile(
  data: UpdateProfileData
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/users/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function changePassword(
  oldPassword: string,
  newPassword: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/users/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ oldPassword, newPassword }),
  });
  return res.json();
}

export async function forgotPassword(email: string): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/users/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
}

export async function resetPasswordWithToken(
  token: string,
  newPassword: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/users/reset-password/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newPassword }),
  });
  return res.json();
}

export function logout() {
  removeToken();
}
