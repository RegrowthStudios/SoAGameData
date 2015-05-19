local LabelStyle = {}

function LabelStyle.set(l, text)
  Label.setText(l, text)
  Label.setTextScale(l, 0.8, 0.8)
  Label.setTextColor(l, 255, 255, 255, 255)
  Label.setWidgetAlign(l, WidgetAlign.LEFT)
  Label.setTextAlign(l, TextAlign.LEFT)
end

return LabelStyle