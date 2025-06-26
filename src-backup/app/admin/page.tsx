'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Admin() {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.level !== 2) {
      router.replace("/");
    }
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">EPITECH Challenges</h1>
      <p className="mb-6 text-lg text-gray-700 text-center max-w-xl">
        Welcome to the Admin Page !
      </p>
    </main>
  );
}
