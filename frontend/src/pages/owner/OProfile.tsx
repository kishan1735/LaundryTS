import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Logout from "../../components/Logout";

function OProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();
  useEffect(
    function () {
      async function getProfile() {
        const res = await fetch("http://127.0.0.1:8000/api/v1/owner/profile", {
          headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + cookies.access_token,
          },
        });
        const data = await res.json();
        if (data.status == "success") {
          setName(data.owner.name);
          setEmail(data.owner.email);
          setPhoneNumber(data.owner.phoneNumber);
        } else {
          setError(data.message);
        }
      }
      getProfile();
    },
    [cookies.access_token]
  );
  function handleDelete() {
    const deleteCheck: any = prompt("Type 'YES' if you want to DELETE");
    if (deleteCheck == "YES") {
      fetch("http://127.0.0.1:8000/api/v1/owner/profile", {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + cookies.access_token,
        },
      });
      removeCookie("access_token", {});
      navigate("../../owner/login");
    }
  }
  function handleUpdate() {
    setDisabled(false);
    setUpdating(true);
    const requestBody = { name, phoneNumber };

    fetch("http://127.0.0.1:8000/api/v1/owner/profile", {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + cookies.access_token,
      },
      body: JSON.stringify(requestBody),
    })
      .then((res: any) => res.json())
      .then((data) => {
        if (data.status == "success") {
          setError("");
        } else {
          setError(data.message);
        }
      });
  }
  return (
    <div className="h-screen flex flex-col items-center mt-0" id="home">
      <Logout type="owner" />
      <div className="bg-black opacity-80 flex flex-col px-12 py-8 space-y-4 border-2 border-slate-400">
        <h1 className="text-white text-3xl uppercase mb-2">
          {name ? name : "Owner Profile"}
        </h1>
        <div className="flex items-center space-x-6">
          <h1 className="text-xl text-yellow-200 uppercase font-black pr-[152px]">
            Name
          </h1>
          <input
            type="text"
            value={name}
            className="px-8 py-1 text-center font-bold text-lg bg-white"
            onChange={(e) => setName(e.target.value)}
            disabled={disabled}
          />
        </div>

        <div className="flex items-center space-x-6 pb-2">
          <h1 className="text-xl text-yellow-200 uppercase font-black pr-[50px]">
            Phone Number
          </h1>
          <input
            type="text"
            value={phoneNumber}
            className="px-8 py-1 text-center font-bold text-lg bg-white"
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={disabled}
          />
        </div>
        <div className="flex items-center justify-center space-x-6">
          <h1 className="text-xl text-yellow-200 uppercase font-black">
            Email :
          </h1>
          <h1 className="text-xl text-white lowercase font-black ">{email}</h1>
        </div>
        <button
          className="bg-white mx-16 py-1 text-lg font-bold uppercase hover:scale-110 duration-400"
          onClick={handleUpdate}
        >
          {updating ? "Click to Update" : "Update Owner"}
        </button>
        <button
          className="bg-white mx-16 py-1 text-lg font-bold uppercase hover:scale-110 duration-400"
          onClick={handleDelete}
        >
          Delete Owner
        </button>
        <div className="uppercase text-sm text-center text-white w-[500px]">
          {error}
        </div>
      </div>
    </div>
  );
}

export default OProfile;
