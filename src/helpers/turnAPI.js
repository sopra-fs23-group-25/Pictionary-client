import { api, apiWithUserId } from "helpers/api";

export async function deleteTurn(lobbyId) {
  await api.delete(`/lobbies/${lobbyId}/game/turn`);
}

export async function createTurn(lobbyId) {
  const response = await api.post(`/lobbies/${lobbyId}/game/turn`);
  return response;
}

export async function fetchTurn(lobbyId) {
  const userId = sessionStorage.getItem("userId");

  const response = await apiWithUserId(userId).get(
    `/lobbies/${lobbyId}/game/turn`
  );
  return response;
}

export async function updateTurn(lobbyId, requestBody) {
  await api.put(`/lobbies/${lobbyId}/game/turn`, requestBody);
}
