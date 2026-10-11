"use client";

import { Layout, Typography, Space } from "antd";
import { CodeOutlined } from "@ant-design/icons";

const { Header } = Layout;
const { Text } = Typography;

const connectionConfig = {
  connecting: { dot: "#60a5fa", label: "API connecting" },
  connected: { dot: "#34d399", label: "API connected" },
  degraded: { dot: "#fbbf24", label: "API degraded" },
  offline: { dot: "#f87171", label: "API unreachable" },
};

const HeaderBar = ({ connection = "connecting" }) => {
  const config = connectionConfig[connection] || connectionConfig.connecting;

  return (
    <Header
      style={{
        background: "#0f172a",
        borderBottom: "1px solid #1e293b",
        position: "sticky",
        top: 0,
        zIndex: 20,
        height: 52,
        lineHeight: "52px",
        padding: 0,
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "0 24px",
        }}
      >
        <Space align="center" size={10}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: "#1d4ed8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <CodeOutlined style={{ color: "#ffffff", fontSize: 15 }} />
          </div>
          <Text strong style={{ color: "#f8fafc", fontSize: 15, fontWeight: 600, lineHeight: 1.2 }}>
            Agent Activity Explorer
          </Text>
          <div style={{ width: 1, height: 16, background: "#334155" }} />
          <Text style={{ color: "#94a3b8", fontSize: 12.5, lineHeight: 1.2 }}>
            Developer observability for agent tool calls
          </Text>
        </Space>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: "#1e293b",
            border: "1px solid #334155",
            borderRadius: 999,
            padding: "3px 11px",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: config.dot,
              flexShrink: 0,
            }}
          />
          <Text style={{ color: "#cbd5e1", fontSize: 12, lineHeight: 1.2 }}>{config.label}</Text>
        </div>
      </div>
    </Header>
  );
};

export default HeaderBar;
