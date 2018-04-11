var mongoose = require("mongoose");

var blogSchema = new mongoose.Schema({
	title: String,
	content: String,
	image: String,
	created: {type: Date, default: Date.now()},
	author: String,
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}]
});

var Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;