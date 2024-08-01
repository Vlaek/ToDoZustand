import React from 'react'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { HeaderContent } from './HeaderContent'

const addTodoMock = jest.fn()
const setFilterMock = jest.fn()

const mockStore = {
  filter: 'ALL',
  setFilter: setFilterMock,
  addTodo: addTodoMock,
  todos: {
    list: [],
    meta: {
      pagination: {
        page: 1,
        pageCount: 1,
        pageSize: 15,
        total: 0,
      },
    },
  },
  currentTask: null,
  removeTodo: jest.fn(),
  updateTodo: jest.fn(),
  toggleTodoStatus: jest.fn(),
  toggleFavorite: jest.fn(),
}

jest.mock('../../stores/todoStore', () => ({
  __esModule: true,
  default: () => mockStore,
}))

describe('HeaderContent', () => {
  test('Проверка открытия и закрытия модального окна', async () => {
    render(<HeaderContent />)

    const addTaskButton = screen.getByRole('button', { name: /Добавить задачу/i })
    fireEvent.click(addTaskButton)

    const modal = await screen.findByRole('dialog')
    expect(modal).toBeInTheDocument()

    const cancelButton = screen.getByRole('button', { name: /Отмена/i })
    fireEvent.click(cancelButton)

    // Модальное окно закрывается
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  test('Проверка обновления полей ввода', async () => {
    render(<HeaderContent />)

    const addTaskButton = screen.getByRole('button', { name: /Добавить задачу/i })
    fireEvent.click(addTaskButton)

    const titleInput = screen.getByPlaceholderText(/Название задачи/i) as HTMLInputElement
    const descriptionInput = screen.getByPlaceholderText(/Описание задачи/i) as HTMLInputElement

    fireEvent.change(titleInput, { target: { value: 'New Task Title' } })
    fireEvent.change(descriptionInput, { target: { value: 'New Task Description' } })

    // Значение полей обновилось
    expect(titleInput.value).toBe('New Task Title')
    expect(descriptionInput.value).toBe('New Task Description')
  })

  test('Проверка переключения кнопки статуса', async () => {
    render(<HeaderContent />)

    const addTaskButton = screen.getByRole('button', { name: /Добавить задачу/i })
    fireEvent.click(addTaskButton)

    const statusButton = screen.getByRole('button', { name: /Выполнено/i })
    fireEvent.click(statusButton)

    // Текст кнопки изменился на 'Не выполнено'
    expect(statusButton).toHaveTextContent('Не выполнено')

    fireEvent.click(statusButton)

    // Текст кнопки изменился на 'Выполнено'
    expect(statusButton).toHaveTextContent('Выполнено')
  })

  test('Проверка отправки формы', async () => {
    render(<HeaderContent />)

    const addTaskButton = screen.getByRole('button', { name: /Добавить задачу/i })
    fireEvent.click(addTaskButton)

    const titleInput = screen.getByPlaceholderText(/Название задачи/i) as HTMLInputElement
    const descriptionInput = screen.getByPlaceholderText(/Описание задачи/i) as HTMLInputElement
    const statusButton = screen.getByRole('button', { name: /Выполнено/i }) as HTMLButtonElement

    fireEvent.change(titleInput, { target: { value: 'New Task Title' } })
    fireEvent.change(descriptionInput, { target: { value: 'New Task Description' } })
    fireEvent.click(statusButton)

    const createButton = screen.getByRole('button', { name: /Создать/i })
    fireEvent.click(createButton)

    // Отправка формы
    await waitFor(() => {
      expect(addTodoMock).toHaveBeenCalledWith({
        title: 'New Task Title',
        description: 'New Task Description',
        status: 'notCompleted',
      })
    })
  })

  test('Проверка изменения фильтра при выборе в селекте', async () => {
    render(<HeaderContent />)

    const selectElement = screen.getByRole('combobox')

    // Начальное значение фильтра равно 'Все'
    await waitFor(() => {
      expect(screen.getByText('Все')).toBeInTheDocument()
    })

    fireEvent.mouseDown(selectElement)
    fireEvent.click(screen.getByText('Выполненные'))

    // Начальное значение фильтра равно 'Выполненные'
    await waitFor(() => {
      expect(setFilterMock).toHaveBeenCalledWith('COMPLETED')
    })
  })
})
