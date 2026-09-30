import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Smartphone,
  Download,
  CheckCircle2,
  Copy,
  Check,
  Terminal,
  ShieldCheck,
  X,
  Github,
  Globe,
  FileCode,
  ExternalLink,
  PackageCheck
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

type ModalTab = 'code_github' | 'instant_apk' | 'capacitor';

export const APKGuideModal: React.FC = () => {
  const { isAPKModalOpen, setIsAPKModalOpen } = useApp();
  const { isInstallable, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<ModalTab>('code_github');
  const [copied, setCopied] = useState<string | null>(null);

  if (!isAPKModalOpen) return null;

  const currentAppUrl = window.location.origin;
  const downloadZipUrl = `${currentAppUrl}/procura-smart-procurement-system.zip`;
  const curlCommand = `curl -LO "${downloadZipUrl}" && unzip -o procura-smart-procurement-system.zip -d procura && cd procura && npm install && npm run dev`;

  const handleDownloadZip = async () => {
    try {
      const res = await fetch('/procura-smart-procurement-system.zip');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'procura-smart-procurement-system.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      window.location.href = '/procura-smart-procurement-system.zip';
    }
  };

  const copyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const gitCommands = `# 1. Download & extract the ZIP file to your folder
# 2. Open terminal in the project folder and run:
git init
git add .
git commit -m "Initial commit of Procura Smart Procurement Management System"
git branch -M main
# 3. Create a new repository on https://github.com/new and link it:
git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/procura-procurement.git
git push -u origin main`;

  const capacitorCommands = `# 1. Install Capacitor packages:
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Initialize Capacitor:
npx cap init "Procura" "com.procura.app" --web-dir dist

# 3. Build production web bundle:
npm run build

# 4. Add Android platform & build APK:
npx cap add android
npx cap open android
# In Android Studio: Click Build > Build Bundle(s) / APK(s) > Build APK(s)`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#082117] border border-[#143e2f] shadow-2xl p-6 sm:p-8 text-left my-8">
        <button
          onClick={() => setIsAPKModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#0c2f21] transition cursor-pointer"
        >
          <X className="w-5 h-5 text-[#d4af37]" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="p-3 rounded-2xl bg-[#092b1f] border border-[#d4af37]/40 text-[#d4af37] shadow-lg">
            <Smartphone className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Project Export & Mobile APK Center</h2>
              <span className="px-2 py-0.5 rounded-full bg-[#0d3b2b] text-[#d4af37] border border-[#d4af37]/30 text-[11px] font-bold">
                Capstone Ready
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Export the full source code for GitHub, install instantly on your phone, or generate a standalone Android APK.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 p-1 bg-[#051710] rounded-xl border border-[#143e2f] mb-6">
          <button
            onClick={() => setActiveTab('code_github')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'code_github'
                ? 'bg-[#d4af37] text-[#051b14] shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Github className="w-4 h-4" />
            <span>GitHub & Code (.ZIP)</span>
          </button>
          <button
            onClick={() => setActiveTab('instant_apk')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'instant_apk'
                ? 'bg-[#d4af37] text-[#051b14] shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Direct Phone / APK</span>
          </button>
          <button
            onClick={() => setActiveTab('capacitor')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'capacitor'
                ? 'bg-[#d4af37] text-[#051b14] shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Android Studio Build</span>
          </button>
        </div>

        {/* Tab 1: Code & GitHub */}
        {activeTab === 'code_github' && (
          <div className="space-y-4">
            {/* Download ZIP Card */}
            <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm font-bold text-white">Full Source Code Package (.ZIP)</h3>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Contains the complete codebase: React 19, TypeScript, Tailwind CSS, all 16 procurement views, responsive mobile drawer & bottom bar, and capstone README.md.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={downloadZipUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download="procura-smart-procurement-system.zip"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download .ZIP</span>
                  </a>
                  <a
                    href={downloadZipUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    title="Open ZIP directly in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Direct Download URL Callout (For browsers / iframes that restrict in-frame downloads) */}
              <div className="mt-3 pt-3 border-t border-indigo-900/40 space-y-2">
                <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200">
                  <p className="font-semibold text-white mb-1">💡 If clicking Download does not start inside AI Studio:</p>
                  <p className="text-[11px] text-slate-300">
                    The AI Studio preview runs inside a sandboxed iframe that blocks file downloads. To download immediately, either:
                  </p>
                  <ol className="list-decimal list-inside text-[11px] text-indigo-300 mt-1 space-y-0.5">
                    <li>Copy the link below and open it in a <strong>new browser tab</strong>.</li>
                    <li>Or click <strong>"Open App in New Tab"</strong> in the top-right corner of AI Studio, then click Download.</li>
                  </ol>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-indigo-300">
                    Direct Download URL:
                  </span>
                  <button
                    onClick={() => copyCode(downloadZipUrl, 'zip-url')}
                    className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 transition"
                  >
                    {copied === 'zip-url' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied === 'zip-url' ? 'Copied Link!' : 'Copy Link'}</span>
                  </button>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-indigo-200 truncate select-all">
                  {downloadZipUrl}
                </div>
              </div>
            </div>

            {/* Instant Terminal Download (1-liner curl) */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-semibold text-white">1-Click Terminal Command (Mac, Linux & Windows)</h3>
                </div>
                <button
                  onClick={() => copyCode(curlCommand, 'curl-cmd')}
                  className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition"
                >
                  {copied === 'curl-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === 'curl-cmd' ? 'Copied Command!' : 'Copy Command'}</span>
                </button>
              </div>
              <div className="bg-slate-900 rounded-lg p-3 font-mono text-[11px] text-emerald-300 border border-slate-800 overflow-x-auto whitespace-pre leading-relaxed">
                {curlCommand}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Paste this into your laptop's terminal to instantly download the ZIP, extract it, install dependencies, and launch the dev server.
              </p>
            </div>

            {/* GitHub Push Guide */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-slate-300" />
                  <h3 className="text-sm font-semibold text-white">Push to Your GitHub Account</h3>
                </div>
                <button
                  onClick={() => copyCode(gitCommands, 'git-copy')}
                  className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition"
                >
                  {copied === 'git-copy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === 'git-copy' ? 'Copied!' : 'Copy Commands'}</span>
                </button>
              </div>

              <div className="bg-slate-900 rounded-lg p-3 font-mono text-[11px] text-slate-300 border border-slate-800 overflow-x-auto whitespace-pre leading-relaxed">
                {gitCommands}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Once uploaded to GitHub, you can link the repository to your university project report, share with professors, or deploy to Vercel/Netlify in one click.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Direct Phone / Instant APK */}
        {activeTab === 'instant_apk' && (
          <div className="space-y-4">
            {/* Instant Mobile Installation (PWA) */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                    1
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Direct Phone Install (Runs like an APK)</h3>
                    <p className="text-xs text-emerald-300">
                      Installs directly into your Android app drawer with native icon, loading splash, offline cache, and full screen!
                    </p>
                  </div>
                </div>
                {isInstallable ? (
                  <button
                    onClick={install}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition flex-shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Install Now
                  </button>
                ) : (
                  <span className="text-xs text-emerald-400 font-medium">Ready in Browser</span>
                )}
              </div>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300 pt-2 border-t border-emerald-900/40">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span><strong>Android Phone (Chrome):</strong> Tap 3 dots (⋮) → "Install app"</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span><strong>Laptop / Desktop (Chrome/Edge):</strong> Click install icon in URL bar</span>
                </div>
              </div>
            </div>

            {/* 1-Minute APK via PWABuilder */}
            <div className="rounded-xl border border-sky-500/30 bg-sky-950/20 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Get a Standalone .APK File (Online in 60s)</h3>
                    <p className="text-xs text-sky-300">
                      Use Microsoft PWABuilder to package the live app URL into a downloadable signed Android .apk package.
                    </p>
                  </div>
                </div>
                <a
                  href={`https://www.pwabuilder.com?url=${encodeURIComponent(currentAppUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm transition flex-shrink-0"
                >
                  <span>Build APK</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="mt-3 text-[11px] text-slate-300 space-y-1 pt-2 border-t border-sky-900/40">
                <p>1. Click <strong>"Build APK"</strong> above (opens pwabuilder.com with your app URL).</p>
                <p>2. Click <strong>"Package for Android"</strong> → Click <strong>"Generate APK"</strong>.</p>
                <p>3. Download the compiled <strong>.apk</strong> file and install it directly on your phone!</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Capacitor & Android Studio Build */}
        {activeTab === 'capacitor' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-semibold text-white">Local Android Studio Compilation</h3>
                </div>
                <button
                  onClick={() => copyCode(capacitorCommands, 'cap-code')}
                  className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition"
                >
                  {copied === 'cap-code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === 'cap-code' ? 'Copied!' : 'Copy Commands'}</span>
                </button>
              </div>

              <div className="bg-slate-900 rounded-lg p-3 font-mono text-[11px] text-slate-300 border border-slate-800 overflow-x-auto whitespace-pre leading-relaxed">
                {capacitorCommands}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Outputs standard <strong>app-debug.apk</strong> or <strong>app-release.apk</strong> directly in the <code>android/app/build/outputs/apk/</code> directory.
              </p>
            </div>
          </div>
        )}

        {/* University Defense Checklist */}
        <div className="mt-5 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-1.5">
            <PackageCheck className="w-4 h-4" />
            <span>Capstone Verification & Defense Points</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-300">
            <span>✓ Responsive Mobile Bottom-Bar & Drawer</span>
            <span>✓ Multi-Currency (NGN, USD, EUR, etc.)</span>
            <span>✓ Automated Inventory ledger on Goods Receipt</span>
            <span>✓ Multi-Role Simulation (7 distinct roles)</span>
            <span>✓ 3-Way Matching discrepancy detection</span>
            <span>✓ Multi-Language translation matrix (6 languages)</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800">
          <a
            href="/procura-smart-procurement-system.zip"
            download="procura-smart-procurement-system.zip"
            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Quick Download Source (.zip)</span>
          </a>
          <button
            onClick={() => setIsAPKModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
