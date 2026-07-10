import sanitizeHtml from "sanitize-html";
import CMSPage, { CMS_PAGE_SLUGS } from "../models/cmsPageModel.js";

// Deliberately restrictive allowlist. This is legal/policy content, not a
// blog — it needs headings, paragraphs, lists, and links, not embeds,
// scripts, or inline event handlers. Anything not listed here is stripped,
// not escaped-and-shown, so a compromised admin session can't inject
// executable content into pages every storefront visitor renders.
const SANITIZE_OPTIONS = {
  allowedTags: [
    "h1", "h2", "h3", "h4",
    "p", "br", "hr",
    "ul", "ol", "li",
    "strong", "em", "b", "i", "u",
    "a", "blockquote", "span",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],

  },
  allowedSchemes: ["http", "https", "mailto"],
  // Force safe rel/target on links so sanitized content can't be used
  // for tabnabbing (target="_blank" without rel="noopener noreferrer").
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: {
        ...attribs,
        target: "_blank",
        rel: "noopener noreferrer nofollow",
      },
    }),
  },
};

function sanitize(content) {
  if (typeof content !== "string") return content;
  return sanitizeHtml(content, SANITIZE_OPTIONS);
}

// Public read — the ONLY path the storefront calls. Enforces published-only
// at the query level (not just "trust the controller to filter"), so a
// future controller bug can't accidentally leak a draft.
export async function getPublishedPage(slug) {
  return CMSPage.findOne({ slug, status: "published" });
}

// Admin read — can see drafts. Used for the edit screen.
export async function getPageForAdmin(slug) {
  return CMSPage.findOne({ slug });
}

export async function listPagesForAdmin() {
  return CMSPage.find().sort("slug");
}

export async function updatePage(slug, updates, userId) {
  if (!CMS_PAGE_SLUGS.includes(slug)) {
    const err = new Error(
      `Invalid slug. Allowed values: ${CMS_PAGE_SLUGS.join(", ")}`
    );
    err.statusCode = 400;
    throw err;
  }

  const sanitizedContent =
    updates.content !== undefined ? sanitize(updates.content) : undefined;

  const updated = await CMSPage.findOneAndUpdate(
    { slug },
    {
      $set: {
        ...updates,
        ...(sanitizedContent !== undefined && { content: sanitizedContent }),
        updatedBy: userId,
      },
    },
    {
      new: true,
      upsert: true, // first PUT to a known slug creates it — same reasoning as SiteSettings
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  return updated;
}



export async function addPageImages(slug, newImageUrls, userId) {
  const page = await CMSPage.findOne({ slug });
  const currentImages = page?.images || [];

  if (currentImages.length + newImageUrls.length > 5) {
    const err = new Error(
      `Cannot add ${newImageUrls.length} image(s) — this page already has ${currentImages.length}, and the limit is 5.`
    );
    err.statusCode = 400;
    throw err;
  }

  const updated = await CMSPage.findOneAndUpdate(
    { slug },
    {
      // New images always append to the end — this is what makes
      // "upload order = display order" true. Never prepend, never insert.
      $push: { images: { $each: newImageUrls } },
      $set: { updatedBy: userId },
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  return updated;
}

export async function removePageImage(slug, imageUrl, userId) {
  const updated = await CMSPage.findOneAndUpdate(
    { slug },
    {
      $pull: { images: imageUrl },
      $set: { updatedBy: userId },
    },
    { new: true }
  );

  if (!updated) {
    const err = new Error(`No page found for slug "${slug}".`);
    err.statusCode = 404;
    throw err;
  }

  return updated;
}
