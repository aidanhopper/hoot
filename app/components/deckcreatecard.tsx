import { Question } from '../types';

type TextboxProps = {
  children?: JSX.Element;
  className?: string;
  id: string;
}

const Textbox = (props: TextboxProps) => {
  const classes = `content-center overflow-hidden min-w-screen 
                     font-bold outline-none border-b-2 
                     border-gray-200 focus:border-yellow-300 max-w-full`;
  return (
    <div className={`${props.className}`}>
      <div className={classes} role="textbox" id={props.id}
        contentEditable="true" suppressContentEditableWarning={true}>
        {props.children}
      </div>
    </div>
  );
}

const CardTextBox = ({ children, id, text }:
  { children?: string, id: string, text?: string }) => {
  return (
    <>
      <div className="flex w-full">
        <div className="flex-none font-bold content-center ml-3 text-gray-400">
          {children}
        </div>
        <Textbox className="w-full p-2" id={id}>
          {text as unknown as JSX.Element}
        </Textbox>
        <div className="flex-auto">
        </div>
      </div>
    </>
  );
}

const AnswerButton = ({ children, className }: { children: string, className?: string }) => {
  return (
    <div className={className}>
      <button className="border-gray-300 px-3 py-1 border-2 text-sm text-gray-400 
          hover:bg-gray-100 duration-100 rounded-lg">
        {children}
      </button>
    </div>
  );
}

const Card = ({ className, question, index }:
  { className?: string, question: Question, index: number }) => {

  return (
    <div className={`${className} mb-6`}>
      <div className="w-full bg-white rounded-lg">
        <div className="flex border-b-2 text-gray-400 p-4 font-bold text-lg ">
          <span className="flex-auto">
            {index}
          </span>
          <AnswerButton className="flex-auto text-center">
            A1
          </AnswerButton>
          <AnswerButton className="flex-auto text-center">
            A2
          </AnswerButton>
          <AnswerButton className="flex-auto text-center">
            A3
          </AnswerButton>
          <AnswerButton className="flex-auto text-center">
            A4
          </AnswerButton>
          <div className="flex-auto text-right">
            <button className="hover:text-red-500 duration-100">
              X
            </button>
          </div>
        </div>
        <CardTextBox id="question" text={question.question}>
          Q&nbsp;
        </CardTextBox>
        <CardTextBox id="answer1" text={question.answers[0]}>
          A1
        </CardTextBox>
        <CardTextBox id="answer2" text={question.answers[1]}>
          A2
        </CardTextBox>
        <CardTextBox id="answer3" text={question.answers[2]}>
          A3
        </CardTextBox>
        <CardTextBox id="answer4" text={question.answers[3]}>
          A4
        </CardTextBox>
      </div>
    </div>
  );
}

export default Card;
