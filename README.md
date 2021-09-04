# IEV项目开发过程记录

[toc]

## Problem 

* Antd在引入之前需要引入CSS
* Decorators+HOC改写之前的Mixin模式
* 通过翻阅源码解决问题
* topojson对于地图数据的解析
* setState是不是不可以传入函数赋值，传入了就赋值为了undefined
* 绘制单个国家的地图，尝试使用世界地图的topojson进行处理成单个国家的topojson格式进行绘制，学习了topojson 的底层格式以及topojson-client的一些API，最后经过处理之后依然没有解决问题，于是尝试采用其他方法。
* row display:inline-flex 宽度没有自动填充满

## ToDo

* [优化最小尺度问题](https://juejin.cn/post/6844903494386712589)
* 参照[react-d3](https://github.com/codesuki/react-d3-components)项目进行改进，即从底层SVG上进行图表元素的绘制以及组件分级管理
* 参考Google代码风格，react代码风格进行代码优化
* 通过HOC重新改写，AreaChart中的Mixin风格
* 各个国家地图模块，中国台湾，美国 俄罗斯
* Pixel Map颜色渐变，以及标签和选中效果 (svg中有gradient属性)

## Reference

* [world geojson](https://datahub.io/core/geo-countries)

