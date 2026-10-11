"use client";

import { useSyncExternalStore } from "react";

const MONO = '"SF Mono", "Monaco", "Inconsolata", "Fira Mono", "Droid Sans Mono", monospace';

const WIDTH = 640;
const HEIGHT = 320;
const HUB = { x: 320, y: 162 };
const CHIP_W = 140;
const CHIP_H = 30;

const ROWS = [64, 162, 260];

const clip = (value, max = 13) => {
  if (!value) return "";
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
};

const leftPath = (y) => `M ${HUB.x} ${HUB.y} C 232 ${HUB.y}, 210 ${y}, 146 ${y}`;
const rightPath = (y) => `M ${HUB.x} ${HUB.y} C 408 ${HUB.y}, 430 ${y}, 494 ${y}`;

const FlowDot = ({ path, color, delay = 0, reduceMotion }) => {
  if (reduceMotion) {
    return <circle r="2.4" fill={color} opacity="0.85" cx="221" cy="161" />;
  }
  return (
    <circle r="2.6" fill={color}>
      <animateMotion dur="3.2s" begin={`${delay}s`} repeatCount="indefinite" path={path} />
    </circle>
  );
};

const NodeChip = ({ x, y, label, side = "left", tone }) => {
  const rectX = side === "left" ? x - CHIP_W / 2 : x - CHIP_W / 2;
  const dotX = side === "left" ? rectX + 13 : rectX + CHIP_W - 13;
  const textX = side === "left" ? rectX + 24 : rectX + CHIP_W - 24;

  return (
    <g>
      <rect
        x={rectX}
        y={y - CHIP_H / 2}
        width={CHIP_W}
        height={CHIP_H}
        rx="8"
        fill="rgba(19, 30, 60, 0.72)"
        stroke={tone.stroke}
      />
      <circle cx={dotX} cy={y} r="3" fill={tone.dot} />
      <text
        x={textX}
        y={y + 4}
        fill="#cfdaf5"
        fontFamily={MONO}
        fontSize="11"
        textAnchor={side === "left" ? "start" : "end"}
      >
        {clip(label)}
      </text>
    </g>
  );
};

const NodeChipFallback = ({ x, y, side, tone, label }) => (
  <NodeChip x={x} y={y} label={label} side={side} tone={tone} />
);

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const subscribeMotion = (callback) => {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const query = window.matchMedia(MOTION_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};

const getMotionSnapshot = () =>
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia(MOTION_QUERY).matches
    : false;

const getMotionServerSnapshot = () => false;

const HeroNetwork = ({ agentNodes = [], toolNodes = [] }) => {
  const reduceMotion = useSyncExternalStore(
    subscribeMotion,
    getMotionSnapshot,
    getMotionServerSnapshot,
  );

  const left = [0, 1, 2].map((i) => agentNodes[i]);
  const right = [0, 1, 2].map((i) => toolNodes[i]);

  const agentTone = { stroke: "rgba(122,148,255,0.38)", dot: "#7a94ff" };
  const toolTone = { stroke: "rgba(112,205,224,0.34)", dot: "#70cde0" };

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      width="100%"
      role="img"
      aria-label="Abstract map of agents routing tool calls through a central policy hub"
      style={{ display: "block", maxWidth: 620, marginInline: "auto" }}
    >
      <defs>
        <radialGradient id="aaHubGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4d6ff0" stopOpacity="0.5" />
          <stop offset="55%" stopColor="#2f54eb" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#2f54eb" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="aaHubCore" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8ea6ff" />
          <stop offset="100%" stopColor="#2f54eb" />
        </linearGradient>
        <pattern id="aaGrid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(140,166,228,0.09)" strokeWidth="1" />
        </pattern>
      </defs>

      <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="url(#aaGrid)" />

      <text x="8" y="18" fill="#6c7db0" fontFamily={MONO} fontSize="9.5" letterSpacing="1.6">
        AGENTS
      </text>
      <text
        x={WIDTH - 8}
        y="18"
        fill="#6c7db0"
        fontFamily={MONO}
        fontSize="9.5"
        textAnchor="end"
        letterSpacing="1.6"
      >
        TOOL SURFACE
      </text>

      <circle cx={HUB.x} cy={HUB.y} r="104" fill="url(#aaHubGlow)" />

      {ROWS.map((y, i) => (
        <g key={`left-${y}`}>
          <path
            d={leftPath(y)}
            fill="none"
            stroke="rgba(122,148,255,0.45)"
            strokeWidth="1.2"
            strokeDasharray="3 5"
          />
          <FlowDot path={leftPath(y)} color="#8ea6ff" delay={i * 0.9} reduceMotion={reduceMotion} />
        </g>
      ))}

      {ROWS.map((y, i) => (
        <g key={`right-${y}`}>
          <path
            d={rightPath(y)}
            fill="none"
            stroke="rgba(112,205,224,0.4)"
            strokeWidth="1.2"
            strokeDasharray="3 5"
          />
          <FlowDot path={rightPath(y)} color="#7fd8ea" delay={1.4 + i * 0.9} reduceMotion={reduceMotion} />
        </g>
      ))}

      {/* rotating policy ring */}
      <g>
        <circle
          cx={HUB.x}
          cy={HUB.y}
          r="34"
          fill="none"
          stroke="rgba(142,166,255,0.5)"
          strokeWidth="1"
          strokeDasharray="2 6"
        >
          {!reduceMotion && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`0 ${HUB.x} ${HUB.y}`}
              to={`360 ${HUB.x} ${HUB.y}`}
              dur="26s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        <circle cx={HUB.x} cy={HUB.y} r="23" fill="rgba(18,28,58,0.9)" stroke="rgba(160,182,255,0.35)" />
        <circle cx={HUB.x} cy={HUB.y} r="11" fill="url(#aaHubCore)" />
        <text
          x={HUB.x}
          y={HUB.y + 54}
          fill="#8595bf"
          fontFamily={MONO}
          fontSize="9.5"
          textAnchor="middle"
          letterSpacing="1.4"
        >
          POLICY ROUTER
        </text>
      </g>

      {ROWS.map((y, i) =>
        left[i] ? (
          <NodeChip key={`ln-${y}`} x="76" y={y} label={left[i]} side="left" tone={agentTone} />
        ) : (
          <NodeChipFallback key={`lnf-${y}`} x="76" y={y} side="left" tone={agentTone} label="agent" />
        ),
      )}

      {ROWS.map((y, i) =>
        right[i] ? (
          <NodeChip key={`rn-${y}`} x={WIDTH - 76} y={y} label={right[i]} side="right" tone={toolTone} />
        ) : (
          <NodeChipFallback key={`rnf-${y}`} x={WIDTH - 76} y={y} side="right" tone={toolTone} label="tool" />
        ),
      )}
    </svg>
  );
};

export default HeroNetwork;
