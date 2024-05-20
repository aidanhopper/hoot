'use client'

import { gameIsStarted } from '../../api';
import { useState, useEffect, useRef } from 'react';
import client from '../../client';
import QuestionInstance from '../../components/questioninstance';
import deck from '../../deck.json'

type question = {
  question: string;
  answers: string[];
  answer: number;
}

const Session = () => {

  const [ name, setName ] = useState<string | undefined>(undefined);
  const [ lobby, setLobby ] = useState<string | undefined>(undefined);
  const [ wait, setWait ] = useState(true);
  const [ answer, setAnswer ] = useState<number | undefined>(undefined);
  const [ currentQuestion, setCurrentQuestion ] = useState<number>(0);
  const [ selectedIndex, setSelectedIndex ] = useState(-1);
  const [ seconds, setSeconds ] = useState(0);

  const qlist: question[] = deck['deck'];

  const getName = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('name');
  }

  const getLobby = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('lobby');
  }

  const start = () => {
    setWait(false);
  }

  const nextQuestion = (payload) => {
    setAnswer(undefined);
    setCurrentQuestion(payload.index);
  }

  const checkIfStarted = () => {
    const lobby_ = getLobby();
    gameIsStarted(lobby_)
      .then((started) => {
        if (started)
          start();
      })
  }

  useEffect(() => {
    checkIfStarted();
  }, []);

  // query the database on startup and subscribe to changes
  // also set name and lobby
  useEffect(() => {

    const lobby_ = getLobby();
    const name_ = getName();
    
    setName(lobby_);
    setLobby(name_);
    
    const channel = client.channel(lobby_)
    channel
      .on(
        'broadcast',
        { event: 'start' },
        () => start(),
      )
      .on(
        'broadcast',
        { event: 'nextQuestion' },
        (payload) => nextQuestion(payload.payload),
      )
      .subscribe();

    return async () => channel.unsubscribe();

  }, [currentQuestion]);


  // wait for host to start the game
  if (wait) {

    return (
      <div className="bg-white h-screen font-bold text-center text-5xl content-center font-sans overflow-hidden">
        Waiting for host to start the game
      </div>
    );

  }

  // time is up for this question
  else if (answer !== undefined) {

    const channel = client.channel(lobby);

    channel.send({
      type: 'broadcast',
      event: 'answer',
      payload: {
        answer: answer, 
        name: name,
      },
    });

    channel.unsubscribe();

    return (
      <div className="bg-white h-screen font-sans text-5xl overflow-hidden text-center content-center font-bold">
        Waiting to go to the next question
      </div>
    );

  }

  else {

    return (
      <div className="bg-white h-screen font-sans overflow-hidden">
        { currentQuestion != -1 && <QuestionInstance q={qlist[currentQuestion]} setAnswer={setAnswer}/>}
      </div>
    );

  }

}

export default Session;
