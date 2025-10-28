import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import AllRoutes from "./routes/AllRoutes";
import Loader from "./components/Loader";
import { UserContext } from "./context/UserContext";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Login, Register } from "./pages";
import { ToastContainer } from "react-toastify";

function App() {
  const [user, setUser] = useState(sessionStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const location = window.location.pathname;
  const navigate = useNavigate();

  // remove the token if it pass 1 hour
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const { exp } = JSON.parse(atob(token.split(".")[1]));
      if (Date.now() >= exp * 1000) {
        sessionStorage.removeItem("token");
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      setUser(null);
      setLoading(false);
    }
    setUser(sessionStorage.getItem("token"));
    setLoading(false);
  }, [user]);

  if (user && (location == "/login" || location == "/register")) {
    navigate("/", { replace: true });
  }

  if (loading) return <Loader />;

  return (
    <section className="">
      <Navbar />
      <UserContext.Provider value={{ user, setUser }}>
        <Routes>
          {user ? (
            <Route path="/*" element={<AllRoutes />} />
          ) : (
            <>
              {/* Redirect all except login/register to login */}
              <Route path="/*" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </>
          )}
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </UserContext.Provider>
    </section>
  );
}

export default App;
