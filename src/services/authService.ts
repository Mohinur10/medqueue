/**
 * AuthService
 * 
 * Centralized service layer for Authentication and Telegram OTP verification.
 * Currently simulates API calls. When the real backend is ready, replace 
 * these implementations with actual fetch/axios calls.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  role?: string;
  user?: any;
}

export interface OTPRequestResponse {
  success: boolean;
  message: string;
  telegramSent: boolean;
}

export class AuthService {
  static async requestTelegramOTP(phone: string, role: string): Promise<OTPRequestResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phone }) // Note: You can also pass password if required by backend
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        return { success: false, message: data.message || data.error || 'Failed to request OTP', telegramSent: false };
      }
      return {
        success: true,
        message: data.message || "Tasdiqlash kodi Telegram botingizga yuborildi.",
        telegramSent: true
      };
    } catch (error: any) {
      return { success: false, message: error.message || 'Network error', telegramSent: false };
    }
  }

  static async verifyOTP(phone: string, code: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phone, otp: code })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        return { success: false, message: data.message || data.error || 'Xato tasdiqlash kodi.' };
      }
      return {
        success: true,
        message: data.message || "Tizimga muvaffaqiyatli kirdingiz.",
        token: data.data.tokens.accessToken,
        role: data.data.user.role,
        user: data.data.user
      };
    } catch (error: any) {
      return { success: false, message: error.message || 'Network error' };
    }
  }

  static async registerPatient(payload: any): Promise<OTPRequestResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        return { success: false, message: data.message || data.error || 'Failed to register', telegramSent: false };
      }
      return {
        success: true,
        message: data.message || "Hisob yaratildi. Tasdiqlash kodi Telegram botingizga yuborildi.",
        telegramSent: true
      };
    } catch (error: any) {
      return { success: false, message: error.message || 'Network error', telegramSent: false };
    }
  }
}
