import { globalStyle } from '@vanilla-extract/css';

globalStyle('input, textarea, button, a', {
  all: 'unset', 
  boxSizing: 'border-box', 
  fontFamily: 'inherit',
  fontSize: '100%',
  lineHeight: '1.15',
  margin: 0,
  padding: 0,
  color: 'inherit',
  backgroundColor: 'transparent',
  border: 'none',
  outline: 'none',
  whiteSpace: 'inherit',
});

globalStyle('button, a', {
  cursor: 'pointer',
})