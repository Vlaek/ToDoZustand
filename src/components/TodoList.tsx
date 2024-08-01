import React, { useEffect, useState } from 'react'

import useTodoStore from '../stores/todoStore'
import TodoItem from './TodoItem'
import { Divider, List } from 'antd'
import { ITask } from '../types'
import InfiniteScroll from 'react-infinite-scroll-component'

const TodoList: React.FC = () => {
  const { todos, getAllTodo } = useTodoStore()
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(0)

  useEffect(() => {
    getAllTodo(page)
    setPageCount(todos.meta.pagination.pageCount)
  }, [getAllTodo, page, todos.meta.pagination.pageCount])

  const goToNextPage = () => {
    console.log(page < pageCount)
    console.log(page, pageCount)
    if (page < pageCount) {
      setPage(page + 1)
    }
  }

  return (
    <InfiniteScroll
      dataLength={todos.list.length}
      next={goToNextPage}
      hasMore={todos.list.length < todos.meta.pagination.total}
      loader={<Divider plain>Загрузка...</Divider>}
      endMessage={<Divider plain>Конец списка 🤐</Divider>}
    >
      <List
        dataSource={todos.list}
        renderItem={(todo: ITask) => <TodoItem key={todo.id} task={todo} />}
      />
    </InfiniteScroll>
  )
}

export default TodoList
