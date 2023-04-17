import SockJsClient from "react-stomp";
import { getDomain } from "helpers/getDomain";
import { useCallback } from "react";

const Socket = (props) => {
  const WEBSOCKET_SUFFIX = "/ws";
  const clientRef = props.clientRef;

  const url = getDomain();

  function onConnect() {
    console.log("connected");
    props.sendJoinGameMessage();
    //send-message to lobby
  }

  function onDisconnect() {
    console.log("Disconnected");
  }

  const handleClientRef = useCallback(
    (client) => {
      console.log("setting client ref");
      clientRef.current = client;
    },
    [clientRef]
  );

  return (
    <SockJsClient
      url={url + WEBSOCKET_SUFFIX}
      headers={{ lobbyId: props.lobbyId, userId: props.userId }}
      topics={props.topics}
      onMessage={(msg, topic) => props.onMessage(msg, topic)}
      onConnect={() => onConnect()}
      onDisconnect={() => onDisconnect()}
      ref={handleClientRef}
    />
  );
};

export default Socket;

const WEBSOCKET_PREFIX = "/topic";
const WEBSOCKET_ENDPOINT_PREFIX = "/app";

export const websocket_topics = (lobbyId) => {
  return {
    drawing: `${WEBSOCKET_PREFIX}/lobbies/${lobbyId}/drawing-all`,
    clear: `${WEBSOCKET_PREFIX}/lobbies/${lobbyId}/drawing-clear`,
    users: `${WEBSOCKET_PREFIX}/lobbies/${lobbyId}/users`,
    start: `${WEBSOCKET_PREFIX}/lobbies/${lobbyId}/start-game`,
  };
};

export const websocket_endpoints = (lobbyId) => {
  return {
    drawing_all: `${WEBSOCKET_ENDPOINT_PREFIX}/lobbies/${lobbyId}/drawing-all`,
    drawing_clear: `${WEBSOCKET_ENDPOINT_PREFIX}/lobbies/${lobbyId}/drawing-clear`,
    user_join: `${WEBSOCKET_ENDPOINT_PREFIX}/lobbies/${lobbyId}/user-join`,
    user_leave: `${WEBSOCKET_ENDPOINT_PREFIX}/lobbies/${lobbyId}/user-leave`,
    start_game: `${WEBSOCKET_ENDPOINT_PREFIX}/lobbies/${lobbyId}/start-game`,
  };
};
