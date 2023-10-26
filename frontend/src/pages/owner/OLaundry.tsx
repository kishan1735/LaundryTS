import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Logout from "../../components/Logout";

function OLaundry() {
  const [laundry, setLaundry] = useState([]);
  const [error, setError] = useState("");
  const [cookies] = useCookies(["access_token"]);
  const navigate = useNavigate();
  function handlePayload(payload: string, laundryId: string) {
    if (payload && payload !== "deliver") {
      const requestBody = { status: payload, laundryId };
      fetch(`http://127.0.0.1:8000/api/v1/owner/shop/laundry/${laundryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + cookies.access_token,
        },
        body: JSON.stringify(requestBody),
      })
        .then((res) => {
          navigate(0);
          return res.json;
        })
        .then((data: any) => {
          if (data.status == "success") {
            setError("");
          } else {
            setError(data.message);
          }
        });
    } else if (payload == "deliver") {
      fetch(`http://127.0.0.1:8000/api/v1/owner/shop/laundry/${laundryId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + cookies.access_token,
        },
      })
        .then((res) => {
          navigate(0);
          return res.json();
        })
        .then((data) => {
          if (data.status == "failed" || data.status == "error") {
            setError("message");
          }
        });
    }
  }
  useEffect(
    function () {
      async function getAllLaundry() {
        const res = await fetch(
          `http://127.0.0.1:8000/api/v1/owner/shop/laundry`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + cookies.access_token,
            },
          }
        );
        const data = await res.json();
        if (data.status == "success") {
          setLaundry(data.laundry);
          setError("");
        } else {
          setError(data.message);
        }
      }
      getAllLaundry();
    },
    [cookies.access_token]
  );
  return (
    <div
      className={`${
        laundry.length == 0 ? "h-screen" : "h-full justify-center"
      } flex flex-col space-x-8  w-full items-center pb-4`}
      id="home"
    >
      <Logout type="owner" />
      <div className="flex space-x-6">
        {laundry.map((el: any) => {
          return (
            <div className="bg-black opacity-80 flex flex-col px-8 py-8 space-y-4 border-2 border-slate-400 ">
              <h1 className="text-white text-2xl uppercase mb-2">{el.name}</h1>
              <div className="flex text-white space-x-3">
                <h1 className=" text-lg text-yellow-200 font-black uppercase mb-2">
                  Status :
                </h1>
                <h1 className=" text-lg uppercase font-black mb-2">
                  {el.status}
                </h1>
              </div>
              <div className="flex text-white space-x-3 ">
                <h1 className=" text-lg text-yellow-200 uppercase font-black mb-2">
                  Contact Number :
                </h1>
                <h1 className="text-lg uppercase font-black mb-2">
                  {el.studentPhoneNumber}
                </h1>
              </div>
              <div className="flex flex-col space-y-1">
                {Object.entries(el.list).map((el: any) => {
                  return (
                    <div className="flex space-x-2">
                      <h1 className=" text-lg text-yellow-200 uppercase font-black mb-2">
                        {el[0]}:
                      </h1>
                      <h1 className="text-lg uppercase font-black mb-2 text-white">
                        {el[1]}
                      </h1>
                    </div>
                  );
                })}
                {el.status == "pending" ? (
                  <button
                    className="bg-white mx-16 py-1 px-2 text-lg font-bold uppercase hover:scale-110 duration-400"
                    onClick={() => handlePayload("active", el._id)}
                  >
                    Accept
                  </button>
                ) : el.status == "active" ? (
                  <button
                    className="bg-white mx-16 py-1 px-2 text-lg font-bold uppercase hover:scale-110 duration-400"
                    onClick={() => handlePayload("ready", el._id)}
                  >
                    Ready
                  </button>
                ) : (
                  <button
                    className="bg-white mx-16 py-1 px-2 text-lg font-bold uppercase hover:scale-110 duration-400"
                    onClick={() => handlePayload("deliver", el._id)}
                  >
                    Deliver
                  </button>
                )}
                <div className="uppercase text-sm text-center text-white w-[300px]">
                  {error}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OLaundry;
