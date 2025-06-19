export interface ImageGenerationRequest {
  prompt: string;
  aspectRatio: string;
  apiKey: string;
}

export interface ImageGenerationResponse {
  imageUrl: string;
  success: boolean;
  error?: string;
}

/**
 * Generate an image using OpenAI's DALL-E API
 * For now, this is stubbed out to return a static image
 */
export const generateImage = async (request: ImageGenerationRequest): Promise<ImageGenerationResponse> => {
  try {
    // TODO: Implement actual OpenAI API call
    // const response = await fetch('https://api.openai.com/v1/images/generations', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${request.apiKey}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     prompt: request.prompt,
    //     n: 1,
    //     size: getImageSize(request.aspectRatio),
    //     response_format: 'url'
    //   })
    // });
    
    // const data = await response.json();
    // return {
    //   imageUrl: data.data[0].url,
    //   success: true
    // };

    // Stub implementation - return a static image after a delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      imageUrl: 'https://picsum.photos/512/512?random=' + Date.now(), // Random placeholder image
      success: true
    };
  } catch (error) {
    console.error('Error generating image:', error);
    return {
      imageUrl: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Helper function to determine image size based on aspect ratio
 * This will be used when implementing the actual OpenAI API call
 */
const getImageSize = (aspectRatio: string): string => {
  // Parse aspect ratio (e.g., "16:9", "1:1", "4:3")
  const [width, height] = aspectRatio.split(':').map(Number);
  
  if (width === height) {
    return '1024x1024'; // Square
  } else if (width > height) {
    return '1024x1024'; // Landscape - OpenAI supports 1024x1024, 1792x1024, 1024x1792
  } else {
    return '1024x1024'; // Portrait
  }
};

/**
 * Validate OpenAI API key format
 */
export const validateApiKey = (apiKey: string): boolean => {
  return apiKey.startsWith('sk-') && apiKey.length > 20;
};

/**
 * Test API key by making a simple request
 */
export const testApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    // TODO: Implement actual API key test
    // const response = await fetch('https://api.openai.com/v1/models', {
    //   headers: {
    //     'Authorization': `Bearer ${apiKey}`
    //   }
    // });
    // return response.ok;
    
    // Stub implementation
    return validateApiKey(apiKey);
  } catch (error) {
    console.error('Error testing API key:', error);
    return false;
  }
}; 