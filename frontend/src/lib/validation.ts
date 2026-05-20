import { StatementSummary, Transaction, ValidationResult } from "./types";

function numberOrZero(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

export function calculateValidation(
  statement: StatementSummary,
  transactions: Transaction[],
): ValidationResult {
  const beginning = statement.beginning_balance ?? null;
  const ending = statement.ending_balance ?? null;
  const totalDebits = roundMoney(
    transactions.reduce((sum, transaction) => sum + numberOrZero(transaction.debit), 0),
  );
  const totalCredits = roundMoney(
    transactions.reduce((sum, transaction) => sum + numberOrZero(transaction.credit), 0),
  );

  if (beginning === null || ending === null) {
    return {
      is_valid: false,
      status: "missing-balances",
      message: "Beginning or ending balance was not found.",
      beginning_balance: beginning,
      ending_balance: ending,
      calculated_ending_balance: null,
      difference: null,
      total_debits: totalDebits,
      total_credits: totalCredits,
      transaction_count: transactions.length,
    };
  }

  const calculated = roundMoney(beginning + totalCredits - totalDebits);
  const difference = roundMoney(calculated - ending);
  const isValid = Math.abs(difference) <= 0.02;
  return {
    is_valid: isValid,
    status: isValid ? "valid" : "mismatch",
    message: isValid
      ? "Balances reconcile."
      : "The edited rows do not reconcile to the ending balance.",
    beginning_balance: beginning,
    ending_balance: ending,
    calculated_ending_balance: calculated,
    difference,
    total_debits: totalDebits,
    total_credits: totalCredits,
    transaction_count: transactions.length,
  };
}

export function formatMoney(value: number | null | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "-";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}
