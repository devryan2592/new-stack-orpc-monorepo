import { cn } from "@workspace/ui/lib/utils";
import React, { FC, HTMLAttributes } from "react";
import DashboardHeader from "../dashboard-header";

interface DashboardLayoutProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const DashboardLayoutRoot: FC<DashboardLayoutProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn("flex flex-col h-full w-full overflow-hidden", className)}
      {...props}
    >
      <DashboardHeader />
      {children}
    </div>
  );
};

interface DashboardLayoutBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const DashboardLayoutBody: FC<DashboardLayoutBodyProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn("flex-1 overflow-y-auto p-4", className)} {...props}>
      {children}
    </div>
  );
};

interface DashboardLayoutFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const DashboardLayoutFooter: FC<DashboardLayoutFooterProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn("shrink-0 border-t bg-background p-4 z-10", className)}
      {...props}
    >
      {children}
    </div>
  );
};

const DashboardLayout = Object.assign(DashboardLayoutRoot, {
  Body: DashboardLayoutBody,
  Footer: DashboardLayoutFooter,
});

export default DashboardLayout;
