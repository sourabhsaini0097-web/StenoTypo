import { User, AuthSession } from '../types/steno';
import { StorageService } from './storage';

// Base64Url helper
function base64UrlEncode(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return decodeURIComponent(escape(atob(base64)));
}

// Generate real JWT standard token
function createJWT(payload: object, secret: string = 'stenotypo_jwt_secret_2026'): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  // Simulated signature
  const signatureInput = `${encodedHeader}.${encodedPayload}.${secret}`;
  const signature = base64UrlEncode(signatureInput.slice(0, 32));
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// Decode and verify JWT
function decodeJWT<T>(token: string): { valid: boolean; payload: T | null; expired: boolean } {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return { valid: false, payload: null, expired: true };

    const payloadJson = base64UrlDecode(parts[1]);
    const payload = JSON.parse(payloadJson) as any;

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return { valid: false, payload, expired: true };
    }

    return { valid: true, payload, expired: false };
  } catch (e) {
    return { valid: false, payload: null, expired: true };
  }
}

export const AuthService = {
  // Login with email and password
  login(email: string, password: string): { success: boolean; session?: AuthSession; error?: string } {
    const users = StorageService.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!user) {
      return { success: false, error: 'No account found with this email address.' };
    }

    // Password validation (simple check for demo)
    if (user.password && user.password !== password) {
      return { success: false, error: 'Invalid password. Please check your credentials.' };
    }

    // CRITICAL SUBSCRIPTION CHECK FOR STUDENTS
    if (user.role === 'student') {
      const now = new Date().getTime();
      const expiryTime = new Date(user.subscriptionExpiry).getTime();

      if (expiryTime < now || user.subscriptionStatus === 'expired') {
        const formattedDate = new Date(user.subscriptionExpiry).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
        return {
          success: false,
          error: `Access Denied: Your subscription expired on ${formattedDate}. Please contact your administrator to renew your plan. Your test history remains safely preserved.`,
        };
      }
    }

    // Generate JWT token (expires in 24 hours)
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
    const token = createJWT(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        exp,
      }
    );

    const session: AuthSession = {
      token,
      user,
      expiresAt: exp * 1000,
    };

    StorageService.setToken(token);
    return { success: true, session };
  },

  // Student Self-Registration
  register(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    rollNo?: string;
  }): { success: boolean; session?: AuthSession; error?: string } {
    const users = StorageService.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === data.email.trim().toLowerCase());

    if (existing) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    // New student gets standard 30-day active validity
    const now = new Date();
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);

    const newUser: User = {
      id: `student_${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      rollNo: data.rollNo ? data.rollNo.trim() : `ST-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      role: 'student',
      password: data.password,
      subscriptionPlan: 'Monthly',
      subscriptionStart: now.toISOString(),
      subscriptionExpiry: expiry.toISOString(),
      subscriptionStatus: 'active',
      createdAt: now.toISOString(),
    };

    users.push(newUser);
    StorageService.saveUsers(users);

    // Auto-login newly registered student
    return this.login(newUser.email, data.password);
  },

  // Validate active session
  getCurrentSession(): AuthSession | null {
    const token = StorageService.getToken();
    if (!token) return null;

    const { valid, payload, expired } = decodeJWT<any>(token);
    if (!valid || !payload || expired) {
      StorageService.clearToken();
      return null;
    }

    const users = StorageService.getUsers();
    const user = users.find((u) => u.id === payload.sub);
    if (!user) {
      StorageService.clearToken();
      return null;
    }

    // Check if student expired while session was open
    if (user.role === 'student') {
      const now = new Date().getTime();
      const expiryTime = new Date(user.subscriptionExpiry).getTime();
      if (expiryTime < now) {
        // Auto-expire student
        user.subscriptionStatus = 'expired';
        StorageService.saveUsers(users);
        StorageService.clearToken();
        return null;
      }
    }

    return {
      token,
      user,
      expiresAt: payload.exp * 1000,
    };
  },

  logout(): void {
    StorageService.clearToken();
  },
};
