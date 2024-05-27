'use server'

import client from './client'
import { Player, Question, Deck } from './types'

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

const startGame = async (lobby: string, deck: Deck) => {

  const response = await client
    .from('lobbies')
    .update({ started: true, deck: deck })
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
    answers: [],
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

const createDeck = async (title: string, description: string, questions: Question[]) => {

  if (title === "")
    return false;

  if (!questions.length)
    return false;

  const badQuestions = questions.filter((question) => {
    return (
      question.answers[0] === "" ||
      question.answers[1] === "" ||
      question.answers[2] === "" ||
      question.answers[3] === "" ||
      question.answer === -1 ||
      question.question === ""
    );
  });

  console.log(badQuestions);

  if (badQuestions.length !== 0)
    return false;

  const response = await client
    .from('deck')
    .insert({
      title: title,
      description: description,
      questions: questions,
    })
    .select();

  console.log(response);

  return true;
}

const getDecks = async () => {

  const response = await client
    .from('deck')
    .select('title,description,questions');

  return response.data;

}

const getDeck = async (lobby: string) => {

  let response;
  let i = 0;
  do {
    response = await client
      .from('lobbies')
      .select('deck')
      .eq('lobby', lobby);
    i++;
    console.log(response);
  } while (response === null || response.data === null || response.data[0].deck === null && i < 100) 

  return response.data[0].deck;

}

export {
  insertPlayer, createLobby, lobbyExists, getPlayerCount,
  startGame, gameIsStarted, incrementScore, createDeck,
  getDecks, getDeck
};
