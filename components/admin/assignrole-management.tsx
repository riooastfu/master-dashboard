"use client"

import { useState, useEffect } from "react"
import { DataTable } from "../datatable/adminassignroletable/data-table"
import { columns } from "@/components/datatable/adminassignroletable/column";
import { toast } from "sonner"
import { RoleProps, UserProps } from "@/types/types"
import { getUsers } from "@/actions/admin/user"
import { getRoles, getUsersRoles, updateUserRoles } from "@/actions/admin/role"
import { AssignRoleDialog } from "../datatable/adminassignroletable/assignrole-dialog"
import { useRouter } from "next/navigation"

interface UserRole {
    userId: string
    roleId: number
}

export default function AssignRoleComponent() {
    const router = useRouter()

    const [users, setUsers] = useState<UserProps[]>([])
    const [roles, setRoles] = useState<RoleProps[]>([])
    const [userRoles, setUserRoles] = useState<UserRole[]>([])
    const [selectedUser, setSelectedUser] = useState<UserProps | null>(null)
    const [selectedRoles, setSelectedRoles] = useState<Set<number>>(new Set())
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Fetch data when component mounts
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            // Replace these with your actual API endpoints
            const [usersData, rolesData, userRolesData] = await Promise.all([
                getUsers(),
                getRoles(),
                getUsersRoles()
            ])

            if (usersData.data) {
                setUsers(usersData.data)
            }

            if (rolesData.data) {
                setRoles(rolesData.data)
            }

            if (userRolesData.data) {
                setUserRoles(userRolesData.data)
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Failed to fetch data. Please try again.');
            }
        }
    }

    // Handle opening the dialog and setting initial selected roles
    const handleAssignRoles = (user: UserProps) => {
        setSelectedUser(user)
        // Get current roles for this user
        const currentRoles = userRoles
            .filter(ur => ur.userId === user.id)
            .map(ur => ur.roleId)
        setSelectedRoles(new Set(currentRoles))
        setIsDialogOpen(true)
    }

    // Handle saving role assignments
    const handleSaveRoles = async (roleIds: number[]) => {
        if (!selectedUser) return

        setIsSubmitting(true)
        try {
            const result = await updateUserRoles(selectedUser.id, roleIds)

            if (result.error) {
                toast.error(result.error)
                return
            }

            toast.success('Roles updated successfully')
            setIsDialogOpen(false)

            // Refresh data
            router.refresh()
            await fetchData()
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Failed to update role. Please try again.');
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Assign Roles to Users</h1>
            </div>

            <DataTable
                columns={columns}
                data={users}
                onAssignRoles={handleAssignRoles}
            />

            {selectedUser && (
                <AssignRoleDialog
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    onSave={handleSaveRoles}
                    roles={roles}
                    selectedRoles={selectedRoles}
                    setSelectedRoles={setSelectedRoles}
                    username={selectedUser.username}
                    employid={selectedUser.employid}
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    )
}