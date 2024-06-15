import React, { useState, useRef, useEffect, useReducer } from 'react';

import {MenuOption, MenuOptions} from '../types';

const CMSMenuItem = ({ option, className }: { option: MenuOption, className?: string }) => {

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
  }, [inputRef, option.content, option.type]);

  useEffect(() => {
    option.selected = selectedOption;
  }, [selectedOption, option])

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

export default CMSMenuItem;
