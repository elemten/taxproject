interface AmbientBackgroundProps {
  className?: string;
}

export function AmbientBackground({ className }: AmbientBackgroundProps) {
  return (
    <div
      className={`fixed inset-0 overflow-hidden pointer-events-none ${className ?? ""}`}
    >
      <div
        className="ambient-orb ambient-orb-float-slow bg-brand/10"
        style={{
          width: 600,
          height: 600,
          top: "-200px",
          left: "-200px",
        }}
      />

      <div
        className="ambient-orb ambient-orb-float-reverse bg-brand/5"
        style={{
          width: 500,
          height: 500,
          bottom: "-150px",
          right: "-150px",
        }}
      />

      <div
        className="ambient-orb ambient-orb-pulse bg-brand/5"
        style={{
          width: 400,
          height: 400,
          top: "40%",
          right: "10%",
        }}
      />
    </div>
  );
}
