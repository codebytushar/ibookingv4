'use client';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { RoomAllocation } from '@/app/datatypes/custom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Users, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Satsangi } from '@/app/datatypes/schema';
import { useToast } from "@/hooks/use-toast";
import { getAllocatedSatsangies } from '@/app/dashboard/volunteer/satsangies/data';
import { getUnassignedSatsangies } from '@/app/dashboard/volunteer/allocations/data';
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
  const { toast } = useToast();
  const [showAllocatedDialog, setShowAllocatedDialog] = useState(false);
  const [allocatedSatsangies, setAllocatedSatsangies] = useState<{ id: string; name: string }[]>([]);
  // Inside the component:
  const [showRoomStatsDialog, setShowRoomStatsDialog] = useState(false);


  const roomStats = rooms.map((room) => {
    const allocated = room.total_allocated
    const total = room.base_capacity + room.extra_capacity;
    return {
      roomNo: room.room_no,
      base: room.base_capacity,
      extra: room.extra_capacity,
      total,
      allocated,
      available: total - allocated,
    };
  });
  const sortedRoomStats = [...roomStats].sort((a, b) => b.available - a.available);


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


  return (
    <div className="space-y-2 p-6 bg-gray-100 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Room Allocations</h2>
        <Button onClick={() => setShowRoomStatsDialog(true)}>
          View Room Stats
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {rooms.map((room) => {
          const maxCapacity = room.base_capacity + room.extra_capacity;
          const isFull = room.total_allocated >= maxCapacity;
          const available = maxCapacity - room.total_allocated;

          return (
            <div
              key={room.id}
              className={`border rounded-xl p-4 shadow flex flex-col justify-between space-y-4 ${available === 0
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
                          className={`flex items-center gap-1 ${(room.checked_in_count ?? 0) >= room.base_capacity + room.extra_capacity
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


                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={showRoomStatsDialog} onOpenChange={setShowRoomStatsDialog}>
        <DialogContent className="sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>Room Statistics</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto max-h-[500px]">
            <Table>
              <TableHeader className="bg-gray-800">
                <TableRow>
                  <TableHead className="text-white">Room No</TableHead>
                  <TableHead className="text-white">Base Capacity</TableHead>
                  <TableHead className="text-white">Extra Capacity</TableHead>
                  <TableHead className="text-white">Total Capacity</TableHead>
                  <TableHead className="text-white">Allocated</TableHead>
                  <TableHead className="text-white">Available</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRoomStats.map((room, index) => (
                  <TableRow key={index}>
                    <TableCell>{room.roomNo}</TableCell>
                    <TableCell>{room.base}</TableCell>
                    <TableCell>{room.extra}</TableCell>
                    <TableCell>{room.total}</TableCell>
                    <TableCell>{room.allocated}</TableCell>
                    <TableCell>{room.available}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

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
                  allocatedSatsangies.map((s, index) => (
                    <TableRow key={s.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{s.name}</TableCell>

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