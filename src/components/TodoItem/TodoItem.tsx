import React, { useEffect, useState } from 'react'
import useTodoStore from '../../stores/todoStore'
import { Button, Input, List, Modal } from 'antd'
import { IoStarOutline, IoStarSharp, IoTrashOutline } from 'react-icons/io5'
import { ITask } from '../../types'
import { ModalContainer } from '../../styles/sharedStyles'

interface ITodoItemProps {
  task: ITask
}

const listItemMetaStyle: React.CSSProperties = {
  padding: '5px 20px 5px 40px',
}

const inputStyle: React.CSSProperties = {
  height: '50px',
  width: '100%',
}

const textareaStyle: React.CSSProperties = {
  resize: 'none',
}

const TodoItem: React.FC<ITodoItemProps> = (props) => {
  const { task } = props
  const { currentTask, removeTodo, toggleTodoStatus, toggleFavorite, updateTodo, getTodo } =
    useTodoStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    setTitle(currentTask?.title || '')
    setDescription(currentTask?.description || '')
    setStatus(currentTask?.status || 'notCompleted')
  }, [currentTask])

  const handleOk = () => {
    const updatedTask = { title, description, status }
    updateTodo(currentTask?.id ?? -1, updatedTask)
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleItemClick = async (id: number) => {
    await getTodo(id)
    setIsModalOpen(true)
  }

  return (
    <>
      <List.Item
        data-testid='todo-item'
        actions={[
          <Button
            data-testid='btn-favorite'
            onClick={() => toggleFavorite(task.id)}
            icon={task.favorite ? <IoStarSharp /> : <IoStarOutline />}
          />,
          <Button
            data-testid='btn-status'
            style={{ width: '150px' }}
            onClick={() => toggleTodoStatus(task)}
          >
            {task.status === 'completed' ? 'Не выполнено' : 'Выполнено'}
          </Button>,
          <Button data-testid='btn-save' onClick={() => handleItemClick(task.id)}>
            Редактировать
          </Button>,
          <Button
            data-testid='btn-delete'
            onClick={() => removeTodo(task.id)}
            icon={<IoTrashOutline />}
          />,
        ]}
      >
        <List.Item.Meta
          style={listItemMetaStyle}
          title={task.title}
          description={task.description}
        />
      </List.Item>
      <Modal
        title='Редактировать задачу'
        okText='Сохранить'
        cancelText='Отмена'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <ModalContainer>
          <Input
            data-testid='btn-title-modal'
            placeholder='Название задачи'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
          />
          <Input.TextArea
            data-testid='btn-description-modal'
            placeholder='Описание задачи'
            value={description}
            rows={5}
            onChange={(e) => setDescription(e.target.value)}
            style={textareaStyle}
          />
          <Button
            data-testid='btn-status-modal'
            style={{ width: '100%' }}
            onClick={() => setStatus(status === 'completed' ? 'notCompleted' : 'completed')}
          >
            {status === 'completed' ? 'Не выполнено' : 'Выполнено'}
          </Button>
        </ModalContainer>
      </Modal>
    </>
  )
}

export { TodoItem }
