import React from "react";
import "@/app/_css/feedCard.css";
import Link from "next/link";

export default function FeedCard({
  title,
  desc,
  author,
  date,
  category,
  timetoread,
  id,
  tags,
}) {
  return (
    <Link href={"/blog/[id]"} as={`/blog/${id}`} type="push">
      <div className="card p-3 my-3 feedcard-main">
        <h3 className="card-header">{title}</h3>
        <div className="card-body">
          <h6 className="">Author: {author}</h6>
          <p className="text-warning" style={{ fontSize: "small" }}>
            {date}
          </p>
          <p>{category}</p>
          <p className="card-text">
            {desc}
          </p>
        </div>
        <div style={{ width: "100%" }}>
          {tags.map((ele) => {
            return <span className="badge bg-success mx-2 my-2">{ele}</span>;
          })}
        </div>
        <div className="card-body"></div>
        <div className="card-footer text-muted">
          <p>{timetoread} read</p>
        </div>
      </div>
    </Link>
  );
}
