import { useEffect, useState } from 'react'
import ReactModal from 'react-modal'

import type { FieldValues, UseFormReturn } from 'react-hook-form'
import type { ModalBaseType } from 'types/Component'

import styles from './modalwrapper.module.scss'

import Button from 'components/Button'

type ModalType<T extends FieldValues> = ModalBaseType & {
  children: React.ReactNode,
  title: string,
  minWidth?: string,
  submitTxt?: string,
  alwaysAble?: boolean,
  methods: UseFormReturn<T>,
  handleCreating: (data: T) => void
}

ReactModal.setAppElement('#root')

const ModalWrapper = <T extends FieldValues>({
  minWidth = '34.5rem',
  children,
  title,
  alwaysAble = false,
  isOpen,
  submitTxt = 'Create',
  methods,
  handleClosing,
  handleCreating
}: ModalType<T>) => {
  const [width, setWidth] = useState(window.innerWidth < 900 ? 0 : minWidth)

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth < 900 ? 0 : minWidth)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup the event listener when the component unmounts
    return () => window.removeEventListener('resize', handleResize)
  }, [minWidth])

  return (
    <ReactModal
      id={title}
      isOpen={isOpen}
      closeTimeoutMS={50}
      onRequestClose={handleClosing}
      className={styles.modalContent}
      overlayClassName={styles.modalOverlay}
      contentLabel={title}
      style={{ content: { minWidth: width }, overlay: { zIndex: 4 } }}
    >
      <div className={styles.modalFields}>
        <h1 className={styles.modalTitle}>{title}</h1>
        {children}
      </div>
      <div className={styles.modalButtons}>
        <Button type='submit' fullWidth variant='outlined' handle={handleClosing}>Cancel</Button>
        <Button type='submit' disabled={!alwaysAble && !methods.formState.isDirty} fullWidth variant='filled' handle={methods.handleSubmit(handleCreating)}>
          {submitTxt}
        </Button>
      </div>
    </ReactModal >
  )
}

export default ModalWrapper
