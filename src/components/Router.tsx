import { AnimatePresence, LayoutGroup} from 'framer-motion';
import { Routes, useLocation } from 'react-router-dom';
import { routes } from '../constants/routes';
import { nestedRoutes } from '../helpers/nestedRoutes';
import { useEffect } from 'react';
import { findRouteNameByPath } from '../helpers/findRouteNameByPath';
import { APP_NAME } from '../config/app';

const rootRoutes = Object.values(routes);

function Router() {
  const location = useLocation();

  //Update the website title according to the current route path.
  useEffect(() => {
    const routeName = findRouteNameByPath(location.pathname, routes);
    if (routeName) {
        document.title = `${routeName} - ${APP_NAME}`;
    }
}, [location]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <LayoutGroup key={location.pathname}>
          <Routes location={location}>
            {nestedRoutes(rootRoutes)}
          </Routes>
      </LayoutGroup>
    </AnimatePresence>
  );
}
export default Router;

