"use client";

import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRouter } from "next/navigation";
import { useCheckAuthToken } from "@/app/_utils/checkToken";
import { toast } from "react-toastify";
import axios from "axios";

export default function Blog({ params }) {
  const router = useRouter();

  var [blog, setblog] = useState("No Content To Show");
  var [heading, setheading] = useState({});

  function getBlogFromId() {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/blog/get-blog/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((res) => {
        var d = new Date(res.data.blogupdated);
        let day = d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();
        setheading({
          heading: res.data.blogtitle,
          desc: res.data.blogdesc,
          category: res.data.blogcategory.category,
          author: `${res.data.author.firstName} ${res.data.author.lastName}`,
          date: day,
          authorId: res.data.author.id,
        });
        setblog(
          <Markdown remarkPlugins={[remarkGfm]} className="ReactMdBreakFix">
            {res.data.blogcontent}
          </Markdown>
        );
      })
      .catch((err) => {
        if (err.code == "ERR_BAD_REQUEST") {
          useCheckAuthToken();
          getBlogFromId();
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

  useEffect(() => {
    useCheckAuthToken();
    if (!localStorage.getItem("accessToken")) {
      toast.error("Session Expired🥶 Please Login Again", {
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
      router.push("/auth/login");
    }
    getBlogFromId();
  }, []);

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ width: "100%" }}
    >
      <div
        className="save mt-3 mb-1 d-flex flex-row justify-content-end flex-wrap "
        style={{ width: "85%" }}
      >
        <button
          className="btn btn-success mx-3"
          onClick={() => router.push("/editor")}
        >
          Back To Editor{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            fill="currentColor"
            className="bi bi-arrow-left-square-fill"
            viewBox="0 0 16 16"
          >
            <path d="M16 14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12zm-4.5-6.5H5.707l2.147-2.146a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708-.708L5.707 8.5H11.5a.5.5 0 0 0 0-1z" />
          </svg>
        </button>
      </div>

      <div
        className="rounded p-4 my-3"
        style={{ width: "85%", backgroundColor: "#242424" }}
      >
        <div>
          <p className="display-3">{heading.heading}</p>
          <h5 className="card-subtitle text-muted">
            {heading.author}
            <a href={`/author/${heading.authorId}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-link-45deg"
                viewBox="0 0 16 16"
              >
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
              </svg>
            </a>
          </h5>
          <p className="text-warning" style={{ fontSize: "small" }}>
            {heading.date}
          </p>
          <p style={{ fontSize: "medium" }}>Category: {heading.category}</p>
          <p className="h4">Summary</p>
          <div
            className="p-3 rounded border border-warning mb-4"
            style={{ width: "95%", backgroundColor: "#080b05" }}
          >
            {heading.desc}
          </div>
        </div>
        {blog}
      </div>
    </div>
  );
}
