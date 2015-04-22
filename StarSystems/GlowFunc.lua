DSUN = 1392684.0
TSUN = 5778.0

Vorb.register("GlowFunction", function (temp, radius, relCamPosX, relCamPosY, relCamPosZ)
  -- Georg's magic formula
  local d2 = relCamPosX * relCamPosX + relCamPosY * relCamPosY + relCamPosZ * relCamPosZ
  local d = math.sqrt(d2)
  local D = radius * 2.0 * DSUN
  -- Luminosity
  local L = (D * D) * math.pow(temp / TSUN, 4.0) 
  -- Size
  return 0.016 * math.pow(L, 0.25) / math.pow(d, 0.5)
end)
