"use client";

import { useEffect, useCallback, useState } from "react";
import { Drawer, Descriptions, Tag, Flex, Button, Typography, Alert, Spin } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

const MONO = '"SF Mono", "Monaco", "Inconsolata", "Fira Mono", "Droid Sans Mono", monospace';

const formatJson = (obj) => {
  if (obj === null || obj === undefined) return "—";
  if (typeof obj === "string") {
    try {
      const parsed = JSON.parse(obj);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return obj;
    }
  }
  return JSON.stringify(obj, null, 2);
};

const formatTimestamp = (iso) => {
  if (!iso) return "—";
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
};

const formatLatency = (ms) => {
  if (ms === null || ms === undefined) return "—";
  if (ms < 1000) return `${ms} ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)} s`;
  return `${(ms / 60000).toFixed(1)} min`;
};

const StatusTag = ({ status }) => {
  const statusConfig = {
    ok: { color: "success", text: "OK" },
    blocked: { color: "warning", text: "Blocked" },
    error: { color: "error", text: "Error" },
  };
  const config = statusConfig[status] || { color: "default", text: status };
  return (
    <Tag color={config.color} style={{ marginInlineEnd: 0, fontWeight: 500 }}>
      {config.text}
    </Tag>
  );
};

const SectionLabel = ({ children, copyText }) => (
  <Flex align="center" justify="space-between" style={{ marginBottom: 8 }}>
    <Text
      style={{
        fontSize: 11.5,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: "#64748b",
      }}
    >
      {children}
    </Text>
    {copyText ? (
      <Text copyable={{ text: copyText, tooltips: ["Copy", "Copied"] }} style={{ fontSize: 12, color: "#94a3b8" }} />
    ) : null}
  </Flex>
);

const JsonPanel = ({ json }) => (
  <pre
    style={{
      margin: 0,
      maxHeight: 320,
      overflow: "auto",
      background: "#0f172a",
      border: "1px solid #1e293b",
      borderRadius: 6,
      padding: "12px 14px",
      fontSize: 12,
      lineHeight: 1.65,
      fontFamily: MONO,
      color: "#e2e8f0",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
    }}
  >
    {json}
  </pre>
);

const EventDetailDrawer = ({
  open = false,
  event = null,
  loading = false,
  error = null,
  onClose,
}) => {
  const [mounted, setMounted] = useState(false);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") {
      onClose?.();
    }
  }, [onClose]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  if (!mounted || !open) return null;

  const headerTitle = (
    <Flex vertical gap={2} style={{ paddingTop: 2 }}>
      <Text strong style={{ fontSize: 15, color: "#0f172a", lineHeight: 1.3 }}>
        Event details
      </Text>
      {event?.id ? (
        <Text style={{ fontSize: 11.5, color: "#94a3b8", fontFamily: MONO, lineHeight: 1.3 }}>
          {event.id}
        </Text>
      ) : null}
    </Flex>
  );

  const drawerProps = {
    title: headerTitle,
    placement: "right",
    open,
    onClose,
    size: 560,
    closable: true,
    keyboard: true,
    styles: {
      header: { padding: "12px 20px", borderBottom: "1px solid #eef1f6" },
      body: { padding: 20 },
    },
  };

  if (loading) {
    return (
      <Drawer {...drawerProps}>
        <Flex vertical align="center" justify="center" gap={10} style={{ minHeight: 240 }}>
          <Spin />
          <Text type="secondary" style={{ fontSize: 13 }}>
            Loading event…
          </Text>
        </Flex>
      </Drawer>
    );
  }

  if (error) {
    return (
      <Drawer {...drawerProps}>
        <Alert
          title="Failed to load event"
          description={error.message || "Unknown error"}
          type="error"
          showIcon
          icon={<ExclamationCircleOutlined />}
          action={<Button size="small" onClick={onClose}>Close</Button>}
        />
      </Drawer>
    );
  }

  if (!event) {
    return (
      <Drawer {...drawerProps}>
        <Alert
          title="Event not found"
          description="The requested event could not be found or has been removed."
          type="warning"
          showIcon
          action={<Button size="small" onClick={onClose}>Close</Button>}
        />
      </Drawer>
    );
  }

  const metaItems = [];

  if (event.id) {
    metaItems.push({
      key: "id",
      label: "Event ID",
      children: (
        <Text
          copyable={{ text: event.id, tooltips: ["Copy", "Copied"] }}
          style={{ fontFamily: MONO, fontSize: 12.5, color: "#0f172a" }}
        >
          {event.id}
        </Text>
      ),
    });
  }

  metaItems.push({
    key: "timestamp",
    label: "Timestamp",
    children: (
      <Text style={{ fontFamily: MONO, fontSize: 12.5, color: "#334155" }}>
        {formatTimestamp(event.timestamp)}
      </Text>
    ),
  });

  if (event.agent) {
    metaItems.push({
      key: "agent",
      label: "Agent",
      children: (
        <Text
          copyable={{ text: event.agent, tooltips: ["Copy", "Copied"] }}
          style={{ fontWeight: 500, fontSize: 12.5, color: "#0f172a" }}
        >
          {event.agent}
        </Text>
      ),
    });
  }

  if (event.tool) {
    metaItems.push({
      key: "tool",
      label: "Tool",
      children: (
        <Text
          copyable={{ text: event.tool, tooltips: ["Copy", "Copied"] }}
          style={{ fontFamily: MONO, fontSize: 12.5, color: "#334155" }}
        >
          {event.tool}
        </Text>
      ),
    });
  }

  metaItems.push({
    key: "status",
    label: "Status",
    children: <StatusTag status={event.status} />,
  });

  metaItems.push({
    key: "latency",
    label: "Latency",
    children: (
      <Text style={{ fontFamily: MONO, fontSize: 12.5, color: "#334155" }}>
        {formatLatency(event.latencyMs)}
      </Text>
    ),
  });

  if (event.workspace) {
    metaItems.push({ key: "workspace", label: "Workspace", children: event.workspace });
  }

  if (event.user) {
    metaItems.push({ key: "user", label: "User", children: event.user });
  }

  return (
    <Drawer {...drawerProps}>
      <Flex vertical gap={22}>
        <Flex vertical gap={8}>
          <SectionLabel>Metadata</SectionLabel>
          <Descriptions
            column={1}
            size="small"
            colon={false}
            items={metaItems}
            styles={{
              label: { color: "#64748b", fontSize: 12.5, paddingBlock: 6 },
              content: { fontSize: 12.5, paddingBlock: 6 },
            }}
          />
        </Flex>

        <Flex vertical gap={8}>
          <SectionLabel copyText={event.args != null ? formatJson(event.args) : null}>
            Input arguments
          </SectionLabel>
          {event.args != null ? (
            <JsonPanel json={formatJson(event.args)} />
          ) : (
            <Text type="secondary" style={{ fontSize: 12.5 }}>
              No input arguments recorded for this event.
            </Text>
          )}
        </Flex>

        {event.result !== undefined && event.result !== null && (
          <Flex vertical gap={8}>
            <SectionLabel copyText={formatJson(event.result)}>Result</SectionLabel>
            <JsonPanel json={formatJson(event.result)} />
          </Flex>
        )}

        {event.policyMatches && event.policyMatches.length > 0 && (
          <Flex vertical gap={8}>
            <SectionLabel>Policy matches</SectionLabel>
            <Flex wrap gap={6}>
              {event.policyMatches.map((policy, i) => (
                <Tag key={i} color="blue" style={{ marginInlineEnd: 0 }}>
                  {policy}
                </Tag>
              ))}
            </Flex>
          </Flex>
        )}
      </Flex>
    </Drawer>
  );
};

export default EventDetailDrawer;
