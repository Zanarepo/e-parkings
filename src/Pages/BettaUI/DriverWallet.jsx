import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Wallet, Plus, ArrowLeft, ArrowUpCircle, ArrowDownCircle, CreditCard, Building } from "lucide-react";
import { format } from "date-fns";

export default function DriverWallet() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showFundDialog, setShowFundDialog] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const currentUser = await base44.auth.me();
    setUser(currentUser);

    const allTransactions = await base44.entities.WalletTransaction.filter(
      { user_id: currentUser.id },
      "-created_date",
      50
    );
    setTransactions(allTransactions);
    setLoading(false);
  };

  const handleFundWallet = async (method) => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setProcessing(true);
    try {
      const fundAmount = parseFloat(amount);
      const newBalance = (user.wallet_balance || 0) + fundAmount;

      // Create transaction record
      await base44.entities.WalletTransaction.create({
        user_id: user.id,
        amount: fundAmount,
        type: "credit",
        method: method,
        description: `Wallet funding via ${method}`,
        reference: `REF-${Date.now()}`,
        status: "completed",
        balance_after: newBalance
      });

      // Update user wallet balance
      await base44.auth.updateMe({ wallet_balance: newBalance });

      // Send notification
      await base44.entities.Notification.create({
        user_id: user.id,
        title: "Wallet Funded",
        message: `Your wallet has been funded with ₦${fundAmount.toFixed(2)}`,
        type: "payment"
      });

      alert(`Wallet funded successfully! New balance: ₦${newBalance.toFixed(2)}`);
      setShowFundDialog(false);
      setAmount("");
      await loadData();
    } catch (err) {
      console.error("Funding error:", err);
      alert("Failed to fund wallet. Please try again.");
    }
    setProcessing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("DriverDashboard"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wallet</h1>

        <Card className="shadow-2xl mb-8 bg-gradient-to-r from-emerald-500 to-yellow-500 text-white">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="w-8 h-8" />
              <span className="text-white/80">Current Balance</span>
            </div>
            <p className="text-5xl font-bold mb-6">₦{(user?.wallet_balance || 0).toFixed(2)}</p>
            
            <Dialog open={showFundDialog} onOpenChange={setShowFundDialog}>
              <DialogTrigger asChild>
                <Button className="bg-white text-emerald-600 hover:bg-gray-100">
                  <Plus className="w-4 h-4 mr-2" />
                  Fund Wallet
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Fund Your Wallet</DialogTitle>
                  <DialogDescription>
                    Choose your preferred payment method
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="amount">Amount (₦)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="1000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="100"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => handleFundWallet("card")}
                      disabled={processing}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay with Card
                    </Button>
                    <Button
                      onClick={() => handleFundWallet("transfer")}
                      disabled={processing}
                      variant="outline"
                    >
                      <Building className="w-4 h-4 mr-2" />
                      Bank Transfer
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Wallet className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map(transaction => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      {transaction.type === "credit" ? (
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <ArrowUpCircle className="w-5 h-5 text-green-600" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <ArrowDownCircle className="w-5 h-5 text-red-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{transaction.description}</p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(transaction.created_date), "MMM d, yyyy h:mm a")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                        {transaction.type === "credit" ? "+" : "-"}₦{transaction.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Balance: ₦{transaction.balance_after?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}