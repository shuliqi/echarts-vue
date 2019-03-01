<template>
  <div class="container"  v-loading="loading" >
      <!--头部包含返回和切换111111-->
      <header class="clearfix" v-show="headerShow">
          <el-button class="fl" size="mini" v-on:click="back"><i class="el-icon-back"></i></el-button>

          <el-button class="fr"size="mini"v-show="changeShow" v-on:click="changge">切换</el-button>
           <el-button class="fr select"  @click="dialogVisible = true" size="mini">筛选</el-button>
      </header>
        <!--搜索框dev-test-->
      <el-form ref="form" :model="searchform" v-show="searchShow" class="seach">
          <el-form-item>
            <el-input   size="small" v-model="searchform.cntcCode " placeholder="请输入烟证号">
                  <el-button slot="append" v-on:click="submit" icon="el-icon-search"></el-button>
            </el-input>
          </el-form-item>
      </el-form>
      <!--echart组件-->
      <echart :echarse="echartData" :height="height" v-on:listnerFromEcharts="fromEcharts"></echart>
      <el-dialog
        :visible.sync="dialogVisible"
        :show-close=false
         width="98%">
        <el-form ref="form" :model="form" :label-position="labelPosition">
            <el-form-item :label="labelvalue">
              <el-checkbox-group size="mini" v-model="form.option">
                  <el-checkbox-button border v-for="option in options" :label="option" :key="option">{{option}}</el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="型号：">
              <el-checkbox-group size="mini" v-model="form.model">
                  <el-checkbox-button border v-for="model in modelOptions" :label="model" :key="model">{{model}}</el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="店铺：">
              <el-checkbox-group size="mini" v-model="form.shopType">
                  <el-checkbox-button border v-for="shop in shopOptions" :label="shop" :key="shop">{{shop}}</el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancel">取 消</el-button>
          <el-button size="mini" type="primary" @click="onSubmit">确 定</el-button>
        </span>
      </el-dialog>

  </div>
</template>

<script>
import echart from '../components/public/echars.vue'
const baseUrl = "https://www.easy-mock.com/mock/5a1bd8fd74e00f187e2cebde/echarts"

const year = ['2017', '2016', '2015', '2014','2013','<2013','其他']
//火星坐标系(Gcj-02)与百度坐标系(BD-09)之间的转换
var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
var PI = 3.1415926535897932384626;
var a = 6378245.0;
var ee = 0.00669342162296594323;
export default {
  name: 'HelloWorld',
  data () {
    return {
      loading:true,   //加载指令
      echartData:{},   //传给echart的option
      data:[],    //option里面的data
      geoCoordMap:[], //地理坐标对象
      off:true,    //控制最后一层的地图不可点击
      height:"100%",   //echart视图的高度
      form:{
       option:[],
       model:[],
       shopType:[]
      },
      searchform:{
         cntcCode :''
      },
      region: [],    //区域筛选
      options:[],
      modelOptions:['2.0','OTHER','VOLTRON','WOW','空白'],
      shopOptions:['主力','潜力','其他'],
      //当前视图的城市
      cityName:"",   //城市名字
      cityGeo:[],   //城市坐标
      //头部返回和切换按钮显示与否
      headerShow:false,
      searchShow:false,
      changeShow:true,    //切换按钮显示易购
      //切换的时候判断切换到区域还是全部
      ifDetaill:true ,  //true：表示要切换到详情视图，全部的
      dialogVisible:false ,  //弹出框的显示与否
      labelPosition:'top',
      labelvalue:"年份：",     //用来区分按城市区域来选择，还是年份
      changevalue:"切换至店铺图",
    }
  },
  created(){
    // this.getData('/api/v1/app/pposms/map/count')
    this.getData(baseUrl + '/count')
    setTimeout(() => {
        this.loading = false
    }, 500);
  },
  components:{
   echart
  },
  methods:{
    // 全国视图接口
    getData(url){
      this.$axios.get(url).then(res =>{
        var frontData = [
            { pposmCount: 140, cityName: "青岛", lng: 120.312643, lat: 36.064932 },
            { pposmCount: 182, cityName: "武汉", lng: 114.424348, lat: 30.606726 },
            { pposmCount: 24, cityName: "福州", lng: 119.320518, lat: 26.11405 },
            { pposmCount: 14, cityName: "贵阳", lng: 106.702359, lat: 26.556565 },
            { pposmCount: 30, cityName: "杭州", lng: 120.213116, lat: 30.290998 },
            { pposmCount: 21, cityName: "南宁", lng: 108.314838, lat: 22.826993 },
            { pposmCount: 38, cityName: "天津", lng: 117.210061, lat: 39.135884 },
            { pposmCount: 125, cityName: "长沙", lng: 113.065494, lat: 28.147104 },
            { pposmCount: 421, cityName: "深圳", lng: 113.907306, lat: 22.527573 },
            { pposmCount: 17, cityName: "乐山", lng: 103.762764, lat: 29.568748 },
            { pposmCount: 33, cityName: "德阳", lng: 104.399245, lat: 31.138802 },
            { pposmCount: 34, cityName: "绵阳", lng: 104.681538, lat: 31.468489 },
            { pposmCount: 5, cityName: "佛山", lng: 113.127362, lat: 23.024832 },
            { pposmCount: 1, cityName: "眉山", lng: 103.859382, lat: 30.080744 },
            { pposmCount: 2, cityName: "太原", lng: 112.553036, lat: 37.877113 },
            { pposmCount: 5, cityName: "东莞", lng: 113.763594, lat: 23.022252 },
            { pposmCount: 2, cityName: "衡阳", lng: 112.69343, lat: 26.915813 },
            { pposmCount: 1, cityName: "株洲", lng: 113.143346, lat: 27.856821 },
            { pposmCount: 1, cityName: "郴州", lng: 113.046181, lat: 25.810775 },
            { pposmCount: 2, cityName: "玉林", lng: 110.169464, lat: 22.632171 },
            { pposmCount: 1, cityName: "肇庆", lng: 112.453373, lat: 23.089558 },
            { pposmCount: 2, cityName: "韶关", lng: 113.586854, lat: 24.812995 },
            { pposmCount: 1, cityName: "耒阳", lng: 112.9453, lat: 26.2173 },

        ]

        var mydata = res.data.data.concat(frontData).sort(function(a, b) {
                return b.pposmCount - a.pposmCount
        })
        var result = this.data_geo(mydata,'all')
        this.data = result.data
        this.geoCoordMap =  result.geo

        var option = {
            backgroundColor: '#000000',
            title: {
                left: 'center',
                text: 'PPOSM分布态势',
                textStyle: {
                    //文字颜色
                    color: '#00FF7F',
                    //字体风格,'normal','italic','oblique'
                    fontStyle: 'normal',
                    //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                    fontWeight: 'bold',
                    //字体系列
                    fontFamily: 'sans-serif',
                    //字体大小
                    　　　　fontSize: 16
                },
                padding: 20
            },
            tooltip: {
                trigger: 'item',
                formatter: function(a) {
                    return "";
                }
            },
            toolbox: {
                x: 'center',
                y: 'top',
                padding: 5,
                itemSize: 40,
                // showTitle:true,
                textStyle: {
                    color: '#F5FFFA',
                    fontSize: 20
                }
            },
            bmap: {
                center: [104.114129, 37.550339],
                zoom: 4,
                roam: true,
                mapStyle: {
                    styleJson: [{
                        "featureType": "water",
                        "elementType": "all",
                        "stylers": {
                            "color": "#044161"
                        }
                    }, {
                        "featureType": "land",
                        "elementType": "all",
                        "stylers": {
                            "color": "#004981"
                        }
                    }, {
                        "featureType": "boundary",
                        "elementType": "geometry",
                        "stylers": {
                            "color": "#064f85"
                        }
                    }, {
                        "featureType": "railway",
                        "elementType": "all",
                        "stylers": {
                            "visibility": "off"
                        }
                    }, {
                        "featureType": "highway",
                        "elementType": "geometry",
                        "stylers": {
                            "color": "#004981"
                        }
                    }, {
                        "featureType": "highway",
                        "elementType": "geometry.fill",
                        "stylers": {
                            "color": "#005b96",
                            "lightness": 1
                        }
                    }, {
                        "featureType": "highway",
                        "elementType": "labels",
                        "stylers": {
                            "visibility": "off"
                        }
                    }, {
                        "featureType": "arterial",
                        "elementType": "geometry",
                        "stylers": {
                            "color": "#004981"
                        }
                    }, {
                        "featureType": "arterial",
                        "elementType": "geometry.fill",
                        "stylers": {
                            "color": "#00508b"
                        }
                    }, {
                        "featureType": "poi",
                        "elementType": "all",
                        "stylers": {
                            "visibility": "off"
                        }
                    }, {
                        "featureType": "green",
                        "elementType": "all",
                        "stylers": {
                            "color": "#056197",
                            "visibility": "off"
                        }
                    }, {
                        "featureType": "subway",
                        "elementType": "all",
                        "stylers": {
                            "visibility": "off"
                        }
                    }, {
                        "featureType": "manmade",
                        "elementType": "all",
                        "stylers": {
                            "visibility": "off"
                        }
                    }, {
                        "featureType": "local",
                        "elementType": "all",
                        "stylers": {
                            "visibility": "off"
                        }
                    }, {
                        "featureType": "arterial",
                        "elementType": "labels",
                        "stylers": {
                            "visibility": "off"
                        }
                    }, {
                        "featureType": "boundary",
                        "elementType": "geometry.fill",
                        "stylers": {
                            "color": "#029fd4"
                        }
                    }, {
                        "featureType": "building",
                        "elementType": "all",
                        "stylers": {
                            "color": "#1a5787"
                        }
                    }, {
                        "featureType": "label",
                        "elementType": "all",
                        "stylers": {
                            "visibility": "off"
                        }
                    }]
                }
            },
            series: [{
                    name: 'pm2.5',
                    type: 'scatter',
                    coordinateSystem: 'bmap',
                    data: this.convertData(this.data),
                    symbolSize: function(val) {
                        return val[2] / 10;
                    },
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#ddb926'
                        },
                        emphasis: {
                            areaColor: 'black'
                        }
                    }
                },
                {
                    name: 'Top 5',
                    type: 'effectScatter',
                    coordinateSystem: 'bmap',
                    data: this.convertData(this.data.sort(function(a, b) {
                        return b.value - a.value;
                    }).slice(0, 2).concat(this.data.sort(function(a, b) {
                        return b.value - a.value;
                    }).slice(3, 5)).concat(this.data.sort(function(a, b) {
                        return b.value - a.value;
                    }).slice(14, 15))),
                    symbolSize: function(val) {
                        return val[2] / 10;
                    },
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    hoverAnimation: true,
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: true
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#f4e925',
                            shadowBlur: 10,
                            shadowColor: '#333'
                        },
                        emphasis: {
                            areaColor: 'black'
                        }
                    },
                    zlevel: 1
                }
            ]
        };
        this.echartData = Object.assign({},option)
      })

    },

    /**
      区域视图处理
      @params String  url      请求的url
      @params Object  option   请求的参数
      @params booleam  rg       用来筛选条件
     */
    getCountyData(url,option,rg){
      this.$axios.get(url,option).then(res =>{
          this.data = []
          this.geoCoordMap = []
          var mydata = res.data.data
          // var view_data = this.unique(mydata)
          var result = this.data_geo(mydata,"region")
          this.data = result.data
          this.geoCoordMap =  result.geo
          if(rg){
              //区域筛选条件  第一次执行
            this.region =[]
            for(var i = 0,len = this.data.length; i < len;i++){
                this.region.push(this.data[i].name)
            }
            this.options = year
          }


          var option = {
              map: 'china',
              backgroundColor: '#404a59',
              toolTip: {

                  show: false
              },
              toolbox: {
                  x: 'left',
                  y: 'top',
                  padding: 5,
                  itemSize: 40,
                  textStyle: {
                      color: '#F5FFFA',
                      fontSize: 0
                  }
              },
              bmap: {
                  center:this.cityGeo,
                  zoom: 11,
                  roam: true,
                  mapStyle: {
                      styleJson: [{
                          "featureType": "water",
                          "elementType": "all",
                          "stylers": {
                              "color": "#044161"
                          }
                      }, {
                          "featureType": "land",
                          "elementType": "all",
                          "stylers": {
                              "color": "#004981"
                          }
                      }, {
                          "featureType": "boundary",
                          "elementType": "geometry",
                          "stylers": {
                              "color": "#064f85"
                          }
                      }, {
                          "featureType": "railway",
                          "elementType": "all",
                          "stylers": {
                              "visibility": "off"
                          }
                      }, {
                          "featureType": "highway",
                          "elementType": "geometry",
                          "stylers": {
                              "color": "#004981"
                          }
                      }, {
                          "featureType": "highway",
                          "elementType": "geometry.fill",
                          "stylers": {
                              "color": "#005b96",
                              "lightness": 1
                          }
                      }, {
                          "featureType": "highway",
                          "elementType": "labels",
                          "stylers": {
                              "visibility": "off"
                          }
                      }, {
                          "featureType": "arterial",
                          "elementType": "geometry",
                          "stylers": {
                              "color": "#004981"
                          }
                      }, {
                          "featureType": "arterial",
                          "elementType": "geometry.fill",
                          "stylers": {
                              "color": "#00508b"
                          }
                      }, {
                          "featureType": "poi",
                          "elementType": "all",
                          "stylers": {
                              "visibility": "off"
                          }
                      }, {
                          "featureType": "green",
                          "elementType": "all",
                          "stylers": {
                              "color": "#056197",
                              "visibility": "on"
                          }
                      }, {
                          "featureType": "subway",
                          "elementType": "all",
                          "stylers": {
                              "visibility": "off"
                          }
                      }, {
                          "featureType": "manmade",
                          "elementType": "all",
                          "stylers": {
                              "visibility": "off"
                          }
                      }, {
                          "featureType": "local",
                          "elementType": "all",
                          "stylers": {
                              "visibility": "on"
                          }
                      }, {
                          "featureType": "arterial",
                          "elementType": "labels",
                          "stylers": {
                              "visibility": "off"
                          }
                      }, {
                          "featureType": "boundary",
                          "elementType": "geometry.fill",
                          "stylers": {
                              "color": "#029fd4",
                              "visibility": "on"
                          }
                      }, {
                          "featureType": "building",
                          "elementType": "all",
                          "stylers": {
                              "color": "#1a5787"
                          }
                      }, {
                          "featureType": "label",
                          "elementType": "all",
                          "stylers": {
                              "visibility": "on"
                          }
                      }]
                  }
              },
              series: [{
                  name: '',
                  type: 'effectScatter',
                  // 设置混合模式为叠加
                  blendMode: 'lighter',
                  coordinateSystem: 'bmap',
                  data: this.convertData(this.data),
                  symbolSize: function(val) {
                      return val[2] / 7;
                  },
                  showEffectOn: 'emphasis',
                  rippleEffect: {
                      brushType: 'stroke',
                      //动画中波纹的最大缩放比例:
                      scale: 5
                  },
                  tooltip: {
                      enterable: false,
                      axisPointer: { // 坐标轴指示器，坐标轴触发有效
                          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                      }

                  },
                  hoverAnimation: false,
                  label: {
                      normal: {
                          formatter: '{b}',
                          position: 'right',
                          show: false
                      },
                      emphasis: {
                          show: false
                      }
                  },
                  itemStyle: {
                      normal: {
                          color: '#ADFF2F',
                          shadowBlur: 1,
                          shadowColor: '#008000'
                      },
                      emphasis: {
                          areaColor: 'black'
                      }
                  },
                  zlevel: 1
              },
              {
                  name: 'Top 5',
                  type: 'effectScatter',
                  coordinateSystem: 'bmap',
                  data: this.convertData(this.data.sort(function(a, b) {
                      return b.value - a.value;
                  }).concat(this.data.sort(function(a, b) {
                      return b.value - a.value;
                  })).concat(this.data.sort(function(a, b) {
                      return b.value - a.value;
                  }))),
                  symbolSize: function(val) {
                      return val[2] / 7;
                  },
                  showEffectOn: 'render',
                  rippleEffect: {
                      brushType: 'stroke'
                  },
                  hoverAnimation: true,
                  label: {
                      normal: {
                          formatter: '',
                          position: 'right',
                          show: true
                      }
                  },
                  itemStyle: {
                      normal: {
                          color: '#f4e925',
                          shadowBlur: 10,
                          shadowColor: '#333'
                      },
                      emphasis: {
                          areaColor: 'black'
                      }
                  },
                  zlevel: 1
              }]
          }
          this.echartData = Object.assign({},option)

      })


    },
    convertValue(val) {
        if (val > 600) {
            return val / 4
        } else if (val < 600 && val > 200) {
            return val / 3
        } else if (val < 100) {
            return val + 50
        } else {
            return val
        }
    },
    // 筛选新旧
    convertDetailData(data) {

        var res = [];
        for (var i = 0; i < data.length; i++) {
            var arr = [data[i].type,data[i].link]
            var geoCoord = this.geoCoordMap[data[i].name];
            if (geoCoord) {
                res.push(geoCoord.concat(arr).concat(data[i].value));

            }
        }
        return res;
    },
    convertData(data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var geoCoord = this.geoCoordMap[data[i].name];
            if (geoCoord) {
                res.push({
                    name: data[i].name,
                    value: geoCoord.concat(data[i].value),
                    type:data[i].type
                });
            }
        }
        return res;
    },
    renderItem(params, api) {
        var coords = [];
        var points = [];
        for (var i = 0; i < coords.length; i++) {
            points.push(api.coord(coords[i]));
        }
        var color = api.visual('color');

        return {
            type: 'polygon',
            shape: {
                points: echarts.graphic.clipPointsByRect(points, {
                    x: params.coordSys.x,
                    y: params.coordSys.y,
                    width: params.coordSys.width,
                    height: params.coordSys.height
                })
            },
            style: api.style({
                fill: color,
                stroke: echarts.color.lift(color)
            })
        };
    },
    /**
    监听echart组件发来的事件
     */
    fromEcharts(data){

      if(data.type !== 'details'){

        //改变当前的视图城市和坐标
        //当前城市名称保存
          this.cityName = data.name
          //当前城市坐标保存
          this.cityGeo[0] = data.value[0]
          this.cityGeo[1] = data.value[1]
      }
      this.loading = true

      if(data.type === 'china'){
        //  当前区域是全国视图，要切换到城市视图
        this.getCountyData(baseUrl + '/city',{cityName:data.name},true)
        //  返回， 筛选，切换
        this.headerShow = true


      }else if(data.type === 'city'){
           //  当前区域是城市视图，要切换到店铺视图
           this.changeShow = false
           this.ifDetaill = false
           this.getDataDetails(baseUrl + '/detail', {cityName:data.name})
      }else{
        //当前是店铺视图，点击这打开链接
          this.options = this.region
          window.open(data.link);
      }
      setTimeout(() => {
            this.loading = false
      }, 500);

    },
     /**
     *筛选数据，分区域
     */
    unique(arr) {
        var map = {},
            dest = [];
        for(var i = 0; i < arr.length; i++){
            var ai = arr[i];
            if(!map[ai.district]){
                dest.push({
                    cityName: ai.district,
                    pposmCount: 1,
                    lat:ai.lat,
                    lng:ai.lng

                });
                map[ai.district] = ai;
            }else{
                for(var j = 0; j < dest.length; j++){
                    var dj = dest[j];
                    if(dj.cityName == ai.district){
                        ++dest[j].pposmCount
                        break;
                    }
                }
            }
       }
      return dest
     },

     /**
     * 做好data 和 坐标
     */
    data_geo(mydata,type){
        var data = [],
             geo = {}
        var myDate = new Date()
        var year = myDate.getFullYear() -3
        for (var i = 0; i < mydata.length; i++) {
            var Map = [];
            var obj = {};
            switch(type){
                case 'all':
                  Map.push(mydata[i].lng);
                  Map.push(mydata[i].lat);
                  geo[mydata[i].cityName] = Map;
                  obj.name = mydata[i].cityName;
                  obj.value = this.convertValue(mydata[i].pposmCount);
                  obj.type = "china"
                  data.push(obj)
                  break;
                case 'region':
                    Map.push(mydata[i].lng);
                    Map.push(mydata[i].lat);
                    geo[mydata[i].districtName] = Map;
                    obj.name = mydata[i].districtName;
                    obj.value = this.convertValue(mydata[i].districtNumber);
                    obj.type = "city"
                    data.push(obj);

                  break;
                case 'details':
                    Map.push(mydata[i].lng);
                    Map.push(mydata[i].lat);
                    geo[i] = Map;
                    obj.name = i;
                    obj.value = (year<= parseInt(mydata[i].year)) ?100:50;
                    obj.type = "details";
                    obj.link = mydata[i].link;
                    data.push(obj)
                    break;
            }
        }
        return {
            data:data,
            geo:geo
        }

    },
    // 筛选条件查询
    onSubmit(){

        this.loading = true
        this.dialogVisible = false
        if(this.ifDetaill){
          //城市视图筛选 this.ifDetaill：true
          var data = {
              cityName:this.cityName,
              year :this.form.option ,
              model: this.form.model,
              shopType: this.form.shopType
          }
          this.getCountyData(baseUrl + '/city',data,false)
        }else{
          //店铺图筛选 this.ifDetaill：false
          var data = {
              districtName:this.cityName,
              year :this.form.option ,
              model: this.form.model,
              shopType: this.form.shopType
          }
          this.getDataDetails(baseUrl + '/detail',data)
        }
        this.form.option.splice(0, this.form.option.length)
        this.form.model.splice(0, this.form.model.length)
        this.form.shopType.splice(0, this.form.shopType.length)


        setTimeout(() => {
          this.loading = false
        }, 500);
    },
    //取消筛选
    cancel(){
        this.dialogVisible = false
        this.form.option.splice(0, this.form.option.length)
        this.form.model.splice(0, this.form.model.length)
        this.form.shopType.splice(0, this.form.shopType.length)
    },
    //搜索框搜索
    submit(){
        this.getDataDetails(baseUrl + '/detail',this.searchform)
    },
    //切换按钮
    changge(){
         this.loading = true


          //筛选弹出框的筛选条件lable
          this.labelvalue = "区域："
          //店铺图的筛选条件
          this.options = this.region
          //出现搜索框
          this.searchShow = true


          // 请求店铺数据，返回坐标
          this.getDataDetails(baseUrl + '/detail', {cityName:this.cityName})
          //切换状态  false：标识当前事是店铺图
          this.ifDetaill = false
          //店铺图  切换按钮不显示
          this.changeShow = false

          //加载框关闭
          setTimeout(() => {
            this.loading = false
          }, 500);


    },
    //店铺视图
    getDataDetails(url,option){
      this.$axios.get(url,option).then(res => {
        var mydata = res.data.data
        var result = this.data_geo(mydata,'details')
        this.data = result.data
        this.geoCoordMap =  result.geo
        var option = {
            map: 'china',
            backgroundColor: '#404a59',

            toolTip: {

                show: false
            },
            toolbox: {
                x: 'left',
                y: 'top',
                padding: 5,
                itemSize: 40,
                textStyle: {
                    color: '#F5FFFA',
                    fontSize: 0
                }
            },
            visualMap: {
                type:'piecewise',
                pieces: [
                  {min:0, max: 50, label: '三年前店铺', color: '#ffeb3b',symbolSize:10},
                  {min:50, max: 100, label: '近三年店铺',color: '#f44336',symbolSize:10},
                ],
                bottom:"15%",

                textStyle: {
                    color: '#fff'
                }
            },
            bmap: {
                center:this.cityGeo,
                zoom: 11,
                roam: true,
                mapStyle: {
                    styleJson: [{
                        "featureType": "water",
                        "elementType": "all",
                        "stylers": {
                            "color": "#044161"
                        }
                    }, {
                        "featureType": "land",
                        "elementType": "all",
                        "stylers": {
                            "color": "#004981"
                        }
                    }, {
                        "featureType": "boundary",
                        "elementType": "geometry",
                        "stylers": {
                            "color": "#064f85"
                        }
                    }, {
                        "featureType": "railway",
                        "elementType": "all",
                        "stylers": {
                            "visibility": "off"
                        }
                    }, {
                        "featureType": "highway",
                        "elementType": "geometry",
                        "stylers": {
                            "color": "#004981"
                        }
                    }, {
                        "featureType": "highway",
                        "elementType": "geometry.fill",
                        "stylers": {
                            "color": "#005b96",
                            "lightness": 1
                        }
                    }, {
                        "featureType": "highway",
                        "elementType": "labels",
                        "stylers": {
                            "visibility": "off"
                        }
                    }, {
                        "featureType": "arterial",
                        "elementType": "geometry",
                        "stylers": {
                            "color": "#004981"
                        }
                    }, {
                        "featureType": "arterial",
                        "elementType": "geometry.fill",
                        "stylers": {
                            "color": "#00508b"
                        }
                    }, {
                        "featureType": "poi",
                        "elementType": "all",
                        "stylers": {
                            "visibility": "off"
                        }
                    }, {
                        "featureType": "green",
                        "elementType": "all",
                        "stylers": {
                            "color": "#056197",
                            "visibility": "on"
                        }
                    }, {
                        "featureType": "subway",
                        "elementType": "all",
                        "stylers": {
                            "visibility": "off"
                        }
                    }, {
                        "featureType": "manmade",
                        "elementType": "all",
                        "stylers": {
                            "visibility": "off"
                        }
                    }, {
                        "featureType": "local",
                        "elementType": "all",
                        "stylers": {
                            "visibility": "on"
                        }
                    }, {
                        "featureType": "arterial",
                        "elementType": "labels",
                        "stylers": {
                            "visibility": "off"
                        }
                    }, {
                        "featureType": "boundary",
                        "elementType": "geometry.fill",
                        "stylers": {
                            "color": "#029fd4",
                            "visibility": "on"
                        }
                    }, {
                        "featureType": "building",
                        "elementType": "all",
                        "stylers": {
                            "color": "#1a5787"
                        }
                    }, {
                        "featureType": "label",
                        "elementType": "all",
                        "stylers": {
                            "visibility": "on"
                        }
                    }]
                }
            },
            series: [{
                name: '',
                type: 'effectScatter',
                // 设置混合模式为叠加
                blendMode: 'lighter',
                coordinateSystem: 'bmap',
                data: this.convertDetailData(this.data),
                symbolSize: function(val) {
                    return val[2] / 10;
                },
                showEffectOn: 'emphasis',
                rippleEffect: {
                    brushType: 'stroke',
                    //动画中波纹的最大缩放比例:
                    scale: 5
                },
                tooltip: {
                    enterable: false,
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }

                },
                hoverAnimation: false,
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: false
                    },
                    emphasis: {
                        show: false
                    }
                },
                zlevel: 1
            }]
        }

        this.echartData = Object.assign({},option)
      })
    },
     //火星坐标系(Gcj-02)与百度坐标系(BD-09)之间的转换
    gcj02tobd09(lng, lat) {
        var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
        var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
        var bd_lng = z * Math.cos(theta) + 0.0065;
        var bd_lat = z * Math.sin(theta) + 0.006;
        return [bd_lng, bd_lat]
    },
    //返回按钮
    back(){
      this.loading = true
      //返回到全国视图

      if(this.ifDetaill){
        //this.ifDetaill = true 表示在城市视图
        // 城市试图  ->  全国视图
        this.headerShow = false
        this.searchShow = false
        this.getData(baseUrl + '/count')

      }else{
        //this.ifDetaill = false 表示在店铺图
         // 店铺图 -> 城市试图
        this.searchShow = false
         this.options = year
        this.ifDetaill = true
         this.changeShow = true
        this.getCountyData(baseUrl + '/city',{cityName:this.cityName},false)

      }

      setTimeout(() => {
          this.loading = false
      }, 500);

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../../common/css/_reset.scss";

.container {
  width: 100%;
  height: 100%;
  /**
    头部样式返回和切换
   */
  header{
    margin:0 0 10px 0;
    box-shadow: 0 0 8.7px 0.3px rgba(153, 179, 193, 0.26);

   .el-button--mini, .el-button--mini.is-round {
      padding: 7px 15px;
      margin: 3px 10px;
    }
    .select{
         margin-left: 25%;
    }

  }
  /**
    搜索框
   */
  .seach{
    width: 96%;
    margin: 0 auto;
    margin-bottom: -10px;
  }
}

</style>
