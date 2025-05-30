import { SignupRequest } from "@/types/AuthRequest";

export const isAlphanumeric = (str: string): boolean => {
  return /^[a-zA-Z0-9]+$/.test(str);
};

export const validateSignupInput = (data: SignupRequest): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.username) errors.username = "Username is required.";
  else if (data.username.length < 3) errors.username = "Username must be at least 3 characters long.";
  else if (!isAlphanumeric(data.username)) errors.username = "Username must be alphanumeric.";

  if (!data.password) errors.password = "Password is required.";
  else if (data.password.length < 6) errors.password = "Password must be at least 6 characters long.";

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
};
