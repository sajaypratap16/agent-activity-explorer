"use client";

import { Flex, Typography, Button, Select, Tooltip } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";

const { Text } = Typography;

const MONO = '"SF Mono", "Monaco", "Inconsolata", "Fira Mono", "Droid Sans Mono", monospace';

const PAGE_SIZE_OPTIONS = [25, 50, 100, 200].map((value) => ({ value, label: String(value) }));

const PaginationBar = ({
  current = 1,
  total = 0,
  pageSize = 50,
  hasNextPage = false,
  onNext,
  onPrev,
  onPageSizeChange,
  loading = false,
  showSizeChanger = true,
}) => {
  if (total === 0) return null;

  const label = { fontSize: 12, color: "#8b8f9c" };

  return (
    <Flex
      align="center"
      justify="space-between"
      wrap
      gap={10}
      style={{
        padding: "8px 14px",
        borderTop: "1px solid #edece7",
        background: "#faf9f6",
      }}
    >
      <Flex align="center" gap={8}>
        <Tooltip title="Previous page">
          <Button
            size="small"
            type="text"
            disabled={loading || current <= 1 || !onPrev}
            onClick={onPrev}
            icon={<ArrowLeftOutlined />}
            aria-label="Previous page"
          />
        </Tooltip>
        <Text
          style={{
            fontFamily: MONO,
            fontSize: 12,
            fontWeight: 550,
            color: "#3f4761",
            minWidth: 62,
            textAlign: "center",
          }}
        >
          Page {current}
        </Text>
        <Tooltip title="Next page">
          <Button
            size="small"
            type="text"
            disabled={loading || !hasNextPage || !onNext}
            onClick={onNext}
            icon={<ArrowRightOutlined />}
            aria-label="Next page"
          />
        </Tooltip>
      </Flex>

      <Flex align="center" gap={14} wrap>
        {showSizeChanger && (
          <Flex align="center" gap={7}>
            <Text style={label}>Rows</Text>
            <Select
              size="small"
              value={pageSize}
              onChange={(size) => onPageSizeChange?.(size)}
              options={PAGE_SIZE_OPTIONS}
              disabled={loading}
              style={{ width: 100 }}
            />
          </Flex>
        )}
        <Text style={label}>
          <span style={{ fontFamily: MONO, color: "#3f4761", fontWeight: 550 }}>
            {total.toLocaleString()}
          </span>{" "}
          events matched
        </Text>
      </Flex>
    </Flex>
  );
};

export default PaginationBar;
