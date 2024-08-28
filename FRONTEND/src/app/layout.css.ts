import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '../styles/vars.css';

globalStyle('html', {
  backgroundColor: vars.colors.white,
});

globalStyle('body', {
  margin: '0 auto',
  padding: vars.space.none,
  backgroundColor: vars.colors.white,
});

// 이게 적용되는지 모르겠네
// globalStyle('textarea', {
//   fontFamily: 'pretendard',
// });

export const container = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 500,
  margin: `0 ${vars.space['3x']}`,
  // padding: vars.space['3x'],
});
