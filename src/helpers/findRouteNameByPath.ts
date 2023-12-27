import { RouteConfig } from "../constants/routes";

export function findRouteNameByPath(pathname: string, routes: { [key: string]: RouteConfig }): string | null {
    for (const routeKey in routes) {
        const route = routes[routeKey];
        if (route.path === pathname) {
            return route.name;
        }

        if (route.outlet) {
            const outletRouteName = findRouteNameByPath(pathname, route.outlet);
            if (outletRouteName) {
                return outletRouteName;
            }
        }
    }
    return null;
}