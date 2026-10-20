
/*
 * File: src/app/safety/page.jsx
 *
 * Purpose:
 * Provide practical safety guidance for identifying and responding
 * to suspicious SMS messages, job offers, payment requests, and links.
 *
 * Layout:
 * Reuses the shared IDE header and activity bar so the Safety page
 * remains visually consistent with the scanner and history pages.
 */

"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import IdeActivityBar from "@/components/layout/IdeActivityBar";
import IdeHeader from "@/components/layout/IdeHeader";

const SAFETY_CHECKS = [
  {
    number: "01",
    title: "Pause before you act",
    category: "SOCIAL ENGINEERING",
    description:
      "Scammers may pressure you to act immediately, claim an offer expires soon, or threaten consequences if you delay.",
    actions: [
      "Take time to verify the claim independently.",
      "Be cautious of urgent demands for money or personal information.",
      "Contact the organization using a trusted contact channel.",
    ],
  },
  {
    number: "02",
    title: "Verify job offers independently",
    category: "RECRUITMENT FRAUD",
    description:
      "Fraudulent recruiters may imitate real employers, promise unusually attractive opportunities, or request payments before employment.",
    actions: [
      "Find the vacancy on the employer's official careers page.",
      "Verify the recruiter through independently obtained contact details.",
      "Treat requests for recruitment, registration, or processing fees as warning signs.",
    ],
  },
  {
    number: "03",
    title: "Protect your money and credentials",
    category: "FINANCIAL SAFETY",
    description:
      "A message asking you to reveal a PIN, password, one-time code, or account recovery credential deserves particular scrutiny.",
    actions: [
      "Never disclose your M-Pesa PIN, banking PIN, or password to a stranger.",
      "Do not share one-time verification codes with someone who contacts you unexpectedly.",
      "Verify payment requests directly through your financial provider's official channels.",
    ],
  },
  {
    number: "04",
    title: "Inspect links before opening them",
    category: "PHISHING",
    description:
      "A message may use a shortened URL, a misspelled domain, or a familiar brand name to make a malicious destination appear trustworthy.",
    actions: [
      "Check the complete domain rather than relying on the displayed brand name.",
      "Avoid signing in through unexpected links in messages.",
      "Navigate to the official website or app yourself instead.",
    ],
  },
  {
    number: "05",
    title: "Verify prizes and unexpected rewards",
    category: "PRIZE SCAMS",
    description:
      "Unexpected winnings may be used to persuade recipients to pay an advance fee or disclose sensitive information.",
    actions: [
      "Ask whether you actually entered the competition.",
      "Verify the promotion through the organization's official website.",
      "Do not pay an unexpected fee just to release a supposed prize.",
    ],
  },
  {
    number: "06",
    title: "Preserve evidence and report concerns",
    category: "INCIDENT RESPONSE",
    description:
      "If a message appears fraudulent, preserve useful evidence and report it through the relevant provider or official reporting channel.",
    actions: [
      "Keep the message, sender details, transaction references, and relevant screenshots.",
      "Use your mobile-money provider's official support channel if a transaction is involved.",
      "If you have lost money or exposed credentials, contact the relevant provider promptly and follow its recovery guidance.",
    ],
  },
];

const RED_FLAGS = [
  {
    title: "Unexpected payment requests",
    detail:
      "Advance fees, urgent transfers, or payments required to unlock a reward or job.",
  },
  {
    title: "Requests for secret information",
    detail:
      "PINs, passwords, one-time codes, or credentials requested through unsolicited messages.",
  },
  {
    title: "Threats and artificial urgency",
    detail:
      "Claims that an account will be closed, a reward lost, or a penalty imposed unless you act immediately.",
  },
  {
    title: "Unverifiable identities",
    detail:
      "Senders or organizations that cannot be independently verified using trusted contact details.",
  },
];

export default function SafetyPage() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <main className="ide-shell">
      <IdeHeader />

      <div className="ide-body history-body">
        <IdeActivityBar activePage="safety" />

        <section
          className="ide-main min-w-0 min-h-0 overflow-x-hidden overflow-y-auto"
          aria-labelledby="safety-title"
        >
          <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
            {/* Page heading */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mb-8 border-b border-white/10 pb-7"
            >
              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
                <span>ScamShield</span>
                <span aria-hidden="true">/</span>
                <span>Security</span>
                <span aria-hidden="true">/</span>
                <span className="text-orange-400">Safety guide</span>
              </div>

              <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                <div>
                  <p className="mb-3 text-sm font-medium text-orange-400">
                    YOUR FIRST LINE OF DEFENCE
                  </p>

                  <h1
                    id="safety-title"
                    className="max-w-3xl text-3xl font-semibold tracking-tight text-neutral-100 sm:text-4xl lg:text-5xl"
                  >
                    Verify before you trust.
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-400 sm:text-base">
                    Learn how to recognize suspicious messages, verify
                    claims independently, and respond safely when something
                    does not feel right.
                  </p>
                </div>

                <div className="flex items-center gap-3 border border-white/10 bg-white/[0.03] p-4 md:min-w-44">
                  <span
                    className="flex size-10 items-center justify-center border border-orange-400/30 bg-orange-400/10 text-orange-400"
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      className="size-5"
                    >
                      <path d="M12 3 20 6v5c0 5-3.4 8.2-8 10-4.6-1.8-8-5-8-10V6l8-3Z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-neutral-100">
                      Stay cautious
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      Verify independently
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Core safety principle */}
            <div className="mb-10 border border-orange-400/20 bg-orange-400/[0.06] p-5 sm:p-6">
              <div className="flex gap-4">
                <span
                  className="mt-0.5 text-orange-400"
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="size-6"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 11v5m0-8h.01" />
                  </svg>
                </span>

                <div>
                  <h2 className="text-base font-semibold text-neutral-100">
                    A screening result is a warning signal, not a verdict.
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-neutral-400">
                    ScamShield KE combines machine-learning predictions
                    with message-pattern checks. It cannot confirm a
                    sender&apos;s identity or guarantee that a message is
                    safe. Verify important claims independently, even
                    when a message receives a low-risk result.
                  </p>
                </div>
              </div>
            </div>

            {/* Safety checklist */}
            <section aria-labelledby="checks-title" className="mb-12">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-orange-400">
                    FIELD GUIDE
                  </p>
                  <h2
                    id="checks-title"
                    className="text-xl font-semibold text-neutral-100 sm:text-2xl"
                  >
                    Six habits that protect you
                  </h2>
                </div>

                <span className="text-xs text-neutral-500">
                  PRACTICAL CHECKLIST
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {SAFETY_CHECKS.map((check, index) => (
                  <motion.article
                    key={check.number}
                    initial={
                      shouldReduceMotion
                        ? false
                        : { opacity: 0, y: 12 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: shouldReduceMotion ? 0 : index * 0.05,
                    }}
                    className="border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-orange-400/30 sm:p-6"
                  >
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <span className="font-mono text-2xl text-orange-400/80">
                        {check.number}
                      </span>
                      <span className="border border-white/10 px-2 py-1 text-[10px] font-medium tracking-wider text-neutral-500">
                        {check.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-neutral-100">
                      {check.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-neutral-400">
                      {check.description}
                    </p>

                    <ul className="mt-5 space-y-3">
                      {check.actions.map((action) => (
                        <li
                          key={action}
                          className="flex items-start gap-3 text-sm leading-6 text-neutral-300"
                        >
                          <span
                            className="mt-2 size-1.5 shrink-0 bg-orange-400"
                            aria-hidden="true"
                          />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.article>
                ))}
              </div>
            </section>

            {/* Warning signs */}
            <section aria-labelledby="red-flags-title" className="mb-12">
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-orange-400">
                RECOGNIZE THE PATTERN
              </p>

              <h2
                id="red-flags-title"
                className="text-xl font-semibold text-neutral-100 sm:text-2xl"
              >
                Common warning signs
              </h2>

              <div className="mt-5 divide-y divide-white/10 border-y border-white/10">
                {RED_FLAGS.map((flag, index) => (
                  <div
                    key={flag.title}
                    className="grid gap-2 py-5 sm:grid-cols-[220px_minmax(0,1fr)] sm:gap-6"
                  >
                    <h3 className="text-sm font-medium text-neutral-200">
                      <span className="mr-3 font-mono text-orange-400">
                        0{index + 1}
                      </span>
                      {flag.title}
                    </h3>

                    <p className="text-sm leading-6 text-neutral-400">
                      {flag.detail}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* What to do if compromised */}
            <section
              aria-labelledby="incident-title"
              className="mb-10 border border-white/10 p-5 sm:p-7"
            >
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-orange-400">
                IF YOU SUSPECT A SCAM
              </p>

              <h2
                id="incident-title"
                className="text-xl font-semibold text-neutral-100 sm:text-2xl"
              >
                Act quickly, but do not panic.
              </h2>

              <ol className="mt-5 space-y-4">
                {[
                  "Stop communicating with the suspected scammer and do not send more money.",
                  "If you shared a password or PIN, contact the relevant provider through its official channel and secure the affected account.",
                  "If money was transferred, contact your bank or mobile-money provider immediately to ask about available protective steps.",
                  "Preserve messages, phone numbers, URLs, and transaction references that may help an investigation.",
                  "Report the incident to the relevant service provider or appropriate official reporting authority.",
                ].map((step, index) => (
                  <li
                    key={step}
                    className="flex items-start gap-4 text-sm leading-6 text-neutral-300"
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center border border-white/10 font-mono text-xs text-orange-400">
                      {index + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            {/* Call to action */}
            <section className="flex flex-col gap-5 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-neutral-100">
                  Unsure about a message?
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-400">
                  Screen it for potential warning signs, then verify
                  important claims through trusted channels.
                </p>
              </div>

              <Link
                href="/"
                className="inline-flex min-h-11 items-center justify-center gap-2 border border-orange-400 bg-orange-400 px-5 py-3 text-sm font-semibold text-neutral-950 transition-colors hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
              >
                Open message scanner
                <span aria-hidden="true">→</span>
              </Link>
            </section>

            <p className="mt-8 border-t border-white/10 pt-5 text-xs leading-6 text-neutral-500">
              ScamShield KE provides automated screening assistance, not
              financial, legal, or law-enforcement advice. No automated
              result can guarantee that a message is legitimate or
              fraudulent.
            </p>
          </div>
        </section>
      </div>

      <footer className="ide-statusbar">
        <span>ScamShield</span>
        <span className="hidden sm:inline">Safety guide</span>
        <span className="ml-auto">Verify before you trust</span>
      </footer>
    </main>
  );
}
