"use client";

import { ChangeEvent, useActionState, useState } from "react";
import { Button } from "@/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Trash2 } from "lucide-react";
import { deleteAccount } from "../lib/database";
import ErrorMessage from "@/components/ErrorMessage";

export default function DeleteAccountButton() {
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [error, action, isPending] = useActionState(async () => {
    if (confirmation !== "delete account")
      return "Please type 'delete account' to confirm account deletion";

    const { error } = await deleteAccount();
    if (!error) {
      setOpen(false);
      setConfirmation("");
    }
    return error;
  }, "");

  return (
    <>
      <Button
        variant="destructive"
        className="w-full flex items-center justify-center gap-2"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="w-4 h-4" />
        Delete Account
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Confirm Account Deletion
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-2">
              This action is permanent and cannot be undone. Please type{" "}
              <span className="font-semibold">delete account</span> below to
              confirm. <br />
              Note that all of your personal data will be deleted. You will be
              redirected to homepage if deletion is successful.
            </DialogDescription>
          </DialogHeader>

          <form action={action}>
            <Input
              value={confirmation}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setConfirmation(e.target.value)
              }
              placeholder="delete account"
              className="my-4"
            />

            {/* Error message */}
            {error && <ErrorMessage error={error} />}

            <DialogFooter className="flex justify-end gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={confirmation !== "delete account" || isPending}
              >
                {isPending ? "Deleting..." : "Confirm Delete"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
