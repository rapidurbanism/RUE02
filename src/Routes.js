import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import loadable from "@loadable/component";
import { Common } from "@components/Common";

const Loading = Common.Loading;

const Dashboard = loadable(() => import("@pages/Dashboard"), {
  fallback: <Loading />,
});

const Dev = loadable(() => import("@pages/Dev"), {
  fallback: <Loading />,
});

const routes = [
  {
    path: "/",
    component: Dashboard,
    exact: true,
  },
  {
    path: "/dev",
    component: Dev,
    exact: true,
  },
  // {
  //   path: "/admin",
  //   component: AdminPage,
  //   routes: [
  //     {
  //       path: "/admin/user-list",
  //       component: UserList,
  //       exact: true,
  //     },
  //     {
  //       path: "/admin/job-list",
  //       component: JobList,
  //       exact: true,
  //     },
  //   ],
  // },
];

const Routes = () => (
  <Switch>
    {routes.map((route, i) => (
      <RouteWithSubRoutes key={i} {...route} />
    ))}
    <Redirect to="/" />
    <Route component={Dashboard} />
  </Switch>
);

const RouteWithSubRoutes = (route) => {
  return (
    <Switch>
      <Route
        path={route.path}
        render={(props) => <route.component {...props} routes={route.routes} />}
      />
    </Switch>
  );
};

export default Routes;
export { RouteWithSubRoutes };
