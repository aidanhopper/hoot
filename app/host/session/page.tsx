'use client'

import client from '../../client';
import { useState, useEffect } from 'react';
import { useStopwatch } from 'react-timer-hook';
import TimerBar from '../../components/timerbar';
import { Player } from '../../types';
import { useRouter } from 'next/navigation';
import { Deck, Question } from '../../types';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, LabelList } from 'recharts';

const Session = () => {

  const router = useRouter();

  const [transition, setTransition] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(-1);
  const [playerData, setPlayerData] = useState<Player[] | undefined>([]);
  const [lobby, setLobby] = useState("");
  const [deck, setDeck] = useState<Deck>(undefined);

  const getLobby = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('lobby');
  }

  const answerRecieved = (payload: any, deck: Deck) => {

    const player = playerData.filter((data) => {
      return data.name === payload.name;
    });

    console.log(deck.questions);
    console.log(questionIndex);

    if (player.length === 0)
      setPlayerData([...playerData, {
        name: payload.name,
        score: payload.answer = deck.questions[questionIndex].answer ? 1 : 0, 
        answers: [{questionIndex: questionIndex, answerIndex: payload.answer}],
      }]);

    else {
      setPlayerData([... playerData.map((data) => {
        if (data.name === payload.name && 
          data.answers.filter((answer) => {return answer.questionIndex === questionIndex }).length === 0){
          data.answers.push({
            questionIndex: questionIndex, answerIndex: payload.answer,
          });
          if (payload.answer === deck.questions[questionIndex].answer)
            data.score += 1;
        }
        return data;
      })]);
    }
  }


  useEffect(() => {


    const lobby_ = getLobby();

    setLobby(lobby_);

    const channel = client.channel(lobby_);
    
    channel
      .on(
        'broadcast',
        { event: 'answer' },
        (payload) => answerRecieved(payload.payload, deck),
      )
      .subscribe();

  }, [playerData, questionIndex, deck]);

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

  }

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const deck_ = JSON.parse(decodeURIComponent(urlParams.get('deck')));
    setDeck(deck_);
    nextQuestion();
  }, []);

  if (transition) {

    return (
      <div className="bg-gray-100 h-screen text-center content-center font-sans overflow-hidden">

        { 
          questionIndex < deck.questions.length - 1 &&
          <button className="absolute left-10 top-10 bg-white rounded-xl text-xl p-4 hover:scale-[101%]
                             duration-100 active:scale-[101%] border-2 border-gray-200
                             shadow-[5px_5px_2px_rgb(0,0,0,0.25)]"
            onClick={nextQuestion}>
            Next question
          </button>
        }

        { 
          questionIndex >= deck.questions.length - 1 &&
          <button className="absolute left-10 top-10 bg-white rounded-xl text-xl p-4 hover:scale-[101%]
                             duration-100 active:scale-[101%] border-2 border-gray-200
                             shadow-[5px_5px_2px_rgb(0,0,0,0.25)]"
            onClick={() => router.push("/")}>
              Go to home page
          </button>
        }

        <div className="flex flex-col">
          {
            playerData.map((data, index) => {
              return (
                <div key={index} className="text-3xl flex-auto">
                  {deck.questions[questionIndex].answer !== data.answers[data.answers.length-1].answerIndex &&
                      `${data.name} answered ${deck.questions[questionIndex].answers[data.answers[data.answers.length-1].answerIndex]} WHICH IS WRONG DUMMY`} 
                  {deck.questions[questionIndex].answer === data.answers[data.answers.length-1].answerIndex &&
                      `${data.name} answered ${deck.questions[questionIndex].answers[data.answers[data.answers.length-1].answerIndex]} WHICH IS CORRECT`}
                </div>
              );
            })
          }
        </div>

        <ResponsiveContainer width="100%" height="50%">
          <BarChart width={150} height={40} 
            data={playerData}>
            <XAxis dataKey="name"/>
            <YAxis label="Score" hide={true} domain={[0, deck.questions.length]} tickCount={0}/>
            <Bar dataKey="score" fill="#8884d8">
              <LabelList dataKey="score" position="top"/>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
         
      </div>
    );
  }

  return (
    <div className="bg-gray-100 font-bold text-center content-center text-5xl h-screen font-sans overflow-hidden">
      {questionIndex !== -1 && deck.questions[questionIndex].question as unknown as JSX.Element}
      <div className="flex-auto">
        <TimerBar stopwatch={stopwatch} length={20 as number} onEndCallback={() => setTransition(true)} />
      </div>
    </div>
  );
}

export default Session;
