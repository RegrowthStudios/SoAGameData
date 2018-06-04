local ButtonStyle2 = require "Data/UI/button_style_2"
local LabelStyle = require "Data/UI/label_style"

function onBackClick()
  Form.disable(this)
  enableForm("main")
end
Vorb.register("onBackClick", onBackClick)

function onStartClick()
  newGame()
end
Vorb.register("onStartClick", onStartClick)

function init()
  local grey = 100
  mainPanel = Form.makePanel(this, "mainPanel", 0, 0, 10, 10)
  Panel.setColor(mainPanel, grey, grey, grey, grey)
  Panel.setHoverColor(mainPanel, grey, grey, grey, grey)
  Panel.setPositionPercentage(mainPanel, 0.02, 0.05)
  Panel.setDimensionsPercentage(mainPanel, 0.3, 0.9)
  Panel.setMinSize(mainPanel, 100, 300)
  
  buttonPanel = Form.makePanel(this, "buttonPanel", 0, 0, 0, 0)
  Panel.setPositionPercentage(buttonPanel, 0.1, 0.8)
  Panel.setDimensionsPercentage(buttonPanel, 0.8, 0.15)
  Panel.setParent(buttonPanel, mainPanel)
  
  -- Start game button TODO(Ben): Grey out button when it won't work
  startButton = ButtonStyle2.make("backButton", "Start Game", "onStartClick")
  Button.setPositionPercentage(startButton, 0.0, 0.0)
  Button.setDimensionsPercentage(startButton, 1.0, 0.5)
  Button.setParent(startButton, buttonPanel)
  -- Back button
  backButton = ButtonStyle2.make("backButton", "Back", "onBackClick")
  Button.setPositionPercentage(backButton, 0.0, 0.5)
  Button.setDimensionsPercentage(backButton, 1.0, 0.5)
  Button.setParent(backButton, buttonPanel)
  -- Spawn select label
  spawnLabel = LabelStyle.make("spawnLabel", "Click the planet to select a spawn point.")
  Label.setWidgetAlign(spawnLabel, WidgetAlign.CENTER)
  Label.setTextAlign(spawnLabel, TextAlign.CENTER)
  Label.setPositionPercentage(spawnLabel, 0.5, 0.9)
  Label.setTextScale(spawnLabel, 0.6, 0.6)
  Label.setDimensionsPercentage(spawnLabel, 0.34, 0.2)
end
Vorb.register("init", init)
