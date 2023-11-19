import axios from "axios";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";

export function useCheckAuthToken() {
  axios
    .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refreshToken`, {
      token: localStorage.getItem("refreshToken"),
    })
    .then((res) => {
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
    })
    .catch((e) => {
      if (e.code == "ERR_BAD_REQUEST") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } else {
        toast.error("Server Error! Please try again", {
          toastId: "error1",
          position: "bottom-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    });

  if (!localStorage.getItem("accessToken")) {
    toast.error("Session Expired🥶 Please Login Again", {
      toastId: "error99",
      position: "bottom-left",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    window.location.replace('http://localhost:3000/auth/login');
  }
}
