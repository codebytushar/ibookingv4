'use client';
import { useState, useEffect, useTransition } from 'react';
import { Button } from "@/components/ui/button";
import { RoomAllocation } from '@/app/datatypes/custom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserPlus, Users, Ban, CheckCircle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Satsangi } from '@/app/datatypes/schema';
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { getAllocatedSatsangies } from '@/app/dashboard/admin/satsangies/data';
import { getUnassignedSatsangies } from '@/app/dashboard/admin/allocations/data';
import { assignbulk } from '@/app/dashboard/admin/allocations/actions';
import { unassignSatsangi } from "@/app/dashboard/admin/satsangies/actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

export default function RoomAllocationsPage({ rooms }: { rooms: RoomAllocation[] }) {
  const [selectedRoom, setSelectedRoom] = useState<RoomAllocation | null>(null);
  const [satsangies, setSatsangies] = useState<Satsangi[]>([]);
  const [filteredSatsangies, setFilteredSatsangies] = useState<Satsangi[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSatsangies, setSelectedSatsangies] = useState<Satsangi[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const { toast } = useToast();
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showAllocatedDialog, setShowAllocatedDialog] = useState(false);
  const [allocatedSatsangies, setAllocatedSatsangies] = useState<{ id: string; name: string }[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (selectedRoom) {
      fetchUnassignedSatsangies();
    }
  }, [selectedRoom]);

  const fetchUnassignedSatsangies = async () => {
    setIsLoading(true);
    try {
      const data = await getUnassignedSatsangies();
      if (!data) {
        throw new Error('Failed to fetch unassigned satsangies');
      }
      setSatsangies(data);
      setFilteredSatsangies(data.filter((s: { id: string; }) => !selectedSatsangies.some(selected => selected.id === s.id)));
    } catch (error) {
      console.error('Error fetching satsangies:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load unassigned satsangies. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const filtered = satsangies.filter(satsangi =>
      !selectedSatsangies.some(selected => selected.id === satsangi.id) &&
      (satsangi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        satsangi.city.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredSatsangies(filtered);
  }, [searchTerm, satsangies, selectedSatsangies]);

  const handleCloseDialog = () => {
    setShowAssignDialog(false);
  };

  const handleSatsangiSelect = (satsangi: Satsangi) => {
    if (!selectedRoom) return;

    const maxCapacity = selectedRoom.base_capacity + selectedRoom.extra_capacity;
    const currentAllocation = selectedRoom.total_allocated + selectedSatsangies.length;

    if (currentAllocation < maxCapacity) {
      setSelectedSatsangies([...selectedSatsangies, satsangi]);
      setSearchTerm('');
      setFilteredSatsangies(filteredSatsangies.filter(s => s.id !== satsangi.id));
    } else {
      toast({
        variant: "destructive",
        title: "Room Full",
        description: "Cannot add more satsangies. Room capacity reached.",
      });
    }
  };

  const removeSatsangi = (id: string) => {
    const removed = selectedSatsangies.find(s => s.id === id);
    setSelectedSatsangies(selectedSatsangies.filter(s => s.id !== id));
    if (removed && satsangies.some(s => s.id === id)) {
      setFilteredSatsangies([...filteredSatsangies, removed]);
    }
  };

  const handleAssign = async () => {
    if (!selectedRoom || selectedSatsangies.length === 0) return;
    setIsAssigning(true);
    try {
      const response = await assignbulk(
        selectedRoom.id,
        selectedSatsangies.map(s => s.id)
      );
      if (!response || !response.success) {
        throw new Error(response.error || 'Failed to assign satsangies');
      }
      toast({
        title: "Success",
        description: `Successfully assigned ${selectedSatsangies.length} satsangi${selectedSatsangies.length !== 1 ? 's' : ''} to Room #${selectedRoom.room_no}`,
      });
      setSelectedSatsangies([]);
      setSearchTerm('');
      setShowAssignDialog(false);
    } catch (error) {
      console.error('Error assigning satsangies:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign satsangies. Please try again.",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUnassign = (satsangiId: string) => {
    if (!window.confirm("Are you sure you want to unassign this satsangi?")) {
      return;
    }
    startTransition(async () => {
      try {
        await unassignSatsangi(selectedRoom!.id, satsangiId);
        const updated = await getAllocatedSatsangies(selectedRoom!.id);
        setAllocatedSatsangies(updated);
        toast({
          title: "Success",
          description: "Satsangi unassigned successfully.",
        });
      } catch (error) {
        console.error('Error unassigning satsangi:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to unassign satsangi. Please try again.",
        });
      }
    });
  };

  const getAvailableSlots = () => {
    if (!selectedRoom) return 0;
    const maxCapacity = selectedRoom.base_capacity + selectedRoom.extra_capacity;
    return maxCapacity - selectedRoom.total_allocated - selectedSatsangies.length;
  };

  return (
    <div className="space-y-2 p-6 bg-gray-100 rounded-lg shadow">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {rooms.map((room) => {
          const maxCapacity = room.base_capacity + room.extra_capacity;
          const isFull = room.total_allocated >= maxCapacity;
          const available = maxCapacity - room.total_allocated;

          return (
            <div
              key={room.id}
              className={`border rounded-xl p-4 shadow flex flex-col justify-between space-y-4 ${
                available === 0
                  ? 'bg-amber-200'
                  : available === 1
                  ? 'bg-amber-100'
                  : available === 2
                  ? 'bg-gray-200'
                  : available === 3
                  ? 'bg-gray-100'
                  : 'bg-indigo-200'
              }`}
            >
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h3 className="text-lg font-semibold cursor-help">
                        Room #{room.room_no} ({room.total_allocated}/{maxCapacity})
                      </h3>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{room.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div>
                <div className="flex gap-2 items-center justify-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`flex items-center gap-1 ${
                            (room.checked_in_count ?? 0) >= room.base_capacity + room.extra_capacity
                              ? 'text-red-600'
                              : 'text-green-700'
                          }`}
                        >
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-semibold">{room.checked_in_count}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{room.checked_in_count} satsangies checked in</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={async () => {
                            setSelectedRoom(room);
                            const data = await getAllocatedSatsangies(room.id);
                            setAllocatedSatsangies(data);
                            setShowAllocatedDialog(true);
                          }}
                        >
                          <Users className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View Allocated</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          disabled={isFull}
                          onClick={() => {
                            setSelectedRoom(room);
                            setShowAssignDialog(true);
                          }}
                        >
                          {isFull ? <Ban className="w-4 h-4 text-red-600" /> : <UserPlus className="w-4 h-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isFull ? "Room Full" : "Assign Satsangi"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={showAssignDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              Assign Satsangies to Room #{selectedRoom?.room_no}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Capacity: {selectedRoom?.total_allocated}/{selectedRoom ? selectedRoom.base_capacity + selectedRoom.extra_capacity : 0}
                {selectedSatsangies.length > 0 && ` (Adding ${selectedSatsangies.length})`}
              </p>

              {selectedSatsangies.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {selectedSatsangies.map((satsangi) => (
                    <Badge
                      key={satsangi.id}
                      variant="outline"
                      className="flex items-center gap-1 py-1"
                    >
                      {satsangi.name}
                      <button
                        onClick={() => removeSatsangi(satsangi.id)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="relative">
                <Input
                  placeholder={
                    getAvailableSlots() > 0
                      ? "Search satsangi by name or city..."
                      : "Room capacity reached"
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                  disabled={getAvailableSlots() <= 0 || isAssigning}
                />
                {isLoading && (
                  <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading satsangies...
                  </p>
                )}
                {!isLoading && searchTerm && getAvailableSlots() > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredSatsangies.length === 0 ? (
                      <div className="p-2 text-sm text-gray-500">No matching satsangies found</div>
                    ) : (
                      filteredSatsangies.map((satsangi) => (
                        <div
                          key={satsangi.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSatsangiSelect(satsangi)}
                        >
                          <div className="font-medium">{satsangi.name}</div>
                          <div className="text-sm text-gray-600">
                            {satsangi.city} • Age: {satsangi.age || 'N/A'}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-600">
                {getAvailableSlots()} slot(s) remaining
              </p>
              <Button
                onClick={handleAssign}
                disabled={selectedSatsangies.length === 0 || isAssigning}
              >
                {isAssigning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  `Assign ${selectedSatsangies.length} Satsangi${selectedSatsangies.length !== 1 ? 's' : ''}`
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAllocatedDialog} onOpenChange={setShowAllocatedDialog}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Allocated Satsangies for Room #{selectedRoom?.room_no}</DialogTitle>
          </DialogHeader>

          <div className="overflow-auto max-h-[400px] rounded-md border">
            <Table>
              <TableHeader className="bg-gray-800">
                <TableRow>
                  <TableHead className="text-white">Sr. No</TableHead>
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allocatedSatsangies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-gray-500">
                      No satsangies allocated
                    </TableCell>
                  </TableRow>
                ) : (
                  allocatedSatsangies.map((s,index) => (
                    <TableRow key={s.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{s.name}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleUnassign(s.id)}
                          disabled={isPending}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}