
'use client'

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
  const [ id, setId ] = useState<string | undefined>(undefined);
  const [ channel, setChannel ] = useState<any>(undefined);
  const [ wait, setWait ] = useState(true);
  const [ answer, setAnswer ] = useState<number | undefined>(undefined);
  const [ currentQuestion, setCurrentQuestion ] = useState<number>(0);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [seconds, setSeconds] = useState(0);

  const qlist: question[] = deck['deck'];

  // the amount of time on the timer in seconds
  const timeSlice = 5;

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

  // subscribe to the wait event and get url parameters
  useEffect(() => {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    setName(urlParams.get('name'));
    setId(urlParams.get('id'));

    const ch = client.channel(urlParams.get('id'))

    ch.on(
      'broadcast',
      { event: 'start' },
      (payload) => {
        console.log('RECIEVED PAYLOAD');
        setWait(false);
      },
    ).subscribe();
    
    setChannel(ch);

  }, []);

  // wait for host to start the game
  if (wait) {
    return (
      <div className="bg-white h-screen font-bold text-center text-5xl content-center font-sans overflow-hidden">
        Waiting for host to start the game
      </div>
    );
  }

  // time is up for this question
  if (answer !== undefined) {

    channel.send({
      type: 'broadcast',
      event: 'answer given',
      payload: { 
        'name': name,
        'answer': answer
      },
    });

    return (
      <div className="bg-white h-screen font-sans overflow-hidden text-center content-center font-bold">
        Waiting to go to the next question
      </div>
    );

  }

  return (
    <div className="bg-white h-screen font-sans overflow-hidden">
      <QuestionInstance q={qlist[currentQuestion]} setAnswer={setAnswer}/>
    </div>
  );

}

export default Session;
