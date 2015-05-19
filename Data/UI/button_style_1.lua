local ButtonStyle = {}

-- Background
blr = 16
blg = 190
blb = 239
bla = 166
brr = 0
brg = 0
brb = 0
bra = 0
bhlr = 255
bhlg = 255
bhlb = 255
grad = GradientType.HORIZONTAL
-- Text
tr = 255
tg = 255
tb = 255
ta = 255
thr = 87
thg = 187
thb = 200
tha = 255
ts = 0.8 -- text scale

function ButtonStyle.set(b, text)
  Button.setTextColor(b, tr, tg, tb, ta)
  Button.setTextHoverColor(b, thr, thg, thb, tha)
  Button.setBackColorGrad(b, blr, blg, blb, bla, brr, brg, brb, bra, grad);
  Button.setBackHoverColorGrad(b, bhlr, bhlg, bhlb, bla, brr, brg, brb, bra, grad);
  Button.setText(b, text)
  Button.setTextScale(b, ts, ts)
  Button.setTextAlign(b, TextAlign.LEFT)
end

function ButtonStyle.make(name, text, callback)
  local b = Form.makeButton(this, name, 0, 0, 300, 50)
  ButtonStyle.set(b, text)
  if string.len(callback) > 0 then
    Button.addCallback(b, EventType.MOUSE_CLICK, callback)
  end
  return b
end

return ButtonStyle