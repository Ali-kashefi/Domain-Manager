import http from "./httpServices";

export async function GETAllDOMAINS() {
  return http.get("Domain/").then((res) => res.data);
}