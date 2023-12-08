import { MainNavigationConfigInterface } from "../../libs/types";

export const mainNavigationConfig = (t): MainNavigationConfigInterface[] => [
  {
    title: t('main_menu.submissions'),
    name: 'submissions',
    path: 'submissions',
    iconName: 'library',
  },
  {
    title: t('main_menu.admin'),
    name: 'admin ',
    path: 'administration',
    iconName: 'admin',
  },
];