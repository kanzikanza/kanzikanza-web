import { style } from '@vanilla-extract/css';
import { vars } from '@/src/styles/vars.css';

export const navbar = style({
  height: '50px',
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
  color: '#333',
  textDecoration: 'none',
  fontSize: '16px',
  margin: '0 15px',
  transition: 'color 0.3s ease',
});

export const menuLinkHover = style({
  selectors: {
    '&:hover': {
      color: '#ff6347',
    },
  },
});
