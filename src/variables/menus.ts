
import { Setting, HomeFilled, User } from '@element-plus/icons-vue';

interface MenuItemProps {
  path: string;
  label: string;
  icon?: any;
  children?: MenuItemProps[];
}

const menus: MenuItemProps[] = [
  { path: '/home', label: '首页', icon: HomeFilled },
  {
    path: '/',
    label: '系统管理',
    icon: Setting,
    children: [
      { path: '/system/user', label: '用户管理' },
      { path: '/system/role', label: '角色管理' },
      { path: '/system/log', label: '系统日志' },
    ],
  },
  {
    path: '/',
    label: '客户管理',
    icon: User,
    children: [
      { path: '/client/info', label: '客户管理' },
    ],
  },
  
];

export default menus;