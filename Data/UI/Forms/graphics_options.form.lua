local ButtonStyle1 = require "Data/UI/button_style_1"
local SliderStyle = require "Data/UI/slider_style"
local CheckBoxStyle = require "Data/UI/check_box_style"
local ComboBoxStyle = require "Data/UI/combo_box_style"
local LabelStyle = require "Data/UI/label_style"

local gammaSlider = {}
local gammaLabel = {}
local windowModeComboBox = {}
local widgetList = {}

function onGameOptionsClick()
  Form.disable(this)
  enableForm("GameOptionsForm")
end
Vorb.register("onGameOptionsClick", onGameOptionsClick)

function onBackClick()
  Form.disable(this)
  enableForm("main")
  enableForm("PlanetOverlay")
end
Vorb.register("onBackClick", onBackClick)

function onRestoreClick()
  Options.restoreDefault()
  setValues()
end
Vorb.register("onRestoreClick", onRestoreClick)

-- Options Changes
function onGammaChange(i)
  gamma = i / 1000.0
  Options.setFloat("Gamma", gamma)
  Label.setText(gammaLabel, string.format("Gamma: %.2f", gamma))
  Options.save()
end
Vorb.register("onGammaChange", onGammaChange)

function onPlanetDetailChange(i)
  Options.setInt("Planet Detail", i)
  Slider.setValue(planetDetailSlider, i)
  Label.setText(planetDetailLabel, "Planet Detail: " .. i)
  Options.save()
end
Vorb.register("onPlanetDetailChange", onPlanetDetailChange)

function onFovChange(i)
  Options.setFloat("FOV", i)
  Slider.setValue(fovSlider, i)
  Label.setText(fovLabel, "FOV: " .. i)
  Options.save()
end
Vorb.register("onFovChange", onFovChange)

function onWindowModeChange(s)
  if s == "Fullscreen" then
    Options.setBool("Fullscreen", true)
	Options.setBool("Borderless Window", false)
  elseif s == "Borderless" then
    Options.setBool("Fullscreen", false)
	Options.setBool("Borderless Window", true)
  else
    Options.setBool("Fullscreen", false)
	Options.setBool("Borderless Window", false)
  end
  
  checkGreyControls()
  
  Options.save()
end
Vorb.register("onWindowModeChange", onWindowModeChange)

function checkGreyControls()
  local fs = Options.getBool("Fullscreen")
  -- Need to grey out some controls when in fullscreen
  if fs == true then
	ComboBoxStyle.setDisabled(resComboBox)
  else
	ComboBoxStyle.set(resComboBox)
  end
end

function onVsyncChange(b)
  Options.setBool("VSYNC", b)
  CheckBox.setChecked(vsyncCheckBox, b)
  Options.save()
end
Vorb.register("onVsyncChange", onVsyncChange)

function onResolutionChange(s)
  local x, y = string.match(s, "(%d+) x (%d+)")
  Options.setInt("Screen Width", x)
  Options.setInt("Screen Height", y)
  Options.save()
end
Vorb.register("onResolutionChange", onResolutionChange)

-- Called if Options are changed on the C++ side.
function onOptionsChanged()
  setValues()
end
Vorb.register("onOptionsChanged", onOptionsChanged)

function setValues()
  -- Gamma
  local gamma = Options.getFloat("Gamma")
  Slider.setValue(gammaSlider, gamma * 1000.0)
  Label.setText(gammaLabel, string.format("Gamma: %.2f", gamma))
  
  -- Planet Detail
  local planetDetail = Options.getInt("Planet Detail")
  Slider.setValue(planetDetailSlider, planetDetail)
  Label.setText(planetDetailLabel, "Planet Detail: " .. planetDetail)
  
  -- FOV
  local fov = Options.getFloat("FOV")
  Slider.setValue(fovSlider, fov)
  Label.setText(fovLabel, "FOV: " .. fov)
  
  -- Window Mode
  if Options.getBool("Fullscreen") == true then
    ComboBox.setText(windowModeComboBox, "Fullscreen")
  elseif Options.getBool("Borderless Window") == true then
    ComboBox.setText(windowModeComboBox, "Borderless")
  else
    ComboBox.setText(windowModeComboBox, "Windowed")
  end
  
  -- Resolution
  local x, y = Window.getCurrentResolution()
  ComboBox.setText(resComboBox, x .. " x " .. y)
  
  checkGreyControls()
end

function addWidgetToList(w)
  WidgetList.addItem(widgetList, w)
end

panelCounter = 0
function getNewListPanel()
  local p = Form.makePanel(this, "Panel" .. panelCounter, 0, 0, 10, 10)
  panelCounter = panelCounter + 1
  Panel.setDimensionsPercentage(p, 1.0, 0.13)
  Panel.setClippingEnabled(p, false)
  addWidgetToList(p)
  return p
end

function alignSlider(s, p)
  Slider.setWidthPercentage(s, 0.47)
  Slider.setPositionPercentage(s, 0.5, 0.5)
  Slider.setWidgetAlign(s, WidgetAlign.LEFT)
  Slider.setParent(s, p)
end

function alignCheckBox(c, p)
  CheckBox.setPositionPercentage(c, 0.73, 0.5)
  CheckBox.setWidgetAlign(c, WidgetAlign.CENTER)
  CheckBox.setParent(c, p)
end

function alignComboBox(c, p)
  ComboBox.setPositionPercentage(c, 0.73, 0.5)
  ComboBox.setWidgetAlign(c, WidgetAlign.CENTER)
  ComboBox.setParent(c, p)
end

function alignLabel(l, p)
  Label.setPositionPercentage(l, 0.03, 0.5) 
  Label.setParent(l, p)
end

function init()
  Options.beginContext();
  
  -- Top buttons
  local tbyp = 0.02 --Top button y percentage
  graphicsButton = ButtonStyle1.make("graphicsButton", "Graphics Options", "")
  Button.setTextHoverColor(graphicsButton, 255, 255, 255, 255)
  Button.setTextScale(graphicsButton, 0.9, 0.9)
  Button.setBackHoverColorGrad(graphicsButton, 16, 190, 239, 166, 0, 0, 0, 0, GradientType.HORIZONTAL);
  Button.setPositionPercentage(graphicsButton, 0.49, tbyp)
  Button.setWidgetAlign(graphicsButton, WidgetAlign.TOP_RIGHT)
 
  gameButton = ButtonStyle1.make("gameButton", "Game Options", "onGameOptionsClick")
  Button.setBackColorGrad(gameButton, 255, 255, 255, 166, 0, 0, 0, 0, GradientType.HORIZONTAL);
  Button.setPositionPercentage(gameButton, 0.51, tbyp)
  Button.setWidgetAlign(gameButton, WidgetAlign.TOP_LEFT)
  
  -- Widget list
  widgetList = Form.makeWidgetList(this, "WidgetList", 0, 0, 1000, 1000)
  WidgetList.setBackColor(widgetList, 64, 64, 64, 128)
  WidgetList.setBackHoverColor(widgetList, 64, 64, 64, 128)
  WidgetList.setPositionPercentage(widgetList, 0.5, 0.1)
  WidgetList.setDimensionsPercentage(widgetList, 0.5, 0.85)
  WidgetList.setMinSize(widgetList, 500, 300)
  WidgetList.setMaxSize(widgetList, 1200, 800)
  WidgetList.setWidgetAlign(widgetList, WidgetAlign.TOP)
  
  -- Gamma
  gammaPanel = getNewListPanel()
  gammaSlider = SliderStyle.make("gammaSlider", 100, 2500, "onGammaChange")
  alignSlider(gammaSlider, gammaPanel)

  gammaLabel = LabelStyle.make("gammaLabel", "")
  alignLabel(gammaLabel, gammaPanel)
  
  -- Planet Detail
  detailPanel = getNewListPanel()
  planetDetailSlider = SliderStyle.make("planetDetailSlider", 1, 6, "onPlanetDetailChange")
  alignSlider(planetDetailSlider, detailPanel)
  
  planetDetailLabel = LabelStyle.make("planetDetailLabel", "")
  alignLabel(planetDetailLabel, detailPanel)
  
  -- FOV
  fovPanel = getNewListPanel()
  fovSlider = SliderStyle.make("fovSlider", 60, 110, "onFovChange")
  alignSlider(fovSlider, fovPanel)
  
  fovLabel = LabelStyle.make("fovLabel", "")
  alignLabel(fovLabel, fovPanel)
  
   -- Fullscreen
  windowModePanel = getNewListPanel()
  windowModeComboBox = ComboBoxStyle.make("windowModeComboBox", "", "onWindowModeChange")
  ComboBox.addItem(windowModeComboBox, "Fullscreen")
  ComboBox.addItem(windowModeComboBox, "Borderless")
  ComboBox.addItem(windowModeComboBox, "Windowed")
  ComboBox.setMaxDropHeight(windowModeComboBox, 200.0)
  alignComboBox(windowModeComboBox, windowModePanel)
 
  windowModeLabel = LabelStyle.make("windowModeLabel", "Window Mode")
  alignLabel(windowModeLabel, windowModePanel)
 
  -- VSYNC
  vsyncPanel = getNewListPanel()
  vsyncCheckBox = CheckBoxStyle.make("vsyncCheckBox", "", "onVsyncChange")
  alignCheckBox(vsyncCheckBox, vsyncPanel)
  
  vsyncLabel = LabelStyle.make("vsyncLabel", "VSYNC")
  alignLabel(vsyncLabel, vsyncPanel)
 
  -- Resolution
  resPanel = getNewListPanel()
  resComboBox = ComboBoxStyle.make("resComboBox", "", "onResolutionChange")
  ComboBox.setMaxDropHeight(resComboBox, 200.0)
  numRes = Window.getNumSupportedResolutions()
  i = 0
  while i < numRes do
    x,y = Window.getSupportedResolution(i)
    ComboBox.addItem(resComboBox, x .. " x " .. y)
    i = i + 1
  end
  alignComboBox(resComboBox, resPanel)
  
  resLabel = LabelStyle.make("resLabel", "Screen Resolution")
  alignLabel(resLabel, resPanel)
 
  -- Bottom buttons
  bottomPanel = getNewListPanel()
  Panel.setMinSize(bottomPanel, 100.0, 100.0)
  backButton = ButtonStyle1.make("backButton", "Back", "onBackClick")
  Button.setPositionPercentage(backButton, 0.03, 0.0) 
  Button.setParent(backButton, bottomPanel)
  
  restoreButton = ButtonStyle1.make("restoreButton", "Restore Defaults", "onRestoreClick")
  Button.setPositionPercentage(restoreButton, 0.03, 0.5) 
  Button.setParent(restoreButton, bottomPanel)
  
  setValues()
end

Vorb.register("init", init)