import { vars } from '@/styles/vars.css';
import { columnWrapper, rowWrapper } from '@/styles/wrapper.css';
import { style } from '@vanilla-extract/css';

export const DashboardContainer = style([
  columnWrapper,
  {
    gap: vars.space['3x']
  }
])

