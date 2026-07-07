import Newsletter from "../models/newsletterModel.js";

export async function subscribe(req, res) {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const existingSubscriber = await Newsletter.findOne({ email });

    if (existingSubscriber) {
      return res.status(409).json({
        success: false,
        message: "This email is already subscribed.",
      });
    }

    await Newsletter.create({
      email,
      source: "footer",
    });

    return res.status(201).json({
      success: true,
      message: "Successfully subscribed to our newsletter.",
    });
  } catch (error) {
    // Handles race condition if two requests subscribe simultaneously
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This email is already subscribed.",
      });
    }

    console.error("Newsletter subscription error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
}
