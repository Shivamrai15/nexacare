import { Header } from "@/components/usable/header";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

interface Props {
    children: React.ReactNode;
}

const Layout = async({ children }: Props) => {

    const session = await auth();
    if (!session) {
        return redirect("/");
    }

    return (
        <>
            <Header />
            {children}
        </>
    )
}

export default Layout;