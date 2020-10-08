local ButtonStyle1 = require "Data/UI/button_style_1"
local ButtonStyle2 = require "Data/UI/button_style_2"
local SliderStyle = require "Data/UI/slider_style"
local CheckBoxStyle = require "Data/UI/check_box_style"
local ComboBoxStyle = require "Data/UI/combo_box_style"
local LabelStyle = require "Data/UI/label_style"

local gammaSlider = {}
local gammaLabel = {}
local windowModeComboBox = {}
local widgetList = {}

local function onGameOptionsClick()
  Form.disable(this)
  enableForm("GameOptionsForm")
end
Vorb.register("onGameOptionsClick", onGameOptionsClick)

local function onBackClick()
  Form.disable(this)
  enableForm("main")
  enableForm("PlanetOverlay")
end
Vorb.register("onBackClick", onBackClick)

local function onRestoreClick()
  Options.restoreDefault()
  setValues()
end
Vorb.register("onRestoreClick", onRestoreClick)

-- Options Changes
local function onGammaChange(i)
  gamma = i / 1000.0
  Options.setFloat("Gamma", gamma)
  Label.setText(gammaLabel, string.format("Gamma: %.2f", gamma))
  Options.save()
end
Vorb.register("onGammaChange", onGammaChange)

local function onPlanetDetailChange(i)
  Options.setInt("Planet Detail", i)
  Slider.setValue(planetDetailSlider, i)
  Label.setText(planetDetailLabel, "Planet Detail: " .. i)
  Options.save()
end
Vorb.register("onPlanetDetailChange", onPlanetDetailChange)

local function onFovChange(i)
  Options.setFloat("FOV", i)
  Slider.setValue(fovSlider, i)
  Label.setText(fovLabel, "FOV: " .. i)
  Options.save()
  checkGreyControls()
end
Vorb.register("onFovChange", onFovChange)

local function onWindowedClick()
  Options.setBool("Fullscreen", false)
  Options.setBool("Borderless Window", false)
  Options.save()
  checkGreyControls()
end
Vorb.register("onWindowedClick", onWindowedClick)

local function onFullscreenClick()
  Options.setBool("Fullscreen", true)
  Options.setBool("Borderless Window", false)
  Options.save()
  checkGreyControls()
end
Vorb.register("onFullscreenClick", onFullscreenClick)

local function onBorderlessClick()
  Options.setBool("Fullscreen", false)
  Options.setBool("Borderless Window", true)
  Options.save()
  checkGreyControls()
end
Vorb.register("onBorderlessClick", onBorderlessClick)

local function checkGreyControls()
  local fs = Options.getBool("Fullscreen")
  local br = Options.getBool("Borderless Window")
  local c = 200
  local r = 16
  local g = 190
  local b = 239
  -- Need to grey out some controls when in fullscreen
  if fs == true then
	Button.setBackColor(fullscreenButton, c, c, c, 255)
    Button.setBackColor(borderlessButton, r, g, b, 255)
    Button.setBackColor(windowedButton, r, g, b, 255)
  elseif br == true then
    Button.setBackColor(borderlessButton, c, c, c, 255)
    Button.setBackColor(windowedButton, r, g, b, 255)
    Button.setBackColor(fullscreenButton, r, g, b, 255)
  else
    Button.setBackColor(windowedButton, c, c, c, 255)
    Button.setBackColor(borderlessButton, r, g, b, 255)
    Button.setBackColor(fullscreenButton, r, g, b, 255)
  end
end

local function onVsyncChange(b)
  Options.setBool("VSYNC", b)
  CheckBox.setChecked(vsyncCheckBox, b)
  Options.save()
end
Vorb.register("onVsyncChange", onVsyncChange)

local function onResolutionChange(s)
  local x, y = string.match(s, "(%d+) x (%d+)")
  Options.setInt("Screen Width", x)
  Options.setInt("Screen Height", y)
  Options.save()
end
Vorb.register("onResolutionChange", onResolutionChange)

-- Called if Options are changed on the C++ side.
local function onOptionsChanged()
  setValues()
end
Vorb.register("onOptionsChanged", onOptionsChanged)

local function setValues()
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
  
  -- Resolution
  local x, y = Window.getCurrentResolution()
  ComboBox.setText(resComboBox, x .. " x " .. y)
  
  checkGreyControls()
end

local function addWidgetToList(w)
  WidgetList.addItem(widgetList, w)
end

panelCounter = 0
local function getNewListPanel()
  local p = Form.makePanel(this, "Panel" .. panelCounter, 0, 0, 10, 10)
  panelCounter = panelCounter + 1
  Panel.setDimensionsPercentage(p, 1.0, 0.13)
  Panel.setClippingEnabled(p, false)
  addWidgetToList(p)
  return p
end

local function alignSlider(s, p)
  Slider.setWidthPercentage(s, 0.47)
  Slider.setPositionPercentage(s, 0.5, 0.5)
  Slider.setWidgetAlign(s, WidgetAlign.LEFT)
  Slider.setParent(s, p)
end

local function alignCheckBox(c, p)
  CheckBox.setPositionPercentage(c, 0.73, 0.5)
  CheckBox.setWidgetAlign(c, WidgetAlign.CENTER)
  CheckBox.setParent(c, p)
end

local function alignComboBox(c, p)
  ComboBox.setPositionPercentage(c, 0.73, 0.5)
  ComboBox.setWidgetAlign(c, WidgetAlign.CENTER)
  ComboBox.setParent(c, p)
end

local function alignLabel(l, p)
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
  
  -- Window Mode
  local w = 0.16
  local xp = 0.735
  local ts = 0.5
  windowModePanel = getNewListPanel()
  windowedButton = ButtonStyle2.make("windowedButton", "Windowed", "onWindowedClick")
  Button.setWidthPercentage(windowedButton, w)
  Button.setPositionPercentage(windowedButton, xp - w, 0.5)
  Button.setWidgetAlign(windowedButton, WidgetAlign.CENTER)
  Button.setTextAlign(windowedButton, TextAlign.CENTER)
  Button.setTextScale(windowedButton, ts, ts)
  Button.setParent(windowedButton, windowModePanel)
  fullscreenButton = ButtonStyle2.make("fullscreenButton", "Fullscreen", "onFullscreenClick")
  Button.setWidthPercentage(fullscreenButton, w)
  Button.setPositionPercentage(fullscreenButton, xp, 0.5)
  Button.setWidgetAlign(fullscreenButton, WidgetAlign.CENTER)
  Button.setTextAlign(fullscreenButton, TextAlign.CENTER)
  Button.setTextScale(fullscreenButton, ts, ts)
  Button.setParent(fullscreenButton, windowModePanel)
  borderlessButton = ButtonStyle2.make("borderlessButton", "Borderless", "onBorderlessClick")
  Button.setWidthPercentage(borderlessButton, w)
  Button.setPositionPercentage(borderlessButton, xp + w, 0.5)
  Button.setWidgetAlign(borderlessButton, WidgetAlign.CENTER)
  Button.setTextAlign(borderlessButton, TextAlign.CENTER)
  Button.setTextScale(borderlessButton, ts, ts)
  Button.setParent(borderlessButton, windowModePanel)
  
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
   -- ComboBox.addItem(resComboBox, x .. " x " .. y)
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
