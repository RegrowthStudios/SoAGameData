// Any loadgame.html specific JS goes here
function inventoryEntry() {

    // Get the array of items
  //  var inventory = App.getInventory();

    // Get the save-games-wrapper
 //   var container = document.getElementById("item-list");

 //   var html = '';
    
    // Construct all the list elements
//    for (var i = 0; i < inventory.length; i += 2){
 //       html = html + "<li class='item' name=" + inventory[i] + ">"
 //       html = html + inventory[i] + "<span class='item-data'>" + " x " + inventory[i+1] + "</span></li>";
  //  }

    // Set the HTML
   // container.innerHTML = html;

    // Set up the click function
  //  $(".item").click(function() { selectItem($(this).attr("name")) });
    
 //   App.print("Finished creating list.");
}

function selectItem(name) {
    App.print(name);
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
	
	var sb = false;
	
	var searchw = 60;
	var sbspd = 100;
	
	function sbar(){
		if(!sb){
			console.log("");
			setTimeout("sbar()",1);
			
			var search = document.getElementById("search");
			var searchbar = document.getElementById("searchbar");
			var searchbox = document.getElementById("search_term");
			if(searchw < window.innerWidth-76){
				searchw = sbspd+searchw+1;
				sbspd = sbspd/1.05;
				search.style.width = searchw+"px";
				if((searchw-60) > 0){
					searchbar.style.width = (searchw-66)+"px";
					searchbox.style.width = (searchw-76)+"px";
				}
			}else{
				sb = true;
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
	
	function addItem(name,quantity,callbackName){
		var item = {};
		item["name"] = name;
		item["quantity"] = quantity;
		item["callback"] = callbackName;
		inventoryItems[inventoryItems.length] = item;
		inventoryItems.sort();
	}
	
	function tmode(){
		if(modx == "List"){
			modx = "Grid";
			document.getElementById("viewmode").style.backgroundImage = "url('assets/icons/list.png')"; 
		}else{
			modx = "List";
			document.getElementById("viewmode").style.backgroundImage = "url('assets/icons/grid.png')"; 
		}
	}
	
	var modx = "List";
	
	var id = '<div onclick="'+ "selectItem('clickex')" +'" class="itemmodx"><div class="itemThumbmodx"></div> <div class="itemTextmodx">txt</div><div class="itemCountmodx">cnt</div></div>';
	
	function itlist(){
		var e = 1;
		var list = "";
		while(e<inventoryItems.length){
			var item = inventoryItems[e];
			var sq = document.getElementById("search_term").value.toLowerCase();
			var add = false;
			if(sq != ""){
				if(item["name"].toLowerCase() != item["name"].toLowerCase().replace(sq,"")){
					add = true;
				}
			}else{
				add = true;
			}
			
			if(add){
				list+=id.replace("modx",modx).replace("modx",modx).replace("modx",modx).replace("modx",modx).replace("modx",modx).replace("clickex",item["callback"]).replace("txt",item["name"]).replace("cnt",item["quantity"]);
			}
			
			e++;
		}
		document.getElementById("item-list-wrapper").innerHTML = list;
	}
	
	setInterval("itlist()",600);
	
	
	
addItem("HardWood","1");
addItem("Bricks","46");
addItem("Stone","277");
addItem("Dirt","1K");
addItem("Gravel","25");	
