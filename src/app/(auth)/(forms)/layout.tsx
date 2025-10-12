import { auth } from "@/lib/auth";
import Image from "next/image";
import { redirect } from "next/navigation";

interface Props {
    children: React.ReactNode;
}

const LayoutPage = async ({ children }: Props) => {
    
    const session = await auth();
    if (session) {
        return redirect("/");
    }
    
    return (
        <div className="w-full h-full flex">
            <section className="w-1/2 max-md:hidden h-full p-6 lg:p-10">
                <div className="size-full relative">
                    <Image
                        src="/assets/12429927_4966724.svg"
                        fill
                        alt="Nexacare"
                        className="object-contain"
                    />
                </div>
            </section>
            <section className="w-full md:w-1/2 h-full overflow-y-auto py-10 px-6">
                {children}
            </section>
        </div>
    )
}

export default LayoutPage;
