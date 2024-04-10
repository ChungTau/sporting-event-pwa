import {IconProps} from "@/types/iconProps";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import dynamic from "next/dynamic";

const Icon = ({
    name,
    ...props
} : IconProps) => {
    const LucideIcon = dynamic(dynamicIconImports[name])

    return <LucideIcon {...props}/>;
};

export default Icon;