// app/admin/management/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CompanyTable } from "../datatable/admincompanytable/company-table"
import { EstateTable } from "../datatable/admincompanytable/estate-table"
import { DivisionTable } from "../datatable/admincompanytable/division-table"
import { CompanyForm } from "./company-form"
import { EstateForm } from "./estate-form"
import { DivisionForm } from "./divisi-form"
import { toast } from "sonner"
import { getCompanies, getEstates, getDivisions, deleteCompany, deleteEstate, deleteDivision } from "@/actions/admin/company"
import { useRouter } from "next/navigation"
import { CompanyProps, EstateProps, DivisionProps } from "@/types/types"
import { Button } from "../ui/button"

export default function CompanyManagementComponent() {
    const router = useRouter()
    const [companies, setCompanies] = useState<CompanyProps[]>([])
    const [estates, setEstates] = useState<EstateProps[]>([])
    const [divisions, setDivisions] = useState<DivisionProps[]>([])
    const [editingCompany, setEditingCompany] = useState<CompanyProps | null>(null)
    const [editingEstate, setEditingEstate] = useState<EstateProps | null>(null)
    const [editingDivision, setEditingDivision] = useState<DivisionProps | null>(null)

    const fetchData = async () => {
        try {
            const [companiesRes, estatesRes, divisionsRes] = await Promise.all([
                getCompanies(),
                getEstates(),
                getDivisions()
            ])

            if (companiesRes.data) setCompanies(companiesRes.data)
            if (estatesRes.data) setEstates(estatesRes.data)
            if (divisionsRes.data) setDivisions(divisionsRes.data)
        } catch (error) {
            toast.error("Failed to fetch data")
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleDeleteCompany = async (id: string) => {
        try {
            const result = await deleteCompany(id)
            if (result.error) {
                toast.error(result.error)
                return
            }
            toast.success("Company deleted successfully")
            fetchData()
            router.refresh()
        } catch (error) {
            toast.error("Failed to delete company")
        }
    }

    const handleDeleteEstate = async (id: string) => {
        try {
            const result = await deleteEstate(id)
            if (result.error) {
                toast.error(result.error)
                return
            }
            toast.success("Estate deleted successfully")
            fetchData()
            router.refresh()
        } catch (error) {
            toast.error("Failed to delete estate")
        }
    }

    const handleDeleteDivision = async (id: string) => {
        try {
            const result = await deleteDivision(id)
            if (result.error) {
                toast.error(result.error)
                return
            }
            toast.success("Division deleted successfully")
            fetchData()
            router.refresh()
        } catch (error) {
            toast.error("Failed to delete division")
        }
    }

    const resetAllForms = () => {
        setEditingCompany(null)
        setEditingEstate(null)
        setEditingDivision(null)
    }

    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Company Structure Management</h1>
            </div>

            <Tabs defaultValue="company" onValueChange={() => { resetAllForms() }}>
                <TabsList>
                    <TabsTrigger value="company">Companies</TabsTrigger>
                    <TabsTrigger value="estate">Estates</TabsTrigger>
                    <TabsTrigger value="division">Divisions</TabsTrigger>
                </TabsList>
                <TabsContent value="company">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>{editingCompany ? "Edit Company" : "Create Company"}</CardTitle>
                                        <CardDescription>
                                            {editingCompany ? "Modify existing company" : "Add a new company to the system"}
                                        </CardDescription>
                                    </div>
                                    {editingCompany && (
                                        <Button
                                            variant="outline"
                                            onClick={() => setEditingCompany(null)}
                                        >
                                            Cancel Edit
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CompanyForm
                                    initialData={editingCompany}
                                    onSuccess={() => {
                                        setEditingCompany(null)
                                        fetchData()
                                    }}
                                />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Companies List</CardTitle>
                                <CardDescription>Manage existing companies</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CompanyTable
                                    data={companies}
                                    onEdit={setEditingCompany}
                                    onDelete={handleDeleteCompany}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="estate">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>{editingEstate ? "Edit Estate" : "Create Estate"}</CardTitle>
                                        <CardDescription>
                                            {editingEstate ? "Modify existing estate" : "Add a new estate to the system"}
                                        </CardDescription>
                                    </div>
                                    {editingEstate && (
                                        <Button
                                            variant="outline"
                                            onClick={() => setEditingEstate(null)}
                                        >
                                            Cancel Edit
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <EstateForm
                                    companies={companies}
                                    initialData={editingEstate}
                                    onSuccess={() => {
                                        setEditingEstate(null)
                                        fetchData()
                                    }}
                                />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Estates List</CardTitle>
                                <CardDescription>Manage existing estates</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <EstateTable
                                    data={estates}
                                    companies={companies}
                                    onEdit={setEditingEstate}
                                    onDelete={handleDeleteEstate}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="division">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>{editingDivision ? "Edit Division" : "Create Division"}</CardTitle>
                                        <CardDescription>
                                            {editingDivision ? "Modify existing divisi" : "Add a new divisi to the system"}
                                        </CardDescription>
                                    </div>
                                    {editingDivision && (
                                        <Button
                                            variant="outline"
                                            onClick={() => setEditingDivision(null)}
                                        >
                                            Cancel Edit
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <DivisionForm
                                    estates={estates}
                                    initialData={editingDivision}
                                    onSuccess={() => {
                                        setEditingDivision(null)
                                        fetchData()
                                    }}
                                />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Divisions List</CardTitle>
                                <CardDescription>Manage existing divisions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <DivisionTable
                                    data={divisions}
                                    estates={estates}
                                    onEdit={setEditingDivision}
                                    onDelete={handleDeleteDivision}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}