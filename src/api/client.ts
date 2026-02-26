const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

async function readError(res: Response) {
  try {
    const data = await res.json();
    return data?.message || data?.error || "Request failed";
  } catch {
    return "Request failed";
  }
}

export async function api<T>(
  path: string,
  opts: RequestInit & { token?: string | null } = {},
): Promise<T> {
  const { token, headers, ...rest } = opts;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {}),
    },
  });

  if (!res.ok) throw new Error(await readError(res));
  return (await res.json()) as T;
}
