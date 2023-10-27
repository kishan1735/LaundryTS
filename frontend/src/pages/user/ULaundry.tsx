import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import Logout from "../../components/Logout";
import SendRefreshUser from "../../components/SendRefreshUser";

function ULaundry() {
  let { shopId } = useParams();
  const [error, setError] = useState("");
  const [exists, setExists] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies([
    "access_token",
    "refresh_token",
  ]);
  const [status, setStatus] = useState("");
  const [list, setList] = useState({});
  const navigate = useNavigate();
  const [satisfy, setSatisfy] = useState(0);
  const [unsatisfy, setUnsatisfy] = useState(0);

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
          setStatus(data.laundry.status);
          setList(data.laundry.list);
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
      setCookie,
      removeCookie,
      cookies.refresh_token,
    ]
  );
  function handleDelete() {
    fetch(`http://127.0.0.1:8000/api/v1/user/shops/${shopId}/laundry`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + cookies.access_token,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.message == "jwt expired" || data.message == "jwt malformed") {
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
          setExists(false);
          setError("");
        }
      });
  }
  function updateSatisfy(satisfy: number) {
    const requestBody: any = {
      satisfaction: satisfy ? "satisfied" : "unsatisfied",
    };
    fetch(`http://127.0.0.1:8000/api/v1/user/shops/${shopId}/satisfaction`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + cookies.access_token,
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => console.log(data));
  }
  return (
    <div className="h-screen flex flex-col items-center" id="home">
      <Logout type="user" />
      <div className="bg-black opacity-80 flex flex-col px-12 py-8 space-y-4 border-2 border-slate-400">
        {!exists ? (
          <div className="flex flex-col space-y-6 p-2">
            <h1 className="text-white text-3xl uppercase font-black mb-2 mt">
              You don't have Laundry
            </h1>
            <button
              className="bg-white mx-16 py-1 text-lg font-bold uppercase hover:scale-110 duration-400"
              onClick={() => {
                navigate(`/user/main/shops/${shopId}/createlaundry`);
              }}
            >
              Create Laundry Request
            </button>
          </div>
        ) : (
          <div className="">
            <div className="flex justify-center text-white space-x-3">
              <h1 className=" text-xl text-yellow-200 font-bold uppercase mb-2">
                Status :
              </h1>
              <h1 className=" text-xl uppercase font-black mb-2">{status}</h1>
            </div>
            {Object.entries(list).map((el: any) => {
              return (
                <div className="flex flex-col" key={el[0]}>
                  <div className="flex justify-center text-white space-x-3">
                    <h1 className=" text-xl text-yellow-200  uppercase mb-2">
                      {el[0]}
                    </h1>
                    <h1 className=" text-xl uppercase  mb-2">{el[1]}</h1>
                  </div>
                </div>
              );
            })}
            {status == "pending" ? (
              <button
                className="bg-white mt-2 py-1 px-8 text-lg font-bold uppercase hover:scale-110 duration-400"
                onClick={handleDelete}
              >
                Cancel Request
              </button>
            ) : status == "ready" ? (
              <div className="flex flex-col">
                <div className="flex justify-between py-1">
                  <div className="flex ">
                    <button
                      className="hover:scale-125 text-2xl"
                      onClick={() => {
                        setSatisfy(1);
                        setUnsatisfy(0);
                      }}
                    >
                      👍
                    </button>
                    <h1 className="text-yellow-400 pt-1 text-lg">{satisfy}</h1>
                  </div>
                  <div className="flex">
                    <h1 className="text-yellow-400 pt-1 text-lg">
                      {unsatisfy}
                    </h1>
                    <button
                      className="hover:scale-125 text-2xl"
                      onClick={() => {
                        setUnsatisfy(1);
                        setSatisfy(0);
                      }}
                    >
                      👎
                    </button>
                  </div>
                </div>
                <button
                  className="bg-white mt-2 py-1 px-8 text-lg font-bold uppercase hover:scale-110 duration-400"
                  onClick={() => {
                    updateSatisfy(satisfy);
                    handleDelete();
                  }}
                >
                  Recieve Laundry
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ULaundry;
