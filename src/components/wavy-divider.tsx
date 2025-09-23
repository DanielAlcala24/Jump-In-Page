interface WavyDividerProps {
  fromColor: string;
}

export default function WavyDivider({ fromColor }: WavyDividerProps) {
  return (
    <div className={`relative ${fromColor}`}>
      <svg
        className={`absolute bottom-0 left-0 w-full h-auto text-black dark:text-black`}
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M1440 100H0V0c0 0 200 50 720 50S1440 0 1440 0v100z" />
      </svg>
      <div className="h-20" />
    </div>
  );
}
