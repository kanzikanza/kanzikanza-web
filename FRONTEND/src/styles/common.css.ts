import { style, globalStyle } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from "./vars.css";

export const pageTitle = style({
  fontSize: vars.fontSize['4x'],
})

export const pageMiniTitle = style({
  fontSize: vars.fontSize['2x'],
})

export const flex = recipe({
  base: {
    display: 'flex',
    // width: '100%',
  },
  variants: {
    align: {
      start: {
        alignItems: 'flex-start'
      },
      center: {
        alignItems: 'center'
      },
      end: {
        alignItems: 'flex-end'
      },
    },
    justify: {
      start: {
        justifyContent: 'flex-start'
      },
      center: {
        justifyContent: 'center'
      },
      end: {
        justifyContent: 'flex-end'
      },
      between: {
        justifyContent: 'space-between'
      },
      around: {
        justifyContent: 'space-around'
      }
    },
    direction: {
      row: {
        flexDirection: 'row'
      },
      column: {
        flexDirection: 'column'
      },
    },
  }
})