import rateLimit from "express-rate-limit";

// Strict: login, register, OTP verification, password reset
// Brute-force / credential-stuffing target — keep this tight
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per IP per window
  standardHeaders: true, // return rate-limit info in RateLimit-* headers
  legacyHeaders: false,
  message: {
    message: "Too many attempts. Please try again in a few minutes.",
  },
});

// Moderate: admin global search — protects against the unescaped-regex
// cost blowing up your DB if someone hammers it
export const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 searches per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many search requests. Slow down.",
  },
});

// Loose: general fallback for everything else, optional but cheap insurance
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});




// Moderate: coupon guessing / enumeration
export const couponLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many coupon attempts. Try again later.",
  },
});

// Loose-moderate: public forms with no auth wall (newsletter, contact)
export const publicFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many submissions. Please try again later.",
  },
});
