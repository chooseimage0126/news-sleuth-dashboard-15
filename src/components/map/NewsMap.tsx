import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { NewsItem } from '../../types/news';
import { useTheme } from 'next-themes';

// Initialize Mapbox
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

interface NewsMapProps {
  news: NewsItem[];
}

const NewsMap = ({ news }: NewsMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng] = useState(-40);
  const [lat] = useState(35);
  const [zoom] = useState(1.5);
  const { theme } = useTheme();

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: theme === 'dark' 
        ? 'mapbox://styles/mapbox/dark-v11'
        : 'mapbox://styles/mapbox/light-v11',
      center: [lng, lat],
      zoom: zoom
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, [lng, lat, zoom]);

  // Update map style when theme changes
  useEffect(() => {
    if (!map.current) return;
    
    map.current.setStyle(
      theme === 'dark'
        ? 'mapbox://styles/mapbox/dark-v11'
        : 'mapbox://styles/mapbox/light-v11'
    );
  }, [theme]);

  // Add markers for news locations
  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    const markers = document.getElementsByClassName('mapboxgl-marker');
    while (markers[0]) {
      markers[0].remove();
    }

    // Add new markers
    news.forEach((story) => {
      // For demo purposes, generate random coordinates
      // In a real app, you'd use geocoding or actual coordinates from the news data
      const randomLng = Math.random() * 360 - 180;
      const randomLat = Math.random() * 170 - 85;

      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2 max-w-xs">
            <h3 class="font-semibold text-sm mb-1">${story.title}</h3>
            <a href="${story.url}" 
               target="_blank" 
               rel="noopener noreferrer"
               class="text-xs text-blue-500 hover:text-blue-700"
            >
              Read more →
            </a>
          </div>
        `);

      new mapboxgl.Marker({
        color: theme === 'dark' ? '#9b87f5' : '#6E59A5'
      })
        .setLngLat([randomLng, randomLat])
        .setPopup(popup)
        .addTo(map.current!);
    });
  }, [news, theme]);

  return (
    <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors duration-200 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        News Locations
      </h2>
      <div
        ref={mapContainer}
        className="w-full h-[400px] rounded-lg overflow-hidden"
      />
    </div>
  );
};

export default NewsMap;