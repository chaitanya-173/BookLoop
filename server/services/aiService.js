import axios from "axios";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Render's free tier spins the AI service down after inactivity, so the very
// first request after a period of idle time can hit a 502 while it wakes up.
// This retries once after a short delay before giving up, so a cold start
// doesn't silently look like "no semantic results" to the user.
const withColdStartRetry = async (fn) => {
  try {
    return await fn();
  } catch (firstError) {
    console.warn(
      "AI service call failed, retrying once in case it's waking up:",
      firstError.message,
    );
    await sleep(4000);
    return await fn();
  }
};

// Send a listing to the Python AI service to be embedded and upserted into Pinecone
export const embedListing = async (listing) => {
  try {
    await withColdStartRetry(() =>
      axios.post(`${AI_SERVICE_URL}/embed-listing`, {
        id: listing._id.toString(),
        title: listing.title,
        author: listing.author,
        category: listing.category,
        type: listing.type,
        description: listing.description,
      }),
    );
  } catch (error) {
    console.error("AI service embed failed:", error.message);
  }
};

// Remove a listing's vector from Pinecone via the Python service
export const removeListingEmbedding = async (listingId) => {
  try {
    await withColdStartRetry(() =>
      axios.delete(`${AI_SERVICE_URL}/listing/${listingId}`),
    );
  } catch (error) {
    console.error("AI service delete failed:", error.message);
  }
};

// Query the Python service for semantically similar listing IDs
export const semanticSearch = async (query, k = 10) => {
  try {
    const response = await withColdStartRetry(() =>
      axios.get(`${AI_SERVICE_URL}/search`, {
        params: { q: query, k },
      }),
    );
    return response.data.ids || [];
  } catch (error) {
    console.error("AI service search failed:", error.message);
    return [];
  }
};