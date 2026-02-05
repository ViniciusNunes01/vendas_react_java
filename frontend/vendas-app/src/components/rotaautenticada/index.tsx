import { signIn, useSession } from "next-auth/react";
import { Loader } from "../common";
import { useEffect, useState } from "react";

export const RotaAutenticada: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: session, status } = useSession();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || status === 'loading') {
        return <Loader show />;
    }

    if (!session && status === 'unauthenticated') {
        signIn();
        return null;
    }

    return <div>{children}</div>;
};