import { a, animated } from '@react-spring/web'
import clsx from 'clsx'
import { useState, type JSX } from 'react'

export const TextArea = animated(
  ({
    className,
    style,
    onChange,
    onFocus,
    maxLength,
    ...props
  }: JSX.IntrinsicElements['textarea']) => {
    const [counter, setCounter] = useState(0)

    return (
      <a.div className="relative font-satisfy" style={style}>
        <textarea
          className={clsx(
            'border-b border-white outline-none ring-0 bg-white/20 resize-none leading-4 py-2 caret-white overflow-hidden placeholder:text-sm placeholder:text-gray-50 placeholder:opacity-50',
            className,
          )}
          onFocus={e => {
            onFocus?.(e)
            setCounter(e.target.value.length)
          }}
          onChange={e => {
            setCounter(e.target.value.length)
            onChange?.(e)
          }}
          maxLength={maxLength}
          {...props}
        />
        {maxLength && (
          <span
            className={clsx('absolute -bottom-0.5 right-0 text-[7px] text-white', {
              'text-yellow-600': counter >= maxLength - 10 && counter < maxLength - 5,
              'text-rose-600': counter >= maxLength - 5,
            })}
          >
            {counter}/{maxLength}
          </span>
        )}
      </a.div>
    )
  },
)
