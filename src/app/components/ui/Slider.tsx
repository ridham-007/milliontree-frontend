import React from 'react';

interface sliderProps {
  sliderImage:any;
}

const Slider = (props:sliderProps) => {
  return (
    <div className="slider">
      <div className="slideTrack">
        {props.sliderImage.map(({ key, image }:any) => (
          <div className="slide" key={key}>
            {image}
          </div>
        ))}
        {/* Repeat the images for continuous effect */}
        {props.sliderImage.map(({ key, image }:any) => (
          <div className="slide" key={key + 5}> {/* Adjust key for uniqueness */}
            {image}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;



