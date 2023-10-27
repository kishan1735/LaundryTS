import { useEffect, useState } from "react";
import Logout from "../../components/Logout";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import SendRefreshUser from "../../components/SendRefreshUser";

function UCreateLaundry() {
  let { shopId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [tshirt, setTshirt] = useState("");
  const [shirt, setShirt] = useState("");
  const [pant, setPant] = useState("");
  const [shorts, setShorts] = useState("");
  const [towel, setTowel] = useState("");
  const [bedsheet, setBedsheet] = useState("");
  const [pillowCover, setPillowCover] = useState("");
  const [error, setError] = useState("");
  const [price, setPrice] = useState(0);
  const [exists, setExists] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies([
    "access_token",
    "refresh_token",
  ]);
  function handleCalculatePrice() {
    const requestBody = {
      list: {
        towel: +towel,
        shorts: +shorts,
        pant: +pant,
        tshirt: +tshirt,
        shirt: +shirt,
        bedsheet: +bedsheet,
        pillowCover: +pillowCover,
      },
    };
    fetch(`http://127.0.0.1:8000/api/v1/user/shops/${shopId}/calculateCost`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + cookies.access_token,
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setPrice(data.totalCost);
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
          setPrice(0);
          setError(data.message);
        }
      });
  }
  function handleLaundry() {
    const requestBody = {
      list: {
        towel: +towel,
        shorts: +shorts,
        pant: +pant,
        tshirt: +tshirt,
        shirt: +shirt,
        bedsheet: +bedsheet,
        pillowCover: +pillowCover,
      },
      totalCost: price,
    };
    fetch(`http://127.0.0.1:8000/api/v1/user/shops/${shopId}/laundry`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + cookies.access_token,
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "success") {
          setError("");
          setExists(true);
          navigate(`/user/main/shops/${shopId}/laundry`);
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
  useEffect(
    function () {
      async function getLaundry() {
        const res = await fetch(
          `http://127.0.0.1:8000/api/v1/user/shops/${shopId}/laundry`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + cookies.access_token,
            },
          }
        );
        const data = await res.json();
        if (data.status == "success") {
          setExists(true);
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
          setExists(false);
        }
      }
      getLaundry();
    },
    [
      cookies.access_token,
      shopId,
      cookies.refresh_token,
      setCookie,
      removeCookie,
    ]
  );
  return (
    <div className={`h-screen flex flex-col items-center `} id="home">
      <Logout type="user" />
      <div
        className={`bg-black opacity-80 flex flex-col px-12 py-8 space-y-4 border-2 border-slate-400 ${
          exists ? "mt-24" : ""
        }`}
      >
        {!exists ? (
          <>
            <h1 className="text-white text-3xl uppercase font-black mb-2">
              {name}
            </h1>
            <h1 className="text-yellow-200 text-2xl uppercase font-black mb-2">
              Set Number of Clothes
            </h1>
            <div className="flex text-white justify-around ">
              <div className="flex flex-col text-center">
                <h1 className="uppercase text-lg">Tshirt</h1>
                <input
                  type="text"
                  value={tshirt}
                  className="text-center w-20 text-black bg-white"
                  onChange={(e) => setTshirt(e.target.value)}
                />
              </div>
              <div className="flex flex-col text-center">
                <h1 className="uppercase text-lg">Shirt</h1>
                <input
                  type="text"
                  value={shirt}
                  className="text-center w-20 text-black bg-white"
                  onChange={(e) => setShirt(e.target.value)}
                />
              </div>
              <div className="flex flex-col text-center">
                <h1 className="uppercase text-lg">Shorts</h1>
                <input
                  type="text"
                  value={shorts}
                  className="text-center w-20 text-black bg-white"
                  onChange={(e) => setShorts(e.target.value)}
                />
              </div>
              <div className="flex flex-col text-center ">
                <h1 className="uppercase text-lg">Pant</h1>
                <input
                  type="text"
                  value={pant}
                  className="text-center w-20 text-black bg-white"
                  onChange={(e) => setPant(e.target.value)}
                />
              </div>
            </div>
            <div className="flex text-white justify-around pb-2">
              <div className="flex flex-col text-center">
                <h1 className="uppercase text-lg">Towel</h1>
                <input
                  type="text"
                  value={towel}
                  className="text-center w-20 text-black bg-white"
                  onChange={(e) => setTowel(e.target.value)}
                />
              </div>
              <div className="flex flex-col text-center items-center">
                <h1 className="uppercase text-lg">Bedsheet</h1>
                <input
                  type="text"
                  value={bedsheet}
                  className="text-center w-20 text-black bg-white"
                  onChange={(e) => setBedsheet(e.target.value)}
                />
              </div>
              <div className="flex flex-col items-center text-center">
                <h1 className="uppercase text-lg">Pillow Cover</h1>
                <input
                  type="text"
                  value={pillowCover}
                  className="text-center w-20 text-black bg-white"
                  onChange={(e) => setPillowCover(e.target.value)}
                />
              </div>
            </div>

            <button
              className="bg-white mx-16 py-1 text-lg font-bold uppercase hover:scale-110 duration-400"
              onClick={handleCalculatePrice}
            >
              Calculate Price
            </button>
            {price > 0 ? (
              <button
                className="bg-white mx-16 py-1 text-lg font-bold uppercase hover:scale-110 duration-400"
                onClick={handleLaundry}
              >
                Submit Laundry
              </button>
            ) : (
              ""
            )}
            <div className="flex justify-center text-white space-x-3">
              <h1 className=" text-xl text-yellow-200 uppercase mb-2">
                Price :
              </h1>
              <h1 className=" text-xl uppercase font-black mb-2">{price}</h1>
            </div>

            <div className="uppercase text-sm text-center text-white w-[500px]">
              {error}
            </div>
          </>
        ) : (
          <h1 className="text-white text-3xl uppercase font-black mb-2 mt">
            You have an existing Laundry Request
          </h1>
        )}
      </div>
    </div>
  );
}

export default UCreateLaundry;
