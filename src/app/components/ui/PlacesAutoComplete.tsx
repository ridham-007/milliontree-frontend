"use client";
import React, { useState } from "react";
import { GrLocation } from "react-icons/gr";
import Autocomplete from "react-google-autocomplete";
interface PlacesAutocompleteProps {
  placeholder: string;
  name: string;
  className?: string;
  onChange?: any;
  value?: string;
  label?: string | any;
  icon?: any;
  showBorder?: any;
}

const PlacesAutocomplete = (props: PlacesAutocompleteProps) => {
  const { placeholder, name, className, onChange, value, label, icon, showBorder = true } = props;
  const [inputValue, setInputValue] = useState(value || "");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    if (onChange) {
      onChange(event, { name: event.target.value, latitude: 0, longitude: 0, placeId: "" });
    }
  };

  return (
    <div className="flex flex-col w-full">
      {label && <label className="font-medium text-[16px] leading-[24px] text-[#3E4654]">
        {label}
      </label>}
      <div className={`relative flex items-center ${className}`}>
        {icon && (
          <GrLocation size={35} color="#FF772E" className="ml-[4px]" />
        )}
        <Autocomplete
          name={name}
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          defaultValue={inputValue}
          options={{
            types: ["geocode"],
          }}
          onPlaceSelected={(place) => {
            if (place) {
              const location = place.formatted_address;
              const latitude = place.geometry?.location?.lat();
              const longitude = place.geometry?.location?.lng();
              const placeId = place?.place_id;
              onChange(null, {
                location,
                latitude: latitude || 0,
                longitude: longitude || 0,
                placeId: placeId || "",
              });
            }
          }}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`h-[44px] w-full rounded-[8px]  pl-3 pr-3 focus:outline-none bg-[#F4F4F4] ${showBorder ? "border border-[#F4F4F4]" : null}`}
        />
      </div>
    </div>
  );
};

export default PlacesAutocomplete;