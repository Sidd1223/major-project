const Listing = require("../models/listiing.js");
const mbxTiles = require("@mapbox/mapbox-sdk/services/geocoding");
const mbxStyles = require("@mapbox/mapbox-sdk/services/styles");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const { response } = require("express");
const mapboxToken = process.env.Mapbox_Token;
const geocodingClient = mbxGeocoding({ accessToken: mapboxToken });
const stylesService = mbxStyles({ accessToken: mapboxToken });



// Index Route
module.exports.index = async(req,res) => {
    const allListings = await Listing.find({}); 
    res.render("listings/index.ejs", {allListings});
    
    };


// New Route
module.exports.renderNewForm = (req, res) => {
       res.render("listings/new.ejs");
    };

// Show Route
module.exports.showListing = async(req, res) => {
        let {id} = req.params;
        const listing =  await Listing.findById(id).populate({"path": "reviews", "populate": {path: "author", select: "username"}}).populate("owner");
        if(!listing) {
            req.flash("error", "Cannot find that listing!");
            return res.redirect("/listings");
            res.redirect("/listings");
        }
        res.render("listings/show.ejs",{listing});
    };

// Create Route
module.exports.createListing = async (req, res, next) => {
       let response = await geocodingClient.forwardGeocode({
           query: req.body.listing.location,
            limit: 1
    })
     .send()
           let imageUrl = req.file.path;
           let imageFilename = req.file.filename;
           
            const newListing = new Listing(req.body.listing);
            newListing.owner = req.user._id;
            newListing.image = { url: imageUrl, filename: imageFilename };
            newListing.geometry = response.body.features[0].geometry;
            await newListing.save();
            req.flash("success", "Successfully made a new listing!");
             res.redirect("/listings");
           };

// Edit Route
module.exports.renderEditForm = async(req, res) => {
            let {id} = req.params;
            const listing =  await Listing.findById(id);
            if(!listing) {
                req.flash("error", "Cannot find that listing!");
                return res.redirect("/listings");
            }

            let OrignalImageUrl = listing.image?.url || listing.image;
            OrignalImageUrl.replace("/upload", "/upload/w_250"); // Example transformation to get a smaller image   
            res.render("listings/edit.ejs",{listing, OrignalImageUrl});
    
    };

// Update Route
module.exports.updateListing = async (req, res) => {
            let { id } = req.params;
            let updatedListing = await Listing.findByIdAndUpdate(id, {...req.body.listing });

            if (typeof req.file !== "undefined") {
            let imageUrl = req.file.path;
            let imageFilename = req.file.filename;
            updatedListing.image = { url: imageUrl, filename: imageFilename };
            await updatedListing.save();
            }
            req.flash("success", "Successfully updated listing!");
            res.redirect(`/listings/${id}`);
        };


// Delete Route
module.exports.deleteListing = async (req, res) => {
            let { id } = req.params;
          let deletedListing =  await Listing.findByIdAndDelete(id);
          console.log(deletedListing);
          req.flash("success", "Successfully deleted listing!");
          res.redirect("/listings");
        };