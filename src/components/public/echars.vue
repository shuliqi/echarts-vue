<template>
    <div id="echars" v-option="echarse" :style="{height:height}"></div>
</template>

<script>
import Vue from 'vue'
var echarts = require('echarts');
import 'echarts/lib/chart/map';
import 'echarts/map/js/china.js';
import 'echarts/map/js/world.js';
import '../../../common/js/bmap.js'
var myChart;
// 基于准备好的dom，初始化echarts实例
export default {
  props:{
    //父组件传过来的参数
     echarse:Object,
     height:String
  },
  //用指令来渲染dom
 //用指令来渲染dom
  directives:{
     option:{
        //被绑定元素插入父节点时调用（父节点存在即可调用，不必存在于 document 中）。
        inserted:function(el, binding, vnode){
            //数据
            const opts = binding.value
            // 基于准备好的dom，初始化echarts实例
            myChart = echarts.init(el);
            //形成虚拟的节点好复用
            vnode.context.myChart = myChart
            // 绘制图表

            myChart.setOption(opts,true)
        },
        update: function (el, binding, vnode) {
            const opts = binding.value
            vnode.context.myChart.setOption(opts,true)
        }
     }
  },
  mounted(){
    // 地图点击返回数据
    var self = this
    myChart.on("click",function(params){
      if(params.data.type === 'china'){
          //目前是全国视图或者是城市视图
          var cityArr = ["北京市", "广州市", "西安市", "重庆市", "成都市"]
          if (cityArr.indexOf(params.data.name) !== -1) {
              self.$emit("listnerFromEcharts",{
                "name":params.data.name,
                "value":params.data.value,
                "type":params.data.type
                }
              )
          }
      }else if(params.data.type === 'city'){
              self.$emit("listnerFromEcharts",{
                "name":params.data.name,
                "value":params.data.value,
                "type":params.data.type
                }
              )
      }else{
          //目前是城市视图
          self.$emit("listnerFromEcharts",{
                "type":params.data[2],
                "link":params.data[3]
            }
          )
      }
    })

  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#echars {
  width: 100%;

}

</style>
