import type { Settings } from "./types";

/**
 * Site settings used when the CMS API is unreachable (e.g. during a build), so one failed
 * request can't take down the shared layout. Analytics stay off and consent stays required.
 */
export const fallbackSettings: Settings = {
  contact: {
    email: "ceo@compass-iraq.net",
    phones: [
      { number: "+964 785 339 9333", is_whatsapp: false },
      { number: "+964 771 220 6847", is_whatsapp: false },
    ],
    address: null,
    map_embed_url: null,
  },
  socials: [],
  stats: [],
  analytics: { ga4_id: null, plausible_domain: null, consent_required: true },
  home_sections: [],
  default_seo: { title: null, description: null, og_image: null },
};
