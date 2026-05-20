"use client";

import { Plus, Trash2 } from "lucide-react";

import { Transaction } from "@/lib/types";

type EditableTransactionsTableProps = {
  transactions: Transaction[];
  onChange: (transactions: Transaction[]) => void;
};

function parseMoney(value: string) {
  if (value.trim() === "") {
    return null;
  }
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function moneyValue(value: number | null | undefined) {
  return value === null || value === undefined ? "" : String(value);
}

export function EditableTransactionsTable({
  transactions,
  onChange,
}: EditableTransactionsTableProps) {
  function updateRow(index: number, patch: Partial<Transaction>) {
    onChange(
      transactions.map((transaction, rowIndex) =>
        rowIndex === index ? { ...transaction, ...patch } : transaction,
      ),
    );
  }

  function addRow() {
    onChange([
      ...transactions,
      {
        id: `manual-${crypto.randomUUID()}`,
        date: "",
        description: "",
        debit: null,
        credit: null,
        balance: null,
        raw: "Manual row",
        confidence: 1,
      },
    ]);
  }

  function removeRow(index: number) {
    onChange(transactions.filter((_, rowIndex) => rowIndex !== index));
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-soft">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Transactions</h2>
          <p className="text-sm text-slate-500">{transactions.length} extracted rows</p>
        </div>
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add row
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[920px] w-full border-collapse text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="w-36 px-3 py-3 font-semibold">Date</th>
              <th className="min-w-80 px-3 py-3 font-semibold">Description</th>
              <th className="w-32 px-3 py-3 text-right font-semibold">Debit</th>
              <th className="w-32 px-3 py-3 text-right font-semibold">Credit</th>
              <th className="w-32 px-3 py-3 text-right font-semibold">Balance</th>
              <th className="w-16 px-3 py-3 text-right font-semibold"> </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={transaction.id || index} className="border-t border-slate-100">
                <td className="px-3 py-2 align-top">
                  <input
                    value={transaction.date || ""}
                    onChange={(event) => updateRow(index, { date: event.target.value })}
                    className="h-10 w-full rounded-md border border-slate-200 bg-white px-2 text-slate-900"
                    placeholder="YYYY-MM-DD"
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <textarea
                    value={transaction.description || ""}
                    onChange={(event) => updateRow(index, { description: event.target.value })}
                    className="min-h-10 w-full resize-y rounded-md border border-slate-200 bg-white px-2 py-2 text-slate-900"
                    rows={1}
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <input
                    type="number"
                    step="0.01"
                    value={moneyValue(transaction.debit)}
                    onChange={(event) => updateRow(index, { debit: parseMoney(event.target.value) })}
                    className="money-input h-10 w-full rounded-md border border-slate-200 bg-white px-2 text-right text-slate-900"
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <input
                    type="number"
                    step="0.01"
                    value={moneyValue(transaction.credit)}
                    onChange={(event) => updateRow(index, { credit: parseMoney(event.target.value) })}
                    className="money-input h-10 w-full rounded-md border border-slate-200 bg-white px-2 text-right text-slate-900"
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <input
                    type="number"
                    step="0.01"
                    value={moneyValue(transaction.balance)}
                    onChange={(event) => updateRow(index, { balance: parseMoney(event.target.value) })}
                    className="money-input h-10 w-full rounded-md border border-slate-200 bg-white px-2 text-right text-slate-900"
                  />
                </td>
                <td className="px-3 py-2 text-right align-top">
                  <button
                    type="button"
                    aria-label="Delete row"
                    title="Delete row"
                    onClick={() => removeRow(index)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-500 transition hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
