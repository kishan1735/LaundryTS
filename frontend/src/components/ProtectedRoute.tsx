import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useLocation, useNavigate } from "react-router-dom";

function ProtectedRoute({ type, children }) {
  const [cookies] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(
    function () {
      async function protectedRoute() {
        const requestBody = { token: cookies.access_token };
        const res = await fetch(`http://127.0.0.1:8000/api/v1/protect`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
        const data = await res.json();
        console.log(data);
        if (!cookies.access_token) {
          navigate(`/${type}/login`);
        } else if (
          location.pathname.startsWith("/owner") &&
          data.type == "user"
        ) {
          navigate(`/user/login`);
          navigate(0);
        } else if (
          location.pathname.startsWith("/user") &&
          data.type == "owner"
        ) {
          navigate(`/owner/login`);
          navigate(0);
        }
      }
      protectedRoute();
    },
    [cookies.access_token, navigate, type, location.pathname]
  );
  return children;
}

export default ProtectedRoute;
