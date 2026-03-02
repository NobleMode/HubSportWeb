import authService from "../services/authService.js";
import mailService from "../services/mailService.js";

/**
 * Auth Controller
 * Handles authentication HTTP requests
 */
class AuthController {
  /**
   * Register new user
   * POST /api/auth/register
   */
  async register(req, res, next) {
    try {
      const { email, password, role, name } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

      const user = await authService.register({
        email,
        password,
        role: role || "CUSTOMER",
        name,
        otpCode: otp,
        otpExpires,
        isVerified: false,
      });

      // Send OTP via Email
      await mailService.sendOTP(email, otp);

      res.status(201).json({
        success: true,
        message:
          "Registration successful. Please check your email for OTP code.",
        data: { email: user.email },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify OTP
   * POST /api/auth/verify-otp
   */
  async verifyOtp(req, res, next) {
    try {
      const { email, otp } = req.body;
      const { user, accessToken, refreshToken } = await authService.verifyOtp(
        email,
        otp,
      );

      this.setTokenCookie(res, refreshToken);

      res.status(200).json({
        success: true,
        message: "OTP verified successfully",
        data: { user, token: accessToken },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Resend OTP
   * POST /api/auth/resend-otp
   */
  async resendOtp(req, res, next) {
    try {
      const { email } = req.body;
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

      await authService.updateOtp(email, otp, otpExpires);
      await mailService.sendOTP(email, otp);

      res.status(200).json({
        success: true,
        message: "OTP resent successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Forgot Password
   * POST /api/auth/forgot-password
   */
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

      await authService.updateOtp(email, otp, otpExpires);
      await mailService.sendOTP(email, otp);

      res.status(200).json({
        success: true,
        message: "Reset OTP sent to your email",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reset Password
   * POST /api/auth/reset-password
   */
  async resetPassword(req, res, next) {
    try {
      const { email, otp, newPassword } = req.body;
      await authService.resetPassword(email, otp, newPassword);

      res.status(200).json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      // Password is sent as HMAC hash from FE
      const { user, accessToken, refreshToken } = await authService.login(
        email,
        password,
      );

      // Set Refresh Token Cookie
      this.setTokenCookie(res, refreshToken);

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: { user, token: accessToken },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh Access Token
   * POST /api/auth/refresh-token
   */
  async refreshToken(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: "No refresh token provided",
        });
      }

      const {
        accessToken,
        refreshToken: newRefreshToken,
        user,
      } = await authService.refreshToken(refreshToken);

      // Set New Refresh Token Cookie
      this.setTokenCookie(res, newRefreshToken);

      res.status(200).json({
        success: true,
        data: { token: accessToken, user },
      });
    } catch (error) {
      // Clear cookie if refresh fails
      res.clearCookie("refreshToken");
      res.status(401).json({
        success: false,
        message: error.message || "Invalid refresh token",
      });
    }
  }

  /**
   * Logout user
   * POST /api/auth/logout
   */
  async logout(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) {
        await authService.logout(refreshToken);
      }

      Object.keys(req.cookies).forEach((cookieName) => {
        res.clearCookie(cookieName);
      });

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Helper to set Token Cookie
   */
  setTokenCookie(res, token) {
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction, // HTTPS required in Prod
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      sameSite: isProduction ? "none" : "lax", // 'none' allows cross-domain in Prod, 'lax' is better for localhost
    };

    res.cookie("refreshToken", token, cookieOptions);
  }

  /**
   * Get current user profile
   * GET /api/auth/profile
   */
  async getProfile(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.id);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user profile
   * PUT /api/auth/profile
   */
  async updateProfile(req, res, next) {
    try {
      const { name, phone, address } = req.body;
      const user = await authService.updateProfile(req.user.id, {
        name,
        phone,
        address,
      });

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
