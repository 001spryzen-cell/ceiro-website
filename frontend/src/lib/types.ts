export type Transaction = {
  id?: string;
  date: string;
  description: string;
  debit: number | null;
  credit: number | null;
  balance: number | null;
  raw?: string;
  confidence?: number;
};

export type StatementSummary = {
  bank_name?: string | null;
  account_holder_name?: string | null;
  account_number_last4?: string | null;
  statement_period_start?: string | null;
  statement_period_end?: string | null;
  beginning_balance?: number | null;
  ending_balance?: number | null;
  parser_name?: string;
  confidence?: number;
  is_demo_data?: boolean;
  warnings?: string[];
};

export type ValidationResult = {
  is_valid: boolean;
  status: string;
  message: string;
  beginning_balance: number | null;
  ending_balance: number | null;
  calculated_ending_balance: number | null;
  difference: number | null;
  total_debits: number;
  total_credits: number;
  transaction_count: number;
};

export type JobResult = {
  job_id: string;
  filename: string;
  created_at: string;
  selectable_text: boolean;
  extraction_source: string;
  statement: StatementSummary;
  transactions: Transaction[];
  validation: ValidationResult;
  warnings: string[];
  is_demo_data: boolean;
};
