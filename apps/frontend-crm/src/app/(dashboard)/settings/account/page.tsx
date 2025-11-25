"use client";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import { BasicInfoForm } from "./basic-info-form";
import { SocialProfilesForm } from "./social-profiles-form";
import { ChangePasswordForm } from "@/app/(auth)/_forms/change-password-form";
import { SessionsList } from "./sessions-list";
import { Separator } from "@workspace/ui/components/separator";

import { authClient } from "@/lib/auth-client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import { toast } from "sonner";
import DashboardLayout from "@/components/dashboard/dashboard-layout";

import { ProfileForm } from "./profile-form";
import ProfileSection from "./_sections/profile-section";
import SocialSection from "./_sections/social-section";
import SecuritySection from "./_sections/security-section";
import SessionsSection from "./_sections/sessions-section";
import DangerSection from "./_sections/danger-section";

export default function AccountPage() {
  return (
    <DashboardLayout>
      <DashboardLayout.Body>
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
      </DashboardLayout.Body>
    </DashboardLayout>
  );
}
