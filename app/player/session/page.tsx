
'use client'

import { useState, useEffect, useRef } from 'react';
import client from '../../client';
import QuestionInstance from '../../components/questioninstance';

const Session = () => {

  const [ name, setName ] = useState<string | undefined>(undefined);
  const [ id, setId ] = useState<string | undefined>(undefined);
  const [ channel, setChannel ] = useState<any>(undefined);
  const [ wait, setWait ] = useState(true);
  const [ answer, setAnswer ] = useState<number | undefined>(undefined);
  const [ currentQuestion, setCurrentQuestion ] = useState<number>(0);


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


  if (wait) {

    if (channel !== undefined) {
      console.log(id);
    }

    return (
      <div className="bg-white h-screen text-center text-6xl content-center font-sans overflow-hidden">
        Waiting for host to start the game
      </div>
    );
  }

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
      <div className="bg-white h-screen font-sans overflow-hidden">
        asdf
      </div>
    );
  }
  else {
    return (
      <div className="bg-white h-screen font-sans overflow-hidden">
        <QuestionInstance setAnswer={setAnswer}/>
      </div>
    );
  }

}

export default Session;
