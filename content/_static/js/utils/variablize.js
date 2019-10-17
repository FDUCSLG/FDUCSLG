
function _varialblize(variable_list)
{
	for (x in variable_list)
	{
		y = variable_list[x]
		
		reg_str = "\\[\\$" + x + "\\$\\]"
		if (y.eat_backward)
			reg_str = "[\\s\\S]{0,}?" + reg_str

		replace_str = y.val

		eles = document.getElementsByTagName(y.work_tag)

		for (var i = 0;i < eles.length;i++)
		{
			ele = eles[i]

			if (global_config.DEBUG_MODE && !y.work_when_debug)
				replace_str = ""


			ele[y.work_pro] = ele[y.work_pro].replace(RegExp(reg_str , "g") , replace_str)
		}
	}
}
_varialblize(variable_list)
