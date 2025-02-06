"use client"

import React, { useState, useMemo, useEffect } from 'react';
import { DataTable } from '../datatable/adminassignactivitytable/data-table';
import { columns } from '../datatable/adminassignactivitytable/column';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { ActivityProps, RoleProps } from '@/types';
import { getRoles } from '@/actions/admin/role';
import { toast } from 'sonner';
import { assignRoleActivity, deleteRoleActivity, getActivity } from '@/actions/admin/activity';

interface RoleActivityMapping {
    masterAktivitasId: number;
    roleId: number;
    createdAt: string;
    updatedAt: string;
}

const RoleActivityManagement = () => {
    const [activities, setActivities] = useState<ActivityProps[]>([]);
    const [roles, setRoles] = useState<RoleProps[]>([]);
    const [selectedRole, setSelectedRole] = useState<RoleProps | null>(null);
    const [selectedActivities, setSelectedActivities] = useState<number[]>([]);
    const [mappings, setMappings] = useState<RoleActivityMapping[]>([]);
    const [roleSearch, setRoleSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    // Reset selected activities when role changes
    useEffect(() => {
        setSelectedActivities([]);
        if (selectedRole) {
            // You might want to fetch role-specific activities here
            // This depends on your API structure
        }
    }, [selectedRole]);

    const fetchData = async () => {
        try {
            const [rolesData, activityData] = await Promise.all([
                getRoles(),
                getActivity()
            ]);

            if (rolesData.data) {
                setRoles(rolesData.data)
            }

            if (activityData.data) {
                setActivities(activityData.data)
            }

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Failed to fetch data. Please try again.');
            }
        }
    };

    const handleActivityToggle = async (activityId: number, activityName: string) => {
        if (!selectedRole) return; // Guard clause - do nothing if no role selected

        setIsLoading(true);
        try {
            // Check if activity is already selected for this role
            const isCurrentlySelected = selectedActivities.includes(activityId);

            if (isCurrentlySelected) {
                // If activity is already assigned, remove it
                const result = await deleteRoleActivity({
                    roleId: selectedRole.id,
                    masterAktivitasId: activityId
                });

                if (result.success) {
                    // Update local state by filtering out the activityId
                    setSelectedActivities(prev => prev.filter(id => id !== activityId));
                    toast.success(`Activity ${activityName} removed from role successfully`);
                }
            } else {
                // If activity is not assigned, add it
                const result = await assignRoleActivity({
                    roleId: selectedRole.id,
                    masterAktivitasId: activityId
                });

                if (result.success) {
                    // Update local state by adding the new activityId
                    setSelectedActivities(prev => [...prev, activityId]);
                    toast.success(`Activity ${activityName} assigned to role successfully`);
                }
            }
        } catch (error) {
            // Error handling
        } finally {
            setIsLoading(false);
        }
    };

    const filteredRoles = useMemo(() => {
        return roles.filter(role =>
            role.role.toLowerCase().includes(roleSearch.toLowerCase()) ||
            role.description.toLowerCase().includes(roleSearch.toLowerCase())
        );
    }, [roles, roleSearch]);

    return (
        <div className="p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Role-Activity Management</CardTitle>
                    <CardDescription>Manage role permissions and activities</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-6">
                        {/* Role Selection Panel */}
                        <div className="w-64 flex flex-col gap-4">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search roles..."
                                    value={roleSearch}
                                    onChange={(e) => setRoleSearch(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                            <ScrollArea className="h-[500px] border rounded-md p-2">
                                <div className="flex flex-col gap-2">
                                    {filteredRoles.map(role => (
                                        <Button
                                            key={role.id}
                                            variant={selectedRole?.id === role.id ? "default" : "outline"}
                                            onClick={() => setSelectedRole(role)}
                                            className="justify-start h-auto py-2 px-4"
                                        >
                                            <div className="flex flex-col items-start gap-1">
                                                <span className="font-medium">{role.role}</span>
                                                <span className="text-xs text-muted-foreground">{role.description}</span>
                                            </div>
                                        </Button>
                                    ))}
                                    {filteredRoles.length === 0 && (
                                        <p className="text-sm text-muted-foreground text-center py-4">
                                            No roles found
                                        </p>
                                    )}
                                </div>
                            </ScrollArea>
                        </div>

                        {/* Activity Table */}
                        <div className="flex-1">
                            {selectedRole ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-medium">Activities for role: {selectedRole.role}</h3>
                                    </div>
                                    <DataTable
                                        columns={columns}
                                        data={activities}
                                        meta={{
                                            onToggleActivity: handleActivityToggle,
                                            selectedActivities: selectedActivities
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-[600px] border rounded-md">
                                    <p className="text-muted-foreground">Select a role to manage its activities</p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RoleActivityManagement;