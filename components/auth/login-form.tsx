"use client"

import z from "zod"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LoginSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useTransition } from "react";
import { toast } from "sonner";
import { login } from "@/lib/actions";
import { useRouter } from "next/navigation";


export const LoginForm = () => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        startTransition(async () => {
            login(values)
                .then((data) => {
                    if (data?.error) {
                        form.reset();
                        toast('Peringatan', {
                            description: data.error
                        });
                    }

                    if (data?.success) {
                        form.reset();
                        toast('Peringatan', {
                            description: data.success
                        });
                        router.push('/gis')
                    }
                })
                .catch(() => {
                    toast('Peringatan', {
                        description: "Terjadi kesalahan"
                    });
                });
        });
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>GIS Dashboard</CardTitle>
                <CardDescription>Silahkan masuk untuk memulai.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} placeholder="admin" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} placeholder="******" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Login</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}