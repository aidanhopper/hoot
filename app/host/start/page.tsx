'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import client from '../../client';
import { getPlayerCount, startGame, getDecks } from '../../api';
import { Deck } from '../../types'

const Start = () => {

  const router = useRouter();

  const [lobby, setLobby] = useState<string>("");
  const [players, setPlayers] = useState<number>(-1);
  const [selectingDeck, setSelectingDeck] = useState(false);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [deckIndex, setDeckIndex] = useState(-1);

  useEffect(() => {
    getDecks().then((ret) => setDecks(ret));
  }, [])

  const getLobby = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('lobby');
  }

  const playerJoinCallback = () => {
    if (lobby !== "")
      getPlayerCount(lobby).then((count: number) => {
        setPlayers(count);
      });
  }

  const startCallback = () => {
    if (players > 0 && lobby !== "") {
      startGame(lobby, decks[deckIndex]).then((success) => {
        if (success) {
          client.channel(lobby).send({
            type: 'broadcast',
            event: 'start',
            payload: {},
          });
          router.push(`/host/session?lobby=${lobby}&deck=${encodeURIComponent(JSON.stringify(decks[deckIndex]))}`);
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

  }, [players]);

  return (
    <>
      {selectingDeck &&
        <>
          <div className="z-10 opacity-50 absolute w-[100%] h-[50%] min-h-screen 
            bg-gray-100 text-8xl overflow-hidden" />
          <div className="absolute w-full h-screen z-10">
            <div className="container content-center m-auto 
              h-full overflow-hidden">
              <div className="flex items-center justify-center bg-gray-100 h-[60%] w-[40%] m-auto
                shadow-[5px_5px_2px_rgb(0,0,0,0.25)] rounded-lg">
                <div className="flex flex-col text-left w-full h-full p-4">
                  <div className="flex flex-none pb-2 text-black font-bold text-xl w-full">
                    <span className="flex-auto text-left w-full">
                      Deck selector
                    </span>
                    <span className="flex-auto text-right w-full">
                      <button className="hover:text-red-500 duration-100"
                        onClick={() => setSelectingDeck(false)}>
                        X
                      </button>
                    </span>
                  </div>
                  <div className="flex flex-col flex-auto rounded-lg overflow-y-scroll">
                    <div className="mx-4">
                      {decks.map((deck, index) => {

                        const style = index === deckIndex ? { borderColor: "black" } : {};

                        return (
                          <button className="flex-none w-full bg-white 
                            mb-4 px-4 pt-4 pb-3 rounded-lg border-white border-b-4 hover:border-yellow-400
                            duration-100 "
                            style={style}
                            key={index}
                            onClick={() => setDeckIndex(index)}
                          >
                            <div className="font-bold">
                              {deck.title}
                            </div>
                            <div className="text-sm">
                              {deck.description}
                            </div>
                          </button>

                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      }
      <div className="bg-white h-screen text-center content-center font-sans overflow-hidden">
        <div className="text-8xl font-bold">
          {lobby !== "" && lobby}
          {lobby === "" && <>&nbsp;</>}
        </div>
        <div>
          <button className="bg-red-500 text-4xl rounded-xl p-5 mt-10 
            shadow-[5px_5px_2px_rgb(0,0,0,0.25)] hover:scale-[105%] hover:saturate-115 duration-100"
            onClick={startCallback}>
            Start
          </button>
        </div>
        <div>
          <button className="bg-green-500 text-4xl rounded-xl p-5 m-10 
            shadow-[5px_5px_2px_rgb(0,0,0,0.25)] hover:scale-[105%] hover:saturate-115 duration-100"
            onClick={deckSelectorCallback}>
            Deck selector
          </button>
        </div>
        <div className="absolute bottom-0 left-0 text-5xl p-10">
          Players: {players > -1 && players}
        </div>
      </div>
    </>
  );

}

export default Start;
