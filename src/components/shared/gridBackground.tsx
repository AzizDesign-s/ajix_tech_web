export function GridBackground() {
  return (
    <div
      aria-hidden="true"
      className="bg-gradient-surface absolute inset-0 h-full w-full overflow-hidden"
    >
      {/* Grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(50,57,103,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(50,57,103,0.3)_1px,transparent_1px)] bg-size-[100px_100px]" />
      {/* Radial fade so the grid dissolves toward the edges instead of hard-cutting */}
      <div className="bg-background pointer-events-none absolute inset-0 mask-[radial-gradient(ellipse_at_center,transparent_4%,black)]" />
    </div>
  );
}
