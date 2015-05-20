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
  Panel.setDimensionsPercentage(p, 1.0, 0.05)
  Panel.setClippingEnabled(p, false)
  Panel.setMinSize(p, 300, 50)
  addWidgetToList(p)
  return p
end

function alignLabel(l, p)
  Label.setPositionPercentage(l, 0.03, 0.5) 
  Label.setWidthPercentage(l, 0.65)
  Label.setParent(l, p)
end

function alignButton(b, p)
  Button.setPositionPercentage(b, 0.65, 0.5) 
  Button.setWidthPercentage(b, 0.29)
  Button.setHeightPercentage(b, 0.98)
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

function initControls()
  local numControls = Controls.size()
  local i = 0
  while i < numControls do
    local input = Controls.getInput(i)
	local name = Controls.getName(input)
	local key = Controls.getKeyString(input)
	addControl("Control" .. i, name, key)
	i = i + 1
  end
end

function init()
  -- Top Label
  topLabel = Form.makeLabel(this, "topLabel", 0, 0, 300, 100)
  LabelStyle.set(topLabel, "Controls") 
  Label.setWidgetAlign(topLabel, WidgetAlign.BOTTOM)
  Label.setTextAlign(topLabel, TextAlign.BOTTOM)
  Label.setTextScale(topLabel, 1.0, 1.0)
  Label.setPositionPercentage(topLabel, 0.5, 0.08)
  
  -- Widget list
  widgetList = Form.makeWidgetList(this, "widgetList", 0, 0, 1000, 1000)
  WidgetList.setBackColor(widgetList, 64, 64, 64, 128)
  WidgetList.setBackHoverColor(widgetList, 64, 64, 64, 128)
  WidgetList.setPositionPercentage(widgetList, 0.5, 0.08)
  WidgetList.setDimensionsPercentage(widgetList, 0.5, 0.79)
  WidgetList.setMinSize(widgetList, 500, 300)
  WidgetList.setMaxSize(widgetList, 1200, 1200)
  WidgetList.setWidgetAlign(widgetList, WidgetAlign.TOP)
  WidgetList.setAutoScroll(widgetList, true)
  
  initControls()
  
   -- Bottom buttons
  bottomPanel = Form.makePanel(this, "bottomPanel", 0, 0, 400, 100)
  Panel.setPositionPercentage(bottomPanel, 0.26, 0.88)
  Panel.setHeightPercentage(bottomPanel, 0.1)
  Panel.setMinSize(bottomPanel, 100.0, 60.0)
  backButton = ButtonStyle1.make("backButton", "Back", "onBackClick")
  Button.setPositionPercentage(backButton, 0.03, 0.0)
  Button.setHeightPercentage(backButton, 0.5)
  Button.setParent(backButton, bottomPanel)
  
  restoreButton = ButtonStyle1.make("restoreButton", "Restore Defaults", "onRestoreClick")
  Button.setPositionPercentage(restoreButton, 0.03, 0.5) 
  Button.setHeightPercentage(backButton, 0.5)
  Button.setParent(restoreButton, bottomPanel)
end

Vorb.register("init", init)
Vorb.register("onBackClick", onBackClick)