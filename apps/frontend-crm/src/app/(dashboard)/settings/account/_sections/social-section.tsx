import { FC } from "react";
import SocialProfileForm from "../_forms/social-profile-form";

interface SocialSectionProps {
  // Add your props here
  children?: React.ReactNode;
}

const SocialSection: FC<SocialSectionProps> = ({ children }) => {
  return (
    <section className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <div>
        <h3 className="text-lg font-medium">Social Profile</h3>
        <p className="text-sm text-muted-foreground">
          Manage your social profile.
        </p>
      </div>
      <SocialProfileForm />
    </section>
  );
};

export default SocialSection;
