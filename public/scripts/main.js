$("#show-edit").click(function(){
	$("#edit-comment-form").show();
	$("#cancle-button").show();
	$("#show-edit").hide();
	$("#comment-text").hide();
	$("#delete-button").hide();
});

$("#cancle-button").click(function(){
	$("#edit-comment-form").hide();
	$("#cancle-button").hide();
	$("#show-edit").show();
	$("#comment-text").show();
	$("#delete-button").show();
});