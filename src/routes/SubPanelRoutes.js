import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// login option 3 routing
// const AuthLogin3 = Loadable(lazy(() => import('affilate/views/pages/authentication/authentication3/Login')));
const AuthLogin3 = Loadable(lazy(() => import('affilate/views/pages/authentication/authentication3/Login')));
const DashboardDefault = Loadable(lazy(() => import('affilate/views/dashboard/Default')));
const AgentSignup = Loadable(lazy(()=>import('affilate/views/agents/AgentSignup')))
const AgentTable = Loadable(lazy(()=>import('affilate/views/agents/AgentTable')))
const EditAgent = Loadable(lazy(()=>import('affilate/views/agents/editAgent')))
const ViewAgent = Loadable(lazy(()=>import('affilate/views/agents/viewAgent')))
const Viewaddedoperator =Loadable(lazy(()=>import('affilate/views/utilities/add-operator')))

const AgentLogin = () => {
    return(
      <>
        <h1>Agent login</h1>
      </>
    )
  }
// ==============================|| AUTHENTICATION ROUTING ||============================== //

const SubPanelRoutes = {
  path: '/affilate',
  element: <MinimalLayout />,
  children: [
    {
      path: 'login',
      element: <AuthLogin3 />
    },
    {
      path:'dashboard',
      element:<DashboardDefault/>
    }
    
  ]
};

export default SubPanelRoutes;

