'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Create = () => {

  const router = useRouter();

  const generateID = () => {
    return ((Math.floor((Math.random() * 100000)) % 61696) + 3840) 
                .toString(16).toUpperCase();
  }

  const [ id, setId ] = useState<string | undefined>(undefined);

  useEffect(() => {
    setId(generateID());
  }, []);

  const callback = () => {
    if (id !== undefined)    
      router.push("/host/session?" + id);
  }

 return (
    <div className="bg-white h-screen font-sans overflow-hidden">
      <div className="text-center m-auto h-screen content-center">
        <div className="text-6xl">
          ID: {id as unknown as JSX.Element}
        </div>
        <button className="bg-red-500 text-3xl rounded-xl p-5 m-10 
          shadow-[5px_5px_2px_rgb(0,0,0,0.25)] hover:scale-[105%] hover:saturate-115 duration-100"
          onClick={callback}
        >
          Start
        </button>
      </div>
    </div>
  );

}

export default Create;
