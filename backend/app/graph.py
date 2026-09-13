from typing import TypedDict, List, Dict, Any
from langgraph.graph import StateGraph, START, END
from app.llm import call_llm_json
from app.models import WebsiteSpecification

class AgentState(TypedDict):
    user_input: Dict[str, Any]
    website_plan: Dict[str, Any]
    website_content: Dict[str, Any]
    review_result: Dict[str, Any]
    retry_count: int

def planner_node(state: AgentState) -> Dict[str, Any]:
    user_input = state["user_input"]
    system_prompt = (
        "You are an expert Website Information Architect and Planner. "
        "Your task is to analyze user preferences for a website and generate a structured website plan. "
        "Determine the logical order of sections, tone of voice, call-to-action (CTA) style, and visual design mood. "
        "Always ensure a 'hero' section is first. Order remaining sections logically based on user focus areas and primary goal.\n"
        "Return a JSON object with this EXACT schema:\n"
        "{\n"
        '  "site_type": string,\n'
        '  "sections": ["hero", "about", ...],\n'
        '  "tone": string,\n'
        '  "design_mood": string,\n'
        '  "cta_style": string\n'
        "}\n"
        "Available section types allowed: hero, about, services, products, portfolio, testimonials, pricing, faq, contact, gallery."
    )
    user_prompt = f"User Input:\n{user_input}"
    plan = call_llm_json(system_prompt, user_prompt)
    return {"website_plan": plan}

def content_node(state: AgentState) -> Dict[str, Any]:
    user_input = state["user_input"]
    plan = state.get("website_plan", {})
    retry_count = state.get("retry_count", 0)
    review_result = state.get("review_result", {})

    feedback_context = ""
    if retry_count > 0 and review_result.get("issues"):
        feedback_context = f"\nPrevious review found these issues, please fix them:\n{review_result.get('issues')}\n"

    system_prompt = (
        "You are a master Web Copywriter and Content Strategist. "
        "Generate rich, realistic, polished website copy matching the WebsiteSpecification schema.\n"
        "Do NOT use lazy filler words like 'Lorem ipsum' or 'Placeholder text'. Generate genuine, engaging copy tailored to the brand.\n"
        "Required Output JSON schema:\n"
        "{\n"
        '  "site": {\n'
        '    "name": string,\n'
        '    "type": string,\n'
        '    "goal": string,\n'
        '    "style": string,\n'
        '    "theme": string\n'
        "  },\n"
        '  "design": {\n'
        '    "mood": string,\n'
        '    "layout": string\n'
        "  },\n"
        '  "sections": [\n'
        '    {\n'
        '      "type": "hero",\n'
        '      "headline": string,\n'
        '      "subheadline": string,\n'
        '      "cta": string\n'
        "    },\n"
        '    {\n'
        '      "type": "about" | "services" | "products" | "portfolio" | "testimonials" | "pricing" | "faq" | "contact" | "gallery",\n'
        '      "title": string,\n'
        '      "content": string | array\n'
        "    }\n"
        "  ]\n"
        "}\n"
        "For section content arrays (e.g. services, products, testimonials, pricing, faq, gallery, portfolio), provide items with clear details (e.g. title, description, price/role/quote where relevant)."
    )
    user_prompt = (
        f"Brand Name: {user_input.get('brand_name')}\n"
        f"Building Type: {user_input.get('building_type')}\n"
        f"Goal: {user_input.get('goal')}\n"
        f"Visual Style: {user_input.get('style')}\n"
        f"Theme: {user_input.get('theme')}\n"
        f"Profile: {user_input.get('profile_type')}\n"
        f"Website Plan:\n{plan}\n"
        f"{feedback_context}"
    )
    raw_content = call_llm_json(system_prompt, user_prompt)
    # Validate against WebsiteSpecification pydantic model
    validated = WebsiteSpecification(**raw_content)
    return {"website_content": validated.model_dump()}

def reviewer_node(state: AgentState) -> Dict[str, Any]:
    user_input = state["user_input"]
    website_content = state.get("website_content", {})

    system_prompt = (
        "You are a Quality Assurance Web Editor and Reviewer. "
        "Review the generated website specification to ensure:\n"
        "1. Content supports the user's primary goal and brand profile.\n"
        "2. All requested sections are present and fully fleshed out.\n"
        "3. There are no placeholder texts like 'Lorem ipsum' or empty fields.\n"
        "Return a JSON object with this EXACT schema:\n"
        "{\n"
        '  "approved": boolean,\n'
        '  "issues": ["list of string issues if any, or empty if approved"]\n'
        "}"
    )
    user_prompt = (
        f"Original User Request:\n{user_input}\n\n"
        f"Generated Website Content:\n{website_content}"
    )
    review_result = call_llm_json(system_prompt, user_prompt)
    # Ensure boolean
    approved = bool(review_result.get("approved", True))
    issues = review_result.get("issues", [])
    return {"review_result": {"approved": approved, "issues": issues}}

def route_after_review(state: AgentState) -> str:
    approved = state.get("review_result", {}).get("approved", True)
    retry_count = state.get("retry_count", 0)

    if approved or retry_count >= 1:
        return END
    else:
        # Increment retry_count and go back to content
        state["retry_count"] = retry_count + 1
        return "content"

# Build LangGraph workflow
def build_website_graph():
    builder = StateGraph(AgentState)
    builder.add_node("planner", planner_node)
    builder.add_node("content", content_node)
    builder.add_node("reviewer", reviewer_node)

    builder.add_edge(START, "planner")
    builder.add_edge("planner", "content")
    builder.add_edge("content", "reviewer")
    builder.add_conditional_edges(
        "reviewer",
        route_after_review,
        {"content": "content", END: END}
    )

    return builder.compile()

website_graph = build_website_graph()
