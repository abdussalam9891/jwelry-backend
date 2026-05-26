export const BASE_COOKIE = {
  httpOnly: true,
  secure:
    process.env.NODE_ENV ===
    "production",
  sameSite:
    process.env.NODE_ENV === "production"
      ? "none"
      : "lax",
};

export const ADMIN_COOKIE = {
  ...BASE_COOKIE,
  maxAge:
    7 * 24 * 60 * 60 * 1000,
};

export const USER_COOKIE = {
  ...BASE_COOKIE,
  maxAge:
    7 * 24 * 60 * 60 * 1000,
};
