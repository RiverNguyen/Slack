"use client";

import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

const WorkspaceIdPage = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace({ id: workspaceId });

  return (
    <div>
      <h1>Workspace ID Page</h1>
      {data ? (
        <div>
          <h2>Workspace Details</h2>
          <p>Name: {data.name}</p>
          <p>Join Code: {data.joinCode}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default WorkspaceIdPage;
