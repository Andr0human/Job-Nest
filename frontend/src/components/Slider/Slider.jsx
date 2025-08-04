import { Slider as SliderComponent } from 'antd';
import { forwardRef } from 'react';

const Slider = forwardRef((props, ref) => (
  <SliderComponent {...props} ref={ref} />
));

Slider.displayName = 'Slider';

export default Slider;
