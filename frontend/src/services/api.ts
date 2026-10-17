import {
  StartupInput,
  AnalysisReportResponse,
  AnalysisSummaryItem,
  SystemStatusResponse,
} from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_URL || '/api';

function extractErrorMessage(errorData: any, status: number): string {
  if (!errorData) {
    return `Server returned HTTP status ${status}. Ensure the backend is running.`;
  }
  if (typeof errorData.detail === 'string') {
    return errorData.detail;
  }
  if (Array.isArray(errorData.detail)) {
    // Format FastAPI Pydantic validation errors
    return errorData.detail
      .map((d: any) => {
        const field = d.loc?.slice(1).join('.') || 'field';
        return `${field}: ${d.msg}`;
      })
      .join(' | ');
  }
  return errorData.message || `Request failed with HTTP ${status}`;
}

export async function getHealth(): Promise<{ status: string; database_connected: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error(`Health check failed with HTTP ${res.status}`);
    return res.json();
  } catch (err: any) {
    throw new Error(`Cannot reach backend health check: ${err.message}`);
  }
}

export async function getSystemStatus(): Promise<SystemStatusResponse> {
  try {
    const res = await fetch(`${API_BASE}/system/status`);
    if (!res.ok) throw new Error(`Failed to retrieve system status (HTTP ${res.status})`);
    return res.json();
  } catch (err: any) {
    throw new Error(`System status check error: ${err.message}`);
  }
}

export async function createAnalysis(payload: StartupInput): Promise<AnalysisReportResponse> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/analyses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (netErr: any) {
    throw new Error(
      `Unable to connect to VentureLens backend at "${API_BASE}". ` +
      `Ensure the FastAPI backend is running on port 8000. (${netErr.message})`
    );
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    const message = extractErrorMessage(errorData, res.status);
    throw new Error(message);
  }

  return res.json();
}

export async function listAnalyses(query?: string): Promise<AnalysisSummaryItem[]> {
  const url = query ? `${API_BASE}/analyses?q=${encodeURIComponent(query)}` : `${API_BASE}/analyses`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch analyses list (HTTP ${res.status})`);
    return res.json();
  } catch (err: any) {
    throw new Error(`Error loading reports: ${err.message}`);
  }
}

export async function getAnalysis(id: string): Promise<AnalysisReportResponse> {
  try {
    const res = await fetch(`${API_BASE}/analyses/${encodeURIComponent(id)}`);
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(extractErrorMessage(errorData, res.status));
    }
    return res.json();
  } catch (err: any) {
    throw new Error(`Error loading report ${id}: ${err.message}`);
  }
}

export async function deleteAnalysis(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/analyses/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(extractErrorMessage(errorData, res.status));
  }
}

export async function exportAnalysis(id: string, format: 'json' | 'markdown'): Promise<string | object> {
  const res = await fetch(`${API_BASE}/analyses/${encodeURIComponent(id)}/export?format=${format}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(extractErrorMessage(errorData, res.status));
  }
  if (format === 'markdown') {
    return res.text();
  }
  return res.json();
}

export async function seedDemoData(): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/seed`, { method: 'POST' });
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(extractErrorMessage(errorData, res.status));
  }
  return res.json();
}
