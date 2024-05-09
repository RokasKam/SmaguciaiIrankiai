export const createApiHeader = (token: string) => {
  return { Authorization: `Bearer ${token}` } as Record<string, string>;
};
