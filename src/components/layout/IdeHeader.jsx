/*
 * ScamShield KE — IDE Header Component
 * Purpose: Reusable application title bar with branding and status indicators.
 */

"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

export default function IdeHeader() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <header className="ide-titlebar">
      <Link
        className="ide-brand"
        href="/"
        aria-label="ScamShield home"
      >
        <motion.span
          className="ide-brand-mark"
          aria-hidden="true"
          whileHover={
            shouldReduceMotion ? undefined : { rotate: -6, scale: 1.06 }
          }
        >
          S
        </motion.span>

        <span className="ide-brand-name">ScamShield</span>
        <span className="ide-brand-region">KE</span>
      </Link>

      <div className="ide-title-context">
        <span className="title-separator">/</span>
        <span>Message intelligence workspace</span>
      </div>

      <div className="ide-title-actions">
        <span className="ide-environment">AI-ASSISTED</span>
        <span className="ide-title-dot" aria-hidden="true" />
      </div>
    </header>
  );
}