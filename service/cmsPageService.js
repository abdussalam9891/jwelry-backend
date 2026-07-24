import CMSPage from "../models/cmsPageModel.js";

/**
 * Converts a string into a URL-friendly slug.
 */
function slugify(text = "") {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Ensures section orders remain sequential.
 */
function normalizeSectionOrders(sections = []) {
  return sections
    .sort((a, b) => a.order - b.order)
    .map((section, index) => {
      section.order = index;
      return section;
    });
}

/**
 * Sets publishedAt automatically.
 */
function applyPublishState(page) {
  if (page.status === "published" && !page.publishedAt) {
    page.publishedAt = new Date();
  }

  if (page.status === "draft") {
    page.publishedAt = null;
  }
}

/**
 * Prevent duplicate page slugs.
 */
async function validatePageSlug(slug, ignoreId = null) {
  const existing = await CMSPage.findOne({ slug });

  if (!existing) return;

  if (ignoreId && existing._id.equals(ignoreId)) {
    return;
  }

  throw new Error("A page with this slug already exists.");
}

/**
 * Prevent duplicate section slugs inside one page.
 */
function validateSectionSlug(sections = [], slug, ignoreId = null) {
  const duplicate = sections.find((section) => {
    if (ignoreId && section._id.equals(ignoreId)) {
      return false;
    }

    return section.slug === slug;
  });

  if (duplicate) {
    throw new Error("Section slug already exists.");
  }
}

/**
 * Admin Listing
 */
export async function getCMSPages(filters = {}) {
  const query = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.type) {
    query.type = filters.type;
  }

  return CMSPage.find(query)
    .select(
      "title slug type status sections seo updatedAt publishedAt createdAt updatedBy"
    )
    .sort({
      updatedAt: -1,
    });
}

/**
 * Get page by Mongo ID.
 */
export async function getCMSPageById(id) {
  return CMSPage.findById(id);
}

/**
 * Storefront page.
 */
export async function getCMSPageBySlug(slug) {
  return CMSPage.findOne({
    slug,
    status: "published",
  });
}

/**
 * Admin page.
 * Drafts are also returned.
 */
export async function getCMSPageForAdmin(slug) {
  return CMSPage.findOne({
    slug,
  });
}




/**
 * Creates a new CMS page.
 */
export async function createCMSPage(data, userId) {
  const pageSlug = slugify(data.slug || data.title);

  await validatePageSlug(pageSlug);

  const page = new CMSPage({
    title: data.title.trim(),
    slug: pageSlug,
    type: data.type || "page",
    status: data.status || "draft",
    seo: data.seo || {},
    updatedBy: userId,
  });

  if (Array.isArray(data.sections)) {
    const usedSectionSlugs = new Set();

    page.sections = data.sections.map((section, index) => {
      const title = section.title.trim();
      const sectionSlug = slugify(section.slug || title);

      if (usedSectionSlugs.has(sectionSlug)) {
        throw new Error(
          `Duplicate section slug "${sectionSlug}" found.`
        );
      }

      usedSectionSlugs.add(sectionSlug);

      return {
        title,
        slug: sectionSlug,
        content: section.content || "",
        order: index,
        isVisible:
          section.isVisible !== undefined
            ? section.isVisible
            : true,
      };
    });
  }

  page.sections = normalizeSectionOrders(page.sections);

  applyPublishState(page);

  await page.save();

  return page;
}





/**
 * Update CMS page.
 * Basic info, SEO and sections are saved together.
 */
export async function updateCMSPage(id, updates, userId) {
  const page = await CMSPage.findById(id);

  if (!page) {
    throw new Error("CMS page not found.");
  }

  /**
   * Title
   */
  if (typeof updates.title === "string") {
    page.title = updates.title.trim();
  }

  /**
   * Slug
   */
  if (typeof updates.slug === "string") {
    const pageSlug = slugify(updates.slug);

    if (pageSlug !== page.slug) {
      await validatePageSlug(pageSlug, page._id);
      page.slug = pageSlug;
    }
  }

  /**
   * Type
   */
  if (typeof updates.type === "string") {
    page.type = updates.type;
  }

  /**
   * Status
   */
  if (typeof updates.status === "string") {
    page.status = updates.status;
  }

  /**
   * SEO
   */
  if (updates.seo) {
    page.seo = {
      ...page.seo.toObject(),
      ...updates.seo,
    };
  }

  /**
   * Sections
   */
  if (Array.isArray(updates.sections)) {
    const usedSectionSlugs = new Set();

    page.sections = updates.sections.map((section, index) => {
      const title = (section.title || "").trim();

      if (!title) {
        throw new Error("Section title is required.");
      }

      const sectionSlug = slugify(section.slug || title);

      if (usedSectionSlugs.has(sectionSlug)) {
        throw new Error(
          `Duplicate section slug "${sectionSlug}" found.`
        );
      }

      usedSectionSlugs.add(sectionSlug);

      return {
        title,
        slug: sectionSlug,
        content: section.content || "",
        order: index,
        isVisible:
          section.isVisible !== undefined
            ? section.isVisible
            : true,
      };
    });

    page.sections = normalizeSectionOrders(page.sections);
  }

  /**
   * Track last editor.
   */
  page.updatedBy = userId;

  /**
   * Maintain publishedAt automatically.
   */
  applyPublishState(page);

  await page.save();

  return page;
}





/**
 * Delete a CMS page.
 */
export async function deleteCMSPage(id) {
  const page = await CMSPage.findById(id);

  if (!page) {
    throw new Error("CMS page not found.");
  }

  await page.deleteOne();

  return {
    success: true,
    message: "CMS page deleted successfully.",
  };
}














