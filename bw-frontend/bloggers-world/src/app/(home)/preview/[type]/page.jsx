"use client";

import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRouter } from "next/navigation";

export default function Preview({params}) {
  const router = useRouter();

  var [blog, setblog] = useState("No Content To Show");
  var [heading, setheading] = useState({});
  var type = -1

  useEffect(() => {
    type = (params.type == 1)?"blog":"blogEdit"
    console.log(type)
    var data = JSON.parse(sessionStorage.getItem(type));
    setheading({
      heading: data.title,
      desc: data.desc,
      category: data.category,
      timeToRead: (data.timetoread != " read")?data.timeToRead:"",
    });
    setblog(
      <Markdown remarkPlugins={[remarkGfm]} className="ReactMdBreakFix">
        {(data.content != "")?data.content:"No Blog To Preview"}
      </Markdown>
    );
  }, []);

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ width: "100%", marginTop: "4rem" }}
    >
      <div
        className="save mt-3 mb-1 d-flex flex-row justify-content-end flex-wrap "
        style={{ width: "85%" }}
      >
        <button
          className="btn btn-success mx-3"
          onClick={() => (params.type == 1)?router.push("/editor"):router.push("/edit-blog")}
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
        style={{ width: "85%",overflowX:"auto", backgroundColor: "#242424" }}
      >
        <div>
          <p className="display-3">{heading.heading}</p>
          <p>Category: {heading.category}</p>
          <p>{heading.timeToRead}</p>
          <p className="h4 mt-4">Summary</p>
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
