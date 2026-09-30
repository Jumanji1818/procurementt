import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, X, Send, Bot, User as UserIcon, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  tableData?: Array<Record<string, string | number>>;
}

export const AIAssistantModal: React.FC = () => {
  const {
    isAiModalOpen,
    setIsAiModalOpen,
    requests,
    purchaseOrders,
    invoices,
    vendors,
    budgets,
    departments,
    currentUser,
    formatCurrency,
  } = useApp();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm_welcome',
      sender: 'assistant',
      text: `Hello ${currentUser.name}! I am Procura Intelligence, your automated procurement advisor. I have real-time visibility into your requests, purchase orders, 3-way matching exceptions, supplier performance, and departmental budgets. How can I assist you today?`,
      timestamp: 'Just now',
    },
  ]);
  const [loading, setLoading] = useState(false);

  if (!isAiModalOpen) return null;

  const quickPrompts = [
    'Show me all pending approvals',
    'Which invoices are blocked or have exceptions?',
    'Show me overdue purchase orders',
    'Which suppliers have quality or delivery flags?',
    'What is our budget breakdown by department?',
  ];

  const handleSend = (queryText?: string) => {
    const query = (queryText || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      let reply = '';
      const q = query.toLowerCase();

      if (q.includes('approval') || q.includes('pending')) {
        const pending = requests.filter((r) => r.status === 'pending_approval');
        if (pending.length > 0) {
          reply = `Found ${pending.length} request(s) awaiting approval:\n` +
            pending
              .map(
                (r) =>
                  `• **${r.requestNumber}** (${r.title}) — ${formatCurrency(r.estimatedBudget)} by ${r.requesterName} [${r.priority.toUpperCase()}]`
              )
              .join('\n') +
            `\n\nYou can review or authorize these directly in the Approvals Workspace.`;
        } else {
          reply = 'There are currently no procurement requests waiting in the approval queue.';
        }
      } else if (q.includes('blocked') || q.includes('exception') || q.includes('mismatch')) {
        const blockedInvoices = invoices.filter((i) => i.status === 'exception');
        reply =
          `Identified ${blockedInvoices.length} blocked invoice(s) due to Three-Way Match Discrepancies:\n\n` +
          blockedInvoices
            .map(
              (inv) =>
                `• **${inv.invoiceNumber}** from ${inv.vendorName} (${formatCurrency(inv.totalAmount)})\n  Reason: ${inv.threeWayMatch.discrepancyNote || 'Quantity / Price variance against GRN'}`
            )
            .join('\n\n') +
          `\n\nPayment has been locked to protect company capital until the credit note or vendor clarification is resolved.`;
      } else if (q.includes('overdue') || q.includes('late') || q.includes('delay')) {
        const overduePOs = purchaseOrders.filter(
          (p) => p.status === 'in_transit' && new Date(p.expectedDeliveryDate) < new Date()
        );
        if (overduePOs.length > 0) {
          reply =
            `Flagged ${overduePOs.length} overdue purchase order(s):\n\n` +
            overduePOs
              .map(
                (po) =>
                  `• **${po.poNumber}** — ${po.vendorName} (Due date was ${po.expectedDeliveryDate})\n  Items: ${po.items.map((i) => i.description).join(', ')}\n  Total: ${formatCurrency(po.totalAmount)}`
              )
              .join('\n\n') +
            `\n\nRecommendation: Send automated supplier reminder or apply SLA late delivery penalty clause.`;
        } else {
          reply = 'All active in-transit purchase orders are currently within their projected delivery windows.';
        }
      } else if (q.includes('supplier') || q.includes('vendor') || q.includes('risk')) {
        const risky = vendors.filter((v) => v.riskLevel === 'high' || v.riskLevel === 'medium');
        reply =
          `Supplier Risk Assessment Summary:\n\n` +
          risky
            .map(
              (v) =>
                `• **${v.companyName}** — Risk: **${v.riskLevel.toUpperCase()}**\n  On-time delivery: ${v.onTimeDeliveryRate}% | Quality: ${v.qualityScore}%\n  Issues: ${v.documents.some((d) => d.status === 'expired') ? 'Expired statutory tax document' : 'Late delivery frequency higher than benchmark'}`
            )
            .join('\n\n');
      } else if (q.includes('budget') || q.includes('department') || q.includes('spend')) {
        reply =
          `Current Departmental Budget Status:\n\n` +
          departments
            .map((d) => {
              const pct = Math.round((d.budgetSpent / d.budgetAllocated) * 100);
              return `• **${d.name} (${d.code})**\n  Allocated: ${formatCurrency(d.budgetAllocated)} | Spent: ${formatCurrency(d.budgetSpent)} (${pct}% utilized)`;
            })
            .join('\n\n');
      } else {
        reply = `I analyzed your active procurement records. We have ${requests.length} total procurement requests, ${purchaseOrders.length} purchase orders, ${vendors.length} enrolled suppliers, and ${invoices.length} active invoices. Let me know if you would like me to drill into a specific category, check compliance, or calculate cost variances.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ast_${Date.now()}`,
          sender: 'assistant',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl h-[620px] max-h-[90vh] rounded-xl bg-[#082117] border border-[#143e2f] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-[#143e2f] bg-[#061e15] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-[#092b1f] border border-[#d4af37]/40 text-[#d4af37] shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Procura Intelligence Advisor</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#0d3b2b] text-[#d4af37] flex items-center gap-1 border border-[#d4af37]/30">
                  <ShieldCheck className="w-3 h-3" /> RBAC Enforced
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Context-grounded operational procurement advisor</p>
            </div>
          </div>
          <button
            onClick={() => setIsAiModalOpen(false)}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-[#0c2d20] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick prompt pills */}
        <div className="px-4 py-2 bg-[#051710] border-b border-[#143e2f] flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-400 flex-shrink-0">Try asking:</span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="flex-shrink-0 px-2.5 py-1 rounded-md bg-[#082117] hover:bg-[#0c2d20] hover:text-[#d4af37] text-slate-300 border border-[#143e2f] transition cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => {
            const isMe = m.sender === 'user';
            return (
              <div key={m.id} className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    isMe
                      ? 'bg-[#d4af37] text-[#051b14]'
                      : 'bg-[#092b1f] text-[#d4af37] border border-[#143e2f]'
                  }`}
                >
                  {isMe ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isMe
                      ? 'bg-[#d4af37] text-[#051b14] font-semibold rounded-tr-none'
                      : 'bg-[#051710] text-slate-200 border border-[#143e2f] rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {m.text}
                  <div
                    className={`text-[9px] mt-1.5 ${
                      isMe ? 'text-[#051b14]/70 text-right' : 'text-slate-500'
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>
              </div>
            );
          })}
          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#092b1f] flex items-center justify-center text-[#d4af37] border border-[#143e2f]">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-[#051710] border border-[#143e2f] rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
                Analyzing procurement records and budget rules...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-[#061e15] border-t border-[#143e2f]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about spending, suppliers, approvals, or exceptions..."
              className="flex-1 bg-[#051710] border border-[#143e2f] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-[#d4af37] hover:bg-[#c49f2b] disabled:opacity-40 text-[#051b14] font-bold transition flex items-center justify-center cursor-pointer shadow"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
