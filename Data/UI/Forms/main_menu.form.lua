ButtonStyle = require "Data/UI/button_style"

ControlsForm = {}

function onControlsClick()
  changeForm("ControlsForm")
end
Vorb.register("onControlsClick", onControlsClick)

function onOptionsClick()
  Options.beginContext();
  Options.save();
end
Vorb.register("onOptionsClick", onOptionsClick)

function init()

  -- Make other forms
  ControlsForm = makeForm("ControlsForm", "Data/UI/Forms/controls.form.lua");
  Form.disable(ControlsForm)
  
  bw = 800 -- button width
  bh = 40 -- button height
  bx = 60 -- button X
  bsy = 300 -- start Y
  yinc = bh + 1 -- Y increment
   
  -- All buttons
  controlsButton = Form.makeButton(this, "ControlsButton", bx, bsy, bw, bh)
  ButtonStyle.set(controlsButton, "Controls")
  Button.addCallback(controlsButton, EventType.MOUSE_CLICK, "onControlsClick");
  bsy = bsy + yinc
  
  optionsButton = Form.makeButton(this, "OptionsButton", bx, bsy, bw, bh)
  ButtonStyle.set(optionsButton, "Options")
  Button.addCallback(optionsButton, EventType.MOUSE_CLICK, "onOptionsClick");
  bsy = bsy + yinc
  
  
  exitButton = Form.makeButton(this, "ExitButton", bx, bsy, bw, bh)
  ButtonStyle.set(exitButton, "Exit")
  bsy = bsy + yinc
  
end
Vorb.register("init", init)
