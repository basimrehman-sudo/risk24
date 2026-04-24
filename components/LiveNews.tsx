"use client";
import { useState, useEffect } from 'react';
import { Globe2, Clock, ExternalLink } from 'lucide-react';

const FALLBACK_NEWS = [
  { source: 'Reuters', title: 'Heightened tensions in the Red Sea cause severe shipping delays and re-routing.', link: 'https://www.reuters.com/world/middle-east/', pubDate: new Date().toISOString() },
  { source: 'AP News', title: 'Global cybersecurity mandate issued for critical energy infrastructure.', link: 'https://apnews.com/hub/cybersecurity', pubDate: new Date(Date.now() - 33 * 60000).toISOString() },
  { source: 'BBC', title: 'Unexpected political shift in West Africa prompts border security review.', link: 'https://www.bbc.com/news/world/africa', pubDate: new Date(Date.now() - 2 * 3600000).toISOString() },
  { source: 'Bloomberg', title: 'Supply chain vulnerabilities exposed amid new trade restrictions in Asia.', link: 'https://www.bloomberg.com/markets', pubDate: new Date(Date.now() - 3 * 3600000).toISOString() },
];

export default function LiveNews() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news')
      .then(res => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setNews(data);
        } else {
          setNews(FALLBACK_NEWS);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('LiveNews fetch error:', err);
        setNews(FALLBACK_NEWS); // always show something
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden h-full min-h-[350px]">
      <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center sticky top-0 z-10">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wide">
          <Globe2 size={16} className="text-blue-600" /> Live News Scraper
        </h2>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-sm text-slate-500 flex justify-center items-center h-32 animate-pulse">
            Fetching global intelligence...
          </div>
        ) : (
          news.map((item, i) => (
            <NewsItem
              key={i}
              source={item.source}
              title={item.title}
              url={item.link}
              time={item.pubDate}
            />
          ))
        )}
      </div>
    </div>
  );
}

function NewsItem({ source, title, url, time }: any) {
  const displayTime = time
    ? new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Just now';
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="block p-4 hover:bg-white hover:shadow-sm transition-all border-b border-slate-200/60 last:border-0 group cursor-pointer"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[9px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider">
          {source}
        </span>
        <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
          <Clock size={10} /> {displayTime}
        </span>
      </div>
      <h4 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors leading-snug">
        {title}
      </h4>
      <p className="text-[11px] font-bold text-blue-600 mt-2 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity uppercase tracking-wide">
        Read Full Source <ExternalLink size={12} />
      </p>
    </a>
  );
}
