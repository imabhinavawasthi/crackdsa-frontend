/**
 * Maintenance & Access Configuration
 * 
 * Disabled for production launch: all domains are live.
 */

// List of domains that should show the Coming Soon page (empty in production)
export const MAINTENANCE_DOMAINS: string[] = [];

/**
 * Checks if a given hostname should be routed to the Coming Soon page.
 */
export function isMaintenanceHost(hostname: string): boolean {
  if (!hostname || MAINTENANCE_DOMAINS.length === 0) return false;
  
  const cleanHost = hostname.split(':')[0].toLowerCase();
  return MAINTENANCE_DOMAINS.some(domain => cleanHost === domain.toLowerCase());
}
