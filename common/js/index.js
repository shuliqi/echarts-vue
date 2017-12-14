$(function() {
            var myChart1 = echarts.init(document.getElementById('chart1'));
            // myChart1.showLoading({
            //     text: '正在努力的读取数据中...',    //loading话术
            // });
            // var myChart2;
            var data = []; //渲染的数据
            geoCoordMap = {}; //地理坐标对象

            var series = []
            var off = true;
            getData("https://www.easy-mock.com/mock/5a1bd8fd74e00f187e2cebde/echarts/city", "post")
                // getData("http://tmautobot.zuodiangongke.com/api/v1/app/pposms/map/count", "get")


            //火星坐标系(Gcj-02)与百度坐标系(BD-09)之间的转换
            var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
            var PI = 3.1415926535897932384626;
            var a = 6378245.0;
            var ee = 0.00669342162296594323;

            function gcj02tobd09(lng, lat) {
                var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
                var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
                var bd_lng = z * Math.cos(theta) + 0.0065;
                var bd_lat = z * Math.sin(theta) + 0.006;
                return [bd_lng, bd_lat]
            }








            // 地图点击事件
            myChart1.on("click", function(prama) {
                    var cityArr = ["北京市", "广州市", "西安市", "重庆市", "成都市"]
                    console.log(cityArr.indexOf(prama.data.name);
                        if (cityArr.indexOf(prama.data.name) !== -1) {

                            var mapType = 'china';

                            if (off) {
                                // getCountyData(prama.data.name, "http://tmautobot.zuodiangongke.com/api/v1/app/pposms/map", "get", prama.data.value)
                                // getCountyData(prama.data.name, "http://tmautobot.zuodiangongke.com/api/v1/app/pposms/map", "get", prama.data.value)
                            }
                            off = false
                            $(".year").css('display', 'block')
                            $(".model").css('display', 'block')
                        }



                    })





                /**
                 * 请求数据
                 */


                /**
                 *
                 */
                function getCountyData(name, url, method, paramsData) {
                    $.ajax({
                        url: url,
                        async: false,
                        method: method,
                        data: {
                            cityName: name
                        },
                        success: function(res) {
                            var mydata = res.data
                            data = []

                            // console.info("res:"+res)
                            // console.log(res)
                            for (var i = 0, len = mydata.length; i < len; i++) {
                                // var arr = gcj02tobd09(res.data[i].lng,res.data[i].lat)
                                var Map = [];
                                var obj = {};
                                Map.push(gcj02tobd09(res.data[i].lng, res.data[i].lat)[0]);
                                Map.push(gcj02tobd09(res.data[i].lng, res.data[i].lat)[1])
                                geoCoordMap[i] = Map;
                                obj.name = i;
                                obj.value = 100;
                                data.push(obj)
                            }
                            // console.log("obj")
                            // console.log(obj)
                            // console.log("arr:")
                            // console.log(arr)
                            // console.log("Map:")
                            // console.log(Map)
                            var option = {
                                map: 'china',
                                backgroundColor: '#404a59',
                                // title: {
                                //     left: 'center',
                                //     textStyle: {
                                //         color: '#fff'
                                //     }
                                // },
                                toolTip: {
                                    // trigger: 'item',
                                    // formatter: function(a){
                                    //     return "";
                                    // }
                                    show: false
                                },
                                toolbox: {
                                    x: 'left',
                                    y: 'top',
                                    padding: 5,
                                    itemSize: 40,
                                    // showTitle:true,
                                    textStyle: {
                                        color: '#F5FFFA',
                                        fontSize: 0
                                    },
                                    feature: {
                                        myTool: {
                                            show: true,
                                            title: '点击返回全国视图',
                                            icon: 'image://http://img.guguzhu.com/d/file/android/2014/10/14/zfnyw53dcqn.png',
                                            onclick: function() {
                                                off = true;
                                                var data = []; //渲染的数据
                                                geoCoordMap = {}; //地理坐标对象
                                                getData("https://www.easy-mock.com/mock/5a1bd8fd74e00f187e2cebde/echarts/city", "post")
                                                    // getData("http://tmautobot.zuodiangongke.com/api/v1/app/pposms/map/count", "get")
                                            }
                                        }
                                    }
                                },
                                bmap: {
                                    center: paramsData.splice(0, 2),
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
                                    data: convertData(data),
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
                                }]
                            };


                            myChart1.setOption(option);




                        }
                    });
                    // myChart1.setOption()
                }
                /**
                 *   请求数据
                 * @param {*String} name   请求的参数[请求的的地址]
                 * @param {*} url          请求的url
                 */

                if (!Array.prototype.forEach) {
                    Array.prototype.forEach = function(callback, thisArg) {
                        var T, k;
                        if (this == null) {
                            throw new TypeError(" this is null or not defined");
                        }
                        var O = Object(this);
                        var len = O.length >>> 0; // Hack to convert O.length to a UInt32
                        if ({}.toString.call(callback) != "[object Function]") {
                            throw new TypeError(callback + " is not a function");
                        }
                        if (thisArg) {
                            T = thisArg;
                        }
                        k = 0;
                        while (k < len) {
                            var kValue;
                            if (k in O) {
                                kValue = O[k];
                                callback.call(T, kValue, k, O);
                            }
                            k++;
                        }
                    };
                }

                function convertValue(val) {
                    if (val > 600) {
                        return val / 4
                    } else if (val < 600 && val > 200) {
                        return val / 3
                    } else if (val < 100) {
                        return val + 50
                    } else {
                        return val
                    }
                }

                function getData(url, method) {
                    $.ajax({
                        url: url,
                        async: false,
                        method: method,
                        success: function(res) {
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
                                // console.log(res.data)
                            var mydata = res.data.concat(frontData).sort(function(a, b) {
                                    return b.pposmCount - a.pposmCount
                                })
                                // console.log(mydata)
                                // document.write(mydata)
                            for (var i = 0; i < mydata.length; i++) {

                                var Map = [];
                                var obj = {};
                                Map.push(mydata[i].lng);
                                Map.push(mydata[i].lat);
                                geoCoordMap[mydata[i].cityName] = Map;
                                obj.name = mydata[i].cityName;
                                obj.value = convertValue(mydata[i].pposmCount);
                                data.push(obj)

                            }
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
                                    },
                                    feature: {
                                        myTool: {
                                            show: false,
                                            title: '点击返回全国视图',
                                            icon: './../image/backIcon.png',
                                            onclick: function() {
                                                off = true;
                                                // this.option.toolBox.feature.show = false;
                                                // alert('myToolHandler1')
                                                // getData("http://tmautobot.zuodiangongke.com/api/v1/app/pposms/map/count", "get")

                                                // $("#chart2").show()        var myChart1 = echarts.init(document.getElementById('chart1'));
                                                // // var myChart2;
                                                // var data = []; //渲染的数据
                                                // geoCoordMap = {}; //地理坐标对象
                                                myChart1.clear()
                                                    // getData("https://www.easy-mock.com/mock/5a1bd8fd74e00f187e2cebde/echarts/city", "post")
                                                getData("http://tmautobot.zuodiangongke.com/api/v1/app/pposms/map/count", "get")
                                            }
                                        }
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
                                        data: convertData(data),
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
                                        data: convertData(data.sort(function(a, b) {
                                            return b.value - a.value;
                                        }).slice(0, 2).concat(data.sort(function(a, b) {
                                            return b.value - a.value;
                                        }).slice(3, 5)).concat(data.sort(function(a, b) {
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
                                    // {
                                    //     name: 'Top 5',
                                    //     type: 'effectScatter',
                                    //     // 设置混合模式为叠加
                                    //     blendMode: 'lighter',
                                    //     coordinateSystem: 'bmap',
                                    //     roam:'scale',
                                    //     data: convertData(data).slice(0,6),
                                    //     symbolSize: function(val) {
                                    //         return val[2] / 10;
                                    //     },
                                    //     showEffectOn: 'render',
                                    //     rippleEffect: {
                                    //         brushType: 'stroke'
                                    //     },
                                    //     tooltip: {
                                    //         // enterable: true,
                                    //         // axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                    //         //     type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                                    //         // }
                                    //         trigger: 'item',
                                    //         formatter: function(a) {
                                    //             return "";
                                    //         }
                                    //     },

                                    //     hoverAnimation: true,
                                    //     label: {
                                    //         normal: {
                                    //             formatter: '{b}',
                                    //             position: 'right',
                                    //             show: false
                                    //         }
                                    //     },
                                    //     itemStyle: {
                                    //         normal: {
                                    //             // color:,
                                    //             shadowBlur: 10,
                                    //             // shadowColor: '#333',
                                    //             color: function(params) {　 //首先定义一个数组
                                    //                 // var colorList = [
                                    //                 //     '#ff3333', 'orange', 'yellow', 'lime', 'aqua',
                                    //                 //     '#B74AE5', '#0AAF9F', '#E89589'
                                    //                 // ];
                                    //                     var colorList = ['#800000','#b30000','#ff0000', '#ff3333', '#ff6666']
                                    //                 return colorList[params.dataIndex]
                                    //             },
                                    //         }
                                    //     },
                                    //     zlevel: 1
                                    // }
                                ]
                            };

                            myChart1.setOption(option);

                        }
                    });
                }

                function convertData(data) {
                    var res = [];
                    for (var i = 0; i < data.length; i++) {
                        var geoCoord = geoCoordMap[data[i].name];
                        if (geoCoord) {
                            res.push({
                                name: data[i].name,
                                value: geoCoord.concat(data[i].value)
                            });
                        }
                    }
                    return res;
                };

                function renderItem(params, api) {
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
                }




                function getDistrictDetails() {
                    myChart1.clear()

                    var res = {
                        errcode: 0,
                        errmsg: "OK",
                        data: [{
                                lng: 116.451284,
                                lat: 39.927482,
                                district: '朝阳区',
                                pposmCount: 100
                            },
                            {
                                lng: 116.301984,
                                lat: 39.965711,
                                district: '朝阳区',
                                pposmCount: 89
                            },
                            {
                                lng: 116.229258,
                                lat: 39.911385,
                                district: '石景山区',
                                pposmCount: 89
                            },
                            {
                                lng: 116.109963,
                                lat: 39.946354,
                                district: '门头沟区',
                                pposmCount: 89
                            },
                            {
                                lng: 116.235869,
                                lat: 40.225892,
                                district: '昌平区',
                                pposmCount: 89
                            },
                            {
                                lng: 116.663606,
                                lat: 40.137254,
                                district: '顺义区',
                                pposmCount: 89
                            },
                            {
                                lng: 115.978307,
                                lat: 40.467397,
                                district: '延庆区',
                                pposmCount: 49
                            },
                            {
                                lng: 116.63946,
                                lat: 40.327615,
                                district: '怀柔区',
                                pposmCount: 8
                            },
                            {
                                lng: 116.846429,
                                lat: 40.385673,
                                district: '密云区',
                                pposmCount: 3
                            },
                            {
                                lng: 117.128138,
                                lat: 40.148726,
                                district: '平谷区',
                                pposmCount: 8
                            },
                            {
                                lng: 116.669355,
                                lat: 39.921568,
                                district: '通州区',
                                pposmCount: 57
                            },
                            {
                                lng: 116.286462,
                                lat: 39.872855,
                                district: '丰台区',
                                pposmCount: 44
                            },
                            {
                                lng: 116.343953,
                                lat: 39.731835,
                                district: '大兴区',
                                pposmCount: 105
                            },
                            {
                                lng: 116.143883,
                                lat: 39.75314,
                                district: '房山区',
                                pposmCount: 30
                            }
                        ]
                    }


                    // $.ajax({
                    //     url: url,
                    //     async: false,
                    //     method: method,
                    //     data: {
                    //         cityName: name
                    //     },
                    // success: function(res) {
                    var mydata = res.data
                    data = []

                    // console.info("res:"+res)
                    // console.log(res)
                    for (var i = 0, len = mydata.length; i < len; i++) {
                        // var arr = gcj02tobd09(res.data[i].lng,res.data[i].lat)
                        var Map = [];
                        var obj = {};
                        Map.push(gcj02tobd09(res.data[i].lng, res.data[i].lat)[0]);
                        Map.push(gcj02tobd09(res.data[i].lng, res.data[i].lat)[1])
                        geoCoordMap[i] = Map;
                        obj.name = i;
                        obj.value = mydata[i].pposmCount * 3;
                        data.push(obj)
                    }
                    // console.log("obj")
                    // console.log(obj)
                    // console.log("arr:")
                    // console.log(arr)
                    // console.log("Map:")
                    // console.log(Map)
                    var option = {
                        backgroundColor: '#404a59',
                        // title: {
                        //     left: 'center',
                        //     textStyle: {
                        //         color: '#fff'
                        //     }
                        // },
                        toolTip: {
                            // trigger: 'item',
                            // formatter: function(a){
                            //     return "";
                            // }
                            show: false
                        },
                        toolbox: {
                            x: 'left',
                            y: 'top',
                            padding: 5,
                            itemSize: 40,
                            // showTitle:true,
                            textStyle: {
                                color: '#F5FFFA',
                                fontSize: 0
                            },
                            feature: {
                                myTool: {
                                    show: true,
                                    title: '点击返回全国视图',
                                    icon: 'image://http://img.guguzhu.com/d/file/android/2014/10/14/zfnyw53dcqn.png',
                                    onclick: function() {
                                        off = true;
                                        // this.option.toolBox.feature.show = false;
                                        // alert('myToolHandler1')
                                        // getData("http://tmautobot.zuodiangongke.com/api/v1/app/pposms/map/count", "get")

                                        // $("#chart2").show()        var myChart1 = echarts.init(document.getElementById('chart1'));
                                        // var myChart2;
                                        var data = []; //渲染的数据
                                        geoCoordMap = {}; //地理坐标对象
                                        // getData("https://www.easy-mock.com/mock/5a1bd8fd74e00f187e2cebde/echarts/city", "post")
                                        getData("http://tmautobot.zuodiangongke.com/api/v1/app/pposms/map/count", "get")
                                    }
                                }
                            }
                        },
                        bmap: {
                            // center: paramsData.splice(0, 2),
                            center: [116.143883, 39.75314],
                            zoom: 10,
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
                            name: '',
                            type: 'effectScatter',
                            // 设置混合模式为叠加
                            blendMode: 'lighter',
                            coordinateSystem: 'bmap',
                            data: convertData(data),
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
                                    show: true
                                },
                                emphasis: {
                                    areaColor: 'black'
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
                        }]
                    };


                    myChart1.setOption(option);




                    // }
                    // });
                }


                /**
                 *   获取一个地址的地理坐标
                 * @param {*String} name     请求的地址
                 */
                // function geoCoord(name) {
                //     var geo = [];
                //     $.ajax({
                //         url: "http://restapi.amap.com/v3/geocode/geo",
                //         async: false,
                //         method: "get",
                //         data: {
                //             address: name,
                //             key: "c1dfaba0029c05694e83bee2ddd1cfb6"
                //         },
                //         success: function(data) {
                //             console.log(data)
                //             var arr = data.geocodes[0].location.split(",")
                //             for (var i = 0, len = arr.length; i < len; i++) {

                //                 geo.push(arr[i])
                //             }

                //         }
                //     })
                //     return geo
                // }

            });