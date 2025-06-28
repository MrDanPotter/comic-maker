import OpenAI from 'openai';
import {
  ImageGeneratorService,
  ImageGenerationResponse,
  ImageQuality,
  ReferenceImage,
} from './imageGeneratorService';
import { AspectRatio } from '../types/comic';
import { buildImagePromptContent, buildPromptText } from '../utils/promptBuilder';

/**
 * Helper: map aspect ratio to OpenAI size strings.
 */
const getImageSize = (aspectRatio: AspectRatio = 'square'): '1024x1024' | '1536x1024' | '1024x1536' => {
  switch (aspectRatio) {
    case 'square':
      return '1024x1024';
    case 'landscape':
      return '1536x1024';
    case 'portrait':
      return '1024x1536';
    default:
      return '1024x1024';
  }
};

/**
 * Concrete implementation that talks to OpenAI's image endpoint
 * via the official SDK instead of raw fetch().
 */
export class OpenAIImageGenerationService implements ImageGeneratorService {
  /** SDK factory so we don't forget the browser opt-in flag */
  private createClient(apiKey: string): OpenAI {
    return new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true, // BYOK: we expose the key, and that's OK here
    });
  }

  /** Generate one image with GPT-Image-1 or GPT-4.1 with reference images */
  async generateImage(
    prompt: string,
    apiKey: string,
    aspectRatio: AspectRatio = 'square',
    quality: ImageQuality = 'medium',
    referenceImages?: ReferenceImage[],
    systemContext?: string
  ): Promise<ImageGenerationResponse> {
    try {
      const openai = this.createClient(apiKey);

      // If reference images are provided, use the new GPT-4.1 responses API
      if (referenceImages && referenceImages.length > 0) {
        return await this.generateImageWithReferences(openai, prompt, referenceImages, aspectRatio, systemContext);
      }

      // Otherwise, use the traditional GPT-Image-1 API
      return await this.generateImageTraditional(openai, prompt, aspectRatio, quality, systemContext);
    } catch (err) {
      console.error('OpenAI image generation failed:', err);
      return {
        imageUrl: '',
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  }

  /** Generate image using traditional GPT-Image-1 API */
  private async generateImageTraditional(
    openai: OpenAI,
    prompt: string,
    aspectRatio: AspectRatio,
    quality: ImageQuality,
    systemContext?: string
  ): Promise<ImageGenerationResponse> {
    const size = getImageSize(aspectRatio);

    // Build the prompt using promptBuilder
    const promptText = buildPromptText(prompt, systemContext);

    const response = await openai.images.generate({
      model: 'gpt-image-1',          // newest model
      prompt: promptText,
      n: 1,
      size,
      output_format: 'png',
      quality,
    });

    // gpt-image-1 returns base64 data in b64_json field
    const b64Data = response.data?.[0]?.b64_json;
    if (!b64Data) throw new Error('Unexpected OpenAI response shape - no b64_json data');

    // Convert base64 to data URL
    const imageUrl = `data:image/png;base64,${b64Data}`;

    return { imageUrl, success: true };
  }

  /** Generate image using GPT-4.1 responses API with reference images */
  private async generateImageWithReferences(
    openai: OpenAI,
    prompt: string,
    referenceImages: ReferenceImage[],
    aspectRatio: AspectRatio,
    systemContext?: string
  ): Promise<ImageGenerationResponse> {
    try {
      // Build the content array using the promptBuilder
      const content = await buildImagePromptContent({
        userPrompt: prompt,
        referenceImages,
        systemContext
      });

      // Create the response with image generation tool using the responses API
      const response = await openai.responses.create({
        model: 'gpt-4o',
        input: [
          {
            role: 'user',
            content: content
          }
        ],
        tools: [{ type: 'image_generation' }],
      });

      // Extract the generated image from the response
      const imageData = response.output
        .filter((output: any) => output.type === 'image_generation_call')
        .map((output: any) => output.result);

      if (imageData.length > 0) {
        const imageBase64 = imageData[0];
        const imageUrl = `data:image/png;base64,${imageBase64}`;
        return { imageUrl, success: true };
      } else {
        throw new Error('No image generation result found in response');
      }
    } catch (error) {
      console.error('Error generating image with references:', error);
      throw error;
    }
  }

  /** Cheap client-side sanity check */
  validateApiKey(apiKey: string): boolean {
    return apiKey.startsWith('sk-') && apiKey.length > 20;
  }

  /** One-round-trip liveness test */
  async testApiKey(apiKey: string): Promise<boolean> {
    try {
      const openai = this.createClient(apiKey);
      // list models; low-cost health-check
      const list = await openai.models.list();
      return Array.isArray(list.data) && list.data.length > 0;
    } catch (err) {
      console.error('OpenAI key test failed:', err);
      return false;
    }
  }
}
