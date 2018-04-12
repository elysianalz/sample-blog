
//show and hide edit buttons and forms
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
/////////////////////////////////////

//edit/create about me page functionality
$("#create-about").click(function(){
	$("#create-about-form").show();
});

$("#edit-about").click(function(){
	$("#edit-about-form").show();
	$("#about-me").hide();
});

////////////////////////////////////////

//add and remove active class on navbar


//////////////////////////////////////