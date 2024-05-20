'use client'

import React, { useEffect, useState } from 'react';
import AnswerButton from './answerbutton';
import TimerBar from './timerbar';
import QuestionScreen from './questionscreen';
  import { useStopwatch } from 'react-timer-hook';

type question = {
  question: string;
  answers: string[];
  answer: number;
}

type QuestionInstanceProps = {
  q: question,
  setAnswer: (num: number) => void 
}

const QuestionInstance = ({ q, setAnswer }: QuestionInstanceProps) => {
  
  // place holder values
  const question = "what time is it?";
  const answerArray = ["1", "123", "3", "4"];

  const stopwatch = useStopwatch({ autoStart: true });

  // the amount of time on the timer in seconds
  const timeSlice = 5;

  const [selectedIndex, setSelectedIndex] = useState(-1);

  // sets a interval that increments every 1 milisecond

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
      <div className="flex-auto"/>
      <TimerBar stopwatch={stopwatch} length={10 as number} onEndCallback={() => setAnswer(selectedIndex)}/>
    </div>
  );

}

export default QuestionInstance;
