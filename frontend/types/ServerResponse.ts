export type ServerActionResponse<T = undefined> = {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
  data?: T;
};
