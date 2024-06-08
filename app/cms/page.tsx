'use client'

import React, { useState, useRef, useEffect, useReducer } from 'react';
import Navbar from '../components/navbar';


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
  className?: string;
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

type State = {
  isEditingPosition: boolean;
  isEditingContent: boolean;
  targetId: number;
  section: Section;
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
          <div className={`relative w-full border-gray-200 border`}
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

            <div className="w-[100%] h-[100%]">
              {
                section.content !== undefined &&
                <div className={`w-full h-full ${section.content.className}`}>
                  <div>
                    {section.content.text.map((s) => <>{s}</>)}
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
  const classNameContent = useRef<HTMLTextAreaElement>();

  const reducer = (state: any, action: any) => {


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
      console.log(section.content);
      console.log(textContent);
      console.log(classNameContent);

      if (section !== undefined && section.content !== undefined) {
        if (textContent.current !== null && textContent.current !== undefined)
          textContent.current.value = section.content.text[0];
        if (classNameContent.current !== null && classNameContent.current !== undefined)
          classNameContent.current.value = section.content.className;
      } else {
        if (textContent.current !== null && textContent.current !== undefined)
          textContent.current.value = "";
        if (classNameContent.current !== null && classNameContent.current !== undefined)
          classNameContent.current.value = "";
      }

      return newState

    }

    return { ...state }
  }


  const [state, dispatch] = useReducer(reducer, {
    isEditingPosition: false,
    isEditingContent: false,
    targetId: -1,
    section: {
      type: "leaf",
      id: 0,
      width: 100,
      height: 100,
      parent: undefined,
    }
  })

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

    target.content = {
      lines: 1,
      text: [textContent.current.value],
      className: classNameContent.current.value,
    }

    dispatch({ type: 'set_section', section: root })
  }


  return (
    <>
      <Navbar />
      <div className="flex bg-gray-100 h-screen overflow-hidden text-black" onMouseUp={() => setMouse(undefined)}>
        <div className="flex w-full">
          <div className="flex-none w-[350px]">
            {
              state.isEditingContent &&
              <div className="bg-white w-[350px] h-full" >
                <div className="flex flex-col h-full px-3 pt-20">
                  {
                    state.targetId !== -1 &&
                    <div className="flex flex-col text-center w-full text-gray-600">
                      <textarea className="flex-auto border-black border-b-4 mb-2" ref={textContent} />
                      <textarea className="flex-auto border-black border-b-4 mb-2" ref={classNameContent} />
                      <button className="font-bold flex-auto border-b-4 pb-1 border-gray-600 duration-100
                        hover:border-yellow-400 hover:text-yellow-400"
                        onClick={handleInsertText}
                      >
                        Insert Text
                      </button>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
          <div className="flex-col flex-auto container content-center m-auto px-2">
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
