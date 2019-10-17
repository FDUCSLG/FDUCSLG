variable_list = {}

/*
	一个变量是一个key-value映射，其中key是变量名，value用来记录变量的值和属性
	在正文中每遇到形如[$key$]的文本片段，就会用value来替换这一个片段

	其中value.val表示value的值，即用于替换的值
	其中value.work_tag表示这个变量生效的标签
	其中value.work_pro表示这个变量生效的属性
	其他的属性是可选的
*/

variable_list["base_url"] = {
	"val" : global_config["site_url"] , 
	"work_tag" : "a",
	"work_pro" : "href",

	"eat_backward" : true, //吃掉匹配位置之前的字符
	"work_when_debug" : false, //在debug模式下不要工作
}
