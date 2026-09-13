"use client";

import { useState } from "react";
import { RenderSection, WebsiteSpec } from "./components/sections";

export default function Home() {
  const [brandName, setBrandName] = useState("Nexus Solutions");
  const [buildingType, setBuildingType] = useState("Business");
  const [goal, setGoal] = useState("Get more customers");
  const [style, setStyle] = useState("Modern");
  const [theme, setTheme] = useState("Light");
  const [profileType, setProfileType] = useState("Online business");
  const [focusAreas, setFocusAreas] = useState<string[]>([
    "About",
    "Services",
    "Testimonials",
    "Contact",
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [websiteSpec, setWebsiteSpec] = useState<WebsiteSpec | null>(null);
  const [showJson, setShowJson] = useState(false);

  const focusOptions = [
    "About",
    "Services",
    "Products",
    "Portfolio",
    "Testimonials",
    "Pricing",
    "FAQ",
    "Contact",
    "Gallery",
  ];

  const handleFocusToggle = (opt: string) => {
    setFocusAreas((prev) =>
      prev.includes(opt) ? prev.filter((i) => i !== opt) : [...prev, opt]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) {
      setError("Please enter brand or business name.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      brand_name: brandName.trim(),
      building_type: buildingType,
      goal,
      style,
      theme,
      focus_areas: focusAreas,
      profile_type: profileType,
    };

    try {
      const res = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Generation error");
      }

      const data = await res.json();
      setWebsiteSpec(data);
    } catch (err: any) {
      setError(err.message || "Failed to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Simple Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">AI Website Generator</h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill the option-based form below. The LangGraph 3-node agentic workflow (Planner → Content → Reviewer) generates the validated website spec and renders a live preview.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleGenerate} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Requirement Form</h2>

          {/* 7. Brand / business name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              7. Brand / Business Name (Text Input)
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Enter brand name"
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* 1. What are you building? */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              1. What are you building?
            </label>
            <div className="flex flex-wrap gap-4 text-sm">
              {["Business", "Portfolio", "Restaurant", "Store", "Personal", "Startup"].map((item) => (
                <label key={item} className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="buildingType"
                    value={item}
                    checked={buildingType === item}
                    onChange={() => setBuildingType(item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 2. Primary goal? */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              2. Primary goal?
            </label>
            <div className="flex flex-wrap gap-4 text-sm">
              {[
                "Get more customers",
                "Showcase my work",
                "Sell products",
                "Get bookings",
                "Generate leads",
                "Share information",
              ].map((item) => (
                <label key={item} className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="goal"
                    value={item}
                    checked={goal === item}
                    onChange={() => setGoal(item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 3. Visual style? */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              3. Visual style?
            </label>
            <div className="flex flex-wrap gap-4 text-sm">
              {["Modern", "Minimal", "Premium", "Creative", "Professional", "Elegant"].map((item) => (
                <label key={item} className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="style"
                    value={item}
                    checked={style === item}
                    onChange={() => setStyle(item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 4. Theme? */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              4. Theme?
            </label>
            <div className="flex flex-wrap gap-4 text-sm">
              {["Light", "Dark", "Neutral", "Let AI decide"].map((item) => (
                <label key={item} className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value={item}
                    checked={theme === item}
                    onChange={() => setTheme(item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 5. Website should focus on? (checkboxes) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              5. Website should focus on? (Multi-select)
            </label>
            <div className="flex flex-wrap gap-4 text-sm">
              {focusOptions.map((opt) => (
                <label key={opt} className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={focusAreas.includes(opt)}
                    onChange={() => handleFocusToggle(opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 6. Business profile type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              6. Business profile type
            </label>
            <select
              value={profileType}
              onChange={(e) => setProfileType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              {[
                "Local business",
                "Online business",
                "Freelancer",
                "Creator",
                "Startup",
                "Professional",
                "Organization",
              ].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {error && <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded text-sm">{error}</div>}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded text-sm transition disabled:opacity-50"
            >
              {loading ? "Agent Workflow Running (LangGraph + Groq)..." : "Generate my website"}
            </button>
          </div>
        </form>

        {/* Live Preview Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-lg font-semibold text-gray-800">Live Website Preview</h2>
            {websiteSpec && (
              <button
                type="button"
                onClick={() => setShowJson(!showJson)}
                className="text-xs text-blue-600 hover:underline"
              >
                {showJson ? "Hide JSON Spec" : "View JSON Spec (Pydantic Output)"}
              </button>
            )}
          </div>

          {/* Optional JSON Inspection for Founder Demo */}
          {showJson && websiteSpec && (
            <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-x-auto max-h-96">
              {JSON.stringify(websiteSpec, null, 2)}
            </pre>
          )}

          {/* Rendered Components */}
          {loading ? (
            <div className="py-16 text-center text-gray-500 text-sm">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
              <p>Executing LangGraph Nodes: Planner → Content → Reviewer...</p>
            </div>
          ) : websiteSpec ? (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {websiteSpec.sections.map((sec, idx) => (
                <RenderSection
                  key={idx}
                  section={sec}
                  theme={websiteSpec.site.theme}
                  style={websiteSpec.site.style}
                  siteName={websiteSpec.site.name}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-400 text-sm">
              Submit the form above to see the live rendered website here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
