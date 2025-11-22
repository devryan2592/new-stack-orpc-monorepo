import { FC } from "react";

interface DashboardPageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  showActions?: boolean;
  actions?: React.ReactNode;
}

const DashboardPageHeader: FC<DashboardPageHeaderProps> = ({
  title,
  description,
  children,
  showActions = true,
  actions,
}) => {
  return (
    <div className="flex flex-col gap-4 md:gap-8  sm:flex-row sm:justify-between sm:items-center">
      <div className="flex flex-col">
        <h1 className="text-xl lg:text-3xl font-bold tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm lg:text-base text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {showActions && (
        <div className="flex flex-col mt-auto gap-2 sm:flex-row sm:items-center">
          {actions}
        </div>
      )}
      {children}
    </div>
  );
};

export default DashboardPageHeader;
