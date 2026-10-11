"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";

export default function ClientLayout({ children }) {
  return <AntdRegistry>{children}</AntdRegistry>;
}