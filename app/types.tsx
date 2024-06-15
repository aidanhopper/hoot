type Player = {
  name: string;
  score: number;
  answers: { questionIndex: number, answerIndex: number }[],
}

type Lobby = {
  lobby: string;
  deck: string;
  players: Player[];
  started: boolean;
}

type Question = {
  question: string,
  answer: number,
  answers: string[],
}

type Deck = {
  title: string,
  description: string,
  questions: Question[],
}

type PathElement = {
  type: "col" | "row";
  direction: "left" | "right";
}

type Mouse = {
  movement: "horizontal" | "vertical",
  target: number,
}

type Content = {
  type: 'text';
  text: string[];
  style: React.CSSProperties;
}

type MenuOption = {
  title: string;
  type: 'dropdown' | 'typed' | 'button';
  inputType?: string;
  options?: string[];
  placeholder?: string;
  selected?: number;
  content?: string;
  isActive?: boolean;
}

type MenuOptions = {
  fontSize: MenuOption;
  fontWeight: MenuOption;
  verticalAlign: MenuOption;
  horizontalAlign: MenuOption;
  textAlign: MenuOption;
  backgroundColor: MenuOption;
  margin: MenuOption;
}

type Action = {
  type: 'set_target_id' |
        'set_section' |
        'toggle_edit_position' |
        'toggle_edit_content' |
        'set_mouse' |
        'set_current_slide' |
        'set_state';
  section?: Section;
  id?: number;
  state?: State;
  mouse?: Mouse;
  currentSlide?: number;
}

type State = {
  isEditingPosition: boolean;
  isEditingContent: boolean;
  targetId: number;
  section: Section[];
  options: MenuOptions;
  mouse?: Mouse;
  currentSlide: number;
}

type Section = {
  type: "row" | "col" | "leaf";
  id: number;
  left?: Section;
  right?: Section;
  parent: Section | undefined;
  content?: Content;
  width: number;
  height: number;
}

export type {
  Player, Lobby, Deck, Question, MenuOption, MenuOptions,
  Content, PathElement, Action, Section, State, Mouse,
};
