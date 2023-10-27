import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

function Logout({ type }) {
  const [cookies, setCookie, removeCookie] = useCookies([
    "access_token",
    "refresh_token",
  ]);
  const navigate = useNavigate();
  function handeClick() {
    navigate(`/${type}/login`);

    removeCookie("refresh_token");
    removeCookie("access_token");

    if (type == "user") {
      fetch("http://localhost:8000/auth/logout", {
        headers: { "Content-type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => console.log(data));
    }
  }
  return (
    <nav className="bg-black opacity-80 flex w-full justify-between py-4 px-6 mb-4">
      <h1
        className="text-yellow-200 uppercase font-black text-3xl flex items-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        <p className="pr-1">LaundryTS</p> <p className="pb-1"> 🧺</p>
      </h1>
      <button
        className="bg-white text-black text-lg font-black uppercase border-slaste-500 px-3 hover:scale-110"
        onClick={handeClick}
      >
        Logout
      </button>
    </nav>
  );
}

export default Logout;
