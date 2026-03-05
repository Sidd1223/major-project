const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listiing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingsCtrl = require("../controllers/listings.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage: storage });




router.route("/")
.get(wrapAsync(listingsCtrl.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync( listingsCtrl.createListing));


// New Route
router.get("/new", isLoggedIn,listingsCtrl.renderNewForm);


router.route("/:id")
.get(wrapAsync (listingsCtrl.showListing))
.put(isLoggedIn, isOwner,upload.single('listing[image]'), validateListing,  wrapAsync( listingsCtrl.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingsCtrl.deleteListing));

// Edit Route
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync (listingsCtrl.renderEditForm));
    
module.exports = router;