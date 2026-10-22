"use client";

// Labelled input/select with the inline error strap. Shared by the
// /we-buy intake form (SellForm) and checkout (CheckoutForm).

import { cn } from "@/lib/utils";

export function Req() {
  return (
    <span
      aria-hidden="true"
      className="ml-1 inline-block bg-accent px-[0.35em] text-ink"
    >
      ✱
    </span>
  );
}

export function Field({
  id,
  label,
  required,
  error,
  value,
  onChange,
  placeholder,
  autoComplete,
  autoCapitalize,
  spellCheck,
  inputMode,
  type = "text",
  maxLength,
}: {
  type?: "text" | "email" | "tel";
  maxLength?: number;
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  autoCapitalize?: "off" | "none" | "on" | "sentences" | "words" | "characters";
  spellCheck?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <div className={cn(error && "field-has-error")}>
      <label htmlFor={id} className="field-label">
        {label} {required && <Req />}
      </label>
      <input
        id={id}
        type={type}
        maxLength={maxLength}
        className="field-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : undefined}
        autoComplete={autoComplete}
        autoCapitalize={autoCapitalize}
        spellCheck={spellCheck}
        inputMode={inputMode}
      />
      <p
        id={`${id}-err`}
        className="field-error"
        data-show={Boolean(error)}
        role={error ? "alert" : undefined}
      >
        {error ?? " "}
      </p>
    </div>
  );
}

export function SelectField({
  id,
  label,
  required,
  error,
  value,
  onChange,
  options,
  placeholder,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <div className={cn(error && "field-has-error")}>
      <label htmlFor={id} className="field-label">
        {label} {required && <Req />}
      </label>
      <select
        id={id}
        className="field-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : undefined}
      >
        <option value="" disabled>
          {placeholder ?? "Choose…"}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <p
        id={`${id}-err`}
        className="field-error"
        data-show={Boolean(error)}
        role={error ? "alert" : undefined}
      >
        {error ?? " "}
      </p>
    </div>
  );
}
