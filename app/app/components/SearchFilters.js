"use client";

import { Input, Select, Button, Flex, Tag, Typography } from "antd";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";

const { Text } = Typography;

const MONO = '"SF Mono", "Monaco", "Inconsolata", "Fira Mono", "Droid Sans Mono", monospace';

const statusOptions = [
  { value: "ok", label: "OK" },
  { value: "blocked", label: "Blocked" },
  { value: "error", label: "Error" },
];

const labelStyle = {
  fontFamily: MONO,
  fontSize: 10.5,
  letterSpacing: "0.09em",
  textTransform: "uppercase",
  color: "#8b8f9c",
  whiteSpace: "nowrap",
};

const SearchFilters = ({
  agents = [],
  q = "",
  agent = undefined,
  status = undefined,
  onSearch,
  onAgentChange,
  onStatusChange,
  onClearFilters,
}) => {
  const agentOptions = agents.map((a) => ({ value: a, label: a }));
  const hasActiveFilters = Boolean(agent || status);

  return (
    <Flex
      vertical
      gap={8}
      style={{
        width: "100%",
        background: "#ffffff",
        border: "1px solid #e5e4de",
        borderRadius: 10,
        padding: "10px 12px",
      }}
    >
      <Flex align="center" gap={12} wrap style={{ width: "100%" }}>
        <Flex align="center" gap={8} style={{ flex: "1 1 300px", minWidth: 0 }}>
          <span id="aa-search-label" style={labelStyle}>
            Search
          </span>
          <Input.Search
            aria-labelledby="aa-search-label"
            placeholder="Tool, agent or argument…"
            value={q}
            allowClear
            prefix={<SearchOutlined style={{ color: "#a9adb8" }} />}
            onChange={(e) => onSearch?.(e.target.value)}
            onSearch={onSearch}
            style={{ flex: 1, maxWidth: 460, minWidth: 160 }}
          />
        </Flex>

        <Flex align="center" gap={10} wrap style={{ marginLeft: "auto" }}>
          <Flex align="center" gap={8}>
            <span id="aa-agent-label" style={labelStyle}>
              Agent
            </span>
            <Select
              aria-labelledby="aa-agent-label"
              placeholder="All agents"
              value={agent || undefined}
              style={{ width: 170 }}
              onChange={onAgentChange}
              allowClear
              showSearch
              optionFilterProp="label"
              options={agentOptions}
            />
          </Flex>

          <Flex align="center" gap={8}>
            <span id="aa-status-label" style={labelStyle}>
              Status
            </span>
            <Select
              aria-labelledby="aa-status-label"
              placeholder="All statuses"
              value={status || undefined}
              style={{ width: 140 }}
              onChange={onStatusChange}
              allowClear
              options={statusOptions}
            />
          </Flex>
        </Flex>
      </Flex>

      {hasActiveFilters && (
        <Flex align="center" gap={6} wrap style={{ paddingTop: 8, borderTop: "1px solid #edece7" }}>
          <Text style={{ ...labelStyle, color: "#6b7080" }}>Active</Text>
          {agent && (
            <Tag
              closable
              onClose={() => onAgentChange?.("")}
              closeIcon={<CloseOutlined style={{ fontSize: 9 }} />}
              style={{
                marginInlineEnd: 0,
                background: "#eef1fe",
                border: "1px solid #d5ddfb",
                color: "#2743c4",
                fontFamily: MONO,
                fontSize: 11.5,
              }}
            >
              agent: {agent}
            </Tag>
          )}
          {status && (
            <Tag
              closable
              onClose={() => onStatusChange?.("")}
              closeIcon={<CloseOutlined style={{ fontSize: 9 }} />}
              style={{
                marginInlineEnd: 0,
                background: "#efeee9",
                border: "1px solid #dedcd3",
                color: "#4b4f5c",
                fontFamily: MONO,
                fontSize: 11.5,
              }}
            >
              status: {status}
            </Tag>
          )}
          <Button type="link" size="small" onClick={onClearFilters} style={{ paddingInline: 4 }}>
            Clear all
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default SearchFilters;
