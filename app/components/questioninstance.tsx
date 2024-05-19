'use client'

import React, { useEffect, useState } from 'react';

import AnswerButton from './answerbutton';
import QuestionScreen from './questionscreen';

type QuestionInstanceProps = {
  q: JSON,
  setAnswer: (num: number) => void 

}

const QuestionInstance = ({ q, setAnswer }: QuestionInstanceProps) => {
  
  // place holder values
  const question = "what time is it?";
  const answerArray = ["1", "123", "3", "4"];

  const [seconds, setSeconds] = useState(0);
  const [docWidth, setDocWidth] = useState(0);

  // the amount of time on the timer in seconds
  const timeSlice = 5;

  const [selectedIndex, setSelectedIndex] = useState(-1);

  // sets a interval that increments every 1 milisecond
  useEffect(() => {

    const interval = setInterval(() => {
      if (seconds <= timeSlice*1000)
        setSeconds(seconds + 1);
    }, 1);

    if (timeSlice*1000 <= seconds)
      setAnswer(selectedIndex)

    return () => clearInterval(interval);

  }, [seconds]);

  // sets the docwidth at beginning
  useEffect(() => {
    setDocWidth(window.innerWidth);
  }, []);

  // sets the docwidth when resizing
  useEffect(() => {

    window.addEventListener("resize", () => {
      setDocWidth(window.innerWidth);
    });

  }, [docWidth]);



  return (
    <div className="flex h-screen flex-col m-auto">
      <div className="flex-auto"/>
      <div className="flex-auto"/>
      <QuestionScreen
        question={q['question']}
        className="flex-auto"
        answers={q['answers']}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />
      <div className="flex-auto">
        <div className="absolute bottom-0 bg-blue-500 h-5 duration-1 ease-linear" 
             style={{width: Math.min(
               (seconds/1000*docWidth) / (timeSlice), docWidth)
        }}/>
      </div>
    </div>
  );

}

export default QuestionInstance;
