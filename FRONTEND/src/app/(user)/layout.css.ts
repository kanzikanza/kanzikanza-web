import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';
import { centerWrapper } from '@/styles/wrapper.css';

// HTML 및 body에 대한 기본 스타일을 리셋
globalStyle('html, body', {
  padding: vars.space.none,
  margin: vars.space.none,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
});

// 모든 요소에 대한 box-sizing을 border-box로 설정
globalStyle('*, *:before, *:after', {
  boxSizing: 'border-box'
})

export const layout = style({
  display: 'flex',
  width: '100%',
  flexDirection: 'row',
});

export const container = style({
  flexGrow: 1,
  padding: `${vars.space['4x']} 120px`,
});
