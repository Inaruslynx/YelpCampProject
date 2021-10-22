// Code I developed to work with Unsplash API and a very specific collection of photos

const nodeFetch = require("node-fetch");
const { createApi } = require("unsplash-js");

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS,
  fetch: nodeFetch
});
// This is the collection used to get campground photos
const collection = "483251";

// Code to get random photo with conditions (collectionID and number of photos):
// Will save to Mongo in campground and should only really need to be ran once to seed
exports.getCampPhoto = async (num) => {
  return await unsplash.photos.getRandom({
    collectionIds: [collection],
    count: num
  });
};

// Gets a specific photo from unsplash
// Doesn't matter what collection
exports.getData = async (photoId) => {
  return await unsplash.photos.get({ photoId });
};

// Get a single photo (from MongoDB photoId) will pass into render
exports.downloadCampPhoto = async (photoId) => {
  await unsplash.photos.get({ photoId: photoId }).then(async (result) => {
    if (result.type === "success") {
      const photo = result.response;
      return await unsplash.photos.trackDownload({
        downloadLocation: photo.links.download_location
      });
    } else {
      console.log("Unsplash error occured :", result.errors[0]);
    }
  });
};
