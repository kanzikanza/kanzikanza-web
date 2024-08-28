import { style } from '@vanilla-extract/css';
import { columnWrapper } from '@/styles/wrapper.css';
import { vars } from '@/styles/vars.css';

export const container = style([
	columnWrapper,
	{
		gap: vars.space['2x']
	}
])

export const goJoin = style({

})