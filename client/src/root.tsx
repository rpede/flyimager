import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

export default function Root() {
  return (
    <>
      <Toaster
        toastOptions={{
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <Outlet />
    </>
  );
}
