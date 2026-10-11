"use client";

import { Input, Select, Space, Button, Typography } from "antd";
import { SearchOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

const statusOptions = [
  { value: "ok", label: "OK" },
  { value: "blocked", label: "Blocked" },
  { value: "error", label: "Error" },
];

const labelStyle = {
  fontSize: 12,
  color: "#64748b",
  fontWeight: 500,
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
  const hasActiveFilters = agent || status;

  return (
    <Space
      wrap
      align="center"
      size={12}
      style={{
        display: "flex",
        width: "100%",
        background: "#ffffff",
        border: "1px solid #e3e8ef",
        borderRadius: 8,
        padding: "10px 12px",
        boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
        justifyContent: "space-between",
      }}
    >
      <Space size={16} align="center" wrap style={{ flex: "1 1 380px", minWidth: 0 }}>
        <label htmlFor="search-input" style={{ ...labelStyle, display: "flex", alignItems: "center" }}>
          Search
        </label>
        <Input.Search
          id="search-input"
          placeholder="Search tool calls… (agent, tool, args)"
          value={q}
          allowClear
          enterButton
          prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
          onChange={(e) => onSearch?.(e.target.value)}
          onSearch={onSearch}
          style={{ flex: "1 1 260px", minWidth: 180, maxWidth: 480 }}
        />
      </Space>

      <Space size={8} align="center" wrap>
        <label htmlFor="agent-filter" style={{ ...labelStyle, display: "flex", alignItems: "center" }}>
          Agent
        </label>
        <Select
          id="agent-filter"
          placeholder="All agents"
          value={agent || undefined}
          style={{ width: 160 }}
          onChange={onAgentChange}
          allowClear
          options={agentOptions}
        />

        <label htmlFor="status-filter" style={{ ...labelStyle, display: "flex", alignItems: "center" }}>
          Status
        </label>
        <Select
          id="status-filter"
          placeholder="All statuses"
          value={status || undefined}
          style={{ width: 130 }}
          onChange={onStatusChange}
          allowClear
          options={statusOptions}
        />

        {hasActiveFilters && (
          <Button
            type="text"
            size="small"
            icon={<CloseCircleOutlined />}
            onClick={onClearFilters}
            style={{ color: "#64748b" }}
          >
            Clear
          </Button>
        )}
      </Space>
    </Space>
  );
};

export default SearchFilters;
