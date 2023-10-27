import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Logout from "../../components/Logout";
import SendRefresh from "../../components/SendRefresh";

function OShopUpdate() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [tshirt, setTshirt] = useState("");
  const [shirt, setShirt] = useState("");
  const [pant, setPant] = useState("");
  const [shorts, setShorts] = useState("");
  const [towel, setTowel] = useState("");
  const [bedsheet, setBedsheet] = useState("");
  const [pillowCover, setPillowCover] = useState("");
  const [error, setError] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies([
    "access_token",
    "refresh_token",
  ]);
  const [disabled, setDisabled] = useState(true);
  const [created, setCreated] = useState(false);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();
  useEffect(
    function () {
      async function getOwnerShops() {
        const res = await fetch("http://127.0.0.1:8000/api/v1/owner/shop", {
          headers: { Authorization: "Bearer " + cookies.access_token },
        });

        const data = await res.json();
        if (data.status == "success") {
          setCreated(true);
          setName(data.shop.name);
          setAddress(data.shop.address);
          setContactNumber(data.shop.contactNumber);
          setTshirt(data.shop.price.tshirt);
          setShirt(data.shop.price.shirt);
          setPant(data.shop.price.pant);
          setShorts(data.shop.price.shorts);
          setBedsheet(data.shop.price.bedsheet);
          setPillowCover(data.shop.price.pillowCover);
          setTowel(data.shop.price.towel);
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
                      setError(dat.message);
                    }
                  });
              } else {
                setError(dat.message);
              }
            });
        } else {
          setError(data.message);
          setCreated(false);
        }
      }
      getOwnerShops();
    },
    [cookies.access_token, cookies.refresh_token, setCookie, removeCookie]
  );
  function handleClick() {
    setDisabled(false);
    setUpdating(true);
  }
  function handleUpdateDetails() {
    const requestBody = { name, contactNumber, address };
    fetch("http://127.0.0.1:8000/api/v1/owner/shop", {
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
          navigate("/owner/main/shop");
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
                setError(dat.message);
              }
            });
        } else {
          setError(data.message);
        }
      });
  }
  function handleUpdatePrice() {
    const requestBody = {
      price: {
        towel: +towel,
        tshirt: +tshirt,
        shirt: +shirt,
        shorts: +shorts,
        pant: +pant,
        bedsheet: +bedsheet,
        pillowCover: +pillowCover,
      },
    };
    fetch("http://127.0.0.1:8000/api/v1/owner/shop/updatePrice", {
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
          navigate("/owner/main/shop");
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
                setError(dat.message);
              }
            });
        } else {
          setError(data.message);
        }
      });
  }
  return (
    <div
      className={`${
        !created && !updating ? "h-screen" : "h-full"
      } flex flex-col justify-center items-center`}
      id="home"
    >
      {" "}
      <Logout type="owner" />
      <div className="bg-black opacity-80 flex flex-col px-12 py-8 space-y-4 border-2 border-slate-400">
        {created ? (
          <>
            <h1 className="text-white text-3xl uppercase font-black mb-2">
              Update Shop
            </h1>
            <h1 className="text-white text-2xl uppercase font-black mb-2">
              Details
            </h1>
            <div className="flex items-center space-x-6">
              <h1 className="text-white text-xl uppercase pr-[152px]">Name</h1>
              <input
                type="text"
                value={name}
                className="px-8 py-1 text-center bg-white"
                onChange={(e) => setName(e.target.value)}
                disabled={disabled}
              />
            </div>
            <div className="flex items-center space-x-6">
              <h1 className="text-white text-xl uppercase pr-[122px]">
                Address
              </h1>
              <input
                type="text"
                value={address}
                className="px-8 py-1 text-center bg-white"
                onChange={(e) => setAddress(e.target.value)}
                disabled={disabled}
              />
            </div>
            <div className="flex items-center space-x-6">
              <h1 className="text-white text-xl uppercase pr-[25px]">
                Contact Number
              </h1>
              <input
                type="text"
                value={contactNumber}
                className="px-8 py-1 text-center bg-white"
                onChange={(e) => setContactNumber(e.target.value)}
                disabled={disabled}
              />
            </div>
            <h1 className="text-white text-2xl uppercase font-black mb-2">
              Price
            </h1>
            <div className="flex text-white justify-around ">
              <div className="flex flex-col text-center">
                <h1 className="uppercase text-lg">Tshirt</h1>
                <input
                  type="text"
                  value={tshirt}
                  className="text-center w-20 text-black bg-white"
                  onChange={(e) => setTshirt(e.target.value)}
                  disabled={disabled}
                />
              </div>
              <div className="flex flex-col text-center">
                <h1 className="uppercase text-lg">Shirt</h1>
                <input
                  type="text"
                  value={shirt}
                  className="text-center w-20 text-black bg-white"
                  onChange={(e) => setShirt(e.target.value)}
                  disabled={disabled}
                />
              </div>
              <div className="flex flex-col text-center">
                <h1 className="uppercase text-lg">Shorts</h1>
                <input
                  type="text"
                  value={shorts}
                  className="text-center w-20 text-black bg-white"
                  onChange={(e) => setShorts(e.target.value)}
                  disabled={disabled}
                />
              </div>
              <div className="flex flex-col text-center ">
                <h1 className="uppercase text-lg">Pant</h1>
                <input
                  type="text"
                  value={pant}
                  className="text-center w-20 text-black bg-white"
                  onChange={(e) => setPant(e.target.value)}
                  disabled={disabled}
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
                  disabled={disabled}
                />
              </div>
              <div className="flex flex-col text-center items-center">
                <h1 className="uppercase text-lg">Bedsheet</h1>
                <input
                  type="text"
                  value={bedsheet}
                  className="text-center w-20 text-black bg-white"
                  onChange={(e) => setBedsheet(e.target.value)}
                  disabled={disabled}
                />
              </div>
              <div className="flex flex-col items-center text-center">
                <h1 className="uppercase text-lg">Pillow Cover</h1>
                <input
                  type="text"
                  value={pillowCover}
                  className="text-center w-20 text-black bg-white"
                  onChange={(e) => setPillowCover(e.target.value)}
                  disabled={disabled}
                />
              </div>
            </div>

            {!updating ? (
              <button
                className="bg-white mx-16 py-1 text-lg font-bold uppercase hover:scale-110 duration-400"
                onClick={handleClick}
              >
                Update Shop
              </button>
            ) : (
              <>
                <button
                  className="bg-white mx-16 py-1 text-lg font-bold uppercase hover:scale-110 duration-400"
                  onClick={handleUpdateDetails}
                >
                  Update Details
                </button>
                <button
                  className="bg-white mx-16 py-1 text-lg font-bold uppercase hover:scale-110 duration-400"
                  onClick={handleUpdatePrice}
                >
                  Update Price
                </button>
              </>
            )}
          </>
        ) : (
          <h1 className="text-white text-3xl uppercase font-black mb-2">
            Create A Shop And Then Try Updating
          </h1>
        )}

        <div className="uppercase text-sm text-center text-white w-[500px]">
          {error}
        </div>
      </div>
    </div>
  );
}

export default OShopUpdate;
