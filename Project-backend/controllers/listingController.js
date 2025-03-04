const Listing = require("../models/Listing");
const cloudinary = require("../config/cloudinary");

exports.createListing = async (req, res) => {
  try {
    const { title, description, category, quantity, price, location } = req.body;
    const image = req.file ? (await cloudinary.uploader.upload(req.file.path)).secure_url : null;
    const listing = new Listing({ farmer: req.user.id, title, description, category, quantity, price, location, image });
    await listing.save();
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: "Create Error", error: error.message });
  }
};

exports.getAllListings = async (req, res) => {
  try {
    const { search, category } = req.query;
    const filters = {};
    if (search) filters.title = { $regex: search, $options: "i" };
    if (category) filters.category = category;
    const listings = await Listing.find(filters).populate("farmer", "name location");
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: "Fetch Error", error: error.message });
  }
};

exports.getMyListings = async (req, res) => {
  try {
    const { search, category, status } = req.query;
    const filters = { farmer: req.user.id };
    if (search) filters.title = { $regex: search, $options: "i" };
    if (category) filters.category = category;
    if (status) filters.status = status;
    const listings = await Listing.find(filters);
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: "My Listings Error", error: error.message });
  }
};

exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("farmer", "name location");
    if (!listing) return res.status(404).json({ message: "Not found" });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: "Fetch Error", error: error.message });
  }
};

exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Not found" });
    if (listing.farmer.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });
    const image = req.file ? (await cloudinary.uploader.upload(req.file.path)).secure_url : listing.image;
    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, { ...req.body, image }, { new: true });
    res.json(updatedListing);
  } catch (error) {
    res.status(500).json({ message: "Update Error", error: error.message });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Not found" });
    if (listing.farmer.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete Error", error: error.message });
  }
};