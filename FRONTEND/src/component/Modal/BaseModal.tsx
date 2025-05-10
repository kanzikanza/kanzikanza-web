'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import zIndex from '@mui/material/styles/zIndex';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 320,
  bgcolor: '#FFF5EB',
  borderRadius: '12px',
  boxShadow: '0px 4px 20px rgba(255, 204, 153, 0.2)',
  p: 3,
  border: '1px solid #FFCC99',
};

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
        // console.log("확인차 입니다 알려주세요 ", isAnswered, state.current)
     },
        [isAnswered])
    
    return (
        <div
            style={{ zIndex: 15 }}
            id='BaseModal'
        >
            {            
            <Modal
            open={!isAnswered}
            // onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
                {/* <Typography id="modal-modal-title" variant="h6" component="h2">
                
                </Typography> */}
                <Typography id="modal-modal-description" sx={{ 
                  mt: 2,
                  fontSize: '1rem',
                  color: '#333333',
                  textAlign: 'center'
                }}>
                아직 진행중인 시험이 있습니다. 이어서 진행하시겠습니까?
                </Typography>
                <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '12px',
                    marginTop: '24px'
                }}
                >
                <Button 
                  variant="contained" 
                  onClick={() => {
                    setAnswerState(true)
                    setIsAnswered(true)
                  }}
                  sx={{
                    backgroundColor: '#FFCC99',
                    '&:hover': {
                      backgroundColor: '#FFB366',
                    },
                    minWidth: '100px',
                    color: '#333333',
                    fontWeight: 'bold'
                  }}
                >
                  예
                </Button>
                <Button 
                  variant="outlined"
                  onClick={() => {
                    setAnswerState(false)
                    setIsAnswered(true)
                  }}
                  sx={{
                    borderColor: '#FFCC99',
                    color: '#FFCC99',
                    '&:hover': {
                      borderColor: '#FFB366',
                      backgroundColor: 'rgba(255, 204, 153, 0.1)',
                    },
                    minWidth: '100px',
                    fontWeight: 'bold'
                  }}
                >
                  아니오
                </Button>
                </div>
                </Box>
            </Modal>}
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

  return (
    <React.Fragment>
      <Button onClick={handleOpen}>Open Child Modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 200 }}>
          <h2 id="child-modal-title">Text in a child modal</h2>
          <p id="child-modal-description">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
          <Button onClick={handleClose}>Close Child Modal</Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
}


function BaseNotiModal({title, subtitle, open, setOpen} : {title : string, subtitle : string, open: boolean,setOpen : React.Dispatch<React.SetStateAction<boolean>>} ) {
//   const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

   return (<Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        >
        <Box sx={{ ...style, width: 400 }}>
            <h2 id="parent-modal-title">{title}</h2>
            <p id="parent-modal-description">
            {subtitle}
            </p>
            {/* <ChildModal /> */}
        </Box>
    </Modal>
    )    
}

export {BaseModal, BaseNotiModal}