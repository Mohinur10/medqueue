/* eslint-disable @typescript-eslint/no-namespace */
import { Role, Gender } from './prisma-enums';;

export interface JwtPayload {
  userId: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export interface RegisterInput {
  phone: string;
  password?: string;
}

export interface LoginInput {
  phone: string;
  password?: string;
}

export interface VerifyOtpInput {
  phone: string;
  otp: string;
  type: 'LOGIN' | 'REGISTER';
}

export interface ResetPasswordInput {
  phone?: string;
  token?: string;
  newPassword?: string;
}

export interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  passport?: string;
  birthday?: string;
  gender?: string;
  address?: string;
  avatar?: string;
}
