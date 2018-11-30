function UIPrint(_, x, y, button, clicks)
    C_Print("TEST")
    C_Print(tostring(x + y))
    C_Print(button)
end

local viewport = UI.View.port

UI.Viewport.setRawSize(viewport, 1.0, UI.DimensionType.WINDOW_WIDTH_PERCENTAGE, 1.0, UI.DimensionType.WINDOW_HEIGHT_PERCENTAGE)





local panel1 = UI.View.makePanel(viewport, "Panel1", 0, 0, 0, 0)
local panel2 = UI.View.makePanel(viewport, "Panel2", 0, 0, 0, 0)
local panel3 = UI.View.makePanel(viewport, "Panel3", 0, 0, 0, 0)
local panel4 = UI.View.makePanel(viewport, "Panel4", 0, 0, 0, 0)
local panel5 = UI.View.makePanel(viewport, "Panel5", 0, 0, 0, 0)

UI.Panel.setColor(panel1,      255,   0,   0, 255)
UI.Panel.setHoverColor(panel1,   0, 255,   0, 255)
UI.Panel.setColor(panel2,        0,   0, 255, 255)
UI.Panel.setHoverColor(panel2, 255, 255,   0, 255)
UI.Panel.setColor(panel3,      255,   0, 255, 255)
UI.Panel.setHoverColor(panel3,   0, 255, 255, 255)
UI.Panel.setColor(panel4,        0,   0,   0, 255)
UI.Panel.setHoverColor(panel4, 255, 255, 255, 255)
UI.Panel.setColor(panel5,      123,  34, 235, 255)
UI.Panel.setHoverColor(panel5, 234, 100,   0, 255)

UI.Panel.setZIndex(panel1, 1)
UI.Panel.setZIndex(panel2, 2)
UI.Panel.setZIndex(panel3, 3)
UI.Panel.setZIndex(panel4, 4)
UI.Panel.setZIndex(panel5, 5)

UI.Panel.setAutoScroll(panel1, true)
UI.Panel.setAutoScroll(panel2, true)
UI.Panel.setAutoScroll(panel3, true)
UI.Panel.setAutoScroll(panel4, true)
UI.Panel.setAutoScroll(panel5, true)

UI.Panel.setDockState(panel1, UI.DockState.BOTTOM)
UI.Panel.setDockState(panel2, UI.DockState.LEFT)
UI.Panel.setDockState(panel3, UI.DockState.LEFT)
UI.Panel.setDockState(panel4, UI.DockState.TOP)
UI.Panel.setDockState(panel5, UI.DockState.FILL)

UI.Panel.setRawDockSize(panel1, 0.25, UI.DimensionType.VIEWPORT_HEIGHT_PERCENTAGE)
UI.Panel.setRawDockSize(panel2, 0.2, UI.DimensionType.VIEWPORT_WIDTH_PERCENTAGE)
UI.Panel.setRawDockSize(panel3, 0.2, UI.DimensionType.VIEWPORT_WIDTH_PERCENTAGE)
UI.Panel.setRawDockSize(panel4, 0.25, UI.DimensionType.VIEWPORT_HEIGHT_PERCENTAGE)






local checkbox = UI.View.makeCheckBox(panel1, "CheckBox1", 30, 30, 150, 30)

UI.CheckBox.setPadding(checkbox, 10, 5, 10, 5)
UI.CheckBox.setText(checkbox, "Hello, World!")
UI.CheckBox.setTextScale(checkbox, 0.65, 0.65)
UI.CheckBox.setTextAlign(checkbox, Graphics.TextAlign.CENTER)
UI.CheckBox.setClipping(checkbox, UI.ClippingState.HIDDEN, UI.ClippingState.HIDDEN, UI.ClippingState.HIDDEN, UI.ClippingState.HIDDEN)






local label = UI.View.makeLabel(panel2, "Label1", 20, 15, 200, 50)

UI.Label.setText(label, "Hello, World!")
UI.Label.setTextScale(label, 0.6, 0.6)
UI.Label.setLabelColor(label, 0, 0, 255, 255)
UI.Label.setLabelHoverColor(label, 255, 0, 255, 255)
UI.Label.setPadding(label, 10, 5, 10, 5)
UI.Label.setTextAlign(label, Graphics.TextAlign.CENTER)





local button = UI.View.makeButton(panel3, "Button1", 60, 130, 120, 30)

UI.Button.setPadding(button, 10, 5, 10, 5)
UI.Button.setText(button, "Click Me!")
UI.Button.setTextScale(button, 0.65, 0.65)
UI.Button.setTextAlign(button, Graphics.TextAlign.CENTER)

UI.Button.onMouseClick.subscribe(button, "UIPrint")





local combobox = UI.View.makeComboBox(panel5, "ComboBox1", 60, 130, 170, 30)

UI.ComboBox.addItem(combobox, "This is One.")
UI.ComboBox.addItem(combobox, "This is Two.")
UI.ComboBox.addItem(combobox, "This is Three.")
UI.ComboBox.addItem(combobox, "This is Four.")

UI.ComboBox.setText(combobox, "Click Me!")
UI.ComboBox.setTextScale(combobox, 0.65, 0.65)
UI.ComboBox.setTextAlign(combobox, Graphics.TextAlign.CENTER)
UI.ComboBox.setBackColor(combobox, 20, 121, 232, 255)
UI.ComboBox.setBackHoverColor(combobox, 13, 42, 225, 255)
UI.ComboBox.setZIndex(combobox, 2)
UI.ComboBox.setMaxDropHeight(combobox, 90)
UI.ComboBox.selectItemAtIndex(combobox, 0)

UI.enableView(viewport)
