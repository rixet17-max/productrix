import { useState, useEffect } from "react";
import { useSearchProduct } from "@workspace/api-client-react";
import { Search, Factory, Truck, Ship, PackageOpen, Loader2, BarChart3, Box, DollarSign, Globe, Calendar, Newspaper, ExternalLink, FileDown, FileSpreadsheet, ChevronDown, BookOpen, Link, Download } from "lucide-react";
import { exportToPDF, exportToExcel } from "@/lib/export";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/ui/stat-card";
import { MatrixCard } from "@/components/ui/matrix-card";

function SourcesPanel({ sources }: { sources: { name: string; url: string; description: string }[] }) {
  const [open, setOpen] = useState(false);
  if (!sources || sources.length === 0) return null;
  return (
    <div style={{ border: "1px solid hsl(214 32% 85%)", borderRadius: 14, background: "#fff", overflow: "hidden" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 20px", background: open ? "hsl(221 83% 97%)" : "#fff",
          border: "none", cursor: "pointer", transition: "background 0.2s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <BookOpen style={{ width: 15, height: 15, color: "hsl(221 83% 53%)" }} />
          <span style={{ fontWeight: 700, fontSize: 13, color: "hsl(222 47% 11%)" }}>Ver Fuentes</span>
          <span style={{ fontSize: 11, color: "hsl(215 16% 60%)", marginLeft: 2 }}>— {sources.length} fuentes de referencia</span>
        </div>
        <ChevronDown style={{ width: 16, height: 16, color: "hsl(215 16% 60%)", transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s" }} />
      </button>
      {open && (
        <div style={{ borderTop: "1px solid hsl(214 32% 91%)" }}>
          {sources.map((s, i) => (
            <div key={i} style={{ padding: "10px 20px", borderBottom: i < sources.length - 1 ? "1px solid hsl(214 32% 93%)" : "none", display: "flex", alignItems: "flex-start", gap: 12 }}>
              <Link style={{ width: 14, height: 14, color: "hsl(221 83% 53%)", marginTop: 2, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontWeight: 600, fontSize: 13, color: "hsl(221 83% 45%)", textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
                  onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
                >
                  {s.name} <ExternalLink style={{ width: 10, height: 10, display: "inline", marginLeft: 3 }} />
                </a>
                <p style={{ margin: "2px 0 0 0", fontSize: 12, color: "hsl(215 16% 50%)", lineHeight: 1.5 }}>{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HeadlineItem({ title, summary, source, date }: { title: string; summary: string; source: string; date: string }) {
  const [hovered, setHovered] = useState(false);
  const searchUrl = `https://news.google.com/search?q=${encodeURIComponent(title)}`;
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ padding: "10px 20px", borderBottom: "1px solid hsl(214 32% 93%)", cursor: "pointer", transition: "background 0.15s", background: hovered ? "hsl(210 40% 97%)" : "transparent" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          style={{ flex: 1, minWidth: 0, fontWeight: 600, fontSize: 13, color: "hsl(222 47% 11%)", textDecoration: "none", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}
          title={title}
        >
          {title}
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "hsl(221 83% 53%)", background: "hsl(221 83% 95%)", padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap" }}>{source}</span>
          <span style={{ fontSize: 11, color: "hsl(215 16% 60%)", whiteSpace: "nowrap" }}>{date}</span>
          <ExternalLink style={{ width: 11, height: 11, color: "hsl(215 16% 70%)", flexShrink: 0 }} />
        </div>
      </div>
      {hovered && (
        <p style={{ margin: "6px 0 0 0", fontSize: 12, color: "hsl(215 16% 47%)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {summary}
        </p>
      )}
    </div>
  );
}

const LOADING_MESSAGES = [
  "Identificando productores globales...",
  "Analizando flujos de exportación e importación...",
  "Recopilando datos de distribuidores clave...",
  "Calculando estadísticas de mercado global...",
  "Buscando las últimas noticias del sector...",
  "Organizando la información por país...",
  "Preparando tu reporte de inteligencia...",
];

function SearchLoader({ product }: { product: string }) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMsgIdx(i => (i + 1) % LOADING_MESSAGES.length);
    }, 2200);
    return () => clearInterval(msgTimer);
  }, []);

  useEffect(() => {
    setProgress(0);
    const start = Date.now();
    const duration = 18000;
    const frame = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(92, (elapsed / duration) * 92);
      setProgress(pct);
      if (pct < 92) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, []);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-8 animate-in fade-in duration-500">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="hsl(142 76% 90%)" strokeWidth="10" />
          <circle
            cx="64" cy="64" r={radius}
            fill="none"
            stroke="hsl(142 76% 36%)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${strokeDash} ${circumference}`}
            style={{ transition: "stroke-dasharray 0.4s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-green-600">{Math.round(progress)}%</span>
        </div>
      </div>

      <div className="text-center space-y-2 max-w-sm">
        <p className="text-lg font-semibold text-foreground">Analizando: <span className="text-primary capitalize">{product}</span></p>
        <p
          key={msgIdx}
          className="text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-500"
        >
          {LOADING_MESSAGES[msgIdx]}
        </p>
        <p className="text-xs text-muted-foreground/60 mt-2">Esto puede tardar unos segundos — la IA está recopilando datos de comercio global en tiempo real.</p>
      </div>

      <div className="flex gap-1.5 mt-2">
        {LOADING_MESSAGES.map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: i === msgIdx ? 24 : 6,
              background: i === msgIdx ? "hsl(142 76% 36%)" : "hsl(142 76% 80%)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const searchMutation = useSearchProduct();
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    (installPrompt as any).prompt();
    const { outcome } = await (installPrompt as any).userChoice;
    if (outcome === "accepted") setInstalled(true);
    setInstallPrompt(null);
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setHasSearched(true);
    searchMutation.mutate({ data: { productName: query } });
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    setHasSearched(true);
    searchMutation.mutate({ data: { productName: tag } });
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 flex flex-col font-sans">
      {/* Header / Hero Area */}
      <header className={cn(
        "transition-all duration-700 ease-in-out w-full flex justify-center items-center shrink-0",
        hasSearched 
          ? "py-4 border-b border-border/60 bg-card/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm"
          : "py-20 flex-col relative overflow-hidden"
      )}>
        {/* Hero Background */}
        {!hasSearched && (
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img 
              src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
              alt="Data background" 
              className="w-full h-full object-cover opacity-[0.15]" 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
          </div>
        )}

        <div className={cn(
          "relative z-10 w-full max-w-7xl mx-auto px-4 flex transition-all duration-700",
          hasSearched ? "flex-row items-center gap-6" : "flex-col items-center text-center gap-8"
        )}>
          {/* Logo / Title */}
          <div className={cn(
            "flex items-center transition-all duration-700",
            hasSearched ? "shrink-0 gap-3" : "flex-col mb-4 gap-6"
          )}>
            <div className={cn(
              "bg-gradient-to-br from-primary to-primary/80 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25",
              hasSearched ? "w-10 h-10 rounded-xl" : "w-20 h-20"
            )}>
              <Box className={cn(hasSearched ? "w-6 h-6" : "w-10 h-10")} />
            </div>
            <div className="flex flex-col">
              <h1 className={cn(
                "font-display font-bold tracking-tight text-foreground",
                hasSearched ? "text-xl leading-none" : "text-4xl md:text-6xl"
              )}>
                Product<span className="text-primary">Matrix</span>
              </h1>
              {!hasSearched && (
                <p className="text-lg text-muted-foreground max-w-xl mx-auto mt-4 leading-relaxed">
                  Global supply chain intelligence at your fingertips. Discover top producers, distributors, and trade movement instantly.
                </p>
              )}
              {!hasSearched && !installed && (
                <div className="mt-5">
                  <button
                    onClick={handleInstall}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    Instalar App gratis
                  </button>
                </div>
              )}
              {!hasSearched && installed && (
                <p className="mt-4 text-sm text-green-600 font-semibold">✓ App instalada correctamente</p>
              )}
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className={cn(
            "relative w-full transition-all duration-700",
            hasSearched ? "max-w-xl ml-auto" : "max-w-2xl mx-auto"
          )}>
            <Search className={cn(
              "absolute text-muted-foreground z-10",
              hasSearched ? "w-5 h-5 left-4 top-1/2 -translate-y-1/2" : "w-6 h-6 left-6 top-1/2 -translate-y-1/2"
            )} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Enter a product (e.g., Semiconductors, Lithium, Coffee)..."
              className={cn(
                "w-full bg-card border-2 border-border/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300",
                hasSearched 
                  ? "py-2.5 pl-11 pr-24 rounded-xl text-sm shadow-sm" 
                  : "py-5 pl-16 pr-32 rounded-2xl text-lg shadow-xl shadow-black/5"
              )}
            />
            <button 
              type="submit"
              disabled={searchMutation.isPending || !query.trim()}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md shadow-primary/20",
                hasSearched ? "px-4 py-1.5 rounded-lg text-sm" : "px-6 py-3 rounded-xl text-base"
              )}
            >
              {searchMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Analyze"}
            </button>
          </form>
          
          {/* Suggestion Tags */}
          {!hasSearched && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
              <span className="text-sm font-medium text-muted-foreground mr-2">Trending:</span>
              {["Semiconductors", "Lithium", "Coffee Beans", "Electric Vehicles"].map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/80 text-sm font-medium text-slate-700 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all shadow-sm"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Static SEO Content — shown only on landing page */}
      {!hasSearched && (
        <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-16">

          {/* How it works */}
          <section>
            <h2 className="text-2xl font-bold text-center text-foreground mb-8">How ProductMatrix Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { step: "1", title: "Enter Any Product", desc: "Type the name of any commodity, manufactured good, or raw material — from Lithium and Coffee to Semiconductors and Steel." },
                { step: "2", title: "AI-Powered Research", desc: "Our engine instantly queries global trade databases and market intelligence sources to compile a full supply chain profile." },
                { step: "3", title: "Get Your Intelligence Report", desc: "Receive a structured matrix of top producers, distributors, exporting and importing countries, global stats, and the latest market headlines." },
              ].map(({ step, title, desc }) => (
                <div key={step} className="bg-card border border-border/60 rounded-2xl p-6 text-center shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center mx-auto mb-4">{step}</div>
                  <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Features */}
          <section>
            <h2 className="text-2xl font-bold text-center text-foreground mb-8">What You Get With Every Search</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Top Global Producers", desc: "Identify the world's leading companies manufacturing or growing each product, with country of origin and scale of operations." },
                { title: "Key Distributors & Traders", desc: "Discover major commodity traders, wholesalers, and distribution networks that move the product across global markets." },
                { title: "Export & Import Countries", desc: "See which countries dominate global exports and imports, with trade values and percentage share of world trade." },
                { title: "Global Market Stats", desc: "Instantly access global production volumes, total export and import values, and average market prices per unit." },
                { title: "Latest Market Headlines", desc: "Stay informed with 4 recent news headlines covering price movements, supply chain shifts, trade policy changes, and major market developments." },
                { title: "Data Year Reference", desc: "Every report includes the year of the underlying data so you always know how current the intelligence is." },
              ].map(({ title, desc }) => (
                <div key={title} className="bg-card border border-border/60 rounded-xl p-5 shadow-sm flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">{title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold text-center text-foreground mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "What types of products can I search for?", a: "You can search for virtually any traded product — agricultural commodities like coffee, wheat, and cocoa; metals and minerals like lithium, copper, and iron ore; manufactured goods like semiconductors, electric vehicles, and pharmaceuticals; and industrial materials like timber, plastics, and chemicals." },
                { q: "Where does the market intelligence data come from?", a: "ProductMatrix uses advanced AI trained on global trade databases, international commerce reports, UN Comtrade data, World Bank statistics, and industry publications to generate comprehensive market profiles for each product." },
                { q: "How current is the data?", a: "Each report displays the data year so you know how recent the figures are. Our AI draws on knowledge through early 2026 and clearly labels the reference year for every data point." },
                { q: "Who is ProductMatrix designed for?", a: "ProductMatrix is built for supply chain managers, trade analysts, commodity traders, market researchers, business students, journalists, and anyone who needs fast access to global product intelligence without hours of manual research." },
                { q: "Is ProductMatrix free to use?", a: "Yes — ProductMatrix is free to use. Simply enter any product name and receive your full market intelligence report instantly." },
                { q: "Can I use this data for business decisions?", a: "ProductMatrix provides a strong starting point for market research and due diligence. For critical business decisions, we recommend validating key figures with primary sources such as national trade statistics agencies, UN Comtrade, or industry-specific reports." },
              ].map(({ q, a }) => (
                <div key={q} className="bg-card border border-border/60 rounded-xl p-5 shadow-sm">
                  <h3 className="font-semibold text-foreground text-sm mb-2">{q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Footer note */}
          <section className="text-center text-xs text-muted-foreground border-t border-border/50 pt-8">
            <p>ProductMatrix — Global Product Market Intelligence · <a href="https://www.productrix.com" style={{color:"inherit"}}>www.productrix.com</a> · Data sourced from international trade databases and AI-powered market research. For informational purposes only.</p>
          </section>

        </main>
      )}

      {/* Main Content Area */}
      {hasSearched && (
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 overflow-x-hidden">
          
          {/* Loading State */}
          {searchMutation.isPending && <SearchLoader product={query} />}

          {/* Error State */}
          {searchMutation.isError && (
            <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-24 h-24 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
                <PackageOpen className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-display font-bold text-foreground mb-3">Intelligence Unavailable</h2>
              <p className="text-muted-foreground text-lg max-w-lg mb-8">
                We couldn't retrieve valid market data for "{query}". It might be too obscure, or there's an issue with the data stream.
              </p>
              <button 
                onClick={() => setQuery("")} 
                className="px-8 py-3 bg-card border-2 border-border rounded-xl font-medium hover:bg-slate-50 transition-colors shadow-sm"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Success State */}
          {searchMutation.isSuccess && searchMutation.data && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
              {/* Report Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground capitalize">
                    {searchMutation.data.productName}
                  </h2>
                  <p className="text-muted-foreground mt-2 flex items-center gap-2 font-medium">
                    <BarChart3 className="w-5 h-5 text-primary" /> 
                    Global Market Intelligence Report
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold border border-border">
                    <Calendar className="w-4 h-4" />
                    Data Year: {searchMutation.data.dataYear}
                  </div>
                  <button
                    onClick={() => void exportToExcel(searchMutation.data!)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm font-semibold hover:bg-green-100 transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Export Excel
                  </button>
                  <button
                    onClick={() => exportToPDF(searchMutation.data!)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-200 text-red-700 text-sm font-semibold hover:bg-red-100 transition-colors"
                  >
                    <FileDown className="w-4 h-4" />
                    Export PDF
                  </button>
                </div>
              </div>

              {/* Headlines Section */}
              {Array.isArray(searchMutation.data.headlines) && searchMutation.data.headlines.length > 0 && (
                <div style={{ border: "1px solid hsl(214 32% 85%)", borderRadius: "14px", background: "#fff", overflow: "hidden" }}>
                  <div style={{ padding: "10px 20px", borderBottom: "1px solid hsl(214 32% 91%)", background: "hsl(210 40% 97%)", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Newspaper style={{ width: 15, height: 15, color: "hsl(221 83% 53%)", flexShrink: 0 }} />
                    <p style={{ fontWeight: 700, fontSize: 13, color: "hsl(222 47% 11%)", margin: 0 }}>Latest Market Updates</p>
                    <p style={{ fontSize: 11, color: "hsl(215 16% 60%)", margin: 0, marginLeft: 4 }}>— hover a headline for context</p>
                  </div>
                  {searchMutation.data.headlines.slice(0, 4).map((headline, idx, arr) => (
                    <div key={idx} style={{ borderBottom: idx < arr.length - 1 ? "1px solid hsl(214 32% 93%)" : "none" }}>
                      <HeadlineItem
                        title={headline.title}
                        summary={headline.summary}
                        source={headline.source}
                        date={headline.date}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Global Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                  title="Global Production" 
                  value={searchMutation.data.globalStats.globalProduction} 
                  icon={Factory} 
                  delay={0.1} 
                />
                <StatCard 
                  title="Gross Exportation" 
                  value={searchMutation.data.globalStats.grossExportation} 
                  icon={Ship} 
                  delay={0.2} 
                />
                <StatCard 
                  title="Gross Importation" 
                  value={searchMutation.data.globalStats.grossImportation} 
                  icon={PackageOpen} 
                  delay={0.3} 
                />
                <StatCard 
                  title="Average Global Price" 
                  value={searchMutation.data.globalStats.averagePrice} 
                  icon={DollarSign} 
                  delay={0.4} 
                />
              </div>

              {/* Matrices Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <MatrixCard 
                  title="Top Producers" 
                  items={searchMutation.data.producers} 
                  type="company" 
                  icon={Factory} 
                  delay={0.2} 
                />
                <MatrixCard 
                  title="Top Distributors" 
                  items={searchMutation.data.distributors} 
                  type="company" 
                  icon={Truck} 
                  delay={0.3} 
                />
                <MatrixCard 
                  title="Leading Exporters" 
                  items={searchMutation.data.exportingCountries} 
                  type="country" 
                  icon={Ship} 
                  delay={0.4} 
                />
                <MatrixCard 
                  title="Leading Importers" 
                  items={searchMutation.data.importingCountries} 
                  type="country" 
                  icon={Globe} 
                  delay={0.5} 
                />
              </div>

              {/* Sources Panel */}
              {Array.isArray(searchMutation.data.sources) && searchMutation.data.sources.length > 0 && (
                <SourcesPanel sources={searchMutation.data.sources} />
              )}
            </div>
          )}
        </main>
      )}
    </div>
  );
}
