import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Logout from "../../components/Logout";
import SendRefreshUser from "../../components/SendRefreshUser";

function UShops() {
  const [cookies, setCookie, removeCookie] = useCookies([
    "access_token",
    "refresh_token",
  ]);
  const [shops, setShops] = useState([]);
  const navigate = useNavigate();
  useEffect(
    function () {
      async function getAllShops() {
        const res = await fetch("http://127.0.0.1:8000/api/v1/user/shops", {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + cookies.access_token,
          },
        });
        const data = await res.json();
        if (data.status == "success") {
          setShops(data.shops);
        } else if (
          data.message == "jwt expired" ||
          data.message == "jwt malformed"
        ) {
          removeCookie("access_token");
          SendRefreshUser(cookies.refresh_token)
            .then((response) => response.json())
            .then((dat) => {
              if (dat.status == "success") {
                setCookie("access_token", dat.accessToken);
              }
            });
        }
      }
      getAllShops();
    },
    [cookies.access_token, cookies.refresh_token, setCookie, removeCookie]
  );
  return (
    <div
      className="h-screen flex flex-col space-x-8 items-center max-w-kxl"
      id="home"
    >
      <Logout type="user" />
      <div className="flex space-x-4 mt-3">
        {shops.map((el: any) => {
          return (
            <div className="bg-black opacity-80 flex flex-col px-12 py-8 space-y-4 border-2 border-slate-400 ">
              <h1 className="text-white text-2xl uppercase mb-2">{el.name}</h1>
              <div className="flex text-white space-x-3">
                <h1 className=" text-lg text-yellow-200 uppercase mb-2">
                  Address :
                </h1>
                <h1 className=" text-lg uppercase font-black mb-2">
                  {el.address}
                </h1>
              </div>
              <div className="flex text-white space-x-3 ">
                <h1 className=" text-lg text-yellow-200 uppercase font-black mb-2">
                  Contact Number :
                </h1>
                <h1 className=" text-lg uppercase font-black mb-2">
                  {el.contactNumber}
                </h1>
              </div>
              <div className="flex text-white space-x-3 ">
                <h1 className=" text-xl text-yellow-200 uppercase font-black mb-2">
                  Satisfied :
                </h1>
                <h1 className=" text-xl uppercase font-black mb-2">
                  {el.satisfied}
                </h1>
              </div>
              <div className="flex text-white space-x-3 ">
                <h1 className=" text-xl text-yellow-200 uppercase font-black mb-2">
                  Unsatisfied :
                </h1>
                <h1 className=" text-xl uppercase font-black mb-2">
                  {el.unsatisfied}
                </h1>
              </div>
              <button
                className="bg-white mx-16 py-1 text-lg font-bold uppercase hover:scale-110 duration-400"
                onClick={() => {
                  navigate(`/user/main/shops/${el._id}`);
                }}
              >
                Place Order
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UShops;
