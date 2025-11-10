import { GoogleGenAI } from "@google/genai";
import { GenerationCallbacks, ProcessingStage } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("API_KEY environment variable not set. API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

async function generateInitialImage(prompt: string): Promise<{bytes: string, dataUrl: string}> {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `Cinematic, ultra-realistic, 8k, movie still, 9:16 vertical format: ${prompt}`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '9:16',
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("Image generation failed to produce an image.");
    }
    const imageBytes = response.generatedImages[0].image.imageBytes;
    const dataUrl = `data:image/jpeg;base64,${imageBytes}`;

    return { bytes: imageBytes, dataUrl };
}

async function generateVideoFromImage(prompt: string, imageBytes: string): Promise<string> {
    let operation = await ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt: prompt, // The detailed prompt is now constructed in the main function
        image: {
            imageBytes: imageBytes,
            mimeType: 'image/jpeg',
        },
        config: {
            numberOfVideos: 1,
        }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000)); 
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (!downloadLink) {
        throw new Error("Video generation operation completed, but no video URI was found.");
    }
    
    const videoResponse = await fetch(`${downloadLink}&key=${API_KEY}`);
    if (!videoResponse.ok) {
        throw new Error(`Failed to download video: ${videoResponse.statusText}`);
    }
    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateCinematicVideo = async (prompt: string, isProUser: boolean, callbacks: GenerationCallbacks) => {
    try {
        callbacks.onStageChange(ProcessingStage.STARTING);
        await sleep(1000);
        callbacks.onStageChange(ProcessingStage.ANALYZING_PROMPT);

        // 1. Parse scenes from the prompt
        const lines = prompt.trim().split('\n');
        const scenes: string[] = [];
        let currentSceneContent: string[] = [];

        for (const line of lines) {
            if (/^(🎞️\s*)?Scene\s*\d+/i.test(line.trim())) {
                if (currentSceneContent.length > 0) {
                    scenes.push(currentSceneContent.join('\n').trim());
                }
                currentSceneContent = [line];
            } else if (line.trim()) {
                currentSceneContent.push(line);
            }
        }
        if (currentSceneContent.length > 0) {
            scenes.push(currentSceneContent.join('\n').trim());
        }

        const hasMultipleScenes = scenes.length > 1;

        // 2. Prepare tailored prompts based on scene analysis
        let initialImagePrompt: string;
        let videoGenerationPrompt: string;

        if (hasMultipleScenes) {
            const firstSceneDescription = scenes[0].replace(/^(🎞️\s*)?Scene\s*\d+\s*[:\-–]?\s*/i, '').trim();
            initialImagePrompt = firstSceneDescription;
            
            const sceneDescriptions = scenes.map((scene, index) => {
                const cleanScene = scene.replace(/^(🎞️\s*)?Scene\s*\d+\s*[:\-–]?\s*/i, '').trim();
                return `Scene ${index + 1}: ${cleanScene}. This scene must have dynamic camera movement (e.g., pan, zoom, cut) and last approximately 4-5 seconds.`;
            }).join('\n\n');

            videoGenerationPrompt = `
Create a single, coherent cinematic video sequence in a 9:16 vertical format. Total duration should be 30-40 seconds.
The video MUST be composed of ${scenes.length} visually distinct but stylistically consistent scenes.
Use smooth visual transitions (like fade, cross-dissolve, or fog fade) between each scene.
Ensure character appearance, color palette, and emotional tone are consistent throughout.
Change camera angles between scenes to imply motion and progression.

Scene Descriptions:
${sceneDescriptions}
            `;
        } else {
            initialImagePrompt = prompt;
            videoGenerationPrompt = `An epic 40-second cinematic video, ultra-realistic, 8k, movie quality, 9:16 vertical format. The video starts with a scene matching the provided image, and then continues the story. Prompt: ${prompt}`;
        }

        if (isProUser) {
            videoGenerationPrompt += `\n\nEnhancement Layer (Gemini Pro): Apply enhanced realism with dynamic fog lighting, fine shadow details, smooth motion interpolation, and a cinematic film grain.`;
        }
        
        await sleep(1500);
        callbacks.onStageChange(ProcessingStage.PREPARING_COMMAND);

        callbacks.onStageChange(ProcessingStage.GENERATING_IMAGE);
        const { bytes: imageBytes, dataUrl: stillDataUrl } = await generateInitialImage(initialImagePrompt);
        callbacks.onStageChange(ProcessingStage.GENERATING_VIDEO, { stillUrl: stillDataUrl });
        
        const videoUrl = await generateVideoFromImage(videoGenerationPrompt, imageBytes);
        
        if (isProUser) {
            callbacks.onStageChange(ProcessingStage.ENHANCING_VIDEO, { stillUrl: stillDataUrl });
            await sleep(3000); // Simulate enhancement time
        }

        callbacks.onStageChange(ProcessingStage.DONE, { videoUrl });

    } catch (error) {
        console.error("Error in cinematic video generation pipeline:", error);
        throw error;
    }
};