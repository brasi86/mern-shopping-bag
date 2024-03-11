import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignOut from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import FooterComponent from "./components/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <div className="wrapper flex flex-col  h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignOut />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <FooterComponent />
      </div>
    </BrowserRouter>
  );
}
