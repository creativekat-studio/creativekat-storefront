"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

type ProjectType =
  | "logo"
  | "brand-system"
  | "website"
  | "shop"
  | "other";

const PROJECT_TYPES: { value: ProjectType; label: string; sub: string }[] = [
  {
    value: "logo",
    label: "Logo / brand identity",
    sub: "Wordmark, mark, full identity system, or rebrand.",
  },
  {
    value: "brand-system",
    label: "Brand system",
    sub: "Tokens, components, guidelines — for a team or product.",
  },
  {
    value: "website",
    label: "Website / web app",
    sub: "Marketing site, portfolio, dashboard, or product UI.",
  },
  {
    value: "shop",
    label: "Online shop / storefront",
    sub: "E-commerce, inventory, payments, fulfillment.",
  },
  {
    value: "other",
    label: "Something else",
    sub: "Tell us what you have in mind.",
  },
];

const BUDGETS = [
  "Under ₱5,000",
  "₱5,000 – ₱10,000",
  "₱10,000 – ₱25,000",
  "₱25,000+",
  "Open to discussion",
];

export default function ProjectBriefForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [projectType, setProjectType] = useState<ProjectType>("logo");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/project-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, projectType }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong.");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
          — Got it
        </p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight">
          Thanks so much — we&apos;ve got your brief.
        </h3>
        <p className="mt-3 text-[var(--muted)]">
          We&apos;re going to sit with it for a bit, then reply from{" "}
          <a
            href="mailto:hello@creativekat.studio"
            className="underline decoration-dotted underline-offset-4"
          >
            hello@creativekat.studio
          </a>{" "}
          within 1–3 business days — usually with next steps and a tailored
          discovery doc. Talk soon.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm underline decoration-dotted underline-offset-4"
        >
          Send another brief
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8"
    >
      {/* About you */}
      <Section eyebrow="01 — Say hi" title="Tell us a little about you.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Your name" name="name" required />
          <Field label="Email" name="email" type="email" required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Company or brand (if you have one)"
            name="company"
            hint="Totally fine to leave blank if it's just you for now."
          />
          <Field
            label="Website or social link"
            name="link"
            type="url"
            hint="Anything — Instagram, a Notion doc, a Linktree."
          />
        </div>
      </Section>

      {/* Project type */}
      <Section
        eyebrow="02 — The project"
        title="What are we making together?"
        hint="Pick the closest fit — even a rough guess is fine. We'll sort the details on a call."
      >
        <ul className="space-y-2">
          {PROJECT_TYPES.map((t) => (
            <li key={t.value}>
              <label
                aria-label={t.label}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--border)] p-4 transition hover:border-violet-500/60 has-[:checked]:border-violet-500 has-[:checked]:bg-violet-500/5"
              >
                <input
                  type="radio"
                  name="projectTypeRadio"
                  value={t.value}
                  checked={projectType === t.value}
                  onChange={() => setProjectType(t.value)}
                  className="mt-1 accent-violet-600"
                />
                <span>
                  <span className="block text-sm font-medium">{t.label}</span>
                  <span className="block text-xs text-[var(--muted)]">
                    {t.sub}
                  </span>
                </span>
              </label>
            </li>
          ))}
        </ul>

        <Textarea
          label="In one sentence — what is this?"
          name="summary"
          required
          hint="Plain language beats marketing-speak every time. E.g. “A loose-leaf tea shop in Bali with a small online store.”"
          rows={2}
        />
      </Section>

      {/* Conditional — Logo / Brand identity */}
      {projectType === "logo" && (
        <Section eyebrow="03 — The vibe" title="Help us see what you see.">
          <Textarea
            label="What is the business, in your words?"
            name="logo_business"
            hint="Short paragraph is great. What it is, what makes it specific."
            rows={3}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Three words that describe the brand"
              name="logo_three_words"
              hint="E.g. “warm, honest, a little weird.”"
            />
            <Field
              label="Three words it should never be"
              name="logo_never_words"
              hint="E.g. “corporate, generic, sterile.”"
            />
          </div>
          <Textarea
            label="Brands you admire (any industry)"
            name="logo_inspiration"
            hint="Links welcome. Doesn't have to be in your category."
            rows={2}
          />
          <Textarea
            label="Where this logo will live"
            name="logo_uses"
            hint="Packaging? Web? Embroidered shirts? Storefront sign?"
            rows={2}
          />
        </Section>
      )}

      {/* Conditional — Brand system */}
      {projectType === "brand-system" && (
        <Section eyebrow="03 — Brand system" title="What needs to be designed?">
          <Textarea
            label="What surfaces does this brand live on?"
            name="bs_surfaces"
            hint="Web, app, print, packaging, internal docs — list whatever applies."
            rows={2}
          />
          <Textarea
            label="What exists today?"
            name="bs_existing"
            hint="Existing logo, palette, type? Anything to keep or replace."
            rows={2}
          />
          <Field
            label="Team size that will use this"
            name="bs_team"
            hint="Solo, small team, distributed contributors?"
          />
        </Section>
      )}

      {/* Conditional — Website */}
      {projectType === "website" && (
        <Section eyebrow="03 — Website" title="What kind of site?">
          <Field
            label="Type of site"
            name="web_kind"
            hint="Marketing site, web app, dashboard, portfolio, etc."
          />
          <Textarea
            label="Key pages or features"
            name="web_features"
            hint="Bullet points are fine. E.g. landing, blog, login, dashboard."
            rows={3}
          />
          <Field
            label="Existing site URL (if redesign)"
            name="web_existing"
            type="url"
          />
          <Textarea
            label="Sites you admire"
            name="web_inspiration"
            hint="Links welcome. Doesn't matter if they're in your industry."
            rows={2}
          />
        </Section>
      )}

      {/* Conditional — Shop */}
      {projectType === "shop" && (
        <Section eyebrow="03 — Shop" title="Tell us about the shop.">
          <Field label="What are you selling?" name="shop_products" />
          <Field
            label="Approximate catalog size"
            name="shop_catalog"
            hint="Under 50, 50–500, 500+, or “growing fast.”"
          />
          <Textarea
            label="Payments, shipping, integrations"
            name="shop_integrations"
            hint="Stripe? Shopify? Custom inventory? Tell us what's wired up or what you want."
            rows={2}
          />
          <Textarea
            label="Shops you admire"
            name="shop_inspiration"
            hint="Links welcome."
            rows={2}
          />
        </Section>
      )}

      {/* Conditional — Other */}
      {projectType === "other" && (
        <Section eyebrow="03 — Tell us more" title="What do you have in mind?">
          <Textarea
            label="Describe the project"
            name="other_description"
            hint="As much or as little detail as you want — we'll fill the gaps on a call."
            rows={4}
            required
          />
        </Section>
      )}

      {/* Logistics */}
      <Section
        eyebrow="04 — The boring-but-essential bits"
        title="Last few — promise."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Target launch or hard deadline"
            name="timeline"
            hint="A date, a season, or “whenever it's ready.” All good."
          />
          <SelectField label="Budget range" name="budget" options={BUDGETS} />
        </div>
        <Textarea
          label="Anything else you want us to know?"
          name="extras"
          hint="Stories, quirks, dealbreakers — anything. The best work usually hides in the small details."
          rows={3}
        />
      </Section>

      {/* honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-6">
        <p className="text-xs text-[var(--muted)]">
          Lands in our inbox at hello@creativekat.studio
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-[0_8px_30px_-8px_rgba(79,70,229,0.6)] transition hover:brightness-110 disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Send it our way →"}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </form>
  );
}

function Section({
  eyebrow,
  title,
  hint,
  children,
}: {
  eyebrow: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-4">
      <legend className="mb-2">
        <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
          — {eyebrow}
        </p>
        <p className="mt-1 text-lg font-semibold tracking-tight">{title}</p>
        {hint && (
          <p className="mt-1 text-sm text-[var(--muted)]">{hint}</p>
        )}
      </legend>
      <div className="space-y-4">{children}</div>
    </fieldset>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-[var(--foreground)]">
        {label}
        {required && <span className="ml-0.5 text-[var(--muted)]">*</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
      />
      {hint && (
        <span className="mt-1 block text-xs italic text-[var(--muted)]">
          {hint}
        </span>
      )}
    </label>
  );
}

function Textarea({
  label,
  name,
  required = false,
  hint,
  rows = 3,
}: {
  label: string;
  name: string;
  required?: boolean;
  hint?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-[var(--foreground)]">
        {label}
        {required && <span className="ml-0.5 text-[var(--muted)]">*</span>}
      </span>
      <textarea
        name={name}
        required={required}
        rows={rows}
        className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
      />
      {hint && (
        <span className="mt-1 block text-xs italic text-[var(--muted)]">
          {hint}
        </span>
      )}
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-[var(--foreground)]">
        {label}
      </span>
      <select
        name={name}
        defaultValue=""
        className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
      >
        <option value="" disabled>
          Pick a range
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
