/*
 * File: page.jsx
 *
 * Purpose:
 * Display saved ScamShield KE analyses, including risk levels,
 * predictions, screening scores, and links to individual records.
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { getAnalysisHistory } from "@/lib/api";
import IdeActivityBar from "@/components/layout/IdeActivityBar";
import IdeHeader from "@/components/layout/IdeHeader";

const PAGE_SIZE = 10;

function formatDate(value) {
  if (!value) return "Unknown date";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Unknown date";

  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatPercentage(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "—";
  }

  return `${(value * 100).toFixed(1)}%`;
}

function RiskBadge({ level }) {
  const normalizedLevel = ["low", "medium", "high"].includes(level)
    ? level
    : "unknown";

  return (
    <span className={`risk-badge risk-${normalizedLevel}`}>
      {normalizedLevel.toUpperCase()} RISK
    </span>
  );
}

export default function HistoryPage() {
  const reduceMotion = useReducedMotion();

  const [items, setItems] = useState([]);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [offset, setOffset] = useState(0);
  const [riskLevel, setRiskLevel] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAnalysisHistory({
        limit,
        offset,
        riskLevel,
      });

      setItems(data.items ?? []);
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to load analysis history. Please try again."
      );
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [limit, offset, riskLevel]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  function handleRiskChange(event) {
    setRiskLevel(event.target.value);
    setOffset(0);
  }

  function handlePageChange(direction) {
    setOffset((current) =>
      Math.max(0, current + direction * limit)
    );
  }

  const pageNumber = Math.floor(offset / limit) + 1;

  return (
    <main className="ide-shell">
      {/* Top Application Bar */}
      <IdeHeader />

      {/* Main IDE Layout */}
      <div className="ide-body history-body">
        {/* Narrow Activity Bar */}
        <IdeActivityBar activePage="history" />

        {/* History Workspace Content */}
        <section
  className="ide-main min-w-0 min-h-0 overflow-x-hidden overflow-y-auto"
  aria-label="Analysis history records"
>
          <div className="mx-auto max-w-6xl px-6 py-10">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <p className="eyebrow text-orange-500">
                Your screening records
              </p>

              <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight md:text-4xl text-white">
                    Analysis history
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60 md:text-base">
                    Review previously analyzed messages and revisit the
                    warning signs identified by the model and rule engine.
                  </p>
                </div>

                <Link
                  href="/"
                  className="primary-button inline-flex w-fit items-center px-4 py-3 text-sm font-semibold text-white"
                >
                  Analyze a message <span aria-hidden="true" className="ml-1">↗</span>
                </Link>
              </div>
            </motion.div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between panel p-4 rounded-xl border border-white/10">
              <div>
                <label
                  htmlFor="risk-filter"
                  className="mb-2 block text-sm text-white/70"
                >
                  Filter by risk
                </label>

                <select
                  id="risk-filter"
                  value={riskLevel}
                  onChange={handleRiskChange}
                  className="min-w-48 rounded-lg border border-white/15 bg-neutral-900 px-4 py-3 text-sm text-white"
                >
                  <option value="all">All risk levels</option>
                  <option value="low">Low risk</option>
                  <option value="medium">Medium risk</option>
                  <option value="high">High risk</option>
                </select>
              </div>

              <button
                type="button"
                onClick={loadHistory}
                disabled={loading}
                className="secondary-button rounded-lg border border-white/15 px-4 py-3 text-sm transition hover:border-orange-500 disabled:opacity-50 text-white"
              >
                {loading ? "Refreshing..." : "Refresh history"}
              </button>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200"
              >
                <p>{error}</p>
                <button
                  type="button"
                  onClick={loadHistory}
                  className="mt-3 font-semibold underline"
                >
                  Try again
                </button>
              </div>
            )}

            <section aria-label="Saved analyses" className="mt-6">
              {loading ? (
                <div className="panel rounded-xl border border-white/10 p-8 text-sm text-white/60 text-center">
                  Loading saved analyses...
                </div>
              ) : error ? null : items.length === 0 ? (
                <div className="panel rounded-xl border border-dashed border-white/20 px-6 py-16 text-center">
                  <h2 className="text-lg font-semibold text-white">No analyses found</h2>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/60">
                    There are no saved analyses for this filter and page.
                    Analyze a message to create a new record.
                  </p>
                  <Link
                    href="/"
                    className="mt-5 inline-block text-sm font-semibold text-orange-500 hover:text-orange-400"
                  >
                    Open the scanner
                  </Link>
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-white/10 panel">
                  <div className="divide-y divide-white/10">
                    {items.map((item) => (
                      <article
                        key={item.id}
                        className="p-5 transition hover:bg-white/[0.03] md:p-6"
                      >
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                              <RiskBadge level={item.risk_level} />
                              <span className="text-xs uppercase tracking-wide text-white/50">
                                {item.predicted_label === "spam"
                                  ? "Spam-like"
                                  : "Ham-like"}
                              </span>
                              <span className="text-xs text-white/40">
                                Record #{item.id}
                              </span>
                            </div>

                            <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-white/90">
                              {item.message}
                            </p>

                            <p className="mt-3 text-xs text-white/50">
                              {formatDate(item.created_at)}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-3 md:min-w-52 md:grid-cols-1">
                            <div className="rounded-lg bg-white/[0.04] p-3 border border-white/5">
                              <p className="text-xs text-white/50">
                                Spam score
                              </p>
                              <p className="mt-1 text-lg font-semibold text-white">
                                {formatPercentage(item.spam_probability)}
                              </p>
                            </div>

                            <div className="rounded-lg bg-white/[0.04] p-3 border border-white/5">
                              <p className="text-xs text-white/50">
                                Findings
                              </p>
                              <p className="mt-1 text-lg font-semibold text-white">
                                {item.findings?.length ?? 0}
                              </p>
                            </div>
                          </div>
                        </div>

                        {item.risk_reasons?.length > 0 && (
                          <ul className="mt-4 space-y-1 text-sm text-white/60">
                            {item.risk_reasons.slice(0, 2).map((reason, index) => (
                              <li key={`${item.id}-reason-${index}`}>
                                • {reason}
                              </li>
                            ))}
                          </ul>
                        )}
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-sm text-white/50">
                Page {pageNumber}
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(-1)}
                  disabled={loading || offset === 0}
                  className="secondary-button rounded-lg border border-white/15 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 text-white"
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={() => handlePageChange(1)}
                  disabled={loading || items.length < limit}
                  className="secondary-button rounded-lg border border-white/15 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 text-white"
                >
                  Next
                </button>
              </div>
            </div>

            <p className="mt-8 text-xs leading-5 text-white/40">
              Screening results are advisory signals, not proof of fraud.
              The history currently displays shared records from this
              development backend; it is not a private, user-specific account.
            </p>
          </div>
        </section>
      </div>

      {/* Compact Status Bar */}
      <footer className="ide-statusbar">
        <div className="statusbar-left">
          <span className="statusbar-brand-mark" aria-hidden="true">S</span>
          <span>ScamShield KE</span>
          <span className="statusbar-divider">|</span>
          <span>AI-assisted screening</span>
        </div>

        <div className="statusbar-right">
          <span>UTF-8</span>
          <span>Plain Text</span>
          <span className="statusbar-disclaimer">
            Verify independently
          </span>
        </div>
      </footer>
    </main>
  );
}