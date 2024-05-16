'use client'

import Game from './game';
import { useRouter } from 'next/navigation';

const Home = () => {
    /*

    const roomOne = client.channel('room-one')

    const messageRecieved = (payload) => {
      console.log(payload); 
    }
  
    roomOne.send({
      type: 'broadcast',
      event: 'test',
      payload: { message: 'hello, world' },
    });

    roomOne.on(
      'broadcast', 
      { event: 'test' },
      (payload) => messageRecieved(payload),
    ).subscribe();
    */

    const router = useRouter();

    return (
      <div className="flex bg-white h-screen text-center font-sans overflow-hidden">
        <div className="flex-auto"/>
        <div className="flex-auto"/>
        <div className="flex-auto m-auto">
          <button className="shadow-[5px_5px_2px_rgb(0,0,0,0.25)] duration-100
          hover:scale-[101%] hover:saturate-150 w-1/2 p-10 rounded-xl bg-blue-300 text-3xl"
          onClick={() => router.push("/host/create")}      
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
