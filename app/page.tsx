'use client'

import { useRouter } from 'next/navigation';

const Home = () => {

    const router = useRouter();

    const create = () => {
      router.push(`/host/create`);
    } 

    return (
      <div className="flex bg-white h-screen text-center font-sans overflow-hidden">
        <div className="flex-auto"/>
        <div className="flex-auto"/>
        <div className="flex-auto m-auto">
          <button className="shadow-[5px_5px_2px_rgb(0,0,0,0.25)] duration-100
          hover:scale-[101%] hover:saturate-150 w-1/2 p-10 rounded-xl bg-blue-300 text-3xl"
          onClick={create}      
          >
            Host
          </button>
        </div>
        <div className="flex-auto m-auto">
          <button className="shadow-[5px_5px_2px_rgb(0,0,0,0.25)] duration-100 
          hover:scale-[101%] hover:saturate-150 w-1/2 p-10 rounded-xl bg-red-300 text-3xl"
          onClick={() => router.push("/player/join")}      
          >
            Player
          </button>
        </div>
        <div className="flex-auto"/>
        <div className="flex-auto"/>
      </div>
    );

}

export default Home;
