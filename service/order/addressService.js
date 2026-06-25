import Address from "../../models/addressModel.js";

export async function getAddress({
  userId,
  addressId,
}) {
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new Error("Address not found");
  }

  return address;
}
