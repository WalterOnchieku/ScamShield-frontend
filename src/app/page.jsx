/*
 * ScamShield KE — Home Page
 * Purpose: Provide an IDE-style workspace for message analysis and threat detection.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import IdeActivityBar from "@/components/layout/IdeActivityBar";
import IdeHeader from "@/components/layout/IdeHeader";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://scamshield-backend-6olh.onrender.com";

const SAMPLE_MESSAGES = [
  {
    label: "Suspicious prize",
    message:
      "URGENT! Congratulations, you have won KSh 150,000 in the Kenya National Rewards Promotion. Send your M-Pesa PIN and pay KSh 500 processing fee to 0712345678 within 30 minutes to claim your prize. Click http://claim-reward.example.com now!",
  },
  {
    label: "Ordinary message",
    message:
      "Hi, I will be arriving at the office at 10 tomorrow. Please let me know if the meeting time changes.",
  },
];

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

function SectionHeading({ eyebrow, children }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{children}</h2>
    </div>
  );
}

function AnalysisResults({ result }) {
  const shouldReduceMotion = useReducedMotion();

  const spamScore =
    typeof result.spam_probability === "number" &&
    Number.isFinite(result.spam_probability)
      ? Math.max(0, Math.min(1, result.spam_probability))
      : 0;

  const hamScore =
    typeof result.ham_probability === "number" &&
    Number.isFinite(result.ham_probability)
      ? Math.max(0, Math.min(1, result.ham_probability))
      : 0;

  return (
    <motion.section
      className="results panel"
      aria-live="polite"
      aria-label="Message analysis report"
      initial={
        shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }
      }
      animate={{ opacity: 1, y: 0 }}
      exit={
        shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }
      }
      transition={{ duration: shouldReduceMotion ? 0.01 : 0.45 }}
    >
      <div className="results-header">
        <div>
          <p className="eyebrow">Screening report / 01</p>
          <h2>Analysis complete</h2>
        </div>

        <RiskBadge level={result.risk_level} />
      </div>

      <div className="prediction-grid">
        <motion.div
          className="metric-card"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.1 }}
        >
          <span className="metric-label">ML classification</span>

          <strong className="metric-value">
            {result.predicted_label === "spam" ? "Spam-like" : "Ham-like"}
          </strong>

          <span className="metric-note">
            Based on patterns learned from SMS data
          </span>
        </motion.div>

        <motion.div
          className="metric-card"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.18 }}
        >
          <span className="metric-label">Spam model score</span>

          <motion.strong
            className="metric-value"
            key={spamScore}
            initial={shouldReduceMotion ? false : { opacity: 0.5 }}
            animate={{ opacity: 1 }}
          >
            {formatPercentage(spamScore)}
          </motion.strong>

          <div
            className="score-track"
            role="progressbar"
            aria-label="Spam model score"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(spamScore * 100)}
          >
            <motion.div
              className="score-fill"
              initial={{ width: shouldReduceMotion ? `${spamScore * 100}%` : "0%" }}
              animate={{ width: `${spamScore * 100}%` }}
              transition={{
                duration: shouldReduceMotion ? 0.01 : 0.9,
                delay: shouldReduceMotion ? 0 : 0.25,
                ease: "easeOut",
              }}
            />
          </div>

          <span className="metric-note">
            Ham score: {formatPercentage(hamScore)}
          </span>
        </motion.div>
      </div>

      <div className="result-section">
        <SectionHeading eyebrow="01 / Assessment">
          Why this risk level?
        </SectionHeading>

        {result.risk_reasons.length > 0 ? (
          <ul className="detail-list">
            {result.risk_reasons.map((reason, index) => (
              <motion.li
                key={`${index}-${reason}`}
                initial={shouldReduceMotion ? false : { opacity: 0, x: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: shouldReduceMotion ? 0 : Math.min(index * 0.06, 0.3),
                }}
              >
                {reason}
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="muted">No assessment reasons were returned.</p>
        )}
      </div>

      <div className="result-section">
        <SectionHeading eyebrow="02 / Evidence">
          Detected indicators
        </SectionHeading>

        {result.findings.length > 0 ? (
          <div className="findings-list">
            {result.findings.map((finding, index) => (
              <motion.article
                className="finding-card"
                key={`${finding.rule_id}-${index}`}
                initial={
                  shouldReduceMotion ? false : { opacity: 0, y: 14 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0.01 : 0.35,
                  delay: shouldReduceMotion ? 0 : Math.min(index * 0.07, 0.35),
                }}
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : { borderColor: "rgba(96, 165, 250, 0.45)" }
                }
              >
                <div className="finding-header">
                  <h3>
                    {(finding.category || "Uncategorized").replaceAll("_", " ")}
                  </h3>

                  <span
                    className={`severity severity-${finding.severity}`}
                  >
                    {finding.severity}
                  </span>
                </div>

                <p className="matched-text">
                  {finding.matched_text
                    ? `Matched: “${finding.matched_text}”`
                    : "No matched text supplied"}
                </p>

                <p className="finding-explanation">{finding.explanation}</p>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-state-mark" aria-hidden="true">
              ✓
            </span>

            <p>No configured rule indicators were detected.</p>

            <p className="muted">
              This does not establish that the message is safe.
            </p>
          </div>
        )}
      </div>

      <div className="result-section">
        <SectionHeading eyebrow="03 / Next steps">
          Recommended precautions
        </SectionHeading>

        <ol className="recommendation-list">
          {result.recommendations.map((recommendation, index) => (
            <motion.li
              key={`${index}-${recommendation}`}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: shouldReduceMotion ? 0 : Math.min(index * 0.06, 0.3),
              }}
            >
              <span className="recommendation-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span>{recommendation}</span>
            </motion.li>
          ))}
        </ol>
      </div>

      <p className="disclaimer">
        <strong>Important:</strong> {result.disclaimer}
      </p>
    </motion.section>
  );
}

export default function HomePage() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const shouldReduceMotion = useReducedMotion();
  const remainingCharacters = 5000 - message.length;

  async function handleAnalyze(event) {
    event.preventDefault();

    const cleanedMessage = message.trim();

    if (!cleanedMessage) {
      setError("Enter a message before starting the analysis.");
      setResult(null);
      return;
    }

    if (cleanedMessage.length > 5000) {
      setError("Messages must contain no more than 5,000 characters.");
      setResult(null);
      return;
    }

    setIsAnalyzing(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: cleanedMessage }),
      });

      if (!response.ok) {
        let detail = `The analysis request failed (${response.status}).`;

        try {
          const errorBody = await response.json();
          if (typeof errorBody.detail === "string") {
            detail = errorBody.detail;
          }
        } catch {
          // Keep the default error if the response is not JSON.
        }

        throw new Error(detail);
      }

      const data = await response.json();

      if (
        !["low", "medium", "high"].includes(data.risk_level) ||
        !Array.isArray(data.findings) ||
        !Array.isArray(data.recommendations) ||
        !Array.isArray(data.risk_reasons)
      ) {
        throw new Error("The API returned an unexpected analysis response.");
      }

      setResult(data);
    } catch (requestError) {
      if (requestError instanceof TypeError) {
        setError(
          "Could not reach the API. Check that FastAPI is running and CORS is configured."
        );
      } else {
        setError(
          requestError.message || "Something went wrong during analysis."
        );
      }
    } finally {
      setIsAnalyzing(false);
    }
  }

  function loadSample(sample) {
    setMessage(sample.message);
    setResult(null);
    setError("");
  }

  function clearScanner() {
    setMessage("");
    setResult(null);
    setError("");
  }

  function handleEditorKeyDown(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();

      if (!isAnalyzing && message.trim()) {
        event.currentTarget.form?.requestSubmit();
      }
    }
  }

  return (
    <main className="ide-shell">
      {/* Extracted Header Component */}
      <IdeHeader />

      {/* Main application layout */}
      <div className="ide-body">
        {/* Narrow activity bar */}
        <IdeActivityBar activePage="scanner" />

        {/* Explorer sidebar */}
        <aside className="ide-sidebar" aria-label="Workspace explorer">
          <div className="sidebar-heading">
            <span>EXPLORER</span>
            <span className="sidebar-heading-icon" aria-hidden="true">
              ···
            </span>
          </div>

          <div className="explorer-group">
            <div className="explorer-folder">
              <span className="folder-chevron" aria-hidden="true">⌄</span>
              <span className="folder-icon" aria-hidden="true">▰</span>
              <span>SCAMSHIELD KE</span>
            </div>

            <button
              type="button"
              className="explorer-file explorer-file-active"
              onClick={clearScanner}
              title="Start a new analysis"
            >
              <span className="file-icon file-icon-blue" aria-hidden="true">
                ◈
              </span>
              <span>new-analysis.txt</span>
            </button>

            <button
              type="button"
              className="explorer-file"
              onClick={() => loadSample(SAMPLE_MESSAGES[0])}
              disabled={isAnalyzing}
            >
              <span className="file-icon file-icon-orange" aria-hidden="true">
                !
              </span>
              <span>suspicious-sample.txt</span>
            </button>

            <button
              type="button"
              className="explorer-file"
              onClick={() => loadSample(SAMPLE_MESSAGES[1])}
              disabled={isAnalyzing}
            >
              <span className="file-icon file-icon-green" aria-hidden="true">
                ✓
              </span>
              <span>ordinary-sample.txt</span>
            </button>
            
            <Link
              href="/history"
              className="explorer-file"
              title="View saved analyses"
            >
              <span
                className="file-icon file-icon-orange"
                aria-hidden="true"
              >
                ◷
              </span>
              <span>analysis-history.db</span>
            </Link>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-heading">
              <span>WORKSPACE</span>
            </div>

            <p className="sidebar-description">
              Inspect a message to review its classification, warning signs,
              and recommended precautions.
            </p>
          </div>

          <div className="sidebar-bottom">
            <div className="sidebar-model-icon" aria-hidden="true">◎</div>
            <div>
              <strong>SMS classifier</strong>
              <span>TF-IDF + Logistic Regression</span>
            </div>
          </div>
        </aside>

        {/* Editor and report workspace */}
        <section className="ide-main" aria-label="Message analysis">
          <div className="ide-tabs">
            <div className="ide-tab ide-tab-active">
              <span className="file-icon file-icon-blue" aria-hidden="true">
                ◈
              </span>
              <span>new-analysis.txt</span>
              {message && <span className="tab-unsaved-dot" aria-label="Edited" />}
            </div>

            <div className="ide-tab-context">
              <span>SCAMSHIELD</span>
              <span className="title-separator">/</span>
              <span>ANALYZER</span>
            </div>
          </div>

          <div className="ide-workspace">
            {/* Message editor */}
            <section className="editor-panel panel" aria-labelledby="editor-title">
              <div className="panel-topline">
                <div className="panel-title-group">
                  <span className="panel-index">01</span>
                  <h1 id="editor-title">Message input</h1>
                </div>
                <span className="input-limit">PLAIN TEXT · MAX 5,000</span>
              </div>

              <p className="editor-description">
                Paste the SMS, job offer, payment request, or notification
                you want to inspect.
              </p>

              <form className="editor-form" onSubmit={handleAnalyze}>
                <label className="sr-only" htmlFor="message-input">
                  Message to analyze
                </label>

                <div className="editor-textarea-wrap">
                  <div className="editor-line-number" aria-hidden="true">
                    01
                  </div>

                  <textarea
                    id="message-input"
                    name="message"
                    value={message}
                    onChange={(event) => {
                      setMessage(event.target.value);
                      setError("");
                    }}
                    onKeyDown={handleEditorKeyDown}
                    placeholder="// Paste a message here to begin analysis..."
                    maxLength={5000}
                    rows={8}
                    required
                    aria-describedby="message-help character-count"
                  />
                </div>

                <div className="textarea-footer">
                  <span id="message-help" className="muted">
                    Remove PINs, passwords, and other sensitive information.
                  </span>

                  <span
                    id="character-count"
                    className={remainingCharacters < 100 ? "count-warning" : ""}
                  >
                    {message.length.toLocaleString()} / 5,000
                  </span>
                </div>

                <div className="editor-actions">
                  <motion.button
                    className="primary-button"
                    type="submit"
                    disabled={isAnalyzing || !message.trim()}
                    whileHover={
                      shouldReduceMotion || isAnalyzing ? undefined : { y: -1 }
                    }
                    whileTap={
                      shouldReduceMotion || isAnalyzing
                        ? undefined
                        : { scale: 0.98 }
                    }
                  >
                    {isAnalyzing ? (
                      <>
                        <span className="spinner" aria-hidden="true" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <span aria-hidden="true">⌕</span>
                        Analyze message
                      </>
                    )}
                  </motion.button>

                  <button
                    className="secondary-button"
                    type="button"
                    onClick={clearScanner}
                    disabled={isAnalyzing || (!message && !result && !error)}
                  >
                    Clear
                  </button>

                  <span className="keyboard-hint">Ctrl + Enter</span>
                </div>
              </form>

              <div className="editor-samples">
                <span className="eyebrow">QUICK SAMPLES</span>

                {SAMPLE_MESSAGES.map((sample, index) => (
                  <button
                    key={sample.label}
                    type="button"
                    className="sample-button"
                    onClick={() => loadSample(sample)}
                    disabled={isAnalyzing}
                  >
                    <span
                      className={
                        index === 0
                          ? "sample-dot sample-dot-warning"
                          : "sample-dot sample-dot-safe"
                      }
                      aria-hidden="true"
                    />
                    {sample.label}
                  </button>
                ))}
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    className="error-message"
                    role="alert"
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0.01 : 0.2 }}
                  >
                    <strong>Notice</strong>
                    <p>{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="editor-privacy">
                <span className="privacy-icon" aria-hidden="true">!</span>
                <p>
                  Results are automated signals, not a verdict. Verify important
                  claims independently.
                </p>
              </div>
            </section>

            {/* Analysis output */}
            <section className="output-panel" aria-label="Analysis output">
              <div className="output-panel-heading">
                <div className="panel-title-group">
                  <span className="panel-index">02</span>
                  <h2>Analysis output</h2>
                </div>

                <span className="output-state">
                  <span
                    className={`output-state-dot ${isAnalyzing ? "output-state-running" : ""}`}
                    aria-hidden="true"
                  />
                  {isAnalyzing ? "PROCESSING" : result ? "COMPLETE" : "READY"}
                </span>
              </div>

              <div className="output-scroll">
                <AnimatePresence mode="wait">
                  {result ? (
                    <AnalysisResults key="analysis-results" result={result} />
                  ) : (
                    <motion.div
                      key="empty-output"
                      className="output-empty"
                      initial={shouldReduceMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="output-empty-symbol" aria-hidden="true">
                        {isAnalyzing ? (
                          <span className="spinner" />
                        ) : (
                          "⌕"
                        )}
                      </div>

                      <h3>
                        {isAnalyzing
                          ? "Inspecting message..."
                          : "Ready for inspection"}
                      </h3>

                      <p>
                        {isAnalyzing
                          ? "The classifier and rule engine are evaluating the message."
                          : "Your classification, risk assessment, detected indicators, and precautions will appear here."}
                      </p>

                      <div className="output-empty-divider" />

                      <div className="pipeline-list">
                        <div className="pipeline-item">
                          <span className="pipeline-number">01</span>
                          <span>Machine-learning classification</span>
                        </div>
                        <div className="pipeline-item">
                          <span className="pipeline-number">02</span>
                          <span>Rule-based indicator detection</span>
                        </div>
                        <div className="pipeline-item">
                          <span className="pipeline-number">03</span>
                          <span>Safety recommendations</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>
          </div>
        </section>
      </div>

      {/* Compact status bar */}
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