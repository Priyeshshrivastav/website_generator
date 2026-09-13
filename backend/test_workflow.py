import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from app.models import GenerateRequest
from app.graph import website_graph
import json

test_input = {
    "brand_name": "Apex Studio",
    "building_type": "Portfolio",
    "goal": "Showcase my work",
    "style": "Modern",
    "theme": "Dark",
    "focus_areas": ["About", "Portfolio", "Services", "Contact"],
    "profile_type": "Creator"
}

print("Running test workflow with LangGraph & Groq...")
state = {
    "user_input": test_input,
    "website_plan": {},
    "website_content": {},
    "review_result": {},
    "retry_count": 0
}

result = website_graph.invoke(state)
print("\n--- WEBSITE PLAN ---")
print(json.dumps(result.get("website_plan"), indent=2))
print("\n--- REVIEW RESULT ---")
print(json.dumps(result.get("review_result"), indent=2))
print("\n--- GENERATED CONTENT (summary) ---")
content = result.get("website_content")
print("Site:", content.get("site"))
print("Sections count:", len(content.get("sections", [])))
for s in content.get("sections", []):
    print(f" - [{s.get('type')}]: {s.get('headline') or s.get('title')}")

print("\nSUCCESS! Test completed.")
