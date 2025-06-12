'use client';

import { useState } from 'react';
import { checkInSatsangi, checkOutSatsangi, createSatsangi, deleteSatsangi, updateSatsangi } from '@/app/dashboard/admin/satsangies/actions';
import toast, { Toaster } from 'react-hot-toast';
import SatsangiesImport from './SatsangiesImport';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, LogIn, LogOut, DoorClosed, Pencil, XCircleIcon, Trash2 } from "lucide-react"; // DoorClosed for unallocated
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Satsangi } from '@/app/datatypes/schema';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
const ADMIN_PASSWORD = "GolokDham1007";
export default function SatsangiesPage({
  satsangies,
  shivirs,
}: {
  satsangies: any[];
  shivirs: { id: string; occasion: string }[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterMode, setFilterMode] = useState<'all' | 'checkedIn' | 'checkedOut' | 'unallocated' | 'unregistered'>('all');
  const [editingSatsangi, setEditingSatsangi] = useState<Satsangi | null>(null);
  const [checkStatus, setCheckStatus] = useState(() => {
    if (editingSatsangi && editingSatsangi.checked_in) return "checkin";
    if (editingSatsangi && editingSatsangi.checked_out) return "checkout";
    return "clear";
  });
  const [password, setPassword] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
  const handleConfirmDelete = async () => {
    if (password !== ADMIN_PASSWORD) {
      toast.error("Incorrect password");
      return;
    }

    setShowPasswordDialog(false);
    setPassword('');

    try {
      if (!selectedDeleteId) return;
      await deleteSatsangi(selectedDeleteId.toString());
      toast.success("Satsangi deleted successfully.");
      window.location.reload();
    } catch (err) {
      toast.error("Failed to delete satsangi.");
    }
  };
  const handleEditClick = (satsangi: Satsangi) => {
    setEditingSatsangi({
      ...satsangi,
      checked_in: !!satsangi.checked_in && !satsangi.checked_out,
      checked_out: !!satsangi.checked_out,
    });
    setCheckStatus(() => {
      if (satsangi.checked_in && !satsangi.checked_out) return "checkin";
      if (satsangi.checked_out) return "checkout";
      return "clear";
    });
  };

  function handleSort(field: string) {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }


  let filtered = satsangies.filter((s) => {
    const searchTerm = search.toLowerCase();
    return (
      (s.name && s.name.toLowerCase().includes(searchTerm)) ||
      (s.city && s.city.toLowerCase().includes(searchTerm)) ||
      (s.gender && s.gender.toLowerCase().includes(searchTerm)) ||
      (s.room_no !== null && s.room_no !== undefined && s.room_no.toString().toLowerCase().includes(searchTerm)) ||
      (s.age !== null && s.age !== undefined && s.age.toString().includes(searchTerm)) ||
      (s.payment_id !== null && s.payment_id !== undefined && s.payment_id.toString().includes(searchTerm))
    );
  });

  filtered = filtered.filter((s) => {
    if (filterMode === 'checkedIn') return s.checked_in && !s.checked_out;
    if (filterMode === 'checkedOut') return s.checked_out;
    if (filterMode === 'unallocated') return !s.room_no;
    if (filterMode === 'unregistered') return s.payment_id == 99999; // Assuming 99999 is the unregistered payment ID
    return true; // 'all'
  });




  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField];
    const valB = b[sortField];

    if (valA === null || valA === undefined) return 1;
    if (valB === null || valB === undefined) return -1;

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    }

    return sortDirection === 'asc'
      ? valA.toString().localeCompare(valB.toString())
      : valB.toString().localeCompare(valA.toString());
  });


  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const paginated = sorted.slice(startIdx, startIdx + rowsPerPage);

  return (
    <div className="space-y-6">
      <Toaster />
      <div className="bg-white border rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-2">Satsangi List</h2>

        {/* Scrollable Table */}
        <div className="overflow-auto max-h-[400px]">
          <Table>
            <TableHeader className="bg-gray-800">
              <TableRow>
                <TableHead className="text-white text-center">#</TableHead>
                <TableHead onClick={() => handleSort("name")} className="text-white cursor-pointer">
                  Name {sortField === "name" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
                </TableHead>
                <TableHead onClick={() => handleSort("age")} className="text-white cursor-pointer">
                  Age {sortField === "age" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
                </TableHead>
                <TableHead onClick={() => handleSort("city")} className="text-white cursor-pointer">
                  City {sortField === "city" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
                </TableHead>
                <TableHead onClick={() => handleSort("gender")} className="text-white cursor-pointer">
                  Gender {sortField === "gender" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
                </TableHead>
                <TableHead onClick={() => handleSort("room_no")} className="text-white cursor-pointer">
                  Room No. {sortField === "room_no" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
                </TableHead>
                <TableHead onClick={() => handleSort("payment_id")} className="text-white cursor-pointer">
                  Payment ID {sortField === "payment_id" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
                </TableHead>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginated.map((s, index) => (
                <TableRow key={s.satsangi_id}>
                  <TableCell className="text-center">{startIdx + index + 1}</TableCell>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.age}</TableCell>
                  <TableCell>{s.city}</TableCell>
                  <TableCell>{s.gender}</TableCell>
                  <TableCell>{s.room_no}</TableCell>
                  <TableCell>{s.payment_id ?? '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-4">
                      {!s.checked_in && !s.checked_out && (
                        <button
                          onClick={async () => {
                            await checkInSatsangi(s.satsangi_id);
                            toast.success("Checked In");
                          }}
                          className="text-indigo-600 hover:text-indigo-800"
                          title='Check In'
                        >
                          <LogIn className="w-4 h-4" />
                        </button>
                      )}
                      {s.checked_in && !s.checked_out && (
                        <button
                          onClick={async () => {
                            await checkOutSatsangi(s.satsangi_id);
                            toast.success("Checked Out");
                          }}
                          className="text-amber-600 hover:text-amber-800"
                          title='Check Out'
                        >
                          <LogOut className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => handleEditClick(s)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedDeleteId(s.satsangi_id);
                          setShowPasswordDialog(true);
                        }}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>



                  </TableCell>



                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>


        {/* Search + Pagination Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-2">
          {/* Search */}
          <Input
            type="text"
            placeholder="Search here..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-64"
          />

          {/* Rows per page */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Rows per page:</label>
            <Select
              value={rowsPerPage.toString()}
              onValueChange={(value) => {
                setRowsPerPage(parseInt(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Rows per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="150">150</SelectItem>
                <SelectItem value="300">300</SelectItem>
                <SelectItem value="500">500</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 border rounded"
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span className="font-medium">{currentPage} / {totalPages || 1}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1 border rounded"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>


      {/* Summary Section (after table, before buttons) */}
      <div className="bg-gray-100 rounded-lg p-4 mt-4 shadow flex flex-wrap gap-6 justify-between text-sm md:text-base">
        <span className="font-semibold  capitalize flex items-center gap-2">
          {filterMode === "all" && (
            <>
              <Users className="w-5 h-5 text-rose-950" />
              <span className="text-rose-950 font-bold">
                All
              </span>
            </>
          )}
          {filterMode === "checkedIn" && (
            <>
              <LogIn className="w-5 h-5 text-indigo-950" />
              <span className="text-indigo-950 font-bold">
                Checked In
              </span>
            </>
          )}
          {filterMode === "checkedOut" && (
            <>
              <LogOut className="w-5 h-5 text-fuchsia-950" />
              <span className="text-fuchsia-950 font-bold">
                Checked Out
              </span>
            </>
          )}
          {filterMode === "unallocated" && (
            <>
              <DoorClosed className="w-5 h-5 text-pink-950" />
              <span className="text-pink-950 font-bold">
                UnAllocated
              </span>
            </>
          )}
          {filterMode === "unregistered" && (
            <>
              <XCircleIcon className="w-5 h-5 text-red-950" />
               <span className="text-red-950 font-bold">
                Unregistered
               </span>
              
            </>
          )}
        </span>
        {/* Show All */}
        <div
          className="flex items-center gap-1 cursor-pointer"
          title="Show All"
          onClick={() => setFilterMode('all')}
        >
          <Users className={`w-6 h-6 ${filterMode === 'all' ? "text-rose-950" : "text-rose-700"}`} />
        </div>

        {/* Checked In */}
        <div
          className="flex items-center gap-1 cursor-pointer"
          title="Checked In"
          onClick={() => setFilterMode('checkedIn')}
        >
          <LogIn className={`w-6 h-6 ${filterMode === 'checkedIn' ? "text-indigo-950" : "text-indigo-800"}`} />
        </div>

        {/* Checked Out */}
        <div
          className="flex items-center gap-1 cursor-pointer"
          title="Checked Out"
          onClick={() => setFilterMode('checkedOut')}
        >
          <LogOut className={`w-6 h-6 ${filterMode === 'checkedOut' ? "text-fuchsia-950" : "text-fuchsia-800"}`} />
        </div>

        {/* Unallocated */}
        <div
          className="flex items-center gap-1 cursor-pointer"
          title="Unallocated (No Room)"
          onClick={() => setFilterMode('unallocated')}
        >
          <DoorClosed className={`w-6 h-6 ${filterMode === 'unallocated' ? "text-pink-950" : "text-pink-800"}`} />
        </div>

        {/* UnRegistered  */}
        <div
          className="flex items-center gap-1 cursor-pointer"
          title="Not Registered (payment_id is 99999)"
          onClick={() => setFilterMode('unregistered')}
        >
          <XCircleIcon className={`w-6 h-6 ${filterMode === 'unregistered' ? "text-red-950" : "text-red-800"}`} />
        </div>



      </div>



      <div className="flex flex-wrap gap-4">
        <Button variant="default" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Hide Form" : "Add Satsangi"}
        </Button>

        <Button variant="secondary" onClick={() => setShowImport(!showImport)}>
          {showImport ? "Hide Import" : "Import CSV"}
        </Button>
      </div>

      {showForm && (
        <form
          action={async (formData) => {
            await createSatsangi(formData);
            toast.success("Satsangi added!");
            setShowForm(false);
          }}
          className="bg-white border mt-4 p-6 rounded-lg shadow space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input name="name" required placeholder="Name" />
            <Input name="age" required type="number" placeholder="Age" />
            <Input name="city" required placeholder="City" />
            <Input name="state" placeholder="State" />
            <Input name="birthdate" type="date" placeholder='Birth Date' />
            <Input name="panno" placeholder="PAN No." />
            <Input name="address" placeholder="Address" />
            <Input name="mobile" placeholder="Mobile" />
            <Input name="email" type="email" placeholder="Email" />

            {/* Gender Select */}
            <div>
              <Label htmlFor="gender" className="mb-1 block">Gender</Label>
              <Select name="gender" required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Shivir Select */}
            <div>
              <Label htmlFor="shivir_id" className="mb-1 block">Shivir</Label>
              <Select name="shivir_id">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Shivir" />
                </SelectTrigger>
                <SelectContent>
                  {shivirs.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.occasion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Input name="payment_id" type="number" placeholder="Payment ID" />
          </div>

          <div>
            <Button type="submit" className="w-full md:w-auto">Save</Button>
          </div>
        </form>
      )}

      {showImport && (
        <div className="mt-4">
          <SatsangiesImport shivirs={shivirs} />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>Please enter the admin password to delete this satsangi.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} disabled={!password}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingSatsangi} onOpenChange={() => setEditingSatsangi(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Satsangi : {editingSatsangi?.name}</DialogTitle>
          </DialogHeader>
          {editingSatsangi && (
            <form
              action={async (formData) => {
                try {
                  formData.append('id', editingSatsangi.satsangi_id);
                  await updateSatsangi(formData);
                  toast.success("Satsangi updated successfully!");
                  setEditingSatsangi(null);
                  // You might want to add a refresh here or use optimistic updates
                } catch (error) {
                  toast.error("Failed to update satsangi");
                }
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="payment_id">Payment ID</Label>
                  <Input
                    name="payment_id"
                    type="number"
                    defaultValue={editingSatsangi.payment_id || ''}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    name="age"
                    type="number"
                    required
                    defaultValue={editingSatsangi.age}

                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    name="city"
                    required
                    defaultValue={editingSatsangi.city}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select name="gender" defaultValue={editingSatsangi.gender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Status</Label>
                  <div className="flex flex-col space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="check_status"
                        value="checkin"
                        checked={checkStatus === "checkin"}
                        onChange={() => setCheckStatus("checkin")}
                      />
                      <span>Checked In</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="check_status"
                        value="checkout"
                        checked={checkStatus === "checkout"}
                        onChange={() => setCheckStatus("checkout")}
                      />
                      <span>Checked Out</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="check_status"
                        value="clear"
                        checked={checkStatus === "clear"}
                        onChange={() => setCheckStatus("clear")}
                      />
                      <span>Clear Check In / Check Out</span>
                    </label>
                  </div>
                </div>

              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingSatsangi(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}