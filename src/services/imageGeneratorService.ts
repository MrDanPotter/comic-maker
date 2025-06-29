import { AspectRatio, ReferenceImageType } from '../types/comic';

// Import the implementations
import { PicsumImageGenerationService } from './picsumImageGenerationService';
import { OpenAIImageGenerationService } from './openAIImageGenerationService';

export interface ImageGenerationResponse {
  imageUrl: string;
  success: boolean;
  error?: string;
}

export type ImageQuality = 'low' | 'medium' | 'high';

// Import the ReferenceImage interface from the global state
export interface ReferenceImage {
  id: string;
  url: string;
  type: ReferenceImageType;
  name: string;
  customName?: string;
}

export interface ImageGeneratorService {
  generateImage(
    prompt: string, 
    apiKey: string, 
    aspectRatio?: AspectRatio,
    quality?: ImageQuality,
    referenceImages?: ReferenceImage[],
    systemContext?: string
  ): Promise<ImageGenerationResponse>;
  validateApiKey(apiKey: string): boolean;
  testApiKey(apiKey: string): Promise<boolean>;
}

// Factory function to create the appropriate service based on configuration
export const createImageGeneratorService = (useOpenAI: boolean): ImageGeneratorService => {
  return useOpenAI ? new OpenAIImageGenerationService() : new PicsumImageGenerationService();
}; 