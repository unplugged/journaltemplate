/**
 * Copyright 2013 Teamstudio Inc 
 * Licensed under the Apache License, Version 2.0 (the "License"); 
 * you may not use this file except in compliance with the License. You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0 
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed 
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for 
 * the specific language governing permissions and limitations under the License
 */
/*
 * Force links to be opened inside the application if running from home screen
 */
if (("standalone" in window.navigator) && window.navigator.standalone) {
	var noddy, remotes = false;
	document
			.addEventListener(
					'click',
					function(event) {
						noddy = event.target;
						while (noddy.nodeName !== "A"
								&& noddy.nodeName !== "HTML") {
							noddy = noddy.parentNode;
						}
						if ('href' in noddy
								&& noddy.href.indexOf('http') !== -1
								&& (noddy.href.indexOf(document.location.host) !== -1 || remotes)) {
							event.preventDefault();
							document.location.href = noddy.href;
						}
					}, false);
}

$(window).bind('orientationchange', function(){
	//window.location.reload();
});
/*
 * Resize the menu bar on resize event
 */
$(window).bind('resize', function(){
});
$(document).delegate(
		'[data-role="page"]',
		'pageshow',
		function() {
			try{
				if ($('.bodyfield').val().indexOf("<") > -1){
					var val = $($('.bodyfield').val()).text();
					$('.bodyfield').val(val);
				}
			}catch(e){}
		});
/*
 * Add search functionality
 */
$(document).delegate('#searchbox', 'keypress', function(e) {
	console.log("event = " + e.keyCode);
	if(e.keyCode==13){
		var searchbox = $('.searchbox').each(function(index, element){
			if (element.value != ""){
				window.location = "search.xsp?query=" + element.value;
			}
		});
	}
}); 
$(document).delegate('#phonesearchbox', 'keypress', function(e) {
	console.log("event = " + e.keyCode);
	if(e.keyCode==13){
		var searchbox = $('.phonesearchbox').each(function(index, element){
			if (element.value != ""){
				window.location = "search.xsp?query=" + element.value;
			}
		});
	}
}); 
/*
 * Set page transition options
 */
$(document).bind('pageinit', function(){
	$.mobile.defaultPageTransition = "none";
	$.mobile.defaultDialogTransition = "none";
	$.mobile.buttonMarkup.hoverDelay = 0;
	$.mobile.useFastClick  = true;
});
$(document).bind("mobileinit", function(){
	$.mobile.defaultPageTransition="none";
	$.mobile.defaultDialogTransition = "none";
	$.mobile.buttonMarkup.hoverDelay = 0;
	$.mobile.useFastClick  = true;
});

function toggleMenu(){
	var header = $(".menuheader").each(function (index, element){
		if (element.className.indexOf("ui-collapsible-heading-collapsed") > -1){
			element.className = "menuheader ui-collapsible-heading";
		}else{
			element.className = "menuheader ui-collapsible-heading ui-collapsible-heading-collapsed";
		}
	});
	var body = $(".menubody").each(function (index, element){
		if (element.className.indexOf("ui-collapsible-content-collapsed") > -1){
			element.className = "menubody ui-collapsible-content";
		}else{
			element.className = "menubody ui-collapsible-content ui-collapsible-content-collapsed";
		}
	});
	$(".menuicon").each(function (index, element){
		if (element.className.indexOf("ui-icon-minus") > -1){
			element.className = "menuicon ui-icon ui-icon-shadow ui-icon-plus";
		}else{
			element.className = "menuicon ui-icon ui-icon-shadow ui-icon-minus";
		}
	});
}