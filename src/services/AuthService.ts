import { User } from '../types';

export interface AuthServiceInterface {
  login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }>;
  register(name: string, email: string, phone: string, password: string): Promise<{ success: boolean; user?: User; error?: string }>;
  logout(): Promise<void>;
  forgotPassword(email: string): Promise<{ success: boolean; message: string }>;
  getCurrentUser(): User | null;
}

const USERS_KEY = 'someshwar_users';
const CURRENT_USER_KEY = 'someshwar_current_user';

export class MockAuthService implements AuthServiceInterface {
  private getUsers(): Array<User & { password: string }> {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveUsers(users: Array<User & { password: string }>): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    await new Promise(r => setTimeout(r, 800));
    const users = this.getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...user } = found;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, error: 'Invalid email or password' };
  }

  async register(name: string, email: string, phone: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    await new Promise(r => setTimeout(r, 800));
    const users = this.getUsers();
    if (users.some(u => u.email === email)) {
      return { success: false, error: 'An account with this email already exists' };
    }
    const newUser: User & { password: string } = {
      id: `user_${Date.now()}`,
      name,
      email,
      phone,
      password,
      addresses: [],
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    this.saveUsers(users);
    const { password: _, ...user } = newUser;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return { success: true, user };
  }

  async logout(): Promise<void> {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    await new Promise(r => setTimeout(r, 800));
    const users = this.getUsers();
    if (users.some(u => u.email === email)) {
      return { success: true, message: 'Password reset link has been sent to your email.' };
    }
    return { success: false, message: 'No account found with this email address.' };
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  }
}

export const authService: AuthServiceInterface = new MockAuthService();
