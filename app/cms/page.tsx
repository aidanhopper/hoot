'use client'

import React, { useState, useRef, useEffect } from 'react';

type PathElement = {
  type: "col" | "row";
  direction: "left" | "right";
}

type Mouse = {
  movement: "horizontal" | "vertical",
  target: number,
}

type Content = {
  text: string;
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

const del = (section: Section) => {

}

const TraverseHelper: React.ElementType = (
  {
    section,
    path,
    handleSplit,
    setMouse,
    mouse,
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

      <div className={`${className}`}>
        <div className={`relative w-[50px] `}>
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
                section={section.left}
                mouse={mouse}
                setMouse={setMouse}
                path={[...path, { direction: "left", type: section.type }]}
                handleSplit={handleSplit} />
            }
            {
              section.right !== undefined &&
              <TraverseHelper
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

          <div className={`relative border-2 w-full border-black`}
            style={{ width: `${section.width}%`, height: `${section.height}%` }}
          >
            <div className="absolute h-full w-full">

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
                  <Splitter className="flex-auto content-center" />
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

            <div className="text-center w-[100%] h-[100%] content-center">
              {
                section.content !== undefined &&
                section.content.text
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
  }
    : {
      section: Section | undefined,
      handleSplit: (
        type: "vertical" | "horizontal" | "full",
        path: PathElement[],
      ) => void,
      setMouse: (val: Mouse) => void,
      mouse: Mouse | undefined,
    }
) => {
  return (
    <TraverseHelper
      section={section}
      mouse={mouse}
      setMouse={setMouse}
      path={[]}
      handleSplit={handleSplit} />
  )
}

const ContentManagementSystem = () => {

  const nextId = useRef(1);

  const [mouse, setMouse] = useState<Mouse | undefined>(undefined);

  const [section, setSection] = useState<Section>({
    type: "leaf",
    id: 0,
    width: 100,
    height: 100,
    parent: undefined,
  });

  const handleSplit = (
    type: "vertical" | "horizontal" | "full",
    path: PathElement[],
  ) => {

    // find the parent of the element to insert
    const newSection = structuredClone(section);
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

    if (type === "vertical")
      parent.type = "row";

    else if (type === "horizontal")
      parent.type = "col";

    leftLeaf.parent = parent;
    rightLeaf.parent = parent;

    setSection(newSection);
  }

  const handleMouse = (event: React.MouseEvent, mouse: Mouse) => {

    if (mouse === undefined)
      return;

    if (mouse.movement === "vertical") {

      const target = getId(section, mouse.target);
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

    }

    else if (mouse.movement === "horizontal") {

      const target = getId(section, mouse.target);
      const sibling = target.parent.left.id === target.id ?
        target.parent.right : target.parent.left;

      const movement = event.movementX / event.pageX * 100;

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

    }

    console.log(mouse.target);

    setSection(structuredClone(section));
  }

  return (
    <>
      <div className="bg-gray-100 h-screen" onMouseUp={() => setMouse(undefined)}>
        <div className="container m-auto h-screen content-center">
          <div className="flex bg-gray-200 aspect-video select-none"
            onMouseMove={(event: React.MouseEvent) => handleMouse(event, mouse)}
          >
            <Traverse
              section={section}
              mouse={mouse}
              setMouse={setMouse}
              handleSplit={handleSplit}
              setSection={setSection} />
          </div>
        </div>
      </div>
    </>
  );
}

export default ContentManagementSystem;
