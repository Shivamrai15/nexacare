import { Footer } from "@/components/usable/footer";
import { Header } from "@/components/usable/header";
import { getSession } from "@/lib/auth-utils";

interface Props {
    children: React.ReactNode
}

const Layout = async({ children }: Props) => {

    const session = await getSession();

    return (
        <>
            <Header user={session?.user || null} />
            {children}
            <Footer />
        </>
    )
}

export default Layout;
