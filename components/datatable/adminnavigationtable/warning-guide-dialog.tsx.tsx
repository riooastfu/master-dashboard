// components/admin/navigations/creation-guide-dialog.tsx
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { NavigationProps } from "@/types/types"

interface WarningGuideDialogProps {
    isOpen: boolean
    onClose: () => void
    formData: {
        title: string
        url: string
        mode: string
        menu: string
        parent_menu_id?: string | null
    }
    parentMenus: NavigationProps[] // Add this to get parent menu info
}

export function WarningGuideDialog({ isOpen, onClose, formData, parentMenus }: WarningGuideDialogProps) {
    // Function to get the full path including parent
    const getFullPath = () => {
        if (formData.mode === 'subtitle' && formData.parent_menu_id) {
            const parentMenu = parentMenus.find(menu => menu.id.toString() === formData.parent_menu_id)
            if (parentMenu) {
                return `app/${formData.menu}${parentMenu.url}${formData.url}/page.tsx`
            }
        }
        return `app/${formData.menu}${formData.url}/page.tsx`
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="max-w-3xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>Next Steps: Create App Router Files</AlertDialogTitle>
                    <AlertDialogDescription className="space-y-4 pt-4">
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                            <h3 className="mb-2 font-medium">Navigation Created Successfully!</h3>
                            <p className="text-sm text-muted-foreground">
                                To complete the setup, create the following file structure:
                            </p>
                        </div>

                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                            <h3 className="mb-2 font-medium">Required File Structure:</h3>
                            <div className="space-y-2">
                                <pre className="rounded-lg bg-slate-900 text-white p-4 text-sm overflow-x-auto">
                                    <code>{getFullPath()}</code>
                                </pre>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Basic file template:
                                </p>
                                <pre className="rounded-lg bg-slate-900 text-white p-4 text-sm overflow-x-auto whitespace-pre">
                                    <code>{`export default function ${formData.title.replace(/\s+/g, '')}Page() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">${formData.title}</h1>
      {/* Your page content here */}
    </div>
  )
}`}</code>
                                </pre>
                            </div>
                        </div>

                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                            <h3 className="mb-2 font-medium">Important Notes:</h3>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                <li>Create the complete folder structure if it doesn't exist</li>
                                <li>Use the provided template as a starting point</li>
                                {/* <li>Consider adding loading.tsx and error.tsx for better UX</li>
                                {formData.mode === 'title' && (
                                    <li>For parent menus, consider adding a layout.tsx file</li>
                                )} */}
                            </ul>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={onClose}>
                        Got it, thanks!
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}