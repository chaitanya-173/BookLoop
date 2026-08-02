import axios from "axios";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

// Send a listing to the Python AI service to be embedded and upserted into Pinecone
export const embedListing = async (listing) => {
  try {
    await axios.post(`${AI_SERVICE_URL}/embed-listing`, {
      id: listing._id.toString(),
      title: listing.title,
      author: listing.author,
      category: listing.category,
      type: listing.type,
      description: listing.description,
    });
  } catch (error) {
    console.error("AI service embed failed:", error.message);
  }
};

// Remove a listing's vector from Pinecone via the Python service
export const removeListingEmbedding = async (listingId) => {
  try {
    await axios.delete(`${AI_SERVICE_URL}/listing/${listingId}`);
  } catch (error) {
    console.error("AI service delete failed:", error.message);
  }
};

// Query the Python service for semantically similar listing IDs
export const semanticSearch = async (query, k = 10) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/search`, {
      params: { q: query, k },
    });
    return response.data.ids || [];
  } catch (error) {
    console.error("AI service search failed:", error.message);
    return [];
  }
};