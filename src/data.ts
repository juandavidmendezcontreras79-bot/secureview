import { Product, Testimonial } from './types';

export const HERO_IMAGE = '/src/assets/images/hero_banner_camera_1783262778864.jpg';
export const LONG_DISTANCE_4K = '/src/assets/images/long_distance_4k_1783701188683.jpg';
export const SHORT_DISTANCE_4K = '/src/assets/images/short_distance_4k_1783701202183.jpg';
export const BUILDING_SURVEILLANCE_4K = '/src/assets/images/building_surveillance_1783701627411.jpg';
export const STATUE_OF_LIBERTY_CCTV = '/src/assets/images/statue_of_liberty_cctv_1783701960674.jpg';

export const PRODUCTS: Product[] = [
  {
    id: 'cam-ip-4k',
    name: 'Cámara IP 4K Ultra HD',
    price: 199,
    image: '/src/assets/images/camera_ip_4k_1783262792259.jpg',
    resolution: '4K Ultra HD (3840 x 2160)',
    category: 'exterior',
    features: [
      'Visión nocturna inteligente a color',
      'Detección de movimiento y personas con IA',
      'Carcasa de aleación de aluminio antivandálica',
      'Conexión PoE (Power over Ethernet)'
    ],
    howItWorks: 'Se conecta mediante un cable Ethernet directo al switch PoE, recibiendo alimentación eléctrica y transmitiendo video digital en ultra alta definición de forma simultánea. Al detectar movimiento, su procesador de IA analiza los píxeles para reconocer formas humanas y envía una alerta instantánea, activando los faros de luz blanca si es de noche para capturar el rostro en color real.',
    specs: {
      resolutionDetail: '3840 x 2160 píxeles a 30fps',
      nightVision: 'Infrarrojos hasta 40m + LEDs de luz cálida',
      aiDetection: 'Filtro de personas, vehículos y mascotas',
      waterproof: 'Clasificación IP67 para todo clima',
      audio: 'Micrófono de alta fidelidad integrado',
      storage: 'Ranura MicroSD hasta 512GB / NVR / Nube'
    }
  },
  {
    id: 'cam-ptz-360',
    name: 'Cámara PTZ Profesional 360°',
    price: 349,
    image: '/src/assets/images/camera_ptz_360_1783262803131.jpg',
    resolution: 'Full HD 1080p (Zoom Óptico 10x)',
    category: 'ptz',
    features: [
      'Giro horizontal 360° y vertical 90°',
      'Seguimiento automático de personas (Auto-tracking)',
      'Zoom óptico real de 10x sin pérdida',
      'Sirena de advertencia activa y luz estroboscópica'
    ],
    howItWorks: 'Utiliza servomotores de precisión controlados remotamente por la app o configurados para rondas automatizadas. Cuando su sensor de movimiento de alto rango detecta a un intruso, el algoritmo de auto-seguimiento (Auto-tracking) lo centra en la imagen de forma continua y realiza un zoom óptico real de 10x, ajustando físicamente los lentes de cristal templado internos para no perder un ápice de nitidez. En paralelo, activa su sirena de advertencia disuasoria.',
    specs: {
      resolutionDetail: '1920 x 1080 píxeles con sensor HDR',
      nightVision: 'Visión nocturna láser de largo alcance hasta 100m',
      aiDetection: 'Seguimiento inteligente de objetivos en movimiento',
      zoom: 'Zoom Óptico 10x + Zoom Digital 16x',
      waterproof: 'Certificación IP66 para exteriores',
      storage: 'Almacenamiento híbrido local y NVR profesional'
    }
  },
  {
    id: 'cam-ext-2k',
    name: 'Cámara Exterior Resistente al Agua',
    price: 149,
    image: '/src/assets/images/camera_waterproof_2k_1783262813556.jpg',
    resolution: '2K Quad HD (2560 x 1440)',
    category: 'exterior',
    features: [
      'Certificación de protección climática IP66',
      'Audio bidireccional (Micrófono y Parlante)',
      'Conectividad WiFi de doble banda (2.4 / 5 GHz)',
      'Reflectores LED de activación por movimiento'
    ],
    howItWorks: 'Se enlaza de manera inalámbrica vía WiFi a tu red doméstica (soporta bandas 2.4 y 5 GHz) y se alimenta de forma constante a la corriente convencional mediante su transformador sellado de 12V. Incorpora un sensor de calor corporal PIR avanzado para evitar falsas alertas causadas por insectos o viento. Su parlante y micrófono bidireccional integrado de alto volumen te permite interactuar en tiempo real con carteros o visitas como un citófono inteligente.',
    specs: {
      resolutionDetail: '2560 x 1440 píxeles con amplio ángulo (110°)',
      nightVision: 'Visión nocturna infrarroja con 24 LEDs IR (30m)',
      aiDetection: 'Sensor térmico PIR avanzado + Detección de siluetas',
      audio: 'Charla bidireccional en tiempo real con cancelación de ruido',
      waterproof: 'Resistencia a tormentas, nieve y polvo IP66',
      storage: 'MicroSD local y respaldo gratuito en la nube de 3 días'
    }
  },
  {
    id: 'kit-security-4k',
    name: 'Kit de Seguridad 4 Cámaras 4K',
    price: 799,
    image: '/src/assets/images/kit_security_4k_1783262822970.jpg',
    resolution: '4K Ultra HD (4 Cámaras)',
    category: 'kit',
    features: [
      'Grabador NVR de 8 canales con Disco Duro de 2TB',
      'Monitoreo remoto 24/7 vía aplicación para iOS/Android',
      'Soporte para grabación continua y por eventos',
      'Alertas push instantáneas en tu celular'
    ],
    howItWorks: 'Las 4 cámaras de alta definición transmiten sus flujos de video digital pesados codificados en H.265+ directamente hacia el grabador central NVR de forma autónoma. El NVR procesa, ordena, gestiona y almacena la grabación continua las 24 horas en el disco duro industrial WD Purple de 2TB incorporado (especial para videovigilancia). Al conectar el NVR a internet, este levanta un canal encriptado seguro P2P para que visualices las 4 cámaras en simultáneo en tu celular desde cualquier lugar con latencia imperceptible.',
    specs: {
      resolutionDetail: 'Grabación 4K multicanal sincronizada',
      nightVision: 'Visión nocturna premium en cada cámara (40m)',
      aiDetection: 'Detección inteligente de perímetro con alarmas cruzadas',
      storage: 'Disco duro especial para videovigilancia de 2TB preinstalado',
      waterproof: 'Todas las cámaras cuentan con certificación IP67',
      audio: 'Audio integrado en todos los canales de grabación'
    }
  }
];

export const BENEFITS = [
  {
    id: 'easy-install',
    title: 'Instalación Sencilla',
    description: 'Sistemas plug-and-play con guías detalladas en video y soporte remoto paso a paso. PoE para conectar con un solo cable.',
    iconName: 'Wrench'
  },
  {
    id: 'monitoring-247',
    title: 'Monitoreo 24/7',
    description: 'Acceso en vivo sin interrupciones desde cualquier lugar del mundo. Alertas push y grabación inteligente de respaldo.',
    iconName: 'ShieldAlert'
  },
  {
    id: 'warranty',
    title: 'Garantía de 2 Años',
    description: 'Todos nuestros productos cuentan con garantía completa de hardware contra cualquier falla o defecto de fabricación.',
    iconName: 'FileCheck'
  },
  {
    id: 'support',
    title: 'Soporte Especializado',
    description: 'Equipo de ingenieros listos para ayudarte vía WhatsApp, teléfono o correo. Configuración inicial totalmente asistida.',
    iconName: 'Headphones'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Alejandro Ramos',
    role: 'Director de Seguridad',
    company: 'Logística del Norte',
    content: 'La resolución de las cámaras PTZ de 360° nos ha permitido supervisar todo el patio de carga con un solo dispositivo. El zoom óptico de 10x es simplemente espectacular, mantiene la nitidez al máximo.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120'
  },
  {
    id: 'test-2',
    name: 'Carolina Espinoza',
    role: 'Propietaria',
    company: 'Residencial San Felipe',
    content: 'Instalamos el Kit de 4 Cámaras 4K en nuestra casa y la tranquilidad de ver todo desde mi celular es invaluable. La visión nocturna a color hace que se vea todo tan claro como en el día.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120'
  },
  {
    id: 'test-3',
    name: 'Martín Silva',
    role: 'Gerente Comercial',
    company: 'Tiendas ClickStore',
    content: 'El soporte técnico nos guió perfectamente en la instalación del sistema en tres sucursales distintas. Detectores de IA que envían notificaciones exactas evitan falsas alarmas.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120'
  }
];
