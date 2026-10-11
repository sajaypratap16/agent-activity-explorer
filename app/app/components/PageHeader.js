"use client";

import { Typography, Flex } from "antd";

const { Title, Text } = Typography;

const PageHeader = ({ totalEvents = 0 }) => {
  return (
    <Flex vertical gap={4} style={{ width: "100%", paddingTop: 4 }}>
      <Flex align="center" gap={10} wrap>
        <Title
          level={4}
          style={{ margin: 0, color: "#0f172a", fontWeight: 650, fontSize: 20, letterSpacing: "-0.01em" }}
        >
          Agent Activity
        </Title>
        {totalEvents > 0 && (
          <Text
            style={{
              fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Fira Mono", "Droid Sans Mono", monospace',
              fontSize: 12,
              color: "#64748b",
              background: "#eef2f7",
              border: "1px solid #e3e8ef",
              borderRadius: 999,
              padding: "2px 10px",
              lineHeight: "18px",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            {totalEvents.toLocaleString()} events
          </Text>
        )}
      </Flex>
      <Text type="secondary" style={{ margin: 0, fontSize: 13, color: "#64748b", maxWidth: 900 }}>
        Inspect agent executions, tool calls and system events. Search and filter runs, then open an
        event to review its input, output and policy matches.
      </Text>
    </Flex>
  );
};

export default PageHeader;
