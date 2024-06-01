'use client'

import client from '../../client';
import { useState, useEffect, useRef } from 'react';
import { useStopwatch } from 'react-timer-hook';
import TimerBar from '../../components/timerbar';
import { Player } from '../../types';
import { useRouter } from 'next/navigation';
import { Deck, Question } from '../../types';

type State = {
  finished?: boolean;
  scoreScreen?: boolean;
  questionScreen?: boolean;
  questionIndex?: number;
  playerData?: Player[];
  lobby?: string;
  deck?: Deck | undefined;
  seconds?: number,
  currentQuestionTimeSlice?: number,
  questionTimeSlice?: number,
}

const Session = () => {

  const router = useRouter();

  const stopwatch = useStopwatch({ autoStart: true });

  const [state, setState] = useState<State>({
    finished: false,
    scoreScreen: false,
    questionScreen: true,
    questionIndex: 0,
    playerData: [],
    lobby: "",
    seconds: 0,
    questionTimeSlice: 20,
    currentQuestionTimeSlice: 20,
  });

  const combineState = (newState: State) => {
    return {
      finished: newState.finished !== undefined ?
        newState.finished : state.finished,
      scoreScreen: newState.scoreScreen !== undefined ?
        newState.scoreScreen : state.scoreScreen,
      questionScreen: newState.questionScreen !== undefined ?
        newState.questionScreen : state.questionScreen,
      questionIndex: newState.questionIndex !== undefined ?
        newState.questionIndex : state.questionIndex,
      playerData: newState.playerData !== undefined ?
        newState.playerData : state.playerData,
      lobby: newState.lobby !== undefined ?
        newState.lobby : state.lobby,
      deck: newState.deck !== undefined ?
        newState.deck : state.deck,
      seconds: newState.seconds !== undefined ?
        newState.seconds : state.seconds,
      currentQuestionTimeSlice: newState.currentQuestionTimeSlice !== undefined ?
        newState.currentQuestionTimeSlice : state.currentQuestionTimeSlice,
      questionTimeSlice: newState.questionTimeSlice !== undefined ?
        newState.questionTimeSlice : state.questionTimeSlice,
    }
  }

  const loadState = () => {
    const newState = sessionStorage.getItem('state') !== 'null' ?
      JSON.parse(sessionStorage.getItem('state')) :
      state
    newState.lobby = sessionStorage.getItem('lobby');
    newState.deck = JSON.parse(sessionStorage.getItem('deck'));
    newState.currentQuestionTimeSlice -= newState.seconds;
    updateState(newState);
  }

  const writeState = (newState: State) => {
    const combinedState = combineState(newState);
    sessionStorage.setItem('state', JSON.stringify(combinedState));
  }

  const updateState = (newState: State) => {
    const combinedState = combineState(newState);
    setState(combinedState);
    writeState(combinedState);
  }

  const nextQuestionCallback = () => {

    stopwatch.reset();

    client.channel(state.lobby).send({
      type: 'broadcast',
      event: 'nextQuestion',
      payload: {
        question: state.deck.questions[state.questionIndex + 1].question,
        answers: state.deck.questions[state.questionIndex + 1].answers,
      },
    });

    updateState({
      questionScreen: true,
      scoreScreen: false,
      currentQuestionTimeSlice: state.questionTimeSlice,
      questionIndex: state.questionIndex + 1,
    });

  }

  const answerRecievedCallback = ({ answer, name }:
    { answer: number, name: string }) => {

    // check if player is already in playerData
    const present = state.playerData.filter((data) => {
      return data.name === name;
    }).length > 0;

    if (present) {
      const newPlayerData = [...state.playerData.map((data) => {
        if (data.name === name) {
          const answerExists = data.answers.filter(
            (answer) => answer.questionIndex === state.questionIndex).length === 0;
          if (answerExists) {
            data.answers = [...data.answers, {
              questionIndex: state.questionIndex,
              answerIndex: answer,
            }];
            data.score += answer === state.deck.questions[state.questionIndex].answer ? 1 : 0;
          }
        }
        return data;
      })];
      updateState({ playerData: newPlayerData });
    }

    else {
      const newPlayerData = [...state.playerData, {
        name: name,
        score: answer === state.deck.questions[state.questionIndex].answer ? 1 : 0,
        answers: [{
          questionIndex: state.questionIndex,
          answerIndex: answer,
        }],
      }];
      updateState({ playerData: newPlayerData });
    }

  }

  const handleQuestionEnd = () => {
    if (state.questionIndex + 1 < state.deck.questions.length) {
      updateState({
        questionScreen: false,
        scoreScreen: true,
      });
      client.channel(state.lobby).send({
        type: 'broadcast',
        event: 'questionEnd',
        payload: {},
      });
    } else {
      updateState({
        questionScreen: false,
        scoreScreen: false,
        finished: true,
      });
      client.channel(state.lobby).send({
        type: 'broadcast',
        event: 'end',
        payload: {},
      });
    }
  }

  if (typeof sessionStorage !== 'undefined' && stopwatch.seconds !== state.seconds)
    updateState({ seconds: stopwatch.seconds });

  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      loadState();
      initialized.current = true;
    }

  }, []);

  useEffect(() => {
    client.channel(sessionStorage.getItem('lobby'))
      .on(
        'broadcast',
        { event: 'answer' },
        (payload) => answerRecievedCallback(payload.payload),
      )
      .subscribe();
  }, [state.playerData, state.questionIndex]);

  return (
    <div className="bg-gray-100 h-screen">

      {
        initialized.current &&
        <div className="absolute w-full text-3xl font-bold">
          <div className="flex w-full p-4">
            <span className="flex-auto">
              {state.questionIndex + 1} / {state.deck.questions.length}
            </span>
            <span className="flex-auto text-center">
              {
                state.scoreScreen &&
                <>
                  Correct answer: {
                    state.deck.questions[state.questionIndex]
                      .answers[state.deck.questions[state.questionIndex].answer]
                  }
                </>
              }
            </span>
            <span className="flex-auto" />
          </div>
        </div>
      }

      {
        state.questionScreen && initialized.current &&
        <>
          <div className="h-screen content-center text-center text-5xl font-bold">
            {state.deck.questions[state.questionIndex].question}
          </div>
          <TimerBar length={state.currentQuestionTimeSlice} stopwatch={stopwatch}
            onEndCallback={handleQuestionEnd} />
        </>
      }

      {
        state.scoreScreen && initialized.current &&
        <div className="text-center content-center h-screen text-5xl">

          <button
            className="bg-white border-2 border-gray-200 p-3 rounded-lg
                       shadow-[5px_5px_2px_rgb(0,0,0,0.25)]"
            onClick={nextQuestionCallback}>
            next question
          </button>

          {
            state.playerData.map((data) => {
              return (
                <>
                  {
                    data.answers[data.answers.length - 1].questionIndex === state.questionIndex &&
                    data.answers[data.answers.length - 1].answerIndex !== -1 &&
                    <div className="mt-6 text-3xl">
                      {data.name} answered {
                        state.deck.questions[state.questionIndex]
                          .answers[data.answers[data.answers.length - 1].answerIndex]
                      } and has a score of {data.score}!
                    </div>
                  }
                </>
              );
            })
          }

        </div>
      }

      {
        state.finished &&
        <div className="h-screen content-center text-center font-bold text-5xl">
          <button
            className="bg-white border-2 border-gray-200 p-3 rounded-lg
                       shadow-[5px_5px_2px_rgb(0,0,0,0.25)]"
            onClick={() => router.push("/")}>
            Go home
          </button>
        </div>
      }

    </div>
  );

}

export default Session;
