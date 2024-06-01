'use client'

import React, { useState, useRef, useEffect } from 'react';

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

const TraverseHelper: React.ElementType = (
  {
    section,
    path,
    handleSplit,
  }
    : {
      section: Section | undefined,
      path: ("left" | "right")[],
      handleSplit: (type: "vertical" | "horizontal" | "full", path: ("left" | "right")[]) => void
    }
) => {

  const [displayHorizontalSplit, setDisplayHorizontalSplit] = useState(false);
  const [displayVerticalSplit, setDisplayVerticalSplit] = useState(false);

  const Mover = () => {
    return (
      <div className="h-full w-full content-start">
        <div className={`-translate-y-[6px] w-full h-[10px]`}>
          <button className="flex mx-auto h-full bg-black w-8 justify-center" />
        </div>
      </div>
    );
  }

  const Container = ({ children, className }:
    { children?: React.ReactNode, className?: string }) => {
    return (
      <div className={`flex absolute h-full w-full ${className}`}>
        {children}
      </div>
    );
  }

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

  const Splitter = () => {
    return (
      <Container className="bg-gray-100 bg-opacity-50">

        {
          displayVerticalSplit &&
          <VerticalSplit />
        }

        {
          displayHorizontalSplit &&
          <HorizontalSplit />
        }

        <div className="relative w-full h-full m-auto content-center ">
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

      </Container>
    );
  }

  return (

    <>

      {
        section.type !== "leaf" &&
        <div className={`w-[${section.width}%] h-[${section.height}%] 
                        flex-auto flex flex-${section.type}`}>
          {
            section.left !== undefined &&
            <TraverseHelper
              section={section.left}
              path={[...path, "left"]}
              handleSplit={handleSplit} />
          }
          {
            section.right !== undefined &&
            <TraverseHelper
              section={section.right}
              path={[...path, "right"]}
              handleSplit={handleSplit} />
          }
        </div>
      }

      {
        section.type === "leaf" &&
        <>
          <div className={`relative w-[${section.width}%] h-[${section.height}%] border border-black`}>
            <Splitter />

            {
              section.parent !== undefined &&
              section === section.parent.left &&
              <Mover />
            }

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
      handleSplit: (type: "vertical" | "horizontal" | "full", path: ("left" | "right")[]) => void
    }
) => {
  return (
    <>
      <TraverseHelper section={section} path={[]} handleSplit={handleSplit} />
    </>
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
    path: ("left" | "right")[]
  ) => {

    // find the parent of the element to insert
    const newSection = structuredClone(section);
    let parent = newSection;
    for (let i = 0; i < path.length; i++)
      if (path[i] === "left")
        parent = parent.left;
      else if (path[i] === "right")
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
