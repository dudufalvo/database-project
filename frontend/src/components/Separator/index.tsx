import React from 'react'

import styles from './separator.module.scss'

type SeparatorType = {
  children?: React.ReactNode | string,
  color?: 'greenTwo' | 'gray'
}

const Separator = ({ children, color = 'greenTwo' }: SeparatorType) => {
  return (
    <div className={styles.separator}>
      {
        children &&
        (<>
          <div className={color === 'greenTwo' ? styles.greenTwo : styles.gray}></div>
          <span>{children}</span>
        </>)
      }
      <div className={color === 'greenTwo' ? styles.greenTwo : styles.gray}></div>
    </div>
  )
}

export default Separator
