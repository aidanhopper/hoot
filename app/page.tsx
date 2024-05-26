'use client'

import { useRouter } from 'next/navigation';
import Navbar from './components/navbar';

const Home = () => {

  const router = useRouter();

  return (
    <>
      <Navbar/>
      <div className="flex flex-col bg-gray-100 h-screen text-center font-sans overflow-hidden ">
        <div className="flex-auto" />
        <div className="flex flex-row w-full">
          <div className="flex-auto" />
          <div className="flex-auto" />
          <div className="flex-auto m-auto">
            <button className="shadow-[5px_5px_2px_rgb(0,0,0,0.25)] duration-100
              hover:scale-[101%] hover:saturate-150 w-1/2 p-10 rounded-xl bg-white text-3xl
              border-gray-200 border-2"
              onClick={() => router.push(`/host/create`)}
            >
              Host
            </button>
          </div>
          <div className="flex-auto m-auto">
            <button className="shadow-[5px_5px_2px_rgb(0,0,0,0.25)] duration-100 
              hover:scale-[101%] hover:saturate-150 w-1/2 p-10 rounded-xl bg-white
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
