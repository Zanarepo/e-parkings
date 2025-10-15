import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, CheckCircle, Users } from "lucide-react";

export default function InviteManager() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [parkingSpaces, setParkingSpaces] = useState([]);
  const [email, setEmail] = useState("");
  const [selectedSpaces, setSelectedSpaces] = useState([]);
  const [invites, setInvites] = useState([]);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const currentUser = await base44.auth.me();
    setUser(currentUser);

    const spaces = await base44.entities.ParkingSpace.filter({ operator_id: currentUser.id });
    setParkingSpaces(spaces);

    const allInvites = await base44.entities.ManagerInvite.filter({ operator_id: currentUser.id }, "-created_date");
    setInvites(allInvites);
  };

  const handleSpaceToggle = (spaceId) => {
    setSelectedSpaces(prev =>
      prev.includes(spaceId) ? prev.filter(id => id !== spaceId) : [...prev, spaceId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSpaces.length === 0) {
      setError("Please select at least one parking space");
      return;
    }

    setSending(true);
    setError(null);

    try {
      const inviteCode = `MGRINV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

      await base44.entities.ManagerInvite.create({
        operator_id: user.id,
        operator_name: user.business_name || user.full_name,
        email: email,
        parking_space_ids: selectedSpaces,
        invite_code: inviteCode,
        expires_at: expiresAt.toISOString(),
        status: "pending"
      });

      // Send email notification
      const spaceNames = parkingSpaces
        .filter(s => selectedSpaces.includes(s.id))
        .map(s => s.name)
        .join(", ");

      await base44.integrations.Core.SendEmail({
        from_name: "E-Parking Lagos",
        to: email,
        subject: "Invitation to Manage Parking Spaces",
        body: `You've been invited by ${user.business_name || user.full_name} to manage parking spaces on E-Parking.\n\nLocations: ${spaceNames}\n\nInvite Code: ${inviteCode}\n\nThis invitation expires in 7 days.\n\nPlease register at ${window.location.origin} and enter this code to accept.`
      });

      setSuccess(true);
      setEmail("");
      setSelectedSpaces([]);
      await loadData();

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Invite error:", err);
      setError("Failed to send invitation. Please try again.");
    }
    setSending(false);
  };

  if (!user) {
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
          onClick={() => navigate(createPageUrl("OperatorDashboard"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Invite Manager</h1>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-yellow-50">
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Send Invitation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-4 border-emerald-300 bg-emerald-50">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <AlertDescription className="text-emerald-800">
                    Invitation sent successfully!
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email">Manager Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="manager@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label className="mb-3 block">Select Parking Spaces to Manage *</Label>
                  {parkingSpaces.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      You don't have any parking spaces yet.{" "}
                      <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => navigate(createPageUrl("AddParkingSpace"))}
                      >
                        Add one first
                      </Button>
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-3">
                      {parkingSpaces.map(space => (
                        <div key={space.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={space.id}
                            checked={selectedSpaces.includes(space.id)}
                            onCheckedChange={() => handleSpaceToggle(space.id)}
                          />
                          <label
                            htmlFor={space.id}
                            className="text-sm font-medium leading-none cursor-pointer"
                          >
                            {space.name} - {space.area}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={sending || parkingSpaces.length === 0}
                  className="w-full bg-gradient-to-r from-emerald-500 to-yellow-500 hover:from-emerald-600 hover:to-yellow-600"
                >
                  {sending ? "Sending..." : "Send Invitation"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Sent Invitations ({invites.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {invites.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>No invitations sent yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {invites.map(invite => (
                    <Card key={invite.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">{invite.email}</p>
                            <p className="text-xs text-gray-500">
                              Code: {invite.invite_code}
                            </p>
                          </div>
                          <Badge
                            className={
                              invite.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : invite.status === "accepted"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }
                          >
                            {invite.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">
                          {invite.parking_space_ids.length} location(s)
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}