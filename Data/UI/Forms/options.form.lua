ButtonStyle = require "Data/UI/button_style"

function onBackClick()
  Options.save(); -- TODO Prompt for save
  changeForm("main")
end
Vorb.register("onBackClick", onBackClick)

function onCancelClick()
  changeForm("main")
end
Vorb.register("onCancelClick", onCancelClick)

function onSaveClick()
  Options.save();
end
Vorb.register("onSaveClick", onSaveClick)

function init()
  
  bw = 600 -- button width
  bh = 40 -- button height
  bx = 60 -- button X
  bsy = 700 -- start Y
  yinc = bh + 1 -- Y increment
  
  -- Bottom buttons
  saveButton = Form.makeButton(this, "saveButton", bx, bsy, bw, bh)
  ButtonStyle.set(saveButton, "Save")
  Button.addCallback(saveButton, EventType.MOUSE_CLICK, "onSaveClick");
  bsy = bsy + yinc
  
  cancelButton = Form.makeButton(this, "CancelButton", bx, bsy, bw, bh)
  ButtonStyle.set(cancelButton, "Cancel")
  Button.addCallback(cancelButton, EventType.MOUSE_CLICK, "onCancelClick");
  bsy = bsy + yinc
  
  backButton = Form.makeButton(this, "BackButton", bx, bsy, bw, bh)
  ButtonStyle.set(backButton, "Back")
  Button.addCallback(backButton, EventType.MOUSE_CLICK, "onBackClick");
  bsy = bsy + yinc
  
end

Vorb.register("init", init)