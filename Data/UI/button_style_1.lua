local ButtonStyle = {}

-- Background
local blr = 16
local blg = 190
local blb = 239
local bla = 166
local brr = 0
local brg = 0
local brb = 0
local bra = 0
local bhlr = 255
local bhlg = 255
local bhlb = 255
local grad = Graphics.GradientType.HORIZONTAL
-- Text
local tr = 255
local tg = 255
local tb = 255
local ta = 255
local thr = 87
local thg = 187
local thb = 200
local tha = 255
local ts = 0.8 -- text scale

function ButtonStyle.set(b, text)
  Button.setTextColor(b, tr, tg, tb, ta)
  Button.setTextHoverColor(b, thr, thg, thb, tha)
  Button.setBackColorGrad(b, blr, blg, blb, bla, brr, brg, brb, bra, grad);
  Button.setBackHoverColorGrad(b, bhlr, bhlg, bhlb, bla, brr, brg, brb, bra, grad);
  Button.setText(b, text)
  Button.setTextScale(b, ts, ts)
  Button.setTextAlign(b, Graphics.TextAlign.LEFT)
end

function ButtonStyle.make(name, text, callback)
  local b = UI.View.makeButton(this, name, 0, 0, 300, 50)
  ButtonStyle.set(b, text)
  if string.len(callback) > 0 then
    UI.Button.onMouseClick.subscribe(b, callback)
  end
  return b
end

return ButtonStyle
