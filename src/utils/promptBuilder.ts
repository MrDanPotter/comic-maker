/**
 * Build a complete prompt for image generation based on all inputs
 */
export function buildImagePrompt({
  userPrompt,
  systemContext,
  includeSystemContext,
  enforceAspectRatio,
  aspectRatio
}: {
  userPrompt: string;
  systemContext?: string;
  includeSystemContext: boolean;
  enforceAspectRatio: boolean;
  aspectRatio: string;
}): string {
  const parts: string[] = [];

  // Add system instructions
  const systemInstructions = buildSystemInstructions(enforceAspectRatio, 
                                        aspectRatio, 
                                        includeSystemContext, 
                                        systemContext);
  if (systemInstructions) {
    parts.push(systemInstructions);
  }

  // Add user prompt
  parts.push("User Prompt:\n"+userPrompt.trim());
  
  return parts.join('\n\n');
}

/**
 * Build system instructions based on configuration
 */
function buildSystemInstructions(enforceAspectRatio: boolean, 
                                aspectRatio: string, 
                                includeSystemContext: boolean, 
                                systemContext?: string): string {
  const instructions: string[] = [];

  if (includeSystemContext && systemContext?.trim()) {
    instructions.push(systemContext.trim());
  } else {
    instructions.push(
        'Create a high-quality, detailed image that matches the description exactly.',
        'Use vibrant colors and clear composition.',
        'Ensure the image is suitable for a comic book or graphic novel context.'
      );
  }

  // Add aspect ratio instruction if enforced
  if (enforceAspectRatio && aspectRatio) {
    const aspectRatioInstruction = buildAspectRatioInstruction(aspectRatio);
    if (aspectRatioInstruction) {
      instructions.push(aspectRatioInstruction);
    }
  }

  return instructions.join('\n');
}

/**
 * Build aspect ratio specific instructions
 */
function buildAspectRatioInstruction(aspectRatio: string): string {
  const [width, height] = aspectRatio.split(':').map(Number);
  
  if (width === height) {
    return 'The image must be perfectly square (1:1 aspect ratio).';
  } else if (width > height) {
    return `The image must be landscape orientation with aspect ratio ${aspectRatio}.`;
  } else {
    return `The image must be portrait orientation with aspect ratio ${aspectRatio}.`;
  }
} 