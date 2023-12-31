import { useState } from "react";
import { useNavigate } from "react-router-dom";

function OSignup() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();
  const handleClick = (e: any) => {
    e.preventDefault();
    const requestBody = {
      name,
      email,
      ownerId,
      password,
      phoneNumber: +phoneNumber,
    };
    if (password === passwordConfirm) {
      fetch("http://127.0.0.1:8000/api/v1/owner/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })
        .then((res: any) => res.json())
        .then((data) => {
          if (data.status == "success") {
            setName("");
            setPassword("");
            setEmail("");
            setPhoneNumber("");
            setPasswordConfirm("");
            setOwnerId("");
            setError("");

            navigate("/owner/login");
          } else {
            setError(data.message);
          }
        })
        .catch((err) => setError(err.message));
    } else {
      setError("Password not same as password confirm");
    }
  };
  return (
    <div className="h-screen flex justify-center items-center" id="home">
      <div className="bg-black opacity-80 flex flex-col px-12 py-8 space-y-4 border-2 border-slate-400">
        <h1 className="text-white text-3xl uppercase font-black mb-2">
          OWNER SIGNUP
        </h1>
        <div className="flex items-center space-x-6">
          <h1 className="text-white text-xl uppercase pr-[152px]">Name</h1>
          <input
            type="text"
            value={name}
            className="px-8 py-1 text-center"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-6">
          <h1 className="text-white text-xl uppercase pr-[150px]">Email</h1>
          <input
            type="text"
            value={email}
            className="px-8 py-1 text-center"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-6">
          <h1 className="text-white text-xl uppercase pr-[108px]">Owner Id</h1>
          <input
            type="text"
            value={ownerId}
            className="px-8 py-1 text-center"
            onChange={(e) => setOwnerId(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-6">
          <h1 className="text-white text-xl uppercase pr-[47px]">
            Phone Number
          </h1>
          <input
            type="text"
            value={phoneNumber}
            className="px-8 py-1 text-center"
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-6">
          <h1 className="text-white text-xl uppercase pr-[102px]">Password</h1>
          <input
            type="password"
            value={password}
            className="px-8 py-1 text-center"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-6 pb-2">
          <h1 className="text-white text-xl uppercase">Password Confirm</h1>
          <input
            type="password"
            value={passwordConfirm}
            className="px-8 py-1 text-center"
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </div>

        <button
          className="bg-white mx-16 py-1 text-lg font-bold uppercase hover:scale-110 duration-400"
          onClick={handleClick}
        >
          SignUp
        </button>
        <div className="uppercase text-sm text-center text-white w-[500px]">
          {error}
        </div>
      </div>
    </div>
  );
}

export default OSignup;
