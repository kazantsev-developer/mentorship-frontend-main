"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/ui/loader";

export default function DashboardPage() {
  const { user, getSelectedRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    const role = getSelectedRole();
    if (role === "student") {
      router.replace("/student/roadmap");
    } else if (role === "buddy") {
      router.replace("/buddy/students");
    } else {
      router.replace("/role-select");
    }
  }, [user, router]);

  return <Loader />;
}
