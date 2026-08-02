// Generates a vector embedding for a piece of text using Google's free Gemini Embedding API
export const getEmbedding = async (text) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "models/gemini-embedding-001",
          content: { parts: [{ text }] },
          outputDimensionality: 768,
        }),
      }
    );

    const data = await response.json();

    if (!data.embedding?.values) {
      console.error("Embedding API error:", data);
      return null;
    }

    return data.embedding.values;
  } catch (error) {
    console.error("Failed to generate embedding:", error.message);
    return null;
  }
};

// Cosine similarity between two equal-length vectors
export const cosineSimilarity = (vecA, vecB) => {
  let dot = 0, magA = 0, magB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    magA += vecA[i] * vecA[i];
    magB += vecB[i] * vecB[i];
  }

  if (magA === 0 || magB === 0) return 0;

  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
};