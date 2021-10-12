const mongoose = require("mongoose");
const Review = require("./reviews");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  image: {
    id: String,
    width: Number,
    height: Number,
    urls: {
      raw: String,
      full: String,
      regular: String,
      small: String,
      thumb: String
    }
  }
});

CampgroundSchema.post("findOneAndRemove", async (camp) => {
  if (camp.reviews.length) {
    const result = await Review.deleteMany({ _id: { $in: camp.reviews } });
    console.log(`Deleted ${result.deletedCount} reviews`);
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);