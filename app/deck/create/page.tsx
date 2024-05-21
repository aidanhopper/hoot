import Deck from '../../deck.json';
import { Question } from '../../types';

type QuestionSlideProps = {
  q: Question;
}

type TextboxProps = {
  children?: JSX.Element;
  className?: string;
  id: string;
}

const CreateDeck = () => {

  const qlist: Question[] = Deck.deck;

  const Textbox = (props: TextboxProps) => {
    const classes = `flex-auto m-2 rounded-lg content-center 
                     text-ellipsis overflow-hidden ${props.className}`;
    return (
      <div className={classes} id={props.id}
        role="textbox" contentEditable="true" suppressContentEditableWarning={true}>
        {props.children}
      </div>
    );
  }

  const AddButton = () => {
    return (
      <button className="text-5xl border-black w-[35px] text-center
        hover:scale-[110%] duration-200 hover:text-blue-600">
        +
      </button>
    );
  }

  const QuestionSlide = ({ q }: QuestionSlideProps) => {
    return (
      <div className="flex h-full flex-col">
        <div className="flex-auto" />
        <div className="flex-auto content-center m-auto ">
          <Textbox id="textbox1" className="text-3xl min-w-[100px] border-b-2 rounded-none border-black">
            {q.question as unknown as JSX.Element}
          </Textbox>
        </div>
        <div className="flex-auto flex flex-col w-[50%] m-auto text-2xl">
          <div className="flex flex-auto text-center ">
            <Textbox className="bg-blue-300 w-1/2 rounded-full" id="textbox1">
              {q.answers[0] as unknown as JSX.Element}
            </Textbox>
            <Textbox className="bg-purple-300 w-1/2 rounded-full" id="textbox1">
              {q.answers[1] as unknown as JSX.Element}
            </Textbox>
          </div>
          <div className="flex flex-auto text-center">
            <Textbox className="bg-green-300 w-1/2 rounded-full" id="textbox1">
              {q.answers[2] as unknown as JSX.Element}
            </Textbox>
            <Textbox className="bg-red-300 w-1/2 rounded-full" id="textbox1">
              {q.answers[3] as unknown as JSX.Element}
            </Textbox>
          </div>
        </div>
        <div className="flex-auto" />
        <div className="flex-auto" />
      </div>
    );
  }

  return (
    <div className="bg-white h-screen content-center font-sans overflow-hidden">
      <div className="flex flex-col">
        <div className="flex-none">
        </div>
        <div className="flex-auto flex flex-col h-screen container m-auto">
          <div className="flex-auto bg-white h-[50%] shadow-[5px_5px_2px_rgb(0,0,0,0.25)]
            m-32 border-gray-100 border-2">
            <QuestionSlide q={qlist[0]} />
          </div>
          <div className="flex-auto ">
            <AddButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateDeck;
