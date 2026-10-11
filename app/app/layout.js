import "antd/dist/reset.css";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { Suspense } from "react";
import { ConfigProvider, App } from "antd";

const theme = {
  token: {
    colorPrimary: "#2563eb",
    colorInfo: "#2563eb",
    colorSuccess: "#16a34a",
    colorWarning: "#d97706",
    colorError: "#dc2626",
    colorBgBase: "#f4f6f9",
    colorBgContainer: "#ffffff",
    colorBorder: "#e3e8ef",
    colorSplit: "#eef1f6",
    colorTextBase: "#0f172a",
    colorTextSecondary: "#64748b",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 13,
    borderRadius: 6,
    controlHeight: 32,
    boxShadow: "0 1px 2px rgba(15, 23, 42, 0.06)",
    boxShadowSecondary: "0 12px 32px rgba(15, 23, 42, 0.14)",
  },
  components: {
    Layout: {
      headerBg: "#0f172a",
      headerHeight: 52,
      headerPadding: "0 24px",
    },
    Card: {
      paddingLG: 16,
      headerFontSize: 14,
    },
    Table: {
      headerBg: "#f8fafc",
      headerColor: "#475569",
      rowHoverBg: "#f1f5f9",
      borderColor: "#eef1f6",
      paddingContentHorizontal: 12,
      paddingContentVertical: 7,
    },
    Input: {
      paddingInline: 10,
    },
    Select: {
      optionSelectedBg: "#e8effd",
    },
    Button: {
      borderRadius: 6,
      primaryShadow: "none",
    },
    Tag: {
      fontSize: 12,
      lineHeight: 18,
    },
    Pagination: {
      itemSize: 28,
      itemActiveBg: "#2563eb",
    },
    Alert: {
      borderRadius: 8,
    },
    Drawer: {
      headerBg: "#ffffff",
      headerHeight: 56,
      bodyPadding: 20,
    },
  },
};

export const metadata = {
  title: "Agent Activity Explorer",
  description: "Explore agent tool calls and activity",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ConfigProvider theme={theme}>
          <App>
            <ClientLayout>
              <Suspense fallback={<div style={{ padding: 24, textAlign: "center", color: "#64748b" }}>Loading...</div>}>
                {children}
              </Suspense>
            </ClientLayout>
          </App>
        </ConfigProvider>
      </body>
    </html>
  );
}
