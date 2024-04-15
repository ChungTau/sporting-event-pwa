import { ChildrenProps } from "@/types/childrenProps";

function Wrapper({children}:ChildrenProps) {
    return (
        <div className="max-w-[1200px] px-5 sm:px-8 pt-6 w-full items-center">
            {children}
        </div>
    );
}

export default Wrapper;