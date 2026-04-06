import React, { useState } from "react";

export default function DeleteAccount() {
  const [accountNumber, setAccountNumber] = useState("");
  const [pin, setPin] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();
  
    if (!accountNumber || !pin) {
      alert("Enter account number and PIN");
      return;
    }
  
    try {
      const res = await fetch(
        "http://localhost:8081/bank-simulator/api/accounts/secure-delete",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            account: accountNumber,
            pin: parseInt(pin),
          }),
        }
      );
  
      if (res.ok) {
        alert("Account deleted successfully!");
        setAccountNumber("");
        setPin("");
      } else {
        const errorText = await res.text();
        alert("Failed: " + errorText);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };
  /*
  const handleDelete = async (e) => {
    e.preventDefault();

    if (!accountNumber) {
      alert("Please enter your account number.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this account?")) {
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8081/bank-simulator/api/accounts/by-number/${accountNumber}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        alert("Account deleted successfully!");
        setAccountNumber("");
      } else {
        const errorText = await res.text();
        alert("Failed to delete account: " + errorText);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };*/

  return (
    <div className="form-container">
      <h2>Delete Account</h2>
  
      <form onSubmit={handleDelete}>
        
        {/* ✅ ADD THIS (MISSING FIELD) */}
        <input
          type="text"
          placeholder="Enter Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
  
        {/* ✅ PIN FIELD */}
        <input
          type="password"
          placeholder="Enter PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
  
        <button
          type="submit"
          style={{ backgroundColor: "red", color: "white" }}
        >
          Delete Account
        </button>
      </form>
    </div>
  );
}
