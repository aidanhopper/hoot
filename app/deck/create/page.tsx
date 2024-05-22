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

  const cards: Question[] = [];
  cards.push(Deck.deck[0]);

  const Textbox = (props: TextboxProps) => {
    const classes = `flex-auto m-2 rounded-lg content-center 
                     text-ellipsis outline-none overflow-hidden 
                     ${props.className}`;
    return (
      <div className={classes} id={props.id}
        role="textbox" contentEditable="true" suppressContentEditableWarning={true}>
        {props.children}
      </div>
    );
  }

  const AddButton = ({ className }: { className?: string }) => {
    return (
      <button className={`text-5xl border-black w-[35px] text-center
        hover:scale-[110%] duration-200 hover:text-blue-600 ${className}`}>
        +
      </button>
    );
  }

  const Card = ({ q }: { q: Question }) => {
    return (
      <button className="bg-gray-100 rounded-xl w-[300px] h-[200px] 
        shadow-[5px_5px_2px_rgb(0,0,0,0.25)] p-1  text-center content-center
        hover:scale-[101%] duration-100 text-xl mr-8">
        {q.question}
      </button>
    );
  }

  const QuestionSlide = ({ q }: QuestionSlideProps) => {
    return (
      <div className="flex h-full flex-col">
        <div className="flex-auto" />
        <div className="flex-auto content-center m-auto ">
          <Textbox id="textbox1" className="text-3xl min-w-[100px] border-b-2 
            rounded-none border-black">
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
        <div className="flex flex-auto flex-col">
          <div className="flex-none">
          </div>
          <div className="flex-auto flex flex-col h-screen container m-auto">
            <div className="flex-auto bg-white h-[40%] shadow-[5px_5px_2px_rgb(0,0,0,0.25)]
              mt-16 ml-16 mr-16 border-gray-100 border-2">
              {cards.length > 0 && <QuestionSlide q={cards[0]} />}
            </div>
            <div className="content-center flex-auto items-center border border-black">
              <AddButton className="-auto w-[100px] flex-none" />
              <Card q={cards[0]}/>
              <Card q={cards[0]}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateDeck;
