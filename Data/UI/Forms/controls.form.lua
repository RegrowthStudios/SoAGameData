ButtonStyle = require "Data/UI/button_style"

function init()
  
  bw = 600 -- button width
  bh = 40 -- button height
  bx = 60 -- button X
  bsy = 700 -- start Y
  yinc = bh + 1 -- Y increment
  
  -- All buttons
  backButton = Form.makeButton("BackButton", bx, bsy, bw, bh)
  ButtonStyle.set(backButton, "Back")
  bsy = bsy + yinc
  
end

Vorb.register("init", init)