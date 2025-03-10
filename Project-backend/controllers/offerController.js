const Offer = require("../models/Offer");
const Listing = require("../models/Listing");
const Notification = require("../models/Notification");

exports.createOffer = async (req, res) => {
  try {
    const listing = await Listing.findById(req.body.listing);
    console.log("create offer: ",{...req.body});
    if (!listing) return res.status(404).json({ message: "Not found" });
    const offer = new Offer({ listing: listing._id, farmer: listing.farmer, buyer: req.user.id, price: req.body.price, status: "pending" });
    await offer.save();
    await Notification.create({ user: listing.farmer, message: `New offer of ₹${req.body.price}.`, type: "offer" });
    res.status(201).json(offer);
  } catch (error) {
    res.status(500).json({ message: "Create Error", error: error.message });
  }
};

exports.getOffersForListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listingId);
    if (!listing) return res.status(404).json({ message: "Not found" });
    if (listing.farmer.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });
    const offers = await Offer.find({ listing: req.params.listingId }).populate("buyer", "name email");
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: "Fetch Error", error: error.message });
  }
};

exports.respondToOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.offerId).populate("listing");
    if (!offer) return res.status(404).json({ message: "Not found" });
    if (offer.listing.farmer.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });
    offer.status = req.body.status;
    await offer.save();
    await Notification.create({ user: offer.buyer, message: `Your offer of ₹${offer.price} was ${req.body.status}.`, type: "offer" });
    res.json({ message: `Offer ${req.body.status}`, offer });
  } catch (error) {
    res.status(500).json({ message: "Update Error", error: error.message });
  }
};

exports.getMyOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ buyer: req.user.id }).populate("listing", "title price location image").populate("farmer", "name phone email");
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: "Fetch Error", error: error.message });
  }
};

exports.updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.offerId);
    const oldPrice=offer.price
    if (!offer) return res.status(404).json({ message: "Not found" });
    if (offer.buyer.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });
    if (offer.status === "accepted") return res.status(400).json({ message: "Cannot update accepted" });
    if (offer.status === "declined") offer.status = "pending";
    offer.price = req.body.price;
    await offer.save();

    await Notification.create({
      user: offer.farmer,
      message: `Offer on your listing was updated from ₹${oldPrice} to ₹${req.body.price}.`,
      type: "offer",
    });
    
    res.json({ message: "Updated", offer });
  } catch (error) {
    res.status(500).json({ message: "Update Error", error: error.message });
  }
};

exports.deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.offerId);
    if (!offer) return res.status(404).json({ message: "Not found" });
    if (offer.buyer.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });
    await offer.deleteOne();
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete Error", error: error.message });
  }
};

exports.getOffersForFarmer = async (req, res) => {
  try {
    const offers = await Offer.find({ farmer: req.user.id }).populate("listing", "title price").populate("buyer", "name email");
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: "Fetch Error", error: error.message });
  }
};