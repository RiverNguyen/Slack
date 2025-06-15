import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { CopyIcon, RefreshCcw } from "lucide-react";
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
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This will generate a new code."
  );

  const { mutate, isPending } = useNewJoinCode();

  const handleNewCode = async () => {
    const ok = await confirm();
    if (!ok) return;
    mutate(
      { workspaceId },
      {
        onSuccess: () => toast.success("New code generated"),
        onError: () => toast.error("Failed to generate new code"),
      }
    );
  };

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}/${joinCode}`;

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
    <>
      <ConfirmDialog />
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
                value={joinCode.toLocaleUpperCase()}
                className="pointer-events-none"
              >
                <InputOTPGroup>
                  <InputOTPSlot
                    className="ring-offset-0 ring-0 border-black/30 font-semibold text-md"
                    index={0}
                  />
                  <InputOTPSlot
                    className="ring-offset-0 ring-0 border-black/30 font-semibold text-md"
                    index={1}
                  />
                  <InputOTPSlot
                    className="ring-offset-0 ring-0 border-black/30 font-semibold text-md"
                    index={2}
                  />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot
                    className="ring-offset-0 ring-0 border-black/30 font-semibold text-md"
                    index={3}
                  />
                  <InputOTPSlot
                    className="ring-offset-0 ring-0 border-black/30 font-semibold text-md"
                    index={4}
                  />
                  <InputOTPSlot
                    className="ring-offset-0 ring-0 border-black/30 font-semibold text-md"
                    index={5}
                  />
                </InputOTPGroup>
              </InputOTP>
              <Button variant={"ghost"} size={"sm"} onClick={handleCopy}>
                Copy link
                <CopyIcon className="size-4 ml-2" />
              </Button>
            </div>
            <div className="flex items-center justify-between w-full">
              <Button
                disabled={isPending}
                onClick={handleNewCode}
                variant={"outline"}
              >
                New code
                <RefreshCcw
                  className={cn(`size-4 ml-2`, isPending && "animate-spin")}
                />
              </Button>
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
