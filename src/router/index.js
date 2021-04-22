import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '概述', icon: 'dashboard', affix: true }
      }
    ]
  },
  // {
  //   path: '/documentation',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/documentation/index'),
  //       name: 'Documentation',
  //       meta: { title: 'Documentation', icon: 'documentation', affix: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: '/guide/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/guide/index'),
  //       name: 'Guide',
  //       meta: { title: 'Guide', icon: 'guide', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/profile',
  //   component: Layout,
  //   redirect: '/profile/index',
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/profile/index'),
  //       name: 'Profile',
  //       meta: { title: 'Profile', icon: 'user', noCache: true }
  //     }
  //   ]
  // }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/course',
    component: Layout,
    redirect: '/course/media',
    name: 'Course',
    meta: {
      title: '课程',
      icon: 'excel',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'course/media',
        component: () => import('@/views/course/media'),
        name: "Audio",
        meta: {
          title: '图文',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'course/audio',
        component: () => import('@/views/course/audio'),
        name: "Audio",
        meta: {
          title: '音频',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'course/video',
        component: () => import('@/views/course/video'),
        name: "Video",
        meta: {
          title: '视频',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'course/column',
        component: () => import('@/views/course/column'),
        name: "Column",
        meta: {
          title: '专栏',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },{
        hidden:true,
        path:'course/column_detail',
        component:()=>import('@/views/course/column_detail'),
        name:"column_detail",
        meta:{
          title:'专栏详情',
          roles:['admin']
        }
      }
    ]
  },

  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: 'user',
        component: () => import('@/views/user/user'),
        name: 'User',
        meta: { title: '用户', icon: 'user' }
      }
    ]
  },

  {
    path: '/pay',
    component: Layout,
    redirect: '/pay/order',
    name: 'Pay',
    meta: {
      title: '交易',
      icon: 'education',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'pay/order',
        component: () => import('@/views/pay/payorder'),
        name: "Order",
        meta: {
          title: '订单管理',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'pay/assets',
        component: () => import('@/views/pay/assets'),
        name: "Assets",
        meta: {
          title: '资产管理',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'pay/payment',
        component: () => import('@/views/pay/payment'),
        name: "Payment",
        meta: {
          title: '支付管理',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      }
    ]
  },


  {
    path: '/renovation',
    component: Layout,
    redirect: '/renovation/mobile_index',
    name: 'Mobile_index',
    meta: {
      title: '可视化',
      icon: 'education',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path:'/renovation/mobile_index',
        component:()=>import('@/views/renovation/mobile_index'),
        name:"mobile_index",
        meta:{
          title:"移动端",
          roles:['admin']
        }
      },
      {
        path: 'renovation/pc_index',
        component: () => import('@/views/renovation/pc_index'),
        name: "pc_index",
        meta: {
          title: 'pc端',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      }
    ]
  },

  
  {
    path: '/marketing',
    component: Layout,
    redirect: '/marketing/group',
    name: 'Group',
    meta: {
      title: '营销',
      icon: 'education',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path:'/marketing/group',
        component:()=>import('@/views/marketing/group'),
        name:"Group",
        meta:{
          title:"拼团",
          roles:['admin']
        }
      },
      {
        path: 'marketing/flashsale',
        component: () => import('@/views/marketing/flashsale'),
        name: "Flashsale",
        meta: {
          title: '秒杀',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'marketing/coupon',
        component: () => import('@/views/marketing/coupon'),
        name: "Coupon",
        meta: {
          title: '优惠券',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      }
    ]
  },

  {
    path: '/tool',
    component: Layout,
    redirect: '/tool/bbs',
    name: 'Bbs',
    meta: {
      title: '工具',
      icon: 'education',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path:'/tool/bbs',
        component:()=>import('@/views/tool/bbs'),
        name:"Bbs",
        meta:{
          title:"小社群",
          roles:['admin']
        }
      },
      {
        path: 'tool/question',
        component: () => import('@/views/tool/question'),
        name: "Question",
        meta: {
          title: '题库',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'tool/testpaper',
        component: () => import('@/views/tool/testpaper'),
        name: "Testpaper",
        meta: {
          title: '试卷',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'tool/book',
        component: () => import('@/views/tool/book'),
        name: "Book",
        meta: {
          title: '电子书',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      }
    ]
  },

  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/setting_index',
    name: 'setting_index',
    meta: {
      title: '设置',
      icon: 'education',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path:'setting/setting_index',
        component:()=>import('@/views/setting/setting_index'),
        name:"setting_index",
        meta:{
          title:"店铺设置",
          roles:['admin']
        }
      },
      {
        path: 'setting/staffs',
        component: () => import('@/views/setting/staffs'),
        name: "Staffs",
        meta: {
          title: '员工管理',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'setting/role',
        component: () => import('@/views/setting/role'),
        name: "Role",
        meta: {
          title: '角色设置',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      }
    ]
  },



  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index'),
        name: 'Icons',
        meta: { title: 'Icons', icon: 'icon', noCache: true }
      }
    ]
  },




  /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/list',
  //   name: 'Example',
  //   meta: {
  //     title: 'Example',
  //     icon: 'el-icon-s-help'
  //   },
  //   children: [
  //     {
  //       path: 'create',
  //       component: () => import('@/views/example/create'),
  //       name: 'CreateArticle',
  //       meta: { title: 'Create Article', icon: 'edit' }
  //     },
  //     {
  //       path: 'edit/:id(\\d+)',
  //       component: () => import('@/views/example/edit'),
  //       name: 'EditArticle',
  //       meta: { title: 'Edit Article', noCache: true, activeMenu: '/example/list' },
  //       hidden: true
  //     },
  //     {
  //       path: 'list',
  //       component: () => import('@/views/example/list'),
  //       name: 'ArticleList',
  //       meta: { title: 'Article List', icon: 'list' }
  //     }
  //   ]
  // },

  // {
  //   path: '/tab',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/tab/index'),
  //       name: 'Tab',
  //       meta: { title: 'Tab', icon: 'tab' }
  //     }
  //   ]
  // },

  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'ErrorPages',
  //   meta: {
  //     title: 'Error Pages',
  //     icon: '404'
  //   },
  //   children: [
  //     {
  //       path: '401',
  //       component: () => import('@/views/error-page/401'),
  //       name: 'Page401',
  //       meta: { title: '401', noCache: true }
  //     },
  //     {
  //       path: '404',
  //       component: () => import('@/views/error-page/404'),
  //       name: 'Page404',
  //       meta: { title: '404', noCache: true }
  //     }
  //   ]
  // },

  // {
  //   path: '/error-log',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'log',
  //       component: () => import('@/views/error-log/index'),
  //       name: 'ErrorLog',
  //       meta: { title: 'Error Log', icon: 'bug' }
  //     }
  //   ]
  // },

  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'Excel',
  //   meta: {
  //     title: 'Excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     {
  //       path: 'export-excel',
  //       component: () => import('@/views/excel/export-excel'),
  //       name: 'ExportExcel',
  //       meta: { title: 'Export Excel' }
  //     },
  //     {
  //       path: 'export-selected-excel',
  //       component: () => import('@/views/excel/select-excel'),
  //       name: 'SelectExcel',
  //       meta: { title: 'Export Selected' }
  //     },
  //     {
  //       path: 'export-merge-header',
  //       component: () => import('@/views/excel/merge-header'),
  //       name: 'MergeHeader',
  //       meta: { title: 'Merge Header' }
  //     },
  //     {
  //       path: 'upload-excel',
  //       component: () => import('@/views/excel/upload-excel'),
  //       name: 'UploadExcel',
  //       meta: { title: 'Upload Excel' }
  //     }
  //   ]
  // },

  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   alwaysShow: true,
  //   name: 'Zip',
  //   meta: { title: 'Zip', icon: 'zip' },
  //   children: [
  //     {
  //       path: 'download',
  //       component: () => import('@/views/zip/index'),
  //       name: 'ExportZip',
  //       meta: { title: 'Export Zip' }
  //     }
  //   ]
  // },

  // {
  //   path: '/pdf',
  //   component: Layout,
  //   redirect: '/pdf/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/pdf/index'),
  //       name: 'PDF',
  //       meta: { title: 'PDF', icon: 'pdf' }
  //     }
  //   ]
  // },
  // {
  //   path: '/pdf/download',
  //   component: () => import('@/views/pdf/download'),
  //   hidden: true
  // },

  // {
  //   path: '/theme',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/theme/index'),
  //       name: 'Theme',
  //       meta: { title: 'Theme', icon: 'theme' }
  //     }
  //   ]
  // },

  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/clipboard/index'),
  //       name: 'ClipboardDemo',
  //       meta: { title: 'Clipboard', icon: 'clipboard' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://github.com/PanJiaChen/vue-element-admin',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
