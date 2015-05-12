
-- Button vars
br = 0
bg = 0
bb = 0
ba = 64
tr = 255
tg = 255
tb = 255
ta = 255
thr = 87
thg = 187
thb = 200
tha = 255
ts = 0.8 -- text scale

function initButton(b, text)
  Button.setTextColor(b, tr, tg, tb, ta)
  Button.setTextHoverColor(b, thr, thg, thb, tha)
  Button.setBackColor(b, br, bg, bb, ba);
  Button.setBackHoverColor(b, br, bg, bb, ba);
  Button.setText(b, text)
  Button.setTextScale(b, ts, ts)
  Button.setTextAlign(b, TextAlign.LEFT)
end

function init()
  
  bw = 600 -- button width
  bh = 40 -- button height
  bx = 60 -- button X
  bsy = 300 -- start Y
  yinc = bh + 1 -- Y increment
  
  -- All buttons
  controlsButton = Form.makeButton("ControlsButton", bx, bsy, bw, bh)
  initButton(controlsButton, "Controls")
  bsy = bsy + yinc
  
  optionsButton = Form.makeButton("OptionsButton", bx, bsy, bw, bh)
  initButton(optionsButton, "Options")
  bsy = bsy + yinc
  
  exitButton = Form.makeButton("ExitButton", bx, bsy, bw, bh)
  initButton(exitButton, "Exit")
  bsy = bsy + yinc
  
end

Vorb.register("init", init)