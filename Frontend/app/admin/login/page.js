"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import Link from "next/link";
import { toast } from "react-toastify";

export default function AdminLogin() {
  const router = useRouter();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });


  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const res = await fetch(
          "http://localhost:5000/api/auth/verify-token",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          // ✅ Token is valid → redirect
          router.push("/admin/dashboard");
        } else {
          // ❌ Invalid token → remove it
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Token verification failed");
      }
    };

    verifyToken();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      toast.error("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);

      toast.success("Login successful");

      router.push("/admin/dashboard");
    } catch (error) {
      toast.error("Server error. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 sm:p-12 rounded-2xl shadow-xl border border-zinc-100 flex flex-col gap-6 relative">
      <div className="text-center mb-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-brand-blue text-white font-bold text-xl mb-4 shadow-sm">
          NM
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Admin Portal Log In
        </h1>
        <p className="text-sm text-zinc-500 mt-2">
          Enter your credentials to access the dashboard.
        </p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        <FormInput
          label="Email"
          value={credentials.email}
          onChange={(e) =>
            setCredentials((prev) => ({ ...prev, email: e.target.value }))
          }
          placeholder="admin@gmail.com"
        />

        <FormInput
          label="Password"
          type="password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials((prev) => ({ ...prev, password: e.target.value }))
          }
          placeholder="••••••••"
        />

        <Button type="submit" className="h-12 text-base mt-2 shadow-sm">
          Login to Dashboard
        </Button>
      </form>

      <div className="mt-4 text-center">
        <Link
          href="/"
          className="text-sm font-medium text-brand-blue hover:underline"
        >
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
}
