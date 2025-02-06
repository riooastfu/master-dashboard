import * as z from "zod";

export const LoginSchema = z.object({
    username: z.string().min(1, {
        message: "Username is required"
    }),
    password: z.string().min(1, {
        message: "Password is required"
    }),
});

export const PopmenuSchema = z.object({
    tanggal_mulai: z
        .date({ invalid_type_error: "*tanggal harus dipilih" })
        .min(new Date("1900-01-01"), { message: "*tanggal harus dipilih" }),
    tanggal_akhir: z
        .date({ invalid_type_error: "*tanggal harus dipilih" })
        .min(new Date("1900-01-01"), { message: "*tanggal harus dipilih" }),
    // items_perusahaan: z.array(z.string()).refine((value) => value.some((item) => item), {
    //     message: "Kamu harus memilih setidaknya satu perusahaan",
    // }),
    // items_estate: z.array(z.string()).refine((value) => value.some((item) => item), {
    //     message: "Kamu harus memilih setidaknya satu estate",
    // }),
    // items_divisi: z.array(z.string()).refine((value) => value.some((item) => item), {
    //     message: "Kamu harus memilih setidaknya satu divisi",
    // }),
})

export const ProduksiSchema = z.object({
    tanggal_mulai: z.date({
        required_error: "Tanggal Mulai is required",
        invalid_type_error: "Invalid date",
    }),
    tanggal_akhir: z.date({
        required_error: "Tanggal Akhir is required",
        invalid_type_error: "Invalid date",
    })
})

// Define Zod schema for form validation
export const userManagementFormSchema = z.object({
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(50, "Username must be less than 50 characters"),
    employid: z.coerce.number()
        .int("Employee ID must be an integer")
        .positive("Employee ID must be positive"),
    password: z.string()
        .min(6, "Password must be at least 6 characters")
        .optional()
        .or(z.literal('')),
    confirmPassword: z.string()
        .min(6, "Password must be at least 6 characters")
        .optional()
        .or(z.literal('')),
    perusahaanId: z.string().min(1, "Company is required"),
    estateId: z.string(),
    divisiId: z.string(),
}).refine((data) => {
    // Only validate password match if either password field is filled
    if (data.password || data.confirmPassword) {
        return data.password === data.confirmPassword;
    }
    return true;
}, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const roleManagementFormSchema = z.object({
    role: z.string().min(1, "Role name is required"),
    description: z.string().min(1, "Description is required"),
    auth_menu: z.enum(["allmap", "onept", "oneestate", "onedivisi"]),
    created_by: z.string()
})

// Form schema for navigation menu
export const navManagementFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    url: z.string().min(1, "URL is required"),
    parent_menu_id: z.string().optional(),
    icon: z.string().optional(),
    mode: z.enum(["title", "subtitle", "click"]),
    menu: z.enum(["admin", "gis", "pastiplant"]),
})

export const companyFormSchema = z.object({
    kode: z.string().min(1, "Code is required").max(10, "Code must be less than 10 characters"),
    no_urut: z.coerce.number().int("Order must be an integer").positive("Order must be positive"),
    description: z.string().min(1, "Company name is required"),
})

export const estateFormSchema = z.object({
    kode: z.string().min(1, "Code is required").max(10, "Code must be less than 10 characters"),
    no_urut: z.coerce.number().int("Order must be an integer").positive("Order must be positive"),
    description: z.string().min(1, "Estate name is required"),
    perusahaanId: z.string().min(1, "Company is required"),
})

export const divisionFormSchema = z.object({
    kode: z.string().min(1, "Code is required").max(10, "Code must be less than 10 characters"),
    no_urut: z.coerce.number().int("Order must be an integer").positive("Order must be positive"),
    description: z.string().min(1, "Division name is required"),
    estateId: z.string().min(1, "Estate is required"),
})

export const activityManagementFormSchema = z.object({
    kode: z.string().min(1, "Code is required").max(6, "Code must be less than pr equals to 6 characters"),
    description: z.string().min(1, "Activity name is required"),
})