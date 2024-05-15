'use client'

import { createContext, useState } from 'react';
import QuestionInstance from './components/questioninstance';


const Home = () => {

  // -2 means time is not up yet
  const [ answer, setAnswer ] = useState(-2);

  console.log(answer)

  const questionJson = {
    "asdf": "123"
  };
  
  // eventually i want to be able to pass Quetsion Instance a json
  return (
      <div className="bg-white h-screen font-sans overflow-hidden">
        <QuestionInstance
          questionJson={questionJson}
          setAnswer={setAnswer}
        />
      </div>
  );

}

export default Home;
