import { useMemo, useEffect, useState } from 'react';

const FloatingBackground = ({ performanceMode, theme, showFloatingBlobs = true, animationMode = 'normal' }) => {
    const [isVisible, setIsVisible] = useState(true);
    
    // Respect reduced motion preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setIsVisible(!mediaQuery.matches);
        
        const handleChange = (e) => setIsVisible(!e.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const blobs = useMemo(() => {
        const blobCount = performanceMode === 'full' ? 6 : performanceMode === 'reduced' ? 3 : 0;
        
        // Speed multiplier based on animation mode
        const speedMultiplier = animationMode === 'normal' ? 0.4 : 1.0; // Normal is 2.5x faster
        
        return Array.from({ length: blobCount }, (_, i) => {
            // Generate random properties for each blob
            const size = 150 + Math.random() * 350; // 150px - 500px
            const startX = 5 + Math.random() * 90; // 5% - 95%
            const startY = 5 + Math.random() * 90; // 5% - 95%
            
            // Animation duration - much faster in normal mode
            const baseDuration = animationMode === 'normal' 
                ? 8 + Math.random() * 12  // 8-20s for normal
                : 20 + Math.random() * 30; // 20-50s for random
            const duration = baseDuration * speedMultiplier;
            
            const delay = Math.random() * -30; // Start at random point in animation
            const blur = 60 + Math.random() * 80; // 60px - 140px blur
            
            // Choose movement pattern
            const patterns = ['orbital', 'wander', 'drift', 'float', 'pulse-drift'];
            const pattern = patterns[i % patterns.length];
            
            // Color selection - use CSS variables for theme consistency
            const colors = [
                'var(--gradient-1)',
                'var(--gradient-2)', 
                'var(--gradient-3)',
            ];
            const color = colors[i % colors.length];
            
            // Random opacity for depth
            const opacity = 0.15 + Math.random() * 0.25; // 0.15 - 0.4
            
            return {
                id: i,
                size,
                startX,
                startY,
                duration,
                delay,
                blur,
                pattern,
                color,
                opacity,
            };
        });
    }, [performanceMode, theme, animationMode]);

    if (!isVisible || !showFloatingBlobs || performanceMode === 'minimal') {
        return null;
    }

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
            {blobs.map((blob) => (
                <div
                    key={blob.id}
                    className={`floating-blob blob-${blob.pattern}`}
                    style={{
                        position: 'absolute',
                        width: `${blob.size}px`,
                        height: `${blob.size}px`,
                        left: `${blob.startX}%`,
                        top: `${blob.startY}%`,
                        background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
                        borderRadius: '50%',
                        filter: `blur(${blob.blur}px)`,
                        opacity: blob.opacity,
                        animationDuration: `${blob.duration}s`,
                        animationDelay: `${blob.delay}s`,
                        transform: 'translate(-50%, -50%)',
                        willChange: 'transform, opacity',
                    }}
                />
            ))}
            
            {/* Subtle noise/grain overlay for texture */}
            <div 
                className="absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    pointerEvents: 'none',
                }}
            />
        </div>
    );
};

export default FloatingBackground;
