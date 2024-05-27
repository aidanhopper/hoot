'use client'

import { useEffect } from 'react';

type timerbar = {
  length: number;
  stopwatch: any;
  offset: number;
  onEndCallback?: () => void;
}

const TimerBar = ({ length, stopwatch, offset, onEndCallback }: timerbar) => {

  const seconds = stopwatch.seconds;

  const len = length;

  const barstyle = {
    transition: `width ${len / 2}s linear`,
    width: `${seconds / len * 100 * 2 < 100 ? seconds / len * 100 * 2 : 100}%`,
  }

  useEffect(() => {
    if (seconds >= length)
      onEndCallback();
  }, [seconds]);

  return <div className="absolute bottom-0 bg-blue-500 h-5" style={barstyle} />

}

export default TimerBar;
