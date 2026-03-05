const express  = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listiing.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const constroller = require("../controllers/reviews.js");




 // Reviews
router.post("/",isLoggedIn, validateReview, wrapAsync(constroller.createReview));

// Review Delete Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor,  wrapAsync(constroller.deleteReview));

module.exports = router;