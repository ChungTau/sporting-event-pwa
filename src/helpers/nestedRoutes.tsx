import {ReactNode} from "react";
import {Navigate, Route} from "react-router-dom";
import {RouteConfig} from "../constants/routes";
import ProtectedRoute from "../components/ProtectedRoute";

export const nestedRoutes = (nestedRouteItems : RouteConfig[]) : ReactNode => {
    return nestedRouteItems.map((nestedRouteItem) => {
        if (nestedRouteItem.outlet) {
            const innerRouteItems = Object.values(nestedRouteItem.outlet);
            return (
                <Route
                    key={nestedRouteItem.name}
                    path={nestedRouteItem.path}
                    element={(nestedRouteItem.component)
                    ? <nestedRouteItem.component/>
                    : null}>
                    <Route
                        index
                        element={< Navigate to = {
                        innerRouteItems[0].path !
                    } />}/> {nestedRoutes(innerRouteItems)}
                </Route>
            );
        }

        const Component = nestedRouteItem.component;
        return (
            <Route
                key={nestedRouteItem.name}
                path={nestedRouteItem.path}
                element={Component
                ? <div >
                        {nestedRouteItem.isProtected
                            ? <ProtectedRoute component={Component}/>
                            : <Component/>}
                    </div>
                : (nestedRouteItem.to
                    ? <Navigate to={nestedRouteItem.to}/>
                    : null)}/>
        );
    });
};