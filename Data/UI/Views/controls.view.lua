local ButtonStyle1 = require "Data/UI/button_style_1"
local ButtonStyle2 = require "Data/UI/button_style_2"
local LabelStyle = require "Data/UI/label_style"

controlsView = UI.View.port

function onBackClick()
  UI.disableView(controlsView)
  UI.enableView(mainMenuView)
  UI.enableView(overlayView)
end

function onRestoreClick()

end

function addWidgetToList(widget)
  UI.WidgetList.addItem(widgetList, widget)
end

panelCounter = 0
function getNewListPanel()
  local panel = UI.View.makePanel(this, "Panel", panelCounter, 0, 0, 10, 10)
  panelCounter = panelCounter + 1
  UI.Panel.setDimensionsPercentage(panel, 1.0, 0.05)
  UI.Panel.setMinSize(panel, 300, 50)
  addWidgetToList(panel)
  return p
end

function alignLabel(label, panel)
  UI.Label.setPositionPercentage(label, 0.03, 0.5) 
  UI.Label.setWidthPercentage(label, 0.65)
end

function alignButton(b, p)
  UI.Button.setPositionPercentage(b, 0.65, 0.5) 
  UI.Button.setWidthPercentage(b, 0.29)
  UI.Button.setHeightPercentage(b, 0.98)
  UI.Button.setWidgetAlign(b, WidgetAlign.LEFT)
  UI.Button.setParent(b, p)
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
  topLabel = UI.View.makeLabel(controlsView, "topLabel", 0, 0, 300, 100)
  LabelStyle.set(topLabel, "Controls") 
  UI.Label.setWidgetAlign(topLabel, WidgetAlign.BOTTOM)
  UI.Label.setTextAlign(topLabel, TextAlign.BOTTOM)
  UI.Label.setTextScale(topLabel, 1.0, 1.0)
  UI.Label.setPositionPercentage(topLabel, 0.5, 0.08)
  
  -- Widget list
  widgetList = Form.makeWidgetList(this, "widgetList", 0, 0, 1000, 1000)
  UI.WidgetList.setBackColor(widgetList, 64, 64, 64, 128)
  UI.WidgetList.setBackHoverColor(widgetList, 64, 64, 64, 128)
  UI.WidgetList.setPositionPercentage(widgetList, 0.5, 0.08)
  UI.WidgetList.setDimensionsPercentage(widgetList, 0.5, 0.79)
  UI.WidgetList.setMinSize(widgetList, 500, 300)
  UI.WidgetList.setMaxSize(widgetList, 1200, 1200)
  UI.WidgetList.setWidgetAlign(widgetList, WidgetAlign.TOP)
  UI.WidgetList.setAutoScroll(widgetList, true)
  
  local p = getNewListPanel()
  UI.Panel.setMinSize(p, 300, 60)
  local sorryLabel = LabelStyle.make("sorryLabel", "* You can't rebind controls yet, sorry! *")
  alignLabel(sorryLabel, p)
  UI.Label.setWidthPercentage(sorryLabel, 1.0)
  
  initControls()
  
   -- Bottom buttons
  bottomPanel = Form.makePanel(this, "bottomPanel", 0, 0, 400, 100)
  UI.Panel.setPositionPercentage(bottomPanel, 0.26, 0.88)
  UI.Panel.setHeightPercentage(bottomPanel, 0.1)
  UI.Panel.setMinSize(bottomPanel, 100.0, 60.0)
  backButton = ButtonStyle1.make("backButton", "Back", "onBackClick")
  UI.Button.setPositionPercentage(backButton, 0.03, 0.0)
  UI.Button.setHeightPercentage(backButton, 0.5)
  UI.Button.setParent(backButton, bottomPanel)
  
  restoreButton = ButtonStyle1.make("restoreButton", "Restore Defaults", "onRestoreClick")
  UI.Button.setPositionPercentage(restoreButton, 0.03, 0.5) 
  UI.Button.setHeightPercentage(backButton, 0.5)
  UI.Button.setParent(restoreButton, bottomPanel)
end

Vorb.register("init", init)
Vorb.register("onBackClick", onBackClick)