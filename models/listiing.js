const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

// Default image URL used when no image is provided or when the image field is blank.
// Mongoose only applies defaults when a field is undefined, not when it’s an empty string:contentReference[oaicite:0]{index=0},
// so the setter below explicitly handles empty strings.
const DEFAULT_IMAGE_URL =
  "https://unsplash.com/photos/a-rocky-mountain-with-grass-and-rocks-QlcNcJx9Ny0";

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: {
      type: String, 
    },
      filename: { 
        type: String,
      }
    },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
  
});

listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await review.deleteMany({
       _id: {  $in: listing.reviews },
    });
  } 
});

// Export the model.
module.exports = mongoose.model("Listing", listingSchema);


