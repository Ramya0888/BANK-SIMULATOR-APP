import React, { useState } from "react";

export default function TransactionHistory() {
  const [account, setAccount] = useState("");
  const [pin, setPin] = useState("");   // ✅ NEW

  const handleDownload = async () => {
    if (!account || !pin) {
      alert("Please enter account number and PIN");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8081/bank-simulator/api/transactions/${account}/download`,
        {
          method: "POST",   // ✅ CHANGED
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            account,
            pin: parseInt(pin),
          }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Download failed");
      }

      // ✅ Get filename from backend
      const contentDisposition = res.headers.get("Content-Disposition");
      let filename = `transactions_${account}.xlsx`;

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match) filename = match[1];
      }

      // ✅ Download file
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

      alert("Transactions downloaded successfully!");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Download Transaction History</h2>

      <input
        type="text"
        placeholder="Enter Account Number"
        value={account}
        onChange={(e) => setAccount(e.target.value)}
      />

      {/* ✅ NEW PIN INPUT */}
      <input
        type="password"
        placeholder="Enter PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />

      <button onClick={handleDownload}>Download Excel</button>
    </div>
  );
}