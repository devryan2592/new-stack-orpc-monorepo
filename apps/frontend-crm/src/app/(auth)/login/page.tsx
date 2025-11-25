import { LoginForm } from "@/app/(auth)/_forms";
import { Metadata, NextPage } from "next";
import { DASHBOARD_LINKS, AUTH_LINKS } from "@/lib/links";

interface LoginPageProps {
  // Add your page props here
}

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

const LoginPage: NextPage<LoginPageProps> = (props) => {
  return (
    <LoginForm
      dashboardUrl={DASHBOARD_LINKS.HOME}
      registerUrl={AUTH_LINKS.REGISTER}
      resetPasswordUrl={AUTH_LINKS.RESET_PASSWORD}
    />
  );
};

export default LoginPage;
