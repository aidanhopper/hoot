'use client'

import { useRouter } from 'next/navigation';
import { createLobby } from '../../api';
import Navbar from '../../components/navbar';
import { useState } from 'react';
import { Deck } from '../../types';

const Create = () => {

  /* create the router hook */
  const router = useRouter();


  const callback = () => {
    createLobby().then((lobby: string) => {
      if (lobby !== null)
        router.push(`/host/start?lobby=${lobby}`);
    });
  }

  /* sets the states and subscribes to the player join channel */

  return (
    <div className="bg-gray-100 h-screen font-sans overflow-hidden">
      <Navbar />
      <div className="text-center m-auto h-screen content-center">
        <button className="bg-white border-gray-200 border-2 text-3xl rounded-xl p-5 m-10 
          shadow-[5px_5px_2px_rgb(0,0,0,0.25)] hover:scale-[102%] hover:saturate-115 duration-100"
          onClick={callback}>
          Create a lobby
        </button>
      </div>
    </div>
  );

}

export default Create;
