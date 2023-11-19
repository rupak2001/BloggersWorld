"use client";

import React, { useRef, useState } from "react";
import "@/app/_css/forms.css";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import { CldUploadWidget, getCldImageUrl } from "next-cloudinary";

export default function Signup() {
  var [dpLink, setDpLink] = useState(
    "https://res.cloudinary.com/dbdwazqql/image/upload/v1700228724/jrstyhlzvud9xyt1yskr.png"
  );
  var [verificationLink, setVerificationLink] = useState();
  var email = useRef(null);
  var password = useRef(null);
  var first_name = useRef(null);
  var last_name = useRef(null);
  var bio = useRef(null);

  function resendVerificationLink(e, email) {
    e.preventDefault();
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/resend-verification`, {
        email: email,
      })
      .then((res) => {
        toast.info(
          "Verification link resent on your email\nplease verify yourself",
          {
            toastId: "info2",
            position: "bottom-left",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          }
        );
      })
      .catch(() => {
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
      });
  }
  function saveUser(e) {
    e.preventDefault();
    var requestBody = {};
    if (bio.current.value) {
      requestBody = {
        email: email.current.value,
        password: password.current.value,
        firstName: first_name.current.value,
        lastName: last_name.current.value,
        bio: bio.current.value,
        dp:dpLink
      };
    } else {
      requestBody = {
        email: email.current.value,
        password: password.current.value,
        firstName: first_name.current.value,
        lastName: last_name.current.value,
        dp:dpLink
      };
    }

    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, requestBody)
      .then((res) => {
        setVerificationLink(
          <Link
            href="#"
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={(e) => resendVerificationLink(e, requestBody.email)}
          >
            Resend verification link
          </Link>
        );
        toast.success("User Created", {
          position: "bottom-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        toast.info("We have sent you an email\nplease verify yourself", {
          toastId: "info1",
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      })
      .catch((e) => {
        if (e.code == "ERR_BAD_REQUEST") {
          toast.warning("User with same E-mail id Exists", {
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
        className="rounded signup-form-inner-div p-4 m-4"
        onSubmit={(e) => {
          saveUser(e);
        }}
      >
        <p className="display-6">Signup</p>
        <CldUploadWidget
          uploadPreset="uelcogu7"
          onSuccess={(results) => {
            const url = getCldImageUrl({
              // width: 400,
              // height: 500,
              src: results.info.public_id,
            });
            setDpLink(url)
            // console.log("Public ID", url);
          }}
        >
          {({ open }) => {
            return (
              <img
                className="rounded-circle"
                src={dpLink}
                alt="dp image"
                style={{
                  width: "8rem",
                  height: "8rem",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                onClick={() => open()}
              />
            );
          }}
        </CldUploadWidget>
        <div className="mx-1 my-2">
          <label htmlFor="exampleFormControlInput1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="enter email"
            ref={email}
            required
          />
        </div>
        <div className="mx-1 my-2">
          <label htmlFor="inputPassword6" className="form-label">
            Password
          </label>
          <input
            type="text"
            id="inputPassword6"
            className="form-control"
            aria-describedby="passwordHelpInline"
            placeholder="enter password"
            ref={password}
            required
          />
        </div>
        <div className="input-group mb-3 mt-3 flex flex-row justify-content-center align-items-center">
          <span>
            <label htmlFor="firstname" className="form-label">
              First Name
            </label>
            <input
              id="firstname"
              type="text"
              className="form-control"
              placeholder="Enter First Name"
              aria-label="First Name"
              ref={first_name}
              required
            />
          </span>
          <span className="mx-2">
            <label htmlFor="lastname" className="form-label">
              Last Name
            </label>
            <input
              id="lastname"
              type="text"
              className="form-control"
              placeholder="Enter Last Name"
              aria-label="Last Name"
              ref={last_name}
              required
            />
          </span>
        </div>
        <div className="mx-1 my-2">
          <label htmlFor="floatingTextarea">Bio</label>
          <textarea
            className="form-control"
            placeholder="Enter Bio"
            id="floatingTextarea"
            ref={bio}
          ></textarea>
        </div>
        <button className="btn btn-success mt-2" style={{ width: "30%" }}>
          Signup
        </button>
        <a className="my-2 text-decoration-underline" href="/auth/login">
          I already have an account
        </a>
        {verificationLink}
      </form>
    </div>
  );
}
