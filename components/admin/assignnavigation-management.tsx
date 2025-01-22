"use client"

import React, { useState, useEffect, useMemo } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { NavigationProps, RoleNavigationProps, RoleProps } from "@/types";
import { getRoles } from "@/actions/admin/role";
import { assignRoleNavigation, deleteRoleNavigation, getNavigations, getRoleNavigations } from "@/actions/admin/navigation";
import { type LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";

const AssignNavigationManagementComponent = () => {
    const [roles, setRoles] = useState<RoleProps[]>([]);
    const [navMenus, setNavMenus] = useState<NavigationProps[]>([]);
    const [roleNavMappings, setRoleNavMappings] = useState<RoleNavigationProps[]>([]);
    const [selectedRole, setSelectedRole] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedMenus, setExpandedMenus] = useState<number[]>([]);

    // Get unique modes from navigation items
    const menus = useMemo(() => {
        const uniqueMenus = Array.from(new Set(navMenus.map(nav => nav.menu)));
        return uniqueMenus.sort();
    }, [navMenus]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [rolesRes, navRes, mappingsRes] = await Promise.all([
                getRoles(),
                getNavigations(),
                getRoleNavigations(),
            ]);

            if (rolesRes.data) {
                setRoles(rolesRes.data)
            }

            if (navRes.data) {
                setNavMenus(navRes.data)
            }

            if (mappingsRes.data) {
                setRoleNavMappings(mappingsRes.data)
            }

        } catch (error) {
            toast.error("Failed to fetch data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleMenuToggle = async (roleId: number, navId: number) => {
        try {
            const hasAccess = roleNavMappings.some(
                (mapping) => mapping.roleId === roleId && mapping.navigationId === navId
            );

            console.log('Current access state:', { hasAccess, roleId, navId });

            let result;
            if (hasAccess) {
                result = await deleteRoleNavigation({ roleId, navId });
                console.log('Delete result:', result);
            } else {
                result = await assignRoleNavigation({ roleId, navId });
                console.log('Assign result:', result);
            }

            if (result.error) {
                toast.error(result.error);
                return;
            }

            // Only update UI if backend call was successful
            if (result.success) {
                if (hasAccess) {
                    setRoleNavMappings((prev) =>
                        prev.filter(
                            (mapping) =>
                                !(mapping.roleId === roleId && mapping.navigationId === navId)
                        )
                    );
                } else {
                    setRoleNavMappings((prev) => [...prev, { roleId, navigationId: navId }]);
                }

                toast.success(
                    hasAccess
                        ? "Menu access removed successfully"
                        : "Menu access granted successfully"
                );

                // Optionally refresh the data to ensure UI is in sync with backend
                fetchData();
            }
        } catch (error) {
            console.error('Toggle error:', error);
            toast.error("Failed to update menu access. Please try again.");
        }
    };

    const hasMenuAccess = (roleId: number, navId: number): boolean => {
        return roleNavMappings.some(
            (mapping) => mapping.roleId === roleId && mapping.navigationId === navId
        );
    };

    const getChildMenus = (parentId: number, mode: string): NavigationProps[] => {
        return navMenus.filter(
            (menu) => menu.parent_menu_id === parentId && menu.menu === mode
        );
    };

    const getMenuCountByMode = (mode: string): number => {
        return navMenus.filter((menu) => menu.menu === mode).length;
    };

    // Add this function to handle expand/collapse
    const toggleExpand = (menuId: number) => {
        setExpandedMenus(prev =>
            prev.includes(menuId)
                ? prev.filter(id => id !== menuId)
                : [...prev, menuId]
        );
    };

    const renderMenuItem = (menu: NavigationProps, mode: string) => {
        const children = getChildMenus(menu.id, mode);
        const IconComponent = LucideIcons[menu.icon as keyof typeof LucideIcons] as LucideIcon;
        const isExpanded = expandedMenus.includes(menu.id);

        return (
            <div key={menu.id} className="space-y-2">
                <div
                    className={cn(
                        "flex items-center justify-between p-3 rounded-md",
                        "border border-border hover:bg-accent/50 transition-colors",
                        children.length > 0 && "cursor-pointer"
                    )}
                    onClick={() => children.length > 0 && toggleExpand(menu.id)}
                >
                    <div className="flex items-center space-x-3">
                        {menu.icon && (
                            <IconComponent className="h-4 w-4" />
                        )}
                        <Label className="text-sm font-medium cursor-pointer">
                            {menu.title}
                        </Label>
                        {children.length > 0 && (
                            <LucideIcons.ChevronRight
                                className={cn(
                                    "h-4 w-4 transition-transform duration-200",
                                    isExpanded && "transform rotate-90"
                                )}
                            />
                        )}
                    </div>
                    {selectedRole && (
                        <div onClick={(e) => e.stopPropagation()}>
                            <Switch
                                checked={hasMenuAccess(selectedRole, menu.id)}
                                onCheckedChange={() => handleMenuToggle(selectedRole, menu.id)}
                            />
                        </div>
                    )}
                </div>
                {children.length > 0 && isExpanded && (
                    <div className="ml-6 space-y-2">
                        {children.map((child) => renderMenuItem(child, mode))}
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-[200px]" />
                    <Skeleton className="h-4 w-[300px]" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="p-8">
            <div className="flex flex-col mb-6">
                <h1 className="text-2xl font-bold">Role Menu Management</h1>
                <p className="text-sm text-muted-foreground">Assign menu access permissions to different roles</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Manage menu</CardTitle>
                    {/* <CardDescription>
                        Assign menu access permissions to different roles
                    </CardDescription> */}
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Role Selection */}
                        <Select
                            value={selectedRole?.toString()}
                            onValueChange={(value) => setSelectedRole(Number(value))}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Roles</SelectLabel>
                                    {roles.map((role) => (
                                        <SelectItem key={role.id} value={role.id.toString()}>
                                            <span className="font-medium">{role.role}</span>
                                            <span className="text-sm text-muted-foreground ml-2">
                                                - {role.description}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        {/* Menu Permissions */}
                        {selectedRole && (
                            <Tabs defaultValue={menus[0]} className="w-full">
                                <TabsList className="w-full justify-start">
                                    {menus.map((menu) => (
                                        <TabsTrigger key={menu} value={menu} className="relative">
                                            {menu.toUpperCase()}
                                            {/* <Badge
                                                variant="secondary"
                                                className="ml-3 absolute -top-3 -right-3"
                                            >
                                                {getMenuCountByMode(mode)}
                                            </Badge> */}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                                {menus.map((item) => (
                                    <TabsContent key={item} value={item}>
                                        <ScrollArea className="h-[400px] rounded-md border p-4">
                                            <div className="space-y-4">
                                                {navMenus
                                                    .filter(
                                                        (menu) =>
                                                            !menu.parent_menu_id && menu.menu === item
                                                    )
                                                    .map((menu) => renderMenuItem(menu, item))}
                                            </div>
                                        </ScrollArea>
                                    </TabsContent>
                                ))}
                            </Tabs>
                        )}

                        {/* Permission Summary */}
                        {selectedRole && (
                            <div className="rounded-md bg-muted p-4">
                                <h3 className="font-medium mb-2">
                                    {roles.find((r) => r.id === selectedRole)?.role} has access to:
                                </h3>
                                <ScrollArea className="h-[200px]">
                                    <div className="space-y-4">
                                        {menus.map((item) => (
                                            <div key={item}>
                                                <h4 className="text-sm font-medium mb-1">
                                                    {item.toUpperCase()}:
                                                </h4>
                                                <div className="space-y-1 ml-4">
                                                    {navMenus
                                                        .filter(
                                                            (menu) =>
                                                                menu.menu === item &&
                                                                hasMenuAccess(selectedRole, menu.id)
                                                        )
                                                        .map((menu) => (
                                                            <div
                                                                key={menu.id}
                                                                className="text-sm text-muted-foreground"
                                                            >
                                                                • {menu.title}
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AssignNavigationManagementComponent;