"use client";

import { Layout, Typography, Flex } from "antd";

const { Header } = Layout;
const { Text } = Typography;

const connectionConfig = {
  connecting: { dot: "#7ea2ff", label: "Connecting" },
  connected: { dot: "#4ade80", label: "Live" },
  degraded: { dot: "#fbbf24", label: "Degraded" },
  offline: { dot: "#f87171", label: "Offline" },
};

const BrandMark = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" role="img" aria-label="Agent Activity Explorer">
    <rect x="1" y="1" width="24" height="24" rx="7" fill="#2f54eb" />
    <rect
      x="1"
      y="1"
      width="24"
      height="24"
      rx="7"
      fill="none"
      stroke="rgba(255,255,255,0.22)"
      strokeWidth="1"
    />
    <circle cx="8.5" cy="8.5" r="2.1" fill="#cfe0ff" />
    <circle cx="17.5" cy="17.5" r="2.1" fill="#ffffff" />
    <path
      d="M9.9 9.9 L16.1 16.1"
      stroke="#cfe0ff"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeDasharray="2 2.4"
    />
    <circle cx="17.5" cy="8.5" r="1.4" fill="rgba(255,255,255,0.45)" />
    <circle cx="8.5" cy="17.5" r="1.4" fill="rgba(255,255,255,0.45)" />
  </svg>
);

const HeaderBar = ({ connection = "connecting" }) => {
  const config = connectionConfig[connection] || connectionConfig.connecting;

  return (
    <Header
      style={{
        background: "#080e1f",
        borderBottom: "1px solid rgba(120, 145, 210, 0.16)",
        position: "sticky",
        top: 0,
        zIndex: 30,
        height: 52,
        lineHeight: "52px",
        padding: 0,
      }}
    >
      <Flex
        align="center"
        justify="space-between"
        gap={16}
        style={{ maxWidth: 1400, margin: "0 auto", height: "100%", padding: "0 24px" }}
      >
        <Flex align="center" gap={10} style={{ minWidth: 0 }}>
          <BrandMark />
          <Text strong style={{ color: "#f6f8ff", fontSize: 14.5, fontWeight: 600, whiteSpace: "nowrap" }}>
            Agent Activity Explorer
          </Text>
          <span
            aria-hidden
            style={{ width: 1, height: 16, background: "rgba(150,170,220,0.28)", flexShrink: 0 }}
          />
          <Text
            style={{
              color: "#93a1c4",
              fontSize: 12.5,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Tool-call observability for agent systems
          </Text>
        </Flex>

        <Flex align="center" gap={10} style={{ flexShrink: 0 }}>
          <Flex
            align="center"
            gap={7}
            style={{
              background: "rgba(255,255,255,0.045)",
              border: "1px solid rgba(150,170,220,0.22)",
              borderRadius: 999,
              padding: "3px 11px",
            }}
          >
            <span
              aria-hidden
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: config.dot,
                boxShadow: `0 0 0 3px ${config.dot}22`,
                flexShrink: 0,
              }}
            />
            <Text style={{ color: "#cdd7ee", fontSize: 12, lineHeight: 1.2 }}>{config.label}</Text>
          </Flex>
        </Flex>
      </Flex>
    </Header>
  );
};

export default HeaderBar;
