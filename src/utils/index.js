export const createPageUrl = (pageName) => {
  const routes = {
    DriverDashboard: "/driver-dashboard",
    OperatorDashboard: "/operator-dashboard",
    RoleSelection: "/role-selection",
  };
  return routes[pageName] || "/";
};
