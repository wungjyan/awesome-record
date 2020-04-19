# 遍历二叉树

## 遍历方法
按照顺序规则的不同，有四种遍历方式：
- 先序遍历
- 中序遍历
- 后序遍历
- 层次遍历

按照实现方式的不同，可以分为两种遍历方式：
- 递归遍历（先序，中序和后序）
- 迭代遍历（层次遍历）

其中，所谓的“先序”、“中序”和“后序”，“先”、“中”、“后”其实是指的**根结点的遍历时机**，它们的遍历顺序分别是：
- 根结点 -> 左子树 -> 右子树
- 左子树 -> 根结点 -> 右子树
- 左子树 -> 右子树 -> 根结点

## 递归遍历
首先用 JS 代码实现一个二叉树结构的数据：
```js
const root = {
    val: "A",
    left: {
        val: "B",
        left: {
            val: "D"
        },
        right: {
            val: "E"
        }
    },
    right: {
        val: "C",
        right: {
            val: "F"
        }
    }
}
```
### 先序遍历
```js
// 所有遍历函数的入参都是树的根结点对象
function preorder(root) {
    // 递归边界，root 为空
    if(!root) {
        return 
    }
     
    // 输出当前遍历的结点值
    console.log('当前遍历的结点值是：', root.val)  
    // 递归遍历左子树 
    preorder(root.left)  
    // 递归遍历右子树  
    preorder(root.right)
}
```

### 中序遍历
```js
// 所有遍历函数的入参都是树的根结点对象
function inorder(root) {
    // 递归边界，root 为空
    if(!root) {
        return 
    }
     
    // 递归遍历左子树 
    inorder(root.left)  
    // 输出当前遍历的结点值
    console.log('当前遍历的结点值是：', root.val)  
    // 递归遍历右子树  
    inorder(root.right)
}
```

### 后序遍历
```js
function postorder(root) {
    // 递归边界，root 为空
    if(!root) {
        return 
    }
     
    // 递归遍历左子树 
    postorder(root.left)  
    // 递归遍历右子树  
    postorder(root.right)
    // 输出当前遍历的结点值
    console.log('当前遍历的结点值是：', root.val)  
}
```