import React from "react";

const STEP_INCHES = 0.25;
const MIN_SIZE = 0.25;
const MAX_SIZE = 100;

const SizeControls = ({ width, height, setWidth, setHeight }) => {
  const incrementWidth = () => {
    setWidth((prev) => Math.min(MAX_SIZE, +(prev + STEP_INCHES).toFixed(2)));
  };

  const decrementWidth = () => {
    setWidth((prev) => Math.max(MIN_SIZE, +(prev - STEP_INCHES).toFixed(2)));
  };

  const incrementHeight = () => {
    setHeight((prev) => Math.min(MAX_SIZE, +(prev + STEP_INCHES).toFixed(2)));
  };

  const decrementHeight = () => {
    setHeight((prev) => Math.max(MIN_SIZE, +(prev - STEP_INCHES).toFixed(2)));
  };

  const handleWidthChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= MIN_SIZE && value <= MAX_SIZE) {
      setWidth(+value.toFixed(2));
    } else if (e.target.value === "") {
      setWidth(MIN_SIZE);
    }
  };

  const handleHeightChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= MIN_SIZE && value <= MAX_SIZE) {
      setHeight(+value.toFixed(2));
    } else if (e.target.value === "") {
      setHeight(MIN_SIZE);
    }
  };

  return (
    <div className="size-controls bg-white rounded-lg">
      <div className="text-start space-y-2 mb-4">
        <h2 className="font-bold text-black text-base">
          Step 3: Set Design Size
        </h2>
        <p className="text-xs text-gray-600">
          Specify the dimensions for your custom design
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Width Control */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Width (inches)
          </label>
          <div className="size-controls-stepper flex items-center gap-2">
            <button type="button" onClick={decrementWidth} className="size-controls-btn" aria-label="Decrease width">−</button>
            <input
              type="number"
              value={width}
              onChange={handleWidthChange}
              step={STEP_INCHES}
              min={MIN_SIZE}
              max={MAX_SIZE}
              className="size-controls-input"
            />
            <button type="button" onClick={incrementWidth} className="size-controls-btn" aria-label="Increase width">+</button>
          </div>
        </div>

        {/* Height Control */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Height (inches)
          </label>
          <div className="size-controls-stepper flex items-center gap-2">
            <button type="button" onClick={decrementHeight} className="size-controls-btn" aria-label="Decrease height">−</button>
            <input
              type="number"
              value={height}
              onChange={handleHeightChange}
              step={STEP_INCHES}
              min={MIN_SIZE}
              max={MAX_SIZE}
              className="size-controls-input"
            />
            <button type="button" onClick={incrementHeight} className="size-controls-btn" aria-label="Increase height">+</button>
          </div>
        </div>
      </div>

      {/* Size info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <span className="font-medium">Area:</span>{" "}
          {(width * height).toFixed(2)} sq. inches
        </p>
      </div>
    </div>
  );
};

export default SizeControls;
