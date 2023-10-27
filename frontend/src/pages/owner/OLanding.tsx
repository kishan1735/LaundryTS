import { useNavigate } from "react-router-dom";
import Logout from "../../components/Logout";

function OLanding() {
  const navigate = useNavigate();
  return (
    <div className="h-screen flex flex-col items-center" id="home">
      <Logout type="owner" />
      <div className="bg-black opacity-80 flex flex-col px-12 py-8 space-y-8 border-2 border-slate-400 mt-16">
        <button
          className="bg-white mx-16 py-6 px-8 text-2xl font-bold uppercase hover:scale-110 duration-400"
          onClick={() => {
            navigate("/owner/main/profile");
          }}
        >
          Owner Profile
        </button>
        <button
          className="bg-white mx-16 py-6 px-8 text-2xl font-bold uppercase hover:scale-110 duration-400"
          onClick={() => {
            navigate("/owner/main/shop");
          }}
        >
          Shop Profile
        </button>
      </div>
    </div>
  );
}

export default OLanding;
