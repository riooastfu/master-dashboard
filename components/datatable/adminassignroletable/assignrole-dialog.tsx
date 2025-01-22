// components/admin/assignrole-dialog.tsx
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface Role {
    id: number
    role: string
    description: string
}

interface AssignRoleDialogProps {
    isOpen: boolean
    onClose: () => void
    onSave: (roleIds: number[]) => void
    roles: Role[]
    selectedRoles: Set<number>
    setSelectedRoles: (roles: Set<number>) => void
    username: string
    employid: string | number
    isSubmitting: boolean
}

export function AssignRoleDialog({
    isOpen,
    onClose,
    onSave,
    roles,
    selectedRoles,
    setSelectedRoles,
    username,
    employid,
    isSubmitting
}: AssignRoleDialogProps) {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredRoles = roles.filter(role =>
        role.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const toggleRole = (roleId: number) => {
        const newSelected = new Set(selectedRoles)
        if (newSelected.has(roleId)) {
            newSelected.delete(roleId)
        } else {
            newSelected.add(roleId)
        }
        setSelectedRoles(newSelected)
    }

    const handleSelectAll = () => {
        const newSelected = new Set(filteredRoles.map(role => role.id))
        setSelectedRoles(newSelected)
    }

    const handleDeselectAll = () => {
        setSelectedRoles(new Set())
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        Assign Roles to {username} ({employid})
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                    {/* Search and Actions */}
                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search roles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleSelectAll}
                            >
                                Select All
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleDeselectAll}
                            >
                                Deselect All
                            </Button>
                        </div>
                    </div>

                    {/* Scrollable Role List */}
                    <ScrollArea className="h-[300px] rounded-md border p-4">
                        <div className="space-y-4">
                            {filteredRoles.map((role) => (
                                <div
                                    key={role.id}
                                    className="flex items-start space-x-3 p-2 hover:bg-muted rounded-lg transition-colors"
                                >
                                    <Checkbox
                                        id={`role-${role.id}`}
                                        checked={selectedRoles.has(role.id)}
                                        onCheckedChange={() => toggleRole(role.id)}
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <label
                                            htmlFor={`role-${role.id}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {role.role}
                                        </label>
                                        {role.description && (
                                            <p className="text-sm text-muted-foreground">
                                                {role.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {filteredRoles.length === 0 && (
                                <p className="text-center text-muted-foreground py-4">
                                    No roles found matching your search.
                                </p>
                            )}
                        </div>
                    </ScrollArea>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => onSave(Array.from(selectedRoles))}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}