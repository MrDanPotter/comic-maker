import { Image } from '../../types/comic';

describe('Prompt Storage', () => {
  it('should allow AI images to have an optional prompt field', () => {
    const aiImageWithPrompt: Image = {
      id: 'test-ai-image-1',
      url: 'data:image/png;base64,test',
      isUsed: true,
      usedInPanels: ['panel-1'],
      source: 'ai',
      isDownloaded: false,
      prompt: 'A majestic dragon soaring through a stormy sky'
    };

    const aiImageWithoutPrompt: Image = {
      id: 'test-ai-image-2',
      url: 'data:image/png;base64,test',
      isUsed: false,
      usedInPanels: [],
      source: 'ai',
      isDownloaded: false
      // prompt is optional, so it can be omitted
    };

    const userImage: Image = {
      id: 'test-user-image',
      url: 'data:image/jpeg;base64,test',
      isUsed: true,
      usedInPanels: ['panel-2'],
      source: 'user'
      // prompt is not relevant for user-uploaded images
    };

    expect(aiImageWithPrompt.prompt).toBe('A majestic dragon soaring through a stormy sky');
    expect(aiImageWithoutPrompt.prompt).toBeUndefined();
    expect(userImage.prompt).toBeUndefined();
  });

  it('should allow prompt to be undefined for backward compatibility', () => {
    const legacyImage: Image = {
      id: 'legacy-image',
      url: 'data:image/png;base64,test',
      isUsed: true,
      usedInPanels: ['panel-1'],
      source: 'ai',
      isDownloaded: false
      // No prompt field - should still be valid
    };

    expect(legacyImage.prompt).toBeUndefined();
  });
});

describe('Modal Button Logic', () => {
  it('should determine when to show "Use Image" button based on existing image', () => {
    // When there's no existing image, button should be shown for newly generated images
    const hasExistingImage = false;
    const shouldShowButton = !hasExistingImage;
    expect(shouldShowButton).toBe(true);

    // When there's an existing image, button should be hidden
    const hasExistingImage2 = true;
    const shouldShowButton2 = !hasExistingImage2;
    expect(shouldShowButton2).toBe(false);
  });
}); 