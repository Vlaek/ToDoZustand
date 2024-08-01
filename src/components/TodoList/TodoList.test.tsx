import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TodoList } from './TodoList'
import { ITask, ITaskList } from '../../types'

const getAllTodoMock = jest.fn()

window.matchMedia = jest.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}))

const mockTasks: ITask[] = [
  {
    id: 1,
    title: 'Task 1',
    description: 'Description 1',
    status: 'completed',
    favorite: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    publishedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    title: 'Task 2',
    description: 'Description 2',
    status: 'notCompleted',
    favorite: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    publishedAt: '2024-01-02T00:00:00Z',
  },
]

const mockTodoList: ITaskList = {
  list: mockTasks,
  meta: {
    pagination: {
      page: 1,
      pageSize: 15,
      pageCount: 2,
      total: 25,
    },
  },
}

const mockStore = {
  todos: mockTodoList,
  getAllTodo: getAllTodoMock,
}

jest.mock('../../stores/todoStore', () => ({
  __esModule: true,
  default: () => mockStore,
}))

describe('TodoList', () => {
  beforeEach(() => {
    mockStore.getAllTodo.mockClear()
  })

  test('Проверка отображения списка задач', async () => {
    render(<TodoList />)

    // Задачи отображаются в списке
    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()
  })

  test('Проверка отображения сообщения о загрузке', () => {
    render(<TodoList />)

    // Сообщение о загрузке отображается
    expect(screen.getByText('Загрузка...')).toBeInTheDocument()
  })

  test('Проверка перехода на следующую страницу', async () => {
    getAllTodoMock.mockImplementation((page) => {
      mockTodoList.list = [
        ...mockTodoList.list,
        {
          id: 3,
          title: 'Task 3',
          description: 'Description 3',
          status: 'completed',
          favorite: false,
          createdAt: '',
          updatedAt: '',
          publishedAt: '',
        },
      ]
      mockTodoList.meta.pagination.page = page
    })

    render(<TodoList />)

    fireEvent.scroll(window, { target: { scrollY: 1000 } })

    // Переходит на следующую страницу
    await waitFor(() => {
      expect(getAllTodoMock).toHaveBeenCalledWith(2)
    })
  })
})
