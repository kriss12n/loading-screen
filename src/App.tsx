import { useEffect, useState, useRef } from 'react';

const wallpapers = [
  '/loading-screen/assets/wallpapers/bg2.webp',
  '/loading-screen/assets/wallpapers/bg3.webp',
  '/loading-screen/assets/wallpapers/bg4.webp',
  '/loading-screen/assets/wallpapers/bg1.webp',
] as const;

const gifs = [
  '/loading-screen/assets/gifs/mumei.gif',
  '/loading-screen/assets/gifs/nico.gif',
  '/loading-screen/assets/gifs/santaills.gif',
  '/loading-screen/assets/gifs/sasha.gif',
] as const;

const kriss = '/loading-screen/assets/gifs/kriss.gif';
const CHANGE_INTERVAL = 10000;
const TRANSITION_DURATION = 1000;

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentElements = useRef<{
    wallpaper: HTMLDivElement | null;
    gif: HTMLImageElement | null;
  }>({
    wallpaper: null,
    gif: null
  });

  // Precargar todas las imágenes
  useEffect(() => {
    const allImages = [...wallpapers, ...gifs, kriss];
    allImages.forEach(src => {
      new Image().src = src;
    });
    
    // Guardar referencia a los elementos iniciales
    currentElements.current.wallpaper = containerRef.current?.querySelector('.wallpaper') ?? null;
    currentElements.current.gif = containerRef.current?.querySelector('.animated-gif') || null;
  }, []);

  useEffect(() => {
    const changeContent = () => {
      if (!containerRef.current) return;

      // Crear elementos para el próximo contenido
      const nextWallpaper = document.createElement('div');
      const nextGif = document.createElement('img');
      
      // Configurar elementos nuevos
      nextWallpaper.className = 'wallpaper absolute inset-0 bg-cover bg-center';
      nextWallpaper.style.backgroundImage = `url(${wallpapers[nextIndex % wallpapers.length]})`;
      nextWallpaper.style.opacity = '0';
      nextWallpaper.style.zIndex = '1';
      nextWallpaper.style.transition = `opacity ${TRANSITION_DURATION}ms ease-in-out`;
      
      nextGif.className = 'animated-gif absolute left-6/12 top-11/12 -translate-x-1/2 -translate-y-1/2 w-40 -scale-x-100 pointer-events-none z-20';
      nextGif.src = gifs[nextIndex % gifs.length];
      nextGif.alt = 'Next GIF';
      nextGif.style.opacity = '0';
      nextGif.style.transition = `opacity ${TRANSITION_DURATION}ms ease-in-out`;
      
      // Agregar nuevos elementos al DOM
      containerRef.current.appendChild(nextWallpaper);
      containerRef.current.appendChild(nextGif);
      
      // Iniciar fade-out en elementos actuales
      if (currentElements.current.wallpaper) {
        currentElements.current.wallpaper.style.opacity = '0';
      }
      if (currentElements.current.gif) {
        currentElements.current.gif.style.opacity = '0';
      }
      
      // Forzar reflow para que la transición funcione
      void nextWallpaper.offsetHeight;
      void nextGif.offsetHeight;
      
      // Hacer fade-in del nuevo contenido
      nextWallpaper.style.opacity = '1';
      nextGif.style.opacity = '1';
      
      // Después de la transición, limpiar
      setTimeout(() => {
        // Eliminar elementos antiguos específicamente
        if (currentElements.current.wallpaper && currentElements.current.wallpaper.parentNode) {
          containerRef.current.removeChild(currentElements.current.wallpaper);
        }
        if (currentElements.current.gif && currentElements.current.gif.parentNode) {
          containerRef.current.removeChild(currentElements.current.gif);
        }
        
        // Actualizar referencias a los elementos actuales
        currentElements.current = {
          wallpaper: nextWallpaper,
          gif: nextGif
        };
        
        // Cambiar el alt del nuevo GIF
        nextGif.alt = 'Current GIF';
        
        // Actualizar índices
        setCurrentIndex(nextIndex);
        setNextIndex((nextIndex + 1) % Math.max(wallpapers.length, gifs.length));
      }, TRANSITION_DURATION);
    };

    const interval = setInterval(changeContent, CHANGE_INTERVAL);
    return () => clearInterval(interval);
  }, [nextIndex, currentIndex]); // Añadimos currentIndex a las dependencias

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden">
      {/* Fondo inicial */}
      <div
        className="wallpaper absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${wallpapers[currentIndex % wallpapers.length]})`,
          zIndex: 0,
          transition: `opacity ${TRANSITION_DURATION}ms ease-in-out`
        }}
      />
      
      {/* Kriss (siempre visible) */}
      <img
        src={kriss}
        alt="Kriss"
        className="absolute left-7/12 top-11/12 -translate-x-1/2 -translate-y-1/2 w-48 z-30 pointer-events-none"
      />
      
      {/* GIF inicial */}
      <img
        className="animated-gif absolute left-6/12 top-11/12 -translate-x-1/2 -translate-y-1/2 w-40 -scale-x-100 pointer-events-none z-20"
        src={gifs[currentIndex % gifs.length]}
        alt="Current GIF"
        style={{
          transition: `opacity ${TRANSITION_DURATION}ms ease-in-out`
        }}
      />
    </div>
  );
}

export default App;