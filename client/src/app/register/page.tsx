"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, first_name, last_name, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Account created!");
        router.replace("/");
      } else {
        setMessage(data.message || "Registration failed.");
      }
    } catch {
      setMessage("Server error: unable to register.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Register</h1>
      <form
        className="flex flex-col gap-4 bg-white p-8 rounded shadow-md min-w-[300px]"
        onSubmit={handleSubmit}
      >
        <label className="flex flex-col">
          <span className="mb-1 text-gray-700">Email</span>
          <input
            type="email"
            className="border rounded px-3 py-2"
            required
            autoFocus
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </label>
        <label className="flex flex-col">
          <span className="mb-1 text-gray-700">First name</span>
          <input
            type="text"
            className="border rounded px-3 py-2"
            required
            value={first_name}
            onChange={e => setFirstName(e.target.value)}
          />
        </label>
        <label className="flex flex-col">
          <span className="mb-1 text-gray-700">Last name</span>
          <input
            type="text"
            className="border rounded px-3 py-2"
            required
            value={last_name}
            onChange={e => setLastName(e.target.value)}
          />
        </label>
        <label className="flex flex-col">
          <span className="mb-1 text-gray-700">Password</span>
          <input
            type="password"
            className="border rounded px-3 py-2"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
        >
          Register
        </button>
        {message && (
          <div className="text-center text-sm mt-2 text-red-600">{message}</div>
        )}
      </form>
    </main>
  );
}
