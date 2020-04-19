# Vue

## 路由参数解耦
一般我们在组件中获取路由参数是这样获取的：
```js
this.$route.params.id
```
一种更好的方式是通过 `props` 将组件和路由解耦：
```js
const router = new VueRouter({
    routes: [
        {
            path: '/user/:id',
            component: User,
            props: true
        }
    ]
})
```
将路由的 `props` 属性设置为 `true` 后，组件内就可以通过 `props` 接收到：
```js
export default {
    props: ['id'],
    methods: {
        getParamsId () {
            return this.is
        }
    }
}
```
也可以通过函数模式指定返回 `props`，比如：
```js
const router = new VueRouter({
    routes: [
        {
            path: '/user',
            component: User,
            props: (route) => ({
                id: route.query.id
            })
        }
    ]
})
```
当访问 `/user?id=123` 时，即可同样通过 `props` 获取到 `query` 中的 id

## watch 监听器
### immediate
`watch` 是在监听属性改变时才会触发，而有时候我们希望监听之后被立即执行一次回调，那么就可以使用 `immediate` 这个属性。

```js
var vm = new Vue({
  data () {
    return {
      a: 1
    }
  },
  watch: {
    a: {
      handler: 'watchA',
      immediate: true  // 设置为 true，页面加载时会立即执行 `watchA` 这个回调
    }
  },
  methods: {
    watchA (val) {
      console.log(val)
    }
  }
})
```

### 监听对象属性的变化
一般情况下，`watch` 无法监听对象的属性变化，需要对整个对象重新赋值才能监听到。利用 `deep` 属性后则可以正常监听对象属性的变化。

```js
var vm = new Vue({
  data () {
    return {
      b: {
        num: 1
      }
    }
  },
  watch: {
    b: {
      handler: 'watchB',
      deep: true // 设置为 true，可以监听对象的属性变化，无论其被嵌套多深
    }
  },
  methods: {
    watchB (val) {
      console.log(val)
    }
  }
})
// 修改 b 对象的属性值
vm.b.num = 5
```

### 监听执行多个方法
使用 `watch` 监听时，可以执行多个方法，利用数组可以设置多项，如下例：
```js
var vm = new Vue({
  data () {
    return {
      name: 'wj'
    }
  },
  watch: {
    name: [
      'watchName1',
      function (val, oldval) {
        console.log('watchName2 => ', val, oldval)
      },
      {
        handler: 'watchName3',
        immediate: true
      }
    ]
  },
  methods: {
    watchName1 (val, oldval) {
      console.log('watchName1 => ', val, oldval)
    },
    watchName3 (val, oldval) {
      console.log('watchName3 => ', val, oldval)
    }
  }
})

// 修改 name 值
vm.name = 'tom'
```

## 事件参数 $event
访问原始的 DOM 事件：
```html
<div @click="handleClick('hello',$event)">点击我</div>
```
```js
export default {
  methods: {
    handleClick (msg, e) {
      console.log(e.target)
    }
  }
}
```
在自定义事件中捕获子组件抛出的值：
`list-item.vue`：
```js
export default {
    methods: {
        customEvent() {
            this.$emit('custom-event', 'some value')
        }
    }
}
```
`List.vue`：
```html
<template>
    <div>
        <list-item v-for="(item, index) in list" @custom-event="customEvent(index, $event)">
            </list-list>
    </div>
</template>
```
```js
export default {
    methods: {
        customEvent(index, e) {
            console.log(e) // 'some value'
        }
    }
}
```

## 阻止属性修改
vue中数据改变时，视图也会更新，但这个有个前提，就是只有当实例被创建时就已经存在于 `data` 中的属性才是响应式的，如果后来再添加的属性是不会触发视图更新的。所以我们一般会在 `data` 中设置一些初始值，如：
```js
data: {
    list: [],
    error: null,
    num: 0
}
```
还有一种特殊情况就是我们主动想要阻止一些属性的响应，即不允许修改现有的属性，可以使用 `Object.freeze()` 这个对象方法。所以这部分准确说不是 vue 中的内容，只是可以应用到 vue 中。

对整个 `data` 对象阻止：
```js
export default {
    data () {
        const obj = Object.freeze({ foo: 'bar' })
        return obj
    }
}
```
此时任何添加到 `data` 中的属性都不能修改

对单一对象属性阻止：
```js
export default {
  data () {
    return {
      foo: 'bar',
      obj: Object.freeze({
        a: 1,
        b: 2
      })
    }
  }
}
```
此时 `obj` 这个对象属性无法修改其内部属性，即 `this.obj.a = 3` 这样的修改无效。但是如果对 `obj` 重新赋值是可以的，即 `this.obj = {a: 3}` 这样是生效的。

## v-for 和 v-if 同时使用
它们可以使用在同一个元素上，但是一般不推荐这样用。当它们处于同一节点时，`v-for` 的优先级比 `v-if` 更高，这意味着 `v-if` 将分别重复运行于每个 `v-for` 循环中。如果只想渲染部分项，这种优先级的机制就会有用了，如下：
```html
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo }}
</li>
```

