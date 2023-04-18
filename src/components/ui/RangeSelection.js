import "styles/views/LobbySettings.scss";

const RangeSelection = ({ setter, state, min, max, step, disabled }) => {
  return (
    <input
      className=""
      type="range"
      min={min}
      max={max}
      value={state}
      step={step}
      disabled={disabled}
      onChange={(e) => setter(parseInt(e.target.value))}
    ></input>
  );
};

export default RangeSelection;
