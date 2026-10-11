"use client";

import { Typography } from "antd";
import { CheckOutlined, StopOutlined, CloseOutlined, MinusOutlined } from "@ant-design/icons";

const { Text } = Typography;

const MONO = '"SF Mono", "Monaco", "Inconsolata", "Fira Mono", "Droid Sans Mono", monospace';

// Each status carries a distinct glyph as well as a color, so it stays readable
// without relying on color perception alone.
export const STATUS_META = {
  ok: {
    label: "OK",
    color: "#15803d",
    bg: "#eef7f0",
    border: "#cfe6d8",
    Icon: CheckOutlined,
  },
  blocked: {
    label: "Blocked",
    color: "#a15c09",
    bg: "#fdf4e7",
    border: "#f0dcb8",
    Icon: StopOutlined,
  },
  error: {
    label: "Error",
    color: "#b3261e",
    bg: "#fdeeed",
    border: "#f3cfcb",
    Icon: CloseOutlined,
  },
  unknown: {
    label: "Unknown",
    color: "#5b6172",
    bg: "#f2f1ec",
    border: "#e0dfd8",
    Icon: MinusOutlined,
  },
};

export const getStatusMeta = (status) => STATUS_META[status] || STATUS_META.unknown;

const StatusBadge = ({ status, size = "default" }) => {
  const meta = getStatusMeta(status);
  const { Icon } = meta;
  const iconSize = size === "small" ? 9 : 10;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: meta.bg,
        border: `1px solid ${meta.border}`,
        color: meta.color,
        borderRadius: 6,
        padding: size === "small" ? "0 6px" : "1px 7px",
        lineHeight: size === "small" ? "18px" : "20px",
        whiteSpace: "nowrap",
      }}
    >
      <Icon style={{ fontSize: iconSize }} aria-hidden />
      <Text
        style={{
          color: meta.color,
          fontSize: size === "small" ? 11.5 : 12,
          fontWeight: 600,
          fontFamily: size === "small" ? MONO : undefined,
          letterSpacing: size === "small" ? "0.02em" : undefined,
        }}
      >
        {meta.label}
      </Text>
    </span>
  );
};

export default StatusBadge;
