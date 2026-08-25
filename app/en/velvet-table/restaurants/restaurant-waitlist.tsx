"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { trackVelvetLead } from "../../../meta-pixel";

type FormState = "idle" | "submitting" | "success" | "error";

export default function RestaurantWaitlist() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const source = useMemo(() => {
    if (typeof window === "undefined") return "velvet-restaurants";
    const params = new URLSearchParams(window.location.search);
    return params.get("utm_campaign")?.slice(0, 80) || "velvet-restaurants";
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setState("submitting");
    setMessage("");
    const form = new FormData(formElement);

    try {
      const response = await fetch("/api/velvet-waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          audience: "restaurant",
          restaurantName: form.get("restaurantName"),
          city: form.get("city"),
          website: form.get("website"),
          consent: form.get("consent") === "on",
          source,
        }),
      });

      if (!response.ok) {
        throw new Error("Please check the fields and try again.");
      }

      trackVelvetLead("restaurant");
      setState("success");
      setMessage("You’re on the restaurant interest list. We’ll share confirmed Founding 100 and pilot updates by email.");
      formElement.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "We could not complete your request. Please try again.");
    }
  }

  return (
    <form className="velvet-waitlist-form restaurant-lead-form" onSubmit={submit}>
      <div className="restaurant-form-heading">
        <span>Restaurant early access</span>
        <h2>Join the New York pilot list.</h2>
        <p>Register your interest in the Founding 100 program. Your place is confirmed only after eligibility verification, onboarding and acceptance of the pilot agreement.</p>
      </div>
      <label className="velvet-field">
        <span>Work email</span>
        <input type="email" name="email" autoComplete="email" required maxLength={254} placeholder="you@restaurant.com" />
      </label>
      <div className="velvet-restaurant-fields">
        <label className="velvet-field">
          <span>Restaurant name <small>(optional)</small></span>
          <input type="text" name="restaurantName" autoComplete="organization" maxLength={120} />
        </label>
        <label className="velvet-field">
          <span>City <small>(optional)</small></span>
          <input type="text" name="city" autoComplete="address-level2" maxLength={100} placeholder="New York" />
        </label>
      </div>
      <label className="velvet-honeypot" aria-hidden="true">Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      <label className="velvet-consent">
        <input type="checkbox" name="consent" required />
        <span>I agree that Kreluna may use this email only for Velvet Table pilot and launch updates. I can unsubscribe at any time. <a href="/en/privacy.html">Privacy notice</a>.</span>
      </label>
      <button className="button velvet-page-button" type="submit" disabled={state === "submitting"}>
        {state === "submitting" ? "Joining…" : "Join restaurant early access"}
      </button>
      <p className={`velvet-form-status ${state}`} aria-live="polite">{message}</p>
    </form>
  );
}
