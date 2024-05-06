import type { DropdownItemType } from 'types/Component'

import styles from './dropdownitem.module.scss'

const DropdownItem = ({ data, dropdownType, isSelected, isMulti }: DropdownItemType) => {
  return (
    <button onClick={data?.handle} className={styles.dropdownitemContainer} type='button'>
      <div>
        {data?.image && ((typeof data?.image === 'string') ? <img src={data?.image} alt={data?.label} /> : data?.image)}
        <label className={styles.label}>{data?.label}</label>
      </div>
      {isMulti && dropdownType === 'select' && !data?.handle ? <input type="checkbox" readOnly checked={isSelected} /> : null}
    </button>
  )
}

export default DropdownItem
