import RangeSelection from "components/ui/RangeSelection";
import "styles/views/Game/PaintToolBar.scss";

const colors = [
  "yellow",
  "green",
  "turquoise",
  "blue",
  "red",
  "brown",
  "white",
  "gray",
  "black",
];

const PaintToolbar = (props) => {
  const { selectedColor, setColor, lineWidth, setLineWidth, sendClearMessage } =
    props;

  const handleClearCanvas = () => {
    console.log("clear canvas");
    sendClearMessage();
  };

  return (
    <div className="paint-toolbar">
      <div className="color-picker">
        {colors.map((color) => (
          <button
            key={color}
            className={`color-picker-button ${
              selectedColor === color ? "selected" : ""
            }`}
            style={{
              backgroundColor: color,
            }}
            onClick={() => setColor(color)}
          ></button>
        ))}
      </div>
      <div className="width-picker">
        <label>Line Width</label>
        <RangeSelection
          setter={setLineWidth}
          state={lineWidth}
          min={"1"}
          max={"29"}
          step={"2"}
        ></RangeSelection>
        <button className="clear-button" onClick={handleClearCanvas}>
          Clear Board
        </button>
      </div>
    </div>
  );
};

export default PaintToolbar;
