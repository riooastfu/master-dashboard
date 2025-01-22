import { getNavigations } from "@/actions/admin/navigation";
import NavigationManagementComponent from "@/components/admin/navigation-management"

async function NavigationManagementPage() {
    // Fetch initial data on the server
    const { data: initialNavigations, error: navigationsError } = await getNavigations();

    if (navigationsError) {
        return <div>Error loading data</div>
    }
    return (
        <NavigationManagementComponent
            initialNavigations={initialNavigations}
        />
    )
}

export default NavigationManagementPage