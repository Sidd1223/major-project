const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listiing.js");
const { init } = require("../models/review.js");
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main()
 .then(() => {
    console.log("connect to DB");
})
.catch((err) => {
    console.log(err);
});
async function main() {
    await mongoose.connect(MONGO_URL);
}
const initDB = async() => {
   await  Listing.deleteMany({});
   initdata.data = initdata.data.map((obj) => ({ ...obj, owner: "6987f057b5e5ba3ce5a5035e"}));
   

   
   await Listing.insertMany(initdata.data);
   console.log("data was initialized");

};

initDB();