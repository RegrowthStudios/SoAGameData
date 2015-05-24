local LabelStyle = require "Data/UI/label_style"

local nameLabel = {}

function addWidgetToList(w)
  WidgetList.addItem(widgetList, w)
end

panelCounter = 0
function getNewListPanel()
  local p = Form.makePanel(this, "Panel" .. panelCounter, 0, 0, 10, 10)
  panelCounter = panelCounter + 1
  Panel.setWidthPercentage(p, 1.0)
  Panel.setClippingEnabled(p, false)
  Panel.setMinSize(p, 300, 30)
  addWidgetToList(p)
  return p
end

function alignLabel(l, p)
  Label.setPositionPercentage(l, 0.03, 0.5) 
  Label.setWidthPercentage(l, 0.65) 
  Label.setTextScale(l, 0.55, 0.55)
  Label.setParent(l, p)
end

function updateUI(t) 
  if t == 0 then
    Form.disable(this)
  else
    Form.enable(this)
    Label.setText(nameLabel, Space.getBodyName(t))
    Label.setText(massLabel, string.format("Mass : %.2e", Space.getBodyMass(t)))
    Label.setText(diameterLabel, string.format("Diameter (KM): %.2f", Space.getBodyDiameter(t)))
    Label.setText(rotPeriodLabel, string.format("Day (Hours): %.2f", Space.getBodyRotPeriod(t) / 3600.0))
    Label.setText(tiltLabel, string.format("Axial Tilt: %.2f", Space.getBodyAxialTilt(t)))
  end
end

function onTargetChange(t)
  updateUI(t)
end
Vorb.register("onTargetChange", onTargetChange)

function init()
  
  -- Widget list
  widgetList = Form.makeWidgetList(this, "widgetList", 0, 0, 1000, 1000)
  WidgetList.setPositionPercentage(widgetList, 0.7, 0.03)
  WidgetList.setDimensionsPercentage(widgetList, 0.3, 0.9)
  WidgetList.setMinSize(widgetList, 300, 100)
  WidgetList.setAutoScroll(widgetList, true)
  
  namePanel = getNewListPanel()
  nameLabel = LabelStyle.make("nameLabel", "")
  alignLabel(nameLabel, namePanel)
  Label.setXPercentage(nameLabel, 0.5)
  Label.setWidgetAlign(nameLabel, WidgetAlign.CENTER)
  Label.setTextAlign(nameLabel, TextAlign.CENTER)
  Label.setTextScale(nameLabel, 0.8, 0.8)
  
  diameterPanel = getNewListPanel()
  diameterLabel = LabelStyle.make("diameterLabel", "")
  alignLabel(diameterLabel, diameterPanel)
  
  massPanel = getNewListPanel()
  massLabel = LabelStyle.make("massLabel", "")
  alignLabel(massLabel, massPanel)
  
  rotPeriodPanel = getNewListPanel()
  rotPeriodLabel = LabelStyle.make("rotPeriodLabel", "")
  alignLabel(rotPeriodLabel, rotPeriodPanel)
  
  tiltPanel = getNewListPanel()
  tiltLabel = LabelStyle.make("tiltLabel", "")
  alignLabel(tiltLabel, tiltPanel)
  
  updateUI(Space.getTargetBody())
end

Vorb.register("init", init)
