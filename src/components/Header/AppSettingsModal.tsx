import React from 'react';
import styled from 'styled-components';
import Modal from '../shared/Modal';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { selectUseOpenAIImageGeneration, setUseOpenAIImageGeneration } from '../../store/slices/appStateSlice';
import { Settings } from 'react-feather';

interface AppSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalTitle = styled.h2`
  font-family: 'Orbitron', 'Arial Black', sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const ToggleLabel = styled.label`
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  color: #333;
  font-weight: 500;
  cursor: pointer;
`;

const ToggleSwitch = styled.div<{ $isEnabled: boolean }>`
  position: relative;
  width: 50px;
  height: 24px;
  background: ${props => props.$isEnabled ? '#4CAF50' : '#ccc'};
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.3s ease;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background: ${props => props.$isEnabled ? '#45a049' : '#bbb'};
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.$isEnabled ? '26px' : '2px'};
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: left 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const SubLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-top: -8px;
  margin-bottom: 16px;
`;

const AppSettingsModal: React.FC<AppSettingsModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const useOpenAIImageGeneration = useAppSelector(selectUseOpenAIImageGeneration);

  const handleToggle = () => {
    dispatch(setUseOpenAIImageGeneration(!useOpenAIImageGeneration));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={<ModalTitle><Settings size={20}/> App Settings</ModalTitle>} maxWidth="400px">
      <ToggleRow>
        <ToggleLabel htmlFor="fake-generation-toggle">
          Use fake image generation
        </ToggleLabel>
        <ToggleSwitch
          $isEnabled={!useOpenAIImageGeneration}
          onClick={handleToggle}
          id="fake-generation-toggle"
          tabIndex={0}
          role="switch"
          aria-checked={!useOpenAIImageGeneration}
        />
      </ToggleRow>
      <SubLabel>
        This option will let you test image creation flows by utilizing random images. No images will be generated and your key will not be used for image generation.
      </SubLabel>
    </Modal>
  );
};

export default AppSettingsModal; 