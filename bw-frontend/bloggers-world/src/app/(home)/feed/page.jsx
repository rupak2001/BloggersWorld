"use client";

import FeedCard from "@/app/_components/feedCard";
import axios from "axios";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useCheckAuthToken } from "@/app/_utils/checkToken";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";
import SearchBar from "@/app/_components/searchBar";

export default function Feed() {
  var router = useRouter();
  var [blogs, blogup] = useState([]);
  var [hasMore, hasMoreUp] = useState(true);
  var page = useRef(0);
  var currId = useRef(-1);
  var currType = useRef(0);
  var currTag = useRef("");

  useEffect(() => {
    getBlogs(0, -1);
  }, []);

  function getBlogs(type = 0, id = -1) {
    var flag = false;
    if (type != currType.current) {
      currType.current = type;
      page.current = 0;
      flag = true;
    }
    if (id != currId.current) {
      currId.current = id;
      page.current = 0;
      flag = true;
    }
    if (id != currTag.current) {
      currTag.current = id;
      page.current = 0;
      flag = true;
    }

    var uris = [
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/blog/feed/${page.current}`,
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/blog/by-author?authorId=${currId.current}&page=${page.current}`,
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/blog/by-category?categoryId=${currId.current}&page=${page.current}`,
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/blog/get-blogs-from-tags?tagname=${currTag.current}&page=${page.current}`,
    ];

    axios
      .get(uris[currType.current], {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        if (res.data.length == 0) hasMoreUp(false);
        else {
          if (flag) blogup(res.data);
          else blogup(blogs.concat(res.data));
        }
      })
      .then(() => {
        page.current += 1;
      })
      .catch((err) => {
        if (err.code == "ERR_BAD_REQUEST") {
          useCheckAuthToken()
          getBlogs(0, -1)
        } else {
          toast.error("Error! Please Try Again", {
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
  }

  return (
    <div
      className="container-fluid"
      style={{ width: "100%", marginTop: "5rem" }}
    >
      <SearchBar getdata={getBlogs} />
      <button
        type="button"
        className="btn btn-warning rounded-pill pb-2"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        style={{ position: "fixed", right: 21, zIndex: 10 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="21"
          fill="black"
          className="bi bi-binoculars-fill"
          viewBox="0 0 16 16"
        >
          <path d="M4.5 1A1.5 1.5 0 0 0 3 2.5V3h4v-.5A1.5 1.5 0 0 0 5.5 1h-1zM7 4v1h2V4h4v.882a.5.5 0 0 0 .276.447l.895.447A1.5 1.5 0 0 1 15 7.118V13H9v-1.5a.5.5 0 0 1 .146-.354l.854-.853V9.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v.793l.854.853A.5.5 0 0 1 7 11.5V13H1V7.118a1.5 1.5 0 0 1 .83-1.342l.894-.447A.5.5 0 0 0 3 4.882V4h4zM1 14v.5A1.5 1.5 0 0 0 2.5 16h3A1.5 1.5 0 0 0 7 14.5V14H1zm8 0v.5a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5V14H9zm4-11H9v-.5A1.5 1.5 0 0 1 10.5 1h1A1.5 1.5 0 0 1 13 2.5V3z" />
        </svg>
      </button>
      <div
        id="feedContainer"
        className="d-flex flex-column justify-content-start align-items-center"
        style={{
          width: "100%",
        }}
      >
        <InfiniteScroll
          dataLength={blogs.length} //This is important field to render the next data
          next={() => getBlogs(currType.current, currId.current)}
          hasMore={hasMore}
          loader={
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ width: "100%" }}
            >
              <div className="spinner-grow text-success my-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          }
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Thats All For Now !!</b>
            </p>
          }
        >
          {blogs.map((ele) => {
            var d = new Date(ele.blogupdated);
            let day = d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();
            return (
              <FeedCard
                author={ele.author.firstName + " " + ele.author.lastName}
                key={Math.random()}
                id={ele.id}
                title={ele.blogtitle}
                desc={ele.blogdesc}
                date={day}
                category={ele.blogcategory.category}
                timetoread={ele.timetoread}
                tags={ele.tags}
              />
            );
          })}
        </InfiniteScroll>
      </div>
    </div>
  );
}
