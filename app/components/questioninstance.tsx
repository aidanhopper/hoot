'use client'

import React, { useEffect, useState } from 'react';
import QuestionScreen from './questionscreen';
import { Question } from '../types';

type QuestionInstanceProps = {
  q: Question;
  selectedIndex: number;
  setSelectedIndex: (num: number) => void;
}

const QuestionInstance = ({ q, selectedIndex, setSelectedIndex }: QuestionInstanceProps) => {
  return (
    <div className="flex h-screen flex-col m-auto">
      <div className="flex-auto" />
      <div className="flex-auto" />
      <QuestionScreen
        question={q.question}
        className="flex-auto"
        answers={q.answers}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />
      <div className="flex-auto" />
    </div>
  );

}

export default QuestionInstance;
