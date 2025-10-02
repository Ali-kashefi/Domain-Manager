import http from "./httpServices";

export async function GETAllDOMAINS() {
  return http.get("Domain/").then((res) => res.data);
}
export async function POSTNEWDOMAIN(domainData) {

  return http.post("Domain/", domainData).then((res) => res.data
  );
}
export async function UPDATEDOMAINBYID({id}) {
  return http.patch(`Domain/${id}`).then((res) => res.data);
}
export async function DELETEDOMAINBYID(id) {
  return http.delete(`Domain/${id}`).then((res) => res.data);
}
