import axios from "axios";

export const checkDelivery = async (req, res) => {
  try {
    const { pincode } = req.params;

    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pincode format",
      });
    }

    const { data } = await axios.get(
      `https://api.postalpincode.in/pincode/${pincode}`
    );

    const result = data?.[0];

    if (!result || result.Status !== "Success") {
      return res.status(404).json({
        success: false,
        message: "Pincode not found",
      });
    }

    const postOffice = result.PostOffice?.[0];

    return res.status(200).json({
      success: true,
      message: "Pincode verified successfully",
      data: {
        pincode,
        postOffice: postOffice.Name,
        district: postOffice.District,
        state: postOffice.State,
        country: postOffice.Country,
      },
    });
  } catch (error) {
    console.error("Pincode lookup error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify pincode",
    });
  }
};
