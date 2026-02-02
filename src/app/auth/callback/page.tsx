"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const userB64 = searchParams.get("user");
    if (token) {
      try {
        localStorage.setItem("auth_token", token);
        if (userB64) {
          try {
            const padded = userB64 + "=".repeat((4 - (userB64.length % 4)) % 4);
            const userJson = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
            const user = JSON.parse(userJson);
            localStorage.setItem("auth_user", JSON.stringify(user));
          } catch {
            // Ignore user decode errors
          }
        }
        setStatus("success");
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 500);
      } catch {
        setStatus("error");
        setMessage("Failed to save session.");
      }
    } else {
      setStatus("error");
      setMessage("No token received. Please try again.");
    }
  }, [searchParams, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-body-color animate-pulse text-lg">Signing you in...</div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-body-color text-lg">{message}</p>
        <button
          onClick={() => router.push("/signin")}
          className="bg-primary hover:bg-primary/90 rounded-xs px-6 py-3 text-white"
        >
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-body-color text-lg">Success! Redirecting...</div>
    </div>
  );
}
