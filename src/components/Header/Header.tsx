import React from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { 
  toggleAi, 
  selectAiEnabled, 
  selectShowApiKeyModal,
  hideApiKeyModal,
  setApiKey 
} from '../../store/slices/appStateSlice';
import AiKeyModal from './AiKeyModal';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
`;

const AppTitle = styled.h1`
  font-family: 'Orbitron', 'Arial Black', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 2px;
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
    letter-spacing: 1px;
  }
`;

const AiToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AiToggleLabel = styled.label`
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: white;
  cursor: pointer;
  user-select: none;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
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

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const aiEnabled = useAppSelector(selectAiEnabled);
  const showApiKeyModal = useAppSelector(selectShowApiKeyModal);

  const handleToggleAi = () => {
    dispatch(toggleAi());
  };

  const handleCloseModal = () => {
    dispatch(hideApiKeyModal());
  };

  const handleSubmitApiKey = (apiKey: string) => {
    dispatch(setApiKey(apiKey));
  };

  return (
    <>
      <HeaderContainer>
        <AppTitle>Comic Maker</AppTitle>
        <AiToggleContainer>
          <AiToggleLabel onClick={handleToggleAi}>
            Enable AI
          </AiToggleLabel>
          <ToggleSwitch 
            $isEnabled={aiEnabled} 
            onClick={handleToggleAi}
          />
        </AiToggleContainer>
      </HeaderContainer>
      
      <AiKeyModal
        isOpen={showApiKeyModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitApiKey}
      />
    </>
  );
};

export default Header; 