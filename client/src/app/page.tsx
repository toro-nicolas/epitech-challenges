"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLogged(!!user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLogged(false);
    window.location.reload();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 relative">
      {isLogged && (
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      )}
      <h1 className="text-4xl font-bold mb-4 text-blue-700">EPITECH Challenges</h1>
      <p className="mb-6 text-lg text-gray-700 text-center max-w-xl">
        Welcome to the EPITECH Challenges!<br />
        Log in or create an account to get started.
      </p>
      {!isLogged && (
        <div className="flex gap-4">
          <a
            href="/login"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Log in
          </a>
          <a
            href="/register"
            className="px-6 py-2 bg-gray-200 text-blue-700 rounded hover:bg-gray-300 transition"
          >
            Create account
          </a>
        </div>
      )}
    </main>
  );
}
