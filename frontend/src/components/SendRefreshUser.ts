export default function SendRefreshUser(refreshToken: any) {
  return fetch(`http://localhost:8000/api/v1/user/createtoken`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + refreshToken,
    },
  });
}
