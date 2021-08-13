# ct-cli脚手架
* 安装：yarn|npm|cnpm install @ct/cli
* 拉取项目命令：ct-cli create [name]
* 生成plugin模板：ct-cli plugin [name]
# 配置自己的模板
* 在生成的plugin模板中，对generator/prompt.js进行配置询问命令，在template中加入对应answer的文件夹。
# 使用自己的模板
* ct-li add @ct-cli- <- your-plugin-name ->
* ct-cli <- your-plugin-name -> <-project-name->

