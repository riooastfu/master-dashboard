import { getRoles } from "@/actions/admin/role";
import RoleManagementComponent from "@/components/admin/role-management";

async function RoleManagementPage() {
    // Fetch initial data on the server
    const { data: initialRoles, error: rolesError } = await getRoles();

    if (rolesError) {
        return <div>Error loading data</div>
    }
    return (
        <RoleManagementComponent
            initialRoles={initialRoles}
        />
    )
}

export default RoleManagementPage