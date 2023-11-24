interface MainNavigationConfigInterface {
  title: string;
  name: string;
  path: string;
  iconName: string;
}

export const appConfig: MainNavigationConfigInterface[] = [
  {
    title: 'Submissions',
    name: 'submissions',
    path: 'submissions',
    iconName: 'library',
  },
  {
    title: 'Administration',
    name: 'admin ',
    path: 'administration',
    iconName: 'admin',
  },
];
