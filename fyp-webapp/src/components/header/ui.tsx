// HeaderUI.tsx

import { Fragment, useEffect, useState } from 'react';
import {TransType} from '@/types/transType';
import {useHeader} from './useHeader';
import {NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList} from '../ui/navigation-menu';
import {LocaleLink} from '../localeLink';
import {APP_TITLE} from '@/configs/app';
import {Globe, MenuIcon, MoonIcon, SunIcon, User2, User2Icon} from 'lucide-react';
import {Button} from '../ui/button';
import {routes} from '@/configs/route';
import { Separator } from '../ui/separator';
import { useTheme } from 'next-themes';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from '../ui/menubar';
import { localeCodes } from '@/lib/i18n/settings';
import { signIn, useSession } from "next-auth/react";
import federatedLogout from '@/utils/federatedLogout';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { useUserDataStore } from '@/store/userUserDataStore';

const HeaderUI = ({t} : TransType) => {
    return (
        <header
            className="fixed top-0 flex h-16 w-full items-center px-4 md:px-6 shadow z-[200]">
            <NavigationMenu className="flex items-center justify-between w-full max-w-full">
                <AppTitle/>
                <NavigationMenuBar t={t}  />
            </NavigationMenu>
        </header>
    );
};

export default HeaderUI;

function AppTitle() {
    return (<LocaleLink className="mt-1 mx-2 md: flex-none font-kalam text-xl items-center justify-center font-bold dark:text-white text-zinc-700" href="/" aria-label="Brand">
                {APP_TITLE}
            </LocaleLink>);
}

function NavigationMenuBar({t}:TransType) {
    const {isOpen, toggleOpen, setIsOpen} = useHeader();
    
    const { data: session, status} = useSession();
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 640) {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [setIsOpen]);

    return (<div>
        <MenuButton toggleOpen={toggleOpen} />
        <NavigationMenuList className={`sm:flex flex-col sm:flex-row ml-auto gap-2 h-auto items-center ${isOpen ? 'w-full fixed top-16 left-0 right-0 justify-center rounded-b-lg bg-gradient-to-b dark:from-neutral-800 dark:to-neutral-800/65 pb-6 backdrop-blur-sm shadow from-white to-white/65' : 'hidden'}`}>
            {status==="loading"?<div/>:<Fragment><RouteList t={t} session={session} />
            <li>{session ? <LogoutButton t={t}/>:<LoginButton t={t}/>}</li></Fragment>}
            {!isOpen && <li><Separator orientation="vertical" className='h-6 bg-gray-500' /></li>}    
            <li><ModeToggle/></li>
            <li><LanguageSwitcher/></li>
            {session && <li><UserMenu/></li>}
        </NavigationMenuList>
    </div>);
}
  
const MenuButton = ({ toggleOpen }: { toggleOpen: () => void }) => {
    return (
        <div className="sm:hidden">
            <Button
                aria-label="Toggle Menu" // Add aria-label for accessibility
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100/[0.05]"
                onClick={toggleOpen}>
                <MenuIcon className="h-4 w-4" />
            </Button>
        </div>
    );
};

const RouteList = ({ t, session }: TransType &{session:Session|null}) => {
    return (
        <>
            {routes.filter(route => (route.protected && session)||!route.protected).map(route => (
                <NavigationMenuItem key={route.path}>
                    <NavigationMenuLink
                        asChild
                        className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-md font-medium hover:bg-gray-100 hover:dark:bg-gray-100/[0.1]"
                    >
                        <LocaleLink href={route.path}>
                            {t(route.name)}
                        </LocaleLink>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            ))}
        </>
    );
};

const UserMenu=()=>{
    const router = useRouter();
    const {userData} = useUserDataStore();
    return(

        <Menubar className="flex h-10 items-center space-x-1 bg-transparent dark:bg-transparent rounded-md p-1 border-none">
        <MenubarMenu>
        <MenubarTrigger
                    aria-label="Language Menu" // Add accessible label
                    className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-none transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 hover:dark:bg-gray-100/[0.1] hover:text-accent-foreground h-10 w-10 data-[state=open]:dark:bg-gray-100/[0.1] data-[state=open]:bg-gray-100/[0.1] focus:bg-gray-100/[0.1]">
                    <User2 />
                </MenubarTrigger>
                <MenubarContent className="mt-2 z-[104]">
                <MenubarItem onClick={()=>{
                router.push(`/users/${userData?.id}`);
            }}>My Profile</MenubarItem>
            <MenubarItem onClick={()=>{
                router.push('/my-plans');
            }}>
              My Plan
            </MenubarItem>
            <MenubarItem onClick={()=>{
                router.push('/my-events');
            }}>My Event</MenubarItem>
            
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
};
  
const ModeToggle = () => {
    const [isMounted, setIsMounted] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(resolvedTheme === "light" ? "dark" : "light")
    }

    if (!isMounted || typeof resolvedTheme === "undefined") {
        return null;
    }

    return (
        <Button
            variant="ghost"
            onClick={toggleTheme}
            size="icon"
            aria-label={`Toggle ${resolvedTheme === "light" ? "Dark" : "Light"} Mode`} // Add accessible label
            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-none transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 hover:dark:bg-gray-100/[0.1] hover:text-accent-foreground h-10 w-10"
        >
            <SunIcon
                className={`h-[1.2rem] w-[1.2rem] transition-all ${resolvedTheme === "light" ? "block" : "hidden"} dark:-rotate-90 dark:scale-0`}
            />
            <MoonIcon
                className={`h-[1.2rem] w-[1.2rem] transition-all ${resolvedTheme === "dark" ? "block" : "hidden"} dark:rotate-0 dark:scale-100`}
            />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
};

const LanguageSwitcher = () => {
    return (
        <Menubar className="flex h-10 items-center space-x-1 bg-transparent dark:bg-transparent rounded-md p-1 border-none">
            <MenubarMenu>
                <MenubarTrigger
                    aria-label="Language Menu" // Add accessible label
                    className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-none transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 hover:dark:bg-gray-100/[0.1] hover:text-accent-foreground h-10 w-10 data-[state=open]:dark:bg-gray-100/[0.1] data-[state=open]:bg-gray-100/[0.1] focus:bg-gray-100/[0.1]">
                    <Globe />
                </MenubarTrigger>
                <MenubarContent className="mt-2 z-[104]">
                    {Object.entries(localeCodes).map(([key, value]) => (
                        <LocaleLink key={key} locale={key}>
                            <MenubarItem>
                                {value}
                                <MenubarShortcut>{key}</MenubarShortcut>
                            </MenubarItem>
                        </LocaleLink>
                    ))}
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
};


const LoginButton=({ t }: TransType)=>{
    return(
        <Button className='h-7' onClick={()=>signIn("keycloak")}>
            {t('login')}
        </Button>
    );
};

const LogoutButton=({ t }: TransType)=>{
    return(
        <Button  className='h-7' onClick={()=>federatedLogout()}>
           {t('logout')}
        </Button>
    );
}