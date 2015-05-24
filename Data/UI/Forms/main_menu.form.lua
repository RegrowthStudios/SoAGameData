ButtonStyle1 = require "Data/UI/button_style_1"

function onControlsClick()
  Options.beginContext()
  changeForm(ControlsForm)
end
Vorb.register("onControlsClick", onControlsClick)

function onOptionsClick()
  Options.beginContext()
  changeForm(GraphicsOptionsForm)
end
Vorb.register("onOptionsClick", onOptionsClick)

function onExitClick()
  Game.exit(0);
end
Vorb.register("onExitClick", onExitClick)

function init()
  Options.beginContext()
  -- Make other forms
  GraphicsOptionsForm = makeForm("GraphicsOptionsForm", "Data/UI/Forms/graphics_options.form.lua")
  ControlsForm = makeForm("ControlsForm", "Data/UI/Forms/controls.form.lua")
  GameOptionsForm = makeForm("GameOptionsForm", "Data/UI/Forms/game_options.form.lua")
  
  -- Overlay
  overlayForm = makeForm("PlanetOverlay", "Data/UI/Forms/planet_overlay.form.lua")
  
  bw = 800 -- button width
  bh = 40 -- button height
  bx = 60 -- button X
  bsy = 300 -- start Y
  yinc = bh + 1 -- Y increment
   
  -- All buttons
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
  
  enableForm(this) -- TODO(Ben): Potential bug here
end
Vorb.register("init", init)
