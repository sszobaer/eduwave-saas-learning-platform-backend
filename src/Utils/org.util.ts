export function generateOrgDomain(orgName: string): string {
  if (!orgName) return '';

  const cleanName = orgName.replace(/\s+/g, '').toLowerCase();
  return `${cleanName}.eduwave.com`;
}
