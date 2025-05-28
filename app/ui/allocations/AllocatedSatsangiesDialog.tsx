'use client';

import { useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { unassignSatsangi } from "@/app/dashboard/admin/satsangies/actions";
import { useState, startTransition } from "react";


interface UnassignButtonProps {
  roomId: string;
  satsangiId: string;
  onSuccess: () => void;
}
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

export default function AllocatedSatsangiesDialog({
  open,
  onOpenChange,
  satsangies,
  roomId,
  onSuccess
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  satsangies: { id: string; name: string }[];
  roomId: string;
  onSuccess: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const handleUnassign = (satsangiId: string) => {
    if (!window.confirm("Are you sure you want to unassign this satsangi?")) {
      return;
    }
    startTransition(async () => {
      await unassignSatsangi(roomId, satsangiId);
      onSuccess();
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Allocated Satsangies</DialogTitle>
          </DialogHeader>

          <div className="overflow-auto max-h-[400px] rounded-md border">
            <Table>
              <TableHeader className="bg-gray-800">
                <TableRow>
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {satsangies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500">
                      No satsangies allocated
                    </TableCell>
                  </TableRow>
                ) : (
                  satsangies.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.name}</TableCell>

                      <TableCell>

                        <button
                          onClick={() => handleUnassign(s.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>


                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    
    </>
  );
}
