import { COLOR_VARIANTS } from './sceneUtils';

export function ColorSwitcher({ colorVariant, setColorVariant }) {
  return (
    <div className="flex gap-4 justify-center flex-wrap">
      {Object.entries(COLOR_VARIANTS).map(([key, variant]) => (
        <button
          key={key}
          onClick={() => setColorVariant(key)}
          className={`group relative flex flex-col items-center gap-2 transition-all duration-300 ${
            colorVariant === key ? 'scale-110' : 'hover:scale-105'
          }`}
          aria-label={`Select ${variant.name}`}
          aria-pressed={colorVariant === key}
        >
          <div
            className={`w-11 h-11 rounded-full transition-all duration-300 ${
              colorVariant === key
                ? 'ring-2 ring-[#38BDF8] ring-offset-2 ring-offset-[#020617]'
                : 'ring-1 ring-slate-700'
            }`}
            style={{ backgroundColor: variant.body }}
          />
          <span
            className={`text-xs transition-opacity duration-300 ${
              colorVariant === key ? 'text-[#F8FAFC] opacity-100' : 'text-slate-500 opacity-0 group-hover:opacity-60'
            }`}
          >
            {variant.name}
          </span>
        </button>
      ))}
    </div>
  );
}
