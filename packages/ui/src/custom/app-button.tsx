"use client";

import * as React from "react";

import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@workspace/ui/components/tooltip";
import { Spinner } from "@workspace/ui/components/spinner";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";

type IconPosition = "left" | "right";

type AppButtonProps = React.ComponentProps<typeof Button> & {
  tooltip?: React.ReactNode;
  loading?: boolean;
  icon?: LucideIcon | IconType;
  iconPosition?: IconPosition;
  iconOnly?: boolean;
  asChild?: boolean;
};

function AppButton({
  className,
  tooltip,
  loading = false,
  icon: Icon,
  iconPosition = "left",
  iconOnly = false,
  asChild = false,
  children,
  disabled,
  size,
  variant,
  ...props
}: AppButtonProps) {
  const content = (
    <Button
      data-slot="app-button"
      aria-busy={loading || undefined}
      variant={variant}
      size={size}
      asChild={asChild}
      className={cn(iconOnly ? "justify-center" : undefined, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Spinner className={cn(iconOnly ? undefined : "mr-1.5")} />
      ) : Icon && iconPosition === "left" ? (
        <span aria-hidden className="inline-flex items-center">
          <Icon className="h-4 w-4" />
        </span>
      ) : null}

      {iconOnly ? null : <span className="truncate">{children}</span>}

      {!loading && Icon && iconPosition === "right" ? (
        <span aria-hidden className="inline-flex items-center">
          <Icon className="h-4 w-4" />
        </span>
      ) : null}
    </Button>
  );

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

function AppIcon({
  children,
  position = "left",
}: {
  children: React.ReactNode;
  position?: IconPosition;
}) {
  return (
    <span
      data-slot="app-button-icon"
      data-position={position}
      className={cn(position === "left" ? "mr-1.5" : "ml-1.5")}
    >
      {children}
    </span>
  );
}

function AppSpinner() {
  return <Spinner />;
}

AppButton.Icon = AppIcon as unknown as React.FC<{
  children: React.ReactNode;
  position?: IconPosition;
}>;
AppButton.Spinner = AppSpinner as unknown as React.FC;

export { AppButton };
