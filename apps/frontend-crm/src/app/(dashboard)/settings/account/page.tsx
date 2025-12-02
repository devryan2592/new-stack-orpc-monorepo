import { Separator } from "@workspace/ui/components/separator";

import ProfileSection from "./_sections/profile-section";
import SocialSection from "./_sections/social-section";
import SecuritySection from "./_sections/security-section";
import SessionsSection from "./_sections/sessions-section";
import DangerSection from "./_sections/danger-section";
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";

export default async function AccountPage() {
  return (
    <>
      <DashboardPageHeader
        title="Account Settings"
        description="Manage your account settings and preferences."
      />

      <div className="space-y-8">
        <ProfileSection />
        <Separator />
        <SocialSection />
        <Separator />
        <SecuritySection />
        <Separator />
        <SessionsSection />
        <Separator />
        <DangerSection />
      </div>
    </>
  );
}
