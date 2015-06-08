local ButtonStyle1 = require "Data/UI/button_style_1"
local SliderStyle = require "Data/UI/slider_style"
local LabelStyle = require "Data/UI/label_style"

local volumeLabel = {}

-- Options Changes
function onVolumeChange(i)
  volume = i / 100.0
  Options.setFloat("Music Volume", volume)
  Label.setText(volumeLabel, string.format("Music Volume: %.0f", i))
  Options.save()
end
Vorb.register("onVolumeChange", onVolumeChange)

function onGraphicsOptionsClick()
  Form.disable(this)
  enableForm("GraphicsOptionsForm")
end
Vorb.register("onGraphicsOptionsClick", onGraphicsOptionsClick)

function onBackClick()
  Options.save(); -- TODO Prompt for save?
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

-- Called if Options are changed on the C++ side.
function onOptionsChanged()
  setValues()
end
Vorb.register("onOptionsChanged", onOptionsChanged)

function setValues()
-- Gamma
  local volume = Options.getFloat("Music Volume")
  Slider.setValue(volumeSlider, volume * 100.0)
  Label.setText(volumeLabel, string.format("Volume: %.0f", volume * 100.0))
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

function alignLabel(l, p)
  Label.setPositionPercentage(l, 0.03, 0.5) 
  Label.setParent(l, p)
end

function init()
  Options.beginContext();
  
  -- Top buttons
  tbyp = 0.02 --Top button y percentage
  graphicsButton = ButtonStyle1.make("graphicsButton", "Graphics Options", "onGraphicsOptionsClick")
  Button.setPositionPercentage(graphicsButton, 0.49, tbyp) 
  Button.setBackColorGrad(graphicsButton, 255, 255, 255, 166, 0, 0, 0, 0, GradientType.HORIZONTAL);
  Button.setWidgetAlign(graphicsButton, WidgetAlign.TOP_RIGHT)
  
  gameButton = ButtonStyle1.make("gameButton", "Game Options", "")
  Button.setTextHoverColor(gameButton, 255, 255, 255, 255)
  Button.setTextScale(gameButton, 0.9, 0.9)
  Button.setBackHoverColorGrad(gameButton, 16, 190, 239, 166, 0, 0, 0, 0, GradientType.HORIZONTAL);
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
  
   -- Volume
  volumePanel = getNewListPanel()
  volumeSlider = SliderStyle.make("volumeSlider", 0, 100, "onVolumeChange")
  alignSlider(volumeSlider, volumePanel)

  volumeLabel = LabelStyle.make("volumeLabel", "")
  alignLabel(volumeLabel, volumePanel)
  
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
