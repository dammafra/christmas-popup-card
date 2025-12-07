import { useDebug } from '@hooks'
import clsx from 'clsx'
import { Leva } from 'leva'

export function GUI() {
  const debug = useDebug()

  return (
    <div
      className={clsx(
        'absolute right-0 bottom-0 top-17 w-77.5 opacity-90 z-9999 overflow-scroll pointer-events-none [&>*]:pointer-events-auto',
        { hidden: !debug },
      )}
    >
      {/* See https://github.com/pmndrs/leva/issues/552 */}
      <Leva
        hidden={!debug}
        fill
        flat
        titleBar={{ drag: false }}
        theme={{ colors: { elevation2: '#242424' } }}
      />
    </div>
  )
}
