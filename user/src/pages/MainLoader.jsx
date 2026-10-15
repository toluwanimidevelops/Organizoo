import React, { useEffect, useRef, useState } from "react";
import logo from "/logo.png";

export default function ConnectifyLoader({
  onComplete,
  loop = false,
  tagline = "Organize. Discover. Connect",
}) {
  const [runId, setRunId] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const TOTAL_MS = 3600;
    timeoutRef.current = setTimeout(() => {
      onComplete && onComplete();
      if (loop) setRunId((n) => n + 1);
    }, TOTAL_MS);
    return () => clearTimeout(timeoutRef.current);
  }, [runId, loop, onComplete]);

  return (
    <div style={styles.stage} key={runId}>
      {/* Dynamic Expanding Ring */}
      <div style={styles.ring} />

      {/* Center Logo */}
      <div style={styles.logoMark}>
        <img src={logo} alt="Connectify" style={styles.logoImg} />
      </div>

      {/* Centered Text Block */}
      <div style={styles.wordmark}>
        <div style={styles.brand} className="font-main">
          Connectify
          <span >.</span>
        </div>
        <div style={styles.tagline}>{tagline}</div>
      </div>

      <style>{keyframeCSS}</style>
    </div>
  );
}

const styles = {
  stage: {
    position: "relative",
    width: "100%",
    height: "100vh",
    minHeight: 360,
    background: "radial-gradient(circle at 50% 50%, #150f3b 0%, #08041c 70%)",
    backgroundSize: "140% 140%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    animation: "cf-bgPulse 3s ease-in-out infinite alternate",
  },
  ring: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 120,
    height: 120,
    borderRadius: "50%",
    borderStyle: "solid",
    borderColor: "#ffffff",
    boxSizing: "border-box",
    opacity: 0,
    animation:
      "cf-ringSequence 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards",
  },
  logoMark: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 76,
    height: 76,
    opacity: 0,
    zIndex: 2,
    animation:
      "cf-logoIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.45s forwards, cf-logoShift 0.5s cubic-bezier(0.65, 0, 0.35, 1) 1.35s forwards",
  },
  logoImg: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    display: "block",
  },
  wordmark: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate( calc(-50% + 68px), -50% )",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 2,
  },
  brand: {
    display: "flex",
    alignItems: "baseline",
    fontSize: 40,
    fontWeight: 600,
    lineHeight: 1.0,
    color: "#ffffff",
    opacity: 0,
    clipPath: "inset(0 100% 0 0)",
    animation: "cf-brandIn 0.5s steps(10, end) 1.85s forwards",
  },
  dotChar: {
    color: "#8b87a8",
    marginLeft: 2,
    opacity: 0,
    animation: "cf-fadeIn 0.25s ease 2.35s forwards",
  },
  tagline: {
    fontSize: 13,
    fontWeight: 300,
    color: "#a29dbf",
    whiteSpace: "nowrap",
    overflow: "hidden",
    width: 0,
    marginTop: 4,
    lineHeight: 1.2,
    textAlign: "center",
    animation:
      "cf-typeTagline 0.8s cubic-bezier(0.4, 0, 0.2, 1) 2.45s forwards",
  },
};

const keyframeCSS = `
@keyframes cf-bgPulse {
  0% {
    background-size: 100% 100%;
  }
  100% {
    background-size: 150% 150%;
  }
}

@keyframes cf-ringSequence {
  0% {
    opacity: 0;
    border-width: 18px;
    transform: translate(-50%, -50%) scale(0.15);
  }
  30% {
    opacity: 1;
    border-width: 14px;
  }
  75% {
    opacity: 1;
    border-width: 4px;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    border-width: 1px;
    transform: translate(-50%, -50%) scale(1.15);
  }
}

@keyframes cf-logoIn {
  0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.2) rotate(-180deg); }
  100% { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(0deg); }
}

@keyframes cf-logoShift {
  0%   { transform: translate(-50%, -50%) scale(1); }
  100% { transform: translate(-158px, -50%) scale(1); }
}

@keyframes cf-brandIn {
  0%   { opacity: 1; clip-path: inset(0 100% 0 0); }
  100% { opacity: 1; clip-path: inset(0 0% 0 0); }
}

@keyframes cf-fadeIn {
  to { opacity: 1; }
}

@keyframes cf-typeTagline {
  to { width: 100%; }
}
`;
