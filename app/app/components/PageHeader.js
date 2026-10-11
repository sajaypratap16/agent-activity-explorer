"use client";

import { Typography, Flex } from "antd";
import { getStatusMeta } from "./StatusBadge";

const { Title, Text } = Typography;

const MONO = '"SF Mono", "Monaco", "Inconsolata", "Fira Mono", "Droid Sans Mono", monospace';

const StatusCount = ({ status, value }) => {
  const config = getStatusMeta(status);
  const { Icon } = config;
  return (
    <Flex align="center" gap={7}>
      <Flex
        align="center"
        justify="center"
        style={{
          width: 17,
          height: 17,
          borderRadius: 5,
          background: config.bg,
          border: `1px solid ${config.border}`,
          color: config.color,
          flexShrink: 0,
        }}
      >
        <Icon style={{ fontSize: 9 }} />
      </Flex>
      <Text style={{ color: "#6b7080", fontSize: 12 }}>{config.label}</Text>
      <Text style={{ fontFamily: MONO, fontSize: 12.5, fontWeight: 600, color: "#1b2130" }}>{value}</Text>
    </Flex>
  );
};

const PageHeader = ({
  totalEvents = 0,
  loadedCount = 0,
  statusCounts = {},
  uniqueAgents = 0,
  hasActiveFilters = false,
  activeFilterLabel = "all agents · all statuses",
}) => {
  return (
    <Flex
      align="flex-end"
      justify="space-between"
      gap={16}
      wrap
      style={{ width: "100%", paddingTop: 2 }}
    >
      <Flex vertical gap={3} style={{ minWidth: 0 }}>
        <Flex align="center" gap={10} wrap>
          <Title
            level={3}
            style={{
              margin: 0,
              color: "#111726",
              fontWeight: 650,
              fontSize: 19,
              letterSpacing: "-0.015em",
            }}
          >
            Event stream
          </Title>
          <span
            style={{
              fontFamily: MONO,
              fontSize: 11.5,
              color: "#5b6172",
              background: "#efeee9",
              border: "1px solid #e2e1da",
              borderRadius: 999,
              padding: "1px 9px",
              lineHeight: "17px",
            }}
          >
            {totalEvents.toLocaleString()} matched
          </span>
        </Flex>
        <Text style={{ fontSize: 12.5, color: "#6b7080" }}>
          {loadedCount > 0
            ? `Showing ${loadedCount.toLocaleString()} loaded · ${activeFilterLabel}`
            : `No events loaded · ${activeFilterLabel}`}
          {hasActiveFilters ? "" : ` · ${uniqueAgents} agents in window`}
        </Text>
      </Flex>

      <Flex
        align="center"
        gap={18}
        wrap
        style={{
          padding: "7px 14px",
          background: "#ffffff",
          border: "1px solid #e5e4de",
          borderRadius: 8,
        }}
      >
        <StatusCount status="ok" value={statusCounts.ok || 0} />
        <span aria-hidden style={{ width: 1, height: 16, background: "#e5e4de" }} />
        <StatusCount status="blocked" value={statusCounts.blocked || 0} />
        <span aria-hidden style={{ width: 1, height: 16, background: "#e5e4de" }} />
        <StatusCount status="error" value={statusCounts.error || 0} />
      </Flex>
    </Flex>
  );
};

export default PageHeader;
