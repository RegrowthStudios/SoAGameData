$(function () {
    var lig = new ListItemGenerator();
    lig.generateClickable({ name: "New Game", link: "#", category: "", description: "Start a new game!" });
    lig.generateClickable({ name: "Load Game", link: "#", category: "", description: "Load an old game!" });
    lig.generateClickable({ name: "World Editor", link: "#", category: "", description: "Create your own game content!" });
    lig.generateClickable({ name: "Mods", link: "#", category: "", description: "Install and organise your mods!" });
    lig.generateSubList({ name: "Options", subItems: [{ type: "click", name: "Game Options", link: "#", description: "Change your gameplay options!" }, { type: "click", name: "Video Options", link: "#", description: "Change your video options!" }, { type: "click", name: "Audio Options", link: "#", description: "Change your audio options!" }, { type: "click", name: "Control Options", link: "#", description: "Change your control options!" }], category: "", description: "Get stuck into the options of the game!" });
    lig.generateClickable({ name: "Credits", link: "#", category: "", description: "Contributors to the game's creation!" });
    lig.generateClickable({ name: "Exit", link: "#", category: "", description: "Exits the game." });
});