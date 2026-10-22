import { useState } from "react";
import { MinusCircle, FileText } from "lucide-react";
import { formatKES } from "../utils/helpers";

export default function Deductions({ deductions, isAdmin, onAddDeduction }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount > 0 && description.trim()) {
      onAddDeduction(parseFloat(amount), description.trim());
      setAmount("");
      setDescription("");
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <MinusCircle className="w-5 h-5 text-rose-400" />
            Deductions
          </h3>
          <p className="text-xs text-slate-400">
            Expenses deducted directly from the Main Account Balance
          </p>
        </div>
      </div>

      {isAdmin && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4 bg-slate-850 p-3 rounded-xl border border-slate-800"
        >
          <input
            type="number"
            placeholder="Amount (KES)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
            required
          />
          <input
            type="text"
            placeholder="Short description (e.g. Prescriptions)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
            required
          />
          <button
            type="submit"
            className="bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition"
          >
            Record Deduction
          </button>
        </form>
      )}

      {/* Deductions History */}
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {deductions.length === 0 ? (
          <p className="text-xs text-slate-500 italic">
            No deductions recorded yet.
          </p>
        ) : (
          deductions.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-slate-800/60 border border-slate-700/60 p-2.5 rounded-xl text-xs"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>{item.description}</span>
              </div>
              <div className="font-bold text-rose-300">
                -{formatKES(item.amount)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
