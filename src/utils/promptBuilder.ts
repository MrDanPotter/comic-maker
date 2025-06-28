import { ReferenceImage } from '../services/imageGeneratorService';

/**
 * Helper: Convert data URL to base64 string
 */
const dataUrlToBase64 = (dataUrl: string): string => {
  // Remove the data:image/...;base64, prefix
  const base64 = dataUrl.split(',')[1];
  return base64;
};

/**
 * Helper: Convert image URL to base64 for OpenAI API
 */
const imageUrlToBase64 = async (imageUrl: string): Promise<string> => {
  try {
    // If it's already a data URL, extract the base64
    if (imageUrl.startsWith('data:')) {
      return dataUrlToBase64(imageUrl);
    }
    
    // If it's a regular URL, fetch and convert
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(dataUrlToBase64(result));
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw new Error('Failed to convert image to base64');
  }
};

/**
 * Build a complete content array for image generation based on all inputs
 */
export async function buildImagePromptContent({
  userPrompt,
  systemContext,
  referenceImages
}: {
  userPrompt: string;
  systemContext?: string;
  referenceImages?: ReferenceImage[];
}): Promise<any[]> {
  const content: any[] = [];

  // Build the main prompt text
  const promptText = buildPromptText(userPrompt, systemContext, referenceImages);
  content.push({ type: 'input_text', text: promptText });

  // Add reference images if provided
  if (referenceImages && referenceImages.length > 0) {
    await addReferenceImagesToContent(content, referenceImages);
  }

  return content;
}

/**
 * Build the main prompt text combining user prompt and system context
 */
export function buildPromptText(
  userPrompt: string,
  systemContext?: string,
  referenceImages?: ReferenceImage[]
): string {
  const parts: string[] = [];

  // Add system context if present, otherwise use default instructions
  if (systemContext?.trim()) {
    parts.push(systemContext.trim());
  } else {
    // Only add default instructions if no style reference images are present
    const hasStyleImages = referenceImages?.some(img => img.type === 'style') ?? false;
    if (!hasStyleImages) {
      parts.push(
        'Create a high-quality, detailed image that matches the description exactly.',
        'Use vibrant colors and clear composition.',
        'Ensure the image is suitable for a comic book or graphic novel context.'
      );
    }
  }

  // Add user prompt
  parts.push("User Prompt:\n" + userPrompt.trim());
  
  return parts.join('\n\n');
}

/**
 * Add reference images to the content array
 */
async function addReferenceImagesToContent(content: any[], referenceImages: ReferenceImage[]): Promise<void> {
  // Order reference images by type such that character images come first, then scene images, then style images
  const orderedReferenceImages = referenceImages.sort((a, b) => {
    if (a.type === 'character') return -1;
    if (b.type === 'character') return 1;
    if (a.type === 'scene') return -1;
    if (b.type === 'scene') return 1;
    if (a.type === 'style') return -1;
    if (b.type === 'style') return 1;
    return 0;
  });

  const containsCharacterOrSceneImages = orderedReferenceImages.some(refImage => 
    refImage.type === 'character' || refImage.type === 'scene'
  );

  // Add reference images as base64 data
  for (const refImage of referenceImages) {
    try {
      const base64Data = await imageUrlToBase64(refImage.url);
      
      // Add descriptive text for the reference image
      let description = '';
      
      switch (refImage.type) {
        case 'style':
          if (containsCharacterOrSceneImages) {
            description = `The following image is a reference for the art style, style for the output image should be in this style.  other reference images not marked for style should be translated into this style.`;
          } else {
            description = `The following image is a reference for the art style, style for the output image should be in this style`;
          }
          break;
        case 'character':
          description = `The following image is a reference for the character: ${refImage.customName}`;
          break;
        case 'scene':
          description = `The following image is a reference for the scene: ${refImage.customName}`;
          break;
        default:
          description = `The following image is a reference`;
      }
      
      content.push({ type: 'input_text', text: description });
      content.push({
        type: 'input_image',
        image_url: `data:image/jpeg;base64,${base64Data}`,
      });
    } catch (error) {
      console.warn(`Failed to process reference image ${refImage.name}:`, error);
      // Continue with other images
    }
  }
} 