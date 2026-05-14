"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [isLogin, setIsLogin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [birthName, setBirthName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthdaysList, setBirthdaysList] = useState<any[]>([]);

  const [generatedWishes, setGeneratedWishes] = useState<string[]>([]);
  const [selectedWish, setSelectedWish] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  const wishTemplates = (name: string) => [
    `Happy Birthday ${name} 🎉 Wishing you joy and peace.`,
    `May your year be full of success ${name} ✨`,
    `Stay blessed and happy ${name} 💛`,
    `Warmest wishes to you ${name} 🌿`,
    `A beautiful birthday to you ${name} 🎂`,
  ];

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) setIsLogin(true);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) setLoggedIn(true);
  }

  async function loadBirthdays() {
    const res = await fetch("/api/birthdays?userId=demo-user");
    const data = await res.json();
    setBirthdaysList(data);
  }

  function generateWishes(name: string) {
    if (!name) {
      setGeneratedWishes([]);
      return;
    }

    setGeneratedWishes(wishTemplates(name));
  }

  function startEdit(b: any) {
    setEditingId(b.id);
    setBirthName(b.name);
    setBirthDate(b.date);
    setSelectedWish(b.wish || null);
    generateWishes(b.name);
  }

  function resetForm() {
    setBirthName("");
    setBirthDate("");
    setSelectedWish(null);
    setGeneratedWishes([]);
    setEditingId(null);
  }

  async function addBirthday() {
    await fetch("/api/birthdays", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "demo-user",
        name: birthName,
        date: birthDate,
        wish: selectedWish,
      }),
    });

    resetForm();
    loadBirthdays();
  }

  async function updateBirthday() {
    await fetch("/api/birthdays", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingId,
        name: birthName,
        date: birthDate,
        wish: selectedWish,
      }),
    });

    resetForm();
    loadBirthdays();
  }

  async function deleteBirthday(id: string) {
    await fetch(`/api/birthdays?id=${id}`, {
      method: "DELETE",
    });

    loadBirthdays();
  }

  useEffect(() => {
    if (loggedIn) loadBirthdays();
  }, [loggedIn]);

  if (loggedIn) {
    return (
      <main className="min-h-screen bg-[#FFFDF7] text-gray-800 p-6">
        <div className="max-w-3xl mx-auto">

          <h1 className="text-4xl font-bold text-center text-[#D4AF37] mb-6">
            🎂 Wishes Dashboard
          </h1>

          <div className="bg-white shadow-lg rounded-3xl p-6 space-y-4 border border-[#556B2F]">

            <input
              className="w-full p-3 rounded-xl border border-[#556B2F] bg-white text-gray-800 placeholder:text-gray-500 focus:outline-none"
              placeholder="Friend's name"
              value={birthName}
              onChange={(e) => {
                setBirthName(e.target.value);
                generateWishes(e.target.value);
              }}
            />

            <input
              type="date"
              className="w-full p-3 rounded-xl border border-[#556B2F] bg-white text-gray-800"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />

            {generatedWishes.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-[#556B2F]">
                  ✨ Choose a wish:
                </p>

                {generatedWishes.map((wish, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedWish(wish)}
                    className={`p-3 rounded-xl cursor-pointer border transition text-gray-800 ${
                      selectedWish === wish
                        ? "bg-[#FFF4CC] border-[#D4AF37]"
                        : "bg-white hover:bg-[#F8F8F8] border-[#E5E5E5]"
                    }`}
                  >
                    {wish}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={editingId ? updateBirthday : addBirthday}
              className="w-full bg-[#D4AF37] hover:bg-[#b8932f] text-gray-900 font-semibold p-3 rounded-xl shadow-md transition"
            >
              {editingId ? "Update Birthday ✏️" : "Add Birthday 🎉"}
            </button>

          </div>

          <div className="mt-8 space-y-4">

            {birthdaysList.map((b) => (
              <div
                key={b.id}
                className={`p-5 rounded-3xl shadow-sm border ${
                  b.date === today
                    ? "border-[#D4AF37] bg-[#FFFBEA]"
                    : "bg-white border-[#556B2F]"
                }`}
              >
                <div className="flex justify-between">

                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      🎂 {b.name}
                    </h2>

                    <p className="text-sm text-gray-500">{b.date}</p>

                    {b.wish && (
                      <p className="mt-2 text-gray-700">
                        💌 {b.wish}
                      </p>
                    )}

                    {b.date === today && (
                      <p className="mt-2 text-[#D4AF37] font-semibold">
                        🎉 Today is their birthday!
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(b)}
                      className="px-3 py-1 rounded-xl border border-[#556B2F] text-gray-800 hover:bg-[#F5F5F5]"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteBirthday(b.id)}
                      className="px-3 py-1 rounded-xl border border-[#D4AF37] text-[#b8932f] hover:bg-[#FFF4CC]"
                    >
                      Delete
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FFFDF7]">
      <div className="bg-white p-6 rounded-3xl shadow-lg w-full max-w-md border border-[#556B2F]">

        <h1 className="text-3xl font-bold text-center text-[#D4AF37] mb-4">
          🎂 Wishes
        </h1>

        <div className="flex gap-2 justify-center mb-4">

          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 rounded-xl font-medium transition ${
              !isLogin
                ? "bg-[#D4AF37] text-gray-900"
                : "border border-[#556B2F] text-gray-700"
            }`}
          >
            Signup
          </button>

          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 rounded-xl font-medium transition ${
              isLogin
                ? "bg-[#556B2F] text-white"
                : "border border-[#556B2F] text-gray-700"
            }`}
          >
            Login
          </button>

        </div>

        <form
          onSubmit={isLogin ? handleLogin : handleSignup}
          className="space-y-3"
        >

          <input
            className="w-full p-3 border border-[#556B2F] rounded-xl bg-white text-gray-800 placeholder:text-gray-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-3 border border-[#556B2F] rounded-xl bg-white text-gray-800 placeholder:text-gray-500"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-[#D4AF37] text-gray-900 font-semibold p-3 rounded-xl hover:bg-[#b8932f] transition">
            {isLogin ? "Login" : "Create Account"}
          </button>

        </form>

      </div>
    </main>
  );
}