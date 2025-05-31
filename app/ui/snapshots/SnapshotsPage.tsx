'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { RotateCcw } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { createSnapshot } from '@/app/dashboard/admin/snapshots/actions';
import { useTransition } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { deleteSnapshot, restoreSnapshot, emptyDatabase } from '@/app/dashboard/admin/snapshots/actions';

export default function SnapshotsPage({ snapshots }: { snapshots: any[] }) {
    const [search, setSearch] = useState('');

    const filtered = snapshots.filter((s) =>
        s.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <Toaster />
            <div className="bg-white border rounded-lg shadow p-6 space-y-4">
                <h2 className="text-xl font-semibold">Snapshots</h2>
                {/* Snapshot Form */}
                <form
                    action={async (formData) => {
                        await createSnapshot(formData);
                        location.reload();
                    }}
                    className="bg-white p-4 rounded shadow space-y-4"
                >
                    <Input name="description" placeholder="Description" />
                    <Button type="submit">Create Snapshot</Button>
                </form>
                <Input
                    type="text"
                    placeholder="Search snapshots..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border p-2 rounded"
                />

                <Table>
                    <TableHeader className="bg-gray-800">
                        <TableRow>
                            <TableHead className="text-white">Created</TableHead>
                            <TableHead className="text-white">Description</TableHead>
                            <TableHead className="text-white">Actions</TableHead>

                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.map((snap) => (
                            <TableRow key={snap.id}>
                                <TableCell>{new Date(snap.created_at).toLocaleString()}</TableCell>
                                <TableCell>{snap.description || '—'}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={async () => {
                                            const confirmDelete = confirm("Are you sure you want to delete this snapshot?");
                                            if (!confirmDelete) return;

                                            try {
                                                await deleteSnapshot(snap.id);
                                                toast.success('Snapshot deleted');
                                                location.reload(); // or trigger re-fetch if using SWR/React Query
                                            } catch (err) {
                                                toast.error('Failed to delete snapshot');
                                            }
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={async () => {
                                            const confirmRestore = confirm("Restore this snapshot? This will overwrite current data.");
                                            if (!confirmRestore) return;

                                            try {
                                                await restoreSnapshot(snap.id);
                                                toast.success("Snapshot restored!");
                                                location.reload();
                                            } catch (err) {
                                                toast.error("Failed to restore snapshot.");
                                            }
                                        }}
                                    >
                                        <RotateCcw className="w-4 h-4 text-blue-600" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex justify-end">
                <Button
                    variant="destructive"
                    onClick={async () => {
                        const confirmed = confirm("⚠️ Are you sure you want to **empty the entire database**? This cannot be undone.");
                        if (!confirmed) return;

                        try {
                            const result = await emptyDatabase();

                            if (result.success) {
                                toast.success("Database emptied successfully.");
                                location.reload(); // or revalidate/fetch if you use SWR or React Query
                            } else {
                                toast.error(result.error || "Failed to empty the database.");
                            }
                        } catch (err) {
                            toast.error("Unexpected error occurred.");
                        }
                    }}
                >
                    Empty Database
                </Button>
            </div>

        </div>
    );
}
