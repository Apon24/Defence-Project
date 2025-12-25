import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Gmail SMTP configuration using App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'paulapon2222@gmail.com',
    pass: process.env.EMAIL_APP_PASSWORD || 'aycv phsr xebr jipy'
  }
});

// Email templates
const emailTemplates = {
  accountCreated: (fullName) => ({
    subject: '🌿 Welcome to Eco Track Bangladesh!',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🌍 Eco Track Bangladesh</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #2e7d32; margin-top: 0;">Welcome, ${fullName}! 🎉</h2>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Your account has been successfully created! You're now part of our growing community of eco-conscious citizens working together for a greener Bangladesh.
          </p>
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #4caf50;">
            <h3 style="color: #2e7d32; margin-top: 0;">What you can do now:</h3>
            <ul style="color: #555; line-height: 1.8;">
              <li>🌱 Track your carbon footprint</li>
              <li>🎯 Complete daily eco challenges</li>
              <li>📚 Take environmental quizzes</li>
              <li>👥 Join our community discussions</li>
              <li>🌳 Participate in tree planting initiatives</li>
            </ul>
          </div>
          <p style="color: #666; font-size: 14px;">
            Together, we can make a difference! Start exploring the app and earn badges for your eco-friendly actions.
          </p>
        </div>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
          <p style="color: #888; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} Eco Track Bangladesh. All rights reserved.
          </p>
        </div>
      </div>
    `
  }),

  loginSuccess: (fullName, loginTime, deviceInfo = 'Unknown device') => ({
    subject: '🔐 Successful Login to Eco Track Bangladesh',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🌍 Eco Track Bangladesh</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #2e7d32; margin-top: 0;">Hello, ${fullName}! 👋</h2>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            We noticed a successful login to your Eco Track account.
          </p>
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="color: #333; margin-top: 0;">Login Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; border-bottom: 1px solid #eee;">📅 Time:</td>
                <td style="padding: 8px 0; color: #333; border-bottom: 1px solid #eee; text-align: right;">${loginTime}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">📱 Device:</td>
                <td style="padding: 8px 0; color: #333; text-align: right;">${deviceInfo}</td>
              </tr>
            </table>
          </div>
          <div style="background: #fff3e0; border-radius: 8px; padding: 15px; border-left: 4px solid #ff9800;">
            <p style="color: #e65100; margin: 0; font-size: 14px;">
              ⚠️ If this wasn't you, please change your password immediately and contact our support team.
            </p>
          </div>
        </div>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
          <p style="color: #888; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} Eco Track Bangladesh. All rights reserved.
          </p>
        </div>
      </div>
    `
  }),

  forgotPassword: (fullName, resetInfo) => ({
    subject: '🔑 Password Reset Request - Eco Track Bangladesh',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🌍 Eco Track Bangladesh</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #2e7d32; margin-top: 0;">Password Reset Request</h2>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Hello ${fullName},
          </p>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            We received a request to reset your password for your Eco Track Bangladesh account.
          </p>
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <p style="color: #666; margin-bottom: 20px;">
              ${resetInfo || 'Your password reset request has been received. Please follow the instructions sent to you.'}
            </p>
            <p style="color: #888; font-size: 14px;">
              This request was made on ${new Date().toLocaleString('en-US', { 
                dateStyle: 'full', 
                timeStyle: 'short' 
              })}
            </p>
          </div>
          <div style="background: #ffebee; border-radius: 8px; padding: 15px; border-left: 4px solid #f44336;">
            <p style="color: #c62828; margin: 0; font-size: 14px;">
              🔒 If you didn't request this password reset, please ignore this email. Your password will remain unchanged, and your account is secure.
            </p>
          </div>
        </div>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
          <p style="color: #888; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} Eco Track Bangladesh. All rights reserved.
          </p>
        </div>
      </div>
    `
  }),

  verificationEmail: (fullName, otpCode) => ({
    subject: '✨ Verify Your Email - Eco Track Bangladesh',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🌍 Eco Track Bangladesh</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #2e7d32; margin-top: 0;">Verify Your Email Address</h2>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Hello ${fullName},
          </p>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Thank you for joining Eco Track Bangladesh! Please use the following code to verify your email address:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="background: #e8f5e9; color: #2e7d32; padding: 15px 30px; border-radius: 12px; font-weight: bold; font-size: 32px; letter-spacing: 5px; display: inline-block; border: 2px dashed #4caf50;">
              ${otpCode}
            </div>
          </div>
          <div style="background: #fff3e0; border-radius: 8px; padding: 15px; margin-top: 25px; border-left: 4px solid #ff9800;">
            <p style="color: #e65100; margin: 0; font-size: 14px;">
              ⏳ This code will expire in 24 hours.
            </p>
          </div>
        </div>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
          <p style="color: #888; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} Eco Track Bangladesh. All rights reserved.
          </p>
        </div>
      </div>
    `
    `
  }),

  quizCompleted: (fullName, score, totalQuestions, badgeName = null) => ({
    subject: '🎯 Quiz Completed - Eco Track Bangladesh',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🌍 Eco Track Bangladesh</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #2e7d32; margin-top: 0;">Great Job, ${fullName}! 🌟</h2>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            You've successfully completed a quiz! Here are your results:
          </p>
          
          <div style="background: white; border-radius: 12px; padding: 25px; margin: 25px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
            <div style="font-size: 48px; font-weight: bold; color: #2e7d32; margin-bottom: 10px;">
              ${score}/${totalQuestions}
            </div>
            <p style="color: #666; margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Score</p>
          </div>

          ${badgeName ? `
          <div style="background: #e8f5e9; border-radius: 8px; padding: 15px; margin-top: 20px; border-left: 4px solid #4caf50;">
            <p style="color: #2e7d32; margin: 0; font-weight: bold;">
              🏆 You earned a new badge: ${badgeName}!
            </p>
          </div>
          ` : ''}
          
          <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
            Keep learning and challenging yourself to become an eco-expert!
          </p>
        </div>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
          <p style="color: #888; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} Eco Track Bangladesh. All rights reserved.
          </p>
        </div>
      </div>
    `
  }),

  badgeEarned: (fullName, badgeName, badgeDescription) => ({
    subject: '🏆 New Badge Unlocked! - Eco Track Bangladesh',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #ffd700 0%, #ffa000 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Congratulations!</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #333; margin-top: 0; text-align: center;">You've earned a new badge!</h2>
          
          <div style="background: white; border-radius: 12px; padding: 30px; margin: 25px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1); text-align: center;">
            <h3 style="color: #2e7d32; font-size: 24px; margin: 10px 0;">${badgeName}</h3>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              ${badgeDescription}
            </p>
          </div>

          <p style="color: #333; font-size: 16px; text-align: center;">
            Your dedication to the environment is inspiring, ${fullName}. Keep up the amazing work!
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" style="background: #2e7d32; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold;">
              View My Badges
            </a>
          </div>
        </div>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
          <p style="color: #888; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} Eco Track Bangladesh. All rights reserved.
          </p>
        </div>
      </div>
    `
  })
};

// Email sending functions
export const sendWelcomeEmail = async (email, fullName) => {
  try {
    const template = emailTemplates.accountCreated(fullName);
    
    const mailOptions = {
      from: `"Eco Track Bangladesh" <${process.env.EMAIL_USER || 'paulapon2222@gmail.com'}>`,
      to: email,
      subject: template.subject,
      html: template.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}:`, result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

export const sendLoginEmail = async (email, fullName, userAgent = 'Unknown device') => {
  try {
    const loginTime = new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short'
    });
    
    const template = emailTemplates.loginSuccess(fullName, loginTime, userAgent);
    
    const mailOptions = {
      from: `"Eco Track Bangladesh" <${process.env.EMAIL_USER || 'paulapon2222@gmail.com'}>`,
      to: email,
      subject: template.subject,
      html: template.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Login notification email sent to ${email}:`, result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending login email:', error);
    return { success: false, error: error.message };
  }
};

export const sendForgotPasswordEmail = async (email, fullName, resetInfo = null) => {
  try {
    const template = emailTemplates.forgotPassword(fullName, resetInfo);
    
    const mailOptions = {
      from: `"Eco Track Bangladesh" <${process.env.EMAIL_USER || 'paulapon2222@gmail.com'}>`,
      to: email,
      subject: template.subject,
      html: template.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}:`, result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

// Verify transporter connection
export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('Email service is ready to send messages');
    return true;
  } catch (error) {
    console.error('Email service connection failed:', error);
    return false;
  }
};

export const sendVerificationEmail = async (email, fullName, otpCode) => {
  try {
    const template = emailTemplates.verificationEmail(fullName, otpCode);
    
    const mailOptions = {
      from: `"Eco Track Bangladesh" <${process.env.EMAIL_USER || 'paulapon2222@gmail.com'}>`,
      to: email,
      subject: template.subject,
      html: template.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}:`, result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error: error.message };
  }
};

export const sendQuizCompletionEmail = async (email, fullName, score, totalQuestions, badgeName = null) => {
  try {
    const template = emailTemplates.quizCompleted(fullName, score, totalQuestions, badgeName);
    
    const mailOptions = {
      from: `"Eco Track Bangladesh" <${process.env.EMAIL_USER || 'paulapon2222@gmail.com'}>`,
      to: email,
      subject: template.subject,
      html: template.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Quiz completion email sent to ${email}:`, result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending quiz completion email:', error);
    return { success: false, error: error.message };
  }
};

export const sendBadgeEarnedEmail = async (email, fullName, badgeName, badgeDescription) => {
  try {
    const template = emailTemplates.badgeEarned(fullName, badgeName, badgeDescription);
    
    const mailOptions = {
      from: `"Eco Track Bangladesh" <${process.env.EMAIL_USER || 'paulapon2222@gmail.com'}>`,
      to: email,
      subject: template.subject,
      html: template.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Badge earned email sent to ${email}:`, result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending badge earned email:', error);
    return { success: false, error: error.message };
  }
};

export default {
  sendWelcomeEmail,
  sendLoginEmail,
  sendForgotPasswordEmail,
  sendVerificationEmail,
  sendQuizCompletionEmail,
  sendBadgeEarnedEmail,
  verifyEmailConnection
};
