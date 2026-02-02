"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "checking" | "available" | "registered" | null>(null);
  const [loading, setLoading] = useState(false);

  const checkEmailInDatabase = async () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setEmailStatus("checking");
    try {
      const res = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();
      setEmailStatus(data.exists ? "registered" : "available");
    } catch {
      setEmailStatus(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!agree) {
      setError("Please agree to the Terms and Conditions");
      return;
    }

    if (emailStatus === "registered") {
      setError("This user is already registered. Please sign in instead.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.error || "Registration failed");
      }

      if (data.token) {
        typeof window !== "undefined" && localStorage.setItem("auth_token", data.token);
        if (data.user) localStorage.setItem("auth_user", JSON.stringify(data.user));
      }
      setSuccess(data.message || "Registration successful. Your data has been stored in the database.");
      setError("");
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-6 rounded-xs border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 rounded-xs border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
          {success}
        </div>
      )}
      <div className="mb-8">
        <label htmlFor="name" className="text-dark mb-3 block text-sm dark:text-white">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base outline-hidden transition-all duration-300 dark:border-transparent dark:bg-[#2C303B] dark:focus:shadow-none"
        />
      </div>
      <div className="mb-8">
        <label htmlFor="email" className="text-dark mb-3 block text-sm dark:text-white">
          Work Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setEmailStatus(null); }}
          onBlur={checkEmailInDatabase}
          placeholder="Enter your Email"
          className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base outline-hidden transition-all duration-300 dark:border-transparent dark:bg-[#2C303B] dark:focus:shadow-none"
        />
        {emailStatus === "available" && (
          <p className="text-primary mt-1 text-xs">Email is available. You can register.</p>
        )}
        {emailStatus === "registered" && (
          <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">This user is already registered. Please sign in.</p>
        )}
      </div>
      <div className="mb-8">
        <label htmlFor="password" className="text-dark mb-3 block text-sm dark:text-white">
          Your Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your Password"
          className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base outline-hidden transition-all duration-300 dark:border-transparent dark:bg-[#2C303B] dark:focus:shadow-none"
        />
      </div>
      <div className="mb-8 flex">
        <label htmlFor="checkboxLabel" className="text-body-color flex cursor-pointer text-sm font-medium select-none">
          <div className="relative">
            <input
              type="checkbox"
              id="checkboxLabel"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="sr-only"
            />
            <div className="box border-body-color/20 mt-1 mr-4 flex h-5 w-5 items-center justify-center rounded-sm border dark:border-white/10">
              <span className={agree ? "opacity-100" : "opacity-0"}>
                <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972Z"
                    fill="#3056D3"
                    stroke="#3056D3"
                    strokeWidth="0.4"
                  />
                </svg>
              </span>
            </div>
          </div>
          <span>
            By creating account you agree to the{" "}
            <a href="#0" className="text-primary hover:underline">Terms and Conditions</a> and our{" "}
            <a href="#0" className="text-primary hover:underline">Privacy Policy</a>
          </span>
        </label>
      </div>
      <div className="mb-6">
        <button
          type="submit"
          disabled={loading}
          className="shadow-submit dark:shadow-submit-dark bg-primary hover:bg-primary/90 flex w-full items-center justify-center rounded-xs px-9 py-4 text-base font-medium text-white duration-300 disabled:opacity-70"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </div>
      <p className="text-body-color text-center text-base font-medium">
        Already using VizRec?{" "}
        <Link href="/signin" className="text-primary hover:underline">Sign in</Link>
      </p>
    </form>
  );
}
