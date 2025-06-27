import Feed from '@/components/pages/Feed'
import Saved from '@/components/pages/Saved'

export const routes = {
  feed: {
    id: 'feed',
    label: 'Feed',
    path: '/feed',
    icon: 'Newspaper',
    component: Feed
  },
  saved: {
    id: 'saved',
    label: 'Saved',
    path: '/saved',
    icon: 'Bookmark',
    component: Saved
  }
}

export const routeArray = Object.values(routes)
export default routes