import { vars } from '@/styles/vars.css';
import { columnWrapper, rowWrapper } from '@/styles/wrapper.css';
import { style } from '@vanilla-extract/css';

export const StreakContainer = style([
  columnWrapper,
  {
    gap: vars.space['1x']
  }
])

// StreakCard
export const StreakText = style([
  rowWrapper,
  {
    alignItems: 'center',
  }
])

export const StreakCalendar = style([
  rowWrapper,
  {
    backgroundColor: vars.colors.gray
  }
])


