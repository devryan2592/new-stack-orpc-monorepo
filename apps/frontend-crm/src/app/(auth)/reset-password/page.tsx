import { ResetPasswordRequestForm } from "@/forms/auth-forms";
import { Metadata, NextPage } from "next";
import { AUTH_LINKS } from "@/lib/links";

interface ResetPasswordPageProps {}

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Request a password reset link for your account",
};

const ResetPasswordPage: NextPage<ResetPasswordPageProps> = (props) => {
  return (
    <ResetPasswordRequestForm
      updatePasswordUrl={AUTH_LINKS.UPDATE_PASSWORD}
      loginUrl={AUTH_LINKS.LOGIN}
    />
  );
};

export default ResetPasswordPage;
