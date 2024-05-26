'use client'

import { Deck } from '../types';

type DeckSelectorProps = {
  setSelectingDeck: (val: boolean) => void;
  setDeckIndex: (val: number) => void;
  deckSelectedHook?: (deck: Deck) => void;
  deckIndex: number;
  decks: Deck[];
}

const DeckSelector = ({ setSelectingDeck, setDeckIndex, deckIndex, deckSelectedHook, decks }: DeckSelectorProps) => {
  return (
    <>
      <div className="z-20 opacity-25 bg-gray-100 absolute w-[100%] h-[50%] min-h-screen 
            bg-gray-100 text-8xl overflow-hidden" />
      <div className="absolute w-full h-screen z-20">
        <div className="container content-center m-auto 
              h-full overflow-hidden">
          <div className="flex items-center justify-center bg-gray-100 h-[60%] w-[40%] m-auto
                shadow-[5px_5px_2px_rgb(0,0,0,0.25)] rounded-lg border-2 border-gray-200">
            <div className="flex flex-col text-left w-full h-full p-4">
              <div className="flex flex-none pb-2 text-black font-bold text-xl w-full">
                <span className="flex-auto text-left w-full">
                  Deck selector
                </span>
                <span className="flex-auto text-right w-full">
                  <button className="hover:text-red-500 duration-100"
                    onClick={() => setSelectingDeck(false)}>
                    X
                  </button>
                </span>
              </div>
              <div className="flex flex-col flex-auto rounded-lg overflow-y-scroll">
                <div className="mx-4">
                  {decks.map((deck, index) => {

                    const style = index === deckIndex ? { borderColor: "black" } : {};

                    return (
                      <button className="flex-none w-full bg-white 
                            mb-4 px-4 pt-4 pb-3 rounded-lg border-white border-b-4 hover:border-yellow-400
                            duration-100 "
                        style={style}
                        key={index}
                        onClick={() => {
                          deckSelectedHook(decks[index]);
                          setDeckIndex(index);
                        }}
                      >
                        <div className="font-bold">
                          {deck.title}
                        </div>
                        <div className="text-sm">
                          {deck.description}
                        </div>
                      </button>

                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

}

export default DeckSelector;
