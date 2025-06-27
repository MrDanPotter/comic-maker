import { ImageGeneratorService, ImageGenerationResponse, ImageQuality, ReferenceImage } from './imageGeneratorService';

/**
 * Picsum Image Generation Service
 * Uses Picsum Photos for placeholder images
 */
export class PicsumImageGenerationService implements ImageGeneratorService {
  async generateImage(
    prompt: string, 
    apiKey: string, 
    aspectRatio: string = '1:1',
    quality: ImageQuality = 'medium',
    referenceImages?: ReferenceImage[]
  ): Promise<ImageGenerationResponse> {
    try {
      console.log('Generating image with Picsum');
      console.log("prompt: " + prompt);
      console.log("quality: " + quality);
      if (referenceImages && referenceImages.length > 0) {
        console.log("reference images provided:", referenceImages.length);
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a random image from Picsum
      const timestamp = Date.now();
      const imageUrl = `https://picsum.photos/512/512?random=${timestamp}`;
      
      return {
        imageUrl,
        success: true
      };
    } catch (error) {
      console.error('Error generating image with Picsum:', error);
      return {
        imageUrl: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  validateApiKey(apiKey: string): boolean {
    // Picsum doesn't require an API key, so any non-empty string is valid
    return apiKey.trim().length > 0;
  }

  async testApiKey(apiKey: string): Promise<boolean> {
    // Picsum doesn't require an API key, so this always returns true
    return true;
  }
} 