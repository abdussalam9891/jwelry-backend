import sanitizeHtml from "sanitize-html";

// CMS sections are rendered on the storefront as HTML, so only basic
// formatting and links survive; scripts, iframes, event handlers, inline
// styles and javascript: URLs are stripped.
const CMS_HTML_OPTIONS = {
  allowedTags: [
    "p",
    "br",
    "h2",
    "h3",
    "h4",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "span",
    "a",
    "ul",
    "ol",
    "li",
    "blockquote",
    "hr",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  transformTags: {
    // Links opening a new tab must not get a handle on the opener.
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
  },
};

/**
 * Sanitises admin-authored CMS content before it is stored or served.
 * Plain text passes through unchanged apart from HTML-escaping.
 */
export function sanitizeCmsContent(content) {
  return sanitizeHtml(String(content ?? ""), CMS_HTML_OPTIONS);
}
