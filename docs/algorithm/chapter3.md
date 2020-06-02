# 数组相关算法题

## 两数求和问题（巧用Map）
> 真题描述：给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标。你可以假设每种输入只会对应一个答案。但是，数组中同一个元素不能使用两遍。

> 示例：给定 nums = [2, 7, 11, 15], target = 9，返回 [0, 1]

这道题最常见的解法就是两层循环求和，但是循环越多，时间复杂度就越多，我们可以考虑空间换时间，只用一层循环来解题。

使用 Map 来解：
```js
const twoSum = function(nums, target) {
    // 这里使用对象模拟 map
    const map = {}
    // 缓存数组长度
    const len = nums.length

    for (let i = 0; i < len; i++) {
        // 求当前值与 target 的差值
        const n = target - nums[i]
        // 判断所求差值是否存在于 map 中，存在即表示已经遍历过
        if (map[n] !== undefined) {
            return [map[n], i]
        }
        // 若差值不存在，则将当前值存入 map，值作为 key，索引作为 value
        map[nums[i]] = i
    }
}
```
此解题思路是，在遍历数组时，用 Map 来记录当前遍历的数字以及对应的索引，然后在遍历新数字时，回到 Map 中查询 target值与当前数值的差值是否已经存在，若存在即可返回所需结果。

上面是用对象方式来模拟了 Map，可以直接使用 es6 中的 Map：
```js
const twoSum = function(nums, target) {
    const map = new Map()
    const len = nums.length

    for (let i = 0; i < len; i++) {
        if (map.get(target - nums[i]) !== undefined) {
            return [map.get(target - nums[i]), i]
        } else {
            map.set(nums[i], i)
        }
    }
}
```

题外话，我以前是这么解的：
```js
const twoSum = function(nums, target) {
    let num, i
    const arr = []
    nums.forEach((item, idx) => {
        num = target - item
        i = nums.indexOf(num)
        if (i != -1 && arr.length == 0 && idx != i) {
            arr = [idx, i]
        }
    })
    return arr
}
```
也是一层循环，只是判断条件稍稍复杂。不过还是使用 Map 的方式更快速。

## 合并两个有序数组（双指针）
> 真题描述：给你两个有序整数数组 nums1 和 nums2，请你将 nums2 合并到 nums1 中，使 nums1 成为一个有序数组。说明: 初始化 nums1 和 nums2 的元素数量分别为 m 和 n 。 你可以假设 nums1 有足够的空间（空间大小大于或等于 m + n）来保存 nums2 中的元素。

> 示例：输入 nums1 = [1,2,3,0,0,0], m = 3
nums2 = [2,5,6], n = 3
输出: [1,2,2,3,5,6]

这道题的标准解法就是双指针法。即在两个数组上分别定义一个指针，各自指向两数组的生效部分的尾部。每次只对指针所指的元素进行比较，取出其中较大的元素放到容器数组的尾部（这里是要合并到 nums1 上，所以 nums1 就是容器数组）
```js
const merge = function(nums1, m, nums2, n) {
    // 初始化两个指针的指向，初始化 nums1 尾部索引k
    let i = m - 1, j = n - 1, k = m + n - 1
    // 当两个数组都没遍历完时，指针同步移动
    while(i >= 0 && j >= 0) {
        // 取较大的值，从末尾往前填补
        if(nums1[i] >= nums2[j]) {
            nums1[k] = nums1[i] 
            i-- 
            k--
        } else {
            nums1[k] = nums2[j] 
            j-- 
            k--
        }
    }
    
    // nums2 留下的情况，特殊处理一下 
    while(j>=0) {
        nums1[k] = nums2[j]  
        k-- 
        j--
    }
}
```
## 三数求和（双指针）
> 真题描述：给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有满足条件且不重复的三元组。
注意：答案中不可以包含重复的三元组。

> 示例： 给定数组 nums = [-1, 0, 1, 2, -1, -4]， 满足要求的三元组集合为： [ [-1, 0, 1], [-1, -1, 2] ]

所有求和问题都可以转换为求差问题。在这道题中，我们可以先固定一个数，然后在剩下的数中寻找是否有两个数和这个固定数相加是等于 0 的。

这里同样使用双指针法来解题，一方面它可以做到空间换时间，另一方面它可以降低问题的复杂度。

双指针法用在涉及求和，比较大小类的数组问题里，往往有个大前提：该数组必须是有序的。所以如果所给数组不是有序的，我们要先排序：
```js
nums = nums.sort((a, b) => {
  return a - b
})
```
此题，对数组进行遍历时，每次遍历到哪个数字，就固定哪个数字。然后左指针指向该数字后面的一个坑位，右指针指向数组尾部，让左右指针从七点开始向中间前行：

<img :src="$withBase('/algorithm/threeSum.png')" alt="tree">

每一次移动指针，就进行三数相加，如果等于 0，就得到一个目标组合，否则就要分情况讨论：
- 相加之和大于 0，说明右侧数值偏大，右指针左移
- 相加之和小于 0，说明左侧数值偏小，左指针右移

代码实现：
```js
const threeSum = function (nums) {
  const res = []
  nums = nums.sort((a, b) => (a - b))
  const len = nums.length
  for (let i = 0; i < len - 2; i++) {
    // 左指针 j
    let j = i + 1
    // 右指针
    let k = len - 1
    // 如果遇到重复的数字，则跳过
    if (i > 0 && nums[i] === nums[i - 1]) {
      continue
    }
    while (j < k) {
      if (nums[i] + nums[j] + nums[k] > 0) {
        // 和大于0，右指针左移
        k--
        // 处理右指针重复
        while (j < k && nums[k] === nums[k + 1]) {
          k--
        }
      } else if (nums[i] + nums[j] + nums[k] < 0) {
        // 和小于0，左指针右移
        j++
        // 处理左指针重复
        while (j < k && nums[j] === nums[j - 1]) {
          j++
        }
      } else {
        // 和等于0，将目标数字组合推入数组
        res.push([nums[i], nums[j], nums[k]])
        // 左右指针一起前进
        j++
        k--
        // 处理右指针重复
        while (j < k && nums[k] === nums[k + 1]) {
          k--
        }
         // 处理左指针重复
        while (j < k && nums[j] === nums[j - 1]) {
          j++
        }
      }
    }
  }
  return res
}
```