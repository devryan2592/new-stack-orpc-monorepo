import { FC } from "react";
import SessionsListForm from "../_forms/sessions-list-form";

interface SessionsSectionProps {
  // Add your props here
}

const SessionsSection: FC<SessionsSectionProps> = () => {
  return (
    <section className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <div>
        <h3 className="text-lg font-medium">Sessions</h3>
        <p className="text-sm text-muted-foreground">
          Manage your active sessions and devices.
        </p>
      </div>
      <SessionsListForm />
    </section>
  );
};

export default SessionsSection;
