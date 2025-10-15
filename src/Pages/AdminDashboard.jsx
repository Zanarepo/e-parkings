import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
// import { base44 } from "@/api/base44Client"; // ❌ removed
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Building2,
  DollarSign,
  CheckCircle,
  XCircle,
  Gift,
  Percent,
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [parkingSpaces, setParkingSpaces] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [discountValue, setDiscountValue] = useState("");
  const [bonusValue, setBonusValue] = useState("");
  const [loading, setLoading] = useState(true);

  // Mock Data Loader
  useEffect(() => {
    setTimeout(() => {
      setUsers([
        {
          id: 1,
          full_name: "John Doe",
          email: "john@example.com",
          user_type: "driver",
          is_verified: true,
          discount_percentage: 10,
          bonus_percentage: 0,
        },
        {
          id: 2,
          full_name: "Jane Smith",
          email: "jane@operator.com",
          user_type: "operator",
          is_verified: false,
          discount_percentage: 0,
          bonus_percentage: 5,
        },
        {
          id: 3,
          full_name: "Alex Johnson",
          email: "alex@both.com",
          user_type: "both",
          is_verified: true,
          discount_percentage: 15,
          bonus_percentage: 10,
        },
      ]);

      setParkingSpaces([
        {
          id: 101,
          name: "Marina Parking",
          area: "Lagos Island",
          address: "12 Marina Rd, Lagos",
          status: "active",
          operator_name: "Jane Smith",
          price_per_hour: 500,
          available_spaces: 15,
          total_spaces: 20,
        },
        {
          id: 102,
          name: "Lekki Phase 1 Lot",
          area: "Lekki",
          address: "14 Admiralty Way",
          status: "inactive",
          operator_name: "Alex Johnson",
          price_per_hour: 800,
          available_spaces: 0,
          total_spaces: 25,
        },
      ]);

      setSessions([
        {
          id: 1,
          user_id: 1,
          status: "completed",
          total_amount: 1500,
          platform_commission: 200,
        },
        {
          id: 2,
          user_id: 2,
          status: "completed",
          total_amount: 2400,
          platform_commission: 300,
        },
        {
          id: 3,
          user_id: 3,
          status: "pending",
          total_amount: 1000,
          platform_commission: 150,
        },
      ]);

      setLoading(false);
    }, 500);
  }, []);

  // Simulated actions
  const handleVerifyUser = (userId, verify) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, is_verified: verify } : u
      )
    );
    alert(
      verify
        ? "User verified successfully!"
        : "User verification revoked."
    );
  };

  const handleSetDiscount = () => {
    if (!selectedUser || !discountValue) return;
    const discount = parseFloat(discountValue);
    if (discount < 0 || discount > 100) {
      alert("Discount must be between 0 and 100");
      return;
    }
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id
          ? { ...u, discount_percentage: discount }
          : u
      )
    );
    alert(`${discount}% discount applied to ${selectedUser.full_name}`);
    setDiscountValue("");
    setSelectedUser(null);
  };

  const handleSetBonus = () => {
    if (!selectedUser || !bonusValue) return;
    const bonus = parseFloat(bonusValue);
    if (bonus < 0 || bonus > 100) {
      alert("Bonus must be between 0 and 100");
      return;
    }
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id
          ? { ...u, bonus_percentage: bonus }
          : u
      )
    );
    alert(`${bonus}% bonus applied to ${selectedUser.full_name}`);
    setBonusValue("");
    setSelectedUser(null);
  };

  const totalRevenue = sessions
    .filter((s) => s.status === "completed")
    .reduce((sum, s) => sum + s.total_amount, 0);

  const platformEarnings = sessions
    .filter((s) => s.status === "completed")
    .reduce((sum, s) => sum + s.platform_commission, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* ===== Top Summary Cards ===== */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Parking Spaces</p>
                  <p className="text-3xl font-bold text-gray-900">{parkingSpaces.length}</p>
                </div>
                <Building2 className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">₦{totalRevenue}</p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Platform Earnings</p>
                  <p className="text-3xl font-bold text-gray-900">₦{platformEarnings}</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ===== Tabs Section ===== */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="discounts">Discounts & Bonuses</TabsTrigger>
            <TabsTrigger value="spaces">Parking Spaces</TabsTrigger>
          </TabsList>

          {/* === Users Tab === */}
          <TabsContent value="users">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>All Users</CardTitle>
              </CardHeader>
              <CardContent>
                {users.map((user) => (
                  <Card key={user.id} className="border mb-3">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{user.full_name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <Badge
                          className={
                            user.is_verified
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }
                        >
                          {user.is_verified ? "Verified" : "Unverified"}
                        </Badge>
                        <Badge variant="outline" className="ml-2">
                          {user.user_type}
                        </Badge>
                      </div>
                      <div>
                        {user.is_verified ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVerifyUser(user.id, false)}
                          >
                            <XCircle className="w-4 h-4 mr-1" /> Revoke
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleVerifyUser(user.id, true)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" /> Verify
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* === Discounts & Bonuses Tab === */}
          <TabsContent value="discounts">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader className="bg-blue-50">
                  <CardTitle className="flex items-center gap-2">
                    <Percent className="w-5 h-5 text-blue-600" />
                    Apply Driver Discount
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <Label>Select Driver</Label>
                  <select
                    className="w-full border rounded-lg p-2 mb-3"
                    onChange={(e) => {
                      const user = users.find(
                        (u) => u.id === parseInt(e.target.value)
                      );
                      setSelectedUser(user);
                      setDiscountValue(user?.discount_percentage?.toString() || "");
                    }}
                  >
                    <option value="">Choose...</option>
                    {users
                      .filter(
                        (u) => u.user_type === "driver" || u.user_type === "both"
                      )
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.full_name}
                        </option>
                      ))}
                  </select>

                  <Label>Discount Percentage (0-100)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                  />

                  <Button
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                    onClick={handleSetDiscount}
                  >
                    Apply Discount
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="bg-purple-50">
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-purple-600" />
                    Apply Operator Bonus
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <Label>Select Operator</Label>
                  <select
                    className="w-full border rounded-lg p-2 mb-3"
                    onChange={(e) => {
                      const user = users.find(
                        (u) => u.id === parseInt(e.target.value)
                      );
                      setSelectedUser(user);
                      setBonusValue(user?.bonus_percentage?.toString() || "");
                    }}
                  >
                    <option value="">Choose...</option>
                    {users
                      .filter(
                        (u) => u.user_type === "operator" || u.user_type === "both"
                      )
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.full_name}
                        </option>
                      ))}
                  </select>

                  <Label>Bonus Percentage (0-100)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={bonusValue}
                    onChange={(e) => setBonusValue(e.target.value)}
                  />

                  <Button
                    className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                    onClick={handleSetBonus}
                  >
                    Apply Bonus
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* === Parking Spaces Tab === */}
          <TabsContent value="spaces">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>All Parking Spaces</CardTitle>
              </CardHeader>
              <CardContent>
                {parkingSpaces.map((space) => (
                  <Card key={space.id} className="border mb-3">
                    <CardContent className="p-4 flex justify-between">
                      <div>
                        <h3 className="font-semibold">{space.name}</h3>
                        <p className="text-sm text-gray-600">
                          {space.area} — {space.address}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Operator: {space.operator_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={
                            space.status === "active"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-gray-100"
                          }
                        >
                          {space.status}
                        </Badge>
                        <p className="text-sm font-semibold mt-2">
                          ₦{space.price_per_hour}/hr
                        </p>
                        <p className="text-xs text-gray-500">
                          {space.available_spaces}/{space.total_spaces} available
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
