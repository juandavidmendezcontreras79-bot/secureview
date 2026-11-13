import React, { useState, useRef, useEffect } from 'react';
import { 
  Moon, 
  Sun, 
  AlertTriangle, 
  Eye, 
  ShieldAlert, 
  Sliders, 
  Video, 
  Maximize2, 
  Scan, 
  Cpu, 
  Play, 
  Square, 
  RefreshCw, 
  Sparkles, 
  Clock, 
  Database,
  Check,
  PlayCircle,
  Building,
  Zap,
  CheckCircle,
  Smartphone
} from 'lucide-react';
import { HERO_IMAGE, LONG_DISTANCE_4K, SHORT_DISTANCE_4K, BUILDING_SURVEILLANCE_4K, STATUE_OF_LIBERTY_CCTV } from '../data';

export default function InteractiveShowcase() {
  // Main Navigation Mode
  const [activeMode, setActiveMode] = useState<'comparador' | 'alcance' | 'grabador'>('comparador');

  // --- MODE 1: COMPARADOR STATE ---
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<'night' | 'day' | 'building'>('building');
  const containerRef = useRef<HTMLDivElement>(null);

  // --- MODE 2: ALCANCE STATE ---
  const [distanceMode, setDistanceMode] = useState<'corta' | 'larga' | 'edificio' | 'libertad'>('edificio');
  const [zoomScale, setZoomScale] = useState(1.5);
  const [centerOnTarget, setCenterOnTarget] = useState(true);

  // --- MODE 3: GRABADOR & FLUIDEZ STATE ---
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [fluidity, setFluidity] = useState<15 | 60 | 120>(120);
  const [activeClipId, setActiveClipId] = useState<number>(1);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const [simulatedClips, setSimulatedClips] = useState([
    { id: 1, name: 'Edificio Corporativo - Vista 120 FPS', time: 'Hace 2 min', duration: '15s', size: '120 MB', type: 'edificio', fps: 120 },
    { id: 2, name: 'Estatua de la Libertad - EE.UU. Zoom 4K', time: 'Hace 15 min', duration: '30s', size: '240 MB', type: 'libertad', fps: 120 },
    { id: 3, name: 'Acceso Vehicular - Patente 4K', time: 'Hace 45 min', duration: '20s', size: '95 MB', type: 'larga', fps: 60 },
    { id: 4, name: 'Reconocimiento Facial de Entrada', time: 'Hace 2 horas', duration: '10s', size: '22 MB', type: 'corta', fps: 60 }
  ]);

  // Handle Dragging for Slider (Mode 1)
  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handleMove(e.touches[0].clientX);
  };

  // Recording Timer effect (Mode 3)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      // Stopping recording -> Save simulated clip
      const newClip = {
        id: Date.now(),
        name: `Grabación Manual_${simulatedClips.length + 1} (${fluidity} FPS)`,
        time: 'Ahora mismo',
        duration: `${recordingTime}s`,
        size: `${Math.round(recordingTime * (fluidity === 120 ? 4.8 : fluidity === 60 ? 2.4 : 0.6))} MB`,
        type: distanceMode === 'edificio' ? 'edificio' : distanceMode === 'larga' ? 'larga' : distanceMode === 'libertad' ? 'libertad' : 'corta',
        fps: fluidity
      };
      setSimulatedClips([newClip, ...simulatedClips]);
      setActiveClipId(newClip.id);
      setIsRecording(false);
      setShowSavedFeedback(true);
      setTimeout(() => setShowSavedFeedback(false), 3000);
    } else {
      setIsRecording(true);
      setRecordingTime(0);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Determine current image for elements based on selected clip/settings
  const getRecorderImage = () => {
    const clip = simulatedClips.find(c => c.id === activeClipId);
    if (!clip) return BUILDING_SURVEILLANCE_4K;
    if (clip.type === 'edificio') return BUILDING_SURVEILLANCE_4K;
    if (clip.type === 'libertad') return STATUE_OF_LIBERTY_CCTV;
    return clip.type === 'corta' ? SHORT_DISTANCE_4K : LONG_DISTANCE_4K;
  };

  // Helper to select proper glide class
  const getGlideClass = () => {
    if (fluidity === 120) return 'animate-glide-hyper';
    if (fluidity === 60) return 'animate-glide-smooth';
    return 'animate-glide-choppy';
  };

  return (
    <section className="py-24 bg-brand-blue-950 text-white relative overflow-hidden" id="demostracion">
      {/* Decorative radial gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue-500/10 border border-brand-blue-500/20 px-3.5 py-1 text-xs font-mono font-bold tracking-wider text-brand-blue-300 uppercase">
            <Zap className="h-3.5 w-3.5 text-brand-blue-400 animate-bounce" /> Innovación 4K & 120 FPS
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Laboratorio Interactivo de Ultra Fluidez
          </h2>
          <p className="font-sans text-gray-400 text-base">
            Compara la nitidez de edificios, experimenta la respuesta instantánea a **120 FPS** de refresco continuo y simula grabaciones 4K profesionales directo en disco.
          </p>
        </div>

        {/* Triple Mode Navigation Bar */}
        <div className="flex justify-center mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-brand-blue-900/40 p-1.5 rounded-2xl border border-brand-blue-800/40 max-w-2xl w-full">
            <button
              onClick={() => setActiveMode('comparador')}
              className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-sans text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeMode === 'comparador'
                  ? 'bg-brand-blue-500 text-white shadow-lg shadow-brand-blue-500/20'
                  : 'text-brand-blue-300 hover:text-white hover:bg-brand-blue-900/30'
              }`}
              id="btn-mode-comparador"
            >
              <Sliders className="h-4 w-4" />
              Comparador 720p vs 4K
            </button>
            <button
              onClick={() => setActiveMode('alcance')}
              className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-sans text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeMode === 'alcance'
                  ? 'bg-brand-blue-500 text-white shadow-lg shadow-brand-blue-500/20'
                  : 'text-brand-blue-300 hover:text-white hover:bg-brand-blue-900/30'
              }`}
              id="btn-mode-alcance"
            >
              <Maximize2 className="h-4 w-4" />
              Lentes de Edificios 4K
            </button>
            <button
              onClick={() => setActiveMode('grabador')}
              className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-sans text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeMode === 'grabador'
                  ? 'bg-brand-blue-500 text-white shadow-lg shadow-brand-blue-500/20'
                  : 'text-brand-blue-300 hover:text-white hover:bg-brand-blue-900/30'
              }`}
              id="btn-mode-grabador"
            >
              <Video className="h-4 w-4" />
              Grabadora & Video 120 FPS
            </button>
          </div>
        </div>

        {/* ==========================================
            MODE 1: COMPARADOR (SLIDER)
            ========================================== */}
        {activeMode === 'comparador' && (
          <div className="space-y-8 animate-fade-in">
            {/* Mode Selector Tabs inside Comparador */}
            <div className="flex justify-center">
              <div className="inline-flex flex-wrap gap-1 rounded-xl bg-white/5 border border-white/10 p-1 backdrop-blur-sm">
                <button
                  onClick={() => {
                    setActiveTab('building');
                    setSliderPosition(50);
                  }}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 font-sans text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'building'
                      ? 'bg-brand-blue-500 text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  id="tab-building"
                >
                  <Building className="h-3.5 w-3.5" />
                  Edificio Corporativo 4K
                </button>
                <button
                  onClick={() => {
                    setActiveTab('night');
                    setSliderPosition(50);
                  }}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 font-sans text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'night'
                      ? 'bg-brand-blue-500 text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  id="tab-night"
                >
                  <Moon className="h-3.5 w-3.5" />
                  Visión Nocturna Color
                </button>
                <button
                  onClick={() => {
                    setActiveTab('day');
                    setSliderPosition(50);
                  }}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 font-sans text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'day'
                      ? 'bg-brand-blue-500 text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  id="tab-day"
                >
                  <Sun className="h-3.5 w-3.5" />
                  Área de Acceso Diurno
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-8">
                <div
                  ref={containerRef}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                  className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl select-none cursor-ew-resize group"
                  id="slider-container"
                >
                  {/* --- LEFT SIDE: OLD LOW-RES CAMERA (BACKGROUND) --- */}
                  <div className="absolute inset-0 z-10 w-full h-full bg-black overflow-hidden">
                    <img
                      src={
                        activeTab === 'building' 
                          ? BUILDING_SURVEILLANCE_4K 
                          : activeTab === 'night' 
                            ? HERO_IMAGE 
                            : SHORT_DISTANCE_4K
                      }
                      alt="Simulación de cámara estándar"
                      className={`h-full w-full object-cover select-none pointer-events-none scale-105 filter ${
                        activeTab === 'night'
                          ? 'blur-[4px] grayscale brightness-40 contrast-125 saturate-50'
                          : 'blur-[3px] brightness-75 contrast-90 saturate-75'
                      }`}
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Simulated Noise Pattern Overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,black_90%)] pointer-events-none" />
                    <div className="absolute inset-0 opacity-45 mix-blend-screen bg-repeat pointer-events-none" 
                         style={{
                           backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")"
                         }}
                    />

                    {/* Left Side Label (Old Cam) */}
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded bg-red-600/95 border border-red-500/50 px-3 py-1 font-mono text-[10px] font-bold text-white uppercase tracking-wider">
                      <AlertTriangle className="h-3.5 w-3.5 animate-pulse" /> Analógico Antiguo 720p (Borroso y Choppy)
                    </div>
                  </div>

                  {/* --- RIGHT SIDE: SECUREVIEW 4K CAMERA (FOREGROUND CLIP) --- */}
                  <div
                    className="absolute inset-0 z-20 h-full overflow-hidden transition-all duration-75"
                    style={{ width: `${sliderPosition}%` }}
                  >
                    <div className="absolute inset-0 h-full w-[100cqi] min-w-[760px] lg:min-w-[1200px]">
                      <img
                        src={
                          activeTab === 'building' 
                            ? BUILDING_SURVEILLANCE_4K 
                            : activeTab === 'night' 
                              ? HERO_IMAGE 
                              : SHORT_DISTANCE_4K
                        }
                        alt="SecureView Pro 4K"
                        className={`h-full w-full object-cover select-none pointer-events-none scale-105 filter ${
                          activeTab === 'night'
                            ? 'brightness-110 contrast-105 saturate-100'
                            : 'brightness-100 contrast-100 saturate-100'
                        }`}
                        referrerPolicy="no-referrer"
                      />
                      {/* Subtle technical HUD overlay on right side */}
                      <div className="absolute inset-0 border border-brand-blue-500/20 pointer-events-none" />
                      
                      {/* Text tag */}
                      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 rounded-md bg-brand-blue-900/90 border border-brand-blue-500/40 px-3 py-1.5 font-sans text-xs font-semibold text-white backdrop-blur-md">
                        <Zap className="h-3.5 w-3.5 text-brand-blue-400 animate-pulse" />
                        <span>
                          {activeTab === 'building' 
                            ? 'Lentes 4K UHD para fachadas completas' 
                            : activeTab === 'night' 
                              ? 'Sensor nocturno de gran apertura' 
                              : 'Reconocimiento facial a 120 FPS'}
                        </span>
                      </div>
                    </div>

                    {/* Right Side Label (New SecureView 4K Cam) */}
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded bg-brand-blue-500/95 border border-brand-blue-400/50 px-3 py-1 font-mono text-[10px] font-bold text-white uppercase tracking-wider">
                      <Eye className="h-3.5 w-3.5" /> SECUREVIEW ULTRA 4K (120 FPS FLUIDEZ)
                    </div>
                  </div>

                  {/* --- CENTRAL INTERACTIVE HANDLE SLIDER --- */}
                  <div
                    className="absolute top-0 bottom-0 z-30 w-1 bg-white cursor-ew-resize select-none"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    {/* Pulse Button */}
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-12 w-12 rounded-full bg-brand-blue-500 border-2 border-white flex items-center justify-center shadow-[0_0_20px_rgba(30,96,145,0.8)] text-white hover:scale-110 transition-transform">
                      <Sliders className="h-5 w-5 rotate-90" />
                    </div>
                    {/* Arrow hint indicators */}
                    <span className="absolute -left-12 top-1/2 -translate-y-1/2 font-sans font-extrabold text-[10px] text-white/80 select-none uppercase tracking-wide">720p</span>
                    <span className="absolute left-12 top-1/2 -translate-y-1/2 font-sans font-extrabold text-[10px] text-white/80 select-none uppercase tracking-wide">4K UHD</span>
                  </div>
                </div>
                
                <p className="mt-4 text-center font-mono text-xs text-gray-500">
                  * Desliza horizontalmente para ver la diferencia extrema entre tecnología antigua y Ultra HD 120 FPS.
                </p>
              </div>

              {/* Right explanation panel */}
              <div className="lg:col-span-4 space-y-6">
                <h3 className="font-display text-2xl font-bold text-white flex items-center gap-2">
                  <Building className="h-6 w-6 text-brand-blue-400" />
                  Estructuras de Alto Nivel
                </h3>
                
                {activeTab === 'building' ? (
                  <div className="space-y-4">
                    <p className="font-sans text-gray-300 text-sm leading-relaxed">
                      El monitoreo de **grandes edificios corporativos o residenciales** requiere lentes ópticos capaces de captar detalles a distancias masivas sin perder definición en los bordes.
                    </p>
                    <div className="space-y-3 bg-brand-blue-900/30 p-4 rounded-xl border border-brand-blue-800/40">
                      <h4 className="font-sans text-xs font-bold text-brand-blue-300 uppercase tracking-wider">Ventajas de Fachadas 4K</h4>
                      <ul className="space-y-2 text-xs text-gray-300 font-sans">
                        <li className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-brand-blue-400 flex-shrink-0" /> Control total de ventanas y accesos lejanos.</li>
                        <li className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-brand-blue-400 flex-shrink-0" /> Análisis automático de patrullaje de perímetros.</li>
                        <li className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-brand-blue-400 flex-shrink-0" /> Integración con sistemas de alarma inteligente.</li>
                      </ul>
                    </div>
                  </div>
                ) : activeTab === 'night' ? (
                  <div className="space-y-4">
                    <p className="font-sans text-gray-300 text-sm leading-relaxed">
                      Las cámaras de seguridad baratas pierden color y agregan estática en la noche. Nuestro procesador con IA limpia el ruido del sensor entregando color nítido.
                    </p>
                    <div className="space-y-3 bg-brand-blue-900/30 p-4 rounded-xl border border-brand-blue-800/40">
                      <h4 className="font-sans text-xs font-bold text-brand-blue-300 uppercase tracking-wider">Características de Visión Nocturna</h4>
                      <ul className="space-y-2 text-xs text-gray-300 font-sans">
                        <li className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-brand-blue-400 flex-shrink-0" /> Iluminadores LEDs cálidos de activación rápida.</li>
                        <li className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-brand-blue-400 flex-shrink-0" /> Rango infrarrojo profundo hasta de 40 metros.</li>
                        <li className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-brand-blue-400 flex-shrink-0" /> Reconocimiento de facciones sin sobreexposición.</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="font-sans text-gray-300 text-sm leading-relaxed">
                      La alta tasa de refresco a **120 FPS** garantiza que incluso los movimientos más rápidos (vehículos huyendo o personas corriendo) se graben sin estelas de barrido borrosas.
                    </p>
                    <div className="space-y-3 bg-brand-blue-900/30 p-4 rounded-xl border border-brand-blue-800/40">
                      <h4 className="font-sans text-xs font-bold text-brand-blue-300 uppercase tracking-wider">Por qué elegir 120 FPS</h4>
                      <ul className="space-y-2 text-xs text-gray-300 font-sans">
                        <li className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-brand-blue-400 flex-shrink-0" /> Cero retraso en la transmisión en vivo.</li>
                        <li className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-brand-blue-400 flex-shrink-0" /> Captura perfecta cuadro por cuadro para peritajes.</li>
                        <li className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-brand-blue-400 flex-shrink-0" /> Máxima fluidez ideal para cámaras PTZ motorizadas.</li>
                      </ul>
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <ShieldAlert className="h-5 w-5 text-brand-blue-400 flex-shrink-0" />
                  <p className="font-sans text-xs text-gray-400 leading-normal">
                    La resolución 4K a 120 FPS es ideal para bancos, edificios corporativos de gran escala, condominios residenciales de alto estándar y zonas industriales críticas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            MODE 2: LENTES DE EDIFICIOS 4K (DIFERENCIAS DE DISTANCIA)
            ========================================== */}
        {activeMode === 'alcance' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center animate-fade-in" id="alcance-container">
            {/* Left side: Interactive image zoom preview */}
            <div className="lg:col-span-8 space-y-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/15 bg-black/60 shadow-2xl">
                
                {/* Image Container with Zoom effect */}
                <div 
                  className="w-full h-full transition-transform duration-500 ease-out overflow-hidden"
                  style={{
                    transform: `scale(${zoomScale})`,
                    transformOrigin: !centerOnTarget 
                      ? '50% 50%' 
                      : distanceMode === 'edificio'
                        ? '55% 45%' // Center on central building architectural details
                        : distanceMode === 'corta' 
                          ? '50% 25%' // Center on visitor face area
                          : distanceMode === 'larga'
                            ? '73% 36%'  // Center on car license plate area
                            : '48% 30%'  // Center on Statue of Liberty crown/face area
                  }}
                >
                  <img
                    src={
                      distanceMode === 'edificio' 
                        ? BUILDING_SURVEILLANCE_4K 
                        : distanceMode === 'corta' 
                          ? SHORT_DISTANCE_4K 
                          : distanceMode === 'larga'
                            ? LONG_DISTANCE_4K
                            : STATUE_OF_LIBERTY_CCTV
                    }
                    alt="Simulador de distancia 4K"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Simulated CCTV HUD Overlay */}
                <div className="absolute inset-0 pointer-events-none border border-brand-blue-500/20" />
                <div className="absolute inset-4 pointer-events-none flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="rounded bg-brand-blue-950/85 border border-brand-blue-500/40 px-2.5 py-1 text-[10px] font-mono text-brand-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Scan className="h-3 w-3 text-brand-blue-400" />
                      {distanceMode === 'edificio' 
                        ? 'LENTE PANORÁMICO DE EDIFICIOS (4.0mm)' 
                        : distanceMode === 'corta' 
                          ? 'LENTE CORTA DISTANCIA (2.8mm)' 
                          : distanceMode === 'larga'
                            ? 'LENTE EXTREMA LARGA DISTANCIA (12mm)'
                            : 'LENTE ULTRA TELEOBJETIVO (50mm)'}
                    </div>
                    <div className="text-right font-mono text-[10px] text-brand-blue-400 bg-brand-blue-950/85 px-2 py-1 rounded border border-brand-blue-900/50">
                      FOCAL RATE | ZOOM: {zoomScale.toFixed(1)}x
                    </div>
                  </div>

                  {/* AI target lock bounding box depending on distanceMode */}
                  {centerOnTarget && (
                    <div 
                      className={`absolute border-2 border-brand-blue-400 bg-brand-blue-500/10 pointer-events-auto rounded transition-all duration-500 ${
                        distanceMode === 'edificio'
                          ? 'w-40 h-28 left-[35%] top-[30%]'
                          : distanceMode === 'corta'
                            ? 'w-24 h-24 left-1/2 -translate-x-1/2 top-[18%]'
                            : distanceMode === 'larga'
                              ? 'w-32 h-16 right-[15%] top-[25%]'
                              : 'w-24 h-24 left-[38%] top-[18%]'
                      }`}
                    >
                      {/* Bounding box technical overlay */}
                      <span className="absolute -top-5 left-0 bg-brand-blue-600 text-white font-mono text-[8px] font-bold px-1 py-0.5 rounded uppercase tracking-widest shadow-md">
                        {distanceMode === 'edificio' 
                          ? 'ID: FACHADA_PRINCIPAL_OK' 
                          : distanceMode === 'corta' 
                            ? 'ID: VISITANTE_CONFIRMADO' 
                            : distanceMode === 'larga'
                              ? 'LPR: PATENTE_VEHICULO'
                              : 'TRACK: EST_DE_LA_LIBERTAD'}
                      </span>
                      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white" />
                      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white" />
                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white" />
                    </div>
                  )}

                  <div className="flex justify-between items-end">
                    <div className="font-mono text-[9px] text-gray-400 bg-black/50 px-2 py-0.5 rounded">
                      CÁM_ESTRUCTURA_01 | {distanceMode === 'libertad' ? 'CÁM_INTERCONTINENTAL_09' : 'CÁM_EDIFICIO_01'} | 4K @ 120fps
                    </div>
                    <div className="font-mono text-[9px] text-gray-400 bg-black/50 px-2 py-0.5 rounded">
                      ULTRA DETALLE ACTIVO
                    </div>
                  </div>
                </div>

              </div>

              {/* Interactive Controls Panel */}
              <div className="bg-brand-blue-900/40 p-5 rounded-2xl border border-brand-blue-800/40 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  
                  {/* Distance Switcher */}
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        setDistanceMode('edificio');
                        setZoomScale(1.5);
                      }}
                      className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-sans text-xs font-bold transition-all border cursor-pointer ${
                        distanceMode === 'edificio'
                          ? 'bg-brand-blue-500 text-white border-brand-blue-400/40 shadow-md'
                          : 'bg-brand-blue-950/80 text-brand-blue-300 border-brand-blue-900 hover:text-white'
                      }`}
                      id="btn-lente-edificio"
                    >
                      <Building className="h-3.5 w-3.5" /> Edificios y Fachadas
                    </button>
                    <button
                      onClick={() => {
                        setDistanceMode('corta');
                        setZoomScale(2);
                      }}
                      className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-sans text-xs font-bold transition-all border cursor-pointer ${
                        distanceMode === 'corta'
                          ? 'bg-brand-blue-500 text-white border-brand-blue-400/40 shadow-md'
                          : 'bg-brand-blue-950/80 text-brand-blue-300 border-brand-blue-900 hover:text-white'
                      }`}
                      id="btn-lente-corta"
                    >
                      Corta Distancia (5m)
                    </button>
                    <button
                      onClick={() => {
                        setDistanceMode('larga');
                        setZoomScale(2);
                      }}
                      className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-sans text-xs font-bold transition-all border cursor-pointer ${
                        distanceMode === 'larga'
                          ? 'bg-brand-blue-500 text-white border-brand-blue-400/40 shadow-md'
                          : 'bg-brand-blue-950/80 text-brand-blue-300 border-brand-blue-900 hover:text-white'
                      }`}
                      id="btn-lente-larga"
                    >
                      Larga Distancia (50m)
                    </button>
                    <button
                      onClick={() => {
                        setDistanceMode('libertad');
                        setZoomScale(2.5);
                      }}
                      className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-sans text-xs font-bold transition-all border cursor-pointer ${
                        distanceMode === 'libertad'
                          ? 'bg-brand-blue-500 text-white border-brand-blue-400/40 shadow-md'
                          : 'bg-brand-blue-950/80 text-brand-blue-300 border-brand-blue-900 hover:text-white'
                      }`}
                      id="btn-lente-libertad"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-brand-blue-400 animate-pulse" /> Estatua de la Libertad
                    </button>
                  </div>

                  {/* Focus Toggle */}
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <span className="text-xs text-gray-400 font-sans">Enfoque Inteligente:</span>
                    <button
                      onClick={() => setCenterOnTarget(!centerOnTarget)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                        centerOnTarget
                          ? 'bg-brand-blue-500/20 text-brand-blue-300 border-brand-blue-500/40'
                          : 'bg-brand-blue-950/60 text-gray-400 border-brand-blue-900'
                      }`}
                      id="btn-toggle-center"
                    >
                      {centerOnTarget ? 'RECUADRO ACTIVO' : 'SIN RECUADRO'}
                    </button>
                  </div>

                </div>

                {/* Zoom range slider */}
                <div className="space-y-2 pt-2 border-t border-brand-blue-800/30">
                  <div className="flex justify-between text-xs text-gray-300 font-sans">
                    <span>Ajuste Manual de Acercamiento Óptico</span>
                    <span className="font-bold text-brand-blue-300">{zoomScale.toFixed(1)}x</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500 font-mono">1.0x</span>
                    <input
                      type="range"
                      min="1"
                      max="4"
                      step="0.1"
                      value={zoomScale}
                      onChange={(e) => setZoomScale(parseFloat(e.target.value))}
                      className="flex-1 accent-brand-blue-500 h-1.5 bg-brand-blue-950 rounded-lg cursor-pointer"
                      id="range-zoom"
                    />
                    <span className="text-xs text-gray-500 font-mono">4.0x</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Informational summary */}
            <div className="lg:col-span-4 space-y-6">
              <div>
                <h3 className="font-display text-2xl font-bold text-white mb-2">
                  Lentes de Precisión 4K
                </h3>
                <p className="font-sans text-gray-300 text-sm leading-relaxed">
                  Consigue la máxima fidelidad seleccionando la longitud focal exacta según la estructura que deseas proteger.
                </p>
              </div>

              {distanceMode === 'edificio' ? (
                <div className="p-5 rounded-2xl bg-brand-blue-900/30 border border-brand-blue-800/30 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-brand-blue-500/10 flex items-center justify-center text-brand-blue-400">
                      <Building className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-sans text-sm font-bold text-white">Monitoreo de Fachadas y Edificios</h4>
                      <p className="font-mono text-[10px] text-brand-blue-300">Lente Avanzado de 4.0mm - Estabilidad Máxima</p>
                    </div>
                  </div>
                  <p className="font-sans text-xs text-gray-400 leading-relaxed">
                    Ideal para capturar la estructura completa del edificio de forma simétrica. Con un rango óptimo de nitidez, permite analizar los contornos arquitectónicos y los movimientos en los portales a alta velocidad con total fluidez.
                  </p>
                  <ul className="space-y-2 text-xs text-gray-300 font-sans">
                    <li className="flex items-center gap-2 text-brand-blue-400">✔ Nitidez en cristales y balcones</li>
                    <li className="flex items-center gap-2 text-brand-blue-400">✔ Ideal para seguridad de oficinas y condominios</li>
                    <li className="flex items-center gap-2 text-brand-blue-400">✔ Compatible con Grabación Continua</li>
                  </ul>
                </div>
              ) : distanceMode === 'corta' ? (
                <div className="p-5 rounded-2xl bg-brand-blue-900/30 border border-brand-blue-800/30 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-brand-blue-500/10 flex items-center justify-center text-brand-blue-400">
                      <Scan className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-sans text-sm font-bold text-white">Corta Distancia (Ángulo Amplio)</h4>
                      <p className="font-mono text-[10px] text-brand-blue-300">Lente Fijo de 2.8mm - Apertura de 112°</p>
                    </div>
                  </div>
                  <p className="font-sans text-xs text-gray-400 leading-relaxed">
                    Diseñado para cubrir amplios espectros de forma cercana. Perfecto para entradas peatonales domésticas, recepciones y pasillos de edificios. Captura rostros nítidos al instante.
                  </p>
                  <ul className="space-y-2 text-xs text-gray-300 font-sans">
                    <li className="flex items-center gap-2 text-brand-blue-400">✔ Reconocimiento facial a corta distancia</li>
                    <li className="flex items-center gap-2 text-brand-blue-400">✔ Captura de entrega de paquetes</li>
                    <li className="flex items-center gap-2 text-brand-blue-400">✔ Ángulo amplio sin deformación</li>
                  </ul>
                </div>
              ) : distanceMode === 'larga' ? (
                <div className="p-5 rounded-2xl bg-brand-blue-900/30 border border-brand-blue-800/30 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-brand-blue-500/10 flex items-center justify-center text-brand-blue-400">
                      <Maximize2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-sans text-sm font-bold text-white">Larga Distancia (Focal Estrecho)</h4>
                      <p className="font-mono text-[10px] text-brand-blue-300">Lente Focal de 12mm - Enfoque de 32°</p>
                    </div>
                  </div>
                  <p className="font-sans text-xs text-gray-400 leading-relaxed">
                    Maximiza el alcance del zoom físico para objetivos sumamente lejanos. Ideal para calles, avenidas y parqueaderos de edificios donde se requiere leer patentes nítidas.
                  </p>
                  <ul className="space-y-2 text-xs text-gray-300 font-sans">
                    <li className="flex items-center gap-2 text-brand-blue-400">✔ Captura de patentes automotrices</li>
                    <li className="flex items-center gap-2 text-brand-blue-400">✔ Identificación de matrículas hasta a 50m</li>
                    <li className="flex items-center gap-2 text-brand-blue-400">✔ Lente de cristal templado industrial</li>
                  </ul>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-brand-blue-900/30 border border-brand-blue-800/30 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-brand-blue-500/10 flex items-center justify-center text-brand-blue-400">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-sans text-sm font-bold text-white">Lente Telescópico Extremo (EE.UU.)</h4>
                      <p className="font-mono text-[10px] text-brand-blue-300">Súper Teleobjetivo de 50mm - Enfoque Continuo</p>
                    </div>
                  </div>
                  <p className="font-sans text-xs text-gray-400 leading-relaxed">
                    Simulación de cámara de altísima definición enfocando un punto histórico emblemático. Utiliza compensación de calor óptico y estabilización giroscópica inteligente.
                  </p>
                  <ul className="space-y-2 text-xs text-gray-300 font-sans">
                    <li className="flex items-center gap-2 text-brand-blue-400">✔ Enfoque ultra nítido intercontinental</li>
                    <li className="flex items-center gap-2 text-brand-blue-400">✔ Filtros atmosféricos digitales por IA</li>
                    <li className="flex items-center gap-2 text-brand-blue-400">✔ Fluidez de 120 FPS sin rastro de estela</li>
                  </ul>
                </div>
              )}

              <div className="bg-brand-blue-950/60 p-4 rounded-xl border border-brand-blue-900 flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-brand-blue-400 flex-shrink-0 mt-0.5" />
                <p className="font-sans text-[11px] text-gray-400 leading-normal">
                  **Sugerencia Profesional**: Para edificios de oficinas, un lente de 4.0mm cubre el perímetro general mientras que el de larga distancia monitorea los carriles de entrada y salida vehicular.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            MODE 3: SIMULADOR DE GRABACIÓN Y FLUIDEZ DE VIDEO 120 FPS
            ========================================== */}
        {activeMode === 'grabador' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start animate-fade-in" id="grabador-container">
            
            {/* Monitor principal */}
            <div className="lg:col-span-8 space-y-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/15 bg-black shadow-2xl">
                
                {/* Main Video Stream Background (using selected clip type) */}
                <img
                  src={getRecorderImage()}
                  alt="Grabación en tiempo real de edificios"
                  className="w-full h-full object-cover select-none pointer-events-none"
                  referrerPolicy="no-referrer"
                />

                {/* Blinking Recording Dot Overlay */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/70 border border-white/15 rounded-md px-3 py-1 backdrop-blur-sm">
                  <span className={`h-2.5 w-2.5 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
                  <span className="font-mono text-[10px] font-bold text-white tracking-widest uppercase">
                    {isRecording ? '● GRABANDO' : 'VISTA EN VIVO'}
                  </span>
                  {isRecording && (
                    <span className="font-mono text-[10px] text-red-400 border-l border-white/20 pl-2">
                      {formatTime(recordingTime)}
                    </span>
                  )}
                </div>

                {/* Watermark Resolution Codec */}
                <div className="absolute top-4 right-4 z-20 bg-black/70 border border-white/15 rounded-md px-3 py-1 font-mono text-[10px] text-brand-blue-300 flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-brand-blue-400 animate-pulse" /> 
                  <span>4K UHD | {fluidity} FPS | Ultra-Fluido</span>
                </div>

                {/* Simulated Floating Moving Object to SHOWCASE FLUIDITY (15fps vs 60fps vs 120fps) */}
                <div 
                  className={`absolute z-10 w-28 h-20 border border-brand-blue-400 bg-brand-blue-500/15 pointer-events-none rounded flex flex-col justify-between p-1.5 shadow-lg ${getGlideClass()}`}
                  style={{
                    top: '20%',
                    left: '10%'
                  }}
                >
                  <div className="flex justify-between items-start">
                    <span className="bg-brand-blue-500 text-white font-mono text-[6px] font-bold px-1 rounded uppercase tracking-wider">
                      AUTO_TRACK_IA
                    </span>
                    <span className="text-white text-[7px] font-mono">CAM_BUILDING</span>
                  </div>
                  
                  {/* Internal grid look for the target box */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-brand-blue-400 animate-ping" />
                  </div>

                  <div className="text-[7px] font-mono text-gray-300 text-center uppercase tracking-tighter">
                    {fluidity === 120 ? 'Fluidez Extrema: 120 fps ⚡' : fluidity === 60 ? 'Fluidez Pro: 60 fps' : 'Video Lento: 15 fps'}
                  </div>
                  {/* Bounding box corners */}
                  <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white" />
                  <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white" />
                  <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-white" />
                  <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-white" />
                </div>

                {/* Storage and Streaming Stats HUD bottom */}
                <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap justify-between items-center gap-2 bg-black/70 border border-white/10 rounded-lg p-2.5 backdrop-blur-md">
                  <div className="flex items-center gap-4 text-[10px] font-mono">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Database className="h-3.5 w-3.5 text-brand-blue-400" /> DISCO:
                    </span>
                    <span className="text-white font-bold">1,84 TB / 2,00 TB (WD Purple)</span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-mono">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-brand-blue-400" /> COMPRESIÓN:
                    </span>
                    <span className="text-brand-blue-300 font-bold">H.265+ (Optimización Activa)</span>
                  </div>
                  <div className="text-[10px] font-mono text-green-400">
                    ESTADO: CONECTADO 120Hz
                  </div>
                </div>

                {/* Feedback Toast Overlay when Clip is Saved */}
                {showSavedFeedback && (
                  <div className="absolute inset-0 bg-brand-blue-950/90 flex flex-col items-center justify-center z-30 animate-fade-in">
                    <div className="h-14 w-14 rounded-full bg-green-500/20 text-green-400 border border-green-500 flex items-center justify-center mb-3">
                      <Check className="h-7 w-7" />
                    </div>
                    <h4 className="font-display text-lg font-bold text-white">Grabación Guardada con Éxito</h4>
                    <p className="font-sans text-xs text-gray-400 mt-1 max-w-xs text-center">
                      El clip 4K UHD se ha almacenado de manera segura en el disco WD Purple incorporado en el NVR.
                    </p>
                  </div>
                )}

              </div>

              {/* Console control bar */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-brand-blue-900/40 p-5 rounded-2xl border border-brand-blue-800/40">
                
                {/* Record button */}
                <div className="md:col-span-5 flex flex-wrap items-center gap-3">
                  <button
                    onClick={toggleRecording}
                    className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-sans text-xs font-bold transition-all border cursor-pointer w-full sm:w-auto ${
                      isRecording
                        ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/20'
                        : 'bg-brand-blue-500 hover:bg-brand-blue-600 text-white border-brand-blue-400/30'
                    }`}
                    id="btn-trigger-recording"
                  >
                    {isRecording ? (
                      <>
                        <Square className="h-3.5 w-3.5" /> Detener y Guardar Video 4K
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5 fill-current" /> Grabar Video 4K ({fluidity} FPS)
                      </>
                    )}
                  </button>
                </div>

                {/* Fluidity selectors */}
                <div className="md:col-span-7 flex flex-col sm:flex-row justify-end items-start sm:items-center gap-3">
                  <span className="text-xs text-gray-300 font-sans">
                    Ajustar Fluidez de Cuadros:
                  </span>
                  <div className="flex rounded-lg bg-brand-blue-950/80 border border-brand-blue-800/50 p-1 w-full sm:w-auto">
                    <button
                      onClick={() => setFluidity(15)}
                      className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md font-mono text-[11px] font-bold transition-all cursor-pointer ${
                        fluidity === 15
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      id="btn-fluidity-15"
                    >
                      15 FPS
                    </button>
                    <button
                      onClick={() => setFluidity(60)}
                      className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md font-mono text-[11px] font-bold transition-all cursor-pointer ${
                        fluidity === 60
                          ? 'bg-brand-blue-500 text-white shadow-sm'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      id="btn-fluidity-60"
                    >
                      60 FPS
                    </button>
                    <button
                      onClick={() => setFluidity(120)}
                      className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md font-mono text-[11px] font-bold transition-all cursor-pointer ${
                        fluidity === 120
                          ? 'bg-green-600 text-white shadow-sm'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      id="btn-fluidity-120"
                    >
                      120 FPS ⚡
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* List of saved recorded clips (Sidebar) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="space-y-1">
                <h3 className="font-display text-lg font-bold text-white">
                  Consola de Grabación NVR
                </h3>
                <p className="font-sans text-xs text-gray-400">
                  Monitorea las capturas de video guardadas en disco local 4K de forma continua. Haz clic en un clip para reproducirlo en el monitor.
                </p>
              </div>

              {/* Clip lists */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {simulatedClips.map((clip) => (
                  <button
                    key={clip.id}
                    onClick={() => {
                      setActiveClipId(clip.id);
                      setFluidity(clip.fps as 15 | 60 | 120);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      activeClipId === clip.id
                        ? 'bg-brand-blue-500/10 border-brand-blue-500 text-white shadow-md'
                        : 'bg-brand-blue-900/30 border-brand-blue-800/40 text-gray-300 hover:bg-brand-blue-900/50 hover:border-brand-blue-800'
                    }`}
                    id={`clip-${clip.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                        activeClipId === clip.id ? 'bg-brand-blue-500/20 text-brand-blue-400' : 'bg-black/40 text-gray-400'
                      }`}>
                        <PlayCircle className="h-5 w-5" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold font-sans truncate max-w-[150px] sm:max-w-none">{clip.name}</p>
                        <span className="font-mono text-[9px] text-gray-400 flex items-center gap-1">
                          {clip.time} | {clip.fps} FPS
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right flex-shrink-0">
                      <p className="font-mono text-[9px] font-bold text-brand-blue-300">{clip.duration}</p>
                      <span className="font-mono text-[8px] text-gray-500">{clip.size}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-brand-blue-900/20 border border-brand-blue-800/30 text-xs text-gray-400 space-y-2">
                <h4 className="font-bold text-white flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                  <Database className="h-3.5 w-3.5 text-brand-blue-400" /> ALMACENAMIENTO DE EDIFICIOS
                </h4>
                <p className="leading-relaxed text-[11px]">
                  La tecnología **120 FPS** de SecureView captura 4 veces más fotogramas que las cámaras tradicionales, facilitando el reconocimiento de matrículas de alta velocidad y trayectorias exactas de intrusos.
                </p>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
