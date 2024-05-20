'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { insertPlayer } from '../../api';
import client from '../../client'

const Join = () => {

  const router = useRouter();

  const [ inputStyle, setInputStyle ] = useState({});

  const inputErr = () => {
    setInputStyle ({
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
    <div className="bg-white h-screen text-center font-sans overflow-hidden">
      <div className="w-1/4 h-screen m-auto content-center">
        <span className="flex-auto font-bold text-2xl text-right">
          Enter Session Information
        </span>
        <div className="pt-10">
          <span className="flex-auto text-xl text-right">
            Name
          </span>
          <input id="playerName" className="flex-auto h-8 border-b-4 ml-5"
            style={inputStyle} placeholder="Ben Dover"/>
        </div>
        <div className="pt-5">
          <span className="flex-auto text-xl content-begin text-right">
            ID &nbsp; &nbsp; &nbsp; &nbsp;
          </span>
          <input id="playerID" className="flex-none border-b-4 ml-5" style={inputStyle} placeholder="1234"/>
        </div>
        <div className="pt-5">
          <button className="bg-red-500 p-2 rounded-xl shadow-[5px_5px_2px_rgb(0,0,0,0.25)] 
            duration-[0.3s] hover:scale-[105%] hover:saturate-110"
            onClick={() => {
              if (document !== null) {
                const name = (document.getElementById("playerName") as HTMLInputElement).value;
                const id = (document.getElementById("playerID") as HTMLInputElement).value;
                //(document.getElementById("playerName") as HTMLInputElement).value = "";
                //(document.getElementById("playerID") as HTMLInputElement).value = "";
                validateInput(name, id);
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

export default Join;
