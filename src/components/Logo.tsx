interface LogoProps {
  size?: number;
  className?: string;
}

const Logo = ({ size = 40, className = "" }: LogoProps) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          {/* Outer hexagon - represents encryption layer */}
          <path
            d="M20 2L32 8V24L20 38L8 24V8L20 2Z"
            fill="url(#gradient1)"
            stroke="hsl(var(--primary))"
            strokeWidth="1"
          />
          
          {/* Inner diamond - represents vault core */}
          <path
            d="M20 8L28 14V26L20 32L12 26V14L20 8Z"
            fill="url(#gradient2)"
            stroke="hsl(var(--accent))"
            strokeWidth="0.5"
          />
          
          {/* Central encrypted symbol */}
          <circle
            cx="20"
            cy="20"
            r="4"
            fill="hsl(var(--primary))"
            className="animate-pulse-glow"
          />
          
          {/* Mathematical symbols representing FHE */}
          <text
            x="20"
            y="24"
            textAnchor="middle"
            fontSize="6"
            fill="hsl(var(--primary-foreground))"
            fontFamily="monospace"
            fontWeight="bold"
          >
            ∑
          </text>
          
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary) / 0.2)" />
              <stop offset="100%" stopColor="hsl(var(--primary) / 0.1)" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--accent) / 0.3)" />
              <stop offset="100%" stopColor="hsl(var(--accent) / 0.1)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="flex flex-col">
        <span className="text-xl font-bold bg-gradient-security bg-clip-text text-transparent">
          FHE
        </span>
        <span className="text-xs text-muted-foreground font-mono tracking-wider">
          VAULT
        </span>
      </div>
    </div>
  );
};

export default Logo;