import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendOTP(email, otp) {
    const mailOptions = {
      from: `"SportHub Vietnam" <${process.env.MAIL_SENDER}>`,
      to: email,
      subject: "Mã xác thực OTP - SportHub Vietnam",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #2c3e50; text-align: center;">Xác thực tài khoản SportHub</h2>
          <p>Chào bạn,</p>
          <p>Mã OTP của bạn để hoàn tất đăng ký hoặc thiết lập lại mật khẩu là:</p>
          <div style="background-color: #f7f9fc; padding: 15px; text-align: center; border-radius: 5px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #3498db;">${otp}</span>
          </div>
          <p style="margin-top: 20px;">Mã này sẽ hết hạn sau <b>10 phút</b>. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
          <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;">
          <p style="font-size: 12px; color: #7f8c8d; text-align: center;">Đây là email tự động, vui lòng không phản hồi.</p>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email sent: %s", info.messageId);
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  }
}

export default new MailService();
