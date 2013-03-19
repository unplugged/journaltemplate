/**
 * Copyright 2013 Teamstudio Inc 
 * Licensed under the Apache License, Version 2.0 (the "License"); 
 * you may not use this file except in compliance with the License. You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0 
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed 
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for 
 * the specific language governing permissions and limitations under the License
 */

$(window).load( function() {
	if (!unpluggedserver){
		for ( i=0; i<document.styleSheets.length; i++) {
			if (document.styleSheets.item(i).href.indexOf("defaultTheme.css") > -1 || document.styleSheets.item(i).href.indexOf("core.css") > -1){
				void(document.styleSheets.item(i).disabled=true);
			}
		}
	}
	
	$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
	allowFormsInIscroll();

	initiscroll();
	$("#menupane").addClass("offScreen");
	$('.viewsButton').unbind('click');
	$('.viewsButton').click( function(event) {
		toggleViewsMenu();
		return false;
	});
	try {
		$(".viewlink").each( function() {
			$(this).addEventListener("click", function() {
				$.blockUI();
			});
		});
	} catch (e) {
	}
	
	try{
		$(".opendialoglink").click( function (event){
			openDialog($(this).attr('href'));
		});
	}catch(e){
		
	}	
	
	initDeleteable();
});

$(window).scroll( function() {
	if ($(window).scrollTop() + $(window).height() == $(document).height()) {
		$(".loadmorebutton").click();
	}
});

window.addEventListener("orientationchange", function() {
	hideViewsMenu();
	initiscroll();
}, false);

function allowFormsInIscroll() {
	[].slice.call(document.querySelectorAll('input, select, button, textarea')).forEach(function(el) {
		el.addEventListener(
				('ontouchstart' in window) ? 'touchstart'
						: 'mousedown', function(e) {
					e.stopPropagation();
				})
	});
}

var firedrequests = new Array();
function stopViewSpinner() {
	$(".loadmorelink").disabled = false;
	$("#loadmorespinner").hide();
}

function loadmore(dbName, viewName, summarycol, detailcol, category, xpage,
		refreshmethod) {
	try {
		$(".loadmorelink").hide();
		$("#loadmorespinner").show();
		setTimeout("stopViewSpinner()", 5000);
		var itemlist = $("#flatViewRowSet li");
		var pos = itemlist.length - 1;
		for ( var i = 0; i < firedrequests.length; i++) {
			if (firedrequests[i] == pos) {
				$(".loadmorelink").show();
				$("#loadmorespinner").hide();
				return;
			}
		}
		firedrequests.push(pos);
		var thisArea = $(".summaryDataRow");
		var url = "UnpFlatViewList.xsp?chosenView="
				+ encodeURIComponent(viewName) + "&summarycol="
				+ encodeURIComponent(summarycol) + "&detailcol="
				+ encodeURIComponent(detailcol) + "&category="
				+ encodeURIComponent(category) + "&xpage=" + xpage
				+ "&dbName=" + dbName
				+ "&refreshmethod=" + refreshmethod + "&start=" + pos;
		thisArea.load(url + " #results", function() {
			$("#flatViewRowSet").append($(".summaryDataRow li"));
			if ($(".summaryDataRow").text().indexOf("NOMORERECORDS") > -1) {
				$("#pullUp").hide();
				$(".loadmorelink").hide();
				$("#loadmorespinner").hide();
			} else {
				$("#pullUp").show();
				$(".loadmorelink").show();
				$("#loadmorespinner").hide();
			}
			$(".summaryDataRow").empty();
			try {
				scrollContent.refresh();
			} catch (e) {
			}
			return false;
		});
	} catch (e) {
		// Do nothing
	}
}

function openDocument(url, target) {
	// $.blockUI();
	// document.location.href = url;
	var thisArea = $("#" + target);
	thisArea.load(url + " #contentwrapper",
			function() {

				if (firedrequests != null) {
					firedrequests = new Array();
				}
				initiscroll();
				if (url.indexOf("editDocument") > -1
						|| url.indexOf("newDocument") > -1) {
					allowFormsInIscroll();
					try {
						if ($('.richtextfield').val().indexOf("<") > -1) {
							var val = $($('.richtextfield').val()).text();
							$('.richtextfield').val(val);
						}
					} catch (e) {
					}
					
				}
				initDeleteable();
				return false;
			});
}

function saveDocument(formid, unid, viewxpagename, formname, parentunid, dbname) {
	try{
		scrollContent.scrollTo(0, -60, 0);
	}catch(e){}
	var data = $(".customform :input").serialize();
	var url = 'UnpSaveDocument.xsp?unid=' + unid + "&formname=" + formname
			+ "&rnd=" + Math.floor(Math.random() * 1001);
	if (parentunid){
		url += "&parentunid=" + parentunid;
	}
	if (dbname){
		url += "&dbname=" + dbname;
	}
	var valid = validate();
	if (valid) {
		$.ajax( {
			type : 'POST',
			url : url,
			data : data,
			cache : false,
			beforeSend : function() {
				console.log("About to open URL");
			}
		}).done(
				function(response) {
					console.log(response.length);
					if (response.length == 32) {
						//openDocument(
						//		viewxpagename
						//				+ "?action=openDocument&documentId="
						//				+ response, "content");
						//initiscroll();
						$.blockUI();
						window.location.href = "UnpMain.xsp";
					} else {
						alert(response);
					}
				});
	} else {
		return false;
	}
}

function validate() {
	var valid = true;
	$(".required").each( function() {
		if ($(this).val() == "") {
			var label = $("label[for='" + $(this).attr('id') + "']");
			alert("Please complete " + label.text());
			$(this).focus();
			valid = false;
		}
	})
	return valid;
}

function toggleViewsMenu() {
	if ($("#menuPane").hasClass("offScreen")) {
		$("#menuPane").removeClass("offScreen").addClass("onScreen");
		$("#menuPane").animate( {
			"left" : "+=700px"
		}, "slow");
		//$("#content").fadeOut();
	} else {
		$("#menuPane").removeClass("onScreen").addClass("offScreen");
		$("#menuPane").animate( {
			"left" : "-=700px"
		}, "slow");
		//$("#content").fadeIn();
	}
}

function hideViewsMenu() {
	if (!$("#menuPane").hasClass("offScreen")) {
		$("#menuPane").removeClass("onScreen").addClass("offScreen");
		$("#menuPane").animate( {
			"left" : "-=700px"
		}, "slow");
	}
	//$("#content").fadeIn();
}

var firedrequests;
function loadPage(url, target, menuitem) {
	var thisArea = $("#" + target);
	thisArea.load(url, function() {

		if (firedrequests != null) {
			firedrequests = new Array();
		}
		initiscroll();
		initDeleteable();
		return false;
	});
	var menuitems = $("#menuitems li");
	menuitems.removeClass("viewMenuItemSelected");
	menuitems.addClass("viewMenuItem");
	$(".menuitem" + menuitem).removeClass("viewMenuItem");
	$(".menuitem" + menuitem).addClass("viewMenuItemSelected");
	hideViewsMenu();
}

function openPage(url, target) {
	$.blockUI();
	document.location.href = url;
}

function initDeleteable(){
	try{
		$('input.deletable').wrap('<span class="deleteicon" />').after($('<span/>').click(function() {
            $(this).prev('input').val('').focus();
        }));
	}catch(e){
		
	}
}

var scrollContent;
var scrollMenu;
function initiscroll() {
	if (unpluggedserver){
		document.addEventListener('touchmove', function(e) {
			e.preventDefault()
		});
		// Initialise any iScroll that needs it
		try {
			pullUpEl = document.getElementById('pullUp');
			pullUpOffset = pullUpEl.offsetHeight;
		} catch (e) {
		}
		try {
			scrollContent.destroy();
			delete scrollContent;
		} catch (e) {
		}
		
		try {
			scrollMenu.destroy();
			delete scrollMenu;
		}catch(e){
		}
		try{
			scrollMenu = new iScroll('menu', {bounce: true, momentum: false});
		}catch(e){}
		
		$(".iscrollcontent")
				.each(
						function() {
							scrollContent = new iScroll(
									$(this).attr("id"),
									{
										useTransition : true,
										onRefresh : function() {
											if (pullUpEl) {
												if (pullUpEl.className
														.match('loading')) {
													pullUpEl.className = '';
													pullUpEl
															.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
												}
											}
										},
										onScrollMove : function() {
											if (pullUpEl) {
												if (this.y < (this.maxScrollY - 5)
														&& !pullUpEl.className
																.match('flip')) {
													pullUpEl.className = 'flip';
													pullUpEl
															.querySelector('.pullUpLabel').innerHTML = 'Release to refresh...';
													this.maxScrollY = this.maxScrollY;
												} else if (this.y > (this.maxScrollY + 5)
														&& pullUpEl.className
																.match('flip')) {
													pullUpEl.className = '';
													pullUpEl
															.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
													this.maxScrollY = pullUpOffset;
												}
											}
										},
										onScrollEnd : function() {
											if (pullUpEl) {
												if (pullUpEl.className
														.match('flip')) {
													pullUpEl.className = 'loading';
													pullUpEl
															.querySelector('.pullUpLabel').innerHTML = 'Loading...';
													$(".loadmorebutton").click();
												}
											}
										}
									});
						});
	}else{
		//alert("Not on unplugged so no iScroll");
	}
}

function openDialog(id){
	$(id).css('display', 'block');
	$("#adminCover").css('display', 'block');
	initiscroll();
}

function closeDialog(id){
	$(id).css('display', 'none');
	$("#adminCover").css('display', 'none');
	initiscroll();
}


function accordionLoadMore(obj, viewName, catName, xpage, dbname){
	
	var thisArea = $(obj).nextAll(".summaryDataRow:first").children(".accordionRowSet");		
	var pos = $(thisArea).find('li').length;
	thisArea.css('display','block');
	var thisUrl = "UnpAccordionViewList.xsp?chosenView=" + encodeURIComponent(viewName) + "&catFilter=" + encodeURIComponent(catName) + "&xpageDoc=" + xpage + "&start=" + pos + "&dbname=" + dbname; 
	
	var tempHolder = $(obj).nextAll(".summaryDataRow:first").children(".summaryDataRowHolder");
	$(tempHolder).load(thisUrl + " #results", function(){
		$(thisArea).append($(".summaryDataRow li"));
		if ($(tempHolder).text().indexOf("NOMORERECORDS") > -1){
			$(obj).nextAll(".summaryDataRow:first").children(".accLoadMoreLink").hide();
		}else{
			$(obj).nextAll(".summaryDataRow:first").children(".accLoadMoreLink").removeClass('hidden').show();	
		}
		$(tempHolder).empty();
		try{
			initiscroll();
		}catch(e){}
	});
	
	
	$(obj).addClass("accordianExpanded");
	$(obj).nextAll(".summaryDataRow:first").children(".accLoadMoreLink").show();

}

function fetchDetails(obj, viewName, catName, xpage, dbname)
{	
	$('.accordionRowSet').empty();
	$('.accLoadMoreLink').hide();
	
	console.log('Category: ' + catName);
	if($(obj).hasClass("accordianExpanded")){
		$(obj).nextAll('.summaryDataRow:first').children('.accordionRowSet').slideUp('fast', function(){ $(this).children().remove()});
		$(obj).removeClass("accordianExpanded");
		$(obj).nextAll('.summaryDataRow:first').children('.accLoadMoreLink').hide();
	}
	else{
		$('.categoryRow').removeClass("accordianExpanded");
		accordionLoadMore(obj, viewName, catName, xpage, dbname);
	}
}

function fetchMoreDetails(obj, viewName, catName, xpage, dbname){
	
	var objRow = $(obj).parent().parent().prev();
	accordionLoadMore(objRow, viewName, catName, xpage, dbname);	
}

function syncAllDbs(){
	$.blockUI({
		centerY: 0,
		css: { top: '10px', left: '10px', right: '' }
	});
	$.get("UnpSyncAll.xsp", function(data) {
		$.unblockUI();
		location.reload();
	});
}