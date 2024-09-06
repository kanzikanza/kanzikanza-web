import { globalStyle } from '@vanilla-extract/css';
import { vars } from './vars.css';

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

globalStyle ('hr', {
  width: '100%',
  margin: `${vars.space['1x']} 0 ${vars.space['1x']} 0`,
  padding: 0,
  border: 'none',
  borderBottom: `1px solid ${vars.colors.darkOrange}`,
})