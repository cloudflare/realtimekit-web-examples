export default function ProgressBar({
  value,
  max,
}: {
  value: number;
  max: number;
}) {
  return (
    <div className="h-1 w-full bg-zinc-200 relative">
      <div
        className="max-w-[25%] h-full bg-red-500 z-10 absolute left-0 top-0"
        style={{
          width: Math.min((value / max) * 100, 25) + '%',
          transition: 'all 0.3s',
        }}
      ></div>
      <div
        className="max-w-full h-full z-0 bg-black absolute left-0 top-0"
        style={{
          width: Math.min((value / max) * 100, 100) + '%',
          transition: 'all 0.3s',
        }}
      ></div>
    </div>
  );
}
