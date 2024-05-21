'use server'

import client from './client'
import { Player } from './types'

const genLobby = () => {

  let lob = ((Math.floor((Math.random() * 100000)) % 61696) + 3840)
    .toString(16).toUpperCase();

  return lob;

}

const lobbyExists = async (lobby: string) => {

  let data = await client
    .from('lobbies')
    .select('lobby')
    .eq('lobby', lobby);

  return false;

}

const createLobby = async () => {

  let lobby = "";
  let i = 0;

  // can only do this 8 times so nothing crazy happens
  while (i < 8) {

    lobby = genLobby();


    let response = await client
      .from('lobbies')
      .insert([
        { lobby: lobby, players: [], started: false },
      ])
      .select();

    if (response.error === null)
      break;

    i++;

  }

  if (i === 8)
    return null;

  return lobby;

}

const startGame = async (lobby: string) => {

  const response = await client
    .from('lobbies')
    .update({ started: true })
    .eq('lobby', lobby);

  console.log(response);

  if (response.error !== null)
    return false;

  console.log(lobby)

  return true;

}

const insertPlayer = async (lobby: string, name: string) => {

  // get players array
  let response = await client
    .from('lobbies')
    .select('players')
    .eq('lobby', lobby);

  // lobby does not exist
  if (!response.data.length)
    return false;

  // get players array
  const players: Player[] = response.data[0].players;

  // check if name is present in array
  const present = players.filter((player) => {
    return player.name === name;
  }).length === 1;

  if (present)
    return false;

  // push new name to players array
  players.push({
    name: name,
    score: 0,
  });

  // update players array associated with the lobby 
  // with the new players array
  response = await client
    .from('lobbies')
    .update({ players: players })
    .eq('lobby', lobby);

  return true;

};

const getPlayerCount = async (lobby: string) => {

  const response = await client
    .from('lobbies')
    .select('players')
    .eq('lobby', lobby);

  return response.data[0].players.length;

}

const gameIsStarted = async (lobby: string) => {

  const response = await client
    .from('lobbies')
    .select('started')
    .eq('lobby', lobby);

  if (response.error !== null)
    return false;

  return response.data[0].started;

}

const incrementScore = async (lobby: string, scores: any[]) => {

  let response = await client
    .from('lobbies')
    .select('players')
    .eq('lobby', lobby);

  if (response.error !== null)
    return false;

  let players = response.data[0].players;
}

export {
  insertPlayer, createLobby, lobbyExists, getPlayerCount,
  startGame, gameIsStarted, incrementScore,
};
