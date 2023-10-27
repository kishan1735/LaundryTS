export default function SendRefresh(refreshToken: any) {
  return fetch(`http://localhost:8000/api/v1/owner/createtoken`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + refreshToken,
    },
  });
}
