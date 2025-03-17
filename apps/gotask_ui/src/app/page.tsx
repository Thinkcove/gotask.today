"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/portal/task"); // Redirect after 2 seconds
    }, 2000);
  }, []);
}
