"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getDemoLoginLink, loginUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(getDemoLoginLink().email);
  const [password, setPassword] = useState(getDemoLoginLink().password);
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const user = loginUser(email, password);
    if (!user) {
      setError("Invalid email or password. Try the demo account, or create a new customer account.");
      return;
    }

    router.push("/account");
  };

  return (
    <main className="site-content">
      <div className="page-intro">
        <span className="eyebrow">Welcome back</span>
        <h1>Sign in to Arozao</h1>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <label htmlFor="login-email">Email</label>
        <input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />

        <label htmlFor="login-password">Password</label>
        <input id="login-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />

        {error && <p className="coupon-error-msg">{error}</p>}

        <button className="button button-primary" type="submit">Sign in</button>

        <p style={{ marginTop: 18, color: "#54506B" }}>
          Demo account: <strong>demo@arozao.com</strong> / <strong>demo-password</strong>
        </p>

        <p style={{ marginTop: 8 }}>
          Need an account? <Link href="/register">Create one</Link>
        </p>
      </form>
    </main>
  );
}
