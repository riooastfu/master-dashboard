import { getUsers, getPerusahaan } from "@/actions/admin/user";
import UserManagementComponent from "@/components/admin/user-management";

// This is the server component
async function UserManagementPage() {
    // Fetch initial data on the server
    const { data: initialUsers, error: usersError } = await getUsers()
    const { data: initialPerusahaan, error: perusahaanError } = await getPerusahaan()

    if (usersError || perusahaanError) {
        return <div>Error loading data</div>
    }

    return (
        <UserManagementComponent
            initialUsers={initialUsers}
            initialPerusahaan={initialPerusahaan}
        />
    )
}

export default UserManagementPage