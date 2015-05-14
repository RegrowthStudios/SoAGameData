ButtonStyle = require "Data/UI/button_style"

function onBackClick()
  changeForm("main")
end

function init()
  
  bw = 600 -- button width
  bh = 40 -- button height
  bx = 60 -- button X
  bsy = 700 -- start Y
  yinc = bh + 1 -- Y increment
  
  -- All buttons
  backButton = Form.makeButton(this, "BackButton", bx, bsy, bw, bh)
  ButtonStyle.set(backButton, "Back")
  Button.addCallback(backButton, EventType.MOUSE_CLICK, "onBackClick");
  bsy = bsy + yinc
  
end

Vorb.register("init", init)
Vorb.register("onBackClick", onBackClick)