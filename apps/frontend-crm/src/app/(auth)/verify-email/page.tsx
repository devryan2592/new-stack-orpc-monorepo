import { Metadata, NextPage } from "next";
import { AUTH_LINKS } from "@/lib/links";
import { VerifyEmailForm } from "@workspace/feature-auth/frontend/forms";

interface VerifyEmailPageProps {}

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address to complete registration",
};

const VerifyEmailPage: NextPage<VerifyEmailPageProps> = (props) => {
  return <VerifyEmailForm loginUrl={AUTH_LINKS.LOGIN} />;
};

export default VerifyEmailPage;
