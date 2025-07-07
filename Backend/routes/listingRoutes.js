const express = require("express");
const { createListing, getAllListings, getListingById, updateListing, deleteListing, getMyListings, test } = require("../controllers/listingController");
const authenticateUser = require("../middleware/authMiddleware");
const upload = require("../middleware/multerMiddleware"); // Middleware for image upload

const router = express.Router();

router.post("/", authenticateUser, upload.single("image"), createListing);
router.get("/my-listings", authenticateUser, getMyListings);
router.get("/", getAllListings);
router.get("/:id", getListingById);
router.put("/:id", authenticateUser, upload.single("image"), updateListing);
router.delete("/:id", authenticateUser, deleteListing);


module.exports = router;