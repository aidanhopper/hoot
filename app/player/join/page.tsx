'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Join = () => {

  const router = useRouter();

  const [ inputStyle, setInputStyle ] = useState({});

  const inputErr = () => {
    setInputStyle ({
      'borderColor': 'red',
    });
  }

  const validateInput = (name: string, id: string) => {
    console.log(name);
    console.log(id);
    
    // make sure input is good
    if (name === "" || id === "") {
      inputErr();
      return;
    }
  
    if (id.length !== 4) {
      inputErr();
      return;
    }

    if (isNaN(id)) {
      inputErr();
      return;
    }
    
    // go to session page
    const uriName = encodeURIComponent(name);
    const uriId = encodeURIComponent(id);

    const uri = `/player/session?name=${uriName}&id=${uriId}`

    router.push(uri);
    
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
          <input id="playerName" className="flex-auto h-8 border-b-4 ml-5" style={inputStyle} placeholder="Ben Dover"/>
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
              const name = document.getElementById("playerName").value;
              const id = document.getElementById("playerID").value;
              document.getElementById("playerName").value = "";
              document.getElementById("playerID").value = "";
              validateInput(name, id);
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
