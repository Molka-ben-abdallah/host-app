const admin = require("firebase-admin");
const dotenv = require("dotenv");
dotenv.config(); 

admin.initializeApp({
  credential: admin.credential.cert("./config/serviceAccountKey.json"),
});

module.exports = admin;
