/**
 * Centralized Links Configuration
 * 
 * This file contains all application routes organized into logical sections.
 * Use these constants instead of hardcoded strings throughout the application
 * to ensure consistency and make future updates easier.
 */

// Authentication Routes
export const AUTH_LINKS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  RESET_PASSWORD: '/auth/reset-password',
  UPDATE_PASSWORD: '/auth/update-password',
  VERIFY_EMAIL: '/auth/verify-email',
} as const;

// Dashboard Routes
export const DASHBOARD_LINKS = {
  HOME: '/',
  ACCOUNT: '/account',
  BLOGS: {
    ROOT: '/blogs',
    VIEW: '/blogs',
    ADD: '/blogs/add',
    CATEGORIES: '/blogs/categories',
    TAGS: '/blogs/tags',
  },
  DESTINATIONS: {
    ROOT: '/destinations',
    VIEW: '/destinations',
    ADD: '/destinations/add',
  },
  ATTRACTIONS: {
    ROOT: '/attractions',
    VIEW: '/attractions',
    ADD: '/attractions/add',
  },
  TOURS: {
    ROOT: '/tours',
    VIEW: '/tours',
    ADD: '/tours/add',
  },
  CUSTOMERS: {
    ROOT: '/customers',
    VIEW: '/customers',
    ADD: '/customers/add',
  },
  LEADS: {
    ROOT: '/leads',
    VIEW: '/leads',
    ADD: '/leads/add',
  },
  ITINERARY_BUILDER: {
    ROOT: '/itinerary-builder',
    ADD: '/itinerary-builder/add',
    LIBRARY: {
      ROOT: '/itinerary-builder/library',
      ATTRACTION: '/itinerary-builder/library/attraction',
      HOTEL: '/itinerary-builder/library/hotel',
      FLIGHT: '/itinerary-builder/library/flight',
      TRANSPORT: '/itinerary-builder/library/transport',
      CRUISE: '/itinerary-builder/library/cruise',
      MEAL: '/itinerary-builder/library/meal',
    },
  },
  QUOTATIONS: {
    ROOT: '/quotations',
  },
  INVOICES: {
    ROOT: '/invoices',
  },
  LIBRARY: {
    GALLERY: '/gallery',
  },
  SETTINGS: {
    BACKUP: '/settings/backup',
    SITE: '/settings/site',
  },
} as const;

// External Links (if any)
export const EXTERNAL_LINKS = {
  // Add external links here if needed
} as const;

// Utility function to get all auth links as an array
export const getAllAuthLinks = () => Object.values(AUTH_LINKS);

// Utility function to get all dashboard links as an array (flattened)
export const getAllDashboardLinks = () => {
  const links: string[] = [];
  links.push(DASHBOARD_LINKS.HOME);
  links.push(DASHBOARD_LINKS.ACCOUNT);
  Object.values(DASHBOARD_LINKS.BLOGS).forEach((link) => links.push(link));
  Object.values(DASHBOARD_LINKS.DESTINATIONS).forEach((link) => links.push(link));
  Object.values(DASHBOARD_LINKS.ATTRACTIONS).forEach((link) => links.push(link));
  Object.values(DASHBOARD_LINKS.TOURS).forEach((link) => links.push(link));
  Object.values(DASHBOARD_LINKS.LIBRARY).forEach((link) => links.push(link));
  Object.values(DASHBOARD_LINKS.SETTINGS).forEach((link) => links.push(link));
  // Itinerary Builder routes
  links.push(DASHBOARD_LINKS.ITINERARY_BUILDER.ROOT);
  links.push(DASHBOARD_LINKS.ITINERARY_BUILDER.ADD);
  Object.values(DASHBOARD_LINKS.ITINERARY_BUILDER.LIBRARY).forEach((link) => links.push(link));
  return links;
};

// Type definitions for better TypeScript support
export type AuthLink = typeof AUTH_LINKS[keyof typeof AUTH_LINKS];
export type DashboardLink =
  | typeof DASHBOARD_LINKS[keyof typeof DASHBOARD_LINKS]
  | typeof DASHBOARD_LINKS.BLOGS[keyof typeof DASHBOARD_LINKS.BLOGS]
  | typeof DASHBOARD_LINKS.DESTINATIONS[keyof typeof DASHBOARD_LINKS.DESTINATIONS]
  | typeof DASHBOARD_LINKS.ATTRACTIONS[keyof typeof DASHBOARD_LINKS.ATTRACTIONS]
  | typeof DASHBOARD_LINKS.TOURS[keyof typeof DASHBOARD_LINKS.TOURS]
  | typeof DASHBOARD_LINKS.LIBRARY[keyof typeof DASHBOARD_LINKS.LIBRARY]
  | typeof DASHBOARD_LINKS.SETTINGS[keyof typeof DASHBOARD_LINKS.SETTINGS]
  | typeof DASHBOARD_LINKS.ITINERARY_BUILDER[keyof typeof DASHBOARD_LINKS.ITINERARY_BUILDER]
  | typeof DASHBOARD_LINKS.ITINERARY_BUILDER.LIBRARY[keyof typeof DASHBOARD_LINKS.ITINERARY_BUILDER.LIBRARY];

// Default export with all links for convenience
export default {
  AUTH: AUTH_LINKS,
  DASHBOARD: DASHBOARD_LINKS,
  EXTERNAL: EXTERNAL_LINKS,
} as const;
