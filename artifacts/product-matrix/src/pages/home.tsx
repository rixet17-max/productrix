import { useState } from "react";
import { useSearchProduct } from "@workspace/api-client-react";
import { Search, Factory, Truck, Ship, PackageOpen, Loader2, BarChart3, Box, DollarSign, Globe, Calendar, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/ui/stat-card";
import { MatrixCard } from "@/components/ui/matrix-card";

export default function Home() {
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const searchMutation = useSearchProduct();

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
          : "h-screen flex-col relative overflow-hidden"
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

      {/* Main Content Area */}
      {hasSearched && (
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 overflow-x-hidden">
          
          {/* Loading State */}
          {searchMutation.isPending && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-border/50 pb-6">
                <div>
                  <div className="h-10 w-72 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
                  <div className="h-5 w-48 bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded-lg mt-3" />
                </div>
                <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-36 bg-card border border-border/50 rounded-2xl animate-pulse" />
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-[420px] bg-card border border-border/50 rounded-2xl flex flex-col overflow-hidden">
                    <div className="h-16 border-b border-border/50 bg-slate-50 dark:bg-slate-900/50 animate-pulse" />
                    <div className="p-6 space-y-6">
                      {[1, 2, 3].map(j => (
                        <div key={j} className="flex gap-4">
                          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse shrink-0" />
                          <div className="flex-1 space-y-3">
                            <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                            <div className="h-3 w-1/4 bg-slate-100 dark:bg-slate-800/50 rounded animate-pulse" />
                            <div className="h-3 w-full bg-slate-100 dark:bg-slate-800/50 rounded animate-pulse mt-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold border border-border">
                  <Calendar className="w-4 h-4" />
                  Data Year: {searchMutation.data.dataYear}
                </div>
              </div>

              {/* Headlines Section */}
              {Array.isArray(searchMutation.data.headlines) && searchMutation.data.headlines.length > 0 && (
                <div style={{ border: "1px solid hsl(214 32% 85%)", borderRadius: "16px", background: "#fff", overflow: "hidden" }}>
                  <div style={{ padding: "16px 24px", borderBottom: "1px solid hsl(214 32% 91%)", background: "hsl(210 40% 97%)", display: "flex", alignItems: "center", gap: "12px" }}>
                    <Newspaper style={{ width: 20, height: 20, color: "hsl(221 83% 53%)", flexShrink: 0 }} />
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 15, color: "hsl(222 47% 11%)", margin: 0 }}>Latest Market Updates</p>
                      <p style={{ fontSize: 12, color: "hsl(215 16% 47%)", margin: 0 }}>Recent news &amp; developments for this product</p>
                    </div>
                  </div>
                  {searchMutation.data.headlines.map((headline, idx) => (
                    <div key={idx} style={{ padding: "14px 24px", borderBottom: idx < searchMutation.data!.headlines!.length - 1 ? "1px solid hsl(214 32% 93%)" : "none", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: 14, color: "hsl(222 47% 11%)", margin: "0 0 4px 0", lineHeight: 1.4 }}>{headline.title}</p>
                        <p style={{ fontSize: 13, color: "hsl(215 16% 47%)", margin: 0, lineHeight: 1.5 }}>{headline.summary}</p>
                      </div>
                      <div style={{ flexShrink: 0, textAlign: "right", minWidth: 90 }}>
                        <span style={{ display: "inline-block", fontSize: 11, fontWeight: 600, color: "hsl(221 83% 53%)", background: "hsl(221 83% 95%)", padding: "3px 10px", borderRadius: 20 }}>{headline.source}</span>
                        <p style={{ fontSize: 11, color: "hsl(215 16% 60%)", margin: "4px 0 0 0" }}>{headline.date}</p>
                      </div>
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
            </div>
          )}
        </main>
      )}
    </div>
  );
}
