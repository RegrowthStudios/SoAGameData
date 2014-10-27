// Any loadgame.html specific JS goes here
function loadGameEntry() {

    App.print("loadGameEntry()");

    // Get the array of saves
    var saves = App.getSaveFiles();

    // Get the save-games-wrapper
    var container = document.getElementById("save-games");

    var html = '';
    
    App.print("Creating saves list.");
    App.print("Size: " + saves.length);
    
    // Construct all the list elements
    for (var i = 0; i < saves.length; i += 2){
        html = html + "<li class='saveFile' name=" + saves[i] + ">"
        html = html + saves[i] + "<span class='save-game-data'>" + saves[i+1] + "</span></li>";
    }

    // Set the HTML
    container.innerHTML = html;

    // Set up the click function
    $(".saveFile").click(function() { loadGame($(this).attr("name")) });
    
    App.print("Finished creating list.");
}

function loadGame(fileName) {
    App.loadSaveGame(fileName);
}