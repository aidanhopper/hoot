'use client'

import deck from '../../deck.json';
import { useState, useEffect } from 'react';


type question = {
  question: string;
  answers: string[];
  answer: number;
}

const Session = () => {

  const [ seconds, setSeconds ] = useState(0);
  const [ docWidth, setDocWidth ] = useState(0);
  const [ wait, setWait ] = useState(false);

  const timeSlice = 5;
  const qlist: question[] = deck['deck'];
  const playerData = [];

  // set doc width when window loads
  useEffect(() => {
    setDocWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    
  }, []);

  // 
  useEffect(() => {

    const interval = setInterval(() => {
      if (seconds <= timeSlice*1000)
        setSeconds(seconds + 1);
    }, 1);

    if (timeSlice*1000 <= seconds)
      setWait(true);

    return () => clearInterval(interval);

  }, [seconds]);

  // 
  if (wait) {
    return (
    <div className="bg-white h-screen font-sans overflow-hidden">
      asdf
    </div>
    );
  }

  return (
    <div className="bg-white font-bold text-center content-center text-5xl h-screen font-sans overflow-hidden">
      {qlist[0]['question'] as unknown as JSX.Element}
      <div className="flex-auto">
        <div className="absolute bottom-0 bg-blue-500 h-5 duration-1 ease-linear" 
             style={{width: Math.min((seconds/1000*docWidth) / (timeSlice), docWidth)}}/>
      </div>
    </div>
  );
}

export default Session;
