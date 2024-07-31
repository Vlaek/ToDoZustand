export type TFilter = 'ALL' | 'COMPLETED' | 'NOT_COMPLETED' | 'FAVORITE'

export interface IServerDataList {
  data:
    | [
        {
          attributes: {
            title: string | null
            description: string | null
            status: string | null
            createdAt: string | null
            updatedAt: string | null
            publishedAt: string | null
          } | null
          id: number | null
        },
      ]
    | null
  meta: IMeta | null
}

export interface IServerData {
  data: {
    attributes: {
      title: string | null
      description: string | null
      status: string | null
      createdAt: string | null
      updatedAt: string | null
      publishedAt: string | null
    } | null
    id: number | null
  } | null
  meta: IMeta | null
}

export interface IMeta {
  pagination: {
    page: number
    pageCount: number
    pageSize: number
    total: number
  }
}

export interface ITaskList {
  list: ITask[]
  meta: IMeta
}

export interface ITask {
  id: number
  title: string
  description: string
  status: string
  favorite: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export interface IDataToServer {
  data: {
    title: string
    description: string
    status: string
  }
}

export interface ITaskForAdd {
  title: string
  description: string
  status: string
}
