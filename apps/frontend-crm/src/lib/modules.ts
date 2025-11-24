export const MODULES = {
  CRM: "crm",
  BACKOFFICE: "backoffice",
  WEBSITE: "website",
} as const;

export type ModuleId = (typeof MODULES)[keyof typeof MODULES];

export const MODULE_LIST = [
  {
    id: MODULES.CRM,
    label: "CRM",
    description: "Manage leads, customers, and quotations",
  },
  {
    id: MODULES.BACKOFFICE,
    label: "Backoffice",
    description: "Manage staff and roles",
  },
  {
    id: MODULES.WEBSITE,
    label: "Website",
    description: "Manage website content and blogs",
  },
];
