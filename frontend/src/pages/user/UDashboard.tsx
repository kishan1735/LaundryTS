import { Link } from "react-router-dom";

export default function UDashboard() {
  return (
    <div className="h-screen flex  justify-center items-center" id="home">
      <div className="bg-white flex flex-col space-y-6 px-8 py-16 text-center border-4 border-black opacity-80">
        <h1 className="text-4xl font-bold uppercase">
          Login as User to Get Started
        </h1>
        <Link
          to="/user/login"
          className="text-2xl bg-black text-white py-3 uppercase mx-24 font-bold hover:scale-110 duration-200 border-slate-500 border-2"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
