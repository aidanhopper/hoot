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



  return (
    <div className="bg-gray-100 h-screen font-sans overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="flex-none content-center bg-white h-[40px]">
          Navbar
        </div>
        <div className="flex-auto container m-auto pt-[50px] px-[200px]">
          <div className="flex">
            <span className="flex-auto font-bold text-xl">
              Create a new deck
            </span>
            <span className="flex-auto text-right">
              <button className="border-gray-400 hover:bg-gray-200 text-blue-800
                border-2 duration-200 py-1 px-8 rounded-lg">
                Create
              </button>
            </span>
          </div>
          <div className="flex-auto">
            asdf
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateDeck;
