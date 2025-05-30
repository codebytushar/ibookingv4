'use client';

import { useState } from 'react';
import { checkInSatsangi, checkOutSatsangi, createSatsangi, deleteSatsangi } from '@/app/dashboard/admin/satsangies/actions';
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
import { LogIn, LogOut } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

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

  const filtered = satsangies.filter((s) => {
    const searchTerm = search.toLowerCase();
    return (
      (s.name && s.name.toLowerCase().includes(searchTerm)) ||
      (s.city && s.city.toLowerCase().includes(searchTerm)) ||
      (s.gender && s.gender.toLowerCase().includes(searchTerm)) ||
      (s.room_no !== null && s.room_no !== undefined && s.room_no.toString().toLowerCase().includes(searchTerm)) ||
      (s.age !== null && s.age !== undefined && s.age.toString().includes(searchTerm))
    );
  });



  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const paginated = filtered.slice(startIdx, startIdx + rowsPerPage);

  function getShivirOccasion(shivirId: string): string {
    return shivirs.find(shivir => shivir.id === shivirId)?.occasion || '';
  }

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
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-white">Age</TableHead>
                <TableHead className="text-white">City</TableHead>
                <TableHead className="text-white">Gender</TableHead>
                <TableHead className="text-white">Room No.</TableHead>
                <TableHead className="text-white">CI/CO</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((s) => (
                <TableRow key={s.satsangi_id}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.age}</TableCell>
                  <TableCell>{s.city}</TableCell>
                  <TableCell>{s.gender}</TableCell>
                  <TableCell>{s.room_no}</TableCell>
                  <TableCell>
                    {s.checked_out ? (
                      <span className="text-gray-500 italic">Checked out</span>
                    ) : (
                      <div className="flex gap-2">
                        {!s.checked_in && (
                          <button
                            onClick={async () => {
                              await checkInSatsangi(s.satsangi_id);
                              toast.success("Checked In");
                            }}
                            className="text-green-600 hover:text-green-800"
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
                            className="text-red-600 hover:text-red-800"
                          >
                            <LogOut className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
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
            <Input name="birthdate" type="date" placeholder='Birth Date'/>
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
    </div>
  );
}