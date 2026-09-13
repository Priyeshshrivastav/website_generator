from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models import GenerateRequest, WebsiteSpecification
from app.graph import website_graph

app = FastAPI(
    title="AI Website Generator API",
    description="Agentic website generator powered by FastAPI, LangGraph, and Groq (Llama 3.3 70B)",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "name": "AI Website Generator API",
        "docs": "/docs",
        "health": "/health",
        "endpoints": ["POST /generate"]
    }

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/generate", response_model=WebsiteSpecification)
def generate_website(payload: GenerateRequest):
    if not payload.brand_name.strip():
        raise HTTPException(status_code=400, detail="Brand/business name is required.")

    initial_state = {
        "user_input": payload.model_dump(),
        "website_plan": {},
        "website_content": {},
        "review_result": {},
        "retry_count": 0
    }

    try:
        final_state = website_graph.invoke(initial_state)
        content = final_state.get("website_content")
        if not content:
            raise HTTPException(status_code=500, detail="Failed to generate website specification.")
        
        # Ensure validation passes
        return WebsiteSpecification(**content)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Agent workflow error: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
