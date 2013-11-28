$(window).load( function() {
	$( document ).ajaxComplete(function() {
		start();
	});
	QUnit.done(function( details ) {
		try{
			$('#qunit', window.parent.document).html("<h2>UPMark</h2><p>The results below describe how long a series of tests took to run on your device. The time the tests take are very hardware dependent, so different devices will see different results.</p>" + $("#qunit").html());
			$("#intro", window.parent.document).hide();
		}catch(e){
			
		}
	});
	var message;
	var starttime = Date.now();
	if (getURLParameter("starttime") != ""){
		starttime = parseInt(getURLParameter("starttime"), 10);
	}
	var endtime = Date.now();
	bLoaded = true;
	endtime = Date.now();
	test("Initial Page Load Time took " + (endtime - starttime) + "ms", 1, function(){
		ok(true);
	});
	test("open typography read", 1, function(){
		stop();
		$("#menuitems a").eq(2).click();
		ok(true);
	});
	test("open typography edit", 1, function(){
		stop();
		$("#menuitems a").eq(3).click();
		ok(true);
	});
	test("open flat view", 1, function(){
		stop();
		$("#menuitems a").eq(9).click();
		ok(true);
	});
	test("open first document in view", 1, function(){
		stop();
		$("#flatViewRowSet li.data-row").first().click();
		ok(true);
	});
	test("edit document", 1, function(){
		stop();
		$(".editButton").first().click();
		ok(true);
	});
	test("open filtered view", 1, function(){
		stop();
		$("#menuitems a").eq(10).click();
		ok(true);
	});
	test("open first document in view", 1, function(){
		stop();
		$("#flatViewRowSet li.data-row").eq(1).click();
		ok(true);
	});
	test("edit document", 1, function(){
		stop();
		$(".editButton").first().click();
		ok(true);
	});
	test("open form read", 1, function(){
		stop();
		$("#menuitems a").eq(14).click();
		ok(true);
	});
	test("open form edit", 1, function(){
		stop();
		$("#menuitems a").eq(15).click();
		ok(true);
	});
	test("open contacts by company", 1, function(){
		stop();
		$("#menuitems a").eq(18).click();
		ok(true);
	});
	test("open contacts", 1, function(){
		stop();
		$("#menuitems a").eq(19).click();
		ok(true);
	});
	test("open media library", 1, function(){
		stop();
		$("#menuitems a").eq(24).click();
		ok(true);
	});

});

function log(message){
	if (unpluggedserver) {
		alert(message);
	} else {
		console.log(message);
	}	
}