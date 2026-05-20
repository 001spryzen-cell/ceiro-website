import { AlertTriangle, CheckCircle2, FileText } from "lucide-react";

import { formatMoney } from "@/lib/validation";
import { StatementSummary as StatementSummaryType, ValidationResult } from "@/lib/types";

type StatementSummaryProps = {
  statement: StatementSummaryType;
  validation: ValidationResult;
  filename: string;
};

function valueOrDash(value?: string | number | null) {
  return value === null || value === undefined || value === "" ? "-" : String(value);
}

export function StatementSummary({ statement, validation, filename }: StatementSummaryProps) {
  const confidence = Math.round((statement.confidence ?? 0) * 100);
  return (
    <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-sky-50 text-sky-700">
              <FileText className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Statement summary</h2>
              <p className="text-sm text-slate-500">{filename}</p>
            </div>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {confidence}% confidence
          </span>
        </div>

        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase text-slate-500">Bank</dt>
            <dd className="mt-1 text-sm font-medium text-slate-900">{valueOrDash(statement.bank_name)}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-slate-500">Account holder</dt>
            <dd className="mt-1 text-sm font-medium text-slate-900">
              {valueOrDash(statement.account_holder_name)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-slate-500">Account last 4</dt>
            <dd className="mt-1 text-sm font-medium text-slate-900">
              {valueOrDash(statement.account_number_last4)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-slate-500">Period</dt>
            <dd className="mt-1 text-sm font-medium text-slate-900">
              {valueOrDash(statement.statement_period_start)} to {valueOrDash(statement.statement_period_end)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-slate-500">Beginning balance</dt>
            <dd className="mt-1 text-sm font-medium text-slate-900">
              {formatMoney(statement.beginning_balance)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-slate-500">Ending balance</dt>
            <dd className="mt-1 text-sm font-medium text-slate-900">
              {formatMoney(statement.ending_balance)}
            </dd>
          </div>
        </dl>
      </div>

      <div
        className={`rounded-lg border p-5 shadow-soft ${
          validation.is_valid
            ? "border-emerald-200 bg-emerald-50"
            : "border-amber-200 bg-amber-50"
        }`}
      >
        <div className="flex items-start gap-3">
          {validation.is_valid ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-700" aria-hidden="true" />
          ) : (
            <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-700" aria-hidden="true" />
          )}
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Validation</h2>
            <p className="mt-1 text-sm text-slate-700">{validation.message}</p>
          </div>
        </div>
        <dl className="mt-5 grid gap-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-600">Credits</dt>
            <dd className="font-semibold text-slate-950">{formatMoney(validation.total_credits)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-600">Debits</dt>
            <dd className="font-semibold text-slate-950">{formatMoney(validation.total_debits)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-600">Calculated ending</dt>
            <dd className="font-semibold text-slate-950">
              {formatMoney(validation.calculated_ending_balance)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-600">Difference</dt>
            <dd className="font-semibold text-slate-950">{formatMoney(validation.difference)}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
