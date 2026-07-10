import {
  isValidEmail,
  isValidPhone,
  isValidUrl,
  isNonEmptyString,
} from "./helpers.js";

const SOCIAL_KEYS = ["instagram", "facebook", "twitter", "youtube"];

export function validateSiteSettingsUpdate(req, res, next) {
  const errors = [];
  const { storeName, email, phone, whatsapp, address, socialLinks } = req.body;

  if (!isNonEmptyString(storeName)) {
    errors.push("storeName is required.");
  }

  if (!isValidEmail(email)) {
    errors.push("A valid email is required.");
  }

  // phone/whatsapp are optional per schema, but if provided, must be well-formed —
  // an empty string is fine (means "not set"), a garbage string is not.
  if (phone && phone.trim() !== "" && !isValidPhone(phone)) {
    errors.push("phone is not a valid phone number.");
  }

  if (whatsapp && whatsapp.trim() !== "" && !isValidPhone(whatsapp)) {
    errors.push("whatsapp is not a valid phone number.");
  }

  if (address !== undefined && typeof address !== "string") {
    errors.push("address must be a string.");
  }

  if (socialLinks !== undefined) {
    if (typeof socialLinks !== "object" || socialLinks === null || Array.isArray(socialLinks)) {
      errors.push("socialLinks must be an object.");
    } else {
      for (const key of Object.keys(socialLinks)) {
        if (!SOCIAL_KEYS.includes(key)) {
          errors.push(`socialLinks.${key} is not a recognized social platform.`);
          continue;
        }
        const value = socialLinks[key];
        // Empty string = admin cleared the field, which is valid.
        if (value && value.trim() !== "" && !isValidUrl(value)) {
          errors.push(`socialLinks.${key} must be a valid URL.`);
        }
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
}
