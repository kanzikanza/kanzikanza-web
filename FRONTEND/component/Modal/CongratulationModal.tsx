import React from "react";
import { styled, Paper, Modal, Typography, IconButton, CircularProgress } from "@mui/material";
import { Close } from "@mui/icons-material"

const StyledModal = styled(Modal)`
  /* outline: none; */
`;

const ModalContainer = styled('div')`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  min-height: 400px;
  text-align: center;
  background-color: none;
  box-shadow: none;
  outline: none;
`;

const BackgroundImage = styled("div")`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('../assets/sticky-note.png');
  background-size: cover;
  background-repeat: no-repeat;
  z-index: -1; /* 배경 이미지를 뒷면에 위치시키기 */
`;

const CloseButton = styled(IconButton)`
  display: flex;
  align-items: flex-end;
  margin-top: 15px;
  margin-right: 15px;
  margin-left: auto;
`

const Content = styled(Typography)`
  z-index: 1001;
  padding: 20px 50px 60px 50px;
`

const CongratulationModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {

  return (
    <StyledModal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      // BackdropComponent={() => null}
    >
      <ModalContainer>
        <BackgroundImage />
        <CloseButton onClick={onClose}>
          <Close />
        </CloseButton>
        <Content variant="h6" component="h2">
          <p>점수를 계산 중입니다... </p>
          <p>잠시만 기다려 주세요 👩‍🦰</p>
        </Content>
        <CircularProgress style={{ color: "orange" }} />
        {/* <Button onClick={onClose}>Close</Button> */}
      </ModalContainer>
    </StyledModal>
  );
};

export default CongratulationModal;
