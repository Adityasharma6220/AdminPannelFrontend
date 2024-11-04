// assets
import { IconTypography, IconPalette, IconShadow, IconPokerChip} from '@tabler/icons';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconPokerChip
};

// ==============================|| LOTTERY MENU ITEMS ||============================== //

const lottery = {
  id: 'lottery',
  title: 'menu.lottery',
  type: 'group',
  children: [
    {
      id: 'lottery',
      title: 'menu.lottery',
      type: 'collapse',
      icon: icons.IconPokerChip,
      children: [
        {
          id: 'draw',
          title: 'menu.draw',
          type: 'item',
          url: '/admin/lottery/draw/all',
          breadcrumbs: false
        },
        {
          id: 'lottery-time',
          title: 'menu.lotteryTime',
          type: 'item',
          url: '/admin/lottery/lottery-time/all',
          breadcrumbs: false
        },
        {
          id: 'lottery-rooms',
          title: 'menu.lotteryRooms',
          type: 'item',
          url: '/admin/lottery/rooms/all',
          breadcrumbs: false
        },
        {
          id: 'lottery-history',
          title: 'menu.lotteryHistory',
          type: 'item',
          url: '/admin/lottery/history/all',
          breadcrumbs: false
        },
        {
          id: 'lottery-reportong',
          title: 'menu.lotteryReporting',
          type: 'item',
          url: '/admin/lottery/reporting/all',
          breadcrumbs: false
        },
        
      ]
    }
  ]
};

export default lottery;
