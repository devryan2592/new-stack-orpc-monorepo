"use client";
import { FC } from "react";
import { AppButton } from "@workspace/ui/custom/app-button";
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

interface DangerSectionProps {
  // Add your props here
  children?: React.ReactNode;
}

const DangerSection: FC<DangerSectionProps> = ({ children }) => {
  return (
    <section className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <div>
        <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
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
          <AppButton variant="destructive" onClick={() => authClient.signOut()}>
            Sign Out
          </AppButton>
        </div>

        <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
          <div>
            <h4 className="font-medium text-destructive">Delete Account</h4>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all data.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <AppButton variant="destructive">Delete Account</AppButton>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
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
  );
};

export default DangerSection;
