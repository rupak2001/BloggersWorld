"use client";
import React, { useRef } from "react";
import "@/app/_css/forms.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";


export default function Login() {
  var router = useRouter();
  var email = useRef(null);
  var password = useRef(null);

  // function setCookie(cname, cvalue, exdays) {
  //   const d = new Date();
  //   d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  //   let expires = "expires=" + d.toUTCString();
  //   document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  // }

  function initiateLogin(e) {
    e.preventDefault();
    var requestBody = {
      email: email.current.value,
      password: password.current.value,
    };

    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, requestBody)
      // fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
      //   method: "POST",
      //   body: JSON.stringify(requestBody),
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // })
      .then((res) => {
        // setCookie("accessToken",res.data.accessToken,1)
        // setCookie("refreshToken",res.data.refreshToken,1)
        localStorage.setItem("accessToken",res.data.accessToken)
        localStorage.setItem("refreshToken",res.data.refreshToken)
      })
      .then(() => {
        toast.success("Login Successful", {
          position: "bottom-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

        router.push("/feed")
      })
      .catch((e) => {
        if (e.code == "ERR_BAD_REQUEST") {
          toast.warning("Invalid Username / Password", {
            position: "bottom-left",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          toast.error("Error! Please Try Again", {
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
  }
  return (
    <div
      className="d-flex flex-row justify-content-center align-items-center"
      style={{
        width: "100%",
        minHeight: "100vh",
        objectFit: "cover",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      <form
        className="rounded auth-form-inner-div "
        onSubmit={(e) => {
          initiateLogin(e);
        }}
      >
        <p className="display-6">Login</p>
        <div className="mx-3 my-2">
          <label htmlFor="exampleFormControlInput1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="enter email"
            required
            ref={email}
          />
        </div>
        <div className="mx-3 my-2">
          <label htmlFor="inputPassword6" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="inputPassword6"
            className="form-control"
            aria-describedby="passwordHelpInline"
            placeholder="enter password"
            required
            ref={password}
          />
        </div>
        <button className="btn btn-success mt-2" style={{ width: "30%" }}>
          Login
        </button>
        <a className="my-2 text-decoration-underline" href="/auth/signup">
          I need to register first
        </a>
      </form>
    </div>
  );
}
