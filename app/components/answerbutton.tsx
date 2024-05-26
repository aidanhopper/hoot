type AnswerButtonProps = {
  children: JSX.Element,
  color: string,
  borderColor: string,
  id: number,
  selected: number,
  callback: () => void,
}

const AnswerButton = ({ children, color, borderColor, id, selected, callback }:
  AnswerButtonProps) => {

  let displayColor = "";
  if (id != selected)
    displayColor += color + "  border-4 border-transparent";
  else
    displayColor += color + " border-4 " + borderColor;

  let classes = `flex-auto shadow-[5px_5px_2px_rgb(0,0,0,0.25)] p-32 m-5 rounded-lg text-3xl
                   hover:scale-[101%] duration-100 w-1/2 
                   active:scale-[101%] ` + displayColor;

  return (
    <button
      className={classes}
      onClick={callback}>
      <div></div>
      {children}
    </button>
  );
}

export default AnswerButton;
