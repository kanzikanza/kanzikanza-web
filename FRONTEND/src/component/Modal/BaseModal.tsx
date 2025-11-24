'use client'
import * as React from 'react';

type AnswerState = {
    isAnswered: boolean | null,
    setIsAnswered : React.Dispatch<React.SetStateAction<boolean>>,
    answerState : boolean,
    setAnswerState: React.Dispatch<React.SetStateAction<boolean>>
}

function BaseModal(
    {
        isAnswered,
        setIsAnswered,
        answerState,
        setAnswerState
    }: AnswerState 
) {
    const state = React.useRef<boolean | null>(null)
    console.log('')
    React.useEffect(() => {
        state.current = isAnswered
     },
        [isAnswered])
    
    if (isAnswered) return null;
    
    return (
        <div
            className="fixed inset-0 z-[15] flex items-center justify-center bg-black bg-opacity-50"
            id='BaseModal'
        >
            <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-[#FFF5EB] rounded-xl shadow-[0px_4px_20px_rgba(255,204,153,0.2)] p-6 border border-[#FFCC99]"
                role="dialog"
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <p 
                    id="modal-modal-description" 
                    className="mt-2 text-base text-[#333333] text-center"
                >
                    아직 진행중인 시험이 있습니다. 이어서 진행하시겠습니까?
                </p>
                <div className="flex justify-center gap-3 mt-6">
                    <button 
                        onClick={() => {
                            setAnswerState(true)
                            setIsAnswered(true)
                        }}
                        className="bg-[#FFCC99] hover:bg-[#FFB366] min-w-[100px] text-[#333333] font-bold px-4 py-2 rounded transition-colors"
                    >
                        예
                    </button>
                    <button 
                        onClick={() => {
                            setAnswerState(false)
                            setIsAnswered(true)
                        }}
                        className="border border-[#FFCC99] text-[#FFCC99] hover:border-[#FFB366] hover:bg-[rgba(255,204,153,0.1)] min-w-[100px] font-bold px-4 py-2 rounded transition-colors"
                    >
                        아니오
                    </button>
                </div>
            </div>
        </div>
    )
}

function ChildModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  if (!open) return null;

  return (
    <React.Fragment>
      <button onClick={handleOpen} className="px-4 py-2 bg-blue-500 text-white rounded">
        Open Child Modal
      </button>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={handleClose}
      >
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 bg-[#FFF5EB] rounded-xl shadow-[0px_4px_20px_rgba(255,204,153,0.2)] p-6 border border-[#FFCC99]"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 id="child-modal-title" className="text-lg font-semibold">Text in a child modal</h2>
          <p id="child-modal-description" className="mt-2">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
          <button 
            onClick={handleClose}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close Child Modal
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}


function BaseNotiModal({title, subtitle, open, setOpen} : {title : string, subtitle : string, open: boolean,setOpen : React.Dispatch<React.SetStateAction<boolean>>} ) {
  const handleClose = () => {
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleClose}
      role="dialog"
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 bg-[#FFF5EB] rounded-xl shadow-[0px_4px_20px_rgba(255,204,153,0.2)] p-6 border border-[#FFCC99]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="parent-modal-title" className="text-xl font-semibold">{title}</h2>
        <p id="parent-modal-description" className="mt-2">
          {subtitle}
        </p>
      </div>
    </div>
  )    
}

export {BaseModal, BaseNotiModal}