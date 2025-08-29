"use client";

import { cn } from "@/lib/utils";

export default function WavyDivider() {
    return (
        <div className="bg-white">
            <div className="relative h-20 w-full overflow-hidden bg-gray-50">
                <div className="absolute -bottom-px left-0 right-0 h-10 bg-white"
                     style={{
                        clipPath: 'path("M0,10 C15,0 35,0 50,10 C65,20 85,20 100,10 V20 H0 Z")'
                     }}>
                </div>
                 <div className="absolute -bottom-px left-0 right-0 h-10 bg-white opacity-50"
                     style={{
                        clipPath: 'path("M0,10 C15,20 35,20 50,10 C65,0 85,0 100,10 V20 H0 Z")',
                        animation: 'wave 2s infinite linear',
                        animationDelay: '-1s'
                     }}>
                </div>
            </div>
            <style jsx>{`
                @keyframes wave {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                div[style*="animation"] {
                    background-size: 200% auto;
                }
            `}</style>
        </div>
    );
}
