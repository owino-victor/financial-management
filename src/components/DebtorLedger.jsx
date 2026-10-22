import { useState } from "react";
import { UserPlus, Check } from "lucide-react";
import { formatKES, sortDebtors } from "../utils/helpers";

export default function DebtorLedger({
  debtors,
  isAdmin,
  onPayDebtor,
  onAddDebtor,
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [payInputs, setPayInputs] = useState({});

  const sortedList = sortDebtors(debtors);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (name && amount > 0) {
      onAddDebtor(name, parseFloat(amount));
      setName("");
      setAmount("");
      setShowAddModal(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold">Debtor Ledger</h3>
          <p className="text-xs text-slate-400">
            Ordered automatically from lowest to highest remaining balance
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-2 rounded-xl transition"
          >
            <UserPlus className="w-4 h-4" /> Add Debtor
          </button>
        )}
      </div>

      <div className="space-y-3">
        {sortedList.map((debtor) => {
          const remaining = Math.max(
            0,
            debtor.originalAmount - debtor.paidAmount,
          );
          const isCleared = remaining === 0;

          // Check if cleared within 24h for Green state vs Grey state
          const clearedRecently =
            isCleared &&
            debtor.clearedAt &&
            new Date() - new Date(debtor.clearedAt) < 86400000;
          const percentage = Math.min(
            100,
            Math.round((debtor.paidAmount / debtor.originalAmount) * 100),
          );

          return (
            <div
              key={debtor.id}
              className={`relative overflow-hidden border rounded-xl p-4 transition-all ${
                isCleared
                  ? clearedRecently
                    ? "bg-emerald-950/30 border-emerald-500/40 opacity-90"
                    : "bg-slate-900/50 border-slate-800 opacity-50 line-through"
                  : "bg-slate-800/80 border-slate-700"
              }`}
            >
              {/* Dynamic Fill Bar */}
              <div
                className={`absolute top-0 left-0 bottom-0 transition-all duration-500 ${
                  isCleared
                    ? clearedRecently
                      ? "bg-emerald-500/20"
                      : "bg-slate-700/20"
                    : "bg-amber-500/20"
                }`}
                style={{ width: `${percentage}%` }}
              />

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-base">{debtor.name}</h4>
                    {isCleared && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> Cleared
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Owed:{" "}
                    <span className="text-white font-medium">
                      {formatKES(remaining)}
                    </span>{" "}
                    of {formatKES(debtor.originalAmount)} ({percentage}% paid)
                  </p>
                </div>

                {/* Admin Payment Controls */}
                {isAdmin && !isCleared && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="KES"
                      value={payInputs[debtor.id] || ""}
                      onChange={(e) =>
                        setPayInputs({
                          ...payInputs,
                          [debtor.id]: e.target.value,
                        })
                      }
                      className="bg-slate-950 border border-slate-700 text-xs px-2.5 py-1.5 rounded-lg text-white w-24 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={() => {
                        const val = parseFloat(payInputs[debtor.id]);
                        if (val > 0) {
                          onPayDebtor(debtor.id, val);
                          setPayInputs({ ...payInputs, [debtor.id]: "" });
                        }
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                    >
                      Pay
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Debtor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md text-white shadow-2xl">
            <h3 className="text-lg font-bold mb-4">Add New Lender/Debtor</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Uncle John"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  Total Amount Owed (KES)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 15000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl"
                >
                  Save Debtor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
