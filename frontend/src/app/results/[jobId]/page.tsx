"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AlertTriangle, ArrowLeft, Download, Loader2, RefreshCcw } from "lucide-react";

import { EditableTransactionsTable } from "@/components/EditableTransactionsTable";
import { StatementSummary } from "@/components/StatementSummary";
import { API_URL, apiFetch } from "@/lib/api";
import { JobResult, Transaction } from "@/lib/types";
import { calculateValidation } from "@/lib/validation";

export default function ResultsPage() {
  const params = useParams<{ jobId: string }>();
  const jobId = params.jobId;
  const [result, setResult] = useState<JobResult | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [exporting, setExporting] = useState<"csv" | "xlsx" | null>(null);

  async function loadResult() {
    setIsLoading(true);
    setError("");
    try {
      const payload = await apiFetch<JobResult>(`/result/${jobId}`);
      setResult(payload);
      setTransactions(payload.transactions);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load result.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (jobId) {
      void loadResult();
    }
  }, [jobId]);

  const validation = useMemo(() => {
    if (!result) {
      return null;
    }
    return calculateValidation(result.statement, transactions);
  }, [result, transactions]);

  async function exportFile(kind: "csv" | "xlsx") {
    if (!result) {
      return;
    }
    setExporting(kind);
    setError("");
    try {
      const response = await fetch(`${API_URL}/export/${kind}/${jobId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          statement: result.statement,
          transactions,
        }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.detail || `Export failed with status ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${result.filename.replace(/\.pdf$/i, "")}.${kind}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : "Export failed.");
    } finally {
      setExporting(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-5 py-6">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              aria-label="Back to upload"
              title="Back to upload"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
            <div>
              <p className="text-lg font-semibold text-slate-950">StatementFlow</p>
              <p className="text-sm text-slate-500">Review and export</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={loadResult}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <RefreshCcw className="h-4 w-4" aria-hidden="true" />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => exportFile("csv")}
              disabled={exporting !== null || !transactions.length}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-sky-700 px-3 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {exporting === "csv" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Download className="h-4 w-4" aria-hidden="true" />
              )}
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => exportFile("xlsx")}
              disabled={exporting !== null || !transactions.length}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-emerald-700 px-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {exporting === "xlsx" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Download className="h-4 w-4" aria-hidden="true" />
              )}
              Export XLSX
            </button>
          </div>
        </header>

        {isLoading ? (
          <div className="grid min-h-96 place-items-center rounded-lg border border-slate-200 bg-white">
            <div className="flex items-center gap-3 text-slate-600">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              Loading result
            </div>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : result && validation ? (
          <div className="grid gap-5">
            {(result.is_demo_data || result.warnings.length > 0) && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
                  <div>
                    <p className="font-semibold">
                      {result.is_demo_data ? "Demo data is being shown." : "Review recommended."}
                    </p>
                    <ul className="mt-2 grid gap-1">
                      {result.warnings.map((warning) => (
                        <li key={warning}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <StatementSummary
              statement={result.statement}
              validation={validation}
              filename={result.filename}
            />
            <EditableTransactionsTable transactions={transactions} onChange={setTransactions} />
          </div>
        ) : null}
      </div>
    </main>
  );
}
