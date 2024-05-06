import * as React from 'react'
import { useSearchParams } from 'react-router-dom'

import type { SingleValue } from 'react-select'
import type { DropdownOptionType, TabType } from 'types/Component'

import styles from './tab.module.scss'

import SelectDropdown from 'components/SelectDropdown'

type TabsProps = {
  tabs: TabType[]
}

const turnKebabCase = (str: string) => str.toLowerCase().replace(/\s+/g, '-')

const Tabs = ({ tabs }: TabsProps) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedTab, setSelectedTab] = React.useState<TabType>({ title: '', children: '' })
  const dropdownOptions: DropdownOptionType[] = tabs.map((tab: TabType) => ({
    value: turnKebabCase(tab.title),
    label: tab.title
  }))

  const handleTabClick = (tab: TabType) => {
    setSearchParams({ tab: turnKebabCase(tab.title) })
    setSelectedTab(tab)
  }

  React.useEffect(() => {
    const tabFromUrl = searchParams.get('tab')
    if (!tabFromUrl) return

    const tab = tabs.find((tab: TabType) => turnKebabCase(tab.title) === tabFromUrl)
    if (tab) setSelectedTab(tab)
  }, [searchParams, tabs])

  return (
    <div>
      <div className={styles.dropdownContainer}>
        <SelectDropdown
          type='select'
          options={dropdownOptions}
          sendOptionsToParent={data => {
            const newData = data as SingleValue<DropdownOptionType>
            if (newData?.value) {
              setSearchParams({ tab: newData.value })
              const tab = tabs.find((tab: TabType) => turnKebabCase(tab.title) === newData.value)
              if (tab) setSelectedTab(tab)
            }
          }}
          defaultOption={{ value: turnKebabCase(selectedTab.title), label: selectedTab.title }}
        />
      </div>
      <div className={styles.tabs}>
        {tabs.length && tabs.map((tab: TabType) => (
          <button
            key={tab.title}
            className={`${styles.tab} ${selectedTab.title === tab.title ? styles.active : ''}`}
            onClick={() => handleTabClick(tab)}
          >
            <span>{tab.title}</span>
          </button>
        ))}
      </div>
      {selectedTab && selectedTab.children}
    </div>
  )
}

export default Tabs
