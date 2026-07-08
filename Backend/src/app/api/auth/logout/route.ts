import { jsonOk, handleOptions } from "@/lib/auth";

export { handleOptions as OPTIONS };

export async function POST() {
  const res = jsonOk({ message: "Logged out" });
  res.headers.set("Set-Cookie", "token=; Path=/; HttpOnly; Max-Age=0");
  return res;
}
