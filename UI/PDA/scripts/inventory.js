// Any loadgame.html specific JS goes here
function inventoryEntry() {

    // Get the array of items
    var inventory = App.getInventory();

    // Get the save-games-wrapper
    var container = document.getElementById("item-list");

    var html = '';
    
    // Construct all the list elements
    for (var i = 0; i < inventory.length; i += 2){
        html = html + "<li class='item' name=" + inventory[i] + ">"
        html = html + inventory[i] + "<span class='item-data'>" + " x " + inventory[i+1] + "</span></li>";
    }

    // Set the HTML
    container.innerHTML = html;

    // Set up the click function
    $(".item").click(function() { selectItem($(this).attr("name")) });
    
    App.print("Finished creating list.");
}

function selectItem(name) {
    App.print(name);
}

function close() {
    window.location.href = 'index.html';
}
