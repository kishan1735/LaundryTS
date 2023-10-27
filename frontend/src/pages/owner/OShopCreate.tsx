import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Logout from "../../components/Logout";
import SendRefresh from "../../components/SendRefresh";

function OShopCreate() {
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
  const [disabled, setDisabled] = useState(false);
  const [created, setCreated] = useState(false);
  const navigate = useNavigate();
  useEffect(
    function () {
      async function getOwnerShops() {
        const res = await fetch("http://127.0.0.1:8000/api/v1/owner/shop", {
          headers: { Authorization: "Bearer " + cookies.access_token },
        });
        const data: any = await res.json();
        if (data.status == "success") {
          setCreated(true);
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
          setCreated(false);
        }
      }
      getOwnerShops();
    },
    [
      cookies.access_token,
      navigate,
      cookies.refresh_token,
      setCookie,
      removeCookie,
    ]
  );
  function handleClick() {
    const requestBody = {
      name,
      address,
      contactNumber: +contactNumber,
      price: {
        tshirt: +tshirt,
        bedsheet: +bedsheet,
        towel: +towel,
        shorts: +shorts,
        pant: +pant,
        shirt: +shirt,
        pillowCover: +pillowCover,
      },
    };

    fetch("http://127.0.0.1:8000/api/v1/owner/shop", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookies.access_token,
      },
      body: JSON.stringify(requestBody),
    })
      .then((res: any) => res.json())
      .then((data) => {
        if (data.status == "success") {
          setError("");
          setDisabled(true);
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
      })
      .catch((err) => setError(err.message));
  }
  if (!created) {
    return (
      <div className="h-full flex flex-col items-center " id="home">
        <Logout type="owner" />
        <div className="bg-black opacity-80 flex flex-col px-12 py-8 space-y-4 border-2 border-slate-400">
          <h1 className="text-white text-3xl uppercase font-black mb-2">
            Create Shop
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
            <h1 className="text-white text-xl uppercase pr-[122px]">Address</h1>
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

          <button
            className="bg-white mx-16 py-1 text-lg font-bold uppercase hover:scale-110 duration-400"
            onClick={handleClick}
          >
            Create Shop
          </button>

          <div className="uppercase text-sm text-center text-white w-[500px]">
            {error}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="h-screen flex justify-center items-center p-4" id="home">
        <div className="bg-black opacity-80 flex flex-col px-12 py-8 space-y-4 border-2 border-slate-400">
          <h1 className="text-white text-3xl uppercase font-black mb-2">
            You Own A Shop Already
          </h1>
        </div>
      </div>
    );
  }
}

export default OShopCreate;
