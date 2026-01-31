import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { TabProvider } from './contexts/TabContext'
import { MenuProvider } from './contexts/MenuContext'
import './index.css'
import routes from './routes'

const router = createBrowserRouter(routes)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <MenuProvider>
        <TabProvider>
          <Suspense fallback={
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100vh',
              backgroundColor: '#1a1a2e',
              color: '#fff'
            }}>
            Loading...
            </div>
          }>
            <RouterProvider router={router} />
          </Suspense>
        </TabProvider>
      </MenuProvider>
    </ThemeProvider>
  </StrictMode>,
)
