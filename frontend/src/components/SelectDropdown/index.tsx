import { useState, useEffect } from 'react'
import { BiSearchAlt2, BiChevronDown } from 'react-icons/bi'
import { components as defaultComponents } from 'react-select'
import AsyncSelect from 'react-select/async'

import type { SingleValue, MultiValue, ControlProps } from 'react-select'
import type { OptionProps, DropdownIndicatorProps } from 'react-select'
import type { DropdownOptionType } from 'types/Component'

import styles from './selectdrop.module.scss'
import { dropDownStyles } from './styles'

import DropdownItem from 'components/DropdownItem'
import Tag from 'components/Tag'

const width = '1.75rem'
const height = '1.75rem'

const widthSearch = '1.25rem'
const heightSearch = '1.25rem'
const transition = 'color 0.3s ease-in-out'

type SelectDropdownType = {
  type: 'select' | 'search',
  options?: DropdownOptionType[],
  label?: string,
  autoFocus?: boolean,
  isDisabled?: boolean,
  isMulti?: boolean,
  isClearable?: boolean,
  isSearchable?: boolean,
  name?: string,
  placeholder?: string,
  addExtraOption?: DropdownOptionType,
  disableTags?: boolean,
  defaultOption?: DropdownOptionType | null,
  loadOptions?: (inputValue: string, callback: (options: DropdownOptionType[]) => void) => void,
  sendOptionsToParent: (newValue: SingleValue<DropdownOptionType> | MultiValue<DropdownOptionType>) => void
}

export type CustomOptionProps = OptionProps<DropdownOptionType, boolean>;

const SelectDropdown = ({
  type,
  defaultOption,
  options,
  label,
  autoFocus,
  isDisabled = false,
  isSearchable = false,
  isClearable = false,
  isMulti = false,
  name,
  placeholder = 'Select',
  addExtraOption,
  disableTags = false,
  loadOptions,
  sendOptionsToParent
}: SelectDropdownType) => {
  const [selectedOptions, setSelectedOptions] = useState<DropdownOptionType[] | null>([])

  const CustomControl = ({ children, ...props }: ControlProps<DropdownOptionType>) => {
    return (
      <defaultComponents.Control {...props} className={styles.controlIcon} >
        {type === 'search' &&
          <BiSearchAlt2 style={{ width: widthSearch, height: heightSearch, color: props.selectProps.menuIsOpen ? '#161616' : '#909090', transition }} />}
        {children}
      </defaultComponents.Control>
    )
  }

  const CustomOption = (props: CustomOptionProps) => {
    return (
      <defaultComponents.Option {...props}>
        <DropdownItem dropdownType={type} {...props} />
      </defaultComponents.Option>
    )
  }

  const CustomIndicator = (props: DropdownIndicatorProps<DropdownOptionType>) => {
    const transform = props.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)'
    const transition = 'transform 0.3s'

    return (
      <defaultComponents.DropdownIndicator {...props}>
        <div className={`${type === 'select' ? styles.indicatorContainer : styles.hideIndicator}`}>
          <BiChevronDown style={{ transform, transition, width, height }} />
        </div>
      </defaultComponents.DropdownIndicator>
    )
  }

  const storeOptions = (newValue: SingleValue<DropdownOptionType> | MultiValue<DropdownOptionType>) => {
    sendOptionsToParent(newValue)
    if (!disableTags) setSelectedOptions(newValue as DropdownOptionType[])
  }

  const handleRemoveOption = (value: string) => {
    if (!selectedOptions) return

    const newOptions = selectedOptions.filter(option => option.value !== value)
    storeOptions(newOptions)
  }

  useEffect(() => {
    if (!options || !addExtraOption) return

    const hasAddExtraOption = options.some(option => option.value === addExtraOption.value)

    if (hasAddExtraOption) return

    options.push(addExtraOption)
  }, [addExtraOption, options])

  return (
    <label className={styles.selectContainer}>
      {label}
      <AsyncSelect
        name={name}
        defaultOptions={options}
        loadOptions={loadOptions}
        autoFocus={autoFocus}
        isDisabled={isDisabled}
        isSearchable={type === 'search' || isSearchable}
        isClearable={isClearable}
        isMulti={isMulti}
        hideSelectedOptions={false}
        closeMenuOnSelect={!isMulti}
        controlShouldRenderValue={!isMulti}
        placeholder={placeholder}
        blurInputOnSelect={false}
        value={defaultOption || selectedOptions}
        components={{ Option: CustomOption, DropdownIndicator: CustomIndicator, Control: CustomControl }}
        styles={dropDownStyles}
        onChange={storeOptions}
      />
      <div className={styles.optionsContainer}>
        {isMulti && !disableTags
          ? selectedOptions?.map((option, index) => <Tag key={index} value={option.value} handle={handleRemoveOption} >{option.label} </Tag>)
          : null}
      </div>
    </label>
  )
}

export default SelectDropdown
