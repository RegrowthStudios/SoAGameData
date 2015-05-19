local ComboBoxStyle = {}

function ComboBoxStyle.set(c)
  ComboBox.setTextColor(c, 255, 255, 255, 255)
  ComboBox.setTextScale(c, 0.6, 0.6)
  ComboBox.setTextAlign(c, TextAlign.LEFT)
  ComboBox.setBackColor(c, 128, 128, 128, 128)
  ComboBox.setBackHoverColor(c, 128, 128, 128, 255)
end

function ComboBoxStyle.set(name, text, callback)
  c = Form.makeComboBox(this, name, 0, 0, 100, 40)
  ComboBoxStyle.set(c, text)
  if string.len(callback) > 0 then
     ComboBox.addCallback(c, EventType.VALUE_CHANGE, callback)
  end
  return c
end

return ComboBoxStyle