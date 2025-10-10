import ProgressBar from './ProgressBar';

export default function Duration({ duration }: { duration: number }) {
  return (
    <div className="flex flex-col gap-1 bg-zinc-50 p-2 text-center">
      <div className="relative">
        <ProgressBar value={duration} max={60} />
        <div className="z-10 bg-red-500 absolute left-1/4 h-full w-1 top-0"></div>
        <div className="z-10 bg-black absolute right-0 h-full w-1 top-0"></div>
      </div>
      <div className="text-xs flex items-center justify-between">
        <div>
          Min recording time{' '}
          <span className="font-semibold text-red-500">15s</span>
        </div>
        <div>
          Max recording time <span className="font-semibold">60s</span>
        </div>
      </div>
    </div>
  );
}
