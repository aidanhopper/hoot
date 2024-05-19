'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import client from '../../client'
import { insertPlayer } from '../../api';

const Create = () => {

  /* create the router hook */
  const router = useRouter();

  const [ lobby, setLobby ] = useState<number | string>("XXXX")

  const playerJoinCallback = (payload) => {
    setPlayers(players + 1);
  }

  const genLobby = () => {
    return ((Math.floor((Math.random() * 100000)) % 61696) + 3840) 
                .toString(16).toUpperCase();
  }

  const callback = () => {
    if (lobby !== "XXXX")
      router.push(`/host/start?lobby=${lobby}`);
  }

  useEffect(() => {
    setLobby(genLobby);
  }, []);

  /* sets the states and subscribes to the player join channel */

 return (
    <div className="bg-white h-screen font-sans overflow-hidden">
      <div className="text-center m-auto h-screen content-center">
        <div className="text-6xl">
          ID: {lobby as unknown as JSX.Element}
        </div>
        <button className="bg-red-500 text-3xl rounded-xl p-5 m-10 
          shadow-[5px_5px_2px_rgb(0,0,0,0.25)] hover:scale-[105%] hover:saturate-115 duration-100"
          onClick={callback}>
          Create
        </button>
      </div>
    </div>
  );

}

export default Create;
