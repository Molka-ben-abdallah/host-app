const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: "public_1SVgnVWtnYHHoE6s/0KNpgnRU24=",
  privateKey: "private_gKwKojEfUKvAQS9NbfC6H3l5S4A=",
  urlEndpoint: "https://ik.imagekit.io/molka/",
});

module.exports = imagekit;
