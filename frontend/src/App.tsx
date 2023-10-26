import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ULogin from "./pages/user/ULogin";
import OLogin from "./pages/owner/OLogin";
import UDashboard from "./pages/user/UDashboard";
import USignup from "./pages/user/USignup";
import OSignup from "./pages/owner/OSignup";
import ODashboard from "./pages/owner/ODashboard";
import ULanding from "./pages/user/ULanding";
import OLanding from "./pages/owner/OLanding";
import OShopCreate from "./pages/owner/OShopCreate";
import OShopGet from "./pages/owner/OShopGet";
import OShopUpdate from "./pages/owner/OShopUpdate";
import OProfile from "./pages/owner/OProfile";
import UProfile from "./pages/user/UProfile";
import UShops from "./pages/user/UShops";
import UShop from "./pages/user/UShop";
import ULaundry from "./pages/user/ULaundry";
import OLaundry from "./pages/owner/OLaundry";
import ProtectedRoute from "./components/ProtectedRoute";
import UCreateLaundry from "./pages/user/UCreateLaundry";
import OForgotPassword from "./pages/owner/OForgotPassword";
import UForgotPassword from "./pages/user/UForgotPassword";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/user/signup" element={<USignup />}></Route>
          <Route path="/user/login" element={<ULogin />}></Route>
          <Route
            path="/user/forgotpassword"
            element={<UForgotPassword />}
          ></Route>
          {/* <Route element={<ProtectedRoute type="user" />}> */}
          <Route path="/user/dashboard" element={<UDashboard />}></Route>
          <Route
            path="/user/main"
            element={
              <ProtectedRoute type="user">
                <ULanding />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/user/main/profile"
            element={
              <ProtectedRoute type="user">
                <UProfile />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/user/main/shops"
            element={
              <ProtectedRoute type="user">
                <UShops />
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path="/user/main/shops/:shopId"
            element={
              <ProtectedRoute type="user">
                <UShop />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/user/main/shops/:shopId/laundry"
            element={
              <ProtectedRoute type="user">
                <ULaundry />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/user/main/shops/:shopId/createlaundry"
            element={
              <ProtectedRoute type="user">
                <UCreateLaundry />
              </ProtectedRoute>
            }
          ></Route>
          {/* </Route> */}

          <Route path="/owner/signup" element={<OSignup />}></Route>
          <Route path="/owner/login" element={<OLogin />}></Route>
          <Route
            path="/owner/forgotpassword"
            element={<OForgotPassword />}
          ></Route>
          <Route path="/owner/dashboard" element={<ODashboard />}></Route>
          <Route
            path="/owner/main"
            element={
              <ProtectedRoute type="owner">
                <OLanding />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/owner/main/shop"
            element={
              <ProtectedRoute type="owner">
                <OShopGet />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="owner/main/shop/laundry"
            element={
              <ProtectedRoute type="owner">
                <OLaundry />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/owner/main/updateshop"
            element={
              <ProtectedRoute type="owner">
                <OShopUpdate />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/owner/main/profile"
            element={
              <ProtectedRoute type="owner">
                <OProfile />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/owner/main/createshop"
            element={
              <ProtectedRoute type="owner">
                <OShopCreate />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="*"
            element={<h1 className="font-bold text-4xl">Page Not Found</h1>}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
