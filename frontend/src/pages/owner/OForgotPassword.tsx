import { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Logout from "../../components/Logout";

function OForgotPassword() {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [cookies] = useCookies(["access_token"]);
  const navigate = useNavigate();
  function handleEmail() {
    const requestBody = { email };
    fetch(`http://127.0.0.1:8000/api/v1/owner/forgotpassword`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "success") {
          setSuccess(true);
          setError("");
        } else {
          setError(data.message);
        }
      });
  }
  function handleReset() {
    const requestBody = { token, password };
    if (password == passwordConfirm) {
      fetch(`http://127.0.0.1:8000/api/v1/owner/resetpassword`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(requestBody),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status == "success") {
            setMessage("success");
            setSuccess(false);
            setError("");
          } else {
            setError(data.message);
          }
        });
    }
  }
  return (
    <div
      className={`h-screen
       flex flex-col items-center pb-4`}
      id="home"
    >
      {!cookies.access_token ? (
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
            <h1 className="text-yellow-200 text-3xl uppercase font-black mb-2">
              Forgot Password
            </h1>
            <div className="flex items-center space-x-6 ">
              <h1 className="text-white text-xl uppercase pr-[160px]">Email</h1>
              <input
                type="text"
                value={email}
                className="px-10 py-1"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {success ? (
              <>
                <div className="flex items-center space-x-6 ">
                  <h1 className="text-white text-xl uppercase pr-5">
                    Verification Code
                  </h1>
                  <input
                    type="text"
                    value={token}
                    className="px-10 py-1"
                    onChange={(e) => setToken(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-6">
                  <h1 className="text-white text-xl uppercase pr-[110px]">
                    Password
                  </h1>
                  <input
                    type="password"
                    value={password}
                    className="px-10 py-1"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-6 pb-4">
                  <h1 className="text-white text-xl uppercase pr-2">
                    Password Confirm
                  </h1>
                  <input
                    type="password"
                    value={passwordConfirm}
                    className="px-10 py-1"
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                  />
                </div>
              </>
            ) : (
              ""
            )}

            {success ? (
              <button
                className="bg-white mx-16 py-1 text-lg font-bold uppercase hover:scale-110 duration-400 px-8"
                onClick={handleReset}
              >
                Update Password
              </button>
            ) : message !== "success" ? (
              <button
                className="bg-white mx-16 py-1 text-lg font-bold uppercase hover:scale-110 duration-400"
                onClick={handleEmail}
              >
                Send Email
              </button>
            ) : (
              ""
            )}
            {message == "success" ? (
              <button
                className="bg-white mx-16 py-1 text-lg font-bold uppercase hover:scale-110 duration-400 px-8"
                onClick={() => navigate("/owner/login")}
              >
                Login
              </button>
            ) : (
              ""
            )}

            <div className="uppercase text-sm text-center text-white w-[300px]">
              {error}
            </div>
          </div>
        </>
      ) : (
        <>
          <Logout type="owner" />
          <div className="bg-black opacity-80 flex flex-col px-12 py-8 space-y-4 border-2 border-slate-400 mt-28">
            <h1 className="text-white text-3xl uppercase font-black">
              U Are Already Logged In
            </h1>
            <button
              className="bg-white mx-16 py-1 text-lg font-bold uppercase hover:scale-110 duration-400"
              onClick={() => navigate("/owner/main")}
            >
              Enter
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default OForgotPassword;
