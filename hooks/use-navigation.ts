"use client"
import { getNavigationRole } from "@/actions/sidebar";
import { MenuItemProps } from "@/types/types";
import { useEffect, useState } from "react";

export const useNavigation = (roleId: string) => {
    const [nav, setNav] = useState<MenuItemProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchNav = async () => {
            try {
                setIsLoading(true);
                const { data: navData, error: navError } = await getNavigationRole(roleId)

                if (navError) {
                    return console.log("error: Error fetching fata")
                }

                setNav(navData)
            } catch (err) {
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNav();
    }, [roleId]);

    return { nav, isLoading, error };
};