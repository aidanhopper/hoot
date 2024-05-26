'use client'

import { useRouter } from 'next/navigation';

const Navbar = () => {

  const router = useRouter();

  return (
    <div className="z-10 h-16 fixed w-full bg-white font-sans border-t border-b border-gray-200">
      <div className="flex h-full mx-4">
        <span className="flex content-center flex-none h-full">
          <button className="flex-auto text-blue-700 font-bold text-3xl pb-1 mr-8"
          onClick={() => router.push("/")}>
          trivit.xyz
          </button>
          <button className="flex flex-auto mr-3 font-bold border-white border-b-4 
            hover:border-blue-500 duration-100">
            <span className="flex-auto content-center h-full pt-1 pr-2">
              your decks
            </span>
            <span className="h-full flex-auto content-center">
              &#8964;
            </span>
          </button>
        </span>
        <span className="flex-auto text-center content-center">
        </span>
        <span className="flex-none h-full">
          <span className="h-full flex items-center justify-center content-center">
            <button className="flex px-[10px] content-center border-2 border-gray-300
              text-gray-500 hover:bg-gray-100 duration-100 rounded-full text-4xl"
            onClick={() => router.push('/deck/create')}>
              +
            </button>
          </span>
        </span>
      </div>
    </div>
  );  
}

export default Navbar;
