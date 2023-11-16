import {
  createTheme,
  Theme,
  ThemeOptions
} from '@mui/material/styles';

const DARK_BLUE = '#019cb3';
const BLUE = '#006c75';
const DARK_GREY = '#474850';
const LIGHT_GREY = '#798395';
export const theme = createTheme({
  palette: {
    backgroundColor: {
      light: '#ffffff',
      main: '#f5f3fa',
      dark: '#eeeef4',
      header: '#3a4451',
      icon: '#eeeef4',
    },
    primary: {
      dark: '#3b1a4d',
      main: '#006c75',
      light: '#7145a5',
      contrastText: '#ffffff',
    },
    purple: {
      main: '#45A5A1',
    },
    info: {
      main: '#709dfe',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#adafd3',
      contrastText: '#ffffff',
    },
    success: {
      main: '#79d082',
      contrastText: '#ffffff',
    },
    error: {
      main: '#f33889',
      contrastText: '#ffffff',
    },
    borderColor: { main: '#cac3d2', light: '#f4f1f7' },
    divider: '#cac3d2',
    textColor: {
      primary: DARK_BLUE, // dark blue
      secondary: DARK_GREY, // grey - text
      label: LIGHT_GREY, // light grey - text
      header: BLUE, // blue
    },
    darkGrey: {
      main: '#616161',
      contrastText: '#ffffff',
    },
  },
  customShadows: [
    '0 3px 13px 0 rgba(0,0,0,0.16)',
    '0px 7px 13px -7px rgb(0 0 0 / 16%)',
    '0 2px 4px 0 rgba(0,0,0,0.1);',
  ],
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        elevation1: { boxShadow: '0 3px 13px 0 rgba(0,0,0,0.16)' },
        elevation2: {
          boxShadow: '0px 7px 13px -7px rgb(0 0 0 / 16%)',
        },
        elevation3: {
          boxShadow: '0 2px 4px 0 rgba(0,0,0,0.1);',
        },
      },
    },
  },
  typography: {
    allVariants: {
      color: BLUE,
      fontSize: '14px',
    },
    body2: {
      color: DARK_GREY,
      fontSize: '14px',
      fontWeight: 400,
    },
    h1: {
      color: BLUE,
      fontSize: '24px',
    },
    h2: {
      color: BLUE,
      fontSize: '18px',
      fontWeight: 600,
    },
    subtitle1: {
      color: LIGHT_GREY,
      fontSize: '12px',
      fontWeight: 600,
    },
    subtitle2: {
      color: DARK_GREY,
      fontSize: '12px',
      fontWeight: 400,
    },
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
} as ThemeOptions) as Theme;
