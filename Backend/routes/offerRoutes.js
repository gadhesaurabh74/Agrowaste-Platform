const express = require("express");
const { createOffer, getOffersForListing, respondToOffer, getMyOffers, updateOffer, deleteOffer, getOffersForFarmer, timepass } = require("../controllers/offerController");
const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateUser, createOffer);
router.get("/my", authenticateUser, getMyOffers);
router.get("/farmer", authenticateUser, getOffersForFarmer);
router.get("/:listingId", authenticateUser, getOffersForListing);

router.put("/:offerId", authenticateUser, respondToOffer);
router.put("/:offerId/update",authenticateUser,updateOffer)
router.delete("/:offerId", authenticateUser, deleteOffer);




module.exports = router;