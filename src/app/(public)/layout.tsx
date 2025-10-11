import { Footer } from "@/components/usable/footer";
import { Header } from "@/components/usable/header";

interface Props {
    children: React.ReactNode
}

const Layout = ({ children }: Props) => {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    )
}

export default Layout;
