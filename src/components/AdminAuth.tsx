"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";

export default function AdminAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/auth")
      .then((r) => {
        if (!r.ok) throw new Error("Not authenticated");
        return r.json();
      })
      .then((d) => {
        if (d.authenticated) {
          setChecking(false);
        } else {
          router.replace("/admin");
        }
      })
      .catch(() => {
        router.replace("/admin");
      });
  }, [router]);

  if (checking) {
    return <LoadingScreen label="Checking access" />;
  }

  return <>{children}</>;
}
