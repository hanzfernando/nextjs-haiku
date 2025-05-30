"use client";

import { signup } from "@/actions/userController";
import { SignupRequest } from "@/types/AuthRequest";
import { ServerActionResponse } from "@/types/ServerResponse";
import { useState } from "react";
import { User } from "@/types/User";

const SignupForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleInputChange(field: string) {
    // Remove error for this field on input
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }

  async function handleSignup(formData: FormData) {
    const data: SignupRequest = {
      username: formData.get("username")?.toString() ?? "",
      password: formData.get("password")?.toString() ?? "",
      confirmPassword: formData.get("confirmPassword")?.toString() ?? "",
    };

    setErrors({});

    if (!data.username || !data.password || data.password !== data.confirmPassword) {
      setErrors({
        username: !data.username ? "Username is required." : "",
        password: !data.password ? "Password is required." : "",
        confirmPassword: data.password !== data.confirmPassword ? "Passwords do not match." : "",
      });
      return;
    }

    setIsSubmitting(true);

    const res: ServerActionResponse<User> = await signup(data);
    console.log("Signup response:", res);

    if (!res.success) {
      if (res.errors) {
        setErrors(res.errors);
      } else {
        alert(res.message || "An error occurred during signup.");
      }
    } else {
      alert(res.message || "Signup successful!");
      document.querySelector("form")?.reset();
      setErrors({});
    }
    setIsSubmitting(false);
  }

  return (
    <div className="py-12">
      <p className="text-center text-2xl text-gray-600 mb-5">Don&rsquo;t have an account? <strong>Create an Account</strong></p>           
      <form action={handleSignup} className="mx-auto max-w-xs" noValidate>
        <div className="mb-3">
          <input
            name="username"
            autoComplete="off"
            type="text"
            placeholder="Username"
            className="input input-bordered w-full max-w-xs"
            disabled={isSubmitting}
            aria-invalid={!!errors.username}
            aria-describedby="username-error"
            onChange={() => handleInputChange("username")}
          />
          {errors.username && (
            <p id="username-error" className="text-sm text-red-600 mt-1">
              {errors.username}
            </p>
          )}
        </div>
        <div className="mb-3">
          <input
            name="password"
            autoComplete="off"
            type="password"
            placeholder="Password"
            className="input input-bordered w-full max-w-xs"
            disabled={isSubmitting}
            aria-invalid={!!errors.password}
            aria-describedby="password-error"
            onChange={() => handleInputChange("password")}
          />
          {errors.password && (
            <p id="password-error" className="text-sm text-red-600 mt-1">
              {errors.password}
            </p>
          )}
        </div>
        <div className="mb-3">
          <input
            name="confirmPassword"
            autoComplete="off"
            type="password"
            placeholder="Confirm Password"
            className="input input-bordered w-full max-w-xs"
            disabled={isSubmitting}
            aria-invalid={!!errors.confirmPassword}
            aria-describedby="confirmPassword-error"
            onChange={() => handleInputChange("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p id="confirmPassword-error" className="text-sm text-red-600 mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>
        <button className="btn btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
