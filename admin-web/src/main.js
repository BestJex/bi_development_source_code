import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import httpServer from '@src/service/httpServer' // axios拦截器配置
import '@/permission' // 权限控制
import * as mUtils from '@/common/js/mUtils'
import config from '@/config'
import filters from './filter/index'
import AES from '@/common/js/secret'
import userModel from '@src/mixins/userModel'

import preventReClick from '@/directive/preventReClick' //防多次点击，重复提交

// 将自动注册所有组件为全局组件
import dataV from '@jiaminghi/data-view'

Vue.use(dataV)

import Element from 'element-ui'
import '@/common/styles/element-variable.scss'

import '@/common/styles/index.scss' // 自定义 css
import '@/common/stylus/index.styl'// 自定义 css
import YouDu from '@/base/index'// 自定义基础组件
import '@/base/theme/default/index.styl'// 自定义基础组件css
import 'animate.css'
import VueClipboard from 'vue-clipboard2'
import EventBus from './eventBus/index'
import EndataV from './dataV/index'

import './icons' // icon

import './common/fonts/iconfont.css'

import vdr from 'vue-draggable-resizable-gorkys'
import 'vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css'


Vue.component('vdr', vdr)

Vue.use(Element)
Vue.use(YouDu)
Vue.use(VueClipboard)
Vue.use(EndataV)//封装dataV组件

/**
 * 引入公共方法mUtils
 */
Vue.prototype.$mUtils = mUtils;
Vue.prototype.AES = AES
Vue.prototype.$axios = httpServer;

/**
 * 公共配置信息
 */
Vue.prototype.$config = config
Vue.prototype.$bus = EventBus
//监控窗体的大小
window.addEventListener('resize', function(){
	Vue.prototype.$window = {
		clientWidth: document.body.clientWidth,
		clientHeight: document.body.clientHeight,
		offsetWidth: document.body.offsetWidth,
		offsetHeight: document.body.offsetHeight
	}
	EventBus.$emit('winowResize')
})
Vue.prototype.$window  =  {
	clientWidth: document.body.clientWidth,
	clientHeight: document.body.clientHeight,
	offsetWidth: document.body.offsetWidth,
	offsetHeight: document.body.offsetHeight
}
// 注册全局过滤器
Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
})

// 全局注册mixins
Vue.mixin(userModel)


// 登录后跳转方法
Vue.prototype.goBeforeLoginUrl = () => {
	let url = mUtils.Cookie.get('beforeLoginUrl')
	url = decodeURIComponent(url)
	if (!url || url.indexOf('/author') != -1) {
		router.push('/')
	} else {
		router.push(url)
		mUtils.Cookie.set('beforeLoginUrl', '', 1 / 24 / 60, window.location.host, window.location.pathname.substring(0, window.location.pathname.length - 1))
	}
};


String.prototype.replaceAll = function(s1, s2) {
	return this.replace(new RegExp(s1, "gm"), s2);
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
