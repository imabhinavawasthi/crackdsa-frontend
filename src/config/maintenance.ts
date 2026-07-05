/**
 * Maintenance & Access Configuration
 * 
 * Defines the list of domains where the frontend should be restricted
 * and display the "Coming Soon" page instead of the main application.
 */

// List of domains that should show the Coming Soon page
export const MAINTENANCE_DOMAINS = [
  'crackdsa.com',
  'www.crackdsa.com'
];

/**
 * Checks if a given hostname should be routed to the Coming Soon page.
 * Handles exact matches as well as subdomains if necessary.
 */
export function isMaintenanceHost(hostname: string): boolean {
  if (!hostname) return false;
  
  // Clean hostname (remove port if present)
  const cleanHost = hostname.split(':')[0].toLowerCase();
  
  return MAINTENANCE_DOMAINS.some(domain => {
    return cleanHost === domain.toLowerCase();
  });
}
