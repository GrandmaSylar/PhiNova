"use client";

import { useState, type FormEvent } from "react";
import { PaperPlaneTilt, CircleNotch } from "@phosphor-icons/react";
import { MagneticButton } from "./MagneticButton";

const PRODUCTS = [
  "Invitro LIMS",
  "COCM",
  "Concord SMS",
  "Not sure yet",
  "General enquiry",
];

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      product: (form.elements.namedItem("product") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="glass glass-interactive px-8 py-12 md:px-12 flex flex-col items-center text-center gap-4">
        <span className="text-3xl select-none" role="img" aria-hidden="true">&#10003;</span>
        <h2 className="text-xl font-semibold text-ink dark:text-canvas">Message sent</h2>
        <p className="text-sm text-ink/60 dark:text-canvas/60 max-w-[36ch]">
          We have received your enquiry and will get back to you within one business day.
        </p>
      </div>
    );
  }

  return (
    <form
      className="glass glass-interactive px-8 py-10 md:px-12 flex flex-col gap-6"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Your name" htmlFor="name">
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Ama Owusu"
            className={inputClass}
          />
        </Field>
        <Field label="Email address" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="ama@organisation.gh"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Product interest" htmlFor="product">
        <select id="product" name="product" required className={inputClass}>
          <option value="">Select a product</option>
          {PRODUCTS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </Field>

      <Field label="Message" htmlFor="message">
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell us about your institution and what you are trying to solve..."
          className={`${inputClass} resize-none`}
        />
      </Field>

      <MagneticButton
        type="submit"
        disabled={status === "sending"}
        className="
          self-start inline-flex items-center gap-2.5 px-6 py-3 rounded-full
          bg-navy text-white text-sm font-semibold
          hover:bg-ink transition-colors duration-200 active:scale-[0.97]
          disabled:opacity-60 disabled:cursor-not-allowed
        "
      >
        {status === "sending" ? (
          <>
            <CircleNotch size={16} className="animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send message
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/15">
              <PaperPlaneTilt size={10} weight="fill" />
            </span>
          </>
        )}
      </MagneticButton>

      {status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          Something went wrong. Please try again or email us directly.
        </p>
      )}
    </form>
  );
}

const inputClass =
  "w-full px-4 py-3 rounded-[var(--radius-input)] bg-white/50 dark:bg-white/8 border border-ink/15 dark:border-canvas/15 text-ink dark:text-canvas text-sm placeholder:text-ink/35 dark:placeholder:text-canvas/35 focus:outline-none focus:ring-2 focus:ring-steel/50 focus:border-steel/50 transition-colors";

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-semibold text-ink/60 dark:text-canvas/60">
        {label}
      </label>
      {children}
    </div>
  );
}
