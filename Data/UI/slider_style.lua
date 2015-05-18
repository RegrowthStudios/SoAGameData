local SliderStyle = {}

function SliderStyle.set(s)
  Slider.setSlideColor(s, 16, 190, 239, 250)
  Slider.setBarColor(s, 128, 128, 128, 170)
  Slider.setSlideDimensions(s, 30, 15)
  Slider.setHeight(s, 15)
end

return SliderStyle