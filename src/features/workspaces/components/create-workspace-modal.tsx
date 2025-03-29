"use client";

import { Input } from "@/components/ui/input";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const CreateWorkspaceModal = () => {
  const router = useRouter();
  const [open, setOpen] = useCreateWorkspaceModal();
  const [name, setName] = useState("");

  const { mutate } = useCreateWorkspace();

  const handleClose = () => {
    setOpen(false);
    setName("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      { name },
      {
        onSuccess(data) {
          toast.success("Workspace created successfully");
          router.push(`/workspace/${data}`);
          handleClose();
        },
      }
    );
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new workspace</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={false}
              required
              autoFocus
              minLength={3}
              placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
            />
            <div className="flex justify-end">
              <Button disabled={false}>Create</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
