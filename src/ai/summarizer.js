/**
 * Real local LLM summarizer using Ollama
 * Model: mistral (free, local)
 */

export async function summarizeText(text) {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "mistral",
      prompt: `
Summarize the following study notes clearly and concisely.
Focus on key concepts and definitions.

NOTES:
${text}
`,
      stream: false
    })
  });

  const data = await response.json();
  return data.response.trim();
}
