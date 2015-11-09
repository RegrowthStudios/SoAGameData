function init()
  inventoryPanel = Form.makePanel(this, "inventoryPanel", 0, 0, 10, 10)
  Panel.setColor(inventoryPanel, 255, 0, 0, 255)
  Panel.setHoverColor(inventoryPanel, 100, 100, 100, 255)
  Panel.setPositionPercentage(inventoryPanel, 0.02, 0.05)
  Panel.setDimensionsPercentage(inventoryPanel, 0.3, 0.9)
  Panel.setMinSize(inventoryPanel, 100, 300)
end
Vorb.register("init", init)