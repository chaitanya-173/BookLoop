import os
import logging
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from pinecone import Pinecone

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("bookloop-ai-service")

app = FastAPI(title="BookLoop AI Service")

# Allow the Node backend (and local dev tools) to call this service.
# Tighten this to your deployed backend URL in production if you want to lock it down.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX = os.getenv("PINECONE_INDEX")
NAMESPACE = "__default__"  # default namespace (Pinecone API 2025-04+ requires this explicit value)

if not PINECONE_API_KEY or not PINECONE_INDEX:
    raise RuntimeError(
        "Missing PINECONE_API_KEY or PINECONE_INDEX in ai-service/.env"
    )

pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX)


class ListingPayload(BaseModel):
    id: str
    title: str
    author: Optional[str] = ""
    category: str
    type: str
    description: Optional[str] = ""


@app.get("/")
def health():
    return {"status": "AI service running"}


@app.post("/embed-listing")
def embed_listing(payload: ListingPayload):
    text = (
        f"{payload.title}. By {payload.author or 'Unknown'}. "
        f"Category: {payload.category}. {payload.description or ''}"
    ).strip()

    try:
        index.upsert_records(
            namespace=NAMESPACE,
            records=[
                {
                    "_id": payload.id,
                    "text": text,
                    "category": payload.category,
                    "type": payload.type,
                }
            ],
        )
    except Exception as e:
        logger.exception("Failed to upsert listing %s into Pinecone", payload.id)
        raise HTTPException(status_code=500, detail=f"Pinecone upsert failed: {str(e)}")

    return {"success": True, "message": "Listing embedded"}


@app.delete("/listing/{listing_id}")
def delete_listing(listing_id: str):
    try:
        index.delete(ids=[listing_id], namespace=NAMESPACE)
    except Exception as e:
        logger.exception("Failed to delete listing %s from Pinecone", listing_id)
        raise HTTPException(status_code=500, detail=f"Pinecone delete failed: {str(e)}")

    return {"success": True, "message": "Listing removed from index"}


@app.get("/search")
def semantic_search(q: str, k: int = 10):
    if not q or not q.strip():
        return {"success": True, "ids": []}

    try:
        response = index.search(
            namespace=NAMESPACE,
            query={"inputs": {"text": q}, "top_k": k},
            fields=["text", "category", "type"],
        )
        hits = response["result"]["hits"]
        ids = [hit["_id"] for hit in hits]
    except Exception as e:
        logger.exception("Semantic search failed for query: %s", q)
        raise HTTPException(status_code=500, detail=f"Pinecone search failed: {str(e)}")

    return {"success": True, "ids": ids}
