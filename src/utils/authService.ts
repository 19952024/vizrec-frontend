import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

function hashPassword(password: string): string {
  return crypto.pbkdf2Sync(password, 'vizrec-salt', 10000, 64, 'sha512').toString('hex');
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

function createToken(userId: string, email: string): string {
  const payload = { sub: userId, email, exp: Math.floor(Date.now() / 1000) + 604800 };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

class AuthService {
  private users: User[] = [];
  private readonly filePath: string;

  constructor() {
    this.filePath = path.join(process.cwd(), 'data', 'users.json');
    this.load();
  }

  private load(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, 'utf8');
        this.users = JSON.parse(data);
      } else {
        this.users = [];
      }
    } catch {
      this.users = [];
    }
  }

  private save(): void {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.filePath, JSON.stringify(this.users, null, 2));
    } catch (err) {
      console.error('Error saving users:', err);
    }
  }

  async register(name: string, email: string, password: string): Promise<{ user: { id: string; name: string; email: string }; token: string }> {
    this.load();
    const emailLower = email.toLowerCase().trim();
    if (this.users.some(u => u.email === emailLower)) {
      throw new Error('Email already registered');
    }
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    const user: User = {
      id,
      name: name.trim(),
      email: emailLower,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString()
    };
    this.users.push(user);
    this.save();
    return {
      user: { id: user.id, name: user.name, email: user.email },
      token: createToken(user.id, user.email)
    };
  }

  async login(email: string, password: string): Promise<{ user: { id: string; name: string; email: string }; token: string }> {
    this.load();
    const emailLower = email.toLowerCase().trim();
    const user = this.users.find(u => u.email === emailLower);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      throw new Error('Invalid email or password');
    }
    return {
      user: { id: user.id, name: user.name, email: user.email },
      token: createToken(user.id, user.email)
    };
  }
}

export const authService = new AuthService();
