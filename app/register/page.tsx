"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    const user = registerUser({ name, email, password, role: "customer" });
    if (!user) {
      setError("An account with that email already exists. Please sign in instead.");
      return;
    }

    router.push("/account");
  };

  return (
    <main className="site-content">
      <div className="page-intro">
        <span className="eyebrow">Create account</span>
        <h1>Join Arozao</h1>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <label htmlFor="register-name">Full name</label>
        <input id="register-name" type="text" value={name} onChange={(event) => setName(event.target.value)} required />

        <label htmlFor="register-email">Email</label>
        <input id="register-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />

        <label htmlFor="register-password">Password</label>
        <input id="register-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />

        {error && <p className="coupon-error-msg">{error}</p>}

        <button className="button button-primary" type="submit">Create account</button>

        <p style={{ marginTop: 18 }}>
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
