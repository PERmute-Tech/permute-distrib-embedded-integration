/**
 * Advisor identity that the client CRM passes when creating the magic link.
 * Frozen for the demo: this is who opens the link and becomes the owner of the
 * journey on the distributeur side.
 */
export const DEMO_ADVISOR = {
  firstName: 'Camille',
  lastName: 'Martin',
  email: 'camille.martin@demo-crm.fr',
  externalId: 'crm-demo-user-1',
} as const;
