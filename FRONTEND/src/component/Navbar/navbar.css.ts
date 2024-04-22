import { style } from '@vanilla-extract/css';

export const navbar = style({
  height: '50px',
  backgroundColor: '#ffdd9e',
  margin: 0,
  padding: '0 20px 0 20px',
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
