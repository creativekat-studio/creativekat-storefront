import type { MilestoneCompletionDraft } from "@/lib/crm/milestoneCompletion";
import { formatDocumentDate } from "@/lib/crm/milestoneCompletion";

type Props = {
  draft: MilestoneCompletionDraft;
};

export default function MilestoneCompletionDocument({ draft }: Props) {
  const phase = draft.phaseLabel.trim() || "Phase 1";
  const client = draft.clientName.trim() || "Client";
  const payment = draft.paymentAmount.trim();

  return (
    <article className="milestone-doc mx-auto max-w-[720px] bg-white px-10 py-12 text-[13px] leading-relaxed text-neutral-900 shadow-sm print:max-w-none print:px-0 print:py-0 print:shadow-none">
      <header className="border-b border-neutral-900 pb-4 text-center">
        <h1 className="text-lg font-bold tracking-[0.08em] uppercase">
          {phase} Milestone Completion
        </h1>
      </header>

      <section className="mt-8">
        <h2 className="mb-3 text-[11px] font-bold tracking-[0.14em] uppercase">
          Project Description
        </h2>
        <table className="w-full border-collapse">
          <tbody>
            <tr className="border-b border-neutral-200">
              <th className="w-[40%] py-2 pr-4 text-left text-[11px] font-semibold tracking-wide text-neutral-500 uppercase">
                Project Title
              </th>
              <td className="py-2 font-medium">{draft.projectTitle}</td>
            </tr>
            <tr>
              <th className="py-2 pr-4 text-left text-[11px] font-semibold tracking-wide text-neutral-500 uppercase">
                Date
              </th>
              <td className="py-2">{formatDocumentDate(draft.documentDate)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-[11px] font-bold tracking-[0.14em] uppercase">
          Parties
        </h2>
        <table className="w-full border-collapse">
          <tbody>
            <tr className="border-b border-neutral-200">
              <th className="w-[40%] py-2 pr-4 text-left text-[11px] font-semibold tracking-wide text-neutral-500 uppercase">
                Client
              </th>
              <td className="py-2">{client}</td>
            </tr>
            <tr className="border-b border-neutral-200">
              <th className="py-2 pr-4 text-left text-[11px] font-semibold tracking-wide text-neutral-500 uppercase">
                Representative
              </th>
              <td className="py-2">
                {draft.clientRepresentative.trim() || "__________________________"}
              </td>
            </tr>
            <tr className="border-b border-neutral-200">
              <th className="py-2 pr-4 text-left text-[11px] font-semibold tracking-wide text-neutral-500 uppercase">
                Developer
              </th>
              <td className="py-2">{draft.developerName}</td>
            </tr>
            <tr>
              <th className="py-2 pr-4 text-left text-[11px] font-semibold tracking-wide text-neutral-500 uppercase">
                Representative
              </th>
              <td className="py-2">{draft.developerRepresentative}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="mt-8 break-inside-avoid">
        <h2 className="mb-2 text-[11px] font-bold tracking-[0.14em] uppercase">
          I. {phase} Milestone Status
        </h2>
        <p className="text-neutral-800">{draft.statusSummary}</p>
      </section>

      <section className="mt-8">
        <h2 className="mb-2 text-[11px] font-bold tracking-[0.14em] uppercase">
          II. {phase} Deliverables Checklist
        </h2>
        <p className="mb-3 text-neutral-700">
          The following checklist contains the {phase} deliverables based on the
          agreed scope:
        </p>
        <table className="w-full border-collapse border border-neutral-300">
          <thead>
            <tr className="bg-neutral-50">
              <th className="w-10 border-b border-neutral-300 px-3 py-2 text-left text-[11px] font-semibold tracking-wide uppercase">
                #
              </th>
              <th className="border-b border-neutral-300 px-3 py-2 text-left text-[11px] font-semibold tracking-wide uppercase">
                Item
              </th>
              <th className="w-32 border-b border-neutral-300 px-3 py-2 text-left text-[11px] font-semibold tracking-wide uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {draft.deliverables.map((item, index) => (
              <tr key={item.id} className="border-b border-neutral-200 last:border-b-0">
                <td className="px-3 py-2 text-neutral-500">{index + 1}</td>
                <td className="px-3 py-2">{item.label}</td>
                <td className="px-3 py-2 font-medium">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-8 break-before-page">
        <h2 className="mb-2 text-[11px] font-bold tracking-[0.14em] uppercase">
          III. Pending Items / Continuing Work
        </h2>
        <p className="mb-3 text-neutral-700">
          The following items will continue to be addressed as part of the
          succeeding development phases:
        </p>
        <table className="w-full border-collapse border border-neutral-300">
          <thead>
            <tr className="bg-neutral-50">
              <th className="w-10 border-b border-neutral-300 px-3 py-2 text-left text-[11px] font-semibold tracking-wide uppercase">
                
              </th>
              <th className="border-b border-neutral-300 px-3 py-2 text-left text-[11px] font-semibold tracking-wide uppercase">
                Item
              </th>
              <th className="w-44 border-b border-neutral-300 px-3 py-2 text-left text-[11px] font-semibold tracking-wide uppercase">
                Responsible Party
              </th>
            </tr>
          </thead>
          <tbody>
            {draft.pendingItems.map((item) => (
              <tr key={item.id} className="border-b border-neutral-200 last:border-b-0">
                <td className="px-3 py-2 text-neutral-400">☐</td>
                <td className="px-3 py-2">{item.label}</td>
                <td className="px-3 py-2">{item.responsible}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-8 break-inside-avoid">
        <h2 className="mb-2 text-[11px] font-bold tracking-[0.14em] uppercase">
          IV. Milestone Completion & Next Steps
        </h2>
        <p className="text-neutral-800">{draft.paymentNote}</p>
        {payment && (
          <p className="mt-4 font-semibold">
            {phase} Milestone Payment: {payment}
          </p>
        )}
        <p className="mt-4 text-neutral-800">
          Payment may now be processed with the succeeding development phase and
          final launch preparations.
        </p>
        {draft.nextStepsNote.trim() && (
          <p className="mt-4 text-neutral-800">{draft.nextStepsNote}</p>
        )}
      </section>

      <section className="mt-10 break-inside-avoid">
        <h2 className="mb-2 text-[11px] font-bold tracking-[0.14em] uppercase">
          V. Acceptance
        </h2>
        <p className="mb-6 text-neutral-800">
          By signing below, both parties acknowledge the completion status of{" "}
          {phase}, the listed deliverables, remaining items, and continuation of
          the project toward the succeeding.
        </p>

        <div className="grid grid-cols-2 gap-8">
          <SignatureBlock label="Client" />
          <SignatureBlock label="Developer" />
        </div>

        <div className="mt-8 space-y-2 border-t border-neutral-200 pt-6">
          <p>
            {phase} completion payment{payment ? ` (${payment})` : ""} received: ☐
            Yes
          </p>
          <p>
            Date: ______________________________
          </p>
        </div>
      </section>
    </article>
  );
}

function SignatureBlock({ label }: { label: string }) {
  return (
    <div>
      <p className="mb-4 text-[11px] font-bold tracking-[0.14em] uppercase">
        {label}
      </p>
      <div className="space-y-5 text-neutral-700">
        <p>
          Name
          <span className="mt-1 block border-b border-neutral-400 pt-5" />
        </p>
        <p>
          Signature
          <span className="mt-1 block border-b border-neutral-400 pt-5" />
        </p>
        <p>
          Date
          <span className="mt-1 block border-b border-neutral-400 pt-5" />
        </p>
      </div>
    </div>
  );
}
