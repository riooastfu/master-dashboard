"use client"

import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";


const HomePage = () => {
    const { data: session, status } = useSession();
    // console.log(session?.user.token)

    const getNav = async () => {
        try {
            const res = await axios.get('http://10.131.6.158:5050/api/navigation', { withCredentials: true });

            if (res.status === 200) {
                console.log(res.data)
            }

        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        getNav();
    }, [])
    return (
        <div>

        </div>
    )
}

export default HomePage;