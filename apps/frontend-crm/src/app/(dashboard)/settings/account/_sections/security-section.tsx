import { FC } from "react";
import ChangePasswordForm from "../_forms/change-password-form";

interface SecuritySectionProps {
  // Add your props here
  children?: React.ReactNode;
}

const SecuritySection: FC<SecuritySectionProps> = ({ children }) => {
  return (
    <section className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <div>
        <h3 className="text-lg font-medium">Security</h3>
        <p className="text-sm text-muted-foreground">
          Manage your security settings.
        </p>
      </div>
      <ChangePasswordForm />
    </section>
  );
};

export default SecuritySection;
