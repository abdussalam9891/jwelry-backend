import Address from "../models/addressModel.js";


// CREATE ADDRESS
export const createAddress = async (req, res) => {

  try {

    const {
      fullName,
      phone,
      pincode,
      state,
      city,
      addressLine1,
      addressLine2,
      landmark,
      addressType,
      isDefault,
    } = req.body;

    // 🔥 first address auto-default
    const existingAddresses =
      await Address.countDocuments({
        user: req.user._id,
      });

    const shouldBeDefault =
      existingAddresses === 0 || isDefault;

    // 🔥 remove old default
    if (shouldBeDefault) {

      await Address.updateMany(
        { user: req.user._id },
        { $set: { isDefault: false } }
      );

    }

    const address = await Address.create({

      user: req.user._id,

      fullName,
      phone,
      pincode,

      state,
      city,

      addressLine1,
      addressLine2,

      landmark,
      addressType,

      isDefault: shouldBeDefault,

    });

    res.status(201).json({
      success: true,
      address,
    });

  } catch (error) {

    // 🔥 mongoose validation
    if (error.name === "ValidationError") {

      const firstError =
        Object.values(error.errors)[0];

      return res.status(400).json({
        success: false,
        message: firstError.message,
      });

    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }

};


// GET ADDRESSES
export const getAddresses = async (req, res) => {

  try {

    const addresses = await Address.find({
      user: req.user._id,
    }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      addresses,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }

};


// UPDATE ADDRESS
export const updateAddress = async (req, res) => {

  try {

    const { id } = req.params;

    const address = await Address.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!address) {

      return res.status(404).json({
        success: false,
        message: "Address not found",
      });

    }

    // 🔥 switch default
    if (req.body.isDefault) {

      await Address.updateMany(
        { user: req.user._id },
        { $set: { isDefault: false } }
      );

    }

    Object.assign(address, req.body);

    await address.save();

    res.status(200).json({
      success: true,
      address,
    });

  } catch (error) {

    if (error.name === "ValidationError") {

      const firstError =
        Object.values(error.errors)[0];

      return res.status(400).json({
        success: false,
        message: firstError.message,
      });

    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }

};


// DELETE ADDRESS
export const deleteAddress = async (req, res) => {

  try {

    const { id } = req.params;

    const address =
      await Address.findOneAndDelete({

        _id: id,
        user: req.user._id,

      });

    if (!address) {

      return res.status(404).json({
        success: false,
        message: "Address not found",
      });

    }

    // 🔥 if deleted address was default
    // promote another one
    if (address.isDefault) {

      const anotherAddress =
        await Address.findOne({
          user: req.user._id,
        }).sort({ createdAt: -1 });

      if (anotherAddress) {

        anotherAddress.isDefault = true;

        await anotherAddress.save();

      }

    }

    res.status(200).json({
      success: true,
      message: "Address deleted",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }

};


// SET DEFAULT ADDRESS
export const setDefaultAddress = async (req, res) => {

  try {

    const { id } = req.params;

    await Address.updateMany(
      { user: req.user._id },
      { $set: { isDefault: false } }
    );

    const address =
      await Address.findOneAndUpdate(

        {
          _id: id,
          user: req.user._id,
        },

        {
          isDefault: true,
        },

        {
          new: true,
        }

      );

    if (!address) {

      return res.status(404).json({
        success: false,
        message: "Address not found",
      });

    }

    res.status(200).json({
      success: true,
      address,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }

};
