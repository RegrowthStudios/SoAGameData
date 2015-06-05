--[[
Access to window size is provided:
 * (Number) WindowWidth
 * (Number) WindowHeight
]]--

-- A slowing-down tween
function lerpSlowdown(a, b, t)
  local newT = math.pow(t, 1 / 6.0)
  return (b - a) * newT + a
end

-- Maximum duration of the screen
Vorb.register("Screen.MaxDuration", function ()
  return 7.0
end)

-- Screen's background color
Vorb.register("Screen.BackgroundColor", function ()
  return 1.0, 1.0, 1.0, 1.0
end)

-- Amount of time before cube is visible
local cubeEntranceTime = 1.0
local cubeOffscreenDelta = -500.0
local globalOffsetX = (WindowWidth - 661) / 2.0
local globalOffsetY = (WindowHeight - 161) / 2.0

-- Individual pos/color update functions
local function posV (totalTime)
  return globalOffsetX + 0.0, globalOffsetY + 84.0
end
local function colorV (totalTime)
  local opacity = math.min(1.0, math.max(0.0, (totalTime - 0.0) / 1.0))
  return 1.0, 1.0, 1.0, opacity
end

local function posO (totalTime)
  return globalOffsetX + 217.0, globalOffsetY + 84.0
end
local function colorO (totalTime)
  local opacity = math.min(1.0, math.max(0.0, (totalTime - 0.25) / 1.0))
  return 1.0, 1.0, 1.0, opacity
end

local function posR (totalTime)
  return globalOffsetX + 376.0, globalOffsetY + 84.0
end
local function colorR (totalTime)
  local opacity = math.min(1.0, math.max(0.0, (totalTime - 0.50) / 1.0))
  return 1.0, 1.0, 1.0, opacity
end

local function posB (totalTime)
  return globalOffsetX + 521.0, globalOffsetY + 84.0
end
local function colorB (totalTime)
  local opacity = math.min(1.0, math.max(0.0, (totalTime - 0.75) / 1.0))
  return 1.0, 1.0, 1.0, opacity
end

local function posCubeLeft (totalTime)
  local opacity = math.min(1.0, math.max(0.0, (totalTime - 2.5) / 2.5))
  return globalOffsetX + 30.0, globalOffsetY + lerpSlowdown(25.0  + cubeOffscreenDelta, 25.0, opacity)
end
local function colorCubeLeft (totalTime)
  local opacity = math.min(1.0, math.max(0.0, (totalTime - 2.5) / 2.0))
  return 1.0, 1.0, 1.0, opacity
end

local function posCubeRight (totalTime)
  local opacity = math.min(1.0, math.max(0.0, (totalTime - 2.75) / 2.25))
  return globalOffsetX + 109.0, globalOffsetY + lerpSlowdown(25.0  + cubeOffscreenDelta, 25.0, opacity)
end
local function colorCubeRight (totalTime)
  local opacity = math.min(1.0, math.max(0.0, (totalTime - 2.75) / 2.0))
  return 1.0, 1.0, 1.0, opacity
end

local function posCubeTop (totalTime)
  local opacity = math.min(1.0, math.max(0.0, (totalTime - 3.0) / 2.0))
  return globalOffsetX + 31.0, globalOffsetY + lerpSlowdown(0.0  + cubeOffscreenDelta, 0.0, opacity) 
end
local function colorCubeTop (totalTime)
  local opacity = math.min(1.0, math.max(0.0, (totalTime - 3.0) / 2.0))
  return 1.0, 1.0, 1.0, opacity
end

-- Hashmaps of texture functions
local posFuncs = {
  V = posV,
  O = posO,
  R = posR,
  B = posB,
  CubeLeft = posCubeLeft,
  CubeRight = posCubeRight,
  CubeTop = posCubeTop
}
local colorFuncs = {
  V = colorV,
  O = colorO,
  R = colorR,
  B = colorB,
  CubeLeft = colorCubeLeft,
  CubeRight = colorCubeRight,
  CubeTop = colorCubeTop
}

-- Obtain a texture position 
function getTexturePos (totalTime, textureName)
  return posFuncs[textureName](totalTime)
end
Vorb.register("Screen.PositionAtTime", getTexturePos)

-- Obtain a texture color 
function getTextureColor (totalTime, textureName)
  return colorFuncs[textureName](totalTime)
end
Vorb.register("Screen.ColorAtTime", getTextureColor)
