import {
  IServerDataList,
  IServerData,
  ITask,
  ITaskList,
  IMeta,
  IDataToServer,
  ITaskForAdd,
} from '../types'

const statusArray = ['completed', 'notCompleted']

const EMPTY_META: IMeta = {
  pagination: {
    page: 0,
    pageCount: 0,
    pageSize: 0,
    total: 0,
  },
}

export const convertDataFromServerToList = (response: IServerDataList): ITaskList => {
  const { data, meta } = response

  return {
    list:
      data?.map((item) => {
        const { id, attributes } = item
        const status = statusArray.includes(attributes?.status ?? '')
          ? attributes?.status ?? ''
          : 'notCompleted'

        const favorites = JSON.parse(localStorage.getItem('favorites') ?? '[]')

        return {
          id: id ?? -1,
          title: attributes?.title || '',
          description: attributes?.description || '',
          createdAt: attributes?.createdAt || '',
          publishedAt: attributes?.publishedAt || '',
          status,
          updatedAt: attributes?.updatedAt || '',
          favorite: favorites?.includes(id ?? -1),
        }
      }) ?? [],
    meta: meta ?? EMPTY_META,
  }
}

export const convertDataFromServer = (response: IServerData): ITask => {
  const { data } = response
  const status = statusArray.includes(data?.attributes?.status ?? '')
    ? data?.attributes?.status ?? ''
    : 'notCompleted'

  return {
    id: data?.id ?? -1,
    title: data?.attributes?.title || '',
    description: data?.attributes?.description || '',
    createdAt: data?.attributes?.createdAt || '',
    updatedAt: data?.attributes?.updatedAt || '',
    publishedAt: data?.attributes?.publishedAt || '',
    status,
    favorite: false,
  }
}

export const convertDataToServer = (task: ITaskForAdd): IDataToServer => {
  const { description, status, title } = task

  return {
    data: {
      title: title,
      description: description,
      status: status,
    },
  }
}
