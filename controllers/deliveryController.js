export const checkDelivery = async (req, res) => {
  try {
    const { pincode } = req.params;

    // 🛡️ validation
    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      return res.status(400).json({
        available: false,
        message: "Invalid pincode",
      });
    }

    const firstDigit = Number(pincode[0]);

    // 🇮🇳 India region mapping (rough simulation)
    // 1–8 → mostly serviceable
    // 9 → remote / military / special zones (often restricted)

    let isAvailable = true;

    // simulate ~10–15% failure like real world
    if (firstDigit === 9) {
      isAvailable = Math.random() > 0.4; // many fail
    } else {
      isAvailable = Math.random() > 0.1; // most succeed
    }

    if (!isAvailable) {
      return res.json({
        available: false,
        message: "Delivery not available in your area",
      });
    }

    // 📦 delivery time based on region
    let baseDays = 3;

    if (firstDigit <= 3) baseDays = 2;        // North (fast)
    else if (firstDigit <= 6) baseDays = 3;   // Central/West
    else baseDays = 4;                        // East/Northeast (slower)

    const variance = Math.floor(Math.random() * 2); // randomness
    const totalDays = baseDays + variance;

    const date = new Date();
    date.setDate(date.getDate() + totalDays);

    res.json({
      available: true,
      estimatedDate: date.toDateString(),
      days: totalDays,
      cod: Math.random() > 0.2, // COD mostly available
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      available: false,
      message: "Server error",
    });
  }
};
