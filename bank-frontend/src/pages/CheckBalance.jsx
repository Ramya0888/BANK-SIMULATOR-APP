import React, { useState } from "react";

export default function CheckBalance() {
  const [account, setAccount] = useState("");
  const [pin, setPin] = useState("");
  const [balance, setBalance] = useState(null);

  const handleCheck = async (e) => {
    e.preventDefault();

    if (!account || !pin) {
      alert("Please enter account number and PIN");
      return;
    }

    try {
      console.log("Sending:", { account, pin }); // ✅ DEBUG

      const res = await fetch(
        "http://localhost:8081/bank-simulator/api/transactions/balance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            account: account.trim(),   // ✅ IMPORTANT
            pin: parseInt(pin),
          }),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Unable to fetch balance");
      }

      const result = await res.json();
      setBalance(result);
    } catch (err) {
      alert(err.message);
      setBalance(null);
    }
  };

  return (
    <div className="form-container">
      <h2>Check Balance</h2>

      <form onSubmit={handleCheck}>
        <input
          type="text"
          placeholder="Account Number"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          required
        />

        {/* ✅ PIN FIELD */}
        <input
          type="password"
          placeholder="Enter PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          required
        />

        <button type="submit">Check</button>
      </form>

      {balance !== null && (
        <div className="result">
          <h3>Current Balance: ₹{balance}</h3>
        </div>
      )}
    </div>
  );
}