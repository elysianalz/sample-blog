var mongoose = require("mongoose");

var aboutSchema = new mongoose.Schema({
	image: String,
	content: String
});

var About = mongoose.model("About", aboutSchema);

module.exports = About;