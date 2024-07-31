import { Button, Input, Modal, Select } from 'antd'
import React, { FC, useState } from 'react'
import useTodoStore from '../stores/todoStore'
import { TFilter } from '../types'
import { ButtonContainer, HeaderContainer, ModalContainer } from '../styles/sharedStyles'

const { Option } = Select

const inputStyle: React.CSSProperties = {
  height: '50px',
  width: '100%',
}

const selectStyle: React.CSSProperties = {
  width: '200px',
}

const HeaderContent: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { filter, setFilter, addTodo } = useTodoStore()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    const newTask = {
      title,
      description,
      status: 'notCompleted',
    }
    addTodo(newTask)
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <HeaderContainer>
      <ButtonContainer>
        <Button onClick={showModal}>Add Task</Button>
        <Select style={selectStyle} value={filter} onChange={(value: TFilter) => setFilter(value)}>
          <Option value='ALL'>Все</Option>
          <Option value='COMPLETED'>Выполненные</Option>
          <Option value='NOT_COMPLETED'>Не выполненные</Option>
          <Option value='FAVORITE'>Избранное</Option>
        </Select>
      </ButtonContainer>
      <Modal
        title='Добавить задачу'
        okText='Создать'
        cancelText='Отмена'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <ModalContainer>
          <Input
            placeholder='Название задачи'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
          />
          <Input
            placeholder='Описание задачи'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={inputStyle}
          />
        </ModalContainer>
      </Modal>
    </HeaderContainer>
  )
}

export default HeaderContent
