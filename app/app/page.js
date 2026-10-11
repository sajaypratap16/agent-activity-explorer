"use client";

import { Layout } from "antd";
import EventExplorer from "./components/EventExplorer";

export default function Home() {
  return (
    <Layout style={{ minHeight: "100vh", background: "#f4f6f9" }}>
      <EventExplorer />
    </Layout>
  );
}
