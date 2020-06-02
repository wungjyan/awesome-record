# 字符串相关算法题

## 反转字符串
```js
const str = 'hello'
const res = str.split('').reverse().join('')
console.log(res) // olleh
```

## 判断回文
反转后与原字符对比，相同则是回文：
```js
function isPalindrome(str){
    const reversedStr = str.split('').reverse().join('')
    return str === reversedStr
}
```
也可以根据对称性判断：
```js
function isPalindrome(str){
    const len = str.length
    for(let i=0;i<len/2;i++>){
        if(str[i]!==str[len-i-1]){
            return false
        }
    }
    return true
}
```
## 回文字符串衍生题
> 真题描述：给定一个非空字符串str，最多只能删除一个字符。判断是否能成为回文字符串。
```js
const validPalindrome = function (str){
	const len = str.length
	let i = 0, j = len - 1

	// 当左右指针均满足对称，所有指针一起前进
	while(i < j && str[i] === str[j]){
		i++
		j--
	}

	if(_isPalindrome(i + 1, j)){
		return true
	}

	if(_isPalindrome(i, j - 1)){
		return true
	}
	
	function _isPalindrome (st, ed){
		while(st < ed){
			if(str[st] !== str[ed]){
				return false
			}
			st++
			ed--
		}
		return true
	}

	// 默认返回false
	return false
}
```

## 字符串匹配
> 真题描述：设计一个支持以下两种操作的数据结构：
void addWord(word)
bool search(word)
search(word) 可以搜索文字或正则表达式字符串，字符串只包含字母 . 或 a-z 。
. 可以表示任何一个字母。

> 示例：addWord("bad")
addWord("dad")
addWord("mad")
search("pad") -> false
search("bad") -> true
search(".ad") -> true
search("b..") -> true
说明:
你可以假设所有单词都是由小写字母 a-z 组成的。

此题用一个小技巧，以字符串的长度为 key，相同长度的字符串存在一个数组中，这样可以提高我们后续查询的效率。

```js
class WordDictionary {
	constructor (){
		this.words = {}
	}
	addWord (word){
		if(!this.words[word.length]){
			this.words[word.length] = [word]
		}
		this.words[word.length].push(word)
	}

	searchWord (word){
		const len = word.length

		if(!this.words[len]){
			return false
		}

		if(word.includes('.')){
			const reg = new RegExp(word)
			return this.words[len].some(item=>{
				return reg.test(item)
			})
		}

		return this.words[len].includes(word)

	}
}
```