'use client'

import Deck from '../../deck.json';
import { Question } from '../../types';
import { useEffect, useState } from 'react';
import Card from '../../components/deckcreatecard';


type QuestionSlideProps = {
  q: Question;
}



const CreateDeck = () => {

  const [cards, setCards] = useState<Question[]>([]);

  const AddButton = ({ className, onClick }: { className?: string, onClick: () => void }) => {
    return (
      <div className={className}>
        <button className="border-b-4 py-1 border-green-400 hover:border-yellow-400
          hover:text-yellow-400 duration-100 font-mono" onClick={onClick}>
          + ADD CARD
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen font-sans overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="flex-none content-center bg-white h-[40px]">
          Navbar
        </div>
        <div className="flex-auto container m-auto pt-[50px] px-[200px]">
          <div className="flex">
            <span className="flex-auto font-bold text-xl content-center">
              Create a new deck
            </span>
            <span className="flex-auto text-right">
              <button className="border-gray-400 hover:bg-gray-200 text-blue-800
                border-2 duration-200 py-1 px-8 rounded-lg">
                Create
              </button>
            </span>
          </div>
          <div className="flex-auto mt-12">
            <label className="group">
              <span className="absolute text-gray-500 font-bold pt-1 text-xs px-4">
                Title
              </span>
              <input className="font-bold outline-none pt-6 px-4 pb-1 w-full
                border-b-2 border-white focus:border-black rounded-lg"
                placeholder="Enter a title for your deck like best frog species for eating all the stupid bugs in your house that just dont go away even though you bought a bug zapper" />
            </label>
            <div className="flex mt-6">
              <div className="flex-auto w-full">
                <div className="pr-6">
                  <span className="absolute text-xs text-gray-400 font-bold pt-1 px-4">
                    Add a description...
                  </span>
                  <textarea className="w-full border-b-2 border-white focus:border-black
                    resize-none outline-none rounded-lg pt-6 px-4 h-32"
                    rows={1} cols={5} />
                </div>
              </div>
              <div className="flex-auto w-full">
                <div className="pl-6">
                  placeholder
                </div>
              </div>
            </div>
            <button className="border-gray-400 hover:bg-gray-200 text-blue-800
              border-2 duration-200 py-1 px-4 rounded-lg my-12">
              Import
            </button>
            <div className="flex-auto">
              {cards.map((data, index) => {
                return <Card key={index} index={index+1} question={data} />
              })}
              <AddButton onClick={() => {
                setCards(
                  [...cards, {
                    question: "",
                    answers: [],
                    answer: -1,
                  }]
                )
              }} className="text-center w-full mb-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateDeck;
