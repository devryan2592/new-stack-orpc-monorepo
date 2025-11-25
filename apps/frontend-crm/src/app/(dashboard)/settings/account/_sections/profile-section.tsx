import { FC } from "react";
import ProfileForm from "../_forms/profile-form";
import BasicDetailsForm from "../_forms/basic-details-form";

interface ProfileSectionProps {
  // Add your props here
  children?: React.ReactNode;
}

const ProfileSection: FC<ProfileSectionProps> = ({ children }) => {
  return (
    <section className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <div>
        <ProfileForm />
      </div>
      <div>
        <BasicDetailsForm />
      </div>
    </section>
  );
};

export default ProfileSection;
