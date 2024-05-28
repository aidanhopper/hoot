'use client'

import { useRouter } from 'next/navigation';
import Navbar from './components/navbar';
import { createLobby } from './api';

const Home = () => {

  const router = useRouter();

  return (
    <>
      <Navbar/>
      <div className="flex flex-col bg-gray-100 h-screen text-black text-center font-sans overflow-hidden ">
        <div className="flex-auto" />
        <div className="flex flex-col lg:flex-row w-full">
          <div className="flex-auto" />
          <div className="flex-auto" />
          <div className="flex-auto m-auto">
            <button className="shadow-[5px_5px_2px_rgb(0,0,0,0.25)] duration-100
              hover:scale-[101%] hover:saturate-150 mb-12 lg:mb-0 lg:w-1/2 p-10 rounded-xl bg-white text-3xl
              border-gray-200 border-2"
              onClick={() => {
                createLobby().then((lobby) => {
                  if (lobby !== null)
                    router.push(`/host/start?lobby=${lobby}`)
                })
              }}
            >
              Host
            </button>
          </div>
          <div className="flex-auto m-auto">
            <button className="shadow-[5px_5px_2px_rgb(0,0,0,0.25)] duration-100 
              hover:scale-[101%] hover:saturate-150 lg:w-1/2 p-10 rounded-xl bg-white
              border-gray-200 border-2 text-3xl"
              onClick={() => router.push("/player/join")}
            >
              Player
            </button>
          </div>
          <div className="flex-auto" />
          <div className="flex-auto" />
        </div>
        <div className="flex-auto m-auto">
        </div>
      </div>
    </>
  );


}

export default Home;
