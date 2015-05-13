ButtonStyle = require "Data/UI/button_style"

function onControlsClick()
  makeForm("ControlsMenu", "Data/UI/Forms/controls.form.lua")
end

function init()

  bw = 600 -- button width
  bh = 40 -- button height
  bx = 60 -- button X
  bsy = 300 -- start Y
  yinc = bh + 1 -- Y increment
   
  -- All buttons
  controlsButton = Form.makeButton("ControlsButton", bx, bsy, bw, bh)
  ButtonStyle.set(controlsButton, "Controls")
  bsy = bsy + yinc
  Button.setCallback(controlsButton, EventType.MOUSE_CLICK, "onControlsClick");
  
  optionsButton = Form.makeButton("OptionsButton", bx, bsy, bw, bh)
  ButtonStyle.set(optionsButton, "Options")
  bsy = bsy + yinc
  
  exitButton = Form.makeButton("ExitButton", bx, bsy, bw, bh)
  ButtonStyle.set(exitButton, "Exit")
  bsy = bsy + yinc
  
end

Vorb.register("init", init)
Vorb.register("onControlsClick", onControlsClick)