import { useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { BiCloudUpload } from 'react-icons/bi'
import { BiPlus, BiTrash } from 'react-icons/bi'

import styles from './inputfile.module.scss'

import Button from 'components/Button'
import InputMain from 'components/Form/InputMain'

const width = '1.5rem'
const height = '1.5rem'

const widthTrash = '1rem'
const heightTrash = '1rem'

type InputFileType = {
  label: string,
  name: string,
  isMulti?: boolean
}

const InputFile = ({ label, name, isMulti = false }: InputFileType) => {
  const [selectedFiles, setSelectedFiles] = useState<Array<File>>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const { register, setValue } = useFormContext()

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target

    if (!files) return

    if (!isMulti) {
      setSelectedFiles([files[0]])
      return
    }

    const filteredNewFiles = Array.from(files).filter(file => !selectedFiles.some(selectedFile => selectedFile.name === file.name))
    const updatedSelectedFiles = [...selectedFiles, ...filteredNewFiles]
    if (updatedSelectedFiles.length > 5) updatedSelectedFiles.splice(5, updatedSelectedFiles.length - 5)
    setSelectedFiles(updatedSelectedFiles)
  }

  const handleRemove = (index: number) => {
    const newSelectedFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(newSelectedFiles)
  }

  useEffect(() => {
    setValue(name, selectedFiles)
  }, [name, setValue, selectedFiles])

  return (
    <InputMain label={label} name={name} id={name} >
      <div className={styles.inputFile} onClick={() => !selectedFiles.length && handleClick()} >
        {selectedFiles.length === 0 ?
          <div className={styles.inputFileText} >
            <BiCloudUpload size="1.5rem" />
            <span>Upload image(s)</span>
          </div>
          :
          <div className={styles.inputFileImage}>
            <div className={styles.inputFileGrid}>
              {selectedFiles && selectedFiles.map((file: File, index: number) => (
                <div>
                  <img key={index} src={URL.createObjectURL(file)} alt="preview" />
                  <Button handle={() => handleRemove(index)} variant='outlined' ><BiTrash style={{ width: widthTrash, height: heightTrash }} /></Button>
                </div>
              ))}
            </div>
            {isMulti && selectedFiles.length < 5 && <Button handle={handleClick}><BiPlus style={{ width, height }} /></Button>}
          </div>}
        <input {...register(name)} type="file" accept='image/*' multiple ref={inputRef} onChange={handleFileChange} />
      </div>
    </InputMain>
  )
}

export default InputFile
