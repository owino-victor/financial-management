import { useState } from "react";
import { UserPlus, PlusCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { formatKES } from "../utils/helpers";

export default function DebtorLedger({
  debtors,
  isAdmin,
  onPayDebtor,
  onAddDebtor,
  onTopUpDebtor,
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(null); // stores debtor object
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [payAmounts, setPayAmounts] = useState({});

  // Sort debtors live: uncleared first (lowest remaining balance first), then cleared
  const sortedDebtors = [...debtors].sort((a, b) => {
    const remA = a.originalAmount - a.paidAmount;
    const remB = b.originalAmount - b.paidAmount;
    const isClearedA = remA <= 0;
    const isClearedB = remB <= 0;

    if (isClearedA !== isClearedB) return isClearedA ? 1 : -1;
    return remA - remB;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (name.trim() && !isNaN(val) && val > 0) {
      onAddDebtor(name.trim(), val);
      setName("");
      setAmount("");
      setShowAddModal(false);
    }
  };

  const handleTopUpSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!isNaN(val) && val > 0 && showTopUpModal) {
      onTopUpDebtor(showTopUpModal.id, val);
      setAmount("");
      setShowTopUpModal(null);
    }
  };

  const handlePay = (id) => {
    const val = parseFloat(payAmounts[id]);
    if (!isNaN(val) && val > 0) {
      onPayDebtor(id, val);
      setPayAmounts((prev) => ({ ...prev, [id]: "" }));
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-400" /> Debtors Ledger
          </h3>
          <p className="text-xs text-slate-400">
            Sorted by lowest remaining balance first
          </p>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1 transition"
          >
            <UserPlus className="w-3.5 h-3.5" /> Add Debtor
          </button>
        )}
      </div>

      <div className="space-y-3">
        {sortedDebtors.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">
            No debt records found.
          </p>
        ) : (
          sortedDebtors.map((d) => {
            const remaining = Math.max(0, d.originalAmount - d.paidAmount);
            const isCleared = remaining === 0;

            return (
              <div
                key={d.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCleared
                    ? "bg-slate-950/40 border-slate-800/60 opacity-60"
                    : "bg-slate-950 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                      {d.name}
                      {isCleared && (
                        <span className="text-[10px] font-extrabold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Cleared
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-400">
                      Total Owed:{" "}
                      <span className="font-semibold text-slate-300">
                        {formatKES(d.originalAmount)}
                      </span>{" "}
                      | Paid:{" "}
                      <span className="font-semibold text-emerald-400">
                        {formatKES(d.paidAmount)}
                      </span>
                    </p>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1">
                    <span
                      className={`text-sm font-bold ${isCleared ? "text-slate-500 line-through" : "text-amber-400"}`}
                    >
                      {formatKES(remaining)} remaining
                    </span>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowTopUpModal(d);
                          setAmount("");
                        }}
                        className="text-[10px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 underline transition"
                      >
                        <PlusCircle className="w-3 h-3" /> Add Debt
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden my-2">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (d.paidAmount / d.originalAmount) * 100)}%`,
                    }}
                  />
                </div>

                {/* Pay Input for Admin */}
                {isAdmin && !isCleared && (
                  <div className="flex gap-2 mt-3 pt-2 border-t border-slate-800/60">
                    <input
                      type="number"
                      placeholder={`Max ${remaining}`}
                      value={payAmounts[d.id] || ""}
                      onChange={(e) =>
                        setPayAmounts({ ...payAmounts, [d.id]: e.target.value })
                      }
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => handlePay(d.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3.5 py-1.5 rounded-xl transition"
                    >
                      Pay
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal: New Debtor */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 w-full max-w-xs text-white shadow-2xl">
            <h3 className="text-base font-bold mb-3">Add New Debtor</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  Debtor Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. John"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  autoFocus
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  Amount Owed (KES)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-slate-800 text-slate-300 text-xs px-3.5 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 text-white font-semibold text-xs px-4 py-2 rounded-xl"
                >
                  Save Debtor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Top Up Existing Debt */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 w-full max-w-xs text-white shadow-2xl">
            <h3 className="text-base font-bold mb-1">
              Add Debt to {showTopUpModal.name}
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Increases total amount owed for this debtor.
            </p>
            <form onSubmit={handleTopUpSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  Additional Amount (KES)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 2000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  autoFocus
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTopUpModal(null)}
                  className="bg-slate-800 text-slate-300 text-xs px-3.5 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 text-white font-semibold text-xs px-4 py-2 rounded-xl"
                >
                  Add to Debt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
