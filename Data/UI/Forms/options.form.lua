ButtonStyle = require "Data/UI/button_style"
SliderStyle = require "Data/UI/slider_style"
CheckBoxStyle = require "Data/UI/check_box_style"
ComboBoxStyle = require "Data/UI/combo_box_style"

-- Controls objects -- Is this optional????
gammaSlider = {}
gammaLabel = {}
fullscreenCheckBox = {}
borderlessCheckBox = {}
widgetList = {}

function onBackClick()
  Options.save(); -- TODO Prompt for save
  changeForm("main")
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
  Label.setText(gammaLabel, "Gamma: " .. round(gamma, 2))
  Options.save()
end
Vorb.register("onGammaChange", onGammaChange)

function onFullscreenChange(b)
  Options.setBool("Fullscreen", b)
  CheckBox.setChecked(fullscreenCheckBox, b)
  Options.save()
end
Vorb.register("onFullscreenChange", onFullscreenChange)

function onBorderlessChange(b)
  Options.setBool("Borderless Window", b)
  CheckBox.setChecked(borderlessCheckBox, b)
  Options.save()
end
Vorb.register("onBorderlessChange", onBorderlessChange)

function onResolutionChange(s)
  x, y = string.match(s, "(%d+) x (%d+)")
  Options.setInt("Screen Width", x)
  Options.setInt("Screen Height", y)
  Options.save()
end
Vorb.register("onResolutionChange", onResolutionChange)

-- Rounds to a given number of decimal places
function round(num, idp)
  local mult = 10^(idp or 0)
  return math.floor(num * mult + 0.5) / mult
end

function setValues()
  -- Gamma
  gamma = Options.getFloat("Gamma")
  Slider.setValue(gammaSlider, gamma * 1000.0)
  CheckBox.setChecked(fullscreenCheckBox, Options.getBool("Fullscreen"))
  CheckBox.setChecked(borderlessCheckBox, Options.getBool("Borderless Window"))
  -- Resolution
  x, y = Window.getCurrentResolution()
  ComboBox.setText(resComboBox, x .. " x " .. y)
end

function addWidgetToList(w)
  WidgetList.addItem(widgetList, w)
end

panelCounter = 0
function getNewListPanel()
  p = Form.makePanel(this, "Panel" .. panelCounter, 0, 0, 10, 10)
  panelCounter = panelCounter + 1
  Panel.setDimensionsPercentage(p, 1.0, 0.1)
  addWidgetToList(p)
  return p
end

function init()
  Options.beginContext();
  bw = 600 -- button width
  bh = 40 -- button height
  bx = 60 -- button X
  bsy = 700 -- start Y
  yinc = bh + 1 -- Y increment
  
  widgetList = Form.makeWidgetList(this, "WidgetList", 0, 0, 1000, 1000)
  WidgetList.setBackColor(widgetList, 128, 128, 128, 128)
  WidgetList.setPositionPercentage(widgetList, 0.1, 0.1)
  WidgetList.setDimensionsPercentage(widgetList, 0.5, 0.85)
  
  -- Bottom buttons
  backButton = Form.makeButton(this, "BackButton", 0, 200, bw, bh)
  ButtonStyle.set(backButton, "Back")
  Button.addCallback(backButton, EventType.MOUSE_CLICK, "onBackClick")
  bsy = bsy + yinc
  
  restoreButton = Form.makeButton(this, "RestoreButton", bx, bsy, bw, bh)
  ButtonStyle.set(restoreButton, "Restore Defaults")
  Button.addCallback(restoreButton, EventType.MOUSE_CLICK, "onRestoreClick")
  bsy = bsy + yinc
  
  -- Gamma
  gammaPanel = getNewListPanel()
  Panel.setColor(gammaPanel, 255, 0, 0, 255)
  gamma = Options.getFloat("Gamma")
  gammaSlider = Form.makeSlider(this, "GammaSlider", 0, 0, 500, 15)
  SliderStyle.set(gammaSlider)
  Slider.setRange(gammaSlider, 100, 2500)
  Slider.addCallback(gammaSlider, EventType.VALUE_CHANGE, "onGammaChange")
  Slider.setSlideDimensions(gammaSlider, 30, 15)
  Slider.setWidthPercentage(gammaSlider, 0.49)
  Slider.setPositionPercentage(gammaSlider, 0.5, 0.5)
  Slider.setWidgetAlign(gammaSlider, WidgetAlign.LEFT)
  Slider.setParent(gammaSlider, gammaPanel)
  
  gammaLabel = Form.makeLabel(this, "GammaLabel", 0, 0, 200, 20)
  Label.setText(gammaLabel, "Gamma: " .. round(gamma, 2))
  Label.setTextScale(gammaLabel, 0.8, 0.8)
  Label.setTextColor(gammaLabel, 255, 255, 255, 255)
  Label.setPositionPercentage(gammaLabel, 0.1, 0.5)
  Label.setParent(gammaLabel, gammaPanel)
  Label.setWidgetAlign(gammaLabel, WidgetAlign.LEFT)
  Label.setTextAlign(gammaLabel, TextAlign.LEFT)
  
  -- Borderless
  borderlessCheckBox = Form.makeCheckBox(this, "BorderlessCheckBox", 800, 50, 30, 30)
  CheckBoxStyle.set(borderlessCheckBox, "Borderless Window")
  CheckBox.addCallback(borderlessCheckBox, EventType.VALUE_CHANGE, "onBorderlessChange")
  -- Fullscreen
  fullscreenCheckBox = Form.makeCheckBox(this, "FullscreenCheckBox", 800, 90, 30, 30)
  CheckBoxStyle.set(fullscreenCheckBox, "Fullscreen")
  CheckBox.addCallback(fullscreenCheckBox, EventType.VALUE_CHANGE, "onFullscreenChange")
  -- Resolution
  resComboBox = Form.makeComboBox(this, "ResComboBox", 1300, 50, 200, 40)
  ComboBoxStyle.set(resComboBox)
  ComboBox.setMaxDropHeight(resComboBox, 200.0)
  ComboBox.addCallback(resComboBox, EventType.VALUE_CHANGE, "onResolutionChange")
  numRes = Window.getNumSupportedResolutions()
  i = 0
  while i < numRes do
    x,y = Window.getSupportedResolution(i)
    ComboBox.addItem(resComboBox, x .. " x " .. y)
    i = i + 1
  end
 
  setValues()
end

Vorb.register("init", init)
