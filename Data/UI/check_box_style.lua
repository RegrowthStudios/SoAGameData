local CheckBoxStyle = {}

function CheckBoxStyle.set(c, text)
  CheckBox.setText(c, text)
  CheckBox.setTextColor(c, 255, 255, 255, 255)
  CheckBox.setBoxColor(c, 16, 190, 239, 60)
  CheckBox.setBoxHoverColor(c, 16, 190, 239, 100)
  CheckBox.setBoxCheckedColor(c, 16, 190, 239, 200)
  CheckBox.setBoxCheckedHoverColor(c, 16, 190, 239, 250)
  CheckBox.enable(c);
end

function CheckBoxStyle.setDisabled(c, text)
  CheckBox.setText(c, text)
  CheckBox.setTextColor(c, 128, 128, 128, 255)
  CheckBox.setBoxColor(c, 128, 128, 128, 60)
  CheckBox.setBoxHoverColor(c, 128, 128, 128, 100)
  CheckBox.setBoxCheckedColor(c, 128, 128, 128, 200)
  CheckBox.setBoxCheckedHoverColor(c, 128, 128, 128, 250)
  CheckBox.disable(c);
end

function CheckBoxStyle.make(name, text, callback)
  local c = Form.makeCheckBox(this, name, 0, 0, 30, 30)
  CheckBoxStyle.set(c, text)
  if string.len(callback) > 0 then
    CheckBox.addCallback(c, EventType.VALUE_CHANGE, callback)
  end
  return c
end

return CheckBoxStyle