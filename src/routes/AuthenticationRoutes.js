import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: 'login',
      element: <AuthLogin3 />
    }
    
  ]
};

export default AuthenticationRoutes;

// import React from 'react';
// import { lazy } from 'react';
// import Loadable from 'ui-component/Loadable';
// import MinimalLayout from 'layout/MinimalLayout';

// // Lazy-loaded component for authentication login
// const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login')));

// // ==============================|| AUTHENTICATION ROUTING ||============================== //

// const AuthenticationRoutes = () => {
//   return (
//     {
//       path: '/',
//       element: <MinimalLayout />,
//       children: [
//         {
//           path: 'login',
//           element: <AuthLogin3 />
//         }
//       ]
//     }
//   );
// };

// export default AuthenticationRoutes;

