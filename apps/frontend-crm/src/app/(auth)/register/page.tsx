import { RegisterForm } from "@/app/(auth)/_forms";
import { Metadata, NextPage } from "next";
import { AUTH_LINKS } from "@/lib/links";

interface RegisterPageProps {}

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your account to get started",
};

const RegisterPage: NextPage<RegisterPageProps> = (props) => {
  return <RegisterForm loginUrl={AUTH_LINKS.LOGIN} />;
};

export default RegisterPage;
