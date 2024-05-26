'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import client from '../../client';
import { getPlayerCount, startGame, getDecks } from '../../api';
import { Deck } from '../../types'
import DeckSelector from '../../components/deckselector';
import Navbar from '../../components/navbar';

const Start = () => {

  const router = useRouter();

  const [lobby, setLobby] = useState<string>("");
  const [players, setPlayers] = useState<number>(-1);

  const [deck, setDeck] = useState<Deck | undefined>(undefined);

  const [selectingDeck, setSelectingDeck] = useState(false);


  const broadcastDeck = (deck: Deck) => {
    console.log("BROADCASINT DECK");
    client.channel(lobby).send({
      type: 'broadcast',
      event: 'deckSelected',
      payload: {
        deck: deck,
      },
    });
  }

  const getLobby = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('lobby');
  }

  const playerJoinCallback = () => {
    if (lobby !== "") {
      getPlayerCount(lobby).then((count: number) => {
        setPlayers(count);
      });
      broadcastDeck(deck);
    }
  }

  const startCallback = () => {
    if (players > 0 && lobby !== "" && deck !== undefined) {
      startGame(lobby, deck).then((success) => {
        if (success) {
          client.channel(lobby).send({
            type: 'broadcast',
            event: 'start',
            payload: {},
          });
          router.push(`/host/session?lobby=${lobby}&deck=${encodeURIComponent(JSON.stringify(deck))}`);
        }
      });
    }
  }

  const deckSelectorCallback = () => {
    setSelectingDeck(true);
  }

  // query number of players when first entering lobby in case
  // of refresh
  useEffect(() => {
    const lob = getLobby();
    setLobby(lob);
    getPlayerCount(lob).then((count: number) => {
      setPlayers(count);
    });
  }, []);

  // subscribe to player joining
  useEffect(() => {

    const lob = getLobby();

    const channel = client.channel('lobbies')
    channel
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'lobbies',
          filter: `lobby=eq.${lob}`
        },
        () => playerJoinCallback()
      )
      .subscribe();

    // return () => channel.unsubscribe();

  }, [players, deck]);

  return (
    <>
    <DeckSelector 
      callback={(deck) => {
        broadcastDeck(deck);
        setDeck(deck);
        setSelectingDeck(false);
      }}
      display={selectingDeck}
      setDisplay={setSelectingDeck}/>
      <Navbar />
      <div className="bg-gray-100 h-screen text-center content-center font-sans overflow-hidden">
        <div className="text-9xl font-bold">
          {lobby !== "" && lobby}
          {lobby === "" && <>&nbsp;</>}
          <br />
          {deck === undefined && <span className="text-3xl">Please select a deck to play</span>}
          {
            deck !== undefined &&
            <>
              <span className="text-3xl">
                {`Playing ${deck.title}`}
              </span>
            </>
          }
        </div>
        <div>
          <button className="bg-white text-4xl rounded-xl p-5 mt-10 border-gray-200 border-2
            shadow-[5px_5px_2px_rgb(0,0,0,0.25)] hover:scale-[105%] duration-100"
            onClick={startCallback}>
            Start
          </button>
        </div>
        <div>
          <button className="bg-white border-2 border-gray-200 text-4xl rounded-xl p-5 m-10 
            shadow-[5px_5px_2px_rgb(0,0,0,0.25)] hover:scale-[105%] duration-100"
            onClick={deckSelectorCallback}>
            Deck selector
          </button>
        </div>
        <div className="absolute text-left bottom-0 left-0 text-5xl p-10">
          Players: {players > -1 && players}
        </div>
      </div>
    </>
  );

}

export default Start;
