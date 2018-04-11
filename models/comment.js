var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
	author: String,
	text: String,
	created: {type: Date, default: Date.now()}
});

var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;