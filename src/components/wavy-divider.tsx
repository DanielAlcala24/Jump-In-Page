"use client";

import { cn } from "@/lib/utils";

export default function WavyDivider() {
    return (
        <div className="bg-white">
            <div className="relative h-20 w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
                <svg
                    className="absolute bottom-0 left-0 w-full h-auto text-gray-900 dark:text-gray-50"
                    viewBox="0 0 1440 100"
                    preserveAspectRatio="none"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M1440 100H0V0c196.67 53.33 493.33 80 890 80c400 0 656.67-26.67 860-80v100z"
                    ></path>
                </svg>
            </div>
        </div>
    );
}
