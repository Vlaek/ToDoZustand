import axios from 'axios'
import { create } from 'zustand'
import {
  convertDataFromServer,
  convertDataFromServerToList,
  convertDataToServer,
} from '../services/convertData'
import { ITask, ITaskForAdd, ITaskList, TFilter } from '../types'

const API_URL = 'https://cms.dev-land.host/api'
const JWT_TOKEN =
  'a56017bfd8f1a9d1c8d012e881ef7df90ddc4e3d74e61a27b82fa975cfe37571fcb0e7617258e871291c4315b68c1c410274fb19269becf5dae7b5372d611d66c605c701817bd70f8fcd39aa44973e95fb1dff1b36e3271ba4bf890e074e52d9b9feddcee0947e588d7b5f6eef4bd4ead3993c6ee7b35ffddf22012c2b5589ed'
const headers = {
  Authorization: `Bearer ${JWT_TOKEN}`,
}

interface TodoStore {
  todos: ITaskList
  currentTask: ITask | null
  filter: TFilter
  setFilter: (filter: TFilter) => void
  getAllTodo: () => Promise<void>
  getTodo: (id: number) => Promise<void>
  addTodo: (task: ITaskForAdd) => void
  removeTodo: (id: number) => void
  updateTodo: (id: number, task: ITaskForAdd) => void
  toggleTodoStatus: (task: ITask) => void
  toggleFavorite: (id: number) => void
}

const EMPTY_TODOS: ITaskList = {
  list: [],
  meta: {
    pagination: {
      page: 0,
      pageCount: 0,
      pageSize: 0,
      total: 0,
    },
  },
}

const useTodoStore = create<TodoStore>((set) => ({
  todos: EMPTY_TODOS,
  currentTask: null,
  filter: 'ALL',
  setFilter: async (filter) => {
    await useTodoStore.getState().getAllTodo()
    set((state) => {
      const filteredTodos = state.todos.list.filter((todo) => {
        if (filter === 'ALL') return true
        if (filter === 'COMPLETED') return todo.status === 'completed'
        if (filter === 'NOT_COMPLETED') return todo.status === 'notCompleted'
        if (filter === 'FAVORITE') return todo.favorite
        return true
      })

      return {
        filter,
        todos: {
          ...state.todos,
          list: filteredTodos,
        },
      }
    })
  },
  getAllTodo: async () => {
    const response = await axios.get(`${API_URL}/tasks`, {
      headers,
    })
    set({ todos: convertDataFromServerToList(response.data) })
  },
  getTodo: async (id) => {
    const response = await axios.get(`${API_URL}/tasks/${id}`, {
      headers,
    })
    set({ currentTask: convertDataFromServer(response.data) })
  },
  addTodo: async (task) => {
    const data = convertDataToServer(task)
    await axios.post(`${API_URL}/tasks`, data, {
      headers,
    })
    await useTodoStore.getState().getAllTodo()
  },
  removeTodo: async (id) => {
    await axios.delete(`${API_URL}/tasks/${id}`, {
      headers,
    })
    await useTodoStore.getState().getAllTodo()
  },
  updateTodo: async (id, task) => {
    const data = convertDataToServer(task)
    await axios.put(`${API_URL}/tasks/${id}`, data, {
      headers,
    })
    await useTodoStore.getState().getAllTodo()
  },
  toggleTodoStatus: async (task) => {
    const newTask = { ...task, status: task.status === 'completed' ? 'notCompleted' : 'completed' }
    const data = convertDataToServer(newTask)
    await axios.put(`${API_URL}/tasks/${task.id}`, data, {
      headers,
    })
    await useTodoStore.getState().getAllTodo()
  },
  toggleFavorite: (id) => {
    set((state) => ({
      todos: {
        ...state.todos,
        list: state.todos.list.map((todo) =>
          todo.id === id ? { ...todo, favorite: !todo.favorite } : todo,
        ),
      },
    }))

    const ids = useTodoStore
      .getState()
      .todos.list.filter((item) => item.favorite)
      .map((item) => item.id)
      .sort()

    localStorage.setItem('favorites', JSON.stringify(ids))
  },
}))

export default useTodoStore
