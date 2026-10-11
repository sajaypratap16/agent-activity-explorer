"use client";

import { useRef, useEffect, useState } from "react";
import { Table, Tag, Empty, Tooltip } from "antd";
import { formatTimestamp, formatLatency, getStatusConfig, truncateText } from "../lib/format";

const MONO = '"SF Mono", "Monaco", "Inconsolata", "Fira Mono", "Droid Sans Mono", monospace';

const columns = [
  {
    title: "Timestamp",
    dataIndex: "timestamp",
    key: "timestamp",
    width: 190,
    fixed: "left",
    render: (text) => (
      <Tooltip title={formatTimestamp(text)}>
        <span
          style={{
            fontFamily: MONO,
            fontSize: 12,
            color: "#334155",
            whiteSpace: "nowrap",
          }}
        >
          {formatTimestamp(text)}
        </span>
      </Tooltip>
    ),
  },
  {
    title: "Agent",
    dataIndex: "agent",
    key: "agent",
    width: 170,
    fixed: "left",
    render: (text) => (
      <span style={{ fontWeight: 500, color: "#0f172a" }}>{text}</span>
    ),
  },
  {
    title: "Tool",
    dataIndex: "tool",
    key: "tool",
    width: 240,
    ellipsis: true,
    render: (text) => (
      <Tooltip title={text}>
        <code
          style={{
            fontFamily: MONO,
            fontSize: 12,
            background: "#f1f5f9",
            padding: "2px 6px",
            borderRadius: 4,
            color: "#334155",
          }}
        >
          {truncateText(text, 70)}
        </code>
      </Tooltip>
    ),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 104,
    align: "center",
    render: (text) => {
      const config = getStatusConfig(text);
      return (
        <Tag color={config.color} style={{ fontWeight: 500, fontSize: 11.5, lineHeight: "18px", marginInlineEnd: 0 }}>
          {config.label}
        </Tag>
      );
    },
  },
  {
    title: "Latency",
    dataIndex: "latencyMs",
    key: "latencyMs",
    width: 110,
    align: "right",
    render: (text) => (
      <span
        style={{
          fontFamily: MONO,
          fontSize: 12,
          fontWeight: 500,
          color: "#475569",
        }}
      >
        {formatLatency(text)}
      </span>
    ),
  },
];

const HEADER_ROW_HEIGHT = 40;

const EventTable = ({ data = [], loading = false, onRowClick, selectedRowKey }) => {
  const frameRef = useRef(null);
  const [bodyHeight, setBodyHeight] = useState(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;

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
  }, []);

  return (
    <div
      ref={frameRef}
      style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}
    >
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={false}
        size="small"
        sticky={{ header: true, offsetHeader: 0 }}
        scroll={{ y: bodyHeight ?? undefined, x: 1000 }}
        onRow={(record) => ({
          onClick: () => onRowClick?.(record),
          style: { cursor: "pointer" },
          className: selectedRowKey === record.id ? "selected-row" : "",
        })}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span style={{ color: "#64748b", fontSize: 13 }}>
                  No events match the current search and filters.
                </span>
              }
              style={{ padding: "48px 0" }}
            />
          ),
        }}
      />
    </div>
  );
};

export default EventTable;
