import { websocket_endpoints } from "components/socket/Socket";

// WebSocket functions - TODO: refactor and extract

export const sendJoinGameMessage = (clientRef, lobbyId) => {
  const requestBody = JSON.stringify({ task: "joined Game" });
  clientRef.current.sendMessage(
    websocket_endpoints(lobbyId).users,
    requestBody
  );
};

export const sendDrawingMessage = (
  x1,
  y1,
  x2,
  y2,
  color,
  lineWidth,
  clientRef,
  lobbyId
) => {
  const requestBody = JSON.stringify({
    prevX: x1,
    prevY: y1,
    currX: x2,
    currY: y2,
    color: color,
    lineWidth: lineWidth,
  });
  clientRef.current.sendMessage(
    websocket_endpoints(lobbyId).drawing_all,
    requestBody
  );
};

export const sendClearMessage = (clientRef, lobbyId) => {
  const requestBody = JSON.stringify({ task: "clear drawing board" });
  clientRef.current.sendMessage(
    websocket_endpoints(lobbyId).drawing_clear,
    requestBody
  );
};

export const sendLeaveGameMessage = (clientRef, lobbyId) => {
  const requestBody = JSON.stringify({ task: "left Game" });
  clientRef.current.sendMessage(
    websocket_endpoints(lobbyId).users,
    requestBody
  );
};

export const sendCloseLobbyMessage = (clientRef, lobbyId) => {
  const requestBody = JSON.stringify({ task: "lobby closed" });
  clientRef.current.sendMessage(
    websocket_endpoints(lobbyId).lobby_closed,
    requestBody
  );
};

export const sendGameStateMessage = (clientRef, lobbyId, message) => {
  const requestBody = JSON.stringify({ task: message });
  clientRef.current.sendMessage(
    websocket_endpoints(lobbyId).game_state,
    requestBody
  );
};
