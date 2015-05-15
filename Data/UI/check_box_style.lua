local CheckboxStyle = {}

function CheckboxStyle.set(c, text)
  CheckBox.setText(c, text)
  CheckBox.setTextColor(c, 255, 255, 255, 255)
  CheckBox.setBoxColor(c, 16, 190, 239, 60)
  CheckBox.setBoxHoverColor(c, 16, 190, 239, 100)
  CheckBox.setBoxCheckedColor(c, 16, 190, 239, 200)
  CheckBox.setBoxCheckedHoverColor(c, 16, 190, 239, 250)
end

return CheckboxStyle