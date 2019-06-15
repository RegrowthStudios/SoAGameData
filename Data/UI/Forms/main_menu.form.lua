function onNew(_, x, y, button, clicks)
    newGame()
end

local viewport=UI.View.port

UI.Viewport.setRawSize(viewport, 1.0, UI.DimensionType.WINDOW_WIDTH_PERCENTAGE, 1.0, UI.DimensionType.WINDOW_HEIGHT_PERCENTAGE)

local menu = UI.View.makePanel(viewport, "Menu", 0, 0, 0, 0)

UI.Panel.setColor(menu, 128, 128, 128, 64)
UI.Panel.setHoverColor(menu, 180, 180, 180, 64)
UI.Panel.setPosition(menu, 20, 20)
UI.Panel.setSize(menu, 620, 100)
UI.Panel.setPadding(menu, 10, 10, 10, 10)

bw = 600 -- button width
bh = 40 -- button height
bx = 0 -- button X
bsy = 0 -- start Y
yinc = bh -- Y increment

local label = UI.View.makeLabel(menu, "label", bx, bsy, bw, bh)

UI.Label.setText(label, "Click the planet to select a spawn point.")
bsy = bsy + yinc

local newGameButton=UI.View.makeButton(menu, "newGameButton", bx, bsy, bw, bh)

UI.Button.setText(newGameButton, "Start")
UI.Button.onMouseClick.subscribe(newGameButton, "onNew")

UI.enableView(viewport)

-- local ButtonStyle1 = require "Data/UI/button_style_1"
-- 
-- function onNewGameClick()
--   Options.beginContext()
--   Form.disable(this)
--   Form.enable(newGameForm)
-- end
-- -- Vorb.register("onNewGameClick", onNewGameClick)
-- -- RegisterFunction("onNewGameClick", onNewGameClick)
-- 
-- function onControlsClick()
--   Options.beginContext()
--   Form.disable(this)
--   Form.disable(overlayForm)
--   Form.enable(controlsForm)
-- end
-- --  -- RegisterFunction("onControlsClick", onControlsClick)
-- 
-- function onOptionsClick()
--   Options.beginContext()
--   Form.disable(this)
--   Form.disable(overlayForm)
--   Form.enable(graphicsOptionsForm)
-- end
-- -- RegisterFunction("onOptionsClick", onOptionsClick)
-- 
-- function onExitClick()
--   Game.exit(0);
-- end
-- -- RegisterFunction("onExitClick", onExitClick)
-- 
-- function init()
--   Options.beginContext()
--   -- Make other forms
--   newGameForm = makeForm("newGameForm",  "Data/UI/Forms/new_game.form.lua")
--   graphicsOptionsForm = makeForm("graphicsOptionsForm", "Data/UI/Forms/graphics_options.form.lua")
--   controlsForm = makeForm("controlsForm", "Data/UI/Forms/controls.form.lua")
--   gameOptionsForm = makeForm("gameOptionsForm", "Data/UI/Forms/game_options.form.lua")
--   
--   -- Overlay
--   overlayForm = makeForm("PlanetOverlay", "Data/UI/Forms/planet_overlay.form.lua")
--   
--   bw = 600 -- button width
--   bh = 40 -- button height
--   bx = 60 -- button X
--   bsy = 60 -- start Y
--   yinc = bh + 1 -- Y increment
--    
--   -- All buttons
--   newGameButton = Form.makeButton(this, "newGameButton", bx, bsy, bw, bh)
--   ButtonStyle1.set(newGameButton, "New Game")
--   Button.addCallback(newGameButton, EventType.MOUSE_CLICK, "onNewGameClick")
--   bsy = bsy + yinc
--   
--   controlsButton = Form.makeButton(this, "ControlsButton", bx, bsy, bw, bh)
--   ButtonStyle1.set(controlsButton, "Controls")
--   Button.addCallback(controlsButton, EventType.MOUSE_CLICK, "onControlsClick")
--   bsy = bsy + yinc
--   
--   optionsButton = Form.makeButton(this, "OptionsButton", bx, bsy, bw, bh)
--   ButtonStyle1.set(optionsButton, "Options")
--   Button.addCallback(optionsButton, EventType.MOUSE_CLICK, "onOptionsClick")
--   bsy = bsy + yinc
--   
--   exitButton = Form.makeButton(this, "ExitButton", bx, bsy, bw, bh)
--   ButtonStyle1.set(exitButton, "Exit")
--   Button.addCallback(exitButton, EventType.MOUSE_CLICK, "onExitClick")
--   bsy = bsy + yinc
--   
--   Form.enable(this)
-- end
-- -- RegisterFunction("init", init)
-- 