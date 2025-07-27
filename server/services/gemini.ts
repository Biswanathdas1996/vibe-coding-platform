import { GoogleGenAI } from "@google/genai";

export interface CodeGenerationResponse {
  plan: string[];
  files: Record<string, string>;
}

export async function generateCode(
  prompt: string,
  existingFiles?: Record<string, string>
): Promise<CodeGenerationResponse> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("Google API key not found in environment variables");
  }

  const genAI = new GoogleGenAI({ apiKey });
  const model = genAI.models.generateContent;

  const systemPrompt = `You are VibeCodingAgent, an autonomous coding assistant. When given a natural-language feature request, your job is to:

1. Plan: Decompose requirements into a step-by-step implementation plan.
2. Generate: Produce source files—index.html, styles.css, script.js—plus any extra assets needed.
3. Output: Return a JSON response with the exact format: { "plan": string[], "files": { [filename]: content } }

Guidelines:
- Generate complete, functional, production-ready code
- Use modern web standards (HTML5, CSS3, ES6+)
- Make responsive designs that work on all devices
- Include proper error handling and accessibility features
- If modifying existing files, provide the complete updated file content
- Always return valid JSON in the specified format
- Prioritize clean, maintainable code with good structure

${
  existingFiles
    ? `Existing files to modify or extend:\n${JSON.stringify(
        existingFiles,
        null,
        2
      )}`
    : "Generate new files from scratch."
}`;

  try {
    const fullPrompt = `${systemPrompt}\n\nUser request: ${prompt}\n\nIMPORTANT: Return ONLY valid JSON in this exact format:
{
  "plan": ["step 1", "step 2", "step 3"],
  "files": {
    "index.html": "file content here",
    "styles.css": "css content here",
    "script.js": "js content here"
  }
}`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: fullPrompt,
      config: {
        temperature: 0.1,
      },
    });

    let content = response.text || "";
    if (!content) {
      throw new Error("No response content from Gemini");
    }

    // Remove markdown code blocks if present
    content = content.trim();
    if (content.startsWith("```json")) {
      content = content.substring(7); // Remove ```json
    }
    if (content.startsWith("```")) {
      content = content.substring(3); // Remove ```
    }
    if (content.endsWith("```")) {
      content = content.substring(0, content.length - 3); // Remove trailing ```
    }
    content = content.trim();

    const result = JSON.parse(content) as CodeGenerationResponse;

    // Validate response structure
    if (!result.plan || !Array.isArray(result.plan)) {
      throw new Error("Invalid response: missing or invalid plan array");
    }

    if (!result.files || typeof result.files !== "object") {
      throw new Error("Invalid response: missing or invalid files object");
    }

    return result;
  } catch (error) {
    console.error("Gemini code generation error:", error);
    throw new Error(
      `Failed to generate code: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
