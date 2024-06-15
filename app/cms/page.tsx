'use client'

import React, { useRef, useEffect, useReducer } from 'react';
import Navbar from '../components/navbar';
import LZString from 'lz-string';
import Slide, { getId } from '../components/Slide';
import { Action, State, MenuOption } from '../types';

import CMSMenuItem from '../components/CMSMenuItem';

const EditContent = ({ state, handler, textContent }: { state: State, handler: () => void, textContent: any }) => {
  return (
    <div className="bg-white w-[350px] h-full duration-100" >
      <div className="flex flex-col h-full px-3 pt-20 shadow-[5px_5px_2px_rgb(0,0,0,0.25)]">
        {
          state.targetId !== -1 &&
          <div className="flex flex-col text-center w-full text-gray-600 overflow-y-scroll">
            <textarea className="flex-auto border-black border-b-4 mb-2" ref={textContent} />
            <div className="flex flex-wrap flex-auto w-full content-center justify-center">
              <CMSMenuItem option={state.options.fontSize} className="" />
              <CMSMenuItem option={state.options.fontWeight} className="" />
              <CMSMenuItem option={state.options.verticalAlign} className="" />
              <CMSMenuItem option={state.options.horizontalAlign} className="" />
              <CMSMenuItem option={state.options.textAlign} className="" />
              <CMSMenuItem option={state.options.margin} className="" />
              <CMSMenuItem option={state.options.backgroundColor} className="" />
            </div>
            <div className="flex-auto pt-4">
              <button className="font-bold flex-auto border-b-4 pb-1 border-gray-600 duration-100
                          hover:border-yellow-400 hover:text-yellow-400"
                onClick={handler}
              >
                Insert
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  );
}

const ContentManagementSystem = () => {

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
      const newState: State = { ...state }
      newState.section[state.currentSlide] = action.section;
      return newState
    }

    if (action.type === 'set_target_id') {
      const newState: State = {
        ...state,
        targetId: action.id
      }

      const section = getId(newState.section[state.currentSlide], action.id);

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

    if (action.type === 'set_mouse') {
      const newState: State = {
        ...state,
        mouse: action.mouse,
      }
      return newState;
    }

    if (action.type === 'set_current_slide') {
      const newState: State = {
        ...state,
        currentSlide: action.currentSlide,
      }
      return newState;
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
    section: [{
      type: 'leaf',
      id: 0,
      width: 100,
      height: 100,
      parent: undefined,
    }],
    currentSlide: 0,
  });

  useEffect(() => {
    const target = getId(state.section[state.currentSlide], state.targetId);
    if (
      textContent.current !== undefined &&
      textContent.current !== null &&
      target !== undefined &&
      target.content !== undefined
    )
      textContent.current.value = target.content.text[0];
  }, [state.targetId, state.section, state.currentSlide]);



  const handleInsert = () => {
    const root = structuredClone(state.section);
    const target = getId(root[state.currentSlide], state.targetId);

    const assignDropdownOption = (option: MenuOption) => {
      return `${option.selected !== -1 ?
        option.options[option.selected] : ''}` as any;
    }

    target.content = {
      type: 'text',
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

    dispatch({ type: 'set_section', section: root[state.currentSlide] })
  }

  return (
    <>
      <Navbar />
      <div className="flex bg-gray-100 h-screen text-black overflow-hidden"
        onMouseUp={() => {
          if (state.mouse !== undefined)
            dispatch({ type: 'set_mouse', mouse: undefined })
        }}>
        <div className="flex w-full">
          <div className="flex-none w-[350px]">
            {
              state.isEditingContent &&
              <EditContent
                state={state}
                handler={handleInsert}
                textContent={textContent}
              />
            }
          </div>
          <div className="flex-col flex-none w-[60%] container content-center m-auto px-2">

            <Slide
              state={state}
              dispatch={dispatch}
            />

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
            <button className="shadow-[5px_5px_2px_rgb(0,0,0,0.25)] duration-100
              hover:scale-[101%] mt-5 lg:mb-0 p-5 rounded-xl bg-white text-lg
              border-gray-200 border-2 text-gray-600 ml-5"
              style={{ background: state.isEditingContent ? "#f3f4f6" : "white" }}
              onClick={() => {
                dispatch({ type: 'toggle_edit_content' })
              }}
            >
              Edit Canvas
            </button>
          </div>
          <div className="flex-none w-[350px]" />
        </div>
      </div>
    </>
  );
}

export default ContentManagementSystem;
