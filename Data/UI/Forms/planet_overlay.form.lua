LabelStyle = require "Data/UI/label_style"

local nameLabel = {}

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
  Label.setTextScale(l, 0.55, 0.55)
  Label.setParent(l, p)
end

function updateUI(t) 
  if t == 0 then
    disableForm(this)
  else
    enableForm(this)
    Label.setText(nameLabel, Space.getBodyName(t))
    Label.setText(massLabel, Space.getBodyMass(t))
    Label.setText(diameterLabel, "Diameter (KM): " .. Space.getBodyDiameter(t))
    Label.setText(rotPeriodLabel, "Rotational Period (s): " .. Space.getBodyRotPeriod(t))
    Label.setText(tiltLabel, "Axial Tilt: " .. Space.getBodyAxialTilt(t))
  end
end

function onTargetChange(t)
  updateUI(t)
end
Vorb.register("onTargetChange", onTargetChange)

function init()
  
  -- Widget list
  widgetList = Form.makeWidgetList(this, "widgetList", 0, 0, 1000, 1000)
  WidgetList.setBackColor(widgetList, 64, 64, 64, 128)
  WidgetList.setBackHoverColor(widgetList, 64, 64, 64, 128)
  WidgetList.setPositionPercentage(widgetList, 0.7, 0.03)
  WidgetList.setDimensionsPercentage(widgetList, 0.3, 0.8)
  --WidgetList.setMinSize(widgetList, 100, 100)
  --WidgetList.setMaxSize(widgetList, 1200, 1200)
  WidgetList.setAutoScroll(widgetList, true)
  
  namePanel = getNewListPanel()
  nameLabel = LabelStyle.make("nameLabel", "Name Goes Here")
  alignLabel(nameLabel, namePanel)
  Label.setXPercentage(nameLabel, 0.5)
  Label.setWidgetAlign(nameLabel, WidgetAlign.CENTER)
  Label.setTextAlign(nameLabel, TextAlign.CENTER)
  Label.setTextScale(nameLabel, 0.8, 0.8)
  
  diameterPanel = getNewListPanel()
  diameterLabel = LabelStyle.make("diameterLabel", "Diameter (KM): ")
  alignLabel(diameterLabel, diameterPanel)
  
  massPanel = getNewListPanel()
  massLabel = LabelStyle.make("massLabel", "Mass (KG): ")
  alignLabel(massLabel, massPanel)
  
  rotPeriodPanel = getNewListPanel()
  rotPeriodLabel = LabelStyle.make("rotPeriodLabel", "Rotational Period (s): ")
  alignLabel(rotPeriodLabel, rotPeriodPanel)
  
  tiltPanel = getNewListPanel()
  tiltLabel = LabelStyle.make("tiltLabel", "Axial Tilt: ")
  alignLabel(tiltLabel, tiltPanel)
  
  updateUI(Space.getTargetBody())
end

Vorb.register("init", init)
