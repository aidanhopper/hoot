'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import client from '../../client'

const Create = () => {

  const router = useRouter();

  const [ players, setPlayers ] = useState(0);
  const [ id, setId ] = useState<string | undefined>(undefined);
  const [ channel, setChannel ] = useState<any>(undefined);

  useEffect(() => {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const ch = client.channel(urlParams.get('id'))

    setId(urlParams.get('id'));
    setChannel(ch);

    ch.on(
      'broadcast',
      { event: 'player join' },
      (payload) => setPlayers(players + 1),
    ).subscribe();

  }, [players]);

  const callback = () => {

    if (id !== undefined) {
      channel.send({
        type: 'broadcast',
        event: 'start',
        payload: {},
      });

      router.push("/host/session?" + id);

    }
  }

 return (
    <div className="bg-white h-screen font-sans overflow-hidden">
      <div className="text-center m-auto h-screen content-center">
        <div className="text-6xl">
          ID: {id as unknown as JSX.Element}
        </div>
        <button className="bg-red-500 text-3xl rounded-xl p-5 m-10 
          shadow-[5px_5px_2px_rgb(0,0,0,0.25)] hover:scale-[105%] hover:saturate-115 duration-100"
          onClick={callback}>
          Start
        </button>
        <div className="p-5 absolute text-4xl bottom-0">
          Players: {players}
        </div>
      </div>
    </div>
  );

}

export default Create;
