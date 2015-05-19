ButtonStyle1 = require "Data/UI/button_style_1"
SliderStyle = require "Data/UI/slider_style"
CheckBoxStyle = require "Data/UI/check_box_style"
ComboBoxStyle = require "Data/UI/combo_box_style"
LabelStyle = require "Data/UI/label_style"

function onGraphicsOptionsClick()
  changeForm("GraphicsOptionsForm")
end
Vorb.register("onGraphicsOptionsClick", onGraphicsOptionsClick)

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

-- Rounds to a given number of decimal places
function round(num, idp)
  local mult = 10^(idp or 0)
  return math.floor(num * mult + 0.5) / mult
end

function setValues()

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
 
  setValues()
end

Vorb.register("init", init)
