import Vue from 'vue'
import Router from 'vue-router'
import IndexPage from '../pages/IndexPage'
import TagPage from '../pages/TagPage'
import ArticlePage from '../pages/ArticlePage'
import NoticePage from '../pages/NoticePage'
import CommentPage from '../pages/CommentPage'
import MessagePage from '../pages/MessagePage'
import ArticleEditPage from '../pages/ArticleEditPage'
import SignInPage from '../pages/SignInPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: SignInPage
    },
    {
      path: '/signin',
      component: SignInPage
    },
    {
      path: '/index',
      component: SignInPage
    },
    {
      path: '*',
      redirect: '/signin'
    },
    {
      path: '/start',
      component: IndexPage
    },
    {
      path: '/tag',
      component: TagPage
    },
    {
      path: '/article',
      component: ArticlePage
    },
    {
      path: '/article/edit/:id',
      component: ArticleEditPage
    },
    {
      path: '/article/new',
      component: ArticleEditPage
    },
    {
      path: '/notice',
      component: NoticePage
    },
    {
      path: '/comment',
      component: CommentPage
    },
    {
      path: '/message',
      component: MessagePage
    },
  ]
})
