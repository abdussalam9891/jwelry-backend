import { asyncHandler } from "../middleware/asyncHandler.js";
import { getSiteSettings } from "../service/siteSettingsService.js";

export const getPublicSiteSettings = asyncHandler(async (req, res) => {
  const settings = await getSiteSettings();

  // Never 404 here — see Step 4 note: storefront renders a footer
  // unconditionally and shouldn't have to handle "settings don't exist yet."
  res.status(200).json({
    success: true,
    data: settings || {
      storeName: "",
      email: "",
      phone: "",
      whatsapp: "",
      address: "",
      socialLinks: {},
    },
  });
});
