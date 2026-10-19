/*
 * ScamShield Home Page Tests
 * Purpose: Verify the message editor, sample loading,
 * validation, and successful API analysis flow.
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePage from "../page";

// Keep animations from interfering with our UI tests.
vi.mock("motion/react", () => {
  const React = require("react");

  const createMotionComponent = (tag) =>
    React.forwardRef(function MotionComponent(
      { children, initial, animate, exit, transition, whileHover, ...props },
      ref
    ) {
      return React.createElement(tag, { ...props, ref }, children);
    });

  return {
    motion: new Proxy(
      {},
      {
        get: (_, tag) => createMotionComponent(tag),
      }
    ),
    AnimatePresence: ({ children }) => children,
    useReducedMotion: () => true,
  };
});

// Replace Next.js Link with a normal anchor for testing.
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("ScamShield HomePage", () => {
  it("renders the message editor and analysis button", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("button", { name: /analyze message/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Analysis output")
    ).toBeInTheDocument();
  });

  it("loads the suspicious sample into the editor", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    // Target the quick-sample button specifically to avoid duplicate text clashes with the sidebar
    const sampleButton = screen.getAllByRole("button", { name: /suspicious prize/i })[0];
    await user.click(sampleButton);

    const editor = screen.getByRole("textbox");

    expect(editor.value).toContain("KSh 150,000");
    expect(editor.value).toContain("M-Pesa PIN");
  });

  it("shows a validation message when the editor is empty", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<HomePage />);

    await user.click(
      screen.getByRole("button", { name: /analyze message/i })
    );

    expect(
      await screen.findByText(
        "Enter a message before starting the analysis."
      )
    ).toBeInTheDocument();

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("submits a message and displays the returned analysis", async () => {
    const user = userEvent.setup();

    const mockAnalysis = {
      risk_level: "high",
      predicted_label: "spam",
      spam_probability: 0.98,
      ham_probability: 0.02,
      risk_reasons: ["The message uses urgency and requests sensitive information."],
      findings: [
        {
          rule_id: "credential_request",
          category: "credential_request",
          severity: "high",
          matched_text: "M-Pesa PIN",
          explanation: "Never share your PIN with an unverified recipient.",
        },
      ],
      recommendations: [
        "Do not share your PIN.",
        "Verify the offer through an official channel.",
      ],
      disclaimer:
        "This analysis is advisory and does not prove that a message is fraudulent.",
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockAnalysis,
    });

    vi.stubGlobal("fetch", fetchMock);

    render(<HomePage />);

    const sampleButton = screen.getAllByRole("button", { name: /suspicious prize/i })[0];
    await user.click(sampleButton);

    await user.click(
      screen.getByRole("button", { name: /analyze message/i })
    );

    await waitFor(() => {
      expect(screen.getByText("Analysis complete")).toBeInTheDocument();
    });

    expect(screen.getByText("HIGH RISK")).toBeInTheDocument();
    expect(screen.getByText("Spam-like")).toBeInTheDocument();
    expect(screen.getByText("98.0%")).toBeInTheDocument();

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/analyze$/),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: expect.any(String),
        }),
      })
    );
  });
});