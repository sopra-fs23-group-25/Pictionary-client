import "styles/views/Lobby/LobbySettings.scss";

const RangeSelection = ({ setter, state, min, max, step, disabled, width }) => {
  return (
    <input
      className=""
      type="range"
      min={min}
      max={max}
      value={state}
      step={step}
      style={(width = { width })}
      disabled={disabled}
      onChange={(e) => setter(parseInt(e.target.value))}
    ></input>
  );
};

export default RangeSelection;
