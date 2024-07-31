import React, { useEffect } from 'react'

import useTodoStore from '../stores/todoStore'
import TodoItem from './TodoItem'
import { List } from 'antd'
import { ITask } from '../types'

const TodoList: React.FC = () => {
  const { todos, getAllTodo } = useTodoStore()

  useEffect(() => {
    getAllTodo()
  }, [getAllTodo])

  return (
    <List
      dataSource={todos.list}
      renderItem={(todo: ITask) => <TodoItem key={todo.id} task={todo} />}
    />
  )
}

export default TodoList
