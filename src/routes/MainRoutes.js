import { lazy } from 'react';
// import { Navigate } from 'react-router';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import PageNotFound from 'views/utilities/PageNotFound'
import { element } from 'prop-types';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const Users = Loadable(lazy(() => import('views/utilities/users/Users')));
const DisputePage = Loadable(lazy(() => import('views/utilities/disputes/Dispute')));
const StaticPage = Loadable(lazy(() => import('views/utilities/staticpages/StatePage')));
const Settings = Loadable(lazy(() => import('views/utilities/settings/Settings')));
const Views = Loadable(lazy(()=>import('views/utilities/users/Views')))
const DisputeViews = Loadable(lazy(()=>import('views/utilities/disputes/ViewDispute')))
const ViewModel = Loadable(lazy(()=>import('views/utilities/users/ViewModel')))
const Transactions = Loadable(lazy(()=>import('views/utilities/transactions/Transactions')))
const Algo = Loadable(lazy(()=>import('views/utilities/algo/Algo')))
const GameHistory = Loadable(lazy(()=>import('views/utilities/gamehistory/GameHistory')))
const EditUser = Loadable(lazy(()=>import('views/utilities/users/EditUser')))
const Rewards = Loadable(lazy(()=>import('views/utilities/rewards/Rewards')))
const Versions = Loadable(lazy(()=>import('views/utilities/versions/Versions')))
const AddVersion = Loadable(lazy(()=>import('views/utilities/versions/AddVersion')))
const WinRate = Loadable(lazy(()=>import('views/utilities/winrate/WinRate')))
const LotteryAddDraw = Loadable(lazy(()=>import('views/utilities/lottery/draw/Draw')))
const AddDraw = Loadable(lazy(()=>import('views/utilities/lottery/draw/AddDraw')))
const EditDraw = Loadable(lazy(()=>import('views/utilities/lottery/draw/EditDraw')))
// const LotteryTime = Loadable(lazy(()=>import('views/utilities/lottery/lottery-time/LotteryTime')))
// const AddLotteryTime = Loadable(lazy(()=>import('views/utilities/lottery/lottery-time/AddLotteryTime')))
// const EditLotteryTime = Loadable(lazy(()=>import('views/utilities/lottery/lottery-time/EditLotteryTime')))

// const Rooms = Loadable(lazy(()=>import('views/utilities/lottery/rooms/Rooms')))
// const AddResult = Loadable(lazy(()=>import('views/utilities/lottery/rooms/AddResult')))
// const ViewRoom = Loadable(lazy(()=>import('views/utilities/lottery/rooms/ViewRoom')))
// const ViewLotteryDetails = Loadable(lazy(()=>import('views/utilities/lottery/rooms/ViewLotteryDetails')))
// const History = Loadable(lazy(()=>import('views/utilities/lottery/history/History')))
// const LotteryReporting = Loadable(lazy(()=>import('views/utilities/lottery/lottery-reporting/MainReporting')))

//agent routing
const AgentSignup = Loadable(lazy(()=>import('views/utilities/agents/AgentSignup')));
const AgentTable = Loadable(lazy(()=>import('views/utilities/agents/AgentTable')));
const EditAgent = Loadable(lazy(()=>import('views/utilities/agents/editAgent')));
const ViewAgent = Loadable(lazy(()=>import('views/utilities/agents/viewAgent')));
const ViewUsers = Loadable(lazy(()=>import('views/utilities/agents/viewUsers')));
const AgentsTable = Loadable(lazy(()=>import('views/utilities/agents/AgentsTable')));

//Reporting
const Reporting = Loadable(lazy(()=>import('views/utilities/reporting/MainReporting')));
const ViewDetails = Loadable(lazy(()=>import('views/utilities/reporting/ViewDetails')));



// Sub Panel routing
// const AuthLogin3 = Loadable(lazy(() => import('affilate/views/pages/authentication/authentication3/Login')));

// ==============================|| MAIN ROUTING ||============================== //



const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      // Redirect from root to '/dashboard'
      path: '/',
      element: <Navigate to="/admin/dashboard" replace />,
    },
    {
      path: '/admin/',
      children: [
        {
          path: 'dashboard',
          element: <DashboardDefault />,
        },
        {
          path: 'users',
          children:[
            {
              path:'all',
              element: <Users />,
            },
            {
              path: 'view/:id',
              element: <Views />,
            },
            {
              path: 'edit/:id',
              element: <EditUser />,
            },
          ]
        },
        {
          path:'disputes',
          children:[
            {
              path: 'all',
              element:<DisputePage />
            },
            {
              path: 'view/:id',
              element:<DisputeViews/>
            },
          ]
        },
        {
          path: 'transactions',
          element: <Transactions />
        },
        {
          path: 'algo',
          element: <Algo />
        },
        {
          path: 'game-history',
          children:[
            {
              path: 'all',
              element: <GameHistory />,
            },
            {
              path: 'view/:id',
              element: <ViewModel />
            }
          ]
        },
        {
          path: 'rewards',
          element: <Rewards />
        },
        {
          path: 'winrate',
          element: <WinRate />,
        },
        {
          path: 'static-pages',
          element: <StaticPage />,
        },
        {
          path: 'settings',
          element: <Settings />,
        },
        {
          path: 'reporting',
          children:[
            {
              path:'all',
              element: <Reporting />,
            },
            {
              path:'view/:id/type',
              element: <ViewDetails/>
            }
          ]
        },
        {
          path:'versions',
          children:[
            {
              path: 'all',
              element: <Versions />
            },
            {
              path: 'add-version',
              element : <AddVersion/>
            }
          ]
        },
        // {
        //   path: 'lottery',
        //   children:[
        //     {
        //       path:'draw',
        //       children:[
        //         {
        //           path:'all',
        //           element: <LotteryAddDraw/>
        //         },
        //         {
        //           path: 'add-draw',
        //           element: <AddDraw/>,
        //         },
        //         {
        //           path: 'edit-draw/:id',
        //           element: <EditDraw/>,
        //         }
        //       ]
              
        //     },
        //     // {
        //     //   path:'lottery-time',
        //     //   children:[
        //     //     // {
        //     //     //   path:'all',
        //     //     //   element: <LotteryTime/>
        //     //     // },
        //     //     {
        //     //       path: 'add-lottery-time',
        //     //       element: <AddLotteryTime/>,
        //     //     },
        //     //     {
        //     //       path: 'edit-lottery-time/:id',
        //     //       element: <EditLotteryTime/>,
        //     //     }
        //     //   ]
        //     // },
        //     // {
        //     //   path:'rooms',
        //     //   children:[
        //     //     {
        //     //       path:'all',
        //     //       element: <Rooms/>
        //     //     },
        //     //     {
        //     //       path: 'add-result/:id',
        //     //       element: <AddResult/>,
        //     //     },
        //     //     {
        //     //       path: 'view/:id',
        //     //       element: <ViewRoom/>,
        //     //     },
        //     //     {
        //     //       path:'ticket/:id',
        //     //       element: <ViewLotteryDetails/>,
        //     //     }
        //     //   ]
        //     // },
        //     {
        //       path:'history',
        //       children:[
        //         {
        //           path:'all',
        //           element:<History/>
        //         }
        //       ]
        //     },
        //     {
        //       path:'reporting',
        //       children:[
        //         {
        //           path:'all',
        //           element:<LotteryReporting/>
        //         }
        //       ]
        //     }
           
        //   ]
        // },
        // {
        //   path: 'agents',
        //   children:[
        //     {
        //       path:'all',
        //       element: <AgentTable/>
        //     },
        //     {
        //       path: 'edit-agent/:id',
        //       element: <EditAgent />
        //     }
        //   ]
        // }
       
      ],
    },

    // {
    //   path:'/agent/',
    //   children: [
    //     {
    //       path:'login',
    //       element: <AuthLogin3/>
    //     }
    //   ]
    // },
   
   
    {
      path: '*',
      element: <PageNotFound/>,
    },
    {
      path: '/agent',
      element: <AgentSignup/>,
    },
    {
      path: '/agents',
      element: <AgentTable/>,
    },
    
    {
      path: '/agents/edit/:id',
      element: <EditAgent />,
    },
    {
      path: '/agents/:id',
      element: <ViewAgent/>,
    },
    {
      path: '/agents/view/:role/:id',
      element: <ViewUsers/>,
    },
    {
      path:'/agents/view/:role/:id/:code',
      element: <AgentsTable/>
    }


    
  ],


  
};



export default MainRoutes;




 // {
        //   path: '/users/:id',
        //   element: <Views />,
        // },
        // {
        //   path: '/users/edit/:id',
        //   element: <EditUser />,
        // },
        // {
        //   path: 'dispute',
        //   element: <DisputePage />,
        // },
        // {
        //   path: '/dispute/:id',
        //   element: <DisputeViews />,
        // },
        // {
        //   path: 'transactions',
        //   element: <Transactions />,
        // },
        // {
        //   path: 'game-history',
        //   element: <GameHistory />,
        // },
        // {
        //   path: '/game-history/:id',
        //   element: <ViewModel />,
        // },
        // {
        //   path: '/rewards',
        //   element: <Rewards />,
        // },
        // {
        //   path: '/lottery/draw',
        //   element: <LotteryAddDraw/>,
        // },
        // {
        //   path: '/lottery/add-draw',
        //   element: <AddDraw/>,
        // },
        // {
        //   path: '/lottery/edit-draw/:id',
        //   element: <EditDraw/>,
        // },
        // {
        //   path: 'static-pages',
        //   children: [
        //     {
        //       path: '/static-pages',
        //       element: <StaticPage />,
        //     },
        //   ],
        // },
        // {
        //   path: 'settings',
        //   children: [
        //     {
        //       path: '/settings',
        //       element: <Settings />,
        //     },
        //   ],
        // },
        // {
        //   path: 'versions',
        //   children: [
        //     {
        //       path: '/versions',
        //       element: <Versions />,
        //     },
        //   ],
        // },
        // {
        //   path: '/versions/add-version',
        //   element: <AddVersion />,
        // },
        // {
        //   path: '/winrate',
        //   element: <AddWinRate />,
        // },





