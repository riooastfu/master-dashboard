"use client"

import { SessionProvider } from "next-auth/react"
import React, { ReactNode } from 'react'
import { Session } from "next-auth"


const AuthProvider = ({ session, children }: { session: Session | null, children: ReactNode }) => {
    return <SessionProvider session={session}>{children}</SessionProvider>
}

export default AuthProvider