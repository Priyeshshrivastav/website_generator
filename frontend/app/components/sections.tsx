import React from "react";

export interface SectionData {
  type: string;
  headline?: string;
  subheadline?: string;
  cta?: string;
  title?: string;
  content?: any;
}

export interface WebsiteSpec {
  site: {
    name: string;
    type: string;
    goal: string;
    style: string;
    theme: string;
  };
  design: {
    mood: string;
    layout: string;
  };
  sections: SectionData[];
}

interface SectionProps {
  section: SectionData;
  theme: string;
  style: string;
  siteName: string;
}

export function HeroSection({ section, theme, style, siteName }: SectionProps) {
  const isDark = theme.toLowerCase().includes("dark");
  return (
    <div className={`py-16 px-6 text-center border-b transition-colors ${
      isDark ? "bg-slate-900 text-white border-slate-800" : "bg-white text-slate-900 border-slate-200"
    }`}>
      <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider mb-4 bg-indigo-500/10 text-indigo-500">
        {siteName}
      </span>
      <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight">
        {section.headline || `Welcome to ${siteName}`}
      </h1>
      {section.subheadline && (
        <p className={`mt-4 text-base md:text-lg max-w-xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          {section.subheadline}
        </p>
      )}
      {section.cta && (
        <div className="mt-8">
          <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow transition">
            {section.cta}
          </button>
        </div>
      )}
    </div>
  );
}

export function AboutSection({ section, theme, siteName }: SectionProps) {
  const isDark = theme.toLowerCase().includes("dark");
  return (
    <div className={`py-12 px-6 border-b ${isDark ? "bg-slate-950 text-white border-slate-800" : "bg-slate-50 text-slate-900 border-slate-200"}`}>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold tracking-tight mb-4 text-indigo-500">
          {section.title || "About Us"}
        </h2>
        {typeof section.content === "string" ? (
          <p className={`leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            {section.content}
          </p>
        ) : Array.isArray(section.content) ? (
          <div className="space-y-3">
            {section.content.map((item, idx) => (
              <p key={idx} className={isDark ? "text-slate-300" : "text-slate-700"}>
                {typeof item === "string" ? item : JSON.stringify(item)}
              </p>
            ))}
          </div>
        ) : (
          <p className={isDark ? "text-slate-300" : "text-slate-700"}>
            Discover more about our journey and commitment at {siteName}.
          </p>
        )}
      </div>
    </div>
  );
}

export function ServicesSection({ section, theme }: SectionProps) {
  const isDark = theme.toLowerCase().includes("dark");
  const items = Array.isArray(section.content) ? section.content : [];
  return (
    <div className={`py-12 px-6 border-b ${isDark ? "bg-slate-900 text-white border-slate-800" : "bg-white text-slate-900 border-slate-200"}`}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">{section.title || "Services"}</h2>
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item: any, idx: number) => (
              <div key={idx} className={`p-5 rounded-xl border ${isDark ? "bg-slate-800/60 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                <h3 className="font-semibold text-lg text-indigo-500 mb-2">
                  {typeof item === "string" ? item : item.name || item.title || `Service ${idx + 1}`}
                </h3>
                {typeof item === "object" && item.description && (
                  <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>{item.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500">{typeof section.content === "string" ? section.content : "High quality services."}</p>
        )}
      </div>
    </div>
  );
}

export function ProductsSection({ section, theme }: SectionProps) {
  const isDark = theme.toLowerCase().includes("dark");
  const items = Array.isArray(section.content) ? section.content : [];
  return (
    <div className={`py-12 px-6 border-b ${isDark ? "bg-slate-950 text-white border-slate-800" : "bg-slate-50 text-slate-900 border-slate-200"}`}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">{section.title || "Featured Products"}</h2>
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item: any, idx: number) => (
              <div key={idx} className={`p-5 rounded-xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                <div className="h-28 bg-indigo-500/10 rounded-lg flex items-center justify-center font-medium text-indigo-400 mb-4">
                  Product Preview
                </div>
                <h3 className="font-semibold">{typeof item === "string" ? item : item.name || item.title}</h3>
                {typeof item === "object" && (
                  <>
                    {item.price && <div className="text-indigo-500 font-bold mt-1 text-sm">{item.price}</div>}
                    {item.description && <p className="text-xs text-slate-500 mt-2">{item.description}</p>}
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500">{typeof section.content === "string" ? section.content : "Explore our products."}</p>
        )}
      </div>
    </div>
  );
}

export function PortfolioSection({ section, theme }: SectionProps) {
  const isDark = theme.toLowerCase().includes("dark");
  const items = Array.isArray(section.content) ? section.content : [];
  return (
    <div className={`py-12 px-6 border-b ${isDark ? "bg-slate-900 text-white border-slate-800" : "bg-white text-slate-900 border-slate-200"}`}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">{section.title || "Portfolio"}</h2>
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item: any, idx: number) => (
              <div key={idx} className={`p-5 rounded-xl border ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                <h3 className="font-semibold text-lg">{typeof item === "string" ? item : item.title || item.name}</h3>
                {typeof item === "object" && item.description && (
                  <p className="text-sm text-slate-400 mt-2">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500">{typeof section.content === "string" ? section.content : "Selected projects."}</p>
        )}
      </div>
    </div>
  );
}

export function TestimonialsSection({ section, theme }: SectionProps) {
  const isDark = theme.toLowerCase().includes("dark");
  const items = Array.isArray(section.content) ? section.content : [];
  return (
    <div className={`py-12 px-6 border-b ${isDark ? "bg-slate-950 text-white border-slate-800" : "bg-slate-50 text-slate-900 border-slate-200"}`}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">{section.title || "What Clients Say"}</h2>
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item: any, idx: number) => (
              <div key={idx} className={`p-5 rounded-xl border italic ${isDark ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-700"}`}>
                <p>"{typeof item === "string" ? item : item.quote || item.feedback || item.text}"</p>
                {typeof item === "object" && (item.author || item.name) && (
                  <p className="mt-3 not-italic font-semibold text-sm text-indigo-500">
                    — {item.author || item.name} {item.role ? `(${item.role})` : ""}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500">{typeof section.content === "string" ? section.content : "Customer testimonials."}</p>
        )}
      </div>
    </div>
  );
}

export function PricingSection({ section, theme }: SectionProps) {
  const isDark = theme.toLowerCase().includes("dark");
  const items = Array.isArray(section.content) ? section.content : [];
  return (
    <div className={`py-12 px-6 border-b ${isDark ? "bg-slate-900 text-white border-slate-800" : "bg-white text-slate-900 border-slate-200"}`}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">{section.title || "Pricing Plans"}</h2>
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item: any, idx: number) => (
              <div key={idx} className={`p-6 rounded-xl border text-center ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                <h3 className="font-semibold text-lg">{typeof item === "string" ? item : item.tier || item.name}</h3>
                {typeof item === "object" && (
                  <>
                    {item.price && <div className="text-2xl font-extrabold text-indigo-500 my-3">{item.price}</div>}
                    {item.features && Array.isArray(item.features) && (
                      <ul className="text-xs text-slate-400 space-y-1 my-3 text-left">
                        {item.features.map((f: string, i: number) => <li key={i}>✓ {f}</li>)}
                      </ul>
                    )}
                  </>
                )}
                <button className="mt-3 w-full py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                  Select
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500">{typeof section.content === "string" ? section.content : "Transparent pricing."}</p>
        )}
      </div>
    </div>
  );
}

export function FAQSection({ section, theme }: SectionProps) {
  const isDark = theme.toLowerCase().includes("dark");
  const items = Array.isArray(section.content) ? section.content : [];
  return (
    <div className={`py-12 px-6 border-b ${isDark ? "bg-slate-950 text-white border-slate-800" : "bg-slate-50 text-slate-900 border-slate-200"}`}>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">{section.title || "Frequently Asked Questions"}</h2>
        {items.length > 0 ? (
          <div className="space-y-4">
            {items.map((item: any, idx: number) => (
              <div key={idx} className={`p-4 rounded-lg border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                <h3 className="font-semibold text-base mb-1">{typeof item === "string" ? item : item.question || item.q}</h3>
                {typeof item === "object" && (item.answer || item.a) && (
                  <p className="text-sm text-slate-400">{item.answer || item.a}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500">{typeof section.content === "string" ? section.content : "Common answers."}</p>
        )}
      </div>
    </div>
  );
}

export function ContactSection({ section, theme, siteName }: SectionProps) {
  const isDark = theme.toLowerCase().includes("dark");
  return (
    <div className={`py-12 px-6 ${isDark ? "bg-slate-900 text-white" : "bg-white text-slate-900"}`}>
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-3">{section.title || "Contact Us"}</h2>
        <p className={`text-sm mb-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          {typeof section.content === "string" ? section.content : `Ready to work together? Get in touch with ${siteName}.`}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className={`px-4 py-2 text-sm rounded-lg border focus:outline-none flex-1 ${
              isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300"
            }`}
          />
          <button className="px-5 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}

export function GallerySection({ section, theme }: SectionProps) {
  const isDark = theme.toLowerCase().includes("dark");
  const items = Array.isArray(section.content) ? section.content : [1, 2, 3, 4];
  return (
    <div className={`py-12 px-6 border-b ${isDark ? "bg-slate-950 text-white border-slate-800" : "bg-slate-50 text-slate-900 border-slate-200"}`}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">{section.title || "Gallery"}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {items.map((_, idx) => (
            <div key={idx} className="h-28 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs text-indigo-400 font-medium">
              Image #{idx + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Section Renderer Component Mapping
export function RenderSection({ section, theme, style, siteName }: SectionProps) {
  switch (section.type.toLowerCase()) {
    case "hero":
      return <HeroSection section={section} theme={theme} style={style} siteName={siteName} />;
    case "about":
      return <AboutSection section={section} theme={theme} style={style} siteName={siteName} />;
    case "services":
      return <ServicesSection section={section} theme={theme} style={style} siteName={siteName} />;
    case "products":
      return <ProductsSection section={section} theme={theme} style={style} siteName={siteName} />;
    case "portfolio":
      return <PortfolioSection section={section} theme={theme} style={style} siteName={siteName} />;
    case "testimonials":
      return <TestimonialsSection section={section} theme={theme} style={style} siteName={siteName} />;
    case "pricing":
      return <PricingSection section={section} theme={theme} style={style} siteName={siteName} />;
    case "faq":
      return <FAQSection section={section} theme={theme} style={style} siteName={siteName} />;
    case "contact":
      return <ContactSection section={section} theme={theme} style={style} siteName={siteName} />;
    case "gallery":
      return <GallerySection section={section} theme={theme} style={style} siteName={siteName} />;
    default:
      return null;
  }
}
