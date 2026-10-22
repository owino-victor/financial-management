import { useState } from "react";

export default function DebtorLedger({
  debtors = [],
  isAdmin,
  onPayDebtor,
  onAddDebtor,
  onTopUpDebtor,
  onDeleteDebtor,
}) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [payAmounts, setPayAmounts] = useState({});
  const [topUpAmounts, setTopUpAmounts] = useState({});

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!name.trim() || isNaN(numAmount) || numAmount <= 0) return;
    onAddDebtor(name, numAmount);
    setName("");
    setAmount("");
  };

  const handlePayClick = (debtorId) => {
    const val = Number(payAmounts[debtorId]);
    if (!isNaN(val) && val > 0) {
      onPayDebtor(debtorId, val);
      setPayAmounts((prev) => ({ ...prev, [debtorId]: "" }));
    }
  };

  const handleTopUpClick = (debtorId) => {
    const val = Number(topUpAmounts[debtorId]);
    if (!isNaN(val) && val > 0) {
      onTopUpDebtor(debtorId, val);
      setTopUpAmounts((prev) => ({ ...prev, [debtorId]: "" }));
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <span>🤝</span> Debtor Ledger
        </h2>
        <span className="text-xs px-2.5 py-1 bg-slate-800 text-slate-400 rounded-full font-medium">
          {debtors.length} {debtors.length === 1 ? "Record" : "Records"}
        </span>
      </div>

      {isAdmin && (
        <form
          onSubmit={handleAddSubmit}
          className="flex flex-col sm:flex-row gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80"
        >
          <input
            type="text"
            placeholder="Debtor Name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
          />
          <input
            type="number"
            placeholder="Amount (KES)..."
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full sm:w-36 bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition shadow-md active:scale-95"
          >
            Add Debtor
          </button>
        </form>
      )}

      {debtors.length === 0 ? (
        <p className="text-slate-500 text-sm text-center py-6 italic">
          No active or previous debtors recorded.
        </p>
      ) : (
        <div className="space-y-3">
          {debtors.map((debtor) => {
            const remaining = debtor.originalAmount - debtor.paidAmount;
            const isCleared = remaining <= 0;

            return (
              <div
                key={debtor.id}
                className={`p-4 rounded-xl border transition ${
                  isCleared
                    ? "bg-slate-950/40 border-slate-800/50 opacity-75"
                    : "bg-slate-950/90 border-slate-800"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-100 text-base">
                        {debtor.name}
                      </h3>
                      {isCleared && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-md border border-emerald-500/30">
                          Cleared
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Paid:{" "}
                      <span className="text-slate-200 font-medium">
                        {debtor.paidAmount.toLocaleString()} KES
                      </span>{" "}
                      / Total:{" "}
                      <span className="text-slate-200 font-medium">
                        {debtor.originalAmount.toLocaleString()} KES
                      </span>
                    </p>
                  </div>

                  <div className="text-right sm:text-right">
                    <span className="text-xs text-slate-400 block">
                      Remaining
                    </span>
                    <span
                      className={`text-base font-bold ${
                        isCleared ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      {remaining.toLocaleString()} KES
                    </span>
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800/80">
                    {!isCleared && (
                      <div className="flex items-center gap-1.5 flex-1 min-w-[180px]">
                        <input
                          type="number"
                          placeholder="Pay amount..."
                          value={payAmounts[debtor.id] || ""}
                          onChange={(e) =>
                            setPayAmounts({
                              ...payAmounts,
                              [debtor.id]: e.target.value,
                            })
                          }
                          className="w-full bg-slate-900 border border-slate-700/70 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          onClick={() => handlePayClick(debtor.id)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition whitespace-nowrap"
                        >
                          Pay
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 flex-1 min-w-[180px]">
                      <input
                        type="number"
                        placeholder="Top up amount..."
                        value={topUpAmounts[debtor.id] || ""}
                        onChange={(e) =>
                          setTopUpAmounts({
                            ...topUpAmounts,
                            [debtor.id]: e.target.value,
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-700/70 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={() => handleTopUpClick(debtor.id)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition whitespace-nowrap"
                      >
                        Top Up
                      </button>
                    </div>

                    <button
                      onClick={() => onDeleteDebtor(debtor.id)}
                      className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium px-2.5 py-1.5 rounded-lg transition ml-auto"
                      title="Delete Debtor"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
