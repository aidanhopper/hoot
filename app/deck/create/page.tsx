'use client'

import Deck from '../../deck.json';
import { Question } from '../../types';
import { useEffect } from 'react';


type QuestionSlideProps = {
  q: Question;
}

type TextboxProps = {
  children?: JSX.Element;
  className?: string;
  id: string;
}

const CreateDeck = () => {

  const cards: Question[] = [];
  cards.push(Deck.deck[0]);


  const Textbox = (props: TextboxProps) => {
    const classes = `content-center overflow-hidden min-w-screen 
                     font-bold outline-none border-b-2 
                     border-gray-200 focus:border-yellow-300 max-w-full`;
    return (
      <div className={`${props.className}`}>
        <div className={classes} role="textbox" id={props.id}
          contentEditable="true" suppressContentEditableWarning={true}>
          {props.children}
        </div>
      </div>
    );
  }

  const AddButton = ({ className }: { className?: string }) => {
    return (
      <button className={`text-5xl border-black w-[35px] text-center
        hover:scale-[110%] duration-200 hover:text-blue-600 ${className}`}>
        +
      </button>
    );
  }

  const CardTextBox = ({ children }: { children?: string }) => {
    return (
      <>
        <div className="flex w-full">
          <div className="flex-none font-bold content-center ml-3 text-gray-400">
            {children}
          </div>
          <Textbox className="w-full p-2" id="question" />
          <div className="flex-auto">
          </div>
        </div>
      </>
    );
  }

  const AnswerButton = ({ children, className }: { children: string, className?:string }) => {
    return (
      <div className={className}>
        <button className="border-gray-300 px-3 py-1 border-2 text-sm text-gray-400 
          hover:bg-gray-100 duration-100 rounded-lg">
          {children}
        </button>
      </div>
    );
  }

  const Card = ({ className }: { className?: string }) => {

    return (
      <div className={`${className} mb-6`}>
        <div className="w-full bg-white rounded-lg">
          <div className="flex border-b-2 text-gray-400 p-4 font-bold text-lg ">
            <span className="flex-auto">
              1
            </span>
            <AnswerButton className="flex-auto text-center">
              A1
            </AnswerButton>
            <AnswerButton className="flex-auto text-center">
              A2
            </AnswerButton>
            <AnswerButton className="flex-auto text-center">
              A3
            </AnswerButton>
            <AnswerButton className="flex-auto text-center">
              A4
            </AnswerButton>
            <div className="flex-auto text-right">
              <button className="hover:text-red-500 duration-100">
                X
              </button>
            </div>
          </div>
          <CardTextBox>
            Q&nbsp;
          </CardTextBox>
          <CardTextBox>
            A1
          </CardTextBox>
          <CardTextBox>
            A2
          </CardTextBox>
          <CardTextBox>
            A3
          </CardTextBox>
          <CardTextBox>
            A4
          </CardTextBox>
          <div className="flex">
          </div>
        </div>
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
              <Card />
              <Card />
              <Card />
              <Card />
              <Card />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateDeck;
