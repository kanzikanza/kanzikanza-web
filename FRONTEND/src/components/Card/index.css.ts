import { style } from '@vanilla-extract/css'
import { vars } from '../../styles/vars.css'

export const card = style({
  background: vars.colors.white,
  transition: '0.3s',
  borderRadius: vars.borderRadius['1x'],
  margin: `${vars.space['2x']} 0`,
  padding: `${vars.space['2x']}`
})