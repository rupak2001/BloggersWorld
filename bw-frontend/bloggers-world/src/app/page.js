"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  var router = useRouter()
  useEffect(()=>router.replace("/auth/login"))
}
