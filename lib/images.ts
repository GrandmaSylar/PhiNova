/**
 * Central image registry — swap any URL here to update it site-wide.
 * All photos are Unsplash (free licence). Replace with actual brand/product
 * screenshots once available.
 *
 * URL format: https://images.unsplash.com/photo-{ID}?w={W}&fit=crop&q=80
 */

function u(id: string, w = 800, h = 500): string {
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=80`;
}

/* ── Invitro LIMS — laboratory, clinical science, diagnostics ───────── */
export const IMAGES = {
  /* Clinical lab — microscopes, test samples, equipment */
  labHero:        u("1579154204601-01588f351e67", 1200, 600),
  labEquipment:   u("1532187863486-abf9dbad1b69", 800, 500),  // colorful test tubes
  labScientist:   u("1516981879613-9f5da904015f", 800, 500),  // scientist at microscope

  /* COCM — church interior, congregation, worship */
  churchHero:     u("1438032005730-3099cb36b24b", 1200, 600), // church interior, light beams
  churchCongre:   u("1478147427282-58a87a702b70", 800, 500),  // congregation gathered
  churchAisle:    u("1548438294-1ad5d5f4f063", 800, 500),     // church aisle

  /* Concord SMS — mobile messaging, communication, outreach */
  smsHero:        u("1512941937669-90a1b58e7e9c", 1200, 600), // person using smartphone
  smsCampaign:    u("1611532736597-de2d4265fba3", 800, 500),  // phone notifications/messaging
  smsNetwork:     u("1451187580459-43490279c0fa", 800, 500),  // digital network/connections

  /* About / company — team, office, collaboration */
  teamMeeting:    u("1521737852567-6949f3f9f2b5", 800, 500),  // diverse team working
  officeWork:     u("1600880292203-757bb62b4baf", 800, 500),  // modern office team

  /* Products overview page thumbnails */
  overviewLab:    u("1582719478250-c89cae4dc85b", 600, 400),  // science/lab bench
  overviewChurch: u("1438032005730-3099cb36b24b", 600, 400),
  overviewSms:    u("1512941937669-90a1b58e7e9c", 600, 400),
} as const;
