import { GoogleGenAI, Modality } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Converts a File object to a base64 string.
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the Data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Edits an image or places an object into a scene using Gemini 2.5 Flash Image.
 */
export const editImageWithGemini = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  const ai = getClient();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData && part.inlineData.data) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }

    throw new Error("No image data returned from Gemini 2.5 Flash Image.");
  } catch (error) {
    console.error("Error in editImageWithGemini:", error);
    throw error;
  }
};

/**
 * Generates a new image from scratch using Imagen 4.
 */
export const generateImageWithImagen = async (
  prompt: string,
  aspectRatio: '1:1' | '16:9' | '9:16' | '3:4' | '4:3' = '1:1'
): Promise<string> => {
  const ai = getClient();

  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });

    const generatedImage = response.generatedImages?.[0]?.image;
    if (generatedImage && generatedImage.imageBytes) {
      return `data:image/jpeg;base64,${generatedImage.imageBytes}`;
    }

    throw new Error("No image data returned from Imagen 4.");
  } catch (error) {
    console.error("Error in generateImageWithImagen:", error);
    throw error;
  }
};
