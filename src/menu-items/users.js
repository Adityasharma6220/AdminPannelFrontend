// assets
import { IconUsers, IconSpeakerphone, IconFileInfo, IconSettings, IconCash,IconDeviceGamepad2,IconCrown,IconGitPullRequest,IconBadgeAr,IconWaveSawTool,IconReportAnalytics, IconGoGame
} from '@tabler/icons';

// constant
const icons = {
  IconUsers,
  IconSpeakerphone,
  IconFileInfo,
  IconSettings,
  IconCash,
  IconDeviceGamepad2,
  IconCrown,
  IconGitPullRequest,
  IconBadgeAr,
  IconWaveSawTool,
  IconReportAnalytics,
  IconGoGame

};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const users = {
  id: 'users',
  title: '',
  type: 'group',
  children: [
    {
      id: 'users',
      title: 'menu.users',
      type: 'item',
      url: '/admin/users/all',
      icon: icons.IconUsers,
      breadcrumbs: false
    }, 
    {
        id: 'transactions',
        title: 'menu.transactions',
        type: 'item',
        url: '/admin/transactions',
        icon: icons.IconCash,
        breadcrumbs: false
    },
    {
        id: 'reporting',
        title: 'menu.reporting',
        type: 'item',
        url: '/admin/reporting/all',
        icon: icons.IconReportAnalytics,
        breadcrumbs: false
    },
    {
      id: 'game-history',
      title: 'menu.gameHistory',
      type: 'item',
      url: '/admin/game-history/all',
      icon: icons.IconDeviceGamepad2,
      breadcrumbs: false
    },
    // {
    //   id: 'dispute',
    //   title: 'menu.disputes',
    //   type: 'item',
    //   url: '/admin/disputes/all',
    //   icon: icons.IconSpeakerphone,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'rewards',
    //   title: 'menu.rewards',
    //   type: 'item',
    //   url: '/admin/rewards',
    //   icon: icons.IconCrown,
    //   breadcrumbs: false
    // },
    {
      id: 'algo',
      title: 'menu.algo',
      type: 'item',
      url: '/admin/algo',
      icon: icons.IconGoGame,
      breadcrumbs: false
    },
    {
      id: 'static-pages',
      title: 'menu.staticPages',
      type: 'item',
      url: '/admin/static-pages',
      icon: icons.IconFileInfo,
      breadcrumbs: false
    },
    {
      id: 'settings',
      title: 'menu.settings',
      type: 'item',
      url: '/admin/settings',
      icon: icons.IconSettings,
      breadcrumbs: false
      
    },
    {
      id: 'winrate',
      title: 'menu.winRate',
      type: 'item',
      url: '/admin/winrate',
      icon: icons.IconWaveSawTool,
      breadcrumbs: false
      
    },
    // {
    //   id: 'versions',
    //   title: 'menu.versions',
    //   type: 'item',
    //   url: '/admin/versions/all',
    //   icon: icons.IconGitPullRequest,
    //   breadcrumbs: false
      
    // },
    // {
    //   id: 'agent',
    //   title: 'menu.agents',
    //   type: 'item',
    //   url: '/admin/agents/all',
    //   icon: icons.IconBadgeAr,
    //   breadcrumbs: false
      
    // }
  ]
};

export default users;
