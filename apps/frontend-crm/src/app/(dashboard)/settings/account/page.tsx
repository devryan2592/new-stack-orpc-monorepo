"use client";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import { BasicInfoForm } from "./basic-info-form";
import { SocialProfilesForm } from "./social-profiles-form";
import { ChangePasswordForm } from "@/forms/auth-forms/change-password-form";
import { SessionsList } from "./sessions-list";
import { Separator } from "@workspace/ui/components/separator";
import { Button } from "@workspace/ui/components/button";
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

export default function AccountPage() {
  return (
    <DashboardLayout>
      <DashboardLayout.Body>
        <DashboardPageHeader
          title="Account Settings"
          description="Manage your account settings and preferences."
        />

        <div className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            {/* Profile Form (Avatar) - keeping original ProfileForm for avatar if needed, or we should extract avatar part? 
                    User said "split the basic information form and social profiles form".
                    The original ProfileForm had Avatar + Basic Info + Social.
                    I should probably keep ProfileForm for Avatar only? Or just use ProfileForm for the left column?
                    Actually, let's look at the user's request: "split the basic information form and social profiles form".
                    And "make the sorcial profiles form similar to the secturity form".
                    The Avatar part was in the left column.
                    I will keep ProfileForm as the container or just use the left column part of it.
                    Let's assume the user wants the layout:
                    Left: Avatar
                    Right: Basic Info Form, Social Profiles Form
                */}
            <div className="space-y-6">
              <ProfileForm />
            </div>

            <div className="space-y-6">
              <BasicInfoForm />
              <SocialProfilesForm />
            </div>
          </div>

          <Separator />

          <section className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <div>
              <h3 className="text-lg font-medium">Security</h3>
              <p className="text-sm text-muted-foreground">
                Manage your password and security settings.
              </p>
            </div>
            <ChangePasswordForm />
          </section>

          <Separator />

          <section className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <div>
              <h3 className="text-lg font-medium">Sessions</h3>
              <p className="text-sm text-muted-foreground">
                Manage your active sessions and devices.
              </p>
            </div>
            <div className="space-y-6">
              <SessionsList />
            </div>
          </section>

          <Separator />

          <section className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <div>
              <h3 className="text-lg font-medium text-destructive">
                Danger Zone
              </h3>
              <p className="text-sm text-muted-foreground">
                Irreversible actions for your account.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg ">
                <div>
                  <h4 className="font-medium text-destructive">Sign Out</h4>
                  <p className="text-sm text-muted-foreground">
                    Sign out of your active session.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => authClient.signOut()}
                >
                  Sign Out
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <div>
                  <h4 className="font-medium text-destructive">
                    Delete Account
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data.
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete Account</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={async () => {
                          await authClient.deleteUser();
                          toast.success("Account deleted successfully");
                        }}
                      >
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </section>
        </div>
      </DashboardLayout.Body>
    </DashboardLayout>
  );
}
