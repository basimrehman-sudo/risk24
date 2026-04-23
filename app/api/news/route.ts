import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

export async function GET() {
  try {
    const parser = new Parser();
    const feed = await parser.parseURL('https://feeds.bbci.co.uk/news/world/rss.xml');
    
    const items = feed.items.slice(0, 10).map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      contentSnippet: item.contentSnippet,
      source: 'BBC News'
    }));
    
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
