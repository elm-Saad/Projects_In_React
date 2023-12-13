import { HomeLayout,Landing,Error,Products,SingleProduct,Cart,About,Register,Login,Checkout,Orders,} from './pages'
// react-router-dom
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import { ErrorElement } from './component'

//loaders 
import { loader as landingLoader } from './pages/Landing'
import { loader as SingleProductLoader } from './pages/SingleProduct'
import { loader as ProductLoader } from './pages/Products'

import { loader as checkoutLoader } from './pages/Checkout'


//actions

import { action as registerAction } from './pages/Register'
import { action as loginAction } from './pages/Login'

import { action as checkoutAction } from './component/CheckoutForm'

import { store } from './store'

const router = createBrowserRouter([
  {
    path:'/',
    element:<HomeLayout />,
    errorElement:<Error />,
    children:[
      {
        index:true,
        element:<Landing />,
        errorElement:<ErrorElement />,
        loader:landingLoader
      },
      {
        path: 'products',
        element: <Products />,
        errorElement:<ErrorElement />,
        loader:ProductLoader
      },
      {
        path:'products/:id',
        element:<SingleProduct />,
        errorElement:<ErrorElement />,
        loader:SingleProductLoader
      },
      {
        path:'about',
        element:<About/>
      },
      {
        path:'cart',
        element:<Cart/>
      },
      {
        path: 'checkout',
        element: <Checkout />,
        loader: checkoutLoader(store),
        action: checkoutAction(store),


      },
      {
        path: 'orders',
        element: <Orders />,
      },

    ]
  },
  {
    path:'/login',
    element:<Login />,
    errorElement:<Error />,
    action:loginAction(store)// Access the RTX store in the action (Video course 496)
  },
  {
    path:'/register',
    element:<Register />,
    errorElement:<Error />,
    action:registerAction
  },
])


function App() {

  return (
    <RouterProvider router={router}/>
  )
}

export default App
