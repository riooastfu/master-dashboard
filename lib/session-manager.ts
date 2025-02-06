// /lib/sessionManager.ts
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"

class SessionManager {
    private static instance: SessionManager;
    private sessionCache: any = null;
    private sessionExpiry: number | null = null;
    private readonly SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes

    private constructor() { }

    public static getInstance(): SessionManager {
        if (!SessionManager.instance) {
            SessionManager.instance = new SessionManager();
        }
        return SessionManager.instance;
    }

    public async getSession() {
        const currentTime = Date.now();

        if (!this.sessionCache || !this.sessionExpiry || currentTime > this.sessionExpiry) {
            this.sessionCache = await getServerSession(authOptions);
            this.sessionExpiry = currentTime + this.SESSION_TIMEOUT;
        }

        return this.sessionCache;
    }
}

export default SessionManager.getInstance();