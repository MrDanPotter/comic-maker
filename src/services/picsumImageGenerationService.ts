import { ImageGeneratorService, ImageGenerationResponse, ImageQuality, ReferenceImage } from './imageGeneratorService';
import { AspectRatio } from '../types/comic';

/**
 * Picsum Image Generation Service
 * Uses Picsum Photos for placeholder images
 */
export class PicsumImageGenerationService implements ImageGeneratorService {
  async generateImage(
    prompt: string, 
    apiKey: string, 
    aspectRatio: AspectRatio = 'square',
    quality: ImageQuality = 'medium',
    referenceImages?: ReferenceImage[],
    systemContext?: string
  ): Promise<ImageGenerationResponse> {
    try {
      console.log('Generating image with Picsum');
      console.log("prompt: " + prompt);
      console.log("quality: " + quality);
      if (systemContext) {
        console.log("system context provided");
      }
      if (referenceImages && referenceImages.length > 0) {
        console.log("reference images provided:", referenceImages.length);
        const styleImages = referenceImages.filter(img => img.type === 'style');
        if (styleImages.length > 0) {
          console.log("style reference images present:", styleImages.length);
        }
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