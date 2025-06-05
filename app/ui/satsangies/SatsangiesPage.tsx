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
import { Users, LogIn, LogOut, DoorClosed, Pencil } from "lucide-react"; // DoorClosed for unallocated
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [filterMode, setFilterMode] = useState<'all' | 'checkedIn' | 'checkedOut' | 'unallocated'>('all');
  const [editingSatsangi, setEditingSatsangi] = useState<Satsangi | null>(null);

  const handleEditClick = (satsangi: Satsangi) => {
    setEditingSatsangi({
      ...satsangi,
      checked_in: !!satsangi.checked_in && !satsangi.checked_out,
      checked_out: !!satsangi.checked_out,
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
      (s.age !== null && s.age !== undefined && s.age.toString().includes(searchTerm))
    );
  });

  filtered = filtered.filter((s) => {
    if (filterMode === 'checkedIn') return s.checked_in && !s.checked_out;
    if (filterMode === 'checkedOut') return s.checked_out;
    if (filterMode === 'unallocated') return !s.room_no;
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
                <TableHead className="text-white">CI/CO</TableHead>
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
                      {s.checked_out ? (
                        <span className="text-gray-500 italic">Checked out</span>
                      ) : (
                        <>

                        {!s.checked_in && (
                      <button
                        onClick={async () => {
                          await checkInSatsangi(s.satsangi_id);
                          toast.success("Checked In");
                        }}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <LogIn className="w-4 h-4" />
                      </button>
                        )}
                      {s.checked_in && (
                        <button
                          onClick={async () => {
                            await checkOutSatsangi(s.satsangi_id);
                            toast.success("Checked Out");
                          }}
                          className="text-amber-600 hover:text-amber-800"
                        >
                          <LogOut className="w-4 h-4" />
                        </button>
                      )}

                   </>
                    )}
                      <button
                        onClick={() => handleEditClick(s)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
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

        {/* Show All */}
        <div
          className="flex items-center gap-1 cursor-pointer"
          title="Show All"
          onClick={() => setFilterMode('all')}
        >
          <Users className={`w-6 h-6 ${filterMode === 'all' ? "text-blue-800" : "text-gray-500"}`} />
        </div>

        {/* Checked In */}
        <div
          className="flex items-center gap-1 cursor-pointer"
          title="Checked In"
          onClick={() => setFilterMode('checkedIn')}
        >
          <LogIn className={`w-6 h-6 ${filterMode === 'checkedIn' ? "text-indigo-800" : "text-amber-600"}`} />
        </div>

        {/* Checked Out */}
        <div
          className="flex items-center gap-1 cursor-pointer"
          title="Checked Out"
          onClick={() => setFilterMode('checkedOut')}
        >
          <LogOut className={`w-6 h-6 ${filterMode === 'checkedOut' ? "text-amber-800" : "text-indigo-600"}`} />
        </div>

        {/* Unallocated */}
        <div
          className="flex items-center gap-1 cursor-pointer"
          title="Unallocated (No Room)"
          onClick={() => setFilterMode('unallocated')}
        >
          <DoorClosed className={`w-6 h-6 ${filterMode === 'unallocated' ? "text-red-800" : "text-gray-500"}`} />
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
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="checked_in"
                    name="checked_in"
                    defaultChecked={editingSatsangi.checked_in}
                  />
                  <Label htmlFor="checked_in">Checked In</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="checked_out"
                    name="checked_out"
                    defaultChecked={editingSatsangi.checked_out}
                  />
                  <Label htmlFor="checked_out">Checked Out</Label>
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