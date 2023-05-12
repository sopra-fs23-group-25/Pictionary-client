import { api } from "helpers/api";

export async function createGame(lobbyId) {
  const response = await api.post(`/lobbies/${lobbyId}/game`);
  return response;
}

export async function fetchGame(lobbyId) {
  const response = await api.get(`/lobbies/${lobbyId}/game`);
  return response;
}

export async function updateGame(lobbyId) {
  await api.put(`/lobbies/${lobbyId}/game`);
}
