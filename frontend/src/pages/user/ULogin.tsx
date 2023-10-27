/*eslint-disable*/
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Logout from "../../components/Logout";
import axios, { AxiosResponse } from "axios";

function ULogin() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies([
    "access_token",
    "refresh_token",
  ]);
  useEffect(() => {
    axios
      .get("http://localhost:8000/auth/getUser", {
        withCredentials: true,
      })
      .then((res: AxiosResponse) => {
        if (res.data.status == "success") {
          setCookie("access_token", res.data.access_token);
          setCookie("refresh_token", res.data.refresh_token);
        } else {
          setError(res.data.message);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  function handleGoogle() {
    window.location.replace("http://localhost:8000/auth/google");
  }

  return (
    <div className="h-screen flex flex-col items-center" id="home">
      {!cookies.access_token && !cookies.refresh_token ? (
        <>
          <nav className="bg-black opacity-80 flex w-full justify-between py-4 px-6 mb-4">
            <h1
              className="text-yellow-200 uppercase font-black text-3xl flex items-center cursor-pointer"
              onClick={() => navigate("/")}
            >
              <p className="pr-1">LaundryTS</p> <p className="pb-1"> 🧺</p>
            </h1>
          </nav>
          <div className="bg-black opacity-80 flex flex-col px-12 py-8 space-y-4 border-2 border-slate-400 mt-12">
            <h1 className="text-white text-3xl uppercase font-black mb-2">
              User Login
            </h1>

            <button
              className="bg-white mx-16 py-1 text-lg font-bold uppercase hover:scale-110 duration-400 flex items-center space-x-4 px-4"
              onClick={handleGoogle}
            >
              <p>Login with Google </p>
              <img src="/public/images/google.png" className="h-8 w-8" />
            </button>

            <div className="uppercase text-sm text-center text-white w-[300px]">
              {error}
            </div>
          </div>
        </>
      ) : (
        <>
          <Logout type="user" />
          <div className="bg-black opacity-80 flex flex-col px-12 py-8 space-y-4 border-2 border-slate-400">
            <h1 className="text-white text-3xl uppercase font-black">
              U Are Already Logged In
            </h1>
            <button
              className="bg-white mx-16 py-1 text-lg font-bold uppercase hover:scale-110 duration-400"
              onClick={() => navigate("/user/main")}
            >
              Enter
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ULogin;
