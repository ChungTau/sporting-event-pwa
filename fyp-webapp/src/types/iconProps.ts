import {LucideProps} from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";

export interface IconProps extends LucideProps {
    name : keyof typeof dynamicIconImports;
}