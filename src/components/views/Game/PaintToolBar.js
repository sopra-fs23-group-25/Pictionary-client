import RangeSelection from "components/ui/RangeSelection";
import "styles/views/Game/PaintToolBar.scss";
import eraser from "images/eraser.png";
import bin from "images/bin.png";
import { sendClearMessage } from "components/socket/socketAPI";

const colors = [
  "yellow",
  "green",
  "turquoise",
  "blue",
  "purple",
  "red",
  "brown",
  "gray",
  "black",
];

const PaintToolbar = (props) => {
  const { selectedColor, setColor, lineWidth, setLineWidth, t, lobbyId } =
    props;
  const { eraserOn, setEraserOn } = props;
  const clientRef = props.clientRef;

  const handleClearCanvas = () => {
    console.log("clear canvas");
    setEraserOn(false);
    sendClearMessage(clientRef, lobbyId);
  };

  const handleClickEraser = () => {
    setEraserOn(true);
  };

  const handleClickColor = (color) => {
    setColor(color);
    setEraserOn(false);
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
            onClick={() => handleClickColor(color)}
          ></button>
        ))}
      </div>
      <div className="width-picker">
        <label> {t("gamePage.paintToolBar.lineWidth")}</label>
        <RangeSelection
          setter={setLineWidth}
          state={lineWidth}
          min={"1"}
          max={"29"}
          step={"2"}
          width={"129px"}
        ></RangeSelection>
        <div className="toolbar-button-container">
          <button
            className={eraserOn ? "toolbar-buttons active" : "toolbar-buttons"}
          >
            <img src={eraser} alt="erase" onClick={handleClickEraser} />
          </button>
          <button className="toolbar-buttons" onClick={handleClearCanvas}>
            <img src={bin} alt="clear" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaintToolbar;
