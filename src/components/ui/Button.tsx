import { a, animated } from '@react-spring/web'
import clsx from 'clsx'
import type { JSX } from 'react'

export const Button = animated(
  ({ children, className, disabled, ...props }: JSX.IntrinsicElements['button']) => {
    const cornerBaseClassName =
      'absolute size-4 group-hover:size-full group-active:size-full transition-[width,height] ease-in'

    return (
      <a.button
        className={clsx(
          'min-w-22 pointer-events-auto cursor-pointer hover:bg-white/20 active:bg-white/20 group transition-[background] relative text-center px-2 py-1',
          disabled && 'pointer-events-none opacity-50',
          className,
        )}
        disabled={disabled}
        {...props}
      >
        {children}

        {/* Corners */}
        <span className={clsx(cornerBaseClassName, 'top-0 left-0 border-t-2 border-l-2')} />
        <span className={clsx(cornerBaseClassName, 'top-0 right-0 border-t-2 border-r-2')} />
        <span className={clsx(cornerBaseClassName, 'bottom-0 left-0 border-b-2 border-l-2')} />
        <span className={clsx(cornerBaseClassName, 'bottom-0 right-0 border-b-2 border-r-2')} />
      </a.button>
    )
  },
)
