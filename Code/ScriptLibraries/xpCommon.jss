var MENUITEMS = [
	{"label": "All Documents", "page": "UnpMain.xsp", "icon": "application_home"},
	{"label": "By Diary Date", "page": "bydate.xsp", "icon": "calendar"},
	{"label": "By Category", "page": "bycategory.xsp", "icon": "sitemap"}
]

/*
 * Returns the name of the current XPage e.g. UnpMain.xsp
 */
function getCurrentXPage(){
	if (!viewScope.containsKey("currentxpage")){
		var url = context.getUrl().toString();
		url = @Left(url, ".xsp") + ".xsp";
		if (url.indexOf(".nsf/") > -1){
			url = @Right(url, ".nsf/");
		}else{
			url = @Right(url, ".unp/");
		}
		viewScope.currentxpage = url;
	}
	return viewScope.currentxpage;
}

/*
 * Returns the current db path in the format "/dir/mydb.nsf/"
 */
function getDbPath(){
	if (!applicationScope.containsKey("dbpath")){
		applicationScope.dbpath = "/" + @ReplaceSubstring(database.getFilePath(), "\\", "/") + "/";
	}
	return applicationScope.dbpath;
}

/*
 * Given a unid, populates the colAdded array with a list of unids that 
 * are descendents of the document
 */
function getAllDescendants(unid, colAllDescendants, colAdded){
	var colChildren = new Array();
	if (doc != null){
		colChildren = $A(@DbLookup(@DbName(), "Unp\\Documents\\Responses", unid, 2));
		if (@IsNotMember(unid, colAdded))
			colAdded.push(unid);
	}
	for (var i=0; i<colChildren.length; i++){
		var nextunid = colChildren[i];
		if (@IsNotMember(nextunid, colAdded)){
			colAdded.push(nextunid);
			getAllDescendants(nextunid, colAllDescendants, colAdded);
		}
	}
}

/*
 * Generic function which makes sure a return value from @DbLookup or @DbColumn
 * is always an array
 */
function $A( object ){
	if( typeof object === 'undefined' || object === null ){ return []; }
	if( typeof object === 'string' ){ return [ object ]; }
	if( typeof object.toArray !== 'undefined' ){
		return object.toArray();
	}
	if( object.constructor === Array ){ return object; }  
	return [ object ];
}