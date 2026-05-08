export const getWelcomeEmailTemplate = (name: string) => `
  <p>Hi ${name},</p>
  <p>We are thrilled to have you on board. Your content workspace is ready.</p>
  <p>Log in to set up your brand profile and start generating high-quality content.</p>
`;

export const getVerificationEmailTemplate = (name: string, url: string) => `
  <p>Hi ${name},</p>
  <p>Welcome to ContentEngine! Please verify your email address by clicking the link below:</p>
  <p><a href="${url}">Verify Email</a></p>
`;

export const getPasswordResetEmailTemplate = (name: string, url: string) => `
  <p>Hi ${name},</p>
  <p>You requested a password reset. Click the link below to set a new password:</p>
  <p><a href="${url}">Reset Password</a></p>
  <p>If you didn't request this, you can safely ignore this email.</p>
`;
