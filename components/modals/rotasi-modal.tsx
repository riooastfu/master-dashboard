// import { Button } from "@/components/ui/button"
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { useMapStore } from "@/hooks/use-map-store"

// import { PopmenuSchema } from "@/schemas"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"

// export const RotasiModal = () => {
//     const { isOpen, onClose, activeMapType } = useMapStore();

//     const isModalOpen = isOpen && activeMapType === "rotasi";

//     const form = useForm({
//         resolver: zodResolver(PopmenuSchema),
//         defaultValues: {
//             tanggal_mulai: new Date(),
//             tanggal_akhir: new Date(),
//         },
//     });

//     const isLoading = form.formState.isSubmitting;

//     const handleClose = () => {
//         form.reset();
//         onClose();
//     };

//     return (
//         <Dialog open={isModalOpen} onOpenChange={handleClose}>
//             <DialogContent className="bg-white text-black p-0 overflow-hidden">
//                 <DialogHeader className="pt-8 px-6">
//                     <DialogTitle className="text-2xl text-center">
//                         Rotasi
//                     </DialogTitle>
//                     <DialogDescription className="text-center text-zinc-500">
//                         Give your server a personality with a name and an image. You can
//                         always change it later.
//                     </DialogDescription>
//                 </DialogHeader>
//             </DialogContent>
//         </Dialog>
//     )
// }
