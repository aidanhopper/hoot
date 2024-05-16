'use client'

import { useState } from 'react';
import QuestionInstance from './components/questioninstance';

const Game = () => {


  // -2 means time is not up yet
  const [ answer, setAnswer ] = useState(-2);
  const [ currentQuestion, setCurrentQuestion ] = useState(0);

  if (answer != -2) {
    return (
      <>
        asdf
      </>
    );
  }
  else {
    return (
          <QuestionInstance setAnswer={setAnswer}/>
    );
  }

}

export default Game;
