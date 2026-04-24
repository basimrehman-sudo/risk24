import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const FEEDS = [
  { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', source: 'BBC News' },
  { url: 'https://rss.cnn.com/rss/edition_world.rss', source: 'CNN' },
  { url: 'https://feeds.reuters.com/reuters/worldNews', source: 'Reuters' },
];

const FALLBACK_NEWS = [
  { title: 'Heightened tensions in the Red Sea cause severe shipping delays.', link: 'https://www.reuters.com/world/middle-east/', pubDate: new Date().toISOString(), source: 'Reuters' },
  { title: 'Global cybersecurity mandate issued for critical energy infrastructure.', link: 'https://apnews.com/hub/cybersecurity', pubDate: new Date(Date.now() - 45 * 60000).toISOString(), source: 'AP News' },
  { title: 'Unexpected political shift in West Africa prompts border security review.', link: 'https://www.bbc.com/news/world/africa', pubDate: new Date(Date.now() - 2 * 3600000).toISOString(), source: 'BBC News' },
  { title: 'Supply chain vulnerabilities exposed amid new trade restrictions in Asia.', link: 'https://www.bloomberg.com/markets', pubDate: new Date(Date.now() - 3 * 3600000).toISOString(), source: 'Bloomberg' },
  { title: 'UN Security Council convenes emergency session over escalating conflict.', link: 'https://www.un.org/en/peace/security-council', pubDate: new Date(Date.now() - 5 * 3600000).toISOString(), source: 'UN News' },
];

export async function GET() {
  const parser = new Parser();

  // Try each feed in order, return first one that succeeds
  for (const feed of FEEDS) {
    try {
      const result = await Promise.race([
        parser.parseURL(feed.url),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 5000) // 5 second timeout
        )
      ]);

      const items = (result as any).items.slice(0, 8).map((item: any) => ({
        title: item.title || 'No title',
        link: item.link || '#',
        pubDate: item.pubDate || new Date().toISOString(),
        source: feed.source
      }));

      return NextResponse.json(items);
    } catch (err) {
      console.warn(`RSS feed failed for ${feed.source}:`, err);
      // Try next feed
      continue;
    }
  }

  // All feeds failed — return fallback static news so UI is never blank
  console.warn('All RSS feeds failed, returning fallback news.');
  return NextResponse.json(FALLBACK_NEWS);
}
