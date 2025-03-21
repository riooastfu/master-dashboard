"use client"

import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
import { ActivityProps, RoleProps } from '@/types/types';
import { getRoles } from '@/actions/admin/role';
import { toast } from 'sonner';
import { assignRoleActivity, deleteRoleActivity, getActivity, getActivitiesByRole } from '@/actions/admin/activity';

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
    const [roleSearch, setRoleSearch] = useState("");

    // More granular loading states
    const [loadingStates, setLoadingStates] = useState({
        initialFetch: false,
        roleActivities: false,
        toggleActivity: null as number | null
    });

    // Cache for role activities to reduce API calls
    const [roleActivitiesCache, setRoleActivitiesCache] = useState<Record<number, number[]>>({});

    // Initial data fetch
    useEffect(() => {
        fetchData();
    }, []);

    // Fetch role-specific activities when role changes
    useEffect(() => {
        if (selectedRole) {
            fetchRoleActivities(selectedRole.id);
        } else {
            setSelectedActivities([]);
        }
    }, [selectedRole]);

    // Fetch all roles and activities
    const fetchData = async () => {
        try {
            setLoadingStates(prev => ({ ...prev, initialFetch: true }));

            const [rolesData, activityData] = await Promise.all([
                getRoles(),
                getActivity()
            ]);

            if (rolesData.data) {
                setRoles(rolesData.data);
            }

            if (activityData.data) {
                setActivities(activityData.data);
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Failed to fetch data. Please try again.');
            }
        } finally {
            setLoadingStates(prev => ({ ...prev, initialFetch: false }));
        }
    };

    // Fetch activities for a specific role
    const fetchRoleActivities = async (roleId: number) => {
        // Check if we already have the data for this role in cache
        if (roleActivitiesCache[roleId]) {
            setSelectedActivities(roleActivitiesCache[roleId]);
            return;
        }

        try {
            setLoadingStates(prev => ({ ...prev, roleActivities: true }));
            const response = await getActivitiesByRole(roleId);

            if (response.data && Array.isArray(response.data)) {
                const activityIds = response.data.map(activity => activity.id);
                setSelectedActivities(activityIds);

                // Cache the results
                setRoleActivitiesCache(prev => ({
                    ...prev,
                    [roleId]: activityIds
                }));
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Failed to fetch role activities. Please try again.');
            }
        } finally {
            setLoadingStates(prev => ({ ...prev, roleActivities: false }));
        }
    };

    // Handle toggling activity assignment
    const handleActivityToggle = useCallback(async (activityId: number, activityName: string) => {
        if (!selectedRole) return;

        // Optimistically update UI first
        const isCurrentlySelected = selectedActivities.includes(activityId);

        if (isCurrentlySelected) {
            setSelectedActivities(prev => prev.filter(id => id !== activityId));
        } else {
            setSelectedActivities(prev => [...prev, activityId]);
        }

        setLoadingStates(prev => ({ ...prev, toggleActivity: activityId }));

        try {
            const result = isCurrentlySelected
                ? await deleteRoleActivity({
                    roleId: selectedRole.id,
                    masterAktivitasId: activityId
                })
                : await assignRoleActivity({
                    roleId: selectedRole.id,
                    masterAktivitasId: activityId
                });

            if (result.success) {
                toast.success(`Activity ${activityName} ${isCurrentlySelected ? 'removed from' : 'assigned to'} role successfully`);

                // Update the cache
                setRoleActivitiesCache(prev => {
                    const updatedActivities = isCurrentlySelected
                        ? prev[selectedRole.id]?.filter(id => id !== activityId) || []
                        : [...(prev[selectedRole.id] || []), activityId];

                    return {
                        ...prev,
                        [selectedRole.id]: updatedActivities
                    };
                });
            } else {
                // Revert the optimistic update if operation failed
                if (isCurrentlySelected) {
                    setSelectedActivities(prev => [...prev, activityId]);
                } else {
                    setSelectedActivities(prev => prev.filter(id => id !== activityId));
                }
                toast.error(`Failed to ${isCurrentlySelected ? 'remove' : 'assign'} activity`);
            }
        } catch (error) {
            // Revert optimistic update on error
            if (isCurrentlySelected) {
                setSelectedActivities(prev => [...prev, activityId]);
            } else {
                setSelectedActivities(prev => prev.filter(id => id !== activityId));
            }

            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error(`Failed to ${isCurrentlySelected ? 'remove' : 'assign'} activity. Please try again.`);
            }
        } finally {
            setLoadingStates(prev => ({ ...prev, toggleActivity: null }));
        }
    }, [selectedRole, selectedActivities]);

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
                    {loadingStates.initialFetch ? (
                        <div className="flex items-center justify-center h-[600px]">
                            <p className="text-muted-foreground">Loading data...</p>
                        </div>
                    ) : (
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
                                            {loadingStates.roleActivities && (
                                                <span className="text-sm text-muted-foreground">(Loading...)</span>
                                            )}
                                        </div>
                                        <DataTable
                                            columns={columns}
                                            data={activities}
                                            meta={{
                                                onToggleActivity: handleActivityToggle,
                                                selectedActivities: selectedActivities,
                                                loadingActivity: loadingStates.toggleActivity
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
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default RoleActivityManagement;