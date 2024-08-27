import { style } from '@vanilla-extract/css';
import { vars } from '@/src/styles/vars.css';

export const container = style({
  height: '90vh',
  overflow: 'hidden',
  position: 'relative',
})

export const section = style({
  height: '90vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'transform 0.6s ease-in-out',
  fontSize: vars.fontSize['2x']
});

export const button = style({
  position: 'absolute',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  padding: '10px 20px',
  cursor: 'pointer',
})