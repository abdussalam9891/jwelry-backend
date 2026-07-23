import { z } from "zod";
import { CMS_PAGE_SLUGS } from "../models/cmsPageModel.js";

/**
 * Route Params
 * /admin/cms/pages/:slug
 */
export const cmsPageSlugSchema = z.object({
  slug: z.enum(CMS_PAGE_SLUGS),
});

/**
 * Update CMS Page
 */
export const updateCMSPageSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(200, "Title cannot exceed 200 characters."),

  content: z
    .string()
    .trim()
    .min(1, "Content is required."),

  status: z.enum(["draft", "published"]),
});
