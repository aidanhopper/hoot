'use client'

import React, { useEffect, useState } from 'react';

import AnswerButton from './answerbutton';
import QuestionScreen from './questionscreen';

type QuestionInstanceProps = {
  questionJson: JSON,
  setAnswer: () => void 
}

const QuestionInstance = ({ questionJson, setAnswer }: QuestionInstanceProps) => {
  
  // place holder values
  const question = "what time is it?";
  const correctAnswer = 0;
  const answerArray = ["1", "123", "3", "4"];

  const [seconds, setSeconds] = useState(0);
  const [docWidth, setDocWidth] = useState(0);

  // the amount of time on the timer in seconds
  const timeSlice = 5;

  // sets a interval that increments every 1 milisecond
  useEffect(() => {

    const interval = setInterval(() => {
      if (seconds <= timeSlice*1000)
        setSeconds(seconds + 1);
    }, 1);

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

  const [selectedIndex, setSelectedIndex] = useState(-1);

  // TIMES UP
  // GO TO NEXT QUESTION
  if (seconds === timeSlice) {
    props.setAnswer(selectedIndex);
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
        answers={answerArray}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />
      <div className="flex-auto">
        <div className="absolute bottom-0 bg-blue-500 h-5 duration-1 ease-linear" 
             style={{width: Math.min(
               (seconds/1000*docWidth) / (timeSlice-1), docWidth)
        }}/>
      </div>
    </div>
  );

}

export default QuestionInstance;
