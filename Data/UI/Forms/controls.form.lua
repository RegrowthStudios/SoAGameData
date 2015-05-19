ButtonStyle1 = require "Data/UI/button_style_1"
ButtonStyle2 = require "Data/UI/button_style_2"
LabelStyle = require "Data/UI/label_style"

function onBackClick()
  changeForm("main")
end

function onRestoreClick()

end
Vorb.register("onRestoreClick", onRestoreClick)

function addWidgetToList(w)
  WidgetList.addItem(widgetList, w)
end

panelCounter = 0
function getNewListPanel()
  local p = Form.makePanel(this, "Panel" .. panelCounter, 0, 0, 10, 10)
  panelCounter = panelCounter + 1
  Panel.setDimensionsPercentage(p, 1.0, 0.1)
  Panel.setClippingEnabled(p, false)
  addWidgetToList(p)
  return p
end

function alignLabel(l, p)
  Label.setPositionPercentage(l, 0.03, 0.5) 
  Label.setParent(l, p)
end

function alignButton(b, p)
  Button.setPositionPercentage(b, 0.7, 0.5) 
  Button.setWidthPercentage(b, 0.29)
  Button.setWidgetAlign(b, WidgetAlign.LEFT)
  Button.setParent(b, p)
end

function addControl(name, text, key)
  local p = getNewListPanel()
  local l = LabelStyle.make(name, text)
  alignLabel(l, p)
  
  local b = ButtonStyle2.make(name .. "Button", key, "")
  alignButton(b, p)
end

function init()
   -- Widget list
  widgetList = Form.makeWidgetList(this, "WidgetList", 0, 0, 1000, 1000)
  WidgetList.setBackColor(widgetList, 64, 64, 64, 128)
  WidgetList.setBackHoverColor(widgetList, 64, 64, 64, 128)
  WidgetList.setPositionPercentage(widgetList, 0.5, 0.1)
  WidgetList.setDimensionsPercentage(widgetList, 0.5, 0.85)
  WidgetList.setMinSize(widgetList, 500, 300)
  WidgetList.setMaxSize(widgetList, 1200, 800)
  WidgetList.setWidgetAlign(widgetList, WidgetAlign.TOP)
  
  addControl("A", "test1", "VKEY_LOL")
  addControl("B", "test2", "VKEY_:)")
  
   -- Bottom buttons
  bottomPanel = getNewListPanel()
  Panel.setMinSize(bottomPanel, 100.0, 100.0)
  backButton = ButtonStyle1.make("backButton", "Back", "onBackClick")
  Button.setPositionPercentage(backButton, 0.03, 0.0) 
  Button.setParent(backButton, bottomPanel)
  
  restoreButton = ButtonStyle1.make("restoreButton", "Restore Defaults", "onRestoreClick")
  Button.setPositionPercentage(restoreButton, 0.03, 0.5) 
  Button.setParent(restoreButton, bottomPanel)
end

Vorb.register("init", init)
Vorb.register("onBackClick", onBackClick)