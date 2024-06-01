'use client'

import React, { useState, useRef, useEffect } from 'react';

type PathElement = {
  type: "col" | "row";
  direction: "left" | "right";
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

const TraverseHelper: React.ElementType = (
  {
    section,
    path,
    handleSplit,
  }
    : {
      section: Section | undefined,
      path: PathElement[],
      handleSplit: (
        type: "vertical" | "horizontal" | "full",
        path: PathElement[],
      ) => void
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
          <div className={`w-[${section.width}%] h-[${section.height}%] 
                          flex-auto flex flex-${section.type}`}>
            {
              section.left !== undefined &&
              <TraverseHelper
                section={section.left}
                path={[...path, { direction: "left", type: section.type }]}
                handleSplit={handleSplit} />
            }
            {
              section.right !== undefined &&
              <TraverseHelper
                section={section.right}
                path={[...path, { direction: "right", type: section.type }]}
                handleSplit={handleSplit} />
            }
          </div>
        </>
      }

      {
        section.type === "leaf" &&
        <>

          <div className={`relative w-[${section.width}%] h-[${section.height}%] border-2 border-black`}>
            <div className="absolute h-full w-full">

              {
                !isTop(path) &&
                <button className="absolute z-50 -translate-y-[7px] w-full h-2"
                  onClick={() => {
                  }}
                />
              }

              {
                !isLeft(path) &&
                <button className="absolute z-50 -translate-x-[7px] w-2 h-full"
                  onClick={() => {
                  }}
                />
              }

              <div className="z-10 relative h-full w-full">
                <div className="flex flex-col absolute z-20 w-full h-full justify-center items-center">
                  <div className="absolute w-full h-full p-2">
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
  }
    : {
      section: Section | undefined,
      handleSplit: (
        type: "vertical" | "horizontal" | "full",
        path: PathElement[],
      ) => void
    }
) => {
  return (
    <TraverseHelper section={section} path={[]} handleSplit={handleSplit} />
  )
}

const ContentManagementSystem = () => {

  const nextId = useRef(0);

  const [section, setSection] = useState<Section>({
    type: "leaf",
    id: nextId.current++,
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

    setSection(newSection);
  }

  return (
    <>
      <div className="bg-gray-100 h-screen">
        <div className="container m-auto h-screen content-center">
          <div className="flex bg-gray-200 aspect-video">
            <Traverse section={section} handleSplit={handleSplit} />
          </div>
        </div>
      </div>
    </>
  );
}

export default ContentManagementSystem;
