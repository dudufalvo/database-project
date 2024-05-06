import type { StylesConfig } from 'react-select'
import type { DropdownOptionType } from 'types/Component'

export const dropDownStyles: StylesConfig<DropdownOptionType, boolean> = {
  control: (provided, state) => ({
    ...provided,
    width: '100%',
    height: '2.5rem',
    boxShadow: 'none',
    backgroundColor: state.isDisabled ? '#F5F5F5' : '#FFFFFF',
    border: state.menuIsOpen ? '1px solid #65976A' : '1px solid #E9E9E9',
    borderRadius: '0.3125rem',
    cursor: 'pointer',
    '&:hover': {
      border: '1px solid #65976A',
      transition: 'border 0.2s ease-in-out'
    }
  }),
  placeholder: (provided, state) => ({
    ...provided,
    color: state.isDisabled ? '#C8C8C8' : '#909090'
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.isDisabled ? '#C8C8C8' : '#909090'
  }),
  clearIndicator: provided => ({
    ...provided,
    color: '#909090',
    '&:hover': {
      color: '#909090'
    }
  }),
  group : provided => ({
    ...provided,
    transition: 'all 0.2s ease-in-out'
  }),
  indicatorsContainer: provided => ({
    ...provided,
    padding: '0',
    div: {
      padding: '0 0.125rem'
    }
  }),
  indicatorSeparator: provided => ({
    ...provided,
    display: 'none'
  }),
  menu: provided => ({
    ...provided,
    width: '100%',
    borderRadius: '0.3125rem',
    border: '1px solid #65976A',
    boxShadow: 'none'
  }),
  menuList: provided => ({
    ...provided,
    padding: '0'
  }),
  option: (provided, state) => ({
    ...provided,
    padding: '0',
    borderRadius: '0.3125rem',
    borderBottom: '0.5px solid #E9E9E9',
    backgroundColor: state.isSelected ? '#eaf3ea' : '#FFFFFF',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#eaf3ea'
    }
  })
}
