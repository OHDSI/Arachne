import React, { FC, useEffect } from 'react';

import { ModalContainer } from './Modal.styles';
import { Modal as MUIModal, Fade } from '@mui/material';

export interface ModalProps {
  open: boolean;
  closeOnClickOutside?: boolean;
  collapsible?: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
}

export const Modal: FC<ModalProps> = props => {
  return <ModalContent {...props}></ModalContent>;
};

const ModalContent: FC<ModalProps> = props => {
  const width = props.open ? props.width || window.innerWidth - 250 + 'px' : 0;

  // there is the problem with theme in provider
  return (
    props.open && (
      <MUIModal
        disableAutoFocus
        disablePortal
        open={props.open}
        onClose={props.onClose}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.35)',
            },
          },
        }}
      >
        <Fade in={props.open} timeout={300}>
          <ModalContainer width={width} className="modal-window-container">
            {props.children}
          </ModalContainer>
        </Fade>
      </MUIModal>
    )
  );
};

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = React.useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
