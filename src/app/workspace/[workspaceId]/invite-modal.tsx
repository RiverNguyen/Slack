import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}

export const InviteModal = ({
  open,
  setOpen,
  joinCode,
  name,
}: InviteModalProps) => {
  const workspaceId = useWorkspaceId();

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;

    navigator.clipboard.writeText(inviteLink).then(
      () => {
        setOpen(false);
        toast.success("Invite link copied to clipboard");
      },
      () => {
        toast.error("Failed to copy");
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite people to {name}</DialogTitle>
          <DialogDescription>
            Use the code below to invite people to your workspace.
          </DialogDescription>
          <div className="flex flex-col gap-y-4 items-center justify-center py-4">
            <InputOTP
              maxLength={6}
              value={joinCode}
              className="pointer-events-none"
            >
              <InputOTPGroup>
                <InputOTPSlot
                  className="ring-offset-0 ring-0 border-black/30"
                  index={0}
                />
                <InputOTPSlot
                  className="ring-offset-0 ring-0 border-black/30"
                  index={1}
                />
                <InputOTPSlot
                  className="ring-offset-0 ring-0 border-black/30"
                  index={2}
                />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot
                  className="ring-offset-0 ring-0 border-black/30"
                  index={3}
                />
                <InputOTPSlot
                  className="ring-offset-0 ring-0 border-black/30"
                  index={4}
                />
                <InputOTPSlot
                  className="ring-offset-0 ring-0 border-black/30"
                  index={5}
                />
              </InputOTPGroup>
            </InputOTP>
            <Button variant={"ghost"} size={"sm"} onClick={handleCopy}>
              Copy link
              <CopyIcon className="size-4 ml-2" />
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
