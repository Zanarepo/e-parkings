import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // make sure this file exists as we built earlier

export default function Wallet() {
  const [open, setOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);

  const balance = 7500;
  const transactions = [
    {
      id: 1,
      title: "Wallet funding via Card",
      date: "Oct 10, 2025 1:00 PM",
      amount: 5000,
      type: "credit",
      balance: 7500,
    },
    {
      id: 2,
      title: "Parking fee payment",
      date: "Oct 9, 2025 10:30 AM",
      amount: -1500,
      type: "debit",
      balance: 6000,
    },
  ];

  const fundingMethods = [
    { id: "card", label: "Fund with Card" },
    { id: "transfer", label: "Fund via Bank Transfer" },
    { id: "wallet", label: "Fund from Another Wallet" },
  ];

  const handleFundingClick = (method) => {
    setSelectedMethod(method);
    setOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-0 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-6">
        {/* Wallet Summary */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">My Wallet</h1>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
          <p className="text-gray-700 font-medium">Current Balance</p>
          <h2 className="text-3xl font-bold text-emerald-700 mt-2">
            ₦{balance.toLocaleString()}
          </h2>
        </div>

        {/* Funding Options */}
        <h2 className="text-lg font-semibold mb-3">Add Funds</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {fundingMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => handleFundingClick(method)}
              className="w-full py-4 px-6 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-all"
            >
              {method.label}
            </button>
          ))}
        </div>

        {/* Transaction History */}
        <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-800">{tx.title}</p>
                <p
                  className={`font-bold ${
                    tx.type === "credit" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {tx.amount > 0 ? "+" : ""}
                  ₦{tx.amount.toLocaleString()}
                </p>
              </div>
              <p className="text-gray-500 text-sm mt-1">{tx.date}</p>
              <p className="text-gray-400 text-xs mt-1">
                Balance: ₦{tx.balance.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Funding Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Fund Wallet via {selectedMethod?.label}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedMethod?.id === "card" && (
              <>
                <p className="text-gray-600">Enter card details below:</p>
                <input
                  type="number"
                  placeholder="Amount (₦)"
                  className="w-full border p-3 rounded-lg"
                />
                <button className="w-full bg-emerald-600 text-white py-3 rounded-lg">
                  Pay with Card
                </button>
              </>
            )}

            {selectedMethod?.id === "transfer" && (
              <>
                <p className="text-gray-600">
                  Send funds to the account below and it will reflect in your wallet.
                </p>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p>Bank: GTBank</p>
                  <p>Account Number: 0123456789</p>
                  <p>Account Name: JustParkIt Wallet</p>
                </div>
              </>
            )}

            {selectedMethod?.id === "wallet" && (
              <>
                <p className="text-gray-600">
                  Enter the wallet ID or email of the sender:
                </p>
                <input
                  type="text"
                  placeholder="Sender Wallet ID or Email"
                  className="w-full border p-3 rounded-lg"
                />
                <button className="w-full bg-emerald-600 text-white py-3 rounded-lg">
                  Receive from Wallet
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
