"use client"

import useAxiosAuth from "@/hooks/use-axios-auth";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";


const HomePage = () => {
    return (
        <div>
            <p>Home</p>
        </div>
    )
}

export default HomePage;