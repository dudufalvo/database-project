import { useState } from 'react'

import styles from './account.module.scss'

import Settings from 'components/Account/Settings'
import Button from 'components/Button'
import { DeleteAccountModal } from 'components/Modals'
import Tabs from 'components/Tab'
import Notifications from 'components/Account/Notifications'

const Account = () => {
  const [deleteModal, setDeleteModal] = useState(false)

  return (
    <>
      <div className={styles.accountOptions}>
        <div className={styles.accountOptionsContent}>
          <h1>Account</h1>
          <Button variant='outlined' children='Delete account' handle={() => setDeleteModal(true)} />
        </div>
        <Tabs
          tabs={[
            { title: 'Settings', children: <Settings /> },
            { title: 'Notifications', children: <Notifications /> },
            { title: 'My Reservations', children: <Settings /> }
          ]} />
      </div>
      <DeleteAccountModal isOpen={deleteModal} handleClosing={() => setDeleteModal(false)} />
    </>
  )
}

export default Account
