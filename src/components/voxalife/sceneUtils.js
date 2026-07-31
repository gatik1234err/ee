export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export function smoothstep(min, max, x) {
  const t = clamp((x - min) / (max - min || 0.0001), 0, 1);
  return t * t * (3 - 2 * t);
}

export const COLOR_VARIANTS = {
  arcticWhite: {
    name: 'Arctic White',
    body: '#ECEFF4',
    grip: '#94A3B8',
    metalness: 0.5,
    roughness: 0.35,
  },
  graphiteBlack: {
    name: 'Graphite Black',
    body: '#1C1C22',
    grip: '#3A3A44',
    metalness: 0.85,
    roughness: 0.22,
  },
  titaniumSilver: {
    name: 'Titanium Silver',
    body: '#C4C4CC',
    grip: '#82828C',
    metalness: 0.95,
    roughness: 0.18,
  },
  medicalBlue: {
    name: 'Medical Blue',
    body: '#3B5F8A',
    grip: '#2E4A6E',
    metalness: 0.55,
    roughness: 0.32,
  },
};

// Camera keyframes: progress => [cameraX, cameraY, cameraZ], [targetX, targetY, targetZ]
const CAMERA_KEYFRAMES = [
  { p: 0.0, pos: [0, 0, 6], target: [0, 0, 0] },
  { p: 0.108, pos: [0, 0, 6], target: [0, 0, 0] },
  { p: 0.215, pos: [3.2, 0.5, 5], target: [0, 0, 0] },
  { p: 0.355, pos: [0, 1.6, 4.5], target: [0, 0.3, 0] },
  { p: 0.43, pos: [0, 0, 3.2], target: [0, -0.8, 0] },
  { p: 0.48, pos: [0, 0, 3.2], target: [0, 0.2, 0] },
  { p: 0.53, pos: [0, 0, 3.2], target: [0, -0.25, 0] },
  { p: 0.57, pos: [0, 0, 3.2], target: [0, -1.4, 0] },
  { p: 0.677, pos: [-2.5, -0.3, 4.5], target: [0, 0, 0] },
  { p: 0.785, pos: [0, 0, 5], target: [0, 0, 0] },
  { p: 0.892, pos: [0, 0, 5.5], target: [0, 0, 0] },
  { p: 1.0, pos: [0, 0, 6], target: [0, 0, 0] },
];

export function getSceneState(progress) {
  let k1 = CAMERA_KEYFRAMES[0];
  let k2 = CAMERA_KEYFRAMES[CAMERA_KEYFRAMES.length - 1];
  for (let i = 0; i < CAMERA_KEYFRAMES.length - 1; i++) {
    if (progress >= CAMERA_KEYFRAMES[i].p && progress <= CAMERA_KEYFRAMES[i + 1].p) {
      k1 = CAMERA_KEYFRAMES[i];
      k2 = CAMERA_KEYFRAMES[i + 1];
      break;
    }
  }
  const rawT = (progress - k1.p) / (k2.p - k1.p || 0.0001);
  const t = clamp(rawT, 0, 1);
  const easedT = t * t * (3 - 2 * t);

  return {
    cameraPos: [
      lerp(k1.pos[0], k2.pos[0], easedT),
      lerp(k1.pos[1], k2.pos[1], easedT),
      lerp(k1.pos[2], k2.pos[2], easedT),
    ],
    lookAt: [
      lerp(k1.target[0], k2.target[0], easedT),
      lerp(k1.target[1], k2.target[1], easedT),
      lerp(k1.target[2], k2.target[2], easedT),
    ],
    explodeAmount: smoothstep(0.215, 0.355, progress) * (1 - smoothstep(0.85, 0.95, progress)),
    crossSectionAmount: smoothstep(0.355, 0.42, progress) * (1 - smoothstep(0.55, 0.57, progress)),
    rotationSpeed: 0.12 + smoothstep(0.108, 0.215, progress) * 0.18,
    hotspotOpacity: smoothstep(0.05, 0.10, progress) * (1 - smoothstep(0.82, 0.88, progress)),
    waveformIntensity: 0.12 + smoothstep(0.57, 0.60, progress) * 0.88 * (1 - smoothstep(0.66, 0.68, progress)),
  };
}

export const HOTSPOT_DATA = [
  {
    id: 'powerButton',
    title: 'Silent Activation Button',
    description: 'A frosted, pressure-sensitive dome enables silent, effortless activation — designed for one-handed use.',
    specs: ['Actuation force: 1.2N', 'Material: Polycarbonate', 'IP54 sealed'],
    position: [0.58, 1.15, 0],
  },
  {
    id: 'battery',
    title: 'Long-Lasting Battery',
    description: 'A high-density rechargeable lithium cell engineered for extended daily use without compromise.',
    specs: ['Li-Po chemistry', '500+ charge cycles'],
    position: [0, -0.8, 0],
  },
  {
    id: 'motor',
    title: 'Vibration Motor',
    description: 'A precision motor generates controlled vibrations that help produce clear, natural speech.',
    specs: ['Frequency: 60–200 Hz', 'Brushless DC', 'Medical-grade'],
    position: [0, 0.2, 0],
  },
  {
    id: 'speaker',
    title: 'Transducer Module',
    description: 'An advanced transducer converts electrical signals into mechanical vibration with minimal distortion.',
    specs: ['Impedance: 8Ω', 'Custom voice coil', 'Tissue-safe contact'],
    position: [0, 0.75, 0],
  },
  {
    id: 'led',
    title: 'LED Charging Indicator',
    description: 'A subtle LED communicates battery level and charging status at a glance.',
    specs: ['RGB LED', 'Pulse animation', 'Ambient light sensor'],
    position: [0.58, 1.42, 0.15],
  },
  {
    id: 'grip',
    title: 'Ergonomic Grip',
    description: 'A soft-touch rubberized grip provides secure, comfortable handling during extended use.',
    specs: ['Medical-grade silicone', 'Anti-slip texture', 'Latex-free'],
    position: [0.66, -0.1, 0],
  },
];
