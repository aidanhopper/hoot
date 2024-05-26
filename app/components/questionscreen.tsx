'use client'

import AnswerButton from './answerbutton';

type QuestionScreenProps = {
  question: string,
  answers: string[],
  className?: string,
  selectedIndex: number,
  setSelectedIndex: (num: number) => void
}

const QuestionScreen = (props: QuestionScreenProps) => {

  // need to extract this after some time
  return (
    <div className={props.className as string}>
      <div className="justify-center mx-auto flex flex-col container place-content-center">
        <div className="font-bold flex-auto text-center text-6xl content-center">
          {props.question}
        </div>
        <div className="flex flex-col flex-auto mt-20 text-center">
          <div className="flex flex-auto">
            <AnswerButton
              color="bg-green-200"
              borderColor="border-green-300"
              id={0 as number}
              selected={props.selectedIndex}
              callback={() => props.setSelectedIndex(0)}>
              {props.answers[0] as unknown as JSX.Element}
            </AnswerButton>
            <AnswerButton
              color="bg-blue-200"
              borderColor="border-blue-300"
              id={1 as number}
              selected={props.selectedIndex}
              callback={() => props.setSelectedIndex(1)}>
              {props.answers[1] as unknown as JSX.Element}
            </AnswerButton>
          </div>
          <div className="flex flex-auto">
            <AnswerButton
              color="bg-yellow-200"
              borderColor="border-yellow-300"
              id={2 as number}
              selected={props.selectedIndex}
              callback={() => props.setSelectedIndex(2)}>
              {props.answers[2] as unknown as JSX.Element}
            </AnswerButton>
            <AnswerButton
              color="bg-purple-200"
              borderColor="border-purple-300"
              id={3 as number}
              selected={props.selectedIndex}
              callback={() => props.setSelectedIndex(3)}>
              {props.answers[3] as unknown as JSX.Element}
            </AnswerButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionScreen;
