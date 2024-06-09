'use client'

import React, { useState, useRef, useEffect, useReducer } from 'react';
import Navbar from '../components/navbar';
import LZString from 'lz-string';


type PathElement = {
  type: "col" | "row";
  direction: "left" | "right";
}

type Mouse = {
  movement: "horizontal" | "vertical",
  target: number,
}

type Content = {
  lines: number;
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
  type: 'set_target_id' | 'set_section' | 'toggle_edit_position' | 'toggle_edit_content' | 'set_state';
  section?: Section;
  id?: number;
  state?: State;
}

type State = {
  isEditingPosition: boolean;
  isEditingContent: boolean;
  targetId: number;
  section: Section;
  options: MenuOptions;
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

const isTop = (path: PathElement[]) => {
  return path
    .filter((elem: PathElement) => elem.type === "col")
    .filter((elem: PathElement) => elem.direction === "right")
    .length === 0;
}

const isBottom = (path: PathElement[]) => {
  return path
    .filter((elem: PathElement) => elem.type === "col")
    .filter((elem: PathElement) => elem.direction === "left")
    .length === 0;
}

const isLeft = (path: PathElement[]) => {
  return path
    .filter((elem: PathElement) => elem.type === "row")
    .filter((elem: PathElement) => elem.direction === "right")
    .length === 0;
}

const isRight = (path: PathElement[]) => {
  return path
    .filter((elem: PathElement) => elem.type === "row")
    .filter((elem: PathElement) => elem.direction === "left")
    .length === 0;
}

const getRoot = (section: Section) => {
  while (section.parent !== undefined)
    section = section.parent;
  return section
}

const getId = (section: Section | undefined, id: number): Section | undefined => {
  if (section === undefined)
    return undefined;

  if (section.id === id)
    return section;

  const left = getId(section.left, id);
  const right = getId(section.right, id);

  if (left !== undefined)
    return left;
  if (right !== undefined)
    return right;
  return undefined;

}

const depth = (section: Section | undefined, id: number): number => {
  if (section === undefined)
    return 0;

  if (section.id === id)
    return 1;

  const left = depth(section.left, id);
  const right = depth(section.right, id);

  return left + right + 1;

}

const del = (section: Section) => {

}

const Menu = ({ option, className }: { option: MenuOption, className?: string }) => {

  const [selectedOption, setSelectedOption] = useState(
    option.selected !== undefined ? option.selected : -1
  );

  const inputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    if (option.type === 'typed') {
      if (option.content !== undefined)
        inputRef.current.value = option.content;
      else
        inputRef.current.value = "";
    }
  }, [inputRef]);

  useEffect(() => {
    option.selected = selectedOption;
  }, [selectedOption])

  return (

    <div className={`${className}`}>
      {
        option.type === 'dropdown' &&
        <div className="m-4 p-2 flex-auto max-w-40 bg">
          <div className="duration-100 font-bold border-gray-400 border-b-2">
            {option.title}
          </div>
          {
            true &&
            <div className="flex flex-col flex-auto">
              {
                option.options.map((s: string, index: number) => {
                  return (
                    <button key={index} className="flex-auto hover:text-yellow-400 duration-100"
                      onClick={() => setSelectedOption(index)}
                    >
                      <div
                        style={{
                          fontWeight: selectedOption === index ? 'bold' : '',
                          borderBottom: selectedOption === index ? '4px' : '',
                          borderBottomColor: selectedOption === index ? 'black' : '',
                        }}
                      >
                        {s}
                      </div>
                    </button>
                  );
                })
              }
            </div>
          }
        </div>
      }

      {
        option.type === 'typed' &&
        <div className="my-4 flex flex-col h-[40px] text-left rounded-lg w-full">
          <div className="flex-auto text-xs font-bold text-gray-500">
            {option.title}
          </div>
          <div className="flex-auto">
            <input type={option.inputType} className="w-full outline-none border-b-2 border-gray-400"
              placeholder={option.placeholder}
              ref={inputRef}
              onInput={(event) => {
                option.content = event.currentTarget.value;
              }}
            />
          </div>
        </div>
      }

    </div>
  );
}

const TraverseHelper: React.ElementType = (
  {
    section,
    path,
    handleSplit,
    setMouse,
    mouse,
    state,
    dispatch,
  }
    : {
      section: Section | undefined,
      path: PathElement[],
      handleSplit: (
        type: "vertical" | "horizontal" | "full",
        path: PathElement[],
      ) => void
      setMouse: (val: Mouse) => void,
      mouse: Mouse | undefined,
      state: State,
      dispatch: (action: any) => void
    }
) => {

  const [displayHorizontalSplit, setDisplayHorizontalSplit] = useState(false);
  const [displayVerticalSplit, setDisplayVerticalSplit] = useState(false);

  const VerticalSplit = () => {
    return (
      <div className="absolute w-full h-full">
        <div className="h-full w-[1px] bg-gray-500 m-auto" />
      </div>
    );
  }

  const HorizontalSplit = () => {
    return (
      <div className="absolute w-full h-full content-center">
        <div className="h-[1px] w-full bg-gray-500 m-auto" />
      </div>
    );
  }

  const Splitter = ({ className }: { className?: string }) => {
    return (

      <div className={`${className}`}
      >
        <div className={`relative w-[50px] `}
        >
          <div className="h-[50px] w-[50px] m-auto drop-shadow">

            <button className="rounded absolute ml-[17px] mt-[16px] z-10 w-4 m-auto h-4 bg-gray-300
                               hover:bg-gray-500 duration-100"
              onMouseEnter={() => {
                setDisplayVerticalSplit(true);
                setDisplayHorizontalSplit(true);
              }}
              onMouseLeave={() => {
                setDisplayVerticalSplit(false);
                setDisplayHorizontalSplit(false);
              }}
              onClick={() => handleSplit("full", path)}
            />

            <button className="rounded absolute mt-[20px] bg-gray-400 w-[50px] h-2 m-auto
                               hover:bg-gray-500 duration-100"
              onMouseEnter={() => {
                setDisplayHorizontalSplit(true)
                setDisplayVerticalSplit(false)
              }}
              onMouseLeave={() => {
                setDisplayHorizontalSplit(false)
                setDisplayVerticalSplit(false)
              }}
              onClick={() => handleSplit("horizontal", path)}
            />

            <button className="rounded absolute ml-[21px] bg-gray-400 w-2 h-[50px] m-auto
                               hover:bg-gray-500 duration-100"
              onMouseEnter={() => {
                setDisplayVerticalSplit(true)
                setDisplayHorizontalSplit(false)
              }}
              onMouseLeave={() => {
                setDisplayVerticalSplit(false)
                setDisplayHorizontalSplit(false)
              }}
              onClick={() => handleSplit("vertical", path)}
            />

          </div>
        </div>

      </div>
    );
  }


  return (

    <>


      {
        section.type !== "leaf" &&
        <>
          <div
            className={`flex-auto flex flex-${section.type}`}
            style={{ width: `${section.width}%`, height: `${section.height}%` }}
          >
            {
              section.left !== undefined &&
              <TraverseHelper
                state={state}
                section={section.left}
                mouse={mouse}
                setMouse={setMouse}
                path={[...path, { direction: "left", type: section.type }]}
                dispatch={dispatch}
                handleSplit={handleSplit} />
            }
            {
              section.right !== undefined &&
              <TraverseHelper
                state={state}
                dispatch={dispatch}
                section={section.right}
                mouse={mouse}
                setMouse={setMouse}
                path={[...path, { direction: "right", type: section.type }]}
                handleSplit={handleSplit} />
            }
          </div>
        </>
      }

      {
        section.type === "leaf" &&
        <>
          <div className={`relative w-full border-gray-200 border `}
            style={{ width: `${section.width}%`, height: `${section.height}%` }}
            onMouseLeave={() => {
              setDisplayVerticalSplit(false);
              setDisplayHorizontalSplit(false);
            }}
          >
            {
              state.isEditingPosition &&
              <div className="absolute h-full w-full"
              >

                {
                  !isTop(path) &&
                  <div className="absolute z-50 bg-green-100 -translate-y-[7px] w-full h-2 scale-y-[200%]
                      hover:cursor-row-resize"
                    onMouseDown={() => {
                      setMouse({
                        movement: "vertical",
                        target: section.id,
                      })
                    }}
                  />
                }

                {
                  !isLeft(path) &&
                  <div className="absolute bg-red-100 z-50 -translate-x-[7px] w-2 h-full scale-x-[200%]
                      hover:cursor-col-resize"
                    onMouseDown={() => {
                      setMouse({
                        movement: "horizontal",
                        target: section.id,
                      })
                    }}
                  />
                }

                <div className="z-10 relative h-full w-full ">
                  <div className="flex flex-col absolute z-20 w-full h-full justify-center items-center ">
                    <div className="absolute w-full h-full p-2 ">
                      {section.id}
                    </div>
                    <div className="flex-auto" />
                    <Splitter className="flex-auto content-center"
                    />
                    <div className="flex-auto " />
                  </div>

                  {
                    displayVerticalSplit &&
                    <VerticalSplit />
                  }

                  {
                    displayHorizontalSplit &&
                    <HorizontalSplit />
                  }

                </div>
              </div>
            }

            {
              state.isEditingContent &&
              <button className="right-0 bottom-0 absolute mr-2 mb-1 font-extrabold text-2xl text-gray-500"
                style={{ color: state.targetId === section.id ? '#2563eb' : '' }}
                onClick={() => dispatch({ type: 'set_target_id', id: section.id })}>
                E
              </button>
            }

            <div className="w-[100%] h-[100%]"
              style={{ background: section.content !== undefined ? section.content.style.background : '' }}
            >
              {
                section.content !== undefined &&
                <div className={`w-full h-full`} style={{ ...section.content.style }}>
                  <div>
                    {section.content.text.map((s, index) => <div key={index}>{s}&nbsp;</div>)}
                  </div>
                </div>

              }
            </div>
          </div>
        </>
      }

    </>

  );

}

const Traverse: React.ElementType = (
  {
    section,
    handleSplit,
    setMouse,
    mouse,
    state,
    dispatch,
  }
    : {
      section: Section | undefined,
      handleSplit: (
        type: "vertical" | "horizontal" | "full",
        path: PathElement[],
      ) => void,
      setMouse: (val: Mouse) => void,
      mouse: Mouse | undefined,
      state: State,
      dispatch: (action: any) => void,
    }
) => {
  return (
    <TraverseHelper
      section={section}
      dispatch={dispatch}
      state={state}
      mouse={mouse}
      setMouse={setMouse}
      path={[]}
      handleSplit={handleSplit} />
  )
}

const handleHorizontalMovement = (event: React.MouseEvent, mouse: Mouse, section: Section) => {

  let target = getId(section, mouse.target);
  while (target.parent.type !== "row" || target.parent.right.id !== target.id || target.parent === undefined)
    target = target.parent;

  const sibling = target.parent.left.id === target.id ?
    target.parent.right : target.parent.left;


  const movement = event.movementX / event.screenX * 100;


  const g = (target.width - sibling.width) / 2;

  let width = 50 + g;

  width -= movement;


  const diff = (width - 50) * 2;

  if (diff > 0) {
    sibling.width = 100 - diff;
    target.width = 100;
  }
  if (diff < 0) {
    target.width = 100 + diff;
    sibling.width = 100;
  }

  sibling.width = Math.min(sibling.width, 100);
  target.width = Math.min(target.width, 100);

  sibling.width = Math.max(sibling.width, 0);
  target.width = Math.max(target.width, 0);

  return structuredClone(section);

}

const handleVerticalMovement = (event: React.MouseEvent, mouse: Mouse, section: Section) => {

  let target = getId(section, mouse.target);
  while (target.parent.type !== "col" || target.parent.right.id !== target.id || target.parent === undefined)
    target = target.parent;

  const sibling = target.parent.left.id === target.id ?
    target.parent.right : target.parent.left;

  const movement = event.movementY / event.pageY * 100;

  const g = (target.height - sibling.height) / 2;

  let height = 50 + g;

  height -= movement;

  const diff = (height - 50) * 2;

  if (diff > 0) {
    sibling.height = 100 - diff;
    target.height = 100;
  }
  if (diff < 0) {
    target.height = 100 + diff;
    sibling.height = 100;
  }

  sibling.height = Math.min(sibling.height, 100);
  target.height = Math.min(target.height, 100);

  sibling.height = Math.max(sibling.height, 0);
  target.height = Math.max(target.height, 0);

  return structuredClone(section)
}

const ContentManagementSystem = () => {

  const nextId = useRef(1);

  const [mouse, setMouse] = useState<Mouse | undefined>(undefined);

  const textContent = useRef<HTMLTextAreaElement>();

  const reducer = (state: State, action: Action): State => {

    if (action.type === 'toggle_edit_position') {
      const newState: State = {
        ...state,
        isEditingContent: false,
        isEditingPosition: state.isEditingPosition === true ? false : true
      }
      console.log(newState)
      return newState;
    }

    if (action.type === 'toggle_edit_content') {
      const newState: State = {
        ...state,
        isEditingContent: state.isEditingContent === true ? false : true,
        isEditingPosition: false,
      }

      if (!newState.isEditingContent) {
        newState.targetId = -1;
      }

      return newState;
    }

    if (action.type === 'set_section') {
      const newState: State = {
        ...state,
        section: action.section,
      }
      return newState
    }

    if (action.type === 'set_target_id') {
      const newState: State = {
        ...state,
        targetId: action.id,
      }

      const section = getId(newState.section, action.id);

      if (section !== undefined && section.content !== undefined) {
        if (textContent.current !== null && textContent.current !== undefined)
          textContent.current.value = section.content.text[0];
      } else {
        if (textContent.current !== null && textContent.current !== undefined)
          textContent.current.value = "";
      }

      return newState

    }

    if (action.type === 'set_state') {
      return { ...action.state }
    }

    return { ...state }
  }


  const [state, dispatch] = useReducer<(state: State, action: Action) => State>(reducer, {
    isEditingPosition: false,
    isEditingContent: false,
    targetId: -1,
    options: {
      fontSize: {
        title: 'font size',
        type: 'typed',
        inputType: 'number',
        placeholder: '15',
      },
      fontWeight: {
        title: 'font weight',
        type: 'dropdown',
        options: ['normal', 'bold'],
        selected: 0,
      },
      verticalAlign: {
        title: 'vertical alignment',
        type: 'dropdown',
        options: ['start', 'center', 'end'],
        selected: 0,
      },
      horizontalAlign: {
        title: 'horizontal alignment',
        type: 'dropdown',
        options: ['left', 'center', 'right'],
        selected: 0,
      },
      textAlign: {
        title: 'text alignment',
        type: 'dropdown',
        options: ['left', 'center', 'right'],
        selected: 0,
      },
      margin: {
        title: 'padding',
        type: 'typed',
        inputType: 'number',
      },
      backgroundColor: {
        title: 'background color',
        type: 'typed',
        inputType: 'text',
        placeholder: '#FFFFFF',
      }
    },
    section: {
      type: 'leaf',
      id: 0,
      width: 100,
      height: 100,
      parent: undefined,
    }
  });

  useEffect(() => {
    const target = getId(state.section, state.targetId);
    if (
      textContent.current !== undefined &&
      textContent.current !== null &&
      target !== undefined &&
      target.content !== undefined
    )
      textContent.current.value = target.content.text[0];
  }, [state.targetId, state.section]);

  const handleSplit = (
    type: "vertical" | "horizontal" | "full",
    path: PathElement[],
  ) => {

    // find the parent of the element to insert
    const newSection = structuredClone(state.section);
    let parent = newSection;
    for (let i = 0; i < path.length; i++)
      if (path[i].direction === "left")
        parent = parent.left;
      else if (path[i].direction === "right")
        parent = parent.right;

    const leftLeaf: Section = {
      type: "leaf",
      parent: parent,
      id: nextId.current++,
      width: 100,
      height: 100,
    }

    const rightLeaf: Section = structuredClone(leftLeaf);
    rightLeaf.id = nextId.current++;

    parent.left = leftLeaf;
    parent.right = rightLeaf;

    leftLeaf.content = parent.content;
    parent.content = undefined;

    if (type === "vertical")
      parent.type = "row";

    else if (type === "horizontal")
      parent.type = "col";

    leftLeaf.parent = parent;
    rightLeaf.parent = parent;

    dispatch({ type: 'set_section', section: newSection });
  }

  const handleMouse = (event: React.MouseEvent, mouse: Mouse) => {
    if (mouse === undefined)
      return;

    if (mouse.movement === "vertical")
      dispatch({ type: 'set_section', section: handleVerticalMovement(event, mouse, state.section) });


    else if (mouse.movement === "horizontal")
      dispatch({ type: 'set_section', section: handleHorizontalMovement(event, mouse, state.section) });
  }


  const handleInsertText = () => {
    const root = structuredClone(state.section);
    const target = getId(root, state.targetId);

    const assignDropdownOption = (option: MenuOption) => {
      return `${option.selected !== -1 ?
        option.options[option.selected] : ''}` as any;
    }

    target.content = {
      lines: 1,
      text: [textContent.current.value],
      style: {
        fontSize: `${parseFloat(state.options.fontSize.content) / 10}vw`,
        justifyContent: assignDropdownOption(state.options.horizontalAlign),
        alignItems: assignDropdownOption(state.options.verticalAlign),
        background: state.options.backgroundColor.content,
        textAlign: assignDropdownOption(state.options.textAlign),
        fontWeight: assignDropdownOption(state.options.fontWeight),
        display: 'inline-flex',
        lineHeight: 'full',
        overflow: 'hidden',
      }
    }

    dispatch({ type: 'set_section', section: root })
  }

  useEffect(() => {
    const stateString = new URLSearchParams(window.location.search).get('state');
    if (stateString !== null) {
      const newState = JSON.parse(LZString.decompressFromEncodedURIComponent(stateString));
      console.log(newState);
      if (newState !== null) {
        dispatch({ type: 'set_state', state: newState })
      }
    }
  }, [])

  useEffect(() => {

    const id = setInterval(() => {
      const param = JSON.stringify(state, (key, value) => {
        if (key === 'parent')
          return undefined
        else
          return value;
      });
      if (window !== undefined)
        window.history.pushState(
          null,
          null,
          `/cms?state=${LZString.compressToEncodedURIComponent(param)}`
        );
    }, 1000);

    return () => clearInterval(id);

  }, [state]);

  return (
    <>
      <Navbar />
      <div className="flex bg-gray-100 h-screen text-black" onMouseUp={() => setMouse(undefined)}>
        <div className="flex w-full">
          <div className="flex-none w-[350px]">
            {
              state.isEditingContent &&
              <div className="bg-white w-[350px] h-full duration-100" >
                <div className="flex flex-col h-full px-3 pt-20 shadow-[5px_5px_2px_rgb(0,0,0,0.25)]">
                  {
                    state.targetId !== -1 &&
                    <div className="flex flex-col text-center w-full text-gray-600 overflow-y-scroll">
                      <textarea className="flex-auto border-black border-b-4 mb-2" ref={textContent} />
                      <div className="flex flex-wrap flex-auto w-full content-center justify-center">
                        <Menu option={state.options.fontSize} className="" />
                        <Menu option={state.options.fontWeight} className="" />
                        <Menu option={state.options.verticalAlign} className="" />
                        <Menu option={state.options.horizontalAlign} className="" />
                        <Menu option={state.options.textAlign} className="" />
                        <Menu option={state.options.margin} className="" />
                        <Menu option={state.options.backgroundColor} className="" />
                      </div>
                      <div className="flex-auto pt-4">
                        <button className="font-bold flex-auto border-b-4 pb-1 border-gray-600 duration-100
                          hover:border-yellow-400 hover:text-yellow-400"
                          onClick={handleInsertText}
                        >
                          Insert Text
                        </button>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
          <div className="flex-col flex-none w-[60%] container content-center m-auto px-2">
            <div className="flex bg-white justify-center aspect-video select-none w-full
              shadow-[5px_5px_2px_rgb(0,0,0,0.25)]"
              onMouseMove={(event: React.MouseEvent) => handleMouse(event, mouse)}
            >
              <Traverse
                section={state.section}
                dispatch={dispatch}
                state={state}
                mouse={mouse}
                setMouse={setMouse}
                handleSplit={handleSplit}
                setSection={(section: Section) => dispatch({ type: 'set_section', section: section })} />
            </div>
            <button className="shadow-[5px_5px_2px_rgb(0,0,0,0.25)] duration-100
              hover:scale-[101%] mt-5 lg:mb-0 p-5 rounded-xl bg-white text-lg
              border-gray-200 border-2 text-gray-600"
              style={{ background: state.isEditingPosition ? "#f3f4f6" : "white" }}
              onClick={() => dispatch({ type: 'toggle_edit_position' })}
            >
              Edit Position
            </button>
            <button className="shadow-[5px_5px_2px_rgb(0,0,0,0.25)] duration-100
              hover:scale-[101%] mt-5 lg:mb-0 p-5 rounded-xl bg-white text-lg
              border-gray-200 border-2 text-gray-600 ml-5"
              style={{ background: state.isEditingContent ? "#f3f4f6" : "white" }}
              onClick={() => {
                dispatch({ type: 'toggle_edit_content' })
              }}
            >
              Edit Content
            </button>
          </div>
          <div className="flex-none w-[350px]" />
        </div>
      </div>
    </>
  );
}

export default ContentManagementSystem;
