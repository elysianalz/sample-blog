$("#show-edit").click(function(){
	$("#edit-comment-form").show();
	$("#cancle-button").show();
	$("#show-edit").hide();
});

$("#cancle-button").click(function(){
	$("#edit-comment-form").hide();
	$("#cancle-button").hide();
	$("#show-edit").show();
});