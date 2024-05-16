
'use client'

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import QuestionInstance from '../../components/questioninstance';

const Session = () => {

  const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,
                              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  // open 
  
  const [ name, setName ] = useState<string | undefined>(undefined);
  const [ id, setId ] = useState<string | undefined>(undefined);
  const [ room, setRoom ] = useState<any>(undefined);

  useEffect(() => {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    setName(urlParams.get('name'));
    setId(urlParams.get('id'));
    setRoom(client.channel(urlParams.get('id')));

  }, []);

  // -2 means time is not up yet
  const [ answer, setAnswer ] = useState<number | undefined>(undefined);
  const [ currentQuestion, setCurrentQuestion ] = useState<number>(0);

  if (answer !== undefined) {
    
    room.send({
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
