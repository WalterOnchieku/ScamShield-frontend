
/*
 * File: api.js
 *
 * Purpose:
 * Centralize requests to the ScamShield KE FastAPI backend.
 * Shared API functions keep pages consistent and simplify
 * error handling.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://scamshield-backend-6olh.onrender.com";

/**
 * Parse a backend response and produce a useful error when
 * the server rejects a request.
 */
async function parseResponse(response) {
  if (!response.ok) {
    let message = `Request failed with status ${response.status}.`;

    try {
      const body = await response.json();

      if (typeof body.detail === "string") {
        message = body.detail;
      }
    } catch {
      // Retain the default message for non-JSON responses.
    }

    throw new Error(message);
  }

  return response.json();
}

/**
 * Retrieve a page of saved analyses.
 */
export async function getAnalysisHistory({ limit = 10, offset = 0, riskLevel } = {}) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });

  if (riskLevel && riskLevel !== "all") {
    params.set("risk_level", riskLevel);
  }

  const response = await fetch(
    `${API_BASE_URL}/history?${params.toString()}`
  );

  return parseResponse(response);
}

/**
 * Retrieve a single saved analysis.
 */
export async function getAnalysisById(id) {
  const response = await fetch(`${API_BASE_URL}/history/${id}`);
  return parseResponse(response);
}

/**
 * Delete a saved analysis.
 */
export async function deleteAnalysis(id) {
  const response = await fetch(`${API_BASE_URL}/history/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    await parseResponse(response);
  }
}
