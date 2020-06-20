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
上面这种情况是监听对象本身，修改它的属性值，需要使用 `deep`。如果对象本身重新赋值，则不需要`deep`。另外直接监听对象里的属性，也不需要`deep`。

注意：直接监听对象时，修改它的属性值，此时是无法拿到**旧值**的，因为对象内存地址是同一个。

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

## 非 Prop 的属性
一个非 prop 的属性是指传向一个组件，但是该组件内部没有使用 prop 定义的属性。那么该属性最终会添加到组件根元素上。

这是一个子组件：
```html
<template>
  <div>
    <div>我是子组件</div>
  </div>
</template>
```
父组件：
```html
<template>
  <div>
    <child my-data="my data"/>
  </div>
</template>
```
传给子组件的 `my-data`，由于没有被 prop 定义，最终被添加到子组件根元素上，如下：
```html
<div my-data="my data">
  <div>我是子组件</div>
</div>
```

注意，如果子组件根元素上同样定义了一个 `my-data` 属性，那么外部传入的会替换内部已有的数据。

### 合并 class 和 style
很多时候我们在父组件中使用子组件时，会给子组件一个 class 或者 style，这本质上这也算属性传递，但是如果属性名是 `class` 或者 `style` 时，是不会替换子组件内部的 class 或者 style 的，而是合并。

例如子组件：
```html
<template>
  <div class="inner-class">
    <div >我是子组件</div>
  </div>
</template>
```
父组件：
```html
<template>
  <div>
    <child class="external-class"/>
  </div>
</template>
```
最终解析为：
```html
<div class="inner-class external-class">
  <div>我是子组件</div>
</div>
```

**注意，经测试，class 合并时不会去重，即如果外部 class 与内部 class 名称重复时，最终解析出就有两个同名的 class。而 style 会去重。**

### 禁用属性继承
当属性没被 prop 定义时，同时你又不希望该属性被组件根元素继承，那么可以使用 `inheritAttrs` 这个选项来禁用继承。
在子组件中设置：
```js
{
  // 与 data 选项同级
  inheritAttrs: false
}
```
此时子组件就不会继承那些非 Prop 的属性了。但是 **class 和 style 不会受影响**。

## 依赖注入 provide & inject
provide 选项允许我们指定我们想要提供给后代组件的数据和方法，然后在子组件中使用 inject 选项接收祖先组件传过来的数据和方法。

祖先组件
```js
export default {
  // 向后代组件提供 msg 数据和 test 方法
  provide () {
    return {
      msg: this.msg,
      test: this.test
    }
  },
  data () {
    return {
      msg: '我是父组件的数据'
    }
  },
  methods: {
    test () {
      console.log('调用父组件的test方法')
    }
  }
}
```
后代组件
```js
export default {
  // 接收 msg 和 test
  inject: ['msg', 'test'],
  methods: {
    log () {
      console.log(this.msg)
      this.test()
    }
  }
}
```
这个后代组件无论层级多深，都能通过 inject 接收到父组件提供的数据。需要注意的是，provide 提供的 property 是非响应式的。

## 自定义事件通信
兄弟组件的通信方式，有三种：
- 子传父，父再传子
- 使用 vuex
- 自定义事件

自定义事件通信利用 `$on` 和 `$emit` 两个api，他们需要在一个公共的Vue实例上触发，这个实例称作“事件总线”，即常说的 `EventBus`。

新建 Vue 实例，文件名为 `eventBus.js`
```js
import Vue from 'vue'
export default new Vue()
```

Component1 组件里监听：
```js
import eventBus from './eventBus.js'
// ...
mounted(){
  eventBus.$on('my-event',handler)
}

// handler 指一个函数的名字，这里使用函数名而不是直接写函数体，是为了便于解绑，即组件销毁时要解绑，节省内存

beforeDestroy(){
  eventBus.$off('my-event',handler)
}
```

Component2 组件里触发：
```js
import eventBus from './eventBus.js'
// ...
methods:{
  test(){
    eventBus.$emit('my-event',someValue)
  }
}
```

## 父子组件生命周期执行顺序
```js
// f 代表父组件，c 代表子组件
f-beforeCreate
f-created
f-beforeMount
c-beforeCreate
c-created
c-beforeMount
c-mounted
f-mounted

f-beforeUpdate
c-beforeUpdate
c-updated
f-updated

f-beforeDestroy
c-beforeDestroy
c-destroyed
f-destroyed
```

## 自定义 v-model
使用 `v-model` 指令可以在表单 `input`、`textarea` 和 `select` 元素上创建双向数据绑定。也可以给自定义组件加上 `v-model` 指令，它本质上是一种语法糖，当我们在组件上使用 `v-model` 时，会在组件内部自动解析为名为 `value` 的 prop，和名为 `input` 的事件，按照这个规定，就可以实现自定义组件的 `v-model` 数据绑定。

例子：
```vue
// 父组件使用子组件，子组件使用 v-model
<template>
 <child v-model="val"/>
</template>


<script>
// ...
export default {
  // ...
  data(){
    return {
      val:''
    }
  }
}
</script>

```
```vue
// 子组件内部使用名为 value 的 prop 接收，和触发名为 input 的事件
<template>
  <div>
    <input type="text" :value="value" @input="$emit('input', $event.target.value)"/>
  </div>
</template>

<script>
export default {
  props: ['value'] // 默认必须是 value
}
</script>
```
默认的`value` 和 `input` 可以修改，这时可以使用 `model` 选项来定义需要的 `prop` 和 `event`：
```vue
<template>
  <div>
    <input type="text" :value="text" @change="$emit('change',$event.target.value)">
  </div>
</template>

<script>
export default {
  model: {
    prop: 'text',
    event: 'change'
  },
  props: ['text']
}
</script>
```

## $nextTick
Vue 是异步渲染，在 data 改变之后，DOM 不会立刻渲染，`$nextTick` 会在 DOM 渲染之后被触发，以获取最新的 DOM 节点。

一个例子：
```vue
<template>
  <div>
    <ul ref="ul">
      <li v-for="(item,index) in list" :key="index">{{item}}</li>
    </ul>
    <button @click="addItem">添加</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: [1, 2, 3]
    }
  },
  methods: {
    addItem () {
      this.list.push(Date.now())
      this.list.push(Date.now())
      this.list.push(Date.now())

      // 异步渲染，$nextTick 等待 DOM 渲染完再执行回调
      // 页面渲染时会将 data 的修改整合，多次修改 data 修改只会渲染一次
      this.$nextTick(() => {
        const ulElem = this.$refs.ul
        // 如果不在 $nextTick 中获取节点数量，将获得渲染前的数量
        console.log(ulElem.childNodes.length)
      })
    }
  }
}
</script>
```

## Vue 原理相关

### Object.defineProperty
Vue 中监听 `data` 的核心 api 是 `Object.defineProperty`，它的缺点：
- 深度监听，需要递归到底，一次性计算量大
- 无法监听新增属性/删除属性（需要 `Vue.set` 和 `Vue.delete`

Vue 中监听 `data` 的原理：
```js
const data = {
    name:'wj',
    obj:{
        a:1,
        b:2
    }
}

function observe (data){
    if(typeof data !== 'object' || data == null){
        return data
    }
    // 遍历监听
    for(let key in data){
        let value = data[key] 
        observe(value) // 深度监听
        Object.defineProperty(data, key, {
            get (){
                return value
            },
            set (newVal){
                if(newVal !== value){
                    value = newVal
                    observe(newVal) // 深度监听
                    updateView()
                }
            }
        })
    }  
}

function updateView (){
    console.log('视图更新')
}

observe(data)
```
