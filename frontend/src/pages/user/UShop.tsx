/*eslint-disable*/
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import StarRating from "../../components/StarRating";
import Logout from "../../components/Logout";
import SendRefreshUser from "../../components/SendRefreshUser";

function UShop() {
  let { shopId } = useParams();
  const [cookies, setCookie, removeCookie] = useCookies([
    "access_token",
    "refresh_token",
  ]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [satisfied, setSatisfied] = useState("");
  const [price, setPrice] = useState("");
  const [unsatisfied, setUnsatisfied] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [shopRating, setShopRating] = useState(0);
  const [userRating, setUserRating] = useState(-1);
  const [description, setDescription] = useState("");
  useEffect(
    function () {
      async function getShop() {
        const res = await fetch(
          `http://127.0.0.1:8000/api/v1/user/shops/${shopId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + cookies.access_token,
            },
          }
        );
        const data: any = await res.json();
        if ((data.status = "success")) {
          setName(data.shop.name);
          setAddress(data.shop.address);
          setPrice(data.shop.price);
          setContactNumber(data.shop.contactNumber);
          setSatisfied(data.shop.satisfied);
          setUnsatisfied(data.shop.unsatisfied);
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
          setError(data.shop.message);
        }
      }
      getShop();
    },
    [shopId, cookies.access_token]
  );
  useEffect(
    function () {
      async function getRating() {
        const res = await fetch(
          `http://127.0.0.1:8000/api/v1/user/shops/${shopId}/rating`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + cookies.access_token,
            },
          }
        );
        const data = await res.json();
        if (data.status == "success") {
          setError("");
          setShopRating(data.rating);
          if (data.userRating.length !== 0) {
            setUserRating(data.userRating[0].rating);
            setDescription(data.userRating[0].description);
          }
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
      getRating();
    },
    [cookies.access_token, shopId]
  );
  function handleClick() {
    navigate(`/user/main/shops/${shopId}/laundry`);
  }
  function handleRating() {
    const requestBody = { rating, description };
    if (rating >= 0) {
      fetch(`http://127.0.0.1:8000/api/v1/user/shops/${shopId}/rating`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + cookies.access_token,
        },
        body: JSON.stringify(requestBody),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status == "success") {
            setError("");
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
    } else {
      setError("Give rating before submitting");
    }
  }
  //   function updateSatisfy() {
  //     fetch(`http://127.0.0.1:8000/api/v1/user/shops/${shopId}/updateSatisfy`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-type": "application/json",
  //         Authorization: "Bearer " + cookies.access_token,
  //       },
  //     });
  //   }
  //   function updateUnsatisfy() {}
  return (
    <div className="h-full flex flex-col justify-center items-center" id="home">
      <Logout type="user" />
      <div className="bg-black opacity-80 flex flex-col px-12 py-8 space-y-4 border-2 border-slate-400">
        <h1 className="text-white text-3xl uppercase mb-2 font-black">
          {name}
        </h1>
        <div className="flex text-white space-x-3">
          <h1 className=" text-xl text-yellow-200 uppercase mb-2">
            Address 🏠 :
          </h1>
          <h1 className=" text-xl uppercase font-black mb-2">{address}</h1>
        </div>
        <div className="flex text-white space-x-3 ">
          <h1 className=" text-xl text-yellow-200 uppercase font-black mb-2">
            Contact Number 📱 :
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
                <div className="flex text-white space-x-3 " key={el[0]}>
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
        <div className="flex text-white space-x-3 items-center">
          <h1 className=" text-xl text-yellow-200 uppercase font-black mb-2">
            Shop Rating :
          </h1>
          <h1 className=" text-xl uppercase font-black mb-2">
            {shopRating} ⭐
          </h1>
        </div>
        <div className="flex text-white space-x-3 items-center">
          <h1 className=" text-xl text-yellow-200 uppercase font-black mb-2">
            Satisfied :
          </h1>
          <h1 className=" text-xl uppercase font-black mb-2">{satisfied}</h1>
          {/* <button className="text-2xl hover:scale-110" onClick={updateSatisfy}>
            ✔️
          </button> */}
        </div>
        <div className="flex text-white space-x-3 ">
          <h1 className=" text-xl text-yellow-200 uppercase font-black mb-2">
            Unsatisfied :
          </h1>
          <h1 className=" text-xl uppercase font-black mb-2">{unsatisfied}</h1>
          {/* <button
            className="text-2xl hover:scale-110"
            onClick={updateUnsatisfy}
          >
            ❌
          </button> */}
        </div>
        {userRating == -1 ? (
          <>
            <div className="flex justify-between">
              <StarRating maxRating={10} size="30" onSetRating={setRating} />
            </div>
            <div className="flex space-x-4 text-center items-center">
              <h1 className="uppercase text-xl text-yellow-200">Description</h1>
              <input
                type="text"
                value={description}
                className="text-center px-20 text-black bg-white font-bold text-lg py-1"
                onChange={(e) => setDescription(e.target.value)}
              />
              <button
                className="bg-yellow-400 px-4 text-xl font-bold hover:scale-110"
                onClick={handleRating}
              >
                Rate
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col space-y-4 text-center justify-center">
              <div className="flex  text-white space-x-3">
                <h1 className=" text-xl font-bold text-yellow-200 uppercase mb-2">
                  Your Rating:
                </h1>
                <h1 className=" text-xl uppercase font-black mb-2">
                  {userRating} ⭐
                </h1>
              </div>
              <div className="flex text-white space-x-3 ">
                <h1 className=" text-xl text-yellow-200 uppercase mb-2 font-bold">
                  Description :
                </h1>
                <h1 className=" text-xl uppercase font-black mb-2">
                  {description}
                </h1>
              </div>
            </div>
          </>
        )}
        <div className="uppercase text-sm text-center text-white w-[500px]">
          {error}
        </div>
        <button
          className="bg-white mx-16 py-1 text-lg font-bold uppercase hover:scale-110 duration-400"
          onClick={handleClick}
        >
          Send Laundry Request
        </button>
      </div>
    </div>
  );
}

export default UShop;
