// SEO-optimized H1 headings for top 20 easy-win keywords
// Generated from Semrush data analysis
// These H1s target the exact search intent
const SEO_H1S: Record<string, string> = {
  "tokyo-seoul": "How Long is the Flight from Tokyo to Seoul?",
  "new-york-dallas": "How Long is the Flight from New York to Dallas?",
  "orlando-denver": "How Long is the Flight from Orlando to Denver?",
  "atlanta-new-orleans": "How Long is the Flight from Atlanta to New Orleans?",
  "london-amsterdam": "How Long is the Flight from London to Amsterdam?",
  "chicago-houston": "How Long is the Flight from Chicago to Houston?",
  "singapore-bangkok": "How Far is the Flight from Singapore to Bangkok?",
  "chicago-las-vegas": "How Long is the Flight from Chicago to Las Vegas?",
  "miami-dallas": "How Long is the Flight from Miami to Dallas?",
  "phx-orlando": "How Long is the Flight from Phoenix to Orlando?",
  "chicago-atlanta": "How Long is the Flight from Chicago to Atlanta?",
  "orlando-boston": "How Long is the Flight from Orlando to Boston?",
  "orlando-san-francisco": "How Long is the Flight from Orlando to San Francisco?",
  "dubai-paris": "How Long is the Flight from Dubai to Paris?",
  "dubai-london": "How Long is the Flight from Dubai to London?",
  "cairo-paris": "How Long is the Flight from Cairo to Paris?",
  "cairo-london": "How Long is the Flight from Cairo to London?",
  "cairo-amman": "How Long is the Flight from Cairo to Amman?",
  "cairo-jeddah": "How Long is the Flight from Cairo to Jeddah?",
  "cairo-dubai": "How Long is the Flight from Cairo to Dubai?",
};

export function getSeoH1(slug: string, originCity: string, destinationCity: string): string {
  const seoH1 = SEO_H1S[slug];
  if (seoH1) return seoH1;
  return `Cheapest Flights from ${originCity} to ${destinationCity}`;
}
