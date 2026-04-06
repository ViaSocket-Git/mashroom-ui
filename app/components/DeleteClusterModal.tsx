"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteClusterModalProps {
  open: boolean;
  clusterName: string;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteClusterModal({
  open,
  clusterName,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteClusterModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onCancel(); }}>
      <DialogContent className="max-w-sm" showCloseButton={false} style={{ fontFamily: "Geist, sans-serif" }}>
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: 16, color: "rgb(10,10,10)" }}>
            Delete cluster?
          </DialogTitle>
          <DialogDescription style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: "rgb(100,116,139)", lineHeight: 1.5 }}>
            <strong style={{ color: "rgb(10,10,10)", fontWeight: 600 }}>{clusterName}</strong> will be permanently deleted. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isDeleting} style={{ fontFamily: "Geist, sans-serif", fontWeight: 600, fontSize: 13 }}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isDeleting} style={{ fontFamily: "Geist, sans-serif", fontWeight: 600, fontSize: 13 }}>
            {isDeleting ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
