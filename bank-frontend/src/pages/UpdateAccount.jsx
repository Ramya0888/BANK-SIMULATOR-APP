import React, { useState } from "react";

export default function UpdateAccount() {
  const [accountNumber, setAccountNumber] = useState("");
  const [formData, setFormData] = useState(null);
  const [message, setMessage] = useState("");
  const [pin, setPin] = useState("");

  // ✅ FETCH ACCOUNT DETAILS
  const handleFetch = async () => {
    if (!accountNumber) {
      alert("Enter account number");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8081/bank-simulator/api/accounts/by-number/${accountNumber}`
      );

      if (!res.ok) throw new Error("Account not found");

      const data = await res.json();
      setFormData(data);
      setMessage("");
    } catch (err) {
      setMessage(err.message);
      setFormData(null);
    }
  };

  // ✅ HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ UPDATE ACCOUNT (SECURE WITH PIN)
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!pin) {
      alert("Please enter PIN");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8081/bank-simulator/api/accounts/secure-update/${accountNumber}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            pin: parseInt(pin),
          }),
        }
      );

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Update failed");
      }

      setMessage("✅ Account updated successfully!");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Update Account Details</h2>

      {/* FETCH SECTION */}
      <div>
        <input
          placeholder="Enter Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
        <button onClick={handleFetch}>Fetch Account</button>
      </div>

      {/* FORM */}
      {formData && (
        <form onSubmit={handleUpdate}>
          <input name="accountId" value={formData.accountId} disabled />
          <input name="customerId" value={formData.customerId} disabled />

          <select
            name="accountType"
            value={formData.accountType}
            onChange={handleChange}
          >
            <option value="SAVINGS">SAVINGS</option>
            <option value="CURRENT">CURRENT</option>
          </select>

          <input
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
          />

          <input
            name="branch"
            value={formData.branch}
            onChange={handleChange}
          />

          <input
            name="balance"
            type="number"
            value={formData.balance}
            onChange={handleChange}
          />

          <input
            name="status"
            value={formData.status}
            onChange={handleChange}
          />

          <input
            name="ifscCode"
            value={formData.ifscCode}
            onChange={handleChange}
          />

          <input
            name="nameOnAccount"
            value={formData.nameOnAccount}
            onChange={handleChange}
          />

          <input
            name="phoneLinked"
            value={formData.phoneLinked}
            onChange={handleChange}
          />

          <input
            name="savingAmount"
            type="number"
            value={formData.savingAmount}
            onChange={handleChange}
          />

          {/* 🔐 PIN FIELD */}
          <input
            type="password"
            placeholder="Enter PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
          />

          <button type="submit">Update Account</button>
        </form>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}