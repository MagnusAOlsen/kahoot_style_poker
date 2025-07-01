import React, { useState, ChangeEvent } from "react";
import "./SliderInput.css";
import { useLanguage } from "../context/LanguageContext";

type SliderInputProps = {
  min?: number;
  max?: number;
  initialValue?: number;
  onConfirm?: (value: number) => void;
  onReject?: () => void;
};

function SliderInput({
  min,
  max,
  initialValue,
  onConfirm,
  onReject,
}: SliderInputProps) {
  const [value, setValue] = useState<number>(
    initialValue !== undefined ? initialValue : 0
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  const handleConfirm = () => {
    onConfirm?.(value);
  };

  const handleReject = () => {
    onReject?.();
  };

  const { language } = useLanguage();

  const actionButtonStyle: React.CSSProperties = {
    padding: "16px",
    fontSize: "1.2rem",
    backgroundColor: "#ffffff",
    color: "#0b5e0b",
    borderRadius: "50px",
    border: "none",
    fontWeight: "bold",
    width: "100%",
    marginBottom: "10px",
  };

  return (
    <div style={{ width: "100%", marginRight: "10%" }}>
      <label
        htmlFor="slider"
        style={{
          fontSize: "1.2rem",
        }}
      >
        {language === "en" ? "Value: " + value : "Verdi: " + value}
      </label>
      <input
        id="slider"
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        style={{ width: "100%", height: "40px" }}
      />
      <label htmlFor="writeIn" style={{ fontSize: "1.2rem" }}>
        {language === "en"
          ? "Or enter value manually (between " + min + " and " + max + "):"
          : `Eller skriv inn et tall (mellom ${min} og ${max}):`}
      </label>
      <input
        id="writeIn"
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const newValue = Number(e.target.value);
          if (newValue >= min && newValue <= max) {
            setValue(newValue);
          } else {
            console.warn(`Value must be between ${min} and ${max}`);
          }
        }}
        style={{
          width: "100%",
          marginTop: "15px",
          marginBottom: "15px",
          height: "30px",
        }}
      />
      <div className="Buttons-on-raise">
        <button onClick={handleConfirm} style={actionButtonStyle}>
          {language === "en" ? "Confirm bet" : "Bekreft innsats"}
        </button>
        <button onClick={handleReject} style={actionButtonStyle}>
          {language === "en"
            ? "Go back to call/fold"
            : "Gå tilbake til syn/kast"}
        </button>
      </div>
    </div>
  );
}

export default SliderInput;
