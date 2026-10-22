import { useState } from "react";
import { Lock, X } from "lucide-react";

export default function PinModal({ isOpen, onClose, onSuccess }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Default PIN: 1234 (You can change this PIN anytime)
    if (pin === "3614") {
      setError(false);
      setPin("");
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-xs text-white shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center mb-4">
          <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-full mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold">Admin Mode</h3>
          <p className="text-xs text-slate-400">
            Enter PIN to access Admin mode
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              placeholder="••••"
              className="w-full bg-slate-950 border border-slate-700 text-center tracking-[0.5em] text-xl py-2.5 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              autoFocus
            />
            {error && (
              <p className="text-xs text-rose-400 text-center mt-1">
                Incorrect PIN
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2.5 rounded-xl transition"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
}
