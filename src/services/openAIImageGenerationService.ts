import OpenAI from 'openai';
import {
  ImageGeneratorService,
  ImageGenerationResponse,
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

  /** Generate one image with GPT-Image-1 */
  async generateImage(
    prompt: string,
    apiKey: string,
    aspectRatio: string = '1:1'
  ): Promise<ImageGenerationResponse> {
    try {
      const openai = this.createClient(apiKey);
      const size = getImageSize(aspectRatio);

      const response = await openai.images.generate({
        model: 'gpt-image-1',          // newest model
        prompt,
        n: 1,
        size,
        output_format: 'png',
      });

      // gpt-image-1 returns base64 data in b64_json field
      const b64Data = response.data?.[0]?.b64_json;
      if (!b64Data) throw new Error('Unexpected OpenAI response shape - no b64_json data');

      // Convert base64 to data URL
      const imageUrl = `data:image/png;base64,${b64Data}`;

      return { imageUrl, success: true };
    } catch (err) {
      console.error('OpenAI image generation failed:', err);
      return {
        imageUrl: '',
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      };
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
