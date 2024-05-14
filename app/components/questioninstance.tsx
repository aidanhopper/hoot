'use client'

import React, { useEffect, useState } from 'react';

import AnswerButton from './answerbutton';
import QuestionScreen from './questionscreen';

type QuestionInstanceProps = {
  questionJson: JSON,
}

const QuestionInstance = ({ questionJson }: QuestionInstanceProps) => {
  const question = "what time is it?";
  const correctAnswer = 0;
  const answerArray = ["1", "123", "3", "4"];

  const [seconds, setSeconds] = useState(0);
  const [docWidth, setDocWidth] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  useEffect(() => {
    setDocWidth(window.innerWidth);
  }, []);

  console.log(seconds)
  
  const timeSlice = 5;

  // TIMES UP
  // GO TO NEXT QUESTION
  
  if (seconds === timeSlice) {
    //setSeconds(0);
  }

  // should try to use react context to retrieve state from child components

  return (
    <div className="flex h-screen flex-col m-auto">
      <div className="flex-auto"/>
      <div className="flex-auto"/>
      <QuestionScreen
        correctAnswer={correctAnswer}
        question={question}
        className="flex-auto"
        answers={answerArray}/>
      <div className="flex-auto">
        <div className="absolute bottom-0 bg-blue-500 h-5 duration-1000 ease-linear" 
             style={{width: Math.min((seconds*docWidth)/(timeSlice-1), docWidth)}}/>
      </div>
    </div>
  );

}

export default QuestionInstance;
