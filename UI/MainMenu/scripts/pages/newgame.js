$(document).ready(function () {
    var lig = new ListItemGenerator();
    lig.createCategory("Game Details")
    lig.generateTextArea("Name", "New Game", 50, "Game Details", "The name of your new save game.");
});

function launchGame() {
    App.newSaveGame(document.getElementById('saveFileText').value);
}