const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();  // To load .env variables

admin.initializeApp({
  credential: admin.credential.cert(require("serviceAccountKey.json")),
});

module.exports = admin;
