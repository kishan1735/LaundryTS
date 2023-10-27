import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Logout from "../../components/Logout";
import SendRefresh from "../../components/SendRefresh";

function OShopGet() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [satisfied, setSatisfied] = useState("");
  const [price, setPrice] = useState("");
  const [unsatisfied, setUnsatisfied] = useState("");
  const [error, setError] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies([
    "access_token",
    "refresh_token",
  ]);
  const [created, setCreated] = useState(false);
  const navigate = useNavigate();
  useEffect(
    function () {
      async function getOwnerShops() {
        const res = await fetch("http://127.0.0.1:8000/api/v1/owner/shop", {
          headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + cookies.access_token,
          },
        });

        const data = await res.json();
        if (data.status == "success") {
          setCreated(true);
          setName(data.shop.name);
          setAddress(data.shop.address);
          setContactNumber(data.shop.contactNumber);
          setSatisfied(data.shop.satisfied);
          setUnsatisfied(data.shop.unsatisfied);
          setPrice(data.shop.price);
        } else if (
          data.message == "jwt expired" ||
          data.message == "jwt malformed"
        ) {
          removeCookie("access_token");
          SendRefresh(cookies.refresh_token)
            .then((response) => response.json())
            .then((dat) => {
              if (dat.status == "success") {
                setError("Try again");
                setCookie("access_token", dat.accessToken);
              } else {
                setError(data.message);
                setCreated(false);
                setName("");
                setAddress("");
                setContactNumber("");
                setSatisfied("");
                setUnsatisfied("");
                setPrice("");
              }
            });
        } else {
          setError(data.message);
          setCreated(false);
          setName("");
          setAddress("");
          setContactNumber("");
          setSatisfied("");
          setUnsatisfied("");
          setPrice("");
        }
      }
      getOwnerShops();
    },
    [cookies.access_token, cookies.refresh_token, setCookie, removeCookie]
  );
  function handleCreate() {
    navigate("/owner/main/createshop");
  }
  function handleDelete() {
    const deleteCheck: any = prompt("Type 'YES' if you want to DELETE");
    if (deleteCheck == "YES") {
      fetch("http://127.0.0.1:8000/api/v1/owner/shop", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + cookies.access_token,
        },
      })
        .then((res) => {
          if (res) {
            return res.json();
          } else {
            throw new Error("no data");
          }
        })
        .then((data) => {
          if (
            data.message == "jwt expired" ||
            data.message == "jwt malformed"
          ) {
            removeCookie("access_token");
            SendRefresh(cookies.refresh_token)
              .then((response) => response.json())
              .then((dat) => {
                if (dat.status == "success") {
                  setError("Try again");
                  setCookie("access_token", dat.accessToken);
                } else {
                  setError(dat.message);
                }
              });
          }
        })
        .catch((err) => console.log(err));
    }
  }

  return (
    <div
      className={`${
        created ? "h-full pb-4 items-center" : "h-screen items-center"
      } flex flex-col`}
      id="home"
    >
      <Logout type="owner" />

      <div
        className={`${
          created ? "" : "mt-32"
        } bg-black opacity-80 flex flex-col px-12 py-8 space-y-4 border-2 border-slate-400`}
      >
        {created ? (
          <>
            <h1 className="text-white text-3xl uppercase mb-2">{name}</h1>
            <div className="flex text-white space-x-3">
              <h1 className=" text-xl text-yellow-200 uppercase mb-2">
                Address :
              </h1>
              <h1 className=" text-xl uppercase font-black mb-2">{address}</h1>
            </div>
            <div className="flex text-white space-x-3 ">
              <h1 className=" text-xl text-yellow-200 uppercase font-black mb-2">
                Contact Number :
              </h1>
              <h1 className=" text-xl uppercase font-black mb-2">
                {contactNumber}
              </h1>
            </div>
            <h1 className=" text-3xl text-white uppercase font-black mb-2">
              Price :
            </h1>
            <div className="flex text-white space-x-3 ">
              {Object.entries(price)
                .filter((el: any) => el[1] != 0)
                .map((el: any) => {
                  return (
                    <div className="flex text-white space-x-3 ">
                      <h1 className=" text-xl text-yellow-200 uppercase font-black mb-2">
                        {el[0]}
                      </h1>
                      <h1 className=" text-xl uppercase font-black mb-2">
                        {el[1]}
                      </h1>
                    </div>
                  );
                })}
            </div>
            <div className="flex text-white space-x-3 ">
              <h1 className=" text-xl text-yellow-200 uppercase font-black mb-2">
                Satisfied :
              </h1>
              <h1 className=" text-xl uppercase font-black mb-2">
                {satisfied}
              </h1>
            </div>
            <div className="flex text-white space-x-3 ">
              <h1 className=" text-xl text-yellow-200 uppercase font-black mb-2">
                Unsatisfied :
              </h1>
              <h1 className=" text-xl uppercase font-black mb-2">
                {unsatisfied}
              </h1>
            </div>
            <button
              className="bg-white mx-16 py-1 text-lg font-bold uppercase hover:scale-110 duration-400"
              onClick={() => {
                navigate("/owner/main/updateshop");
              }}
            >
              Update Shop
            </button>
            <button
              className="bg-white mx-16 py-1 text-lg font-bold uppercase hover:scale-110 duration-400"
              onClick={handleDelete}
            >
              Delete shop
            </button>
            <button
              className="bg-white mx-16 py-1 text-lg font-bold uppercase hover:scale-110 duration-400"
              onClick={() => {
                navigate("/owner/main/shop/laundry");
              }}
            >
              Check Laundry
            </button>
          </>
        ) : (
          <button
            className="bg-white mx-16 py-1 text-lg font-bold uppercase hover:scale-110 duration-400"
            onClick={handleCreate}
          >
            Create Shop
          </button>
        )}
        <div className="uppercase text-sm text-center text-white w-[500px]">
          {created ? error : ""}
        </div>
      </div>
    </div>
  );
}

export default OShopGet;
