'use client'

import AnswerButton from './answerbutton';

import React, { useState } from 'react'

type QuestionScreenProps = {
  question: string,
  answers: string[],
  className?: string,
  selectedIndex: number,
  setSelectedIndex: Function
}

const QuestionScreen = (props: QuestionScreenProps) => {

  // need to extract this after some time
  return (
    <div className={props.className as string}>
      <div className="justify-center mx-auto flex flex-col container place-content-center">
        <div className="font-bold flex-auto text-center text-6xl content-center">
          {props.question}
        </div>
        <div className="flex flex-col flex-auto mt-20 text-center">
          <div className="flex flex-auto">
            <AnswerButton
              color="bg-green-300"
              borderColor="border-green-500"
              id={0 as number}
              selected={props.selectedIndex}
              callback={ (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => props.setSelectedIndex(0) }>
              {props.answers[0]}
            </AnswerButton>
            <AnswerButton 
              color="bg-blue-300"
              borderColor="border-blue-500"
              id={1 as number}
              selected={props.selectedIndex}
              callback={ (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => props.setSelectedIndex(1) }>
              {props.answers[1]}
            </AnswerButton>
          </div>
          <div className="flex flex-auto">
            <AnswerButton
              color="bg-yellow-300"
              borderColor="border-yellow-500"
              id={2 as number}
              selected={props.selectedIndex}
              callback={ (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => props.setSelectedIndex(2) }>
              {props.answers[2]}
            </AnswerButton>
            <AnswerButton
              color="bg-purple-300"
              borderColor="border-purple-500"
              id={3 as number}
              selected={props.selectedIndex}
              callback={ (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => props.setSelectedIndex(3) }>
              {props.answers[3]}
            </AnswerButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionScreen;
