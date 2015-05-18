local ComboBoxStyle = {}

function ComboBoxStyle.set(c)
  ComboBox.setTextColor(c, 255, 255, 255, 255)
  ComboBox.setTextScale(c, 0.6, 0.6)
  ComboBox.setTextAlign(c, TextAlign.LEFT)
  ComboBox.setBackColor(c, 128, 128, 128, 128)
  ComboBox.setBackHoverColor(c, 128, 128, 128, 255)
end

return ComboBoxStyle