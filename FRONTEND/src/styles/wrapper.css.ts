import { flex } from './common.css';

export const columnWrapper = flex({
  direction: 'column',
  align: 'center',
});

export const rowWrapper = flex({
  direction: 'row',
  align: 'center',
})

export const centerWrapper = flex({
  justify: 'center',
  align: 'center',
})

export const betweenWrapper = flex({
  direction: 'row',
  align: 'center',
  justify: 'between',
})

export const startWrapper = flex({
  direction: 'row',
  align: 'center',
  justify: 'start',
})

export const endWrapper = flex({
  direction: 'row',
  align: 'center',
  justify: 'end',
})