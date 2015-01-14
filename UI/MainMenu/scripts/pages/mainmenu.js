$(function () {
    var lig = new ListItemGenerator();
    lig.generateClickable("New Game", "#", "", "Start a new game!");
    lig.generateClickable("Load Game", "#", "", "Load an old game!");
    lig.generateClickable("World Editor", "#", "", "Create your own game content!");
    lig.generateClickable("Mods", "#", "", "Install and organise your mods!");
    lig.generateSubList("Options", [{ type: "click", name: "Game Options", link: "#", description: "Change your gameplay options!" }, { type: "click", name: "Video Options", link: "#", description: "Change your video options!" }, { type: "click", name: "Audio Options", link: "#", description: "Change your audio options!" }, { type: "click", name: "Control Options", link: "#", description: "Change your control options!" }], "", "Get stuck into the options of the game!");
    lig.generateClickable("Credits", "#", "", "The creators of the game!");
    lig.generateClickable("Exit", "#", "", "Exit the game.");
});