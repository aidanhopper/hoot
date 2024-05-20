'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import client from '../../client';
import { getPlayerCount, startGame } from '../../api';

const Start = () => {

  const router = useRouter();

  const [ lobby, setLobby ] = useState<string>("");
  const [ players, setPlayers ] = useState<number>(-1);

  const getLobby = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('lobby');
  }

  const playerJoinCallback = (payload) => {
    if (lobby !== "")
      getPlayerCount(lobby).then((count: number) => {
        setPlayers(count);
      });
  }

  const startCallback = () => {
    if (players > 0 && lobby !== "") {
      startGame(lobby).then((success) => {
        if (success)
          router.push(`/host/session?lobby=${lobby}`);
      });
    }
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
    <div className="bg-white h-screen text-center content-center font-sans overflow-hidden">
      <div className="text-8xl font-bold">
        {lobby as unknown as JSX.Element}
      </div>
      <button className="bg-red-500 text-4xl rounded-xl p-5 m-10 
        shadow-[5px_5px_2px_rgb(0,0,0,0.25)] hover:scale-[105%] hover:saturate-115 duration-100"
        onClick={startCallback}>
          Start
      </button>
      <div className="absolute bottom-0 left-0 text-5xl p-10">
        Players: {players > -1 && players as unknown as JSX.Element}
      </div>
    </div>
  );

}

export default Start;
