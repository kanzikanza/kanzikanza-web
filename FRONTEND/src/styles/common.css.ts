import { style, globalStyle } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from "./vars.css";

export const plainLine = style({
  width: '100%',
  margin: `${vars.space['1x']} 0 ${vars.space['1x']} 0`,
  padding: 0,
  border: 'none',
  borderBottom: `1px solid ${vars.colors.black}`,
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