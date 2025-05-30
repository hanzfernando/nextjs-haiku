"use client";

import { ServerActionResponse } from "@/types/ServerResponse";
import { login } from "@/actions/userController";
import { User } from "@/types/User";
import { useState } from "react";
import { redirect } from "next/navigation";

const LoginForm = () => {
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

  const handleLogin = async (formData: FormData) => {
    const data = {
      username: formData.get("username")?.toString() ?? "",
      password: formData.get("password")?.toString() ?? "",
    };
    setErrors({});
    if (!data.username || !data.password) {
      setErrors({
        username: !data.username ? "Username is required." : "",
        password: !data.password ? "Password is required." : "",
      });
      return;
    }
    setIsSubmitting(true);

    const res: ServerActionResponse<User> = await login(data);
    console.log("Login response:", res);
    if (!res.success) {
      if (res.errors) {
        setErrors(res.errors);
      } else {
        alert(res.message || "An error occurred during login.");
      }
    } else {
      alert(res.message || "Login successful!");
      document.querySelector("form")?.reset();
      setErrors({});
      redirect("/");
    }
    setIsSubmitting(false);
   
  }

  return (
    <div className="py-12">
      <p className="text-center text-2xl text-gray-600 mb-5">Already have an account? <strong>Login in Now</strong></p>           
      <form action={handleLogin} className="mx-auto my-12 max-w-xs" noValidate>
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
        
        <button className="btn btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}

export default LoginForm