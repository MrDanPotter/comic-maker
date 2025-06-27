import OpenAI from 'openai';
import {
  ImageGeneratorService,
  ImageGenerationResponse,
  ImageQuality,
  ReferenceImage,
} from './imageGeneratorService';

/**
 * Helper: map common aspect-ratios to OpenAI size strings.
 * Extend or tweak as you need.
 */
const getImageSize = (aspectRatio = '1:1'): '1024x1024' | '1536x1024' | '1024x1536' => {
  const [w, h] = aspectRatio.split(':').map(Number);
  if (w === h) return '1024x1024';      // square
  return w > h ? '1536x1024'            // landscape
               : '1024x1536';           // portrait
};

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
    aspectRatio: string = '1:1',
    quality: ImageQuality = 'medium',
    referenceImages?: ReferenceImage[]
  ): Promise<ImageGenerationResponse> {
    try {
      const openai = this.createClient(apiKey);

      // If reference images are provided, use the new GPT-4.1 responses API
      if (referenceImages && referenceImages.length > 0) {
        return await this.generateImageWithReferences(openai, prompt, referenceImages);
      }

      // Otherwise, use the traditional GPT-Image-1 API
      return await this.generateImageTraditional(openai, prompt, aspectRatio, quality);
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
    aspectRatio: string,
    quality: ImageQuality
  ): Promise<ImageGenerationResponse> {
    const size = getImageSize(aspectRatio);

    const response = await openai.images.generate({
      model: 'gpt-image-1',          // newest model
      prompt,
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
    referenceImages: ReferenceImage[]
  ): Promise<ImageGenerationResponse> {
    try {
      // Prepare the content array with text and images
      const content: any[] = [
        { type: 'input_text', text: prompt }
      ];

      // order reference images by type such that character images come first, then scene images, then style images
      const orderedReferenceImages = referenceImages.sort((a, b) => {
        if (a.type === 'character') return -1;
        if (b.type === 'character') return 1;
        if (a.type === 'scene') return -1;
        if (b.type === 'scene') return 1;
        if (a.type === 'style') return -1;
        if (b.type === 'style') return 1;
        return 0;
      });

      const containsCharacterOrSceneImages = orderedReferenceImages.some(refImage => refImage.type === 'character' || refImage.type === 'scene');

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
