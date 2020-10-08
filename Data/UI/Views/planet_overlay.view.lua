local LabelStyle = require "Data/UI/label_style"

overlayView = UI.View.port

local nameLabel = {}

function addWidgetToList(widget)
  UI.WidgetList.addItem(widgetList, widget)
end

local panelCounter = 0
function newPanel()
  local panel = UI.View.makePanel(overlayView, "Overlay_Panel" .. panelCounter, 0, 0, 10, 10)
  UI.Panel.setRawSize(panel, 1.0, UI.DimensionType.VIEWPORT_WIDTH_PERCENTAGE, 10, UI.DimensionType.PIXEL)
  UI.Panel.setMinSize(panel, 300, 30)
  addWidgetToList(panel)

  local label = LabelStyle.make(panel, "Overlay_Label" .. panelCounter, "")
  panelCounter = panelCounter + 1
  alignLabel(label, panel)

  return { panel = panel, label = label }
end

function alignLabel(label, panel)
  UI.Label.setRawPosition(label, 0.03, UI.DimensionType.PARENT_WIDTH_PERCENTAGE,
                                 0.5,  UI.DimensionType.PARENT_HEIGHT_PERCENTAGE)
  UI.Label.setRawSize(label, 1.0, UI.DimensionType.PARENT_WIDTH_PERCENTAGE, 30, UI.DimensionType.PIXEL)
  UI.Label.setTextScale(label, 0.55, 0.55)
end

function updateUI(t) 
  if t == 0 then
    UI.disableView(overlayView)
  else
    UI.enableView(overlayView)
    UI.Label.setText(namePanel.label, Space.getBodyName(t))
    UI.Label.setText(typePanel.label, "Type: " .. Space.getBodyTypeName(t))
  
    local mass = Space.getBodyMass(t);
    UI.Label.setText(massPanel.label,         string.format("Mass: %.2e kg  /  %.4g earth masses", mass, mass / 5.97219e+24))
    UI.Label.setText(diameterPanel.label,     string.format("Diameter: %.0f km", Space.getBodyDiameter(t)))
    UI.Label.setText(rotPeriodPanel.label,    string.format("Rotational period: %.2f hours", Space.getBodyRotPeriod(t) / 3600.0))
    UI.Label.setText(orbPeriodPanel.label,    string.format("Orbital period: %.2f days", Space.getBodyOrbPeriod(t) / 86400.0))
    UI.Label.setText(tiltPanel.label,         string.format("Axial tilt: %.2f deg", Space.getBodyAxialTilt(t)))
    UI.Label.setText(eccentricityPanel.label, string.format("Eccentricity: %.4f", Space.getBodyEccentricity(t)))
    UI.Label.setText(inclinationPanel.label,  string.format("Inclination: %.2f deg", Space.getBodyInclination(t)))
    UI.Label.setText(semiMajorPanel.label,    string.format("Semi-major axis: %.0f km", Space.getBodySemiMajor(t)))
  
    local grav = Space.getGravityAccel(t);
    UI.Label.setText(gravityPanel.label, string.format("Surface gravity: %.2f g  /  %.2f m/s2", grav / 9.80665, grav))
    UI.Label.setText(densityPanel.label, string.format("Mean density: %.2f g/cm3", Space.getAverageDensity(t) / 1000))
    UI.Label.setText(parentPanel.label, "Parent: " .. Space.getBodyParentName(t))
  end
end

function onTargetChange(t)
  updateUI(t)
end
Vorb.register("onTargetChange", onTargetChange)

function init()
  
  -- Widget list
  widgetList = UI.View.makeWidgetList(overlayView, "Overlay_List", 0, 0, 1000, 1000)
  WidgetList.setRawPosition(widgetList, 0.7, UI.DimensionType.PARENT_WIDTH_PERCENTAGE, 0.03, UI.DimensionType.PARENT_HEIGHT_PERCENTAGE)
  WidgetList.setRawSize(widgetList, 0.5, UI.DimensionType.PARENT_WIDTH_PERCENTAGE, 0.9, UI.DimensionType.PARENT_HEIGHT_PERCENTAGE)
  WidgetList.setMinSize(widgetList, 300, 100)
  WidgetList.setAutoScroll(widgetList, true)
  
  namePanel = newPanel();
  UI.Label.setRawPosition(namePanel.label, 0.25, UI.DimensionType.PARENT_WIDTH_PERCENTAGE, 0, UI.DimensionType.PIXEL)
  -- UI.Label.setWidgetAlign(namePanel.label, WidgetAlign.CENTER)
  UI.Label.setTextAlign(namePanel.label, Graphics.TextAlign.CENTER)
  UI.Label.setTextScale(namePanel.label, 0.8, 0.8)
  
  typePanel         = newPanel()
  massPanel         = newPanel()
  diameterPanel     = newPanel()
  densityPanel      = newPanel()
  gravityPanel      = newPanel()
  tiltPanel         = newPanel()
  rotPeriodPanel    = newPanel()
  orbPeriodPanel    = newPanel()
  semiMajorPanel    = newPanel()
  eccentricityPanel = newPanel()
  inclinationPanel  = newPanel()
  parentPanel       = newPanel()

  updateUI(Space.getTargetBody())
end
-- RegisterFunction("init")

init()
