local SliderStyle = {}

function SliderStyle.set(s)
  Slider.setSlideColor(s, 16, 190, 239, 250)
  Slider.setBarColor(s, 128, 128, 128, 170)
  Slider.setSlideDimensions(s, 30, 15)
  Slider.setHeight(s, 15)
end

function SliderStyle.make(name, rMin, rMax, callback)
  local s = UI.View.makeSlider(this, name, 0, 0, 100, 15)
  SliderStyle.set(s)
  Slider.setRange(s, rMin, rMax)
  if string.len(callback) > 0 then
    UI.Slider.onValueChange.subscribe(s, callback)
  end
  return s
end

return SliderStyle
