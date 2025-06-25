import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from '../Modal';

interface AiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (apiKey: string) => void;
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

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
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

const GuaranteeSection = styled.div`
  margin: 0;
  padding: 0;
  background: transparent;
  border-radius: 0;
  border-left: none;
`;

const GuaranteeTitle = styled.h3`
  font-family: 'Roboto', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const GuaranteeList = styled.ul`
  margin: 0;
  padding-left: 20px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #555;
`;

const GuaranteeItem = styled.li`
  margin-bottom: 8px;
`;

const AccordionContainer = styled.div`
  margin: 24px 0;
`;

const AccordionItem = styled.div<{ $isOpen: boolean }>`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 8px;
  overflow: hidden;
`;

const AccordionHeader = styled.button<{ $isOpen: boolean }>`
  width: 100%;
  padding: 16px 20px;
  background: ${props => props.$isOpen ? '#667eea' : '#f8f9fa'};
  color: ${props => props.$isOpen ? 'white' : '#333'};
  border: none;
  text-align: left;
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:hover {
    background: ${props => props.$isOpen ? '#5a6fd8' : '#e9ecef'};
  }
`;

const AccordionContent = styled.div<{ $isOpen: boolean }>`
  max-height: ${props => props.$isOpen ? '1000px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
  background: white;
`;

const AccordionInner = styled.div`
  padding: 20px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #555;
`;

const RiskList = styled.ul`
  margin: 0;
  padding-left: 20px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #555;
`;

const RiskItem = styled.li`
  margin-bottom: 8px;
`;

const MitigationList = styled.ul`
  margin: 0;
  padding-left: 20px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #555;
`;

const MitigationItem = styled.li`
  margin-bottom: 8px;
`;

const FAQList = styled.ul`
  margin: 0;
  padding-left: 20px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #555;
`;

const FAQItem = styled.li`
  margin-bottom: 16px;
`;

const FAQQuestion = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const FAQAnswer = styled.div`
  color: #666;
`;

const ChevronIcon = styled.span<{ $isOpen: boolean }>`
  transition: transform 0.2s ease;
  transform: rotate(${props => props.$isOpen ? '180deg' : '0deg'});
  font-size: 0.8rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
`;

const Button = styled.button<{ $isPrimary?: boolean; $isDisabled?: boolean }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: ${props => props.$isDisabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  
  ${props => props.$isPrimary ? `
    background: ${props.$isDisabled ? '#ccc' : '#667eea'};
    color: white;
    
    &:hover:not(:disabled) {
      background: #5a6fd8;
      transform: translateY(-1px);
    }
  ` : `
    background: #f8f9fa;
    color: #666;
    border: 1px solid #e0e0e0;
    
    &:hover:not(:disabled) {
      background: #e9ecef;
    }
  `}
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const AiKeyModal: React.FC<AiKeyModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [apiKey, setApiKey] = useState('');
  const [openAccordion, setOpenAccordion] = useState<string>('guarantee');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSubmit(apiKey.trim());
    }
  };

  const handleClose = () => {
    setApiKey('');
    setOpenAccordion('guarantee');
    onClose();
  };

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? 'guarantee' : section);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Bring Your Own Key" maxWidth="700px" minWidth="400px">
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="openai-key">OpenAI API Key</Label>
          <Input
            id="openai-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            autoComplete="off"
          />
        </FormGroup>
        
        <AccordionContainer>
          <AccordionItem $isOpen={openAccordion === 'guarantee'}>
            <AccordionHeader 
              $isOpen={openAccordion === 'guarantee'}
              onClick={() => toggleAccordion('guarantee')}
              type="button"
            >
              ✅ Our Guarantee
              <ChevronIcon $isOpen={openAccordion === 'guarantee'}>▼</ChevronIcon>
            </AccordionHeader>
            <AccordionContent $isOpen={openAccordion === 'guarantee'}>
              <AccordionInner>
                <GuaranteeSection>
                  <GuaranteeTitle>
                    <span>✅</span>
                    Our Guarantee
                  </GuaranteeTitle>
                  <GuaranteeList>
                    <GuaranteeItem><strong>Your key never touches our server.</strong> All requests are made directly from your browser to https://api.openai.com.</GuaranteeItem>
                    <GuaranteeItem><strong>We don't store or log the key—anywhere.</strong> The key lives only in browser memory (React state). We do not write it to localStorage, cookies, analytics, or error logs. Closing or refreshing the tab wipes it.</GuaranteeItem>
                  </GuaranteeList>
                </GuaranteeSection>
              </AccordionInner>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem $isOpen={openAccordion === 'risks'}>
            <AccordionHeader 
              $isOpen={openAccordion === 'risks'}
              onClick={() => toggleAccordion('risks')}
              type="button"
            >
              ⚠️ Risks You Accept
              <ChevronIcon $isOpen={openAccordion === 'risks'}>▼</ChevronIcon>
            </AccordionHeader>
            <AccordionContent $isOpen={openAccordion === 'risks'}>
              <AccordionInner>
                <RiskList>
                  <RiskItem><strong>Pasting keys into random websites is discouraged.</strong> You have to take us at our word that we are not storing or misusing your key.</RiskItem>
                  <RiskItem><strong>Billing exposure.</strong> Every prompt counts against your OpenAI quota. We will provide estimates for the cost of the prompt.</RiskItem>
                </RiskList>
              </AccordionInner>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem $isOpen={openAccordion === 'mitigation'}>
            <AccordionHeader 
              $isOpen={openAccordion === 'mitigation'}
              onClick={() => toggleAccordion('mitigation')}
              type="button"
            >
              🛡️ How You Can Mitigate Those Risks
              <ChevronIcon $isOpen={openAccordion === 'mitigation'}>▼</ChevronIcon>
            </AccordionHeader>
            <AccordionContent $isOpen={openAccordion === 'mitigation'}>
              <AccordionInner>
                <MitigationList>
                  <MitigationItem><strong>Set a hard spending cap.</strong> Billing → Usage limits — choose a small monthly cap. OpenAI will auto-disable the key beyond that.</MitigationItem>
                  <MitigationItem><strong>Rotate or revoke often.</strong> Delete and recreate the key as you like.</MitigationItem>
                  <MitigationItem><strong>Never paste the key on shared machines.</strong> If you must, clear the clipboard afterward on shared machines.</MitigationItem>
                </MitigationList>
              </AccordionInner>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem $isOpen={openAccordion === 'faq'}>
            <AccordionHeader 
              $isOpen={openAccordion === 'faq'}
              onClick={() => toggleAccordion('faq')}
              type="button"
            >
              ❓ FAQ (Quick Answers)
              <ChevronIcon $isOpen={openAccordion === 'faq'}>▼</ChevronIcon>
            </AccordionHeader>
            <AccordionContent $isOpen={openAccordion === 'faq'}>
              <AccordionInner>
                <FAQList>
                  <FAQItem>
                    <FAQQuestion>Where is my key stored?</FAQQuestion>
                    <FAQAnswer>In volatile memory only. Refreshing the page removes it.</FAQAnswer>
                  </FAQItem>
                  <FAQItem>
                    <FAQQuestion>Do you proxy or inspect prompts?</FAQQuestion>
                    <FAQAnswer>No. Requests go straight to OpenAI; we never see the content.</FAQAnswer>
                  </FAQItem>
                  <FAQItem>
                    <FAQQuestion>Can I keep the key between visits?</FAQQuestion>
                    <FAQAnswer>Not at this time.</FAQAnswer>
                  </FAQItem>
                  <FAQItem>
                    <FAQQuestion>How do I revoke access?</FAQQuestion>
                    <FAQAnswer>Delete the key in your OpenAI dashboard.</FAQAnswer>
                  </FAQItem>
                </FAQList>
              </AccordionInner>
            </AccordionContent>
          </AccordionItem>
        </AccordionContainer>

        <ButtonContainer>
          <Button type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            $isPrimary 
            $isDisabled={!apiKey.trim()}
            disabled={!apiKey.trim()}
          >
            Submit
          </Button>
        </ButtonContainer>
      </form>
    </Modal>
  );
};

export default AiKeyModal; 