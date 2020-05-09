import DashboardLayout from '../layout/DashboardLayout.vue'
// GeneralViews
import NotFound from '../pages/NotFoundPage.vue'

// Admin pages
import Home from 'src/pages/Home.vue'
import UserList from 'src/pages/UserList.vue'
import UserProfile from 'src/pages/UserProfile.vue'
import Statistics from 'src/pages/Statistics.vue'
import Chat from 'src/pages/Chat.vue'

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/admin/home'
  },
  {
    path: '/admin',
    component: DashboardLayout,
    redirect: '/admin/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: Home
      },
      {
        path: 'user',
        name: 'UserList',
        component: UserList
      },
      {
        path: 'user/:id',
        name: 'UserProfile',
        component: UserProfile
      },
      {
        path: 'stats',
        name: 'Statistics',
        component: Statistics
      },
      /*{
        path: 'chat',
        name: 'Chat',
        component: Chat
      },*/
    ]
  },
  { path: '*', component: NotFound }
]

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes
