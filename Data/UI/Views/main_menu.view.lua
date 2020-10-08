local ButtonStyle1 = require "Data/UI/button_style_1"

-- TODO(Matthew): Right now we batter globals to do all this... we want to really be using locals where possible & namespacing otherwise.

mainMenuView = UI.View.port

function onNewGameClick()
  Options.beginContext()
  UI.disableView(mainMenuView)
  UI.enableView(newGameView)
end

function onControlsClick()
  Options.beginContext()
  UI.disableView(mainMenuView)
  UI.disableView(overlayView)
  UI.enableView(controlsView)
end

function onOptionsClick()
  Options.beginContext()
  UI.disableView(mainMenuView)
  UI.disableView(overlayView)
  UI.enableView(graphicsOptionsView)
end

function onExitClick()
  Game.exit(0);
end

function init()
  Options.beginContext()

  -- Overlay
  overlayView = makeViewFromScript("PlanetOverlay", 0, "Data/UI/Views/planet_overlay.view.lua")

  -- Make other forms
  newGameView         = UI.makeViewFromScript("newGameView",         0, "Data/UI/Views/new_game.view.lua")
  graphicsOptionsView = UI.makeViewFromScript("graphicsOptionsView", 0, "Data/UI/Views/graphics_options.view.lua")
  controlsView        = UI.makeViewFromScript("controlsView",        0, "Data/UI/Views/controls.view.lua")
  gameOptionsView     = UI.makeViewFromScript("gameOptionsView",     0, "Data/UI/Views/game_options.view.lua")

  bw = 600 -- button width
  bh = 40 -- button height
  bx = 60 -- button X
  bsy = 60 -- start Y
  yinc = bh + 1 -- Y increment

  -- All buttons
  newGameButton = UI.View.makeButton(mainMenuView, "newGameButton", bx, bsy, bw, bh)
  ButtonStyle1.set(newGameButton, "New Game")
  UI.Button.onMouseClick.subscribe(newGameButton, "onNewGameClick")
  bsy = bsy + yinc
  
  controlsButton = UI.View.makeButton(mainMenuView, "ControlsButton", bx, bsy, bw, bh)
  ButtonStyle1.set(controlsButton, "Controls")
  UI.Button.onMouseClick.subscribe(controlsButton, "onControlsClick")
  bsy = bsy + yinc
  
  optionsButton = UI.View.makeButton(mainMenuView, "OptionsButton", bx, bsy, bw, bh)
  ButtonStyle1.set(optionsButton, "Options")
  UI.Button.onMouseClick.subscribe(optionsButton, "onOptionsClick")
  bsy = bsy + yinc
  
  exitButton = UI.View.makeButton(mainMenuView, "ExitButton", bx, bsy, bw, bh)
  ButtonStyle1.set(exitButton, "Exit")
  UI.Button.onMouseClick.subscribe(exitButton, "onExitClick")
  bsy = bsy + yinc
  
  UI.enableView(mainMenuView)
end
-- RegisterFunction("init")

-- Run initialisation.
init()
