"use client";

import { Flex, Row, Col, Typography, Grid } from "antd";
import HeroNetwork from "./HeroNetwork";
import { formatLatency } from "../lib/format";

const { Title, Text } = Typography;

const MONO = '"SF Mono", "Monaco", "Inconsolata", "Fira Mono", "Droid Sans Mono", monospace';

const HERO_BG =
  "radial-gradient(1100px 460px at 80% -20%, rgba(66, 98, 224, 0.30), transparent 62%), radial-gradient(700px 380px at 6% 120%, rgba(34, 120, 180, 0.18), transparent 60%), linear-gradient(180deg, #080e1f 0%, #0a1230 100%)";

const GRID_BG = [
  "linear-gradient(rgba(140,166,228,0.055) 1px, transparent 1px)",
  "linear-gradient(90deg, rgba(140,166,228,0.055) 1px, transparent 1px)",
].join(", ");

const Metric = ({ label, value, divider = false }) => (
  <Flex vertical gap={3} style={{ paddingLeft: divider ? 20 : 0 }}>
    <Text
      style={{
        fontFamily: MONO,
        fontSize: 19,
        fontWeight: 600,
        color: "#eaf0ff",
        lineHeight: "22px",
        letterSpacing: "-0.01em",
      }}
    >
      {value}
    </Text>
    <Text
      style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.09em",
        textTransform: "uppercase",
        color: "#7f8fb5",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </Text>
  </Flex>
);

const Hero = ({
  loading = false,
  totalEvents = 0,
  agentCount = 0,
  loadedCount = 0,
  medianLatency = null,
  agentNodes = [],
  toolNodes = [],
}) => {
  const metricValue = (value) => (loading ? "…" : value);
  // Keep the hero compact on small screens: the abstract map is a desktop flourish.
  const screens = Grid.useBreakpoint();
  const showVisual = screens.md ?? true;

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: HERO_BG,
        borderBottom: "1px solid rgba(120, 145, 210, 0.18)",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: GRID_BG,
          backgroundSize: "44px 44px, 44px 44px",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0.25))",
          WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0.25))",
          pointerEvents: "none",
        }}
      />

      <Flex
        style={{
          position: "relative",
          maxWidth: 1400,
          margin: "0 auto",            padding: "16px 24px 18px",
          width: "100%",
        }}
      >
        <Row gutter={[40, 16]} align="middle" style={{ width: "100%" }}>
          <Col xs={24} lg={11}>
            <Flex vertical gap={10} style={{ maxWidth: 560 }}>
              <Flex align="center" gap={9}>
                <span
                  aria-hidden
                  style={{ width: 22, height: 1, background: "rgba(142,166,255,0.55)" }}
                />
                <Text
                  style={{
                    fontFamily: MONO,
                    fontSize: 11,
                    letterSpacing: "0.16em",
                    color: "#8ea6ff",
                    textTransform: "uppercase",
                  }}
                >
                  Agent observability
                </Text>
              </Flex>

              <Title
                level={1}
                style={{
                  margin: 0,
                  color: "#f4f7ff",
                  fontWeight: 650,
                  letterSpacing: "-0.022em",
                  lineHeight: 1.1,
                  fontSize: "clamp(24px, 2.6vw, 34px)",
                }}
              >
                Every agent action. One clear view.
              </Title>

              <Text
                style={{
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: "#a7b3d2",
                  maxWidth: 520,
                }}
              >
                The Activity Explorer makes agent runs, tool usage, latency and policy outcomes
                observable. Search across the fleet, narrow to a single agent, and open any event
                for its full input, result and policy trail.
              </Text>

              <Flex
                align="center"
                gap={20}
                wrap
                style={{
                  marginTop: 0,
                  paddingTop: 12,
                  borderTop: "1px solid rgba(140,166,228,0.16)",
                }}
              >
                <Metric label="Events indexed" value={metricValue(totalEvents.toLocaleString())} />
                <Metric divider label="Agents" value={metricValue(agentCount)} />
                <Metric
                  divider
                  label="Median latency"
                  value={metricValue(medianLatency != null ? formatLatency(medianLatency) : "—")}
                />
                <Metric divider label="Window loaded" value={metricValue(loadedCount)} />
              </Flex>
            </Flex>
          </Col>

          <Col xs={24} lg={13}>
            {showVisual ? <HeroNetwork agentNodes={agentNodes} toolNodes={toolNodes} /> : null}
          </Col>
        </Row>
      </Flex>

      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(142,166,255,0.5), transparent)",
        }}
      />
    </section>
  );
};

export default Hero;
