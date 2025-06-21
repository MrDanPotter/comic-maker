import { ImageGeneratorService, ImageGenerationRequest, ImageGenerationResponse } from './imageGeneratorService';

/**
 * Helper function to determine image size based on aspect ratio
 */
const getImageSize = (aspectRatio: string): string => {
  // Parse aspect ratio (e.g., "16:9", "1:1", "4:3")
  const [width, height] = aspectRatio.split(':').map(Number);
  
  if (width === height) {
    return '1024x1024'; // Square
  } else if (width > height) {
    return '1792x1024'; // Landscape
  } else {
    return '1024x1792'; // Portrait
  }
};

/**
 * OpenAI Image Generation Service
 * Uses OpenAI's DALL-E API for image generation
 */
export class OpenAIImageGenerationService implements ImageGeneratorService {
  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${request.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: request.prompt,
          n: 1,
          size: getImageSize(request.aspectRatio),
          response_format: 'url'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.data || !data.data[0] || !data.data[0].url) {
        throw new Error('Invalid response format from OpenAI API');
      }

      return {
        imageUrl: data.data[0].url,
        success: true
      };
    } catch (error) {
      console.error('Error generating image with OpenAI:', error);
      return {
        imageUrl: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  validateApiKey(apiKey: string): boolean {
    return apiKey.startsWith('sk-') && apiKey.length > 20;
  }

  async testApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      
      if (!response.ok) {
        return false;
      }
      
      const data = await response.json();
      return Array.isArray(data.data) && data.data.length > 0;
    } catch (error) {
      console.error('Error testing OpenAI API key:', error);
      return false;
    }
  }
} 