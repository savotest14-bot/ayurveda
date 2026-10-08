import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';
import { ENV } from '../config/env.js';
import { ApiError } from '../utils/apiResponse.js';
import { Role } from '@prisma/client';

export class AuthService {
  static async register(data: { name: string; email: string; phone?: string; password: string }) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() }
    });

    if (existing) {
      throw new ApiError(400, 'An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        passwordHash,
        role: Role.CUSTOMER,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true
      }
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { user, token };
  }

  static async login(data: { email: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() }
    });

    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'This account has been deactivated. Please contact support.');
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt
      },
      token
    };
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw new ApiError(404, 'User profile not found');
    }

    return user;
  }

  static async updateProfile(userId: string, data: { name?: string; phone?: string }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        updatedAt: true
      }
    });

    return user;
  }

  static async changePassword(userId: string, data: { currentPassword: string; newPassword: string }) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const isMatch = await bcrypt.compare(data.currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new ApiError(400, 'Current password is incorrect');
    }

    const newHash = await bcrypt.hash(data.newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash }
    });

    return { message: 'Password updated successfully' };
  }
}
