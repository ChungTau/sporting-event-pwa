import {ComponentType } from 'react';
import { To } from 'react-router-dom';
import MainPage from '../pages/main';
import ErrorPage from '../pages/error';
import SignUpPage from '../pages/signUp';
import SignInPage from '../pages/signIn';
// import GPSPage from '../pages/gps';
import GPSPage from '../pages/gps';
import MyForm from '../pages/signUp';
import { FaPen, FaUser } from 'react-icons/fa';
import { BsCalendarEventFill } from 'react-icons/bs';
import { GoHomeFill } from "react-icons/go";
import { MdPhotoAlbum } from 'react-icons/md';
import { FaRoute } from "react-icons/fa";
import { IoCreate } from "react-icons/io5";

export interface RouteConfig {
    icon?: any;
    name: string;
    path?: string;
    component?: ComponentType<any> | null;
    lazyComponent?: () => Promise<{ default: ComponentType<any> }>;
    to?: To;
    outlet?: OutletConfig;
    isProtected?: boolean;
}

export interface OutletConfig {
    [key: string]: RouteConfig;
}

export const mainOutlet: OutletConfig = {
    HOME: { name: 'Home', icon:GoHomeFill, path: '/home', lazyComponent: () => import('../pages/main/outlets/home'),  isProtected: false },
    PLAN: { name: 'Plan', icon:FaRoute, path: '/plan', lazyComponent: () => import('../pages/main/outlets/plan'), isProtected: true },
    ADD_EVENT: { name: 'Add Event', icon: IoCreate, path: '/add-event', lazyComponent: () => import('../pages/main/outlets/addEvent'), isProtected: true },
};

export const userOutlet: OutletConfig = {
    USER_PROFILE: { name: 'My Profile', icon: FaUser, path: '/user/profile', lazyComponent: () => import('../pages/main/outlets/myProfile'),  isProtected: true },
    USER_EVENT: { name: 'My Event', icon: BsCalendarEventFill, path: '/user/event',lazyComponent: () => import('../pages/main/outlets/myEvent'),  isProtected: true },
    USER_PLAN: { name: 'My Plan', icon: FaPen, path: '/user/plan', lazyComponent: () => import('../pages/main/outlets/myPlan'),  isProtected: true },
    USER_JOURNEY: { name: 'My Journey', icon: MdPhotoAlbum, path: '/user/journey', lazyComponent: () => import('../pages/main/outlets/myJourney'),  isProtected: true },
};

export const routes = Object.freeze({
    MAIN: {name: 'Main', path: '/', component: MainPage, outlet: { ...mainOutlet, ...userOutlet }, isProtected: false },
    SIGNUP: { name: 'Sign Up', path: '/sign-up', component: SignUpPage, isProtected: false },
    SIGNIN: { name: 'Sign In', path: '/sign-in', component: SignInPage, isProtected: false },
    GPS: { name: 'GPS', path: '/gps', component: GPSPage, isProtected: false },
    MYFORM: { name: 'MyForm', path: '/myform', component: MyForm, isProtected: false },
    ERROR: { name: 'Error', path: '/badpage', component: ErrorPage, isProtected: false },
    ERRORREDIRECT: { name: 'ErrorRedirect', path: '*', to: '/badpage', isProtected: false },
});