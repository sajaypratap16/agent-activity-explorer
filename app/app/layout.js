import "antd/dist/reset.css";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { Suspense } from "react";
import { ConfigProvider, App } from "antd";

// Shared palette between the dark technical hero and the light operational workspace.
// Warm neutrals + a confident electric blue keep the two zones feeling like one product.
const theme = {
  token: {
    colorPrimary: "#2f54eb",
    colorInfo: "#2f54eb",
    colorSuccess: "#15803d",
    colorWarning: "#b45309",
    colorError: "#c02626",
    colorBgBase: "#f6f6f3",
    colorBgContainer: "#ffffff",
    colorBgElevated: "#ffffff",
    colorBorder: "#e5e4de",
    colorBorderSecondary: "#edece7",
    colorSplit: "#eceae4",
    colorTextBase: "#111726",
    colorText: "#1b2130",
    colorTextSecondary: "#5b6172",
    colorTextTertiary: "#8b8f9c",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 13,
    borderRadius: 7,
    borderRadiusLG: 10,
    controlHeight: 32,
    boxShadow: "0 1px 2px rgba(17, 23, 38, 0.05)",
    boxShadowSecondary: "0 18px 48px rgba(10, 16, 32, 0.18)",
    lineWidth: 1,
  },
  components: {
    Layout: {
      headerBg: "#080e1f",
      headerHeight: 52,
      headerPadding: "0 24px",
      bodyBg: "#f6f6f3",
    },
    Card: {
      paddingLG: 16,
      headerFontSize: 14,
    },
    Table: {
      headerBg: "#faf9f6",
      headerColor: "#6b7080",
      headerSplitColor: "transparent",
      rowHoverBg: "#f7f8fc",
      borderColor: "#edece7",
      paddingContentHorizontal: 12,
      paddingContentVertical: 6,
      cellFontSize: 13,
    },
    Input: {
      paddingInline: 10,
      activeShadow: "0 0 0 3px rgba(47, 84, 235, 0.10)",
    },
    Select: {
      optionSelectedBg: "#eef1fe",
    },
    Button: {
      borderRadius: 7,
      primaryShadow: "none",
      defaultShadow: "none",
    },
    Tag: {
      fontSize: 12,
      lineHeight: 18,
    },
    Pagination: {
      itemSize: 28,
      itemActiveBg: "#2f54eb",
    },
    Alert: {
      borderRadius: 8,
    },
    Drawer: {
      headerBg: "#ffffff",
      headerHeight: 58,
      bodyPadding: 20,
    },
    Tooltip: {
      colorBgSpotlight: "#0d1428",
    },
  },
};

export const metadata = {
  title: "Agent Activity Explorer",
  description: "Observe agent activity, tool calls, latency and policy outcomes in one view",
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
              <Suspense
                fallback={
                  <div style={{ padding: 24, textAlign: "center", color: "#5b6172" }}>Loading…</div>
                }
              >
                {children}
              </Suspense>
            </ClientLayout>
          </App>
        </ConfigProvider>
      </body>
    </html>
  );
}
