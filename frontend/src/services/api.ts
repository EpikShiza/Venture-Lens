import {
  StartupInput,
  AnalysisReportResponse,
  AnalysisSummaryItem,
  SystemStatusResponse,
} from '../types';

const API_BASE = '/api';

export async function getHealth(): Promise<{ status: string; database_connected: boolean }> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function getSystemStatus(): Promise<SystemStatusResponse> {
  const res = await fetch(`${API_BASE}/system/status`);
  if (!res.ok) throw new Error('Failed to retrieve system status');
  return res.json();
}

export async function createAnalysis(payload: StartupInput): Promise<AnalysisReportResponse> {
  const res = await fetch(`${API_BASE}/analyses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Analysis request failed with status ${res.status}`);
  }
  return res.json();
}

export async function listAnalyses(query?: string): Promise<AnalysisSummaryItem[]> {
  const url = query ? `${API_BASE}/analyses?q=${encodeURIComponent(query)}` : `${API_BASE}/analyses`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch analyses list');
  return res.json();
}

export async function getAnalysis(id: string): Promise<AnalysisReportResponse> {
  const res = await fetch(`${API_BASE}/analyses/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Report not found (ID: ${id})`);
  return res.json();
}

export async function deleteAnalysis(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/analyses/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete report');
}

export async function exportAnalysis(id: string, format: 'json' | 'markdown'): Promise<string | object> {
  const res = await fetch(`${API_BASE}/analyses/${encodeURIComponent(id)}/export?format=${format}`);
  if (!res.ok) throw new Error('Export request failed');
  if (format === 'markdown') {
    return res.text();
  }
  return res.json();
}

export async function seedDemoData(): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/seed`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to seed demo data');
  return res.json();
}
