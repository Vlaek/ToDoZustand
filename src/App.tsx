import { Layout } from 'antd'
import TodoList from './components/TodoList'
import HeaderContent from './components/HeaderContent'

const { Header, Content } = Layout

const headerStyle: React.CSSProperties = {
  color: '#fff',
  height: '64px',
  width: '100%',
  backgroundColor: '#4096ff',
  position: 'fixed',
  zIndex: '100',
}

const contentStyle: React.CSSProperties = {
  marginTop: '64px',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
}

const layoutStyle = {
  overflow: 'hidden',
  width: '100%',
}

function App() {
  return (
    <Layout style={layoutStyle}>
      <Header style={headerStyle}>
        <HeaderContent />
      </Header>
      <Content style={contentStyle}>
        <TodoList />
      </Content>
    </Layout>
  )
}

export default App
