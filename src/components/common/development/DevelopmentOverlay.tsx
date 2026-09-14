import "./development.css";

interface DevelopmentOverlayProps {
  enabled?: boolean;
  developerName?: string;
}

type CloudMessage = "development" | "developer";

interface CloudConfig {
  className: string;
  message: CloudMessage;
}

const clouds: CloudConfig[] = [
  {
    className: "cloud-one",
    message: "development",
  },
  {
    className: "cloud-two",
    message: "developer",
  },
  {
    className: "cloud-three",
    message: "development",
  },
  {
    className: "cloud-four",
    message: "developer",
  },
  {
    className: "cloud-five",
    message: "development",
  },
  {
    className: "cloud-six",
    message: "developer",
  },
  {
    className: "cloud-seven",
    message: "development",
  },
  {
    className: "cloud-eight",
    message: "developer",
  },
];

function Cloud({
  className,
  message,
  developerName,
}: {
  className: string;
  message: CloudMessage;
  developerName: string;
}) {
  return (
    <div aria-hidden="true" className={`development-cloud ${className}`}>
      <span className="cloud-part cloud-part-one" />
      <span className="cloud-part cloud-part-two" />
      <span className="cloud-part cloud-part-three" />

      <span className="cloud-message">
        {message === "development"
          ? "Development in Progress"
          : `Built by ${developerName}`}
      </span>
    </div>
  );
}

export function DevelopmentOverlay({
  enabled = true,
  developerName = "Shubham",
}: DevelopmentOverlayProps) {
  if (!enabled) {
    return null;
  }

  return (
    <div aria-hidden="true" className="development-overlay">
      <div className="development-badge">
        <span className="development-badge-dot" />
        <span>Development Mode</span>
        <span className="development-badge-divider">•</span>
        <span>Built by {developerName}</span>
      </div>

      {clouds.map((cloud) => (
        <Cloud
          key={cloud.className}
          className={cloud.className}
          message={cloud.message}
          developerName={developerName}
        />
      ))}
    </div>
  );
}
