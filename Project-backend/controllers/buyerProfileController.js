const Buyer = require("../models/Buyer");
const cloudinary = require("../config/cloudinary");
const Offer = require("../models/Offer");
const deleteOldImage = require("../utils/imageHandler");

exports.getBuyerProfile = async (req, res) => {
  try {
    const buyer = await Buyer.findById(req.user.id).select("-password");
    if (!buyer) return res.status(404).json({ message: "Not found" });
    res.json(buyer);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.updateBuyerProfile = async (req, res) => {
  try {
    const { name, phone, location, companyName } = req.body;
    let updateData = { name, phone, location, companyName };
    const buyer = await Buyer.findById(req.user.id);
    if (req.file) {
      await deleteOldImage(buyer._doc.profileImage);
      const result = await cloudinary.uploader.upload(req.file.path);
      updateData.profileImage = result.secure_url;
    }
    const updatedBuyer = await Buyer.findByIdAndUpdate(req.user.id, { $set: updateData }, { new: true, select: "-password", strict: false });
    res.json(updatedBuyer);
  } catch (error) {
    res.status(500).json({ message: "Update Error", error: error.message });
  }
};

exports.getBuyerDashboardStats = async (req, res) => {
  try {
    const offers = await Offer.find({ buyer: req.user.id });
    res.json({
      totalOffers: offers.length,
      acceptedOffers: offers.filter((o) => o.status === "accepted").length,
      rejectedOffers: offers.filter((o) => o.status === "rejected").length,
      pendingOffers: offers.filter((o) => o.status === "pending").length,
    });
  } catch (error) {
    res.status(500).json({ message: "Dashboard Error", error: error.message });
  }
};