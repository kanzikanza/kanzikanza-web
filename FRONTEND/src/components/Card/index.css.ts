import { style } from '@vanilla-extract/css'
import { vars } from '../../styles/vars.css'

export const card = style({
  border: `1px solid ${vars.colors.black}`,
  background: vars.colors.white,
  borderRadius: vars.borderRadius['1x'],
  // margin: `${vars.space['2x']}`,
  padding: `${vars.space['2x']}`
})