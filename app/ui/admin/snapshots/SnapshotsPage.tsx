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
import { RotateCcw, Trash2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { createSnapshot } from '@/app/dashboard/admin/snapshots/actions';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { deleteSnapshot, restoreSnapshot, emptyDatabase } from '@/app/dashboard/admin/snapshots/actions';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

// Predefined password (in a real app, this should be more secure)
const ADMIN_PASSWORD = "GolokDham1007"; 

export default function SnapshotsPage({ snapshots }: { snapshots: any[] }) {
    const [search, setSearch] = useState('');
    const [password, setPassword] = useState('');
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [currentAction, setCurrentAction] = useState<{
        type: 'restore' | 'delete' | 'empty' | 'create';
        id?: string;
        description?: string;
    } | null>(null);

    const filtered = snapshots.filter((s) =>
        s.description.toLowerCase().includes(search.toLowerCase())
    );

    const handleAction = async () => {
        if (password !== ADMIN_PASSWORD) {
            toast.error("Incorrect password");
            return;
        }

        setShowPasswordDialog(false);
        setPassword('');

        try {
            if (!currentAction) return;

            switch (currentAction.type) {
                case 'restore':
                    if (!currentAction.id) return;
                    await restoreSnapshot(currentAction.id);
                    toast.success("Snapshot restored!");
                    break;
                case 'delete':
                    if (!currentAction.id) return;
                    await deleteSnapshot(currentAction.id);
                    toast.success('Snapshot deleted');
                    break;
                case 'empty':
                    await emptyDatabase();
                    toast.success("Database emptied successfully.");
                    break;
                case 'create':
                    if (!currentAction.description) return;
                    await createSnapshot(currentAction.description);
                    toast.success("Snapshot created successfully.");
                    break;
            }

            location.reload();
        } catch (err) {
            toast.error(`Failed to perform action: ${err instanceof Error ? err.message : String(err)}`);
        }
    };

    return (
        <div className="space-y-6">
            <Toaster />
            <div className="bg-white border rounded-lg shadow p-6 space-y-4">
                <h2 className="text-xl font-semibold">Snapshots</h2>
                
                {/* Snapshot Form */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const description = formData.get('description') as string;
                        
                        setCurrentAction({
                            type: 'create',
                            description,
                        });
                        setShowPasswordDialog(true);
                    }}
                    className="bg-white p-4 rounded shadow space-y-4"
                >
                    <Input name="description" placeholder="Description" required />
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
                                <TableCell className="flex space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setCurrentAction({
                                                type: 'delete',
                                                id: snap.id,
                                            });
                                            setShowPasswordDialog(true);
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setCurrentAction({
                                                type: 'restore',
                                                id: snap.id,
                                            });
                                            setShowPasswordDialog(true);
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
                    onClick={() => {
                        setCurrentAction({ type: 'empty' });
                        setShowPasswordDialog(true);
                    }}
                >
                    Empty Database
                </Button>
            </div>

            {/* Password Dialog */}
            <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Action</DialogTitle>
                        <DialogDescription>
                            {currentAction?.type === 'restore' && 
                                "Please enter the admin password to restore this snapshot."}
                            {currentAction?.type === 'delete' && 
                                "Please enter the admin password to delete this snapshot."}
                            {currentAction?.type === 'empty' && 
                                "Please enter the admin password to empty the database."}
                            {currentAction?.type === 'create' && 
                                "Please enter the admin password to create a snapshot."}
                        </DialogDescription>
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
                        <Button 
                            variant="default" 
                            onClick={handleAction}
                            disabled={!password}
                        >
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}