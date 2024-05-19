'use server'

import client from './client'

/*
const lobbyExists = async (lobby: string) => {

  var { data, error } = await client
    .from('lobbies')
    .eq('lobby')

}

const createLobby = async (lobby: string) => {

  // try to insert
  var { data, error } = await client
    .from('lobbies')
    .insert([
      { lobby: lobby , players: [] },
    ]);

  // if error then lobby exists
  if (error)
    return false;

  // lobby successfully created
  return true;

}
*/

const insertPlayer = async (lobby: string, name: string) => {

  // get players array
  var { data, err } = await client
    .from('lobbies')
    .select('players')
    .eq('lobby', lobby)

  // lobby does not exist
  if (err)
    return false;

  // get players array
  const players = data.data[0].players;

  // check if name is present in array
  if (players.includes(name))
    return false;

  // push new name to players array
  players.push(name);

  // update players array associated with the lobby 
  // with the new players array
  var { data, error } = await client
    .from('lobbies')
    .update({ players: players })
    .eq('lobby', lobby);

  return true;
  
};

export { insertPlayer };
