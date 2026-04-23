"use client";
import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Next.js
if (typeof window !== 'undefined') {
  delete ((L.Icon.Default.prototype as any)._getIconUrl);
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

const incidents = [
    { pos: [30.12, 67.01] as [number, number], title: "IED Attack Prevented", loc: "Sibi", color: "#ef4444" },
    { pos: [30.73, 66.62] as [number, number], title: "Tribal Clashes", loc: "Qila Abdullah", color: "#f97316" },
    { pos: [31.52, 74.35] as [number, number], title: "Fire Hazard", loc: "Lahore", color: "#f59e0b" },
    { pos: [24.86, 67.00] as [number, number], title: "Protest Rally", loc: "Karachi", color: "#3b82f6" },
    { pos: [32.96, 70.14] as [number, number], title: "Target Killing", loc: "Wana", color: "#ef4444" },
    { pos: [33.72, 73.04] as [number, number], title: "Crime Abuse", loc: "Rawalpindi", color: "#f59e0b" },
];

export default function MapLayer() {
  return (
    <MapContainer 
      center={[30.3753, 69.3451]} 
      zoom={5} 
      style={{ height: '100%', width: '100%', borderRadius: '0.5rem', zIndex: 0 }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      {incidents.map((inc, i) => (
        <CircleMarker 
          key={i} 
          center={inc.pos} 
          radius={8} 
          pathOptions={{ color: inc.color, fillColor: inc.color, fillOpacity: 0.6, weight: 2 }}
        >
          <Popup className="rounded-lg">
            <div className="font-bold text-slate-800">{inc.title}</div>
            <div className="text-sm text-slate-500 mt-1">{inc.loc}</div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
