import { BiX } from 'react-icons/bi'

import styles from './tag.module.scss'

type TagType = {
  children: React.ReactNode,
  isDisabled?: boolean,
  value?: string,
  handle?: (value: string) => void
}

const Tag = ({ children, isDisabled = false, value, handle }: TagType) => {
  return (
    <div className={`${styles.tag} ${handle && styles.interactive} ${isDisabled && styles.disabled}`}>
      {children}
      {handle && <button onClick={() => value && handle?.(value)} type='button'><BiX className={styles.tagButton} /></button>}
    </div>
  )
}

export default Tag
