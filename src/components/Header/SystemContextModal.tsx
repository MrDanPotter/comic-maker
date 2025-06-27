import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { HelpCircle } from 'react-feather';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { 
  addReferenceImage, 
  removeReferenceImage, 
  selectReferenceImages,
  updateReferenceImageName,
  ReferenceImage 
} from '../../store/slices/appStateSlice';
import Modal from '../Modal';
import Image from '../Image';
import ImageLibrarySelectorModal from './ImageLibrarySelectorModal';

interface SystemContextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (context: string, useOpenAI: boolean) => void;
  currentContext: string;
  currentUseOpenAI: boolean;
}

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: #555;
  margin-bottom: 8px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  resize: vertical;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const ButtonContainer = styled.div`
  margin-top: 24px;
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const Button = styled.button<{ $isPrimary?: boolean }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.$isPrimary ? `
    background: #667eea;
    color: white;
    
    &:hover {
      background: #5a6fd8;
      transform: translateY(-1px);
    }
  ` : `
    background: #f8f9fa;
    color: #666;
    border: 1px solid #e0e0e0;
    
    &:hover {
      background: #e9ecef;
    }
  `}
  
  &:active {
    transform: translateY(0);
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 24px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #667eea;
  margin-top: 2px;
`;

const CheckboxLabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CheckboxLabel = styled.label`
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  color: #555;
  cursor: pointer;
  font-weight: 500;
`;

const CheckboxSubLabel = styled.span`
  font-family: 'Roboto', sans-serif;
  font-size: 0.8rem;
  color: #888;
  line-height: 1.4;
`;

const SectionTitle = styled.h3`
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 32px 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e0e0e0;
`;

const ReferenceButtonsContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const ReferenceButton = styled.button`
  padding: 10px 16px;
  border: 2px solid #667eea;
  border-radius: 6px;
  background: white;
  color: #667eea;
  font-family: 'Roboto', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #667eea;
    color: white;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ReferenceImagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ReferenceImageItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f8f9fa;
`;

const ReferenceImageThumbnail = styled.div`
  width: 60px;
  height: 60px;
  flex-shrink: 0;
`;

const ReferenceImageInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ReferenceImageName = styled.span`
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
`;

const ReferenceImageType = styled.span`
  font-family: 'Roboto', sans-serif;
  font-size: 0.8rem;
  color: #667eea;
  font-weight: 500;
  text-transform: capitalize;
`;

const RemoveButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #dc3545;
  border-radius: 4px;
  background: white;
  color: #dc3545;
  font-family: 'Roboto', sans-serif;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #dc3545;
    color: white;
  }
`;

const NameInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
`;

const NameInputLabel = styled.label`
  font-family: 'Roboto', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  color: #555;
`;

const NameInput = styled.input`
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.8rem;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const SourcePickerContainer = styled.div`
  margin-bottom: 24px;
`;

const SourcePickerLabel = styled.label`
  display: block;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: #555;
  margin-bottom: 12px;
`;

const SourcePickerGroup = styled.div`
  display: flex;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f9fa;
`;

const SourceOption = styled.div<{ $isSelected: boolean }>`
  flex: 1;
  padding: 12px 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border-right: 1px solid #e0e0e0;
  background: ${props => props.$isSelected ? '#667eea' : 'transparent'};
  color: ${props => props.$isSelected ? 'white' : '#555'};
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  
  &:last-child {
    border-right: none;
  }
  
  &:hover {
    background: ${props => props.$isSelected ? '#5a6fd8' : '#e9ecef'};
  }
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
`;

const HelpIcon = styled.div`
  position: relative;
  cursor: pointer;
  color: #667eea;
  transition: color 0.2s ease;
  
  &:hover {
    color: #5a6fd8;
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const Tooltip = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 12px 16px;
  border-radius: 6px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.85rem;
  line-height: 1.4;
  white-space: nowrap;
  z-index: 1000;
  opacity: ${props => props.$isVisible ? 1 : 0};
  visibility: ${props => props.$isVisible ? 'visible' : 'hidden'};
  transition: opacity 0.2s ease, visibility 0.2s ease;
  margin-top: 8px;
  width: 300px;
  white-space: normal;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-bottom-color: #333;
  }
`;

const SystemContextModal: React.FC<SystemContextModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentContext,
  currentUseOpenAI
}) => {
  const dispatch = useAppDispatch();
  const referenceImages = useAppSelector(selectReferenceImages);
  const [context, setContext] = useState(currentContext);
  const [useFakeGeneration, setUseFakeGeneration] = useState(!currentUseOpenAI);
  const [useImageLibrary, setUseImageLibrary] = useState(false);
  const [showImageLibrarySelector, setShowImageLibrarySelector] = useState(false);
  const [pendingImageType, setPendingImageType] = useState<'style' | 'character' | 'scene' | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setContext(currentContext);
    setUseFakeGeneration(!currentUseOpenAI);
  }, [currentContext, currentUseOpenAI]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // When fake generation is checked, we set useOpenAI to false
    onSubmit(context, !useFakeGeneration);
    onClose();
  };

  const handleClose = () => {
    setContext(currentContext); // Reset to original value
    setUseFakeGeneration(!currentUseOpenAI); // Reset to original value
    setUseImageLibrary(false); // Reset source selection
    setShowImageLibrarySelector(false);
    setPendingImageType(null);
    setShowTooltip(false); // Reset tooltip
    onClose();
  };

  const handleTooltipShow = () => {
    setShowTooltip(true);
  };

  const handleTooltipHide = () => {
    setShowTooltip(false);
  };

  const handleReferenceButtonClick = (type: 'style' | 'character' | 'scene') => {
    if (useImageLibrary) {
      // Open image library selector
      setPendingImageType(type);
      setShowImageLibrarySelector(true);
    } else {
      // Use filesystem (current functionality)
      if (fileInputRef.current) {
        fileInputRef.current.setAttribute('data-type', type);
        fileInputRef.current.click();
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const type = event.target.getAttribute('data-type') as 'style' | 'character' | 'scene';
    
    if (file && type) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        const referenceImage: ReferenceImage = {
          id: uuidv4(),
          url,
          type,
          name: file.name
        };
        dispatch(addReferenceImage(referenceImage));
      };
      reader.readAsDataURL(file);
    }
    
    // Reset the input
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleRemoveReferenceImage = (id: string) => {
    dispatch(removeReferenceImage(id));
  };

  const handleUpdateReferenceImageName = (id: string, customName: string) => {
    dispatch(updateReferenceImageName({ id, customName }));
  };

  const handleImageLibraryImageSelected = (referenceImage: ReferenceImage) => {
    dispatch(addReferenceImage(referenceImage));
    setShowImageLibrarySelector(false);
    setPendingImageType(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={
      <TitleContainer>
        Edit System Context
        <HelpIcon
          onMouseEnter={handleTooltipShow}
          onMouseLeave={handleTooltipHide}
          onFocus={handleTooltipShow}
          onBlur={handleTooltipHide}
          tabIndex={0}
          role="button"
          aria-label="Help information"
        >
          <HelpCircle />
          <Tooltip $isVisible={showTooltip}>
            Set the overall tone and art style that will be used to generate all AI images.
            This context will be included in every image generation prompt.
            You can also add reference images to help the AI generate images that are more consistent with your style.
          </Tooltip>
        </HelpIcon>
      </TitleContainer>
    } maxWidth="700px">
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="system-context">Text Instructions</Label>
          <TextArea
            id="system-context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g., Create images in a comic book style with bold colors, dynamic poses, and dramatic lighting. Use a modern superhero aesthetic with clean lines and vibrant backgrounds."
          />
        </FormGroup>
        
        <SectionTitle>Add reference images</SectionTitle>
        
        <SourcePickerContainer>
          <SourcePickerLabel>Image Source</SourcePickerLabel>
          <SourcePickerGroup>
            <SourceOption 
              $isSelected={!useImageLibrary}
              onClick={() => setUseImageLibrary(false)}
            >
              Use Filesystem
            </SourceOption>
            <SourceOption 
              $isSelected={useImageLibrary}
              onClick={() => setUseImageLibrary(true)}
            >
              Use Image Library
            </SourceOption>
          </SourcePickerGroup>
        </SourcePickerContainer>
        
        <ReferenceButtonsContainer>
          <ReferenceButton type="button" onClick={() => handleReferenceButtonClick('style')}>
            Style
          </ReferenceButton>
          <ReferenceButton type="button" onClick={() => handleReferenceButtonClick('character')}>
            Character
          </ReferenceButton>
          <ReferenceButton type="button" onClick={() => handleReferenceButtonClick('scene')}>
            Scene
          </ReferenceButton>
        </ReferenceButtonsContainer>

        {referenceImages.length > 0 && (
          <ReferenceImagesContainer>
            {referenceImages.map((image) => (
              <ReferenceImageItem key={image.id}>
                <ReferenceImageThumbnail>
                  <Image
                    src={image.url}
                    alt={image.name}
                    width="60px"
                    height="60px"
                    borderRadius="4px"
                    expandable={true}
                    title="Click to view full resolution"
                  />
                </ReferenceImageThumbnail>
                <ReferenceImageInfo>
                  <ReferenceImageName>{image.name}</ReferenceImageName>
                  <ReferenceImageType>{image.type}</ReferenceImageType>
                  {(image.type === 'character' || image.type === 'scene') && (
                    <NameInputContainer>
                      <NameInputLabel htmlFor={`name-${image.id}`}>
                        Name
                      </NameInputLabel>
                      <NameInput
                        id={`name-${image.id}`}
                        type="text"
                        placeholder={`Name your ${image.type} and reference them in your image prompts`}
                        value={image.customName || ''}
                        onChange={(e) => handleUpdateReferenceImageName(image.id, e.target.value)}
                      />
                    </NameInputContainer>
                  )}
                </ReferenceImageInfo>
                <RemoveButton onClick={() => handleRemoveReferenceImage(image.id)}>
                  Remove
                </RemoveButton>
              </ReferenceImageItem>
            ))}
          </ReferenceImagesContainer>
        )}
        
        <ButtonContainer>
          <Button type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" $isPrimary>
            Save Context
          </Button>
        </ButtonContainer>
      </form>

      <HiddenFileInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
      />
      
      <ImageLibrarySelectorModal
        isOpen={showImageLibrarySelector}
        onClose={() => {
          setShowImageLibrarySelector(false);
          setPendingImageType(null);
        }}
        onImageSelected={handleImageLibraryImageSelected}
        imageType={pendingImageType || 'style'}
      />
    </Modal>
  );
};

export default SystemContextModal; 