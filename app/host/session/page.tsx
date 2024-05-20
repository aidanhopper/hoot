'use client'

import deck from '../../deck.json';
import client from '../../client';
import { useState, useEffect } from 'react';
import { useStopwatch } from 'react-timer-hook';
import TimerBar from '../../components/timerbar';
import { Player } from '../../types';

type question = {
  question: string;
  answers: string[];
  answer: number;
}

const Session = () => {

  const [transition, setTransition] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(-1);
  const [playerData, setPlayerData] = useState([]);
  const [lobby, setLobby] = useState("");

  const getLobby = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('lobby');
  }

  const answerRecieved = (payload: Player) => {

    const present = playerData.filter((data) => {
      return data.name === payload.name;
    }).length === 1;

    if (!present)
      setPlayerData([...playerData, payload]);

    console.log("playerdata", playerData);
  }


  useEffect(() => {

    const lobby_ = getLobby();

    setLobby(lobby_);

    const channel = client.channel(lobby_);

    channel
      .on(
        'broadcast',
        { event: 'answer' },
        (payload) => answerRecieved(payload.payload),
      )
      .subscribe();

  }, [playerData]);

  const qlist: question[] = deck['deck'];
  const stopwatch = useStopwatch({ autoStart: true });

  const nextQuestion = () => {

    const channel = client.channel(lobby);

    channel.send({
      type: 'broadcast',
      event: 'nextQuestion',
      payload: {
        index: questionIndex + 1,
      },
    });

    channel.unsubscribe();

    setTransition(false);
    setQuestionIndex(questionIndex + 1);
    stopwatch.reset();



    setPlayerData([]);

  }

  useEffect(() => {
    nextQuestion();
  }, []);

  if (transition) {



    return (
      <div className="bg-white h-screen text-center content-center font-sans overflow-hidden">
        <button className="absolute left-10 top-10 bg-red-500 rounded-xl text-xl p-4 hover:scale-[101%]
                           duration-100 hover:saturate-105 active:scale-[101%]
                           shadow-[5px_5px_2px_rgb(0,0,0,0.25)]"
          onClick={nextQuestion}>
          Next question
        </button>

        {playerData.map((data) => {
          return (
            <div className="text-3xl" key={data.name}>
              {`${data.name} answered ${qlist[questionIndex].answers[data.answer]} `}
              {qlist[questionIndex].answer === data.answer && "WHICH IS CORRECT"}
              {qlist[questionIndex].answer !== data.answer && "WHICH IS INCORRECT DUMMY"}
            </div>
          );
        })}

      </div>
    );
  }

  return (
    <div className="bg-white font-bold text-center content-center text-5xl h-screen font-sans overflow-hidden">
      {questionIndex !== -1 && qlist[questionIndex].question as unknown as JSX.Element}
      <div className="flex-auto">
        <TimerBar stopwatch={stopwatch} length={10 as number} onEndCallback={() => setTransition(true)} />
      </div>
    </div>
  );
}

export default Session;
