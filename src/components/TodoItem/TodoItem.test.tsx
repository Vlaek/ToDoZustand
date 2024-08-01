import React from 'react'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TodoItem } from './TodoItem'
import { ITask } from '../../types'

const updateTodoMock = jest.fn()
const removeTodoMock = jest.fn()
const toggleTodoStatusMock = jest.fn()
const toggleFavoriteMock = jest.fn()
const getTodoMock = jest.fn()

const mockTask: ITask = {
  id: 1,
  title: 'Test Task',
  description: 'Test Description',
  status: 'notCompleted',
  favorite: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  publishedAt: new Date().toISOString(),
}

const mockStore = {
  currentTask: mockTask,
  updateTodo: updateTodoMock,
  removeTodo: removeTodoMock,
  toggleTodoStatus: toggleTodoStatusMock,
  toggleFavorite: toggleFavoriteMock,
  getTodo: getTodoMock,
}

jest.mock('../../stores/todoStore', () => ({
  __esModule: true,
  default: () => mockStore,
}))

describe('TodoItem', () => {
  test('Проверка получения задачи', async () => {
    render(<TodoItem task={mockTask} />)

    // Задача существует
    expect(screen.getByTestId('todo-item'))
  })

  test('Провека открытия и закрытия модального окна', async () => {
    render(<TodoItem task={mockTask} />)

    const editButton = screen.getByRole('button', { name: /Редактировать/i })
    fireEvent.click(editButton)

    const modal = await screen.findByRole('dialog')
    expect(modal).toBeInTheDocument()

    const cancelButton = screen.getByRole('button', { name: /Отмена/i })
    fireEvent.click(cancelButton)

    // Модальное окно закрыто
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  test('Проверка обновления задачи через модальное окно', async () => {
    render(<TodoItem task={mockTask} />)

    const editButton = screen.getByRole('button', { name: /Редактировать/i })
    fireEvent.click(editButton)

    const modal = await screen.findByRole('dialog')
    expect(modal).toBeInTheDocument()

    const titleInput = screen.getByTestId('btn-title-modal')
    const descriptionInput = screen.getByTestId('btn-description-modal')
    const statusButton = screen.getByTestId('btn-status-modal')

    fireEvent.change(titleInput, { target: { value: 'Updated Title' } })
    fireEvent.change(descriptionInput, { target: { value: 'Updated Description' } })
    fireEvent.click(statusButton)

    const saveButton = screen.getByRole('button', { name: /Сохранить/i })
    fireEvent.click(saveButton)

    // Задача обновлена
    await waitFor(() => {
      expect(updateTodoMock).toHaveBeenCalledWith(mockTask.id, {
        title: 'Updated Title',
        description: 'Updated Description',
        status: 'completed',
      })
    })
  })

  test('Проверка удаления задачи', async () => {
    render(<TodoItem task={mockStore.currentTask} />)

    const deleteButton = screen.getByTestId('btn-delete')
    fireEvent.click(deleteButton)

    // Задача удалена
    await waitFor(() => {
      expect(removeTodoMock).toHaveBeenCalledWith(mockStore.currentTask.id)
    })
  })

  test('Проверка переключения статуса', async () => {
    render(<TodoItem task={mockStore.currentTask} />)

    const statusButton = screen.getByTestId('btn-status')
    fireEvent.click(statusButton)

    // Статус переключен
    await waitFor(() => {
      expect(toggleTodoStatusMock).toHaveBeenCalledWith(mockStore.currentTask)
    })
  })

  test('Проверка переключения избранного', () => {
    render(<TodoItem task={mockTask} />)

    const toggleFavoriteButton = screen.getByTestId('btn-favorite')
    fireEvent.click(toggleFavoriteButton)

    // Избранное переключено
    expect(toggleFavoriteMock).toHaveBeenCalledWith(mockTask.id)
  })
})
