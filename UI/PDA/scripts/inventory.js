// Any loadgame.html specific JS goes here
function inventoryEntry() {

	// Get the array of items
	var inventory = App.getInventory();
	
	// Get the save-games-wrapper
	var container = document.getElementById("item-list");

    // Construct all the list elements
    for (var i = 0; i < inventory.length; i += 2){
		addItem(inventory[i],inventory[i+1],inventory[i]);
    }
    App.print("Finished adding to list.");
}

function selectItem(name) {
    // 0 For left hand
    App.selectItem(0, name);
}

function close() {
    window.location.href = 'index.html';
}

//JereCode! BE WARNED
function render(){
	var iw = window.innerWidth-8;
	var ih = window.innerHeight-76;
	document.getElementById("ilist").style.width = iw+"px";
	document.getElementById("ilist").style.height = ih+"px";
}

//I generally have persistent values for timed functions defined immediately
//before the functions, these values are for the function that animates the searchbar expansion
var sb = false;
var searchw = 60;
var sbspd = 100;

//function for expanding the search bar
function sbar(){
	if(!sb){
		//console.log("");
		setTimeout("sbar()",1);
		//basic timed while loop
		var search = document.getElementById("search");
		var searchbar = document.getElementById("searchbar");
		var searchbox = document.getElementById("search_term");
		if(searchw < window.innerWidth-76){
			//smooth fade out
			searchw = sbspd+searchw+1;
			sbspd = sbspd/1.05;
			search.style.width = searchw+"px";
			if((searchw-60) > 0){
				searchbar.style.width = (searchw-66)+"px";
				searchbox.style.width = (searchw-76)+"px";
			}
		}else{
			sb = true;
			//account for the layout button
			searchw = (window.innerWidth-76);
			search.style.width = searchw+"px";
			if((searchw-60) > 0){
				searchbar.style.width = (searchw-66)+"px";
				searchbox.style.width = (searchw-76)+"px";
			}
			searchbox.focus();
		}
	}
	
}

setInterval("render()","16");	
var inventoryItems = [""];

//make nead 2D array!
function addItem(name,quantity,callbackName){
	var item = {};
	item["name"] = name;
	
	var qq = "";
	
	if(quantity > 1000){
		var testpoint = quantity/1000;
		if(testpoint > 1000){
			testpoint = testpoint/1000;
			if(testpoint > 1000){
				testpoint = testpoint/1000;
				qq = (testpoint+"").split(".")[0]+"G";
			}else{
				qq = (testpoint+"").split(".")[0]+"M";
			}
		}else{
			qq = (testpoint+"").split(".")[0]+"K";
		}
	}
	item["quantity"] = qq;
	item["callback"] = callbackName;
	inventoryItems[inventoryItems.length] = item;
	//broken
	inventoryItems.sort();
}

//default viewmode
var modx = "List";

//toggle viewmode
function tmode(){
	if(modx == "List"){
		modx = "Grid";
		document.getElementById("viewmode").style.backgroundImage = "url('assets/icons/list.png')"; 
	}else{
		modx = "List";
		document.getElementById("viewmode").style.backgroundImage = "url('assets/icons/grid.png')"; 
	}
} 

var id = '<div onmouseup="'+ "callback(event,'clickex')" +'" class="itemmodx"><div class="itemThumbmodx"></div> <div class="itemTextmodx">txt</div><div class="itemCountmodx">cnt</div></div>';
//render the item list every 150ms
function itlist(){
	var e = 1;
	//use a list so scrollbar persists
	var list = "";
	//get search_term
	var sq = document.getElementById("search_term").value.toLowerCase();
	//iterate through all inventory items but the first
	while(e<inventoryItems.length){
		//picking out a single item
		var item = inventoryItems[e];
		
		//hacky search function
		var add = false;
		if(sq != ""){
			if(item["name"].toLowerCase() != item["name"].toLowerCase().replace(sq,"")){
				add = true;
			}
		}else{
			//if no search term is defined, plan adding the item
			add = true;
		}
		
		//hacky tidyness function, replace the variables in the template and add it to the list string
		if(add){
			list+=id.replace("modx",modx).replace("modx",modx).replace("modx",modx).replace("modx",modx).replace("modx",modx).replace("clickex",item["callback"]).replace("txt",item["name"]).replace("cnt",item["quantity"]);
		}
		e++;
	}
	//push list
	if(document.getElementById("item-list-wrapper").innerHTML != list){
		document.getElementById("item-list-wrapper").innerHTML = list;
	}
}
//start render thread
setInterval("itlist()",150);

function callback(e,n){
	var a = 0;
	if((e.which || e.button) == 3){
		a = 1;
	}
    App.selectItem(a, n);
}