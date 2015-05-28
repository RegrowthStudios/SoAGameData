local ButtonStyle1 = require "Data/UI/button_style_1"

function onNewGameClick()
  Options.beginContext()
  Form.disable(this)
  Form.enable(newGameForm)
end
Vorb.register("onNewGameClick", onNewGameClick)

function onControlsClick()
  Options.beginContext()
  Form.disable(this)
  Form.disable(overlayForm)
  Form.enable(controlsForm)
end
Vorb.register("onControlsClick", onControlsClick)

function onOptionsClick()
  Options.beginContext()
  Form.disable(this)
  Form.disable(overlayForm)
  Form.enable(graphicsOptionsForm)
end
Vorb.register("onOptionsClick", onOptionsClick)

function onExitClick()
  Game.exit(0);
end
Vorb.register("onExitClick", onExitClick)

function init()
  Options.beginContext()
  -- Make other forms
  newGameForm = makeForm("newGameForm",  "Data/UI/Forms/new_game.form.lua")
  graphicsOptionsForm = makeForm("graphicsOptionsForm", "Data/UI/Forms/graphics_options.form.lua")
  controlsForm = makeForm("controlsForm", "Data/UI/Forms/controls.form.lua")
  gameOptionsForm = makeForm("gameOptionsForm", "Data/UI/Forms/game_options.form.lua")
  
  -- Overlay
  overlayForm = makeForm("PlanetOverlay", "Data/UI/Forms/planet_overlay.form.lua")
  
  bw = 600 -- button width
  bh = 40 -- button height
  bx = 60 -- button X
  bsy = 60 -- start Y
  yinc = bh + 1 -- Y increment
   
  -- All buttons
  newGameButton = Form.makeButton(this, "newGameButton", bx, bsy, bw, bh)
  ButtonStyle1.set(newGameButton, "New Game")
  Button.addCallback(newGameButton, EventType.MOUSE_CLICK, "onNewGameClick")
  bsy = bsy + yinc
  
  controlsButton = Form.makeButton(this, "ControlsButton", bx, bsy, bw, bh)
  ButtonStyle1.set(controlsButton, "Controls")
  Button.addCallback(controlsButton, EventType.MOUSE_CLICK, "onControlsClick")
  bsy = bsy + yinc
  
  optionsButton = Form.makeButton(this, "OptionsButton", bx, bsy, bw, bh)
  ButtonStyle1.set(optionsButton, "Options")
  Button.addCallback(optionsButton, EventType.MOUSE_CLICK, "onOptionsClick")
  bsy = bsy + yinc
  
  exitButton = Form.makeButton(this, "ExitButton", bx, bsy, bw, bh)
  ButtonStyle1.set(exitButton, "Exit")
  Button.addCallback(exitButton, EventType.MOUSE_CLICK, "onExitClick")
  bsy = bsy + yinc
  
  Form.enable(this)
end
Vorb.register("init", init)
