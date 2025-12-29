import { a, animated } from '@react-spring/web'
import clsx from 'clsx'
import type { JSX } from 'react'

export const TextArea = animated(({ className, ...props }: JSX.IntrinsicElements['textarea']) => {
  return (
    <a.textarea
      className={clsx(
        'border-b border-white outline-none ring-0 bg-white/20 font-satisfy resize-none leading-4 py-2 caret-white overflow-hidden',
        className,
      )}
      {...props}
    />
  )
})
