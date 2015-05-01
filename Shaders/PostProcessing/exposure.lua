-- Calculates the unExposure value used by post processing shaders
--[[ r, g, b, and a are the color components as calculated by
   LumDownsample.frag, which downsamples the texture output by
   LogLuminance.frag.
--]]

Vorb.register("calculateExposure", function (r, g, b, a)
  local avgLuminance = math.exp(r)
  local highLuminance = math.exp(g)
  if avgLuminance > highLuminance then
    return avgLuminance
  end
  return (highLuminance - avgLuminance)
end)
