import {ChildrenProps} from "@/types/childrenProps";

export interface LocaleLinkProps extends ChildrenProps {
    locale?: string | null;
    href?: string | null;
    className?: string | null;
}