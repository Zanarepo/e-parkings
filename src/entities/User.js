// src/entities/User.js
export class User {
  constructor({
    id,
    full_name,
    email,
    phone,
    user_type = "driver", // can be: driver | operator | both | admin
    profile_image,
    wallet_balance = 0,
    operator_id = null,
    created_at,
    updated_at,
  }) {
    this.id = id;
    this.full_name = full_name;
    this.email = email;
    this.phone = phone;
    this.user_type = user_type;
    this.profile_image = profile_image;
    this.wallet_balance = wallet_balance;
    this.operator_id = operator_id;
    this.created_at = created_at ? new Date(created_at) : null;
    this.updated_at = updated_at ? new Date(updated_at) : null;
  }

  // ✅ Role helpers
  get isDriver() {
    return this.user_type === "driver" || this.user_type === "both";
  }

  get isOperator() {
    return this.user_type === "operator" || this.user_type === "both";
  }

  get isAdmin() {
    return this.user_type === "admin";
  }

  // ✅ Basic info
  get initials() {
    return this.full_name
      ? this.full_name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";
  }

  get displayName() {
    return this.full_name || this.email;
  }

  // ✅ Supabase-friendly static helpers (optional if you're using Supabase)
  static async me() {
    // Replace this mock logic with Supabase auth session retrieval
    // Example:
    // const { data } = await supabase.auth.getUser();
    // return data ? new User(data.user) : null;
    const mockUser = {
      id: "user_001",
      full_name: "John Doe",
      email: "john@example.com",
      phone: "08012345678",
      user_type: "driver",
      wallet_balance: 2500,
    };
    return new User(mockUser);
  }

  static async logout() {
    // Replace with your Supabase logout logic
    // Example: await supabase.auth.signOut();
    console.log("User logged out");
  }

  // ✅ Convert from Supabase object
  static fromObject(obj) {
    return new User(obj);
  }
}
