import React, { useState, ChangeEvent } from "react";

type SliderInputProps = {
  min?: number;
  max?: number;
  initialValue?: number;
  onConfirm?: (value: number) => void;
};

function SliderInput({
  min = 0,
  max = 100,
  initialValue = 50,
  onConfirm,
}: SliderInputProps) {
  const [value, setValue] = useState<number>(initialValue);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  const handleConfirm = () => {
    onConfirm?.(value);
  };

  return (
    <div style={{ width: "300px", padding: "20px" }}>
      <label htmlFor="slider">Value: {value}</label>
      <input
        id="slider"
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        style={{ width: "100%" }}
      />
      <button onClick={handleConfirm}>Confirm bet</button>
    </div>
  );
}

export default SliderInput;
