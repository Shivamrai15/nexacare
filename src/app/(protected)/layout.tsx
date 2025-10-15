import { Header } from "@/components/usable/header";
import { requireAuth } from "@/lib/auth-utils";

interface Props {
    children: React.ReactNode;
}

const Layout = async({ children }: Props) => {

    const session = await requireAuth();

    return (
        <>
            <Header user={session.user} />
            {children}
        </>
    )
}

export default Layout;