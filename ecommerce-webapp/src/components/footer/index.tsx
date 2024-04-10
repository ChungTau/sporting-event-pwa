import Link from "next/link";
import { Button } from "../ui/button";
import { APP_TITLE } from "@/configs/app";
import { MediaIconButtonProps } from "./types";
import LucideIcon from "../lucideIcon";

export default function Footer() {
    return (
        <footer className="w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 mx-auto mb-10">
            <div className="text-center">
                <div>
                    <Link className="flex-none text-xl font-semibold font-kalam text-black dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" href="/" aria-label="Brand">{APP_TITLE}</Link>
                </div>

                <div className="mt-3">
                    <p className="text-gray-500">© Copy right 2024 - 2025</p>
                    <p className="text-gray-500">{`All rights reserved. Powered by the ${APP_TITLE}`}</p>
                </div>

                <div className="mt-3 space-x-2">
                    <MediaIconButton href="#" iconName={"facebook"} />
                    <MediaIconButton href="#" iconName={"instagram"} />
                    <MediaIconButton href="#" iconName={"github"} />
                </div>
            </div>
        </footer>
    );
};

function MediaIconButton({ href, iconName }: MediaIconButtonProps) {
    return (
        <Link href={href}>
            <Button aria-label={iconName} variant="ghost" size="icon" className="inline-flex justify-center items-center size-10 text-center text-gray-500 hover:bg-gray-100 rounded-full transition dark:text-gray-500 dark:hover:text-gray-200 dark:hover:bg-gray-800">
                <LucideIcon name={iconName} />
            </Button>
        </Link>
    );
}