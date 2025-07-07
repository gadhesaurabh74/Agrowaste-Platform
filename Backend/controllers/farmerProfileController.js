const Farmer = require("../models/Farmer");
const Listing = require("../models/Listing");
const Offer = require("../models/Offer");
const cloudinary = require("../config/cloudinary");
const deleteOldImage = require("../utils/imageHandler");

exports.getFarmerProfile = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.user.id).select("-password");
    if (!farmer) return res.status(404).json({ message: "Not found" });

    res.json(farmer);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.updateFarmerProfile = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.user.id);
    if (!farmer) return res.status(404).json({ message: "Not found" });
    if (req.file) {
      await deleteOldImage(farmer.profileImage);
      const result = await cloudinary.uploader.upload(req.file.path);
      farmer.profileImage = result.secure_url;
    }
    farmer.name = req.body.name || farmer.name;
    farmer.location = req.body.location || farmer.location;
    farmer.phone = req.body.phone || farmer.phone;
    farmer.email = req.body.email || farmer.email;
    await farmer.save();
    res.json(farmer);
  } catch (error) {
    res.status(500).json({ message: "Update Error", error: error.message });
  }
};

exports.getFarmerDashboardStats = async (req, res) => {
  try {
    const listings = await Listing.find({ farmer: req.user.id }).select("_id");
    const listingIds = listings.map((listing) => listing._id);
    res.json({
      totalListings: await Listing.countDocuments({ farmer: req.user.id }),
      totalOffers: await Offer.countDocuments({ listing: { $in: listingIds } }),
      pendingOffers: await Offer.countDocuments({ listing: { $in: listingIds }, status: "pending" }),
      acceptedOffers: await Offer.countDocuments({ listing: { $in: listingIds }, status: "accepted" }),
    });
  } catch (error) {
    res.status(500).json({ message: "Dashboard Error", error: error.message });
  }
};