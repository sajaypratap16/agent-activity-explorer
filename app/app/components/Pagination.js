"use client";

import { Pagination, Space, Typography, Button } from "antd";

const { Text } = Typography;

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

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 16px",
        borderTop: "1px solid #eef1f6",
        background: "#fafbfc",
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      <Space size={6} align="center">
        <Button
          type="text"
          size="small"
          disabled={loading || current <= 1 || !onPrev}
          onClick={onPrev}
          aria-label="Previous page"
        >
          Previous
        </Button>
        <Text type="secondary" style={{ fontSize: 12.5 }}>
          Page {current}
        </Text>
        <Button
          type="text"
          size="small"
          disabled={loading || !hasNextPage || !onNext}
          onClick={onNext}
          aria-label="Next page"
        >
          Next
        </Button>
      </Space>

      <Space align="center" size={12}>
        {showSizeChanger && (
          <Space align="center" size={6}>
            <Text type="secondary" style={{ fontSize: 12.5 }}>
              Page size
            </Text>
            <Pagination
              current={1}
              total={total}
              pageSize={pageSize}
              onChange={() => {}}
              onShowSizeChange={(_, size) => onPageSizeChange?.(size)}
              showSizeChanger
              showTotal={false}
              showQuickJumper={false}
              showLessItems={false}
              size="small"
              simple
              itemRender={(page, type, originalElement) => {
                if (type === "page") return null;
                return originalElement;
              }}
            />
          </Space>
        )}

        <Text type="secondary" style={{ fontSize: 12.5 }}>
          {total.toLocaleString()} total events
        </Text>
      </Space>
    </div>
  );
};

export default PaginationBar;
