from typing import List, Optional, Union, Any, Dict
from pydantic import BaseModel, Field

class GenerateRequest(BaseModel):
    brand_name: str = Field(..., description="Brand or business name")
    building_type: str = Field(..., description="What are you building?")
    goal: str = Field(..., description="Primary goal")
    style: str = Field(..., description="Visual style")
    theme: str = Field(..., description="Theme preference")
    focus_areas: List[str] = Field(default_factory=list, description="Sections to focus on")
    profile_type: str = Field(..., description="Business profile type")

class SiteMeta(BaseModel):
    name: str
    type: str
    goal: str
    style: str
    theme: str

class DesignMeta(BaseModel):
    mood: str
    layout: str

class SectionSpec(BaseModel):
    type: str
    headline: Optional[str] = None
    subheadline: Optional[str] = None
    cta: Optional[str] = None
    title: Optional[str] = None
    content: Optional[Union[str, List[Any], Dict[str, Any]]] = None

class WebsiteSpecification(BaseModel):
    site: SiteMeta
    design: DesignMeta
    sections: List[SectionSpec]

class ReviewResult(BaseModel):
    approved: bool
    issues: List[str] = Field(default_factory=list)

class WebsitePlan(BaseModel):
    site_type: str
    sections: List[str]
    tone: str
    design_mood: str
    cta_style: str
