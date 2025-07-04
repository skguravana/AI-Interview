import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function UserLayout() {
  return (
    <>
      <Navbar />
      <Outlet /> {/* All nested routes will be rendered here */}
    </>
  );
}
