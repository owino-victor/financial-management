import { useState, useEffect } from "react";
import Header from "./components/Header";
import TodayBanner from "./components/TodayBanner";
import RHPool from "./components/RHPool";
import DebtorLedger from "./components/DebtorLedger";
import Deductions from "./components/Deductions";
import PinModal from "./components/PinModal";
import Reports from "./components/Reports";
import WeeklyTrackerBar from "./components/WeeklyTrackerBar";

const STORAGE_KEY = "finance_tracker_data_v1";

const initialData = {
  mainBalance: 0,
  rhBalance: 0,
  rhData: { rentPaid: false, healthPaid: false },
  todayData: { dayName: "Today", paid: 0 },
  weekDaysData: [
    { dayName: "Mon", paid: 0 },
    { dayName: "Tue", paid: 0 },
    { dayName: "Wed", paid: 0 },
    { dayName: "Thu", paid: 0 },
    { dayName: "Fri", paid: 0 },
    { dayName: "Sat", paid: 0 },
    { dayName: "Sun", paid: 0 },
  ],
  deposits: [], // Array of { id, amount, date }
  deductions: [], // Array of { id, amount, description, date }
  debtors: [
    { id: "1", name: "Sample Debtor", originalAmount: 5000, paidAmount: 0 },
  ],
};

export default function App() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialData;
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Calculate Sat - Fri Weekly Contribution Total
  const calculateSatFriTotal = () => {
    const now = new Date();
    const day = now.getDay(); // 0 is Sun, 6 is Sat
    const diffToSat = day === 6 ? 0 : day + 1;

    const lastSat = new Date(now);
    lastSat.setDate(now.getDate() - diffToSat);
    lastSat.setHours(0, 0, 0, 0);

    return data.deposits
      .filter((dep) => new Date(dep.date) >= lastSat)
      .reduce((acc, curr) => acc + curr.amount, 0);
  };

  // Handlers
  const handleAddTodayPayment = (amount) => {
    const newDeposit = {
      id: Date.now().toString(),
      amount,
      date: new Date().toISOString(),
    };

    // Update current day in weekDaysData based on day index (Mon=0 to Sun=6)
    const jsDay = new Date().getDay();
    const dayIndex = jsDay === 0 ? 6 : jsDay - 1;

    const updatedWeekDays = [
      ...(data.weekDaysData || initialData.weekDaysData),
    ];
    updatedWeekDays[dayIndex] = {
      ...updatedWeekDays[dayIndex],
      paid: updatedWeekDays[dayIndex].paid + amount,
    };

    setData((prev) => ({
      ...prev,
      mainBalance: prev.mainBalance + amount,
      todayData: { ...prev.todayData, paid: prev.todayData.paid + amount },
      weekDaysData: updatedWeekDays,
      deposits: [...prev.deposits, newDeposit],
    }));
  };

  // Handler for clicking & editing any specific day in the Weekly Commitment Strip
  const handleUpdateDayAmount = (dayIdx, newAmount) => {
    const updatedWeekDays = [
      ...(data.weekDaysData || initialData.weekDaysData),
    ];
    const oldAmount = updatedWeekDays[dayIdx]
      ? updatedWeekDays[dayIdx].paid
      : 0;
    const diff = newAmount - oldAmount;

    updatedWeekDays[dayIdx] = {
      ...updatedWeekDays[dayIdx],
      paid: newAmount,
    };

    // Log deposit if amount increased
    const newDeposit =
      diff > 0
        ? {
            id: Date.now().toString(),
            amount: diff,
            date: new Date().toISOString(),
          }
        : null;

    setData((prev) => {
      const newMain = Math.max(0, prev.mainBalance + diff);
      return {
        ...prev,
        mainBalance: newMain,
        // If main balance drops below RH pool, cap RH pool to match
        rhBalance: Math.min(newMain, prev.rhBalance),
        weekDaysData: updatedWeekDays,
        deposits: newDeposit ? [...prev.deposits, newDeposit] : prev.deposits,
      };
    });
  };

  const handleAllocateRH = (amount) => {
    if (amount <= 0) return;
    if (data.mainBalance < amount) {
      alert(
        `Cannot allocate ${amount.toLocaleString()} KES. Available Main Balance is ${data.mainBalance.toLocaleString()} KES.`,
      );
      return;
    }
    setData((prev) => ({
      ...prev,
      rhBalance: prev.rhBalance + amount,
    }));
  };

  const handlePayRent = () => {
    const RENT = 8000;
    if (data.mainBalance < RENT) {
      alert(
        `Insufficient funds in Main Balance (${data.mainBalance.toLocaleString()} KES) to pay Rent (${RENT.toLocaleString()} KES).`,
      );
      return;
    }
    setData((prev) => {
      const newMain = prev.mainBalance - RENT;
      return {
        ...prev,
        mainBalance: newMain,
        rhBalance: Math.max(0, Math.min(newMain, prev.rhBalance - RENT)),
        rhData: { ...prev.rhData, rentPaid: true },
      };
    });
  };

  const handlePayHealth = () => {
    const HEALTH = 1050;
    if (data.mainBalance < HEALTH) {
      alert(
        `Insufficient funds in Main Balance (${data.mainBalance.toLocaleString()} KES) to pay Health (${HEALTH.toLocaleString()} KES).`,
      );
      return;
    }
    setData((prev) => {
      const newMain = prev.mainBalance - HEALTH;
      return {
        ...prev,
        mainBalance: newMain,
        rhBalance: Math.max(0, Math.min(newMain, prev.rhBalance - HEALTH)),
        rhData: { ...prev.rhData, healthPaid: true },
      };
    });
  };

  const handlePayDebtor = (debtorId, amount) => {
    if (amount <= 0) return;

    // Find the debtor being paid
    const targetDebtor = data.debtors.find((d) => d.id === debtorId);
    if (!targetDebtor) return;

    const remainingDebt = targetDebtor.originalAmount - targetDebtor.paidAmount;

    // 1. Prevent paying more than remaining debt balance
    if (amount > remainingDebt) {
      alert(
        `Cannot pay ${amount.toLocaleString()} KES. The remaining debt balance for ${targetDebtor.name} is only ${remainingDebt.toLocaleString()} KES.`,
      );
      return;
    }

    // 2. Prevent paying more than current Main Balance
    if (data.mainBalance < amount) {
      alert(
        `Insufficient funds in Main Balance (${data.mainBalance.toLocaleString()} KES) to pay ${amount.toLocaleString()} KES.`,
      );
      return;
    }

    setData((prev) => {
      const newMain = prev.mainBalance - amount;
      return {
        ...prev,
        mainBalance: newMain,
        // Scale down RH pool if deduction eats into allocated RH subset
        rhBalance: Math.max(0, Math.min(newMain, prev.rhBalance - amount)),
        debtors: prev.debtors.map((d) => {
          if (d.id === debtorId) {
            const newPaid = d.paidAmount + amount;
            const isCleared = newPaid >= d.originalAmount;
            return {
              ...d,
              paidAmount: newPaid,
              clearedAt:
                isCleared && !d.clearedAt
                  ? new Date().toISOString()
                  : d.clearedAt,
            };
          }
          return d;
        }),
      };
    });
  };

  const handleAddDebtor = (name, originalAmount) => {
    const newDebtor = {
      id: Date.now().toString(),
      name,
      originalAmount,
      paidAmount: 0,
    };
    setData((prev) => ({
      ...prev,
      debtors: [...prev.debtors, newDebtor],
    }));
  };

  const handleAddDeduction = (amount, description) => {
    if (amount <= 0) return;
    if (data.mainBalance < amount) {
      alert(
        `Insufficient funds in Main Balance (${data.mainBalance.toLocaleString()} KES) for this deduction (${amount.toLocaleString()} KES).`,
      );
      return;
    }
    const newDeduction = {
      id: Date.now().toString(),
      amount,
      description,
      date: new Date().toISOString(),
    };
    setData((prev) => {
      const newMain = prev.mainBalance - amount;
      return {
        ...prev,
        mainBalance: newMain,
        // Scale down RH pool if deduction eats into allocated RH subset
        rhBalance: Math.max(0, Math.min(newMain, prev.rhBalance - amount)),
        deductions: [newDeduction, ...prev.deductions],
      };
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-12">
      <Header
        mainBalance={data.mainBalance}
        weeklySatFriDeposit={calculateSatFriTotal()}
        isAdmin={isAdmin}
        onOpenPinModal={() => setShowPinModal(true)}
        onSwitchToMike={() => setIsAdmin(false)}
      />

      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        <TodayBanner
          todayData={data.todayData}
          target={1000}
          isAdmin={isAdmin}
          onAddPayment={handleAddTodayPayment}
        />

        <RHPool
          rhBalance={data.rhBalance}
          rhData={data.rhData}
          isAdmin={isAdmin}
          onAllocateRH={handleAllocateRH}
          onPayRent={handlePayRent}
          onPayHealth={handlePayHealth}
        />

        {/* Weekly Status Bar with Clickable Past-Day Editing */}
        <WeeklyTrackerBar
          weekDaysData={data.weekDaysData || []}
          target={1000}
          isAdmin={isAdmin}
          onUpdateDayAmount={handleUpdateDayAmount}
        />

        <DebtorLedger
          debtors={data.debtors}
          isAdmin={isAdmin}
          onPayDebtor={handlePayDebtor}
          onAddDebtor={handleAddDebtor}
        />

        <Deductions
          deductions={data.deductions}
          isAdmin={isAdmin}
          onAddDeduction={handleAddDeduction}
        />

        <Reports data={data} weeklySatFriTotal={calculateSatFriTotal()} />
      </main>

      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={() => {
          setIsAdmin(true);
          setShowPinModal(false);
        }}
      />
    </div>
  );
}
