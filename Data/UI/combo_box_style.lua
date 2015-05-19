local ComboBoxStyle = {}

function ComboBoxStyle.set(c)
  ComboBox.setTextColor(c, 255, 255, 255, 255)
  ComboBox.setTextScale(c, 0.6, 0.6)
  ComboBox.setTextAlign(c, TextAlign.LEFT)
  ComboBox.setBackColor(c, 128, 128, 128, 128)
  ComboBox.setBackHoverColor(c, 128, 128, 128, 255)
  ComboBox.enable(c)
end

function ComboBoxStyle.setDisabled(c)
  ComboBox.setTextColor(c, 128, 128, 128, 255)
  ComboBox.setTextHoverColor(c, 128, 128, 128, 255)
  ComboBox.setTextScale(c, 0.6, 0.6)
  ComboBox.setTextAlign(c, TextAlign.LEFT)
  ComboBox.setBackColor(c, 128, 128, 128, 128)
  ComboBox.setBackHoverColor(c, 128, 128, 128, 128)
  ComboBox.disable(c)
end

function ComboBoxStyle.make(name, text, callback)
  local c = Form.makeComboBox(this, name, 0, 0, 170, 40)
  ComboBoxStyle.set(c)
  ComboBox.setText(c, text)
  if string.len(callback) > 0 then
     ComboBox.addCallback(c, EventType.VALUE_CHANGE, callback)
  end
  return c
end

return ComboBoxStyle