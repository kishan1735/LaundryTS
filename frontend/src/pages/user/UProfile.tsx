import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Logout from "../../components/Logout";
import SendRefreshUser from "../../components/SendRefreshUser";

function UProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies([
    "access_token",
    "refresh_token",
  ]);
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();
  useEffect(
    function () {
      async function getProfile() {
        const res = await fetch("http://127.0.0.1:8000/api/v1/user/profile", {
          headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + cookies.access_token,
          },
        });
        const data = await res.json();
        if (data.status == "success") {
          setName(data.user.name);
          setEmail(data.user.email);
          setAddress(data.user.address);
          setPhoneNumber(data.user.phoneNumber);
        } else if (
          data.message == "jwt expired" ||
          data.message == "jwt malformed"
        ) {
          removeCookie("access_token");
          SendRefreshUser(cookies.refresh_token)
            .then((response) => response.json())
            .then((dat) => {
              if (dat.status == "success") {
                setError("Try again");
                setCookie("access_token", dat.accessToken);
              } else {
                setError(dat.message);
              }
            });
        } else {
          setError(data.message);
        }
      }
      getProfile();
    },
    [cookies.access_token, cookies.refresh_token, setCookie, removeCookie]
  );
  function handleUpdate() {
    setDisabled(false);
    setUpdating(true);
    const requestBody = { name, phoneNumber, address };
    fetch("http://127.0.0.1:8000/api/v1/user/profile", {
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
          setError("Success");
          setUpdating(false);
          setDisabled(true);
        } else if (
          data.message == "jwt expired" ||
          data.message == "jwt malformed"
        ) {
          removeCookie("access_token");
          SendRefreshUser(cookies.refresh_token)
            .then((response) => response.json())
            .then((dat) => {
              if (dat.status == "success") {
                setError("Try again");
                setCookie("access_token", dat.accessToken);
              } else {
                setError(dat.message);
              }
            });
        } else {
          setError(data.message);
        }
      });
  }
  function handleDelete() {
    const deleteCheck: any = prompt("Type 'YES' if you want to DELETE");
    if (deleteCheck == "YES") {
      fetch("http://127.0.0.1:8000/api/v1/user/profile", {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + cookies.access_token,
        },
      })
        .then((res) => {
          if (res) {
            return res.json();
          } else {
            throw new Error("Something went wrong");
          }
        })
        .then((data) => {
          if (
            data.message == "jwt expired" ||
            data.message == "jwt malformed"
          ) {
            removeCookie("access_token");
            SendRefreshUser(cookies.refresh_token)
              .then((response) => response.json())
              .then((dat) => {
                if (dat.status == "success") {
                  setError("Try again");
                  setCookie("access_token", dat.accessToken);
                } else {
                  setError(dat.message);
                }
              });
          } else if (data.status == "failed" || data.status == "error") {
            setError(data.message);
          } else {
            setError("");
          }
        })
        .catch((err) => {
          setError(err);
          console.log(err);
        });
      removeCookie("access_token", {});
      navigate("../../user/login");
    }
  }
  return (
    <div className="h-screen flex flex-col  items-center" id="home">
      <Logout type="user" />
      <div className="bg-black opacity-80 flex flex-col px-12 py-8 space-y-4 border-2 border-slate-400">
        <h1 className="text-white text-3xl uppercase mb-2">
          {name ? name : "User Profile"}
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

        <div className="flex items-center space-x-6 ">
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
        <div className="flex items-center space-x-6">
          <h1 className="text-xl text-yellow-200 uppercase font-black pr-[122px]">
            Address
          </h1>
          <input
            type="text"
            value={address}
            className="px-8 py-1 text-center font-bold text-lg bg-white"
            onChange={(e) => setAddress(e.target.value)}
            disabled={disabled}
          />
        </div>
        <div className="flex items-center justify-center space-x-6 pb-2">
          <h1 className="text-xl text-yellow-200 uppercase font-black">
            Email :
          </h1>
          <h1 className="text-xl text-white lowercase font-black ">{email}</h1>
        </div>

        {updating ? (
          <button
            className="bg-white mx-16 py-1 text-lg font-bold uppercase hover:scale-110 duration-400"
            onClick={handleUpdate}
          >
            Update User
          </button>
        ) : (
          <button
            className="bg-white mx-16 py-1 text-lg font-bold uppercase hover:scale-110 duration-400"
            onClick={() => {
              setDisabled(false);
              setUpdating(true);
              setError("");
            }}
          >
            Click to Update
          </button>
        )}

        <button
          className="bg-white mx-16 py-1 text-lg font-bold uppercase hover:scale-110 duration-400"
          onClick={handleDelete}
        >
          Delete User
        </button>
        <div className="uppercase text-sm text-center text-white w-[500px]">
          {error}
        </div>
      </div>
    </div>
  );
}

export default UProfile;
