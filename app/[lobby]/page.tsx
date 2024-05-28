'use client'

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { insertPlayer } from '../api';

const Invite = () => {

  const router = useRouter();

  const lobby = usePathname().substring(1);

  const [inputStyle, setInputStyle] = useState({});

  const inputErr = () => {
    setInputStyle({
      'borderColor': 'red',
    });
  }

  const validateInput = (name: string, lobby: string) => {

    // make sure input is good
    if (name === "" || lobby === "") {
      inputErr();
      return;
    }

    if (lobby.length !== 4) {
      inputErr();
      return;
    }

    insertPlayer(lobby, name).then((success) => {

      if (!success) {
        inputErr();
        return;
      }

      const uriName = encodeURIComponent(name);
      const uriLobby = encodeURIComponent(lobby);
      const uri = `/player/session?name=${uriName}&lobby=${uriLobby}`

      router.push(uri);

    });

  }

  return (
    <div className="bg-gray-100 h-screen text-center font-sans overflow-hidden text-black">
      <div className="lg:w-1/4 h-screen m-auto content-center">
        <div className="text-4xl">
        Joining lobby <b>{lobby}</b>
        </div>
        <div className="pt-10">
          <span className="flex-auto text-xl text-right">
            Name
          </span>
          <input id="playerName" className="flex-auto border-b-4 rounded-lg p-2 ml-5"
            style={inputStyle} placeholder="Ben Dover" />
        </div>
        <div className="pt-5">
          <button className="bg-white border-2 border-gray-200 p-2 rounded-xl shadow-[5px_5px_2px_rgb(0,0,0,0.25)] 
            duration-[0.3s] hover:scale-[103%] hover:saturate-110"
            onClick={() => {
              if (document !== null) {
                const name = (document.getElementById("playerName") as HTMLInputElement).value;
                //(document.getElementById("playerName") as HTMLInputElement).value = "";
                //(document.getElementById("playerID") as HTMLInputElement).value = "";
                validateInput(name, lobby);
              }
            }}
          >
            Enter
          </button>
        </div>
      </div>
    </div>
  );
}

export default Invite;
