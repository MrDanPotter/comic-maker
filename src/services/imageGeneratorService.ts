// Import the implementations
import { PicsumImageGenerationService } from './picsumImageGenerationService';
import { OpenAIImageGenerationService } from './openAIImageGenerationService';

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

export interface ImageGeneratorService {
  generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse>;
  validateApiKey(apiKey: string): boolean;
  testApiKey(apiKey: string): Promise<boolean>;
}

// Factory function to create the appropriate service based on configuration
export const createImageGeneratorService = (useOpenAI: boolean): ImageGeneratorService => {
  return useOpenAI ? new OpenAIImageGenerationService() : new PicsumImageGenerationService();
}; 