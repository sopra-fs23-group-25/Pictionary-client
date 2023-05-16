import React, { useEffect, forwardRef } from "react";
import "styles/views/Game/DrawingBoard.scss";
import { sendDrawingMessage } from "components/socket/socketAPI";

const DrawingBoard = forwardRef(
  ({ color, lineWidth, isPainter, clientRef, lobbyId }, ref) => {
    useEffect(() => {
      const canvas = ref.current;

      let isDrawing = false;
      let lastX = 0;
      let lastY = 0;

      function handleMouseDown(event) {
        isDrawing = true;
        const bounds = canvas.getBoundingClientRect();

        lastX = event.clientX - bounds.left;
        lastY = event.clientY - bounds.top;
      }

      function handleMouseMove(event) {
        if (!isDrawing) return;
        const bounds = canvas.getBoundingClientRect();
        const currentX = event.clientX - bounds.left;
        const currentY = event.clientY - bounds.top;

        drawOnBoard(ref, lastX, lastY, currentX, currentY, color, lineWidth);
        sendDrawingMessage(
          lastX,
          lastY,
          currentX,
          currentY,
          color,
          lineWidth,
          clientRef,
          lobbyId
        );

        lastX = currentX;
        lastY = currentY;
      }

      function handleMouseUp() {
        isDrawing = false;
      }

      function handleMouseOut() {
        isDrawing = false;
      }

      if (isPainter) {
        canvas.addEventListener("mousedown", handleMouseDown);
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseup", handleMouseUp);
        canvas.addEventListener("mouseout", handleMouseOut);
      }
      // clean-up - remove Eventlistener when page/component unmount
      return () => {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseup", handleMouseUp);
        canvas.removeEventListener("mouseout", handleMouseOut);
      };
    }, [color, lineWidth, isPainter, ref, clientRef, lobbyId]);

    return (
      <canvas
        className="board canvas"
        width={850}
        height={600}
        ref={ref}
      ></canvas>
    );
  }
);

export default DrawingBoard;

export const drawOnBoard = (canvas, x1, y1, x2, y2, color, width) => {
  const context = canvas.current.getContext("2d");

  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.lineWidth = width;
  context.strokeStyle = color;
  context.lineJoin = "round";
  context.closePath();
  context.stroke();
};
