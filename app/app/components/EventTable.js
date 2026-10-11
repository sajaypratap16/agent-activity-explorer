"use client";

import { useRef, useEffect, useState } from "react";
import { Table, Empty, Tooltip, Flex, Typography } from "antd";
import { formatTimestamp, formatTimestampParts, formatLatency, truncateText } from "../lib/format";
import StatusBadge from "./StatusBadge";

const { Text } = Typography;

const MONO = '"SF Mono", "Monaco", "Inconsolata", "Fira Mono", "Droid Sans Mono", monospace';

const headerTitle = (label) => (
  <span
    style={{
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "#6b7080",
    }}
  >
    {label}
  </span>
);

const latencyTone = (ms) => {
  if (ms === null || ms === undefined) return "#9aa0ae";
  if (ms >= 2000) return "#b3261e";
  if (ms >= 800) return "#a15c09";
  return "#3f4761";
};

const TimestampCell = ({ value }) => {
  const { date, time } = formatTimestampParts(value);
  return (
    <Tooltip title={formatTimestamp(value)} mouseEnterDelay={0.2}>
      <Flex vertical style={{ lineHeight: 1.25 }}>
        <Text style={{ fontSize: 10.5, color: "#9aa0ae", letterSpacing: "0.02em" }}>{date}</Text>
        <Text
          style={{
            fontFamily: MONO,
            fontSize: 12.5,
            color: "#1b2130",
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
          }}
        >
          {time}
        </Text>
      </Flex>
    </Tooltip>
  );
};

const ToolCell = ({ value }) => (
  <Tooltip title={value} mouseEnterDelay={0.2}>
    <span
      style={{
        fontFamily: MONO,
        fontSize: 12,
        color: "#28304a",
        background: "#f4f4f1",
        border: "1px solid #e7e6e0",
        padding: "1px 6px",
        borderRadius: 5,
        whiteSpace: "nowrap",
      }}
    >
      {truncateText(value, 40)}
    </span>
  </Tooltip>
);

const InputCell = ({ value }) => {
  if (value === null || value === undefined || value === "") {
    return <Text style={{ color: "#b3b7c1", fontSize: 12 }}>—</Text>;
  }
  return (
    <Tooltip title={<span style={{ fontFamily: MONO, fontSize: 12 }}>{value}</span>} mouseEnterDelay={0.2}>
      <span
        style={{
          fontFamily: MONO,
          fontSize: 11.5,
          color: "#7b8090",
          display: "block",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </span>
    </Tooltip>
  );
};

const LatencyCell = ({ value }) => {
  const tone = latencyTone(value);
  const ratio = value === null || value === undefined ? 0 : Math.min(1, value / 2000);
  return (
    <Flex align="center" justify="flex-end" gap={9}>
      <span
        aria-hidden
        style={{
          position: "relative",
          width: 34,
          height: 3,
          borderRadius: 2,
          background: "#ecebe6",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: 0,
            width: `${Math.max(8, ratio * 100)}%`,
            background: tone,
            opacity: 0.7,
            borderRadius: 2,
          }}
        />
      </span>
      <Text
        style={{
          fontFamily: MONO,
          fontSize: 12.5,
          fontWeight: 500,
          color: tone,
          fontVariantNumeric: "tabular-nums",
          minWidth: 58,
          textAlign: "right",
        }}
      >
        {formatLatency(value)}
      </Text>
    </Flex>
  );
};

const columns = [
  {
    title: headerTitle("Timestamp"),
    dataIndex: "timestamp",
    key: "timestamp",
    width: 136,
    fixed: "left",
    render: (value) => <TimestampCell value={value} />,
  },
  {
    title: headerTitle("Agent"),
    dataIndex: "agent",
    key: "agent",
    width: 168,
    render: (text) => (
      <Text style={{ fontWeight: 550, fontSize: 12.5, color: "#111726", whiteSpace: "nowrap" }}>
        {text}
      </Text>
    ),
  },
  {
    title: headerTitle("Tool"),
    dataIndex: "tool",
    key: "tool",
    width: 196,
    render: (value) => <ToolCell value={value} />,
  },
  {
    title: headerTitle("Input"),
    dataIndex: "argsPreview",
    key: "argsPreview",
    width: 300,
    render: (value) => <InputCell value={value} />,
  },
  {
    title: headerTitle("Status"),
    dataIndex: "status",
    key: "status",
    width: 110,
    render: (text) => <StatusBadge status={text} size="small" />,
  },
  {
    title: headerTitle("Latency"),
    dataIndex: "latencyMs",
    key: "latencyMs",
    width: 148,
    align: "right",
    render: (value) => <LatencyCell value={value} />,
  },
];

const HEADER_ROW_HEIGHT = 38;

const EventTable = ({
  data = [],
  loading = false,
  onRowClick,
  selectedRowKey,
  hasFilters = false,
  hasError = false,
  fixedHeight = true,
}) => {
  const frameRef = useRef(null);
  const [bodyHeight, setBodyHeight] = useState(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !fixedHeight) return undefined;

    const measure = () => {
      const available = Math.floor(frame.getBoundingClientRect().height) - HEADER_ROW_HEIGHT;
      setBodyHeight(Math.max(120, available));
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [fixedHeight]);

  return (
    <div
      ref={frameRef}
      style={{
        flex: fixedHeight ? 1 : "none",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflow: fixedHeight ? "hidden" : "visible",
      }}
    >
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={false}
        size="small"
        sticky={{ header: true, offsetHeader: 0 }}
        scroll={{ y: fixedHeight ? bodyHeight ?? undefined : undefined, x: 1060 }}
        onRow={(record) => ({
          onClick: () => onRowClick?.(record),
          className:
            selectedRowKey === record.id ? "aa-row aa-row-selected" : "aa-row",
        })}
        locale={{
          emptyText: hasError ? null : (
            <Flex vertical align="center" gap={6} style={{ padding: "44px 0" }}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                styles={{ image: { height: 46 } }}
                description={null}
              />
              <Text style={{ color: "#5b6172", fontSize: 13, fontWeight: 550 }}>
                {hasFilters ? "No events match these filters" : "No events available"}
              </Text>
              <Text style={{ color: "#9aa0ae", fontSize: 12 }}>
                {hasFilters
                  ? "Adjust the search or clear a filter to widen the result set."
                  : "New tool calls will appear here as agents run."}
              </Text>
            </Flex>
          ),
        }}
      />
    </div>
  );
};

export default EventTable;
