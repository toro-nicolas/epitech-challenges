"use client";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-8 relative">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">EPITECH Challenges</h1>
      <p className="mb-6 text-lg text-gray-700 text-center max-w-xl">
        Bienvenue sur EPITECH Challenges!<br />
        Connectez-vous ou créez un compte pour commencer à relever des défis de programmation et améliorer vos compétences techniques.
      </p>
    </main>
  );
}
