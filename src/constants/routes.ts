import { ComponentType } from 'react';
import { To } from 'react-router-dom';
import MainPage from '../pages/main';
import ErrorPage from '../pages/error';
import HomePage from '../pages/main/outlets/home';
import PlanPage from '../pages/main/outlets/plan';
import MyProfilePage from '../pages/main/outlets/myProfile';
import MyEventPage from '../pages/main/outlets/myEvent';
import MyPlanPage from '../pages/main/outlets/myPlan';
import MyJourneyPage from '../pages/main/outlets/myJourney';
import SignUpPage from '../pages/signUp';
import SignInPage from '../pages/signIn';
import { FaPen, FaUser } from 'react-icons/fa';
import { BsCalendarEventFill } from 'react-icons/bs';
import { GoHomeFill } from "react-icons/go";
import { MdPhotoAlbum } from 'react-icons/md';
import { FaRoute } from "react-icons/fa";
import { IoCreate } from "react-icons/io5";
import AddEventPage from '../pages/main/outlets/addEvent';

export interface RouteConfig {
    icon?: any;
    name: string;
    path?: string;
    component?: ComponentType<any> | null;
    to?: To;
    outlet?: OutletConfig;
    isProtected?: boolean;
}

export interface OutletConfig {
    [key: string]: RouteConfig;
}

export const mainOutlet: OutletConfig = {
    HOME: { name: 'Home', icon:GoHomeFill, path: '/home', component: HomePage, isProtected: false },
    PLAN: { name: 'Plan', icon:FaRoute, path: '/plan', component: PlanPage, isProtected: true },
    ADD_EVENT: { name: 'Add Event', icon: IoCreate, path: '/add-event', component: AddEventPage, isProtected: true },
};

export const userOutlet: OutletConfig = {
    USER_PROFILE: { name: 'My Profile', icon: FaUser, path: '/user/profile', component: MyProfilePage, isProtected: true },
    USER_EVENT: { name: 'My Event', icon: BsCalendarEventFill, path: '/user/event', component: MyEventPage, isProtected: true },
    USER_PLAN: { name: 'My Plan', icon: FaPen, path: '/user/plan', component: MyPlanPage, isProtected: true },
    USER_JOURNEY: { name: 'My Journey', icon: MdPhotoAlbum, path: '/user/journey', component: MyJourneyPage, isProtected: true },
};

export const routes = Object.freeze({
    MAIN: {name: 'Main', path: '/', component: MainPage, outlet: { ...mainOutlet, ...userOutlet }, isProtected: false },
    SIGNUP: { name: 'Sign Up', path: '/sign-up', component: SignUpPage, isProtected: false },
    SIGNIN: { name: 'Sign In', path: '/sign-in', component: SignInPage, isProtected: false },
    ERROR: { name: 'Error', path: '/badpage', component: ErrorPage, isProtected: false },
    ERRORREDIRECT: { name: 'ErrorRedirect', path: '*', to: '/badpage', isProtected: false },
});