import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowRight,
  Building2,
  Users,
  Package,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  LogIn,
  UserPlus,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveView, loadPreset, setIsAPKModalOpen } = useApp();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Does this work for a one-person shop?',
      a: 'Yes. Solo mode turns off departments, multi-step approvals, and tenders so you get fast purchasing, suppliers, and invoices.',
    },
    {
      q: 'What is 3-way matching?',
      a: 'Procura checks the purchase order, goods receipt, and invoice together. If quantities or amounts do not match, payment is blocked and finance is alerted.',
    },
    {
      q: 'Is this a real multi-user system?',
      a: 'This build is a full interactive demo with role switching and sample data. Use “Try demo” or onboarding to explore the workflow end to end.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top bar */}
      <nav className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
              P
            </div>
            <span className="text-base font-bold tracking-tight text-white">Procura</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('onboarding')}
              className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-900 hover:text-white sm:flex"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Sign up
            </button>
            <button
              onClick={() => loadPreset('enterprise')}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500"
            >
              <LogIn className="h-3.5 w-3.5" />
              Enter app
            </button>
          </div>
        </div>
      </nav>

      {/* Hero — short and direct */}
      <section className="mx-auto max-w-5xl px-4 pb-12 pt-14 sm:px-6 sm:pt-20">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-indigo-400">
          Procurement management
        </p>
        <h1 className="max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
          Request, approve, order, receive, and pay — in one place.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
          Adaptive workflows for solo traders, SMEs, and larger teams. Explore the live demo with
          sample data, or set up an organisation profile first.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => loadPreset('enterprise')}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500"
          >
            Try demo
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => setActiveView('onboarding')}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 hover:border-slate-600 hover:bg-slate-800"
          >
            <Building2 className="h-4 w-4 text-indigo-400" />
            Set up organisation
          </button>
        </div>

        {/* Quiet preset row */}
        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-medium text-slate-400">Jump in as:</span>
          <button
            onClick={() => loadPreset('individual')}
            className="rounded-md border border-slate-800 px-2.5 py-1 text-slate-300 hover:border-slate-600 hover:text-white"
          >
            Solo
          </button>
          <button
            onClick={() => loadPreset('smb')}
            className="rounded-md border border-slate-800 px-2.5 py-1 text-slate-300 hover:border-slate-600 hover:text-white"
          >
            SME
          </button>
          <button
            onClick={() => loadPreset('retail')}
            className="rounded-md border border-slate-800 px-2.5 py-1 text-slate-300 hover:border-slate-600 hover:text-white"
          >
            Retail
          </button>
          <button
            onClick={() => loadPreset('enterprise')}
            className="rounded-md border border-indigo-500/40 bg-indigo-500/10 px-2.5 py-1 text-indigo-300 hover:bg-indigo-500/20"
          >
            Enterprise
          </button>
        </div>
      </section>

      {/* What you get — 3 cards only */}
      <section className="border-t border-slate-900 bg-slate-950/80 py-14">
        <div className="mx-auto grid max-w-5xl gap-4 px-4 sm:grid-cols-3 sm:px-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <Users className="mb-3 h-5 w-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Roles & approvals</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
              Switch roles in the app to see requester, approver, procurement, finance, and vendor
              views.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <Package className="mb-3 h-5 w-5 text-sky-400" />
            <h3 className="text-sm font-bold text-white">Orders to stock</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
              RFQs, purchase orders, goods receipt, and inventory updates in one continuous flow.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <ShieldCheck className="mb-3 h-5 w-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">3-way match</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
              Compare PO, receipt, and invoice before payment. Mismatches raise exceptions.
            </p>
          </div>
        </div>
      </section>

      {/* Simple vs enterprise — compact */}
      <section className="border-t border-slate-900 py-14">
        <div className="mx-auto grid max-w-5xl gap-4 px-4 md:grid-cols-2 sm:px-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h3 className="text-base font-bold text-white">Simple teams</h3>
            <p className="mt-1 text-xs text-slate-400">No heavy bureaucracy</p>
            <ul className="mt-4 space-y-2 text-xs text-slate-300">
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                Direct request → order
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                Suppliers & invoices
              </li>
            </ul>
            <button
              onClick={() => loadPreset('individual')}
              className="mt-5 w-full rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-white hover:bg-slate-700"
            >
              Open solo demo
            </button>
          </div>
          <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/60 p-6">
            <h3 className="text-base font-bold text-white">Larger organisations</h3>
            <p className="mt-1 text-xs text-slate-400">Governance and audit trail</p>
            <ul className="mt-4 space-y-2 text-xs text-slate-300">
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                Multi-step approvals & RFQs
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                3-way match & exceptions
              </li>
            </ul>
            <button
              onClick={() => loadPreset('enterprise')}
              className="mt-5 w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-500"
            >
              Open enterprise demo
            </button>
          </div>
        </div>
      </section>

      {/* Short FAQ */}
      <section className="border-t border-slate-900 py-14">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="mb-6 text-center text-lg font-bold text-white">Questions</h2>
          <div className="space-y-2">
            {faqs.map((f, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-white"
                >
                  {f.q}
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition ${activeFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {activeFaq === i && (
                  <p className="border-t border-slate-800 px-4 py-3 text-xs leading-relaxed text-slate-400">
                    {f.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer — one quiet link for APK */}
      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
        <p className="font-medium text-slate-400">Procura — final year project demo</p>
        <button
          onClick={() => setIsAPKModalOpen(true)}
          className="mt-2 text-slate-500 underline-offset-2 hover:text-slate-300 hover:underline"
        >
          Mobile install / APK guide
        </button>
      </footer>
    </div>
  );
};
