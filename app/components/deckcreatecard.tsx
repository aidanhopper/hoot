'use client'

import { Question } from '../types';
import { useState } from 'react';

type TextboxProps = {
  children?: string;
  className?: string;
  onInput: (event: any) => void
}

const Textbox = (props: TextboxProps) => {
  const classes = `content-center overflow-hidden min-w-screen 
                     font-bold outline-none border-b-2 
                     border-gray-200 focus:border-yellow-300 max-w-full`;
  return (
    <div className={`${props.className}`}>
      <div className={classes} role="textbox"
        onInput={(event) => props.onInput(event.currentTarget.textContent)}
        contentEditable="true" suppressContentEditableWarning={true}>
        {props.children}
      </div>
    </div>
  );
}

const CardTextBox = ({ children, text, onInput, className }:
  { children?: string, text?: string, onInput: (event: any) => void, className?: string }) => {
  return (
    <>
      <div className={`flex w-full ${className}`}>
        <div className="flex-none font-bold content-center ml-4 mr-2 text-gray-400">
          {children}
        </div>
        <Textbox className="w-full p-2" onInput={onInput}>
          {text}
        </Textbox>
        <div className="flex-auto">
        </div>
      </div>
    </>
  );
}

const AnswerButton = ({ children, className, onClick, lastClicked }:
  { children: string, className?: string, onClick: () => void, lastClicked: string }) => {

  const style = lastClicked == children ? { background: "rgb(229 231 235)" } : {}

  return (
    <div className={className}>
      <button className="border-gray-300 px-3 py-1 border-2 text-sm text-gray-400 
          hover:bg-gray-100 duration-100 rounded-lg"
        onClick={onClick}
        style={style}
      >
        {children}
      </button>
    </div>
  );
}

const Card = ({ className, q, index, remove, onInput }:
  { className?: string, q: Question, index: number, remove: () => void, onInput: () => void }) => {

  const [lastClicked, setLastClicked] = useState(`A${q.answer + 1}`);

  return (
    <div className={`${className} mb-6 animate-fade-down duration-100 
      transition-transform`}>
      <div className="w-full bg-white rounded-lg">
        <div className="flex border-b-2 text-gray-400 p-4 font-bold text-lg">
          <span className="flex-auto">
            {index + 1}
          </span>
          <AnswerButton className="flex-auto text-center"
            lastClicked={lastClicked}
            onClick={() => {
              q.answer = 0;
              setLastClicked("A1");
              onInput();
            }}>
            A1
          </AnswerButton>
          <AnswerButton className="flex-auto text-center"
            lastClicked={lastClicked}
            onClick={() => {
              q.answer = 1;
              setLastClicked("A2");
              onInput();
            }}>
            A2
          </AnswerButton>
          <AnswerButton className="flex-auto text-center"
            lastClicked={lastClicked}
            onClick={() => {
              q.answer = 2;
              setLastClicked("A3");
              onInput();
            }}>
            A3
          </AnswerButton>
          <AnswerButton className="flex-auto text-center"
            lastClicked={lastClicked}
            onClick={() => {
              q.answer = 3;
              setLastClicked("A4");
              onInput();
            }}>
            A4
          </AnswerButton>
          <div className="flex-auto text-right">
            <button className="hover:text-red-500 duration-100"
              onClick={remove}>
              X
            </button>
          </div>
        </div>
        <CardTextBox text={q.question} onInput={(str: string) => {
          q.question = str;
          onInput();
        }}>
          Q&nbsp;
        </CardTextBox>
        <CardTextBox text={q.answers[0]} onInput={(str: string) => {
          q.answers[0] = str;
          onInput();
        }}>
          A1
        </CardTextBox>
        <CardTextBox text={q.answers[1]} onInput={(str: string) => {
          q.answers[1] = str;
          onInput();
        }}>
          A2
        </CardTextBox>
        <CardTextBox text={q.answers[2]} onInput={(str: string) => {
          q.answers[2] = str;
          onInput();
        }}>
          A3
        </CardTextBox>
        <CardTextBox className="pb-2" text={q.answers[3]} onInput={(str: string) => {
          q.answers[3] = str
          onInput();
        }}>
          A4
        </CardTextBox>
      </div>
    </div>
  );
}

export default Card;
