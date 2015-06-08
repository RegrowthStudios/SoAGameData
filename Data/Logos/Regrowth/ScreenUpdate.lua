--[[
Access to window size is provided:
 * (Number) WindowWidth
 * (Number) WindowHeight
]]--

-- A slowing-down tween
function lerpSin(a, b, t)
  local newT = math.sin(t * 1.570795)
  return (b - a) * newT + a
end

local totalLength = 6.0
local finalFadeLength = 0.6

-- Maximum duration of the screen
Vorb.register("Regrowth.MaxDuration", function ()
  return totalLength
end)

local scale
-- Texture dimensions
local rWidth = 1908.0
local rHeight = 255.0
local sWidth = 861.0
local sHeight = 109.0

local function finalFade(totalTime)
  return math.max(0.0, math.min(1.0, (totalLength - totalTime) / finalFadeLength))
end

-- Maximum duration of the screen
Vorb.register("Regrowth.Scale", function ()
  scale = 0.8 * (WindowWidth / 1908.0)
  return scale
end)

-- Screen's background color
Vorb.register("Regrowth.BackgroundColor", function (t)
  local val = math.max(0.0, 1.0 - t * 2.0)
  return val, val, val, 1.0
end)

-- Individual pos/color update functions
local function posR (totalTime)
  return (-rWidth * scale + WindowWidth) / 2.0, (-rHeight * scale + WindowHeight) / 2.5
end
local function colorR (totalTime)
  local opacity = math.min(finalFade(totalTime), math.max(0.0, (totalTime - 0.5) / 1.0))
  return 1.0, 1.0, 1.0, opacity
end

local function posS (totalTime)
  local x, y = posR(totalTime)
  x = x + rWidth * scale - sWidth * scale + lerpSin(sWidth * scale * 10.0, 0.0, math.min(1.0, totalTime * 0.28))
  y = y + rHeight * scale
  return x, y
end
local function colorS (totalTime)
  local opacity = math.min(finalFade(totalTime), math.max(0.0, (totalTime - 2.75) / 1.0))
  return 1.0, 1.0, 1.0, opacity
end

-- Hashmaps of texture functions
local posFuncs = {
  Regrowth = posR,
  Studios = posS,
}
local colorFuncs = {
  Regrowth = colorR,
  Studios = colorS,
}

-- Obtain a texture position 
function getTexturePos (totalTime, textureName)
  return posFuncs[textureName](totalTime)
end
Vorb.register("Regrowth.PositionAtTime", getTexturePos)

-- Obtain a texture color 
function getTextureColor (totalTime, textureName)
  return colorFuncs[textureName](totalTime)
end
Vorb.register("Regrowth.ColorAtTime", getTextureColor)
