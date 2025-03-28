"use client";

import { UserButton } from "@/features/auth/components/user-button";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useEffect, useMemo } from "react";

const Home = () => {
  const { data, isLoading } = useGetWorkspaces();
  const workspacesId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) return;

    if (workspacesId) {
      console.log("Redirecting to workspace");
    } else {
      console.log("Opening workspace creation modal");
    }
  }, [workspacesId, isLoading]);

  return (
    <div>
      <UserButton />
    </div>
  );
};

export default Home;
