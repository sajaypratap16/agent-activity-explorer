"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Layout, Alert, Button, App, Grid } from "antd";
import { ReloadOutlined, ExclamationCircleOutlined, WifiOutlined } from "@ant-design/icons";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import HeaderBar from "./HeaderBar";
import Hero from "./Hero";
import PageHeader from "./PageHeader";
import SearchFilters from "./SearchFilters";
import EventTable from "./EventTable";
import PaginationBar from "./Pagination";
import EventDetailDrawer from "./EventDetailDrawer";
import { api, ApiError } from "../lib/api";

const { Content } = Layout;

const SLOW_NETWORK_THRESHOLD = 2000;
const DEFAULT_PAGE_SIZE = 50;
const SEARCH_DEBOUNCE_MS = 300;

const surfaceStyle = {
  background: "#ffffff",
  border: "1px solid #e5e4de",
  boxShadow: "0 1px 2px rgba(17, 23, 38, 0.04)",
  borderRadius: 10,
  overflow: "hidden",
};

const EventExplorer = () => {
  const { message: apiMessage } = App.useApp();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  const [slowNetwork, setSlowNetwork] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(DEFAULT_PAGE_SIZE);
  const [total, setTotal] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [detailEvent, setDetailEvent] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  const [agents, setAgents] = useState([]);

  const abortControllerRef = useRef(null);
  const detailAbortControllerRef = useRef(null);
  const slowNetworkTimerRef = useRef(null);
  const requestIdRef = useRef(0);
  const initializedRef = useRef(false);
  const debounceTimerRef = useRef(null);
  const pendingSearchRef = useRef(null);

  // The app shell is a fixed viewport with an internally scrolling table on
  // tablet and up; on narrow screens the document scrolls instead.
  const screens = Grid.useBreakpoint();
  const fixedShell = screens.md ?? true;

  const q = searchParams.get("q") || "";
  const agent = searchParams.get("agent") || "";
  const status = searchParams.get("status") || "";
  const eventIdFromUrl = searchParams.get("event") || "";

  const fetchAgents = useCallback(async () => {
    try {
      const data = await api.getAgents();
      setAgents(data);
    } catch (err) {
      console.warn("Failed to fetch agents:", err);
    }
  }, []);

  const fetchEvents = useCallback(
    async (options = {}) => {
      const { page = 1, limit = pageSize, cursor, append = false } = options;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      if (slowNetworkTimerRef.current) {
        clearTimeout(slowNetworkTimerRef.current);
      }
      slowNetworkTimerRef.current = setTimeout(() => {
        setSlowNetwork(true);
      }, SLOW_NETWORK_THRESHOLD);

      if (!append) {
        setLoading(true);
      }
      setError(null);

      const currentRequestId = ++requestIdRef.current;

      try {
        const params = { limit };
        if (cursor) params.cursor = cursor;
        if (q) params.q = q;
        if (agent) params.agent = agent;
        if (status) params.status = status;

        const data = await api.getEvents(params);

        if (currentRequestId !== requestIdRef.current) {
          return;
        }

        if (slowNetworkTimerRef.current) {
          clearTimeout(slowNetworkTimerRef.current);
          slowNetworkTimerRef.current = null;
        }
        setSlowNetwork(false);

        const newEvents = data.items || [];
        setEvents(append ? [...events, ...newEvents] : newEvents);
        setTotal(data.total || 0);
        setHasNextPage(!!data.nextCursor);
        setNextCursor(data.nextCursor || null);
        setCurrentPage(page);
      } catch (err) {
        if (currentRequestId !== requestIdRef.current) {
          return;
        }

        if (slowNetworkTimerRef.current) {
          clearTimeout(slowNetworkTimerRef.current);
          slowNetworkTimerRef.current = null;
        }
        setSlowNetwork(false);

        if (err.name === "AbortError") {
          return;
        }

        if (!append || events.length === 0) {
          setError(err);
        } else {
          apiMessage.warning("Failed to load more events. Showing cached data.");
        }
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setLoading(false);
          setInitialLoad(false);
        }
      }
    },
    [pageSize, events, q, agent, status, apiMessage]
  );

  const fetchEventDetail = useCallback(async (eventId) => {
    if (detailAbortControllerRef.current) {
      detailAbortControllerRef.current.abort();
    }
    detailAbortControllerRef.current = new AbortController();

    setDetailLoading(true);
    setDetailError(null);

    try {
      const data = await api.getEvent(eventId);
      setDetailEvent(data);
    } catch (err) {
      if (err.name === "AbortError") return;
      setDetailError(err);
      setDetailEvent(null);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const loadNextPage = useCallback(() => {
    if (hasNextPage && nextCursor && !loading) {
      fetchEvents({ page: currentPage + 1, cursor: nextCursor, append: true });
    }
  }, [hasNextPage, nextCursor, loading, fetchEvents, currentPage]);

  const loadPrevPage = useCallback(() => {
    if (currentPage > 1 && !loading) {
      fetchEvents({ page: currentPage - 1, append: false });
    }
  }, [currentPage, loading, fetchEvents]);

  const handlePageSizeChange = useCallback(
    (newPageSize) => {
      setPageSizeState(newPageSize);
      fetchEvents({ page: 1, limit: newPageSize, append: false });
    },
    [fetchEvents]
  );

  const handleRetry = useCallback(() => {
    fetchEvents({ page: 1, limit: pageSize, append: false });
  }, [fetchEvents, pageSize]);

  const handleRowClick = useCallback(
    (record) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("event", record.id);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const closeDetail = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("event");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setSelectedEvent(null);
    setDetailEvent(null);
    setDetailError(null);
  }, [searchParams, router, pathname]);

  const updateUrlAndFetch = useCallback(
    (updates) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      params.delete("cursor");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const handleSearch = useCallback(
    (value) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      pendingSearchRef.current = value;
      debounceTimerRef.current = setTimeout(() => {
        updateUrlAndFetch({ q: pendingSearchRef.current || undefined });
        pendingSearchRef.current = null;
      }, SEARCH_DEBOUNCE_MS);
    },
    [updateUrlAndFetch]
  );

  const handleAgentChange = useCallback(
    (value) => {
      updateUrlAndFetch({ agent: value || undefined });
    },
    [updateUrlAndFetch]
  );

  const handleStatusChange = useCallback(
    (value) => {
      updateUrlAndFetch({ status: value || undefined });
    },
    [updateUrlAndFetch]
  );

  const handleClearFilters = useCallback(() => {
    updateUrlAndFetch({ agent: undefined, status: undefined });
  }, [updateUrlAndFetch]);

  useEffect(() => {
    if (eventIdFromUrl) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchEventDetail(eventIdFromUrl);
      const found = events.find((e) => e.id === eventIdFromUrl);
      if (found) setSelectedEvent(found);
    } else {
      setDetailEvent(null);
      setDetailError(null);
      setSelectedEvent(null);
    }
  }, [eventIdFromUrl, fetchEventDetail, events]);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      fetchAgents();
      fetchEvents({ page: 1, limit: pageSize, append: false });
      return;
    }

    fetchEvents({ page: 1, limit: pageSize, append: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, agent, status, pageSize]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (detailAbortControllerRef.current) {
        detailAbortControllerRef.current.abort();
      }
      if (slowNetworkTimerRef.current) {
        clearTimeout(slowNetworkTimerRef.current);
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const connection = error
    ? events.length > 0
      ? "degraded"
      : "offline"
    : initialLoad
      ? "connecting"
      : "connected";

  const statusCounts = events.reduce((acc, ev) => {
    if (ev?.status) acc[ev.status] = (acc[ev.status] || 0) + 1;
    return acc;
  }, {});
  const uniqueAgents = new Set(events.map((ev) => ev?.agent).filter(Boolean)).size;

  // Derived, real values only — nothing here is fabricated for the hero.
  const latencies = events
    .map((ev) => ev?.latencyMs)
    .filter((v) => typeof v === "number")
    .sort((a, b) => a - b);
  const medianLatency = latencies.length ? latencies[Math.floor(latencies.length / 2)] : null;

  const toolCounts = events.reduce((acc, ev) => {
    if (ev?.tool) acc[ev.tool] = (acc[ev.tool] || 0) + 1;
    return acc;
  }, {});
  const toolNodes = Object.entries(toolCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name);
  // If the agents endpoint is unavailable, fall back to the agents seen in the loaded window.
  const observedAgents = [...new Set(events.map((ev) => ev?.agent).filter(Boolean))];
  const agentFleet = agents.length ? agents : observedAgents;
  const agentNodes = agentFleet.slice(0, 3);

  const hasActiveFilters = Boolean(agent || status);
  const activeFilterLabel =
    [agent ? `agent: ${agent}` : null, status ? `status: ${status}` : null]
      .filter(Boolean)
      .join(" · ") || "all agents · all statuses";

  return (
    <Layout
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f6f6f3",
        ...(fixedShell ? { height: "100vh", overflow: "hidden" } : null),
      }}
    >
      <HeaderBar connection={connection} />

      <Hero
        loading={initialLoad}
        totalEvents={total}
        agentCount={agentFleet.length}
        loadedCount={events.length}
        medianLatency={medianLatency}
        agentNodes={agentNodes}
        toolNodes={toolNodes}
      />

      <Content
        style={{
          flex: fixedShell ? 1 : "none",
          display: "flex",
          flexDirection: "column",
          overflow: fixedShell ? "hidden" : "visible",
          minHeight: 0,
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "18px 24px 22px",
            width: "100%",
            flex: fixedShell ? 1 : "none",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            gap: 12,
          }}
        >
          <PageHeader
            totalEvents={total}
            loadedCount={events.length}
            statusCounts={statusCounts}
            uniqueAgents={uniqueAgents}
            hasActiveFilters={hasActiveFilters}
            activeFilterLabel={activeFilterLabel}
          />

          <SearchFilters
            agents={agents}
            q={q}
            agent={agent}
            status={status}
            onSearch={handleSearch}
            onAgentChange={handleAgentChange}
            onStatusChange={handleStatusChange}
            onClearFilters={handleClearFilters}
          />

          {slowNetwork && !loading && (
            <Alert
              title="Slow network detected"
              description="The request is taking longer than expected. Results will appear when they arrive."
              type="warning"
              showIcon
              icon={<WifiOutlined />}
              closable
              onClose={() => setSlowNetwork(false)}
            />
          )}

          {error && !loading && events.length === 0 && (
            <Alert
              title="Failed to load events"
              description={error.message}
              type="error"
              showIcon
              icon={<ExclamationCircleOutlined />}
              action={
                <Button type="primary" size="small" onClick={handleRetry} icon={<ReloadOutlined />}>
                  Retry
                </Button>
              }
              closable
              onClose={() => setError(null)}
            />
          )}

          {error && !loading && events.length > 0 && (
            <Alert
              title="Refresh failed"
              description="Using cached data. Some events may be outdated."
              type="warning"
              showIcon
              icon={<ExclamationCircleOutlined />}
              action={
                <Button type="primary" size="small" onClick={handleRetry} icon={<ReloadOutlined />}>
                  Retry
                </Button>
              }
              closable
              onClose={() => setError(null)}
            />
          )}

          <div
            style={{
              ...surfaceStyle,
              flex: fixedShell ? 1 : "none",
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            <EventTable
              data={events}
              loading={loading}
              onRowClick={handleRowClick}
              selectedRowKey={selectedEvent?.id}
              hasFilters={Boolean(q || agent || status)}
              hasError={Boolean(error) && !loading && events.length === 0}
              fixedHeight={fixedShell}
            />

            {events.length > 0 && (
              <PaginationBar
                current={currentPage}
                total={total}
                pageSize={pageSize}
                hasNextPage={hasNextPage}
                onNext={loadNextPage}
                onPrev={loadPrevPage}
                onPageSizeChange={handlePageSizeChange}
                loading={loading}
                showSizeChanger={true}
              />
            )}
          </div>
        </div>
      </Content>

      <EventDetailDrawer
        open={!!eventIdFromUrl}
        event={detailEvent}
        loading={detailLoading}
        error={detailError}
        onClose={closeDetail}
      />
    </Layout>
  );
};

export default EventExplorer;
