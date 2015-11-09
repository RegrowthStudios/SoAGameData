local LabelStyle = require "Data/UI/label_style"

local itemLabelList = {}

function init()
  inventoryPanel = Form.makePanel(this, "inventoryPanel", 0, 0, 10, 10)
  Panel.setColor(inventoryPanel, 255, 0, 0, 255)
  Panel.setHoverColor(inventoryPanel, 100, 100, 100, 255)
  Panel.setPositionPercentage(inventoryPanel, 0.02, 0.05)
  Panel.setDimensionsPercentage(inventoryPanel, 0.3, 0.9)
  Panel.setMinSize(inventoryPanel, 100, 300)
  
  for i = 0, Inventory.getSize(), 1
  do
    addLabel(i, inventoryPanel)
  end
  
  Form.enable(this)
end
Vorb.register("init", init)

function addLabel(index, panel)
  item = Inventory.getItem(index)

  local itemLabel = LabelStyle.make(item.getName() + "Label", item.getName() + " description goes here.")
  Label.setWidgetAlign(itemLabel, WidgetAlign.CENTER)
  Label.setTextAlign(itemLabel, TextAlign.CENTER)
  Label.setPositionPercentage(itemLabel, 0.5, 0.9 - (0.1 * index))
  Label.setTextScale(itemLabel, 0.6, 0.6)
  Label.setDimensionsPercentage(itemLabel, 0.34, 0.09)
  Label.setParent(itemLabel, panel)
  
  itemLabelList[index] = itemLabel
end