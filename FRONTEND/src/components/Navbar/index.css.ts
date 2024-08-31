import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/vars.css';
import { columnWrapper } from '@/styles/wrapper.css';
import { start } from 'repl';

// 메인 네비바
export const navbar = style({
  height: '70px',
  backgroundColor: vars.colors.lightOrange,
  margin: 0,
  padding: `0 ${vars.space['3x']}`,
  display: 'flex',
  alignItems: 'center',
});

export const leftMenu = style({
  marginRight: 'auto',
  padding: '0 50px 0 0',
});

export const rightMenu = style({
  marginLeft: 'auto',
});

export const menuLink = style({
  color: vars.colors.black,
  textDecoration: 'none',
  fontSize: vars.fontSize['1.5x'],
  margin: `0 ${vars.space['2x']}`,
  transition: 'color 0.3s ease',
});

export const menuLinkHover = style({
  selectors: {
    '&:hover': {
      color: vars.colors.orange,
    },
  },
});

// 버티컬 네비바
export const verticalContainer = style([
  columnWrapper,
  {
    width: '200px',
    backgroundColor: vars.colors.lightOrange,
    fontSize: vars.fontSize['1.5x'],
    padding: vars.space['2x'],
    height: '100vh',
    gap: vars.space['2x'],
    position: 'sticky',
    top: 0,
    bottom: 0,
  }
])