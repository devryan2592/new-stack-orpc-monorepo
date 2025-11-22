import type { MailService } from "./auth";

export const DefaultMailService: MailService = {
  async sendPasswordResetEmail({ user, url, token }) {
    console.log("sendPasswordResetEmail", { id: user?.id, email: user?.email, url, token });
  },
  async sendVerificationEmail({ user, url, token }) {
    console.log("sendVerificationEmail", { id: user?.id, email: user?.email, url, token });
  },
  async sendWelcomeEmail({ user }) {
    console.log("sendWelcomeEmail", { id: user?.id, email: user?.email });
  },
  async sendPasswordChangeConfirmation({ user }) {
    console.log("sendPasswordChangeConfirmation", { id: user?.id, email: user?.email });
  },
  async sendEmailVerificationConfirmation({ user }) {
    console.log("sendEmailVerificationConfirmation", { id: user?.id, email: user?.email });
  },
};