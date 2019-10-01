# Markdown 简介与工具推荐

Markdown 是支持富文本的标记语言。富文本（ rich text ）是相对于纯文字文本（ plain text ）的概念，指的是提供形如

1. **文本加粗**
2. _斜体_
3. 列表（本这段文字本身就是列表 lol）
4. 等宽字体显示：`printf("Hello, world!")`，以及整段的代码块高亮
   ```rust
    impl Solution {
        pub fn add_two_numbers(l1: Option<Box<ListNode>>, l2: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
            Self::add_list(&l1, &l2, 0)
        }

        pub fn add_list(l1: &Option<Box<ListNode>>, l2: &Option<Box<ListNode>>, carry: i32) -> Option<Box<ListNode>> {
            match (l1, l2, carry) {
                (None, None, 0) => None,
                (None, None, c) => Some(Box::new(ListNode::new(c))),
                (Some(l), None, c) | (None, Some(l), c) => {
                    let sum = c + l.val;
                    Some(Box::new(ListNode{val: sum % 10, next: Self::add_list(&l.next, &None, sum / 10)}))
                },
                (Some(u), Some(v), c) => {
                    let sum = c + u.val + v.val;
                    Some(Box::new(ListNode{val: sum % 10, next: Self::add_list(&u.next, &v.next, sum / 10)}))
                }
            }
        }
    }
   ```
5. 还有数学公式 $E=mc^2$
6. 还有更多

由此观之，用富文本来做笔记会是个非常舒服的选择。强烈推荐大家学会如何使用 markdown ！本站也是用 markdown 作为写作规范的。

## 学习

网上关于 markdown 的介绍文章真是汗牛充栋，这和 markdown 今年来的流行是分不开的，另一方面也反映了这玩意并不难学，这里列出一些参考资料（欢迎补充）

* [GitHub 官方教程](https://guides.github.com/features/mastering-markdown/)。因为 markdown 书写实在是太方便了，因此很多开源项目的说明都是用 markdown 写成的，为此 GitHub 也支持使用 markdown ，并可以做实时预览（点击本页右上角的铅笔你就知道了）。这个链接介绍了 markdown 的基本语法和 GFM （ GitHub Flavored Markdown）。
* [一份简单的中文教程](https://help.github.com/cn/articles/basic-writing-and-formatting-syntax)

好像参考上面那个链接就够了 lol

## 工具

请务必尝试一下 [Typora](https://typora.io/)，一款优雅方便的，全平台支持的 markdown 写作软件。

另外使用 VSCode 来编辑 markdown 文件，然后用 Markdown All in One 这个插件来预览也是非常不错的选择（非常 geek，实际上本网站就是这么写出来的 lol）

![](/_static/assets/vscode-markdown.png)