import { OpenAIImageGenerationService } from '../openAIImageGenerationService';
import { ReferenceImage } from '../imageGeneratorService';
import type { ReferenceImageType } from '../../types/comic';

// Mock OpenAI
jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    responses: {
      create: jest.fn().mockResolvedValue({
        output: [
          {
            type: 'image_generation_call',
            result: 'mock-base64-image-data'
          }
        ]
      })
    },
    images: {
      generate: jest.fn().mockResolvedValue({
        data: [{ b64_json: 'mock-base64-image-data' }]
      })
    },
    models: {
      list: jest.fn().mockResolvedValue({ data: ['gpt-4o'] })
    }
  }))
}));

// Mock fetch for image conversion
global.fetch = jest.fn().mockResolvedValue({
  blob: () => Promise.resolve(new Blob(['mock-image-data']))
});

// Mock FileReader
const mockFileReader = jest.fn().mockImplementation(() => ({
  readAsDataURL: jest.fn(),
  onload: null,
  result: 'data:image/jpeg;base64,mock-base64-data'
}));

(mockFileReader as any).EMPTY = 0;
(mockFileReader as any).LOADING = 1;
(mockFileReader as any).DONE = 2;

global.FileReader = mockFileReader as any;

describe('OpenAIImageGenerationService with Reference Images', () => {
  let service: OpenAIImageGenerationService;
  let mockReferenceImages: ReferenceImage[];

  beforeEach(() => {
    service = new OpenAIImageGenerationService();
    mockReferenceImages = [
      {
        id: '1',
        url: 'data:image/jpeg;base64,mock-data-1',
        type: 'style' as ReferenceImageType,
        name: 'test-style.jpg',
        customName: 'Comic Style'
      }
    ];
  });

  test('should use responses API when reference images are provided', async () => {
    const mockApiKey = 'sk-test-key';
    const mockPrompt = 'Generate a comic panel';
    
    const result = await service.generateImage(
      mockPrompt, 
      mockApiKey, 
      'square', 
      'medium', 
      mockReferenceImages
    );

    expect(result.success).toBe(true);
    expect(result.imageUrl).toBe('data:image/png;base64,mock-base64-image-data');
  });

  test('should use traditional API when no reference images are provided', async () => {
    const mockApiKey = 'sk-test-key';
    const mockPrompt = 'Generate a comic panel';
    
    const result = await service.generateImage(
      mockPrompt, 
      mockApiKey, 
      'square', 
      'medium'
    );

    expect(result.success).toBe(true);
    expect(result.imageUrl).toBe('data:image/png;base64,mock-base64-image-data');
  });

  test('should validate API key correctly', () => {
    expect(service.validateApiKey('sk-valid-key-123456789')).toBe(true);
    expect(service.validateApiKey('invalid-key')).toBe(false);
    expect(service.validateApiKey('sk-')).toBe(false);
  });

  test('should add descriptive text for each reference image', async () => {
    const mockApiKey = 'sk-test-key';
    const mockPrompt = 'Generate a comic panel';
    
    // Create reference images with different types and names
    const testReferenceImages: ReferenceImage[] = [
      {
        id: '1',
        url: 'data:image/jpeg;base64,mock-data-1',
        type: 'style' as ReferenceImageType,
        name: 'comic-style.jpg',
        customName: 'Vintage Comic Style'
      },
      {
        id: '2',
        url: 'data:image/jpeg;base64,mock-data-2',
        type: 'character' as ReferenceImageType,
        name: 'hero.jpg',
        customName: 'Superhero'
      },
      {
        id: '3',
        url: 'data:image/jpeg;base64,mock-data-3',
        type: 'scene' as ReferenceImageType,
        name: 'city.jpg'
        // No custom name, should use filename
      }
    ];
    
    const result = await service.generateImage(
      mockPrompt, 
      mockApiKey, 
      'square', 
      'medium', 
      testReferenceImages
    );

    expect(result.success).toBe(true);
    
    // Verify that the mock was called with the expected content structure
    const OpenAI = require('openai').default;
    const mockOpenAIInstance = OpenAI.mock.results[0].value;
    const responsesCreateMock = mockOpenAIInstance.responses.create;
    
    expect(responsesCreateMock).toHaveBeenCalledWith({
      model: 'gpt-4o',
      input: [
        {
          role: 'user',
          content: [
            { type: 'input_text', text: mockPrompt },
            { type: 'input_text', text: 'The following image is a reference for the art style' },
            { type: 'input_image', image_url: 'data:image/jpeg;base64,mock-data-1' },
            { type: 'input_text', text: 'The following image is a reference for the character: Superhero' },
            { type: 'input_image', image_url: 'data:image/jpeg;base64,mock-data-2' },
            { type: 'input_text', text: 'The following image is a reference for the scene: city.jpg' },
            { type: 'input_image', image_url: 'data:image/jpeg;base64,mock-data-3' }
          ]
        }
      ],
      tools: [{ type: 'image_generation' }],
    });
  });
}); 