"use client";

import { useEffect, useCallback, useState } from "react";
import { Drawer, Descriptions, Tag, Flex, Button, Typography, Alert, Skeleton } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import StatusBadge from "./StatusBadge";
import { formatTimestamp, formatLatency } from "../lib/format";

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

const SectionLabel = ({ children, copyText }) => (
  <Flex align="center" justify="space-between" style={{ marginBottom: 8 }}>
    <Text
      style={{
        fontFamily: MONO,
        fontSize: 10.5,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "#6b7080",
      }}
    >
      {children}
    </Text>
    {copyText ? (
      <Text
        copyable={{ text: copyText, tooltips: ["Copy", "Copied"] }}
        style={{ fontSize: 12, color: "#9aa0ae" }}
      />
    ) : null}
  </Flex>
);

const JsonPanel = ({ json }) => (
  <pre
    style={{
      margin: 0,
      maxHeight: 300,
      overflow: "auto",
      background: "#0a1230",
      border: "1px solid rgba(120, 145, 210, 0.22)",
      borderRadius: 8,
      padding: "12px 14px",
      fontSize: 12,
      lineHeight: 1.7,
      fontFamily: MONO,
      color: "#dbe4ff",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
    }}
  >
    {json}
  </pre>
);

const MonoValue = ({ children, copyable, tone = "#1b2130", weight = 450 }) => (
  <Text
    copyable={copyable ? { text: copyable, tooltips: ["Copy", "Copied"] } : false}
    style={{ fontFamily: MONO, fontSize: 12.5, color: tone, fontWeight: weight }}
  >
    {children}
  </Text>
);

const EventDetailDrawer = ({ open = false, event = null, loading = false, error = null, onClose }) => {
  const [mounted, setMounted] = useState(false);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    },
    [onClose],
  );

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
    <Flex vertical gap={3} style={{ paddingTop: 2, minWidth: 0 }}>
      <Text
        style={{
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#9aa0ae",
        }}
      >
        Event detail
      </Text>
      <Text
        style={{
          fontFamily: MONO,
          fontSize: 12.5,
          color: "#111726",
          fontWeight: 550,
          lineHeight: 1.3,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {event?.id || "Loading…"}
      </Text>
    </Flex>
  );

  const drawerProps = {
    title: headerTitle,
    placement: "right",
    open,
    onClose,
    size: 580,
    closable: true,
    keyboard: true,
    extra: event ? <StatusBadge status={event.status} /> : null,
    styles: {
      header: {
        padding: "12px 20px",
        borderBottom: "1px solid #edece7",
        background: "#ffffff",
      },
      body: { padding: "18px 20px 24px", background: "#ffffff" },
    },
  };

  if (loading) {
    return (
      <Drawer {...drawerProps} extra={null}>
        <Flex vertical gap={18}>
          <Skeleton active title={{ width: "40%" }} paragraph={{ rows: 4 }} />
          <Skeleton active title={{ width: "28%" }} paragraph={{ rows: 3 }} />
        </Flex>
      </Drawer>
    );
  }

  if (error) {
    return (
      <Drawer {...drawerProps} extra={null}>
        <Alert
          title="Failed to load event"
          description={error.message || "Unknown error"}
          type="error"
          showIcon
          icon={<ExclamationCircleOutlined />}
          action={
            <Button size="small" onClick={onClose}>
              Close
            </Button>
          }
        />
      </Drawer>
    );
  }

  if (!event) {
    return (
      <Drawer {...drawerProps} extra={null}>
        <Alert
          title="Event not found"
          description="The requested event could not be found or has been removed."
          type="warning"
          showIcon
          action={
            <Button size="small" onClick={onClose}>
              Close
            </Button>
          }
        />
      </Drawer>
    );
  }

  const metaItems = [];

  if (event.id) {
    metaItems.push({
      key: "id",
      label: "Event ID",
      children: <MonoValue copyable={event.id}>{event.id}</MonoValue>,
    });
  }

  metaItems.push({
    key: "timestamp",
    label: "Timestamp",
    children: <MonoValue tone="#3f4761">{formatTimestamp(event.timestamp)}</MonoValue>,
  });

  if (event.agent) {
    metaItems.push({
      key: "agent",
      label: "Agent",
      children: <MonoValue weight={550}>{event.agent}</MonoValue>,
    });
  }

  if (event.tool) {
    metaItems.push({
      key: "tool",
      label: "Tool",
      children: <MonoValue tone="#3f4761">{event.tool}</MonoValue>,
    });
  }

  metaItems.push({
    key: "status",
    label: "Status",
    children: <StatusBadge status={event.status} />,
  });

  metaItems.push({
    key: "latency",
    label: "Latency",
    children: <MonoValue tone="#3f4761">{formatLatency(event.latencyMs)}</MonoValue>,
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
            bordered
            colon={false}
            items={metaItems}
            styles={{
              label: {
                color: "#6b7080",
                fontSize: 12,
                paddingBlock: 7,
                background: "#faf9f6",
                width: 116,
              },
              content: { fontSize: 12.5, paddingBlock: 7 },
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
            <Text style={{ color: "#9aa0ae", fontSize: 12.5 }}>
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
                <Tag
                  key={i}
                  style={{
                    marginInlineEnd: 0,
                    background: "#eef1fe",
                    border: "1px solid #d5ddfb",
                    color: "#2743c4",
                    fontFamily: MONO,
                    fontSize: 11.5,
                  }}
                >
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
