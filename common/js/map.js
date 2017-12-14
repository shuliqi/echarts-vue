define("echarts/chart/map", ["require", "./base", "zrender/shape/Text", "zrender/shape/Path", "zrender/shape/Circle", "zrender/shape/Rectangle", "zrender/shape/Line", "zrender/shape/Polygon", "zrender/shape/Ellipse", "../component/dataRange", "../component/roamController", "../config", "../util/ecData", "zrender/tool/util", "zrender/config", "zrender/tool/event", "../util/mapData/params", "../util/mapData/textFixed", "../util/mapData/geoCoord", "../util/projection/svg", "../util/projection/normal", "../chart"], function(e) {
    function t(e, t, n, a, o) {
        i.call(this, e, t, n, a, o);
        var r = this;
        r._onmousewheel = function(e) { return r.__onmousewheel(e) }, r._onmousedown = function(e) { return r.__onmousedown(e) }, r._onmousemove = function(e) { return r.__onmousemove(e) }, r._onmouseup = function(e) { return r.__onmouseup(e) }, r._onroamcontroller = function(e) { return r.__onroamcontroller(e) }, r._ondrhoverlink = function(e) { return r.__ondrhoverlink(e) }, this._isAlive = !0, this._selectedMode = {}, this._activeMapType = {}, this._clickable = {}, this._hoverable = {}, this._showLegendSymbol = {}, this._selected = {}, this._mapTypeMap = {}, this._mapDataMap = {}, this._nameMap = {}, this._specialArea = {}, this._refreshDelayTicket, this._mapDataRequireCounter, this._markAnimation = !1, this._hoverLinkMap = {}, this._roamMap = {}, this._scaleLimitMap = {}, this._mx, this._my, this._mousedown, this._justMove, this._curMapType, this.refresh(a), this.zr.on(d.EVENT.MOUSEWHEEL, this._onmousewheel), this.zr.on(d.EVENT.MOUSEDOWN, this._onmousedown), t.bind(m.EVENT.ROAMCONTROLLER, this._onroamcontroller), t.bind(m.EVENT.DATA_RANGE_HOVERLINK, this._ondrhoverlink)
    }
    var i = e("./base"),
        n = e("zrender/shape/Text"),
        a = e("zrender/shape/Path"),
        o = e("zrender/shape/Circle"),
        r = e("zrender/shape/Rectangle"),
        s = e("zrender/shape/Line"),
        l = e("zrender/shape/Polygon"),
        h = e("zrender/shape/Ellipse");
    e("../component/dataRange"), e("../component/roamController");
    var m = e("../config");
    m.map = { zlevel: 0, z: 2, mapType: "china", mapValuePrecision: 0, showLegendSymbol: !0, dataRangeHoverLink: !0, hoverable: !0, clickable: !0, itemStyle: { normal: { borderColor: "rgba(0,0,0,0)", borderWidth: 1, areaStyle: { color: "#ccc" }, label: { show: !1, textStyle: { color: "rgb(139,69,19)" } } }, emphasis: { borderColor: "rgba(0,0,0,0)", borderWidth: 1, areaStyle: { color: "rgba(255,215,0,0.8)" }, label: { show: !1, textStyle: { color: "rgb(100,0,0)" } } } } };
    var V = e("../util/ecData"),
        U = e("zrender/tool/util"),
        d = e("zrender/config"),
        p = e("zrender/tool/event"),
        c = e("../util/mapData/params").params,
        u = e("../util/mapData/textFixed"),
        y = e("../util/mapData/geoCoord");
    return t.prototype = {
        type: m.CHART_TYPE_MAP,
        _buildShape: function() {
            var e = this.series;
            this.selectedMap = {}, this._activeMapType = {};
            for (var t, i, n, a, o = this.component.legend, r = {}, s = {}, l = {}, h = {}, V = 0, d = e.length; d > V; V++)
                if (e[V].type == m.CHART_TYPE_MAP && (e[V] = this.reformOption(e[V]), i = e[V].mapType, s[i] = s[i] || {}, s[i][V] = !0, l[i] = l[i] || e[V].mapValuePrecision, this._scaleLimitMap[i] = this._scaleLimitMap[i] || {}, e[V].scaleLimit && U.merge(this._scaleLimitMap[i], e[V].scaleLimit, !0), this._roamMap[i] = e[V].roam || this._roamMap[i], (null == this._hoverLinkMap[i] || this._hoverLinkMap[i]) && (this._hoverLinkMap[i] = e[V].dataRangeHoverLink), this._nameMap[i] = this._nameMap[i] || {}, e[V].nameMap && U.merge(this._nameMap[i], e[V].nameMap, !0), this._activeMapType[i] = !0, e[V].textFixed && U.merge(u, e[V].textFixed, !0), e[V].geoCoord && U.merge(y, e[V].geoCoord, !0), this._selectedMode[i] = this._selectedMode[i] || e[V].selectedMode, (null == this._hoverable[i] || this._hoverable[i]) && (this._hoverable[i] = e[V].hoverable), (null == this._clickable[i] || this._clickable[i]) && (this._clickable[i] = e[V].clickable), (null == this._showLegendSymbol[i] || this._showLegendSymbol[i]) && (this._showLegendSymbol[i] = e[V].showLegendSymbol), h[i] = h[i] || e[V].mapValueCalculation, t = e[V].name, this.selectedMap[t] = o ? o.isSelected(t) : !0, this.selectedMap[t])) {
                    r[i] = r[i] || {}, n = e[V].data;
                    for (var p = 0, g = n.length; g > p; p++) {
                        a = this._nameChange(i, n[p].name), r[i][a] = r[i][a] || { seriesIndex: [], valueMap: {} };
                        for (var b in n[p]) "value" != b ? r[i][a][b] = n[p][b] : isNaN(n[p].value) || (null == r[i][a].value && (r[i][a].value = 0), r[i][a].value += +n[p].value, r[i][a].valueMap[V] = +n[p].value);
                        r[i][a].seriesIndex.push(V)
                    }
                }
            this._mapDataRequireCounter = 0;
            for (var f in r) this._mapDataRequireCounter++;
            this._clearSelected(), 0 === this._mapDataRequireCounter && (this.clear(), this.zr && this.zr.delShape(this.lastShapeList), this.lastShapeList = []);
            for (var f in r) {
                if (h[f] && "average" == h[f])
                    for (var g in r[f]) r[f][g].value = (r[f][g].value / r[f][g].seriesIndex.length).toFixed(l[f]) - 0;
                this._mapDataMap[f] = this._mapDataMap[f] || {}, this._mapDataMap[f].mapData ? this._mapDataCallback(f, r[f], s[f])(this._mapDataMap[f].mapData) : c[f.replace(/\|.*/, "")].getGeoJson && (this._specialArea[f] = c[f.replace(/\|.*/, "")].specialArea || this._specialArea[f], c[f.replace(/\|.*/, "")].getGeoJson(this._mapDataCallback(f, r[f], s[f])))
            }
        },
        _mapDataCallback: function(t, i, n) { var a = this; return function(o) { a._isAlive && null != a._activeMapType[t] && (-1 != t.indexOf("|") && (o = a._getSubMapData(t, o)), a._mapDataMap[t].mapData = o, o.firstChild ? (a._mapDataMap[t].rate = 1, a._mapDataMap[t].projection = e("../util/projection/svg")) : (a._mapDataMap[t].rate = .75, a._mapDataMap[t].projection = e("../util/projection/normal")), a._buildMap(t, a._getProjectionData(t, o, n), i, n), a._buildMark(t, n), --a._mapDataRequireCounter <= 0 && (a.addShapeList(), a.zr.refreshNextFrame())) } },
        _clearSelected: function() { for (var e in this._selected) this._activeMapType[this._mapTypeMap[e]] || (delete this._selected[e], delete this._mapTypeMap[e]) },
        _getSubMapData: function(e, t) {
            for (var i = e.replace(/^.*\|/, ""), n = t.features, a = 0, o = n.length; o > a; a++)
                if (n[a].properties && n[a].properties.name == i) { n = n[a], "United States of America" == i && n.geometry.coordinates.length > 1 && (n = { geometry: { coordinates: n.geometry.coordinates.slice(5, 6), type: n.geometry.type }, id: n.id, properties: n.properties, type: n.type }); break }
            return { type: "FeatureCollection", features: [n] }
        },
        _getProjectionData: function(e, t, i) {
            var n, a = this._mapDataMap[e].projection,
                o = [],
                r = this._mapDataMap[e].bbox || a.getBbox(t, this._specialArea[e]);
            n = this._mapDataMap[e].hasRoam ? this._mapDataMap[e].transform : this._getTransform(r, i, this._mapDataMap[e].rate);
            var s, l = this._mapDataMap[e].lastTransform || { scale: {} };
            n.left != l.left || n.top != l.top || n.scale.x != l.scale.x || n.scale.y != l.scale.y ? (s = a.geoJson2Path(t, n, this._specialArea[e]), l = U.clone(n)) : (n = this._mapDataMap[e].transform, s = this._mapDataMap[e].pathArray), this._mapDataMap[e].bbox = r, this._mapDataMap[e].transform = n, this._mapDataMap[e].lastTransform = l, this._mapDataMap[e].pathArray = s;
            for (var h = [n.left, n.top], m = 0, V = s.length; V > m; m++) o.push(this._getSingleProvince(e, s[m], h));
            if (this._specialArea[e])
                for (var d in this._specialArea[e]) o.push(this._getSpecialProjectionData(e, t, d, this._specialArea[e][d], h));
            if ("china" == e) {
                var p = this.geo2pos(e, y["鍗楁捣璇稿矝"] || c["鍗楁捣璇稿矝"].textCoord),
                    g = n.scale.x / 10.5,
                    b = [32 * g + p[0], 83 * g + p[1]];
                u["鍗楁捣璇稿矝"] && (b[0] += u["鍗楁捣璇稿矝"][0], b[1] += u["鍗楁捣璇稿矝"][1]), o.push({ name: this._nameChange(e, "鍗楁捣璇稿矝"), path: c["鍗楁捣璇稿矝"].getPath(p, g), position: h, textX: b[0], textY: b[1] })
            }
            return o
        },
        _getSpecialProjectionData: function(t, i, n, a, o) {
            i = this._getSubMapData("x|" + n, i);
            var r = e("../util/projection/normal"),
                s = r.getBbox(i),
                l = this.geo2pos(t, [a.left, a.top]),
                h = this.geo2pos(t, [a.left + a.width, a.top + a.height]),
                m = Math.abs(h[0] - l[0]),
                V = Math.abs(h[1] - l[1]),
                U = s.width,
                d = s.height,
                p = m / .75 / U,
                c = V / d;
            p > c ? (p = .75 * c, m = U * p) : (c = p, p = .75 * c, V = d * c);
            var u = { OffsetLeft: l[0], OffsetTop: l[1], scale: { x: p, y: c } },
                y = r.geoJson2Path(i, u);
            return this._getSingleProvince(t, y[0], o)
        },
        _getSingleProvince: function(e, t, i) {
            var n, a = t.properties.name,
                o = u[a] || [0, 0];
            if (y[a]) n = this.geo2pos(e, y[a]);
            else if (t.cp) n = [t.cp[0] + o[0], t.cp[1] + o[1]];
            else {
                var r = this._mapDataMap[e].bbox;
                n = this.geo2pos(e, [r.left + r.width / 2, r.top + r.height / 2]), n[0] += o[0], n[1] += o[1]
            }
            return t.name = this._nameChange(e, a), t.position = i, t.textX = n[0], t.textY = n[1], t
        },
        _getTransform: function(e, t, i) {
            var n, a, o, r, s, l, h, m = this.series,
                V = this.zr.getWidth(),
                U = this.zr.getHeight(),
                d = Math.round(.02 * Math.min(V, U));
            for (var p in t) n = m[p].mapLocation || {}, o = n.x || o, s = n.y || s, l = n.width || l, h = n.height || h;
            a = this.parsePercent(o, V), a = isNaN(a) ? d : a, r = this.parsePercent(s, U), r = isNaN(r) ? d : r, l = null == l ? V - a - 2 * d : this.parsePercent(l, V), h = null == h ? U - r - 2 * d : this.parsePercent(h, U);
            var c = e.width,
                u = e.height,
                y = l / i / c,
                g = h / u;
            if (y > g ? (y = g * i, l = c * y) : (g = y, y = g * i, h = u * g), isNaN(o)) switch (o = o || "center", o + "") {
                case "center":
                    a = Math.floor((V - l) / 2);
                    break;
                case "right":
                    a = V - l
            }
            if (isNaN(s)) switch (s = s || "center", s + "") {
                case "center":
                    r = Math.floor((U - h) / 2);
                    break;
                case "bottom":
                    r = U - h
            }
            return { left: a, top: r, width: l, height: h, baseScale: 1, scale: { x: y, y: g } }
        },
        _buildMap: function(e, t, i, d) {
            for (var p, c, u, y, g, b, f, k, x, _, L, W = this.series, X = this.component.legend, K = this.component.dataRange, v = 0, w = t.length; w > v; v++) {
                if (k = U.clone(t[v]), x = { name: k.name, path: k.path, position: U.clone(k.position) }, c = k.name, u = i[c]) {
                    g = [u], p = "";
                    for (var I = 0, J = u.seriesIndex.length; J > I; I++) g.push(W[u.seriesIndex[I]]), p += W[u.seriesIndex[I]].name + " ", X && this._showLegendSymbol[e] && X.hasColor(W[u.seriesIndex[I]].name) && this.shapeList.push(new o({ zlevel: this.getZlevelBase(), z: this.getZBase() + 1, position: U.clone(k.position), _mapType: e, style: { x: k.textX + 3 + 7 * I, y: k.textY - 10, r: 3, color: X.getColor(W[u.seriesIndex[I]].name) }, hoverable: !1 }));
                    y = u.value
                } else {
                    u = { name: c, value: "-" }, p = "", g = [];
                    for (var C in d) g.push(W[C]);
                    y = "-"
                }
                switch (this.ecTheme.map && g.push(this.ecTheme.map), g.push(m.map), b = K && !isNaN(y) ? K.getColor(y) : null, k.color = k.color || b || this.getItemStyleColor(this.deepQuery(g, "itemStyle.normal.color"), u.seriesIndex, -1, u) || this.deepQuery(g, "itemStyle.normal.areaStyle.color"), k.strokeColor = k.strokeColor || this.deepQuery(g, "itemStyle.normal.borderColor"), k.lineWidth = k.lineWidth || this.deepQuery(g, "itemStyle.normal.borderWidth"), x.color = this.getItemStyleColor(this.deepQuery(g, "itemStyle.emphasis.color"), u.seriesIndex, -1, u) || this.deepQuery(g, "itemStyle.emphasis.areaStyle.color") || k.color, x.strokeColor = this.deepQuery(g, "itemStyle.emphasis.borderColor") || k.strokeColor, x.lineWidth = this.deepQuery(g, "itemStyle.emphasis.borderWidth") || k.lineWidth, k.brushType = x.brushType = k.brushType || "both", k.lineJoin = x.lineJoin = "round", k._name = x._name = c, f = this.deepQuery(g, "itemStyle.normal.label.textStyle"), L = { zlevel: this.getZlevelBase(), z: this.getZBase() + 1, position: U.clone(k.position), _mapType: e, _geo: this.pos2geo(e, [k.textX, k.textY]), style: { brushType: "fill", x: k.textX, y: k.textY, text: this.getLabelText(c, y, g, "normal"), _name: c, textAlign: "center", color: this.deepQuery(g, "itemStyle.normal.label.show") ? this.deepQuery(g, "itemStyle.normal.label.textStyle.color") : "rgba(0,0,0,0)", textFont: this.getFont(f) } }, L._style = U.clone(L.style), L.highlightStyle = U.clone(L.style), this.deepQuery(g, "itemStyle.emphasis.label.show") ? (L.highlightStyle.text = this.getLabelText(c, y, g, "emphasis"), L.highlightStyle.color = this.deepQuery(g, "itemStyle.emphasis.label.textStyle.color") || L.style.color, f = this.deepQuery(g, "itemStyle.emphasis.label.textStyle") || f, L.highlightStyle.textFont = this.getFont(f)) : L.highlightStyle.color = "rgba(0,0,0,0)", _ = { zlevel: this.getZlevelBase(), z: this.getZBase(), position: U.clone(k.position), style: k, highlightStyle: x, _style: U.clone(k), _mapType: e }, null != k.scale && (_.scale = U.clone(k.scale)), L = new n(L), _.style.shapeType) {
                    case "rectangle":
                        _ = new r(_);
                        break;
                    case "line":
                        _ = new s(_);
                        break;
                    case "circle":
                        _ = new o(_);
                        break;
                    case "polygon":
                        _ = new l(_);
                        break;
                    case "ellipse":
                        _ = new h(_);
                        break;
                    default:
                        _ = new a(_), _.buildPathArray && (_.style.pathArray = _.buildPathArray(_.style.path))
                }(this._selectedMode[e] && this._selected[c] || u.selected && this._selected[c] !== !1) && (L.style = L.highlightStyle, _.style = _.highlightStyle), L.clickable = _.clickable = this._clickable[e] && (null == u.clickable || u.clickable), this._selectedMode[e] && (this._selected[c] = null != this._selected[c] ? this._selected[c] : u.selected, this._mapTypeMap[c] = e, (null == u.selectable || u.selectable) && (_.clickable = L.clickable = !0, _.onclick = L.onclick = this.shapeHandler.onclick)), this._hoverable[e] && (null == u.hoverable || u.hoverable) ? (L.hoverable = _.hoverable = !0, _.hoverConnect = L.id, L.hoverConnect = _.id) : L.hoverable = _.hoverable = !1, V.pack(L, { name: p, tooltip: this.deepQuery(g, "tooltip") }, 0, u, 0, c), this.shapeList.push(L), V.pack(_, { name: p, tooltip: this.deepQuery(g, "tooltip") }, 0, u, 0, c), this.shapeList.push(_)
            }
        },
        _buildMark: function(e, t) { this._seriesIndexToMapType = this._seriesIndexToMapType || {}, this.markAttachStyle = this.markAttachStyle || {}; var i = [this._mapDataMap[e].transform.left, this._mapDataMap[e].transform.top]; "none" == e && (i = [0, 0]); for (var n in t) this._seriesIndexToMapType[n] = e, this.markAttachStyle[n] = { position: i, _mapType: e }, this.buildMark(n) },
        getMarkCoord: function(e, t) { return t.geoCoord || y[t.name] ? this.geo2pos(this._seriesIndexToMapType[e], t.geoCoord || y[t.name]) : [0, 0] },
        getMarkGeo: function(e) { return e.geoCoord || y[e.name] },
        _nameChange: function(e, t) { return this._nameMap[e][t] || t },
        getLabelText: function(e, t, i, n) { var a = this.deepQuery(i, "itemStyle." + n + ".label.formatter"); return a ? "function" == typeof a ? a.call(this.myChart, e, t) : "string" == typeof a ? (a = a.replace("{a}", "{a0}").replace("{b}", "{b0}"), a = a.replace("{a0}", e).replace("{b0}", t)) : void 0 : e },
        _findMapTypeByPos: function(e, t) {
            var i, n, a, o, r;
            for (var s in this._mapDataMap)
                if (i = this._mapDataMap[s].transform, i && this._roamMap[s] && this._activeMapType[s] && (n = i.left, a = i.top, o = i.width, r = i.height, e >= n && n + o >= e && t >= a && a + r >= t)) return s
        },
        __onmousewheel: function(e) {
            function t(e, t) {
                for (var i = 0; i < e.pointList.length; i++) {
                    var n = e.pointList[i];
                    n[0] *= t, n[1] *= t
                }
                var a = e.controlPointList;
                if (a)
                    for (var i = 0; i < a.length; i++) {
                        var n = a[i];
                        n[0] *= t, n[1] *= t
                    }
            }

            function i(e, t) { e.xStart *= t, e.yStart *= t, e.xEnd *= t, e.yEnd *= t, null != e.cpX1 && (e.cpX1 *= t, e.cpY1 *= t) }
            if (!(this.shapeList.length <= 0)) {
                for (var n = 0, a = this.shapeList.length; a > n; n++) { var o = this.shapeList[n]; if (o.__animating) return }
                var r, s, l = e.event,
                    h = p.getX(l),
                    V = p.getY(l),
                    U = p.getDelta(l),
                    d = e.mapTypeControl;
                d || (d = {}, s = this._findMapTypeByPos(h, V), s && this._roamMap[s] && "move" != this._roamMap[s] && (d[s] = !0));
                var c = !1;
                for (s in d)
                    if (d[s]) {
                        c = !0;
                        var u = this._mapDataMap[s].transform,
                            y = u.left,
                            g = u.top,
                            b = u.width,
                            f = u.height,
                            k = this.pos2geo(s, [h - y, V - g]);
                        if (U > 0) { if (r = 1.2, null != this._scaleLimitMap[s].max && u.baseScale >= this._scaleLimitMap[s].max) continue } else if (r = 1 / 1.2, null != this._scaleLimitMap[s].min && u.baseScale <= this._scaleLimitMap[s].min) continue;
                        u.baseScale *= r, u.scale.x *= r, u.scale.y *= r, u.width = b * r, u.height = f * r, this._mapDataMap[s].hasRoam = !0, this._mapDataMap[s].transform = u, k = this.geo2pos(s, k), u.left -= k[0] - (h - y), u.top -= k[1] - (V - g), this._mapDataMap[s].transform = u, this.clearEffectShape(!0);
                        for (var n = 0, a = this.shapeList.length; a > n; n++) {
                            var o = this.shapeList[n];
                            if (o._mapType == s) {
                                var x = o.type,
                                    _ = o.style;
                                switch (o.position[0] = u.left, o.position[1] = u.top, x) {
                                    case "path":
                                    case "symbol":
                                    case "circle":
                                    case "rectangle":
                                    case "polygon":
                                    case "line":
                                    case "ellipse":
                                        o.scale[0] *= r, o.scale[1] *= r;
                                        break;
                                    case "mark-line":
                                        i(_, r);
                                        break;
                                    case "polyline":
                                        t(_, r);
                                        break;
                                    case "shape-bundle":
                                        for (var L = 0; L < _.shapeList.length; L++) { var W = _.shapeList[L]; "mark-line" == W.type ? i(W.style, r) : "polyline" == W.type && t(W.style, r) }
                                        break;
                                    case "icon":
                                    case "image":
                                        k = this.geo2pos(s, o._geo), _.x = _._x = k[0] - _.width / 2, _.y = _._y = k[1] - _.height / 2;
                                        break;
                                    default:
                                        k = this.geo2pos(s, o._geo), _.x = k[0], _.y = k[1], "text" == x && (o._style.x = o.highlightStyle.x = k[0], o._style.y = o.highlightStyle.y = k[1])
                                }
                                this.zr.modShape(o.id)
                            }
                        }
                    }
                if (c) {
                    p.stop(l), this.zr.refreshNextFrame();
                    var X = this;
                    clearTimeout(this._refreshDelayTicket), this._refreshDelayTicket = setTimeout(function() { X && X.shapeList && X.animationEffect() }, 100), this.messageCenter.dispatch(m.EVENT.MAP_ROAM, e.event, { type: "scale" }, this.myChart)
                }
            }
        },
        __onmousedown: function(e) {
            if (!(this.shapeList.length <= 0)) {
                var t = e.target;
                if (!t || !t.draggable) {
                    var i = e.event,
                        n = p.getX(i),
                        a = p.getY(i),
                        o = this._findMapTypeByPos(n, a);
                    if (o && this._roamMap[o] && "scale" != this._roamMap[o]) {
                        this._mousedown = !0, this._mx = n, this._my = a, this._curMapType = o, this.zr.on(d.EVENT.MOUSEUP, this._onmouseup);
                        var r = this;
                        setTimeout(function() { r.zr.on(d.EVENT.MOUSEMOVE, r._onmousemove) }, 100)
                    }
                }
            }
        },
        __onmousemove: function(e) {
            if (this._mousedown && this._isAlive) {
                var t = e.event,
                    i = p.getX(t),
                    n = p.getY(t),
                    a = this._mapDataMap[this._curMapType].transform;
                a.hasRoam = !0, a.left -= this._mx - i, a.top -= this._my - n, this._mx = i, this._my = n, this._mapDataMap[this._curMapType].transform = a;
                for (var o = 0, r = this.shapeList.length; r > o; o++) this.shapeList[o]._mapType == this._curMapType && (this.shapeList[o].position[0] = a.left, this.shapeList[o].position[1] = a.top, this.zr.modShape(this.shapeList[o].id));
                this.messageCenter.dispatch(m.EVENT.MAP_ROAM, e.event, { type: "move" }, this.myChart), this.clearEffectShape(!0), this.zr.refreshNextFrame(), this._justMove = !0, p.stop(t)
            }
        },
        __onmouseup: function(e) {
            var t = e.event;
            this._mx = p.getX(t), this._my = p.getY(t), this._mousedown = !1;
            var i = this;
            setTimeout(function() { i._justMove && i.animationEffect(), i._justMove = !1, i.zr.un(d.EVENT.MOUSEMOVE, i._onmousemove), i.zr.un(d.EVENT.MOUSEUP, i._onmouseup) }, 120)
        },
        __onroamcontroller: function(e) {
            var t = e.event;
            t.zrenderX = this.zr.getWidth() / 2, t.zrenderY = this.zr.getHeight() / 2;
            var i = e.mapTypeControl,
                n = 0,
                a = 0,
                o = e.step;
            switch (e.roamType) {
                case "scaleUp":
                    return t.zrenderDelta = 1, void this.__onmousewheel({ event: t, mapTypeControl: i });
                case "scaleDown":
                    return t.zrenderDelta = -1, void this.__onmousewheel({ event: t, mapTypeControl: i });
                case "up":
                    n = -o;
                    break;
                case "down":
                    n = o;
                    break;
                case "left":
                    a = -o;
                    break;
                case "right":
                    a = o
            }
            var r, s;
            for (s in i) this._mapDataMap[s] && this._activeMapType[s] && (r = this._mapDataMap[s].transform, r.hasRoam = !0, r.left -= a, r.top -= n, this._mapDataMap[s].transform = r);
            for (var l = 0, h = this.shapeList.length; h > l; l++) s = this.shapeList[l]._mapType, i[s] && this._activeMapType[s] && (r = this._mapDataMap[s].transform, this.shapeList[l].position[0] = r.left, this.shapeList[l].position[1] = r.top, this.zr.modShape(this.shapeList[l].id));
            this.messageCenter.dispatch(m.EVENT.MAP_ROAM, e.event, { type: "move" }, this.myChart), this.clearEffectShape(!0), this.zr.refreshNextFrame(), clearTimeout(this.dircetionTimer);
            var V = this;
            this.dircetionTimer = setTimeout(function() { V.animationEffect() }, 150)
        },
        __ondrhoverlink: function(e) { for (var t, i, n = 0, a = this.shapeList.length; a > n; n++) t = this.shapeList[n]._mapType, this._hoverLinkMap[t] && this._activeMapType[t] && (i = V.get(this.shapeList[n], "value"), null != i && i >= e.valueMin && i <= e.valueMax && this.zr.addHoverShape(this.shapeList[n])) },
        onclick: function(e) {
            if (this.isClick && e.target && !this._justMove && "icon" != e.target.type) {
                this.isClick = !1;
                var t = e.target,
                    i = t.style._name,
                    n = this.shapeList.length,
                    a = t._mapType || "";
                if ("single" == this._selectedMode[a])
                    for (var o in this._selected)
                        if (this._selected[o] && this._mapTypeMap[o] == a) {
                            for (var r = 0; n > r; r++) this.shapeList[r].style._name == o && this.shapeList[r]._mapType == a && (this.shapeList[r].style = this.shapeList[r]._style, this.zr.modShape(this.shapeList[r].id));
                            o != i && (this._selected[o] = !1)
                        }
                this._selected[i] = !this._selected[i];
                for (var r = 0; n > r; r++) this.shapeList[r].style._name == i && this.shapeList[r]._mapType == a && (this.shapeList[r].style = this._selected[i] ? this.shapeList[r].highlightStyle : this.shapeList[r]._style, this.zr.modShape(this.shapeList[r].id));
                this.messageCenter.dispatch(m.EVENT.MAP_SELECTED, e.event, { selected: this._selected, target: i }, this.myChart), this.zr.refreshNextFrame();
                var s = this;
                setTimeout(function() { s.zr.trigger(d.EVENT.MOUSEMOVE, e.event) }, 100)
            }
        },
        refresh: function(e) { e && (this.option = e, this.series = e.series), this._mapDataRequireCounter > 0 ? this.clear() : this.backupShapeList(), this._buildShape(), this.zr.refreshHover() },
        ondataRange: function(e, t) { this.component.dataRange && (this.refresh(), t.needRefresh = !0) },
        pos2geo: function(e, t) { return this._mapDataMap[e].transform ? this._mapDataMap[e].projection.pos2geo(this._mapDataMap[e].transform, t) : null },
        getGeoByPos: function(e, t) { if (!this._mapDataMap[e].transform) return null; var i = [this._mapDataMap[e].transform.left, this._mapDataMap[e].transform.top]; return t instanceof Array ? (t[0] -= i[0], t[1] -= i[1]) : (t.x -= i[0], t.y -= i[1]), this.pos2geo(e, t) },
        geo2pos: function(e, t) { return this._mapDataMap[e].transform ? this._mapDataMap[e].projection.geo2pos(this._mapDataMap[e].transform, t) : null },
        getPosByGeo: function(e, t) { if (!this._mapDataMap[e].transform) return null; var i = this.geo2pos(e, t); return i[0] += this._mapDataMap[e].transform.left, i[1] += this._mapDataMap[e].transform.top, i },
        getMapPosition: function(e) { return this._mapDataMap[e].transform ? [this._mapDataMap[e].transform.left, this._mapDataMap[e].transform.top] : null },
        onbeforDispose: function() { this._isAlive = !1, this.zr.un(d.EVENT.MOUSEWHEEL, this._onmousewheel), this.zr.un(d.EVENT.MOUSEDOWN, this._onmousedown), this.messageCenter.unbind(m.EVENT.ROAMCONTROLLER, this._onroamcontroller), this.messageCenter.unbind(m.EVENT.DATA_RANGE_HOVERLINK, this._ondrhoverlink) }
    }, U.inherits(t, i), e("../chart").define("map", t), t
}), define("zrender/shape/Path", ["require", "./Base", "./util/PathProxy", "../tool/util"], function(e) {
    var t = e("./Base"),
        i = e("./util/PathProxy"),
        n = i.PathSegment,
        a = function(e) { return Math.sqrt(e[0] * e[0] + e[1] * e[1]) },
        o = function(e, t) { return (e[0] * t[0] + e[1] * t[1]) / (a(e) * a(t)) },
        r = function(e, t) { return (e[0] * t[1] < e[1] * t[0] ? -1 : 1) * Math.acos(o(e, t)) },
        s = function(e) { t.call(this, e) };
    return s.prototype = {
        type: "path",
        buildPathArray: function(e, t, i) {
            if (!e) return [];
            t = t || 0, i = i || 0;
            var a = e,
                o = ["m", "M", "l", "L", "v", "V", "h", "H", "z", "Z", "c", "C", "q", "Q", "t", "T", "s", "S", "a", "A"];
            a = a.replace(/-/g, " -"), a = a.replace(/  /g, " "), a = a.replace(/ /g, ","), a = a.replace(/,,/g, ",");
            var r;
            for (r = 0; r < o.length; r++) a = a.replace(new RegExp(o[r], "g"), "|" + o[r]);
            var s = a.split("|"),
                l = [],
                h = 0,
                m = 0;
            for (r = 1; r < s.length; r++) {
                var V = s[r],
                    U = V.charAt(0);
                V = V.slice(1), V = V.replace(new RegExp("e,-", "g"), "e-");
                var d = V.split(",");
                d.length > 0 && "" === d[0] && d.shift();
                for (var p = 0; p < d.length; p++) d[p] = parseFloat(d[p]);
                for (; d.length > 0 && !isNaN(d[0]);) {
                    var c, u, y, g, b, f, k, x, _ = null,
                        L = [],
                        W = h,
                        X = m;
                    switch (U) {
                        case "l":
                            h += d.shift(), m += d.shift(), _ = "L", L.push(h, m);
                            break;
                        case "L":
                            h = d.shift(), m = d.shift(), L.push(h, m);
                            break;
                        case "m":
                            h += d.shift(), m += d.shift(), _ = "M", L.push(h, m), U = "l";
                            break;
                        case "M":
                            h = d.shift(), m = d.shift(), _ = "M", L.push(h, m), U = "L";
                            break;
                        case "h":
                            h += d.shift(), _ = "L", L.push(h, m);
                            break;
                        case "H":
                            h = d.shift(), _ = "L", L.push(h, m);
                            break;
                        case "v":
                            m += d.shift(), _ = "L", L.push(h, m);
                            break;
                        case "V":
                            m = d.shift(), _ = "L", L.push(h, m);
                            break;
                        case "C":
                            L.push(d.shift(), d.shift(), d.shift(), d.shift()), h = d.shift(), m = d.shift(), L.push(h, m);
                            break;
                        case "c":
                            L.push(h + d.shift(), m + d.shift(), h + d.shift(), m + d.shift()), h += d.shift(), m += d.shift(), _ = "C", L.push(h, m);
                            break;
                        case "S":
                            c = h, u = m, y = l[l.length - 1], "C" === y.command && (c = h + (h - y.points[2]), u = m + (m - y.points[3])), L.push(c, u, d.shift(), d.shift()), h = d.shift(), m = d.shift(), _ = "C", L.push(h, m);
                            break;
                        case "s":
                            c = h, u = m, y = l[l.length - 1], "C" === y.command && (c = h + (h - y.points[2]), u = m + (m - y.points[3])), L.push(c, u, h + d.shift(), m + d.shift()), h += d.shift(), m += d.shift(), _ = "C", L.push(h, m);
                            break;
                        case "Q":
                            L.push(d.shift(), d.shift()), h = d.shift(), m = d.shift(), L.push(h, m);
                            break;
                        case "q":
                            L.push(h + d.shift(), m + d.shift()), h += d.shift(), m += d.shift(), _ = "Q", L.push(h, m);
                            break;
                        case "T":
                            c = h, u = m, y = l[l.length - 1], "Q" === y.command && (c = h + (h - y.points[0]), u = m + (m - y.points[1])), h = d.shift(), m = d.shift(), _ = "Q", L.push(c, u, h, m);
                            break;
                        case "t":
                            c = h, u = m, y = l[l.length - 1], "Q" === y.command && (c = h + (h - y.points[0]), u = m + (m - y.points[1])), h += d.shift(), m += d.shift(), _ = "Q", L.push(c, u, h, m);
                            break;
                        case "A":
                            g = d.shift(), b = d.shift(), f = d.shift(), k = d.shift(), x = d.shift(), W = h, X = m, h = d.shift(), m = d.shift(), _ = "A", L = this._convertPoint(W, X, h, m, k, x, g, b, f);
                            break;
                        case "a":
                            g = d.shift(), b = d.shift(), f = d.shift(), k = d.shift(), x = d.shift(), W = h, X = m, h += d.shift(), m += d.shift(), _ = "A", L = this._convertPoint(W, X, h, m, k, x, g, b, f)
                    }
                    for (var K = 0, v = L.length; v > K; K += 2) L[K] += t, L[K + 1] += i;
                    l.push(new n(_ || U, L))
                }("z" === U || "Z" === U) && l.push(new n("z", []))
            }
            return l
        },
        _convertPoint: function(e, t, i, n, a, s, l, h, m) {
            var V = m * (Math.PI / 180),
                U = Math.cos(V) * (e - i) / 2 + Math.sin(V) * (t - n) / 2,
                d = -1 * Math.sin(V) * (e - i) / 2 + Math.cos(V) * (t - n) / 2,
                p = U * U / (l * l) + d * d / (h * h);
            p > 1 && (l *= Math.sqrt(p), h *= Math.sqrt(p));
            var c = Math.sqrt((l * l * h * h - l * l * d * d - h * h * U * U) / (l * l * d * d + h * h * U * U));
            a === s && (c *= -1), isNaN(c) && (c = 0);
            var u = c * l * d / h,
                y = c * -h * U / l,
                g = (e + i) / 2 + Math.cos(V) * u - Math.sin(V) * y,
                b = (t + n) / 2 + Math.sin(V) * u + Math.cos(V) * y,
                f = r([1, 0], [(U - u) / l, (d - y) / h]),
                k = [(U - u) / l, (d - y) / h],
                x = [(-1 * U - u) / l, (-1 * d - y) / h],
                _ = r(k, x);
            return o(k, x) <= -1 && (_ = Math.PI), o(k, x) >= 1 && (_ = 0), 0 === s && _ > 0 && (_ -= 2 * Math.PI), 1 === s && 0 > _ && (_ += 2 * Math.PI), [g, b, l, h, f, _, V, s]
        },
        buildPath: function(e, t) {
            var i = t.path,
                n = t.x || 0,
                a = t.y || 0;
            t.pathArray = t.pathArray || this.buildPathArray(i, n, a);
            for (var o = t.pathArray, r = t.pointList = [], s = [], l = 0, h = o.length; h > l; l++) { "M" == o[l].command.toUpperCase() && (s.length > 0 && r.push(s), s = []); for (var m = o[l].points, V = 0, U = m.length; U > V; V += 2) s.push([m[V], m[V + 1]]) }
            s.length > 0 && r.push(s);
            for (var l = 0, h = o.length; h > l; l++) {
                var d = o[l].command,
                    m = o[l].points;
                switch (d) {
                    case "L":
                        e.lineTo(m[0], m[1]);
                        break;
                    case "M":
                        e.moveTo(m[0], m[1]);
                        break;
                    case "C":
                        e.bezierCurveTo(m[0], m[1], m[2], m[3], m[4], m[5]);
                        break;
                    case "Q":
                        e.quadraticCurveTo(m[0], m[1], m[2], m[3]);
                        break;
                    case "A":
                        var p = m[0],
                            c = m[1],
                            u = m[2],
                            y = m[3],
                            g = m[4],
                            b = m[5],
                            f = m[6],
                            k = m[7],
                            x = u > y ? u : y,
                            _ = u > y ? 1 : u / y,
                            L = u > y ? y / u : 1;
                        e.translate(p, c), e.rotate(f), e.scale(_, L), e.arc(0, 0, x, g, g + b, 1 - k), e.scale(1 / _, 1 / L), e.rotate(-f), e.translate(-p, -c);
                        break;
                    case "z":
                        e.closePath()
                }
            }
        },
        getRect: function(e) {
            if (e.__rect) return e.__rect;
            var t;
            t = "stroke" == e.brushType || "fill" == e.brushType ? e.lineWidth || 1 : 0;
            for (var i = Number.MAX_VALUE, n = Number.MIN_VALUE, a = Number.MAX_VALUE, o = Number.MIN_VALUE, r = e.x || 0, s = e.y || 0, l = e.pathArray || this.buildPathArray(e.path), h = 0; h < l.length; h++)
                for (var m = l[h].points, V = 0; V < m.length; V++) V % 2 === 0 ? (m[V] + r < i && (i = m[V]), m[V] + r > n && (n = m[V])) : (m[V] + s < a && (a = m[V]), m[V] + s > o && (o = m[V]));
            var U;
            return U = i === Number.MAX_VALUE || n === Number.MIN_VALUE || a === Number.MAX_VALUE || o === Number.MIN_VALUE ? { x: 0, y: 0, width: 0, height: 0 } : { x: Math.round(i - t / 2), y: Math.round(a - t / 2), width: n - i + t, height: o - a + t }, e.__rect = U, U
        }
    }, e("../tool/util").inherits(s, t), s
}), define("zrender/shape/Ellipse", ["require", "./Base", "../tool/util"], function(e) {
    var t = e("./Base"),
        i = function(e) { t.call(this, e) };
    return i.prototype = {
        type: "ellipse",
        buildPath: function(e, t) {
            var i = .5522848,
                n = t.x,
                a = t.y,
                o = t.a,
                r = t.b,
                s = o * i,
                l = r * i;
            e.moveTo(n - o, a), e.bezierCurveTo(n - o, a - l, n - s, a - r, n, a - r), e.bezierCurveTo(n + s, a - r, n + o, a - l, n + o, a), e.bezierCurveTo(n + o, a + l, n + s, a + r, n, a + r), e.bezierCurveTo(n - s, a + r, n - o, a + l, n - o, a), e.closePath()
        },
        getRect: function(e) { if (e.__rect) return e.__rect; var t; return t = "stroke" == e.brushType || "fill" == e.brushType ? e.lineWidth || 1 : 0, e.__rect = { x: Math.round(e.x - e.a - t / 2), y: Math.round(e.y - e.b - t / 2), width: 2 * e.a + t, height: 2 * e.b + t }, e.__rect }
    }, e("../tool/util").inherits(i, t), i
}), define("echarts/component/dataRange", ["require", "./base", "zrender/shape/Text", "zrender/shape/Rectangle", "../util/shape/HandlePolygon", "../config", "zrender/tool/util", "zrender/tool/event", "zrender/tool/area", "zrender/tool/color", "../component"], function(e) {
    function t(e, t, n, a, o) {
        i.call(this, e, t, n, a, o);
        var s = this;
        s._ondrift = function(e, t) { return s.__ondrift(this, e, t) }, s._ondragend = function() { return s.__ondragend() }, s._dataRangeSelected = function(e) { return s.__dataRangeSelected(e) }, s._dispatchHoverLink = function(e) { return s.__dispatchHoverLink(e) }, s._onhoverlink = function(e) { return s.__onhoverlink(e) }, this._selectedMap = {}, this._range = {}, this.refresh(a), t.bind(r.EVENT.HOVER, this._onhoverlink)
    }
    var i = e("./base"),
        n = e("zrender/shape/Text"),
        a = e("zrender/shape/Rectangle"),
        o = e("../util/shape/HandlePolygon"),
        r = e("../config");
    r.dataRange = { zlevel: 0, z: 4, show: !0, orient: "vertical", x: "left", y: "bottom", backgroundColor: "rgba(0,0,0,0)", borderColor: "#ccc", borderWidth: 0, padding: 5, itemGap: 10, itemWidth: 20, itemHeight: 14, precision: 0, splitNumber: 5, splitList: null, calculable: !1, selectedMode: !0, hoverLink: !0, realtime: !0, color: ["#006edd", "#e0ffff"], textStyle: { color: "#333" } };
    var s = e("zrender/tool/util"),
        l = e("zrender/tool/event"),
        h = e("zrender/tool/area"),
        m = e("zrender/tool/color");
    return t.prototype = {
        type: r.COMPONENT_TYPE_DATARANGE,
        _textGap: 10,
        _buildShape: function() {
            if (this._itemGroupLocation = this._getItemGroupLocation(), this._buildBackground(), this._isContinuity() ? this._buildGradient() : this._buildItem(), this.dataRangeOption.show)
                for (var e = 0, t = this.shapeList.length; t > e; e++) this.zr.addShape(this.shapeList[e]);
            this._syncShapeFromRange()
        },
        _buildItem: function() {
            var e, t, i, o, r = this._valueTextList,
                s = r.length,
                l = this.getFont(this.dataRangeOption.textStyle),
                m = this._itemGroupLocation.x,
                V = this._itemGroupLocation.y,
                U = this.dataRangeOption.itemWidth,
                d = this.dataRangeOption.itemHeight,
                p = this.dataRangeOption.itemGap,
                c = h.getTextHeight("鍥�", l);
            "vertical" == this.dataRangeOption.orient && "right" == this.dataRangeOption.x && (m = this._itemGroupLocation.x + this._itemGroupLocation.width - U);
            var u = !0;
            this.dataRangeOption.text && (u = !1, this.dataRangeOption.text[0] && (i = this._getTextShape(m, V, this.dataRangeOption.text[0]), "horizontal" == this.dataRangeOption.orient ? m += h.getTextWidth(this.dataRangeOption.text[0], l) + this._textGap : (V += c + this._textGap, i.style.y += c / 2 + this._textGap, i.style.textBaseline = "bottom"), this.shapeList.push(new n(i))));
            for (var y = 0; s > y; y++) e = r[y], o = this.getColorByIndex(y), t = this._getItemShape(m, V, U, d, this._selectedMap[y] ? o : "#ccc"), t._idx = y, t.onmousemove = this._dispatchHoverLink, this.dataRangeOption.selectedMode && (t.clickable = !0, t.onclick = this._dataRangeSelected), this.shapeList.push(new a(t)), u && (i = { zlevel: this.getZlevelBase(), z: this.getZBase(), style: { x: m + U + 5, y: V, color: this._selectedMap[y] ? this.dataRangeOption.textStyle.color : "#ccc", text: r[y], textFont: l, textBaseline: "top" }, highlightStyle: { brushType: "fill" } }, "vertical" == this.dataRangeOption.orient && "right" == this.dataRangeOption.x && (i.style.x -= U + 10, i.style.textAlign = "right"), i._idx = y, i.onmousemove = this._dispatchHoverLink, this.dataRangeOption.selectedMode && (i.clickable = !0, i.onclick = this._dataRangeSelected), this.shapeList.push(new n(i))), "horizontal" == this.dataRangeOption.orient ? m += U + (u ? 5 : 0) + (u ? h.getTextWidth(e, l) : 0) + p : V += d + p;
            !u && this.dataRangeOption.text[1] && ("horizontal" == this.dataRangeOption.orient ? m = m - p + this._textGap : V = V - p + this._textGap, i = this._getTextShape(m, V, this.dataRangeOption.text[1]), "horizontal" != this.dataRangeOption.orient && (i.style.y -= 5, i.style.textBaseline = "top"), this.shapeList.push(new n(i)))
        },
        _buildGradient: function() {
            var t, i, o = this.getFont(this.dataRangeOption.textStyle),
                r = this._itemGroupLocation.x,
                s = this._itemGroupLocation.y,
                l = this.dataRangeOption.itemWidth,
                m = this.dataRangeOption.itemHeight,
                V = h.getTextHeight("鍥�", o),
                U = 10,
                d = !0;
            this.dataRangeOption.text && (d = !1, this.dataRangeOption.text[0] && (i = this._getTextShape(r, s, this.dataRangeOption.text[0]), "horizontal" == this.dataRangeOption.orient ? r += h.getTextWidth(this.dataRangeOption.text[0], o) + this._textGap : (s += V + this._textGap, i.style.y += V / 2 + this._textGap, i.style.textBaseline = "bottom"), this.shapeList.push(new n(i))));
            for (var p = e("zrender/tool/color"), c = 1 / (this.dataRangeOption.color.length - 1), u = [], y = 0, g = this.dataRangeOption.color.length; g > y; y++) u.push([y * c, this.dataRangeOption.color[y]]);
            "horizontal" == this.dataRangeOption.orient ? (t = { zlevel: this.getZlevelBase(), z: this.getZBase(), style: { x: r, y: s, width: l * U, height: m, color: p.getLinearGradient(r, s, r + l * U, s, u) }, hoverable: !1 }, r += l * U + this._textGap) : (t = { zlevel: this.getZlevelBase(), z: this.getZBase(), style: { x: r, y: s, width: l, height: m * U, color: p.getLinearGradient(r, s, r, s + m * U, u) }, hoverable: !1 }, s += m * U + this._textGap), this.shapeList.push(new a(t)), this._calculableLocation = t.style, this.dataRangeOption.calculable && (this._buildFiller(), this._bulidMask(), this._bulidHandle()), this._buildIndicator(), !d && this.dataRangeOption.text[1] && (i = this._getTextShape(r, s, this.dataRangeOption.text[1]), this.shapeList.push(new n(i)))
        },
        _buildIndicator: function() {
            var e, t, i = this._calculableLocation.x,
                n = this._calculableLocation.y,
                a = this._calculableLocation.width,
                r = this._calculableLocation.height,
                s = 5;
            "horizontal" == this.dataRangeOption.orient ? "bottom" != this.dataRangeOption.y ? (e = [
                [i, n + r],
                [i - s, n + r + s],
                [i + s, n + r + s]
            ], t = "bottom") : (e = [
                [i, n],
                [i - s, n - s],
                [i + s, n - s]
            ], t = "top") : "right" != this.dataRangeOption.x ? (e = [
                [i + a, n],
                [i + a + s, n - s],
                [i + a + s, n + s]
            ], t = "right") : (e = [
                [i, n],
                [i - s, n - s],
                [i - s, n + s]
            ], t = "left"), this._indicatorShape = { style: { pointList: e, color: "#fff", __rect: { x: Math.min(e[0][0], e[1][0]), y: Math.min(e[0][1], e[1][1]), width: s * ("horizontal" == this.dataRangeOption.orient ? 2 : 1), height: s * ("horizontal" == this.dataRangeOption.orient ? 1 : 2) } }, highlightStyle: { brushType: "fill", textPosition: t, textColor: this.dataRangeOption.textStyle.color }, hoverable: !1 }, this._indicatorShape = new o(this._indicatorShape)
        },
        _buildFiller: function() {
            this._fillerShape = {
                zlevel: this.getZlevelBase(),
                z: this.getZBase() + 1,
                style: {
                    x: this._calculableLocation.x,
                    y: this._calculableLocation.y,
                    width: this._calculableLocation.width,
                    height: this._calculableLocation.height,
                    color: "rgba(255,255,255,0)"
                },
                highlightStyle: { strokeColor: "rgba(255,255,255,0.5)", lineWidth: 1 },
                draggable: !0,
                ondrift: this._ondrift,
                ondragend: this._ondragend,
                onmousemove: this._dispatchHoverLink,
                _type: "filler"
            }, this._fillerShape = new a(this._fillerShape), this.shapeList.push(this._fillerShape)
        },
        _bulidHandle: function() {
            var e, t, i, n, a, r, s, l, m = this._calculableLocation.x,
                V = this._calculableLocation.y,
                U = this._calculableLocation.width,
                d = this._calculableLocation.height,
                p = this.getFont(this.dataRangeOption.textStyle),
                c = h.getTextHeight("鍥�", p),
                u = Math.max(h.getTextWidth(this._textFormat(this.dataRangeOption.max), p), h.getTextWidth(this._textFormat(this.dataRangeOption.min), p)) + 2;
            "horizontal" == this.dataRangeOption.orient ? "bottom" != this.dataRangeOption.y ? (e = [
                [m, V],
                [m, V + d + c],
                [m - c, V + d + c],
                [m - 1, V + d],
                [m - 1, V]
            ], t = m - u / 2 - c, i = V + d + c / 2 + 2, n = { x: m - u - c, y: V + d, width: u + c, height: c }, a = [
                [m + U, V],
                [m + U, V + d + c],
                [m + U + c, V + d + c],
                [m + U + 1, V + d],
                [m + U + 1, V]
            ], r = m + U + u / 2 + c, s = i, l = { x: m + U, y: V + d, width: u + c, height: c }) : (e = [
                [m, V + d],
                [m, V - c],
                [m - c, V - c],
                [m - 1, V],
                [m - 1, V + d]
            ], t = m - u / 2 - c, i = V - c / 2 - 2, n = { x: m - u - c, y: V - c, width: u + c, height: c }, a = [
                [m + U, V + d],
                [m + U, V - c],
                [m + U + c, V - c],
                [m + U + 1, V],
                [m + U + 1, V + d]
            ], r = m + U + u / 2 + c, s = i, l = { x: m + U, y: V - c, width: u + c, height: c }) : (u += c, "right" != this.dataRangeOption.x ? (e = [
                [m, V],
                [m + U + c, V],
                [m + U + c, V - c],
                [m + U, V - 1],
                [m, V - 1]
            ], t = m + U + u / 2 + c / 2, i = V - c / 2, n = { x: m + U, y: V - c, width: u + c, height: c }, a = [
                [m, V + d],
                [m + U + c, V + d],
                [m + U + c, V + c + d],
                [m + U, V + 1 + d],
                [m, V + d + 1]
            ], r = t, s = V + d + c / 2, l = { x: m + U, y: V + d, width: u + c, height: c }) : (e = [
                [m + U, V],
                [m - c, V],
                [m - c, V - c],
                [m, V - 1],
                [m + U, V - 1]
            ], t = m - u / 2 - c / 2, i = V - c / 2, n = { x: m - u - c, y: V - c, width: u + c, height: c }, a = [
                [m + U, V + d],
                [m - c, V + d],
                [m - c, V + c + d],
                [m, V + 1 + d],
                [m + U, V + d + 1]
            ], r = t, s = V + d + c / 2, l = { x: m - u - c, y: V + d, width: u + c, height: c })), this._startShape = { style: { pointList: e, text: this._textFormat(this.dataRangeOption.max), textX: t, textY: i, textFont: p, color: this.getColor(this.dataRangeOption.max), rect: n, x: e[0][0], y: e[0][1], _x: e[0][0], _y: e[0][1] } }, this._startShape.highlightStyle = { strokeColor: this._startShape.style.color, lineWidth: 1 }, this._endShape = { style: { pointList: a, text: this._textFormat(this.dataRangeOption.min), textX: r, textY: s, textFont: p, color: this.getColor(this.dataRangeOption.min), rect: l, x: a[0][0], y: a[0][1], _x: a[0][0], _y: a[0][1] } }, this._endShape.highlightStyle = { strokeColor: this._endShape.style.color, lineWidth: 1 }, this._startShape.zlevel = this._endShape.zlevel = this.getZlevelBase(), this._startShape.z = this._endShape.z = this.getZBase() + 1, this._startShape.draggable = this._endShape.draggable = !0, this._startShape.ondrift = this._endShape.ondrift = this._ondrift, this._startShape.ondragend = this._endShape.ondragend = this._ondragend, this._startShape.style.textColor = this._endShape.style.textColor = this.dataRangeOption.textStyle.color, this._startShape.style.textAlign = this._endShape.style.textAlign = "center", this._startShape.style.textPosition = this._endShape.style.textPosition = "specific", this._startShape.style.textBaseline = this._endShape.style.textBaseline = "middle", this._startShape.style.width = this._endShape.style.width = 0, this._startShape.style.height = this._endShape.style.height = 0, this._startShape.style.textPosition = this._endShape.style.textPosition = "specific", this._startShape = new o(this._startShape), this._endShape = new o(this._endShape), this.shapeList.push(this._startShape), this.shapeList.push(this._endShape)
        },
        _bulidMask: function() {
            var e = this._calculableLocation.x,
                t = this._calculableLocation.y,
                i = this._calculableLocation.width,
                n = this._calculableLocation.height;
            this._startMask = { zlevel: this.getZlevelBase(), z: this.getZBase() + 1, style: { x: e, y: t, width: "horizontal" == this.dataRangeOption.orient ? 0 : i, height: "horizontal" == this.dataRangeOption.orient ? n : 0, color: "#ccc" }, hoverable: !1 }, this._endMask = { zlevel: this.getZlevelBase(), z: this.getZBase() + 1, style: { x: "horizontal" == this.dataRangeOption.orient ? e + i : e, y: "horizontal" == this.dataRangeOption.orient ? t : t + n, width: "horizontal" == this.dataRangeOption.orient ? 0 : i, height: "horizontal" == this.dataRangeOption.orient ? n : 0, color: "#ccc" }, hoverable: !1 }, this._startMask = new a(this._startMask), this._endMask = new a(this._endMask), this.shapeList.push(this._startMask), this.shapeList.push(this._endMask)
        },
        _buildBackground: function() {
            var e = this.reformCssArray(this.dataRangeOption.padding);
            this.shapeList.push(new a({ zlevel: this.getZlevelBase(), z: this.getZBase(), hoverable: !1, style: { x: this._itemGroupLocation.x - e[3], y: this._itemGroupLocation.y - e[0], width: this._itemGroupLocation.width + e[3] + e[1], height: this._itemGroupLocation.height + e[0] + e[2], brushType: 0 === this.dataRangeOption.borderWidth ? "fill" : "both", color: this.dataRangeOption.backgroundColor, strokeColor: this.dataRangeOption.borderColor, lineWidth: this.dataRangeOption.borderWidth } }))
        },
        _getItemGroupLocation: function() {
            var e = this._valueTextList,
                t = e.length,
                i = this.dataRangeOption.itemGap,
                n = this.dataRangeOption.itemWidth,
                a = this.dataRangeOption.itemHeight,
                o = 0,
                r = 0,
                s = this.getFont(this.dataRangeOption.textStyle),
                l = h.getTextHeight("鍥�", s),
                m = 10;
            if ("horizontal" == this.dataRangeOption.orient) {
                if (this.dataRangeOption.text || this._isContinuity()) o = (this._isContinuity() ? n * m + i : t * (n + i)) + (this.dataRangeOption.text && "undefined" != typeof this.dataRangeOption.text[0] ? h.getTextWidth(this.dataRangeOption.text[0], s) + this._textGap : 0) + (this.dataRangeOption.text && "undefined" != typeof this.dataRangeOption.text[1] ? h.getTextWidth(this.dataRangeOption.text[1], s) + this._textGap : 0);
                else { n += 5; for (var V = 0; t > V; V++) o += n + h.getTextWidth(e[V], s) + i }
                o -= i, r = Math.max(l, a)
            } else {
                var U;
                if (this.dataRangeOption.text || this._isContinuity()) r = (this._isContinuity() ? a * m + i : t * (a + i)) + (this.dataRangeOption.text && "undefined" != typeof this.dataRangeOption.text[0] ? this._textGap + l : 0) + (this.dataRangeOption.text && "undefined" != typeof this.dataRangeOption.text[1] ? this._textGap + l : 0), U = Math.max(h.getTextWidth(this.dataRangeOption.text && this.dataRangeOption.text[0] || "", s), h.getTextWidth(this.dataRangeOption.text && this.dataRangeOption.text[1] || "", s)), o = Math.max(n, U);
                else {
                    r = (a + i) * t, n += 5, U = 0;
                    for (var V = 0; t > V; V++) U = Math.max(U, h.getTextWidth(e[V], s));
                    o = n + U
                }
                r -= i
            }
            var d, p = this.reformCssArray(this.dataRangeOption.padding),
                c = this.zr.getWidth();
            switch (this.dataRangeOption.x) {
                case "center":
                    d = Math.floor((c - o) / 2);
                    break;
                case "left":
                    d = p[3] + this.dataRangeOption.borderWidth;
                    break;
                case "right":
                    d = c - o - p[1] - this.dataRangeOption.borderWidth;
                    break;
                default:
                    d = this.parsePercent(this.dataRangeOption.x, c), d = isNaN(d) ? 0 : d
            }
            var u, y = this.zr.getHeight();
            switch (this.dataRangeOption.y) {
                case "top":
                    u = p[0] + this.dataRangeOption.borderWidth;
                    break;
                case "bottom":
                    u = y - r - p[2] - this.dataRangeOption.borderWidth;
                    break;
                case "center":
                    u = Math.floor((y - r) / 2);
                    break;
                default:
                    u = this.parsePercent(this.dataRangeOption.y, y), u = isNaN(u) ? 0 : u
            }
            if (this.dataRangeOption.calculable) { var g = Math.max(h.getTextWidth(this.dataRangeOption.max, s), h.getTextWidth(this.dataRangeOption.min, s)) + l; "horizontal" == this.dataRangeOption.orient ? (g > d && (d = g), d + o + g > c && (d -= g)) : (l > u && (u = l), u + r + l > y && (u -= l)) }
            return { x: d, y: u, width: o, height: r }
        },
        _getTextShape: function(e, t, i) { return { zlevel: this.getZlevelBase(), z: this.getZBase(), style: { x: "horizontal" == this.dataRangeOption.orient ? e : this._itemGroupLocation.x + this._itemGroupLocation.width / 2, y: "horizontal" == this.dataRangeOption.orient ? this._itemGroupLocation.y + this._itemGroupLocation.height / 2 : t, color: this.dataRangeOption.textStyle.color, text: i, textFont: this.getFont(this.dataRangeOption.textStyle), textBaseline: "horizontal" == this.dataRangeOption.orient ? "middle" : "top", textAlign: "horizontal" == this.dataRangeOption.orient ? "left" : "center" }, hoverable: !1 } },
        _getItemShape: function(e, t, i, n, a) { return { zlevel: this.getZlevelBase(), z: this.getZBase(), style: { x: e, y: t + 1, width: i, height: n - 2, color: a }, highlightStyle: { strokeColor: a, lineWidth: 1 } } },
        __ondrift: function(e, t, i) {
            var n = this._calculableLocation.x,
                a = this._calculableLocation.y,
                o = this._calculableLocation.width,
                r = this._calculableLocation.height;
            return "horizontal" == this.dataRangeOption.orient ? e.style.x + t <= n ? e.style.x = n : e.style.x + t + e.style.width >= n + o ? e.style.x = n + o - e.style.width : e.style.x += t : e.style.y + i <= a ? e.style.y = a : e.style.y + i + e.style.height >= a + r ? e.style.y = a + r - e.style.height : e.style.y += i, "filler" == e._type ? this._syncHandleShape() : this._syncFillerShape(e), this.dataRangeOption.realtime && this._dispatchDataRange(), !0
        },
        __ondragend: function() { this.isDragend = !0 },
        ondragend: function(e, t) { this.isDragend && e.target && (t.dragOut = !0, t.dragIn = !0, this.dataRangeOption.realtime || this._dispatchDataRange(), t.needRefresh = !1, this.isDragend = !1) },
        _syncShapeFromRange: function() {
            var e = this.dataRangeOption.range || {},
                t = e.start,
                i = e.end;
            if (t > i && (t = [i, i = t][0]), this._range.end = null != t ? t : null != this._range.end ? this._range.end : 0, this._range.start = null != i ? i : null != this._range.start ? this._range.start : 100, 100 != this._range.start || 0 !== this._range.end) {
                if ("horizontal" == this.dataRangeOption.orient) {
                    var n = this._fillerShape.style.width;
                    this._fillerShape.style.x += n * (100 - this._range.start) / 100, this._fillerShape.style.width = n * (this._range.start - this._range.end) / 100
                } else {
                    var a = this._fillerShape.style.height;
                    this._fillerShape.style.y += a * (100 - this._range.start) / 100, this._fillerShape.style.height = a * (this._range.start - this._range.end) / 100
                }
                this.zr.modShape(this._fillerShape.id), this._syncHandleShape()
            }
        },
        _syncHandleShape: function() {
            var e = this._calculableLocation.x,
                t = this._calculableLocation.y,
                i = this._calculableLocation.width,
                n = this._calculableLocation.height;
            "horizontal" == this.dataRangeOption.orient ? (this._startShape.style.x = this._fillerShape.style.x, this._startMask.style.width = this._startShape.style.x - e, this._endShape.style.x = this._fillerShape.style.x + this._fillerShape.style.width, this._endMask.style.x = this._endShape.style.x, this._endMask.style.width = e + i - this._endShape.style.x, this._range.start = Math.ceil(100 - (this._startShape.style.x - e) / i * 100), this._range.end = Math.floor(100 - (this._endShape.style.x - e) / i * 100)) : (this._startShape.style.y = this._fillerShape.style.y, this._startMask.style.height = this._startShape.style.y - t, this._endShape.style.y = this._fillerShape.style.y + this._fillerShape.style.height, this._endMask.style.y = this._endShape.style.y, this._endMask.style.height = t + n - this._endShape.style.y, this._range.start = Math.ceil(100 - (this._startShape.style.y - t) / n * 100), this._range.end = Math.floor(100 - (this._endShape.style.y - t) / n * 100)), this._syncShape()
        },
        _syncFillerShape: function(e) {
            var t, i, n = this._calculableLocation.x,
                a = this._calculableLocation.y,
                o = this._calculableLocation.width,
                r = this._calculableLocation.height;
            "horizontal" == this.dataRangeOption.orient ? (t = this._startShape.style.x, i = this._endShape.style.x, e.id == this._startShape.id && t >= i ? (i = t, this._endShape.style.x = t) : e.id == this._endShape.id && t >= i && (t = i, this._startShape.style.x = t), this._fillerShape.style.x = t, this._fillerShape.style.width = i - t, this._startMask.style.width = t - n, this._endMask.style.x = i, this._endMask.style.width = n + o - i, this._range.start = Math.ceil(100 - (t - n) / o * 100), this._range.end = Math.floor(100 - (i - n) / o * 100)) : (t = this._startShape.style.y, i = this._endShape.style.y, e.id == this._startShape.id && t >= i ? (i = t, this._endShape.style.y = t) : e.id == this._endShape.id && t >= i && (t = i, this._startShape.style.y = t), this._fillerShape.style.y = t, this._fillerShape.style.height = i - t, this._startMask.style.height = t - a, this._endMask.style.y = i, this._endMask.style.height = a + r - i, this._range.start = Math.ceil(100 - (t - a) / r * 100), this._range.end = Math.floor(100 - (i - a) / r * 100)), this._syncShape()
        },
        _syncShape: function() { this._startShape.position = [this._startShape.style.x - this._startShape.style._x, this._startShape.style.y - this._startShape.style._y], this._startShape.style.text = this._textFormat(this._gap * this._range.start + this.dataRangeOption.min), this._startShape.style.color = this._startShape.highlightStyle.strokeColor = this.getColor(this._gap * this._range.start + this.dataRangeOption.min), this._endShape.position = [this._endShape.style.x - this._endShape.style._x, this._endShape.style.y - this._endShape.style._y], this._endShape.style.text = this._textFormat(this._gap * this._range.end + this.dataRangeOption.min), this._endShape.style.color = this._endShape.highlightStyle.strokeColor = this.getColor(this._gap * this._range.end + this.dataRangeOption.min), this.zr.modShape(this._startShape.id), this.zr.modShape(this._endShape.id), this.zr.modShape(this._startMask.id), this.zr.modShape(this._endMask.id), this.zr.modShape(this._fillerShape.id), this.zr.refreshNextFrame() },
        _dispatchDataRange: function() { this.messageCenter.dispatch(r.EVENT.DATA_RANGE, null, { range: { start: this._range.end, end: this._range.start } }, this.myChart) },
        __dataRangeSelected: function(e) {
            if ("single" === this.dataRangeOption.selectedMode)
                for (var t in this._selectedMap) this._selectedMap[t] = !1;
            var i = e.target._idx;
            this._selectedMap[i] = !this._selectedMap[i];
            var n, a;
            this._useCustomizedSplit() ? (n = this._splitList[i].max, a = this._splitList[i].min) : (n = (this._colorList.length - i) * this._gap + this.dataRangeOption.min, a = n - this._gap), this.messageCenter.dispatch(r.EVENT.DATA_RANGE_SELECTED, e.event, { selected: this._selectedMap, target: i, valueMax: n, valueMin: a }, this.myChart), this.messageCenter.dispatch(r.EVENT.REFRESH, null, null, this.myChart)
        },
        __dispatchHoverLink: function(e) {
            var t, i;
            if (this.dataRangeOption.calculable) {
                var n, a = this.dataRangeOption.max - this.dataRangeOption.min;
                n = "horizontal" == this.dataRangeOption.orient ? (1 - (l.getX(e.event) - this._calculableLocation.x) / this._calculableLocation.width) * a : (1 - (l.getY(e.event) - this._calculableLocation.y) / this._calculableLocation.height) * a, t = n - .05 * a, i = n + .05 * a
            } else if (this._useCustomizedSplit()) {
                var o = e.target._idx;
                i = this._splitList[o].max, t = this._splitList[o].min
            } else {
                var o = e.target._idx;
                i = (this._colorList.length - o) * this._gap + this.dataRangeOption.min, t = i - this._gap
            }
            this.messageCenter.dispatch(r.EVENT.DATA_RANGE_HOVERLINK, e.event, { valueMin: t, valueMax: i }, this.myChart)
        },
        __onhoverlink: function(e) {
            if (this.dataRangeOption.show && this.dataRangeOption.hoverLink && this._indicatorShape && e && null != e.seriesIndex && null != e.dataIndex) {
                var t = e.value;
                if ("" === t || isNaN(t)) return;
                t < this.dataRangeOption.min ? t = this.dataRangeOption.min : t > this.dataRangeOption.max && (t = this.dataRangeOption.max), this._indicatorShape.position = "horizontal" == this.dataRangeOption.orient ? [(this.dataRangeOption.max - t) / (this.dataRangeOption.max - this.dataRangeOption.min) * this._calculableLocation.width, 0] : [0, (this.dataRangeOption.max - t) / (this.dataRangeOption.max - this.dataRangeOption.min) * this._calculableLocation.height], this._indicatorShape.style.text = this._textFormat(e.value), this._indicatorShape.style.color = this.getColor(t), this.zr.addHoverShape(this._indicatorShape)
            }
        },
        _textFormat: function(e, t) { var i = this.dataRangeOption; if (e !== -Number.MAX_VALUE && (e = (+e).toFixed(i.precision)), null != t && t !== Number.MAX_VALUE && (t = (+t).toFixed(i.precision)), i.formatter) { if ("string" == typeof i.formatter) return i.formatter.replace("{value}", e === -Number.MAX_VALUE ? "min" : e).replace("{value2}", t === Number.MAX_VALUE ? "max" : t); if ("function" == typeof i.formatter) return i.formatter.call(this.myChart, e, t) } return null == t ? e : e === -Number.MAX_VALUE ? "< " + t : t === Number.MAX_VALUE ? "> " + e : e + " - " + t },
        _isContinuity: function() { var e = this.dataRangeOption; return !(e.splitList ? e.splitList.length > 0 : e.splitNumber > 0) || e.calculable },
        _useCustomizedSplit: function() { var e = this.dataRangeOption; return e.splitList && e.splitList.length > 0 },
        _buildColorList: function(e) {
            if (this._colorList = m.getGradientColors(this.dataRangeOption.color, Math.max((e - this.dataRangeOption.color.length) / (this.dataRangeOption.color.length - 1), 0) + 1), this._colorList.length > e) {
                for (var t = this._colorList.length, i = [this._colorList[0]], n = t / (e - 1), a = 1; e - 1 > a; a++) i.push(this._colorList[Math.floor(a * n)]);
                i.push(this._colorList[t - 1]), this._colorList = i
            }
            if (this._useCustomizedSplit())
                for (var o = this._splitList, a = 0, t = o.length; t > a; a++) o[a].color && (this._colorList[a] = o[a].color)
        },
        _buildGap: function(e) {
            if (!this._useCustomizedSplit()) {
                var t = this.dataRangeOption.precision;
                for (this._gap = (this.dataRangeOption.max - this.dataRangeOption.min) / e; this._gap.toFixed(t) - 0 != this._gap && 5 > t;) t++;
                this.dataRangeOption.precision = t, this._gap = ((this.dataRangeOption.max - this.dataRangeOption.min) / e).toFixed(t) - 0
            }
        },
        _buildDataList: function(e) {
            for (var t = this._valueTextList = [], i = this.dataRangeOption, n = this._useCustomizedSplit(), a = 0; e > a; a++) {
                this._selectedMap[a] = !0;
                var o = "";
                if (n) {
                    var r = this._splitList[e - 1 - a];
                    o = null != r.label ? r.label : null != r.single ? this._textFormat(r.single) : this._textFormat(r.min, r.max)
                } else o = this._textFormat(a * this._gap + i.min, (a + 1) * this._gap + i.min);
                t.unshift(o)
            }
        },
        _buildSplitList: function() {
            if (this._useCustomizedSplit())
                for (var e = this.dataRangeOption.splitList, t = this._splitList = [], i = 0, n = e.length; n > i; i++) {
                    var a = e[i];
                    if (!a || null == a.start && null == a.end) throw new Error("Empty item exists in splitList!");
                    var o = { label: a.label, color: a.color };
                    o.min = a.start, o.max = a.end, o.min > o.max && (o.min = [o.max, o.max = o.min][0]), o.min === o.max && (o.single = o.max), null == o.min && (o.min = -Number.MAX_VALUE), null == o.max && (o.max = Number.MAX_VALUE), t.push(o)
                }
        },
        refresh: function(e) {
            if (e) {
                this.option = e, this.option.dataRange = this.reformOption(this.option.dataRange);
                var t = this.dataRangeOption = this.option.dataRange;
                if (!this._useCustomizedSplit() && (null == t.min || null == t.max)) throw new Error("option.dataRange.min or option.dataRange.max has not been defined.");
                this.myChart.canvasSupported || (t.realtime = !1);
                var i = this._isContinuity() ? 100 : this._useCustomizedSplit() ? t.splitList.length : t.splitNumber;
                this._buildSplitList(), this._buildColorList(i), this._buildGap(i), this._buildDataList(i)
            }
            this.clear(), this._buildShape()
        },
        getColor: function(e) {
            if (isNaN(e)) return null;
            var t;
            if (this._useCustomizedSplit()) {
                for (var i = this._splitList, n = 0, a = i.length; a > n; n++)
                    if (i[n].min <= e && i[n].max >= e) { t = n; break }
            } else {
                if (this.dataRangeOption.min == this.dataRangeOption.max) return this._colorList[0];
                if (e < this.dataRangeOption.min ? e = this.dataRangeOption.min : e > this.dataRangeOption.max && (e = this.dataRangeOption.max), this.dataRangeOption.calculable && (e - (this._gap * this._range.start + this.dataRangeOption.min) > 5e-5 || e - (this._gap * this._range.end + this.dataRangeOption.min) < -5e-5)) return null;
                t = this._colorList.length - Math.ceil((e - this.dataRangeOption.min) / (this.dataRangeOption.max - this.dataRangeOption.min) * this._colorList.length), t == this._colorList.length && t--
            }
            return this._selectedMap[t] ? this._colorList[t] : null
        },
        getColorByIndex: function(e) { return e >= this._colorList.length ? e = this._colorList.length - 1 : 0 > e && (e = 0), this._colorList[e] },
        onbeforDispose: function() { this.messageCenter.unbind(r.EVENT.HOVER, this._onhoverlink) }
    }, s.inherits(t, i), e("../component").define("dataRange", t), t
}), define("echarts/component/roamController", ["require", "./base", "zrender/shape/Rectangle", "zrender/shape/Sector", "zrender/shape/Circle", "../config", "zrender/tool/util", "zrender/tool/color", "zrender/tool/event", "../component"], function(e) {
    function t(e, t, n, a, o) {
        if (this.rcOption = {}, a.roamController && a.roamController.show) {
            if (!a.roamController.mapTypeControl) return void console.error("option.roamController.mapTypeControl has not been defined.");
            i.call(this, e, t, n, a, o), this.rcOption = a.roamController;
            var r = this;
            this._drictionMouseDown = function(e) { return r.__drictionMouseDown(e) }, this._drictionMouseUp = function(e) { return r.__drictionMouseUp(e) }, this._drictionMouseMove = function(e) { return r.__drictionMouseMove(e) }, this._drictionMouseOut = function(e) { return r.__drictionMouseOut(e) }, this._scaleHandler = function(e) { return r.__scaleHandler(e) }, this.refresh(a)
        }
    }
    var i = e("./base"),
        n = e("zrender/shape/Rectangle"),
        a = e("zrender/shape/Sector"),
        o = e("zrender/shape/Circle"),
        r = e("../config");
    r.roamController = { zlevel: 0, z: 4, show: !0, x: "left", y: "top", width: 80, height: 120, backgroundColor: "rgba(0,0,0,0)", borderColor: "#ccc", borderWidth: 0, padding: 5, handleColor: "#6495ed", fillerColor: "#fff", step: 15, mapTypeControl: null };
    var s = e("zrender/tool/util"),
        l = e("zrender/tool/color"),
        h = e("zrender/tool/event");
    return t.prototype = {
        type: r.COMPONENT_TYPE_ROAMCONTROLLER,
        _buildShape: function() { if (this.rcOption.show) { this._itemGroupLocation = this._getItemGroupLocation(), this._buildBackground(), this._buildItem(); for (var e = 0, t = this.shapeList.length; t > e; e++) this.zr.addShape(this.shapeList[e]) } },
        _buildItem: function() { this.shapeList.push(this._getDirectionShape("up")), this.shapeList.push(this._getDirectionShape("down")), this.shapeList.push(this._getDirectionShape("left")), this.shapeList.push(this._getDirectionShape("right")), this.shapeList.push(this._getScaleShape("scaleUp")), this.shapeList.push(this._getScaleShape("scaleDown")) },
        _getDirectionShape: function(e) {
            var t = this._itemGroupLocation.r,
                i = this._itemGroupLocation.x + t,
                n = this._itemGroupLocation.y + t,
                o = { zlevel: this.getZlevelBase(), z: this.getZBase(), style: { x: i, y: n, r: t, startAngle: -45, endAngle: 45, color: this.rcOption.handleColor, text: ">", textX: i + t / 2 + 4, textY: n - .5, textAlign: "center", textBaseline: "middle", textPosition: "specific", textColor: this.rcOption.fillerColor, textFont: Math.floor(t / 2) + "px arial" }, highlightStyle: { color: l.lift(this.rcOption.handleColor, -.2), brushType: "fill" }, clickable: !0 };
            switch (e) {
                case "up":
                    o.rotation = [Math.PI / 2, i, n];
                    break;
                case "left":
                    o.rotation = [Math.PI, i, n];
                    break;
                case "down":
                    o.rotation = [-Math.PI / 2, i, n]
            }
            return o = new a(o), o._roamType = e, o.onmousedown = this._drictionMouseDown, o.onmouseup = this._drictionMouseUp, o.onmousemove = this._drictionMouseMove, o.onmouseout = this._drictionMouseOut, o
        },
        _getScaleShape: function(e) {
            var t = this._itemGroupLocation.width,
                i = this._itemGroupLocation.height - t;
            i = 0 > i ? 20 : i;
            var n = Math.min(t / 2 - 5, i) / 2,
                a = this._itemGroupLocation.x + ("scaleDown" === e ? t - n : n),
                r = this._itemGroupLocation.y + this._itemGroupLocation.height - n,
                s = { zlevel: this.getZlevelBase(), z: this.getZBase(), style: { x: a, y: r, r: n, color: this.rcOption.handleColor, text: "scaleDown" === e ? "-" : "+", textX: a, textY: r - 2, textAlign: "center", textBaseline: "middle", textPosition: "specific", textColor: this.rcOption.fillerColor, textFont: Math.floor(n) + "px verdana" }, highlightStyle: { color: l.lift(this.rcOption.handleColor, -.2), brushType: "fill" }, clickable: !0 };
            return s = new o(s), s._roamType = e, s.onmousedown = this._scaleHandler, s
        },
        _buildBackground: function() {
            var e = this.reformCssArray(this.rcOption.padding);
            this.shapeList.push(new n({ zlevel: this.getZlevelBase(), z: this.getZBase(), hoverable: !1, style: { x: this._itemGroupLocation.x - e[3], y: this._itemGroupLocation.y - e[0], width: this._itemGroupLocation.width + e[3] + e[1], height: this._itemGroupLocation.height + e[0] + e[2], brushType: 0 === this.rcOption.borderWidth ? "fill" : "both", color: this.rcOption.backgroundColor, strokeColor: this.rcOption.borderColor, lineWidth: this.rcOption.borderWidth } }))
        },
        _getItemGroupLocation: function() {
            var e, t = this.reformCssArray(this.rcOption.padding),
                i = this.rcOption.width,
                n = this.rcOption.height,
                a = this.zr.getWidth(),
                o = this.zr.getHeight();
            switch (this.rcOption.x) {
                case "center":
                    e = Math.floor((a - i) / 2);
                    break;
                case "left":
                    e = t[3] + this.rcOption.borderWidth;
                    break;
                case "right":
                    e = a - i - t[1] - t[3] - 2 * this.rcOption.borderWidth;
                    break;
                default:
                    e = this.parsePercent(this.rcOption.x, a)
            }
            var r;
            switch (this.rcOption.y) {
                case "top":
                    r = t[0] + this.rcOption.borderWidth;
                    break;
                case "bottom":
                    r = o - n - t[0] - t[2] - 2 * this.rcOption.borderWidth;
                    break;
                case "center":
                    r = Math.floor((o - n) / 2);
                    break;
                default:
                    r = this.parsePercent(this.rcOption.y, o)
            }
            return { x: e, y: r, r: i / 2, width: i, height: n }
        },
        __drictionMouseDown: function(e) { this.mousedown = !0, this._drictionHandlerOn(e) },
        __drictionMouseUp: function(e) { this.mousedown = !1, this._drictionHandlerOff(e) },
        __drictionMouseMove: function(e) { this.mousedown && this._drictionHandlerOn(e) },
        __drictionMouseOut: function(e) { this._drictionHandlerOff(e) },
        _drictionHandlerOn: function(e) {
            this._dispatchEvent(e.event, e.target._roamType), clearInterval(this.dircetionTimer);
            var t = this;
            this.dircetionTimer = setInterval(function() { t._dispatchEvent(e.event, e.target._roamType) }, 100), h.stop(e.event)
        },
        _drictionHandlerOff: function() { clearInterval(this.dircetionTimer) },
        __scaleHandler: function(e) { this._dispatchEvent(e.event, e.target._roamType), h.stop(e.event) },
        _dispatchEvent: function(e, t) { this.messageCenter.dispatch(r.EVENT.ROAMCONTROLLER, e, { roamType: t, mapTypeControl: this.rcOption.mapTypeControl, step: this.rcOption.step }, this.myChart) },
        refresh: function(e) { e && (this.option = e || this.option, this.option.roamController = this.reformOption(this.option.roamController), this.rcOption = this.option.roamController), this.clear(), this._buildShape() }
    }, s.inherits(t, i), e("../component").define("roamController", t), t
}), define("echarts/util/mapData/params", ["require"], function(e) {
    function t(e) {
        if (!e.UTF8Encoding) return e;
        for (var t = e.features, n = 0; n < t.length; n++)
            for (var a = t[n], o = a.geometry.coordinates, r = a.geometry.encodeOffsets, s = 0; s < o.length; s++) {
                var l = o[s];
                if ("Polygon" === a.geometry.type) o[s] = i(l, r[s]);
                else if ("MultiPolygon" === a.geometry.type)
                    for (var h = 0; h < l.length; h++) {
                        var m = l[h];
                        l[h] = i(m, r[s][h])
                    }
            }
        return e.UTF8Encoding = !1, e
    }

    function i(e, t) {
        for (var i = [], n = t[0], a = t[1], o = 0; o < e.length; o += 2) {
            var r = e.charCodeAt(o) - 64,
                s = e.charCodeAt(o + 1) - 64;
            r = r >> 1 ^ -(1 & r), s = s >> 1 ^ -(1 & s), r += n, s += a, n = r, a = s, i.push([r / 1024, s / 1024])
        }
        return i
    }
    var n = {
        none: { getGeoJson: function(e) { e({ type: "FeatureCollection", features: [{ type: "Feature", geometry: { coordinates: [], encodeOffsets: [], type: "Polygon" }, properties: {} }] }) } },
        world: { getGeoJson: function(i) { e(["./geoJson/world_geo"], function(e) { i(t(e)) }) } },
        china: { getGeoJson: function(i) { e(["./geoJson/china_geo"], function(e) { i(t(e)) }) } },
        "鍗楁捣璇稿矝": {
            textCoord: [126, 25],
            getPath: function(e, t) {
                for (var i = [
                        [
                            [0, 3.5],
                            [7, 11.2],
                            [15, 11.9],
                            [30, 7],
                            [42, .7],
                            [52, .7],
                            [56, 7.7],
                            [59, .7],
                            [64, .7],
                            [64, 0],
                            [5, 0],
                            [0, 3.5]
                        ],
                        [
                            [13, 16.1],
                            [19, 14.7],
                            [16, 21.7],
                            [11, 23.1],
                            [13, 16.1]
                        ],
                        [
                            [12, 32.2],
                            [14, 38.5],
                            [15, 38.5],
                            [13, 32.2],
                            [12, 32.2]
                        ],
                        [
                            [16, 47.6],
                            [12, 53.2],
                            [13, 53.2],
                            [18, 47.6],
                            [16, 47.6]
                        ],
                        [
                            [6, 64.4],
                            [8, 70],
                            [9, 70],
                            [8, 64.4],
                            [6, 64.4]
                        ],
                        [
                            [23, 82.6],
                            [29, 79.8],
                            [30, 79.8],
                            [25, 82.6],
                            [23, 82.6]
                        ],
                        [
                            [37, 70.7],
                            [43, 62.3],
                            [44, 62.3],
                            [39, 70.7],
                            [37, 70.7]
                        ],
                        [
                            [48, 51.1],
                            [51, 45.5],
                            [53, 45.5],
                            [50, 51.1],
                            [48, 51.1]
                        ],
                        [
                            [51, 35],
                            [51, 28.7],
                            [53, 28.7],
                            [53, 35],
                            [51, 35]
                        ],
                        [
                            [52, 22.4],
                            [55, 17.5],
                            [56, 17.5],
                            [53, 22.4],
                            [52, 22.4]
                        ],
                        [
                            [58, 12.6],
                            [62, 7],
                            [63, 7],
                            [60, 12.6],
                            [58, 12.6]
                        ],
                        [
                            [0, 3.5],
                            [0, 93.1],
                            [64, 93.1],
                            [64, 0],
                            [63, 0],
                            [63, 92.4],
                            [1, 92.4],
                            [1, 3.5],
                            [0, 3.5]
                        ]
                    ], n = "", a = e[0], o = e[1], r = 0, s = i.length; s > r; r++) { n += "M " + ((i[r][0][0] * t + a).toFixed(2) - 0) + " " + ((i[r][0][1] * t + o).toFixed(2) - 0) + " "; for (var l = 1, h = i[r].length; h > l; l++) n += "L " + ((i[r][l][0] * t + a).toFixed(2) - 0) + " " + ((i[r][l][1] * t + o).toFixed(2) - 0) + " " }
                return n + " Z"
            }
        },
        "鏂扮枂": { getGeoJson: function(i) { e(["./geoJson/xin_jiang_geo"], function(e) { i(t(e)) }) } },
        "瑗胯棌": { getGeoJson: function(i) { e(["./geoJson/xi_zang_geo"], function(e) { i(t(e)) }) } },
        "鍐呰挋鍙�": { getGeoJson: function(i) { e(["./geoJson/nei_meng_gu_geo"], function(e) { i(t(e)) }) } },
        "闈掓捣": { getGeoJson: function(i) { e(["./geoJson/qing_hai_geo"], function(e) { i(t(e)) }) } },
        "鍥涘窛": { getGeoJson: function(i) { e(["./geoJson/si_chuan_geo"], function(e) { i(t(e)) }) } },
        "榛戦緳姹�": { getGeoJson: function(i) { e(["./geoJson/hei_long_jiang_geo"], function(e) { i(t(e)) }) } },
        "鐢樿們": { getGeoJson: function(i) { e(["./geoJson/gan_su_geo"], function(e) { i(t(e)) }) } },
        "浜戝崡": { getGeoJson: function(i) { e(["./geoJson/yun_nan_geo"], function(e) { i(t(e)) }) } },
        "骞胯タ": { getGeoJson: function(i) { e(["./geoJson/guang_xi_geo"], function(e) { i(t(e)) }) } },
        "婀栧崡": { getGeoJson: function(i) { e(["./geoJson/hu_nan_geo"], function(e) { i(t(e)) }) } },
        "闄曡タ": { getGeoJson: function(i) { e(["./geoJson/shan_xi_1_geo"], function(e) { i(t(e)) }) } },
        "骞夸笢": { getGeoJson: function(i) { e(["./geoJson/guang_dong_geo"], function(e) { i(t(e)) }) } },
        "鍚夋灄": { getGeoJson: function(i) { e(["./geoJson/ji_lin_geo"], function(e) { i(t(e)) }) } },
        "娌冲寳": { getGeoJson: function(i) { e(["./geoJson/he_bei_geo"], function(e) { i(t(e)) }) } },
        "婀栧寳": { getGeoJson: function(i) { e(["./geoJson/hu_bei_geo"], function(e) { i(t(e)) }) } },
        "璐靛窞": { getGeoJson: function(i) { e(["./geoJson/gui_zhou_geo"], function(e) { i(t(e)) }) } },
        "灞变笢": { getGeoJson: function(i) { e(["./geoJson/shan_dong_geo"], function(e) { i(t(e)) }) } },
        "姹熻タ": { getGeoJson: function(i) { e(["./geoJson/jiang_xi_geo"], function(e) { i(t(e)) }) } },
        "娌冲崡": { getGeoJson: function(i) { e(["./geoJson/he_nan_geo"], function(e) { i(t(e)) }) } },
        "杈藉畞": { getGeoJson: function(i) { e(["./geoJson/liao_ning_geo"], function(e) { i(t(e)) }) } },
        "灞辫タ": { getGeoJson: function(i) { e(["./geoJson/shan_xi_2_geo"], function(e) { i(t(e)) }) } },
        "瀹夊窘": { getGeoJson: function(i) { e(["./geoJson/an_hui_geo"], function(e) { i(t(e)) }) } },
        "绂忓缓": { getGeoJson: function(i) { e(["./geoJson/fu_jian_geo"], function(e) { i(t(e)) }) } },
        "娴欐睙": { getGeoJson: function(i) { e(["./geoJson/zhe_jiang_geo"], function(e) { i(t(e)) }) } },
        "姹熻嫃": { getGeoJson: function(i) { e(["./geoJson/jiang_su_geo"], function(e) { i(t(e)) }) } },
        "閲嶅簡": { getGeoJson: function(i) { e(["./geoJson/chong_qing_geo"], function(e) { i(t(e)) }) } },
        "瀹佸": { getGeoJson: function(i) { e(["./geoJson/ning_xia_geo"], function(e) { i(t(e)) }) } },
        "娴峰崡": { getGeoJson: function(i) { e(["./geoJson/hai_nan_geo"], function(e) { i(t(e)) }) } },
        "鍙版咕": { getGeoJson: function(i) { e(["./geoJson/tai_wan_geo"], function(e) { i(t(e)) }) } },
        "鍖椾含": { getGeoJson: function(i) { e(["./geoJson/bei_jing_geo"], function(e) { i(t(e)) }) } },
        "澶╂触": { getGeoJson: function(i) { e(["./geoJson/tian_jin_geo"], function(e) { i(t(e)) }) } },
        "涓婃捣": { getGeoJson: function(i) { e(["./geoJson/shang_hai_geo"], function(e) { i(t(e)) }) } },
        "棣欐腐": { getGeoJson: function(i) { e(["./geoJson/xiang_gang_geo"], function(e) { i(t(e)) }) } },
        "婢抽棬": { getGeoJson: function(i) { e(["./geoJson/ao_men_geo"], function(e) { i(t(e)) }) } }
    };
    return { decode: t, params: n }
}), define("echarts/util/mapData/textFixed", [], function() { return { "骞夸笢": [0, -10], "棣欐腐": [10, 10], "婢抽棬": [-10, 18], "榛戦緳姹�": [0, 20], "澶╂触": [5, 5], "娣卞湷甯�": [-35, 0], "绾㈡渤鍝堝凹鏃忓綕鏃忚嚜娌诲窞": [0, 20], "妤氶泟褰濇棌鑷不宸�": [-5, 15], "鐭虫渤瀛愬競": [-5, 5], "浜斿娓犲競": [0, -10], "鏄屽悏鍥炴棌鑷不宸�": [10, 10], "鏄屾睙榛庢棌鑷不鍘�": [0, 20], "闄垫按榛庢棌鑷不鍘�": [0, 20], "涓滄柟甯�": [0, 20], "娓崡甯�": [0, 20] } }), define("echarts/util/mapData/geoCoord", [], function() { return { Russia: [100, 60], "United States of America": [-99, 38] } }), define("echarts/util/projection/svg", ["require", "zrender/shape/Path"], function(e) {
    function t(e) { return parseFloat(e || 0) }

    function i(e) {
        for (var i = e.firstChild;
            "svg" != i.nodeName.toLowerCase() || 1 != i.nodeType;) i = i.nextSibling;
        var n = t(i.getAttribute("x")),
            a = t(i.getAttribute("y")),
            o = t(i.getAttribute("width")),
            r = t(i.getAttribute("height"));
        return { left: n, top: a, width: o, height: r }
    }

    function n(e, t) {
        function i(e) {
            var t = e.tagName;
            if (m[t]) {
                var o = m[t](e, n);
                o && (o.scale = n, o.properties = { name: e.getAttribute("name") || "" }, o.id = e.id, s(o, e), a.push(o))
            }
            for (var r = e.childNodes, l = 0, h = r.length; h > l; l++) i(r[l])
        }
        var n = [t.scale.x, t.scale.y],
            a = [];
        return i(e), a
    }

    function a(e, t) { var i = t instanceof Array ? [1 * t[0], 1 * t[1]] : [1 * t.x, 1 * t.y]; return [i[0] / e.scale.x, i[1] / e.scale.y] }

    function o(e, t) { var i = t instanceof Array ? [1 * t[0], 1 * t[1]] : [1 * t.x, 1 * t.y]; return [i[0] * e.scale.x, i[1] * e.scale.y] }

    function r(e) { return e.replace(/^\s\s*/, "").replace(/\s\s*$/, "") }

    function s(e, t) {
        var i = t.getAttribute("fill"),
            n = t.getAttribute("stroke"),
            a = t.getAttribute("stroke-width"),
            o = t.getAttribute("opacity");
        i && "none" != i ? (e.color = i, n ? (e.brushType = "both", e.strokeColor = n) : e.brushType = "fill") : n && "none" != n && (e.strokeColor = n, e.brushType = "stroke"), a && "none" != a && (e.lineWidth = parseFloat(a)), o && "none" != o && (e.opacity = parseFloat(o))
    }

    function l(e) {
        for (var t = r(e).replace(/,/g, " ").split(/\s+/), i = [], n = 0; n < t.length;) {
            var a = parseFloat(t[n++]),
                o = parseFloat(t[n++]);
            i.push([a, o])
        }
        return i
    }
    var h = e("zrender/shape/Path"),
        m = {
            path: function(e, t) {
                var i = e.getAttribute("d"),
                    n = h.prototype.getRect({ path: i });
                return { shapeType: "path", path: i, cp: [(n.x + n.width / 2) * t[0], (n.y + n.height / 2) * t[1]] }
            },
            rect: function(e, i) {
                var n = t(e.getAttribute("x")),
                    a = t(e.getAttribute("y")),
                    o = t(e.getAttribute("width")),
                    r = t(e.getAttribute("height"));
                return { shapeType: "rectangle", x: n, y: a, width: o, height: r, cp: [(n + o / 2) * i[0], (a + r / 2) * i[1]] }
            },
            line: function(e, i) {
                var n = t(e.getAttribute("x1")),
                    a = t(e.getAttribute("y1")),
                    o = t(e.getAttribute("x2")),
                    r = t(e.getAttribute("y2"));
                return { shapeType: "line", xStart: n, yStart: a, xEnd: o, yEnd: r, cp: [.5 * (n + o) * i[0], .5 * (a + r) * i[1]] }
            },
            circle: function(e, i) {
                var n = t(e.getAttribute("cx")),
                    a = t(e.getAttribute("cy")),
                    o = t(e.getAttribute("r"));
                return { shapeType: "circle", x: n, y: a, r: o, cp: [n * i[0], a * i[1]] }
            },
            ellipse: function(e, t) {
                var i = parseFloat(e.getAttribute("cx") || 0),
                    n = parseFloat(e.getAttribute("cy") || 0),
                    a = parseFloat(e.getAttribute("rx") || 0),
                    o = parseFloat(e.getAttribute("ry") || 0);
                return { shapeType: "ellipse", x: i, y: n, a: a, b: o, cp: [i * t[0], n * t[1]] }
            },
            polygon: function(e, t) {
                var i = e.getAttribute("points"),
                    n = [1 / 0, 1 / 0],
                    a = [-(1 / 0), -(1 / 0)];
                if (i) {
                    i = l(i);
                    for (var o = 0; o < i.length; o++) {
                        var r = i[o];
                        n[0] = Math.min(r[0], n[0]), n[1] = Math.min(r[1], n[1]), a[0] = Math.max(r[0], a[0]), a[1] = Math.max(r[1], a[1])
                    }
                    return { shapeType: "polygon", pointList: i, cp: [(n[0] + a[0]) / 2 * t[0], (n[1] + a[1]) / 2 * t[0]] }
                }
            },
            polyline: function(e, t) { var i = m.polygon(e, t); return i }
        };
    return { getBbox: i, geoJson2Path: n, pos2geo: a, geo2pos: o }
}), define("echarts/util/projection/normal", [], function() {
    function e(e, i) { return i = i || {}, e.srcSize || t(e, i), e.srcSize }

    function t(e, t) {
        t = t || {}, r.xmin = 360, r.xmax = -360, r.ymin = 180, r.ymax = -180;
        for (var i, n, a = e.features, o = 0, s = a.length; s > o; o++)
            if (n = a[o], !n.properties.name || !t[n.properties.name]) switch (n.type) {
                case "Feature":
                    r[n.geometry.type](n.geometry.coordinates);
                    break;
                case "GeometryCollection":
                    i = n.geometries;
                    for (var l = 0, h = i.length; h > l; l++) r[i[l].type](i[l].coordinates)
            }
        return e.srcSize = { left: 1 * r.xmin.toFixed(4), top: 1 * r.ymin.toFixed(4), width: 1 * (r.xmax - r.xmin).toFixed(4), height: 1 * (r.ymax - r.ymin).toFixed(4) }, e
    }

    function i(e, i, n) {
        function a(e, t) { c = e.type, u = e.coordinates, o._bbox = { xmin: 360, xmax: -360, ymin: 180, ymax: -180 }, y = o[c](u), m.push({ path: y, cp: o.makePoint(t.properties.cp ? t.properties.cp : [(o._bbox.xmin + o._bbox.xmax) / 2, (o._bbox.ymin + o._bbox.ymax) / 2]), properties: t.properties, id: t.id }) }
        n = n || {}, o.scale = null, o.offset = null, e.srcSize || t(e, n), i.offset = { x: e.srcSize.left, y: e.srcSize.top, left: i.OffsetLeft || 0, top: i.OffsetTop || 0 }, o.scale = i.scale, o.offset = i.offset;
        for (var r, s, l, h = e.features, m = [], V = 0, U = h.length; U > V; V++)
            if (l = h[V], !l.properties.name || !n[l.properties.name])
                if ("Feature" == l.type) a(l.geometry, l);
                else if ("GeometryCollection" == l.type) { r = l.geometries; for (var d = 0, p = r.length; p > d; d++) s = r[d], a(s, s) }
        var c, u, y;
        return m
    }

    function n(e, t) { var i, n; return t instanceof Array ? (i = 1 * t[0], n = 1 * t[1]) : (i = 1 * t.x, n = 1 * t.y), i = i / e.scale.x + e.offset.x - 168.5, i = i > 180 ? i - 360 : i, n = 90 - (n / e.scale.y + e.offset.y), [i, n] }

    function a(e, t) { return o.offset = e.offset, o.scale = e.scale, o.makePoint(t instanceof Array ? [1 * t[0], 1 * t[1]] : [1 * t.x, 1 * t.y]) }
    var o = {
            formatPoint: function(e) { return [(e[0] < -168.5 && e[1] > 63.8 ? e[0] + 360 : e[0]) + 168.5, 90 - e[1]] },
            makePoint: function(e) {
                var t = this,
                    i = t.formatPoint(e);
                t._bbox.xmin > e[0] && (t._bbox.xmin = e[0]), t._bbox.xmax < e[0] && (t._bbox.xmax = e[0]), t._bbox.ymin > e[1] && (t._bbox.ymin = e[1]), t._bbox.ymax < e[1] && (t._bbox.ymax = e[1]);
                var n = (i[0] - o.offset.x) * o.scale.x + o.offset.left,
                    a = (i[1] - o.offset.y) * o.scale.y + o.offset.top;
                return [n, a]
            },
            Point: function(e) { return e = this.makePoint(e), e.join(",") },
            LineString: function(e) { for (var t, i = "", n = 0, a = e.length; a > n; n++) t = o.makePoint(e[n]), i = 0 === n ? "M" + t.join(",") : i + "L" + t.join(","); return i },
            Polygon: function(e) { for (var t = "", i = 0, n = e.length; n > i; i++) t = t + o.LineString(e[i]) + "z"; return t },
            MultiPoint: function(e) { for (var t = [], i = 0, n = e.length; n > i; i++) t.push(o.Point(e[i])); return t },
            MultiLineString: function(e) { for (var t = "", i = 0, n = e.length; n > i; i++) t += o.LineString(e[i]); return t },
            MultiPolygon: function(e) { for (var t = "", i = 0, n = e.length; n > i; i++) t += o.Polygon(e[i]); return t }
        },
        r = {
            formatPoint: o.formatPoint,
            makePoint: function(e) {
                var t = this,
                    i = t.formatPoint(e),
                    n = i[0],
                    a = i[1];
                t.xmin > n && (t.xmin = n), t.xmax < n && (t.xmax = n), t.ymin > a && (t.ymin = a), t.ymax < a && (t.ymax = a)
            },
            Point: function(e) { this.makePoint(e) },
            LineString: function(e) { for (var t = 0, i = e.length; i > t; t++) this.makePoint(e[t]) },
            Polygon: function(e) { for (var t = 0, i = e.length; i > t; t++) this.LineString(e[t]) },
            MultiPoint: function(e) { for (var t = 0, i = e.length; i > t; t++) this.Point(e[t]) },
            MultiLineString: function(e) { for (var t = 0, i = e.length; i > t; t++) this.LineString(e[t]) },
            MultiPolygon: function(e) { for (var t = 0, i = e.length; i > t; t++) this.Polygon(e[t]) }
        };
    return { getBbox: e, geoJson2Path: i, pos2geo: n, geo2pos: a }
}), define("echarts/util/shape/HandlePolygon", ["require", "zrender/shape/Base", "zrender/shape/Polygon", "zrender/tool/util"], function(e) {
    function t(e) { i.call(this, e) }
    var i = e("zrender/shape/Base"),
        n = e("zrender/shape/Polygon"),
        a = e("zrender/tool/util");
    return t.prototype = {
        type: "handle-polygon",
        buildPath: function(e, t) { n.prototype.buildPath(e, t) },
        isCover: function(e, t) {
            var i = this.transformCoordToLocal(e, t);
            e = i[0], t = i[1];
            var n = this.style.rect;
            return e >= n.x && e <= n.x + n.width && t >= n.y && t <= n.y + n.height ? !0 : !1
        }
    }, a.inherits(t, i), t
}), define("echarts/util/mapData/geoJson/an_hui_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "3415",
            properties: { name: "鍏畨甯�", cp: [116.3123, 31.8329], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞聞nJ聜UXUV聝掳U聞脩nU@mlLVaVln@@bn@VU@xlb@l職LnKl聧職聝VI聞J職UVxnI@lVL@b聞聨掳VX@聵b聞x聞nVVUnVVnU聜聸@kX@VwV@聞al楼UUnUWa@聝@w母U聞LU楼lKUa@aUI@alLVaU聝炉an聝WkUKm@X聧V@VaX聧lW@aU_UWVU聝I炉@ma炉W炉聶聶I@UU@WWU@U@@UU@VkV@@WUUm@UaU@聞聧lK@IUK聞L@KWmXUWaXI@聝@a@a@U@U@KV楼lw聞k掳b虏JVIVKlV@UX聞la聞Ul`聹UVLVVVU職J聞U@Lnm@_VK@KUIW@聶J@Xk@WW@U聴聝m聧m聶XmWk@聧kK@aUU聝Vmmk聧UwUmWL聶聧聛@WmU@聶聧UJmUULkKWakLWVkI聝l聝wUL聛聝W@X掳l聬UJ@掳UL聝聧WV聴wmJ@bmb炉Vk聛m@@W聛kWm炉w聝L@lkX聝WmX聛ym炉UImJUbkV聶@Vn炉聞@V@lUb聝@mk聛@maUxmlUbULWn@J聴LmKUkWKkwUK聝bm聞X聞WxkVUKmLkVV聬@JUUWL@xkJUU聝V@X@VVlUbVX@xk陇職x聜录聹xWxn聞聜nn@脼录聞JVb掳aVn聞@職mlnXU聞JlbVlkz@聜l聬U聨l聬XJmxVxXnWxX脠WlU聨@職UxU@VX@xUL@職U脝mLnV@lWXk@@JlbXblnlJ"],
                encodeOffsets: [
                    [118710, 33351]
                ]
            }
        }, {
            type: "Feature",
            id: "3408",
            properties: { name: "瀹夊簡甯�", cp: [116.7517, 30.5255], childNum: 9 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@n掳聜znW聞XlW@k聞K掳xXn聜l@Xn@l聜掳Una@anI聵xXU聞聨VK@炉VIk聫W炉X@聜聞VK聞x聞klJXUlKXblLVKnVVI職聨V@Xn聜@職聨XKVnVxl聨nn聞UlmV@虏贸UkV聶lW聞b聞聛l聝職聝n@VVVIn@lw@WVIXblV聞@脠x聜aUaVIVVnKVL職K聞聝ln@b虏K@禄U拢聝脩姆聝摹脻脜b聶K聶a@Im@脹聧聞聫@kW脫kkmK脜n贸J聝U脜拢聸W@w聞臅@w膲牛炉炉聝UkK卤l炉U聝楼U脩k聧脻U姆禄脻楼炉聬聶J聝IU聨VbUl炉脠V录VJU录Vb@bkLUl@聞VJ@bUX脟職@lkVmXmKkLVx聛職聜聨聞V聝L@VkVV聬Vl聛zW聵kbmLUUUbVbUV聶職l脪nJlUnLllUL@bU聞Vx聞l聜LXV脝娄脠VU娄WJ"],
                encodeOffsets: [
                    [118834, 31759]
                ]
            }
        }, {
            type: "Feature",
            id: "3411",
            properties: { name: "婊佸窞甯�", cp: [118.1909, 32.536], childNum: 7 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@職聞@`nnl@聞x職K@X掳KXV聵IXVlbXVWnX聜lL@職脠禄聜LVan@VJ聞锚VVn@聜聬X@la脼bVa聝yn@聞_聜xnWVXnWl@VnUVkI@l聜nXKVLVV@V@聬kW@LlV么聞@J@bVnnKnkVa@禄l莽@聝nw職Kma聶UUUV脩職@n聶mWXalI@alVn@VwUaVU聞@聞nla么JnU聞VVXlJ職aXXVK@U職V@VWx@nXVW職XV職UlLUbV聜ULVVnUVbUbVb職@@a聞K脝nnKVK@U@UU@@a聞@V聝掳炉脠JVIl姆@a聛a聵聧UaVKU_@mkxUI@a聝UlyU@@聛聶wkKWmUbUnUVWbkJW_聛J@b聝n@Vm@@KULk@V@@bVb脜m@LW@UVVbkK@UkKWL@VULUKWIUJUbkK@_WVXU聸Jka@X聝V聛a@k職y@aVIUUW@@m聞UlL聹KW脩UKVan@UkVmmIXK聝aVaUwVU@UmykU炉@卤UUL@WUIV聫UU@KkIWa聝aU@kUUa脟聝U聛贸禄mK聝k炉@聛y@kWK@bkI炉`mn聶l炉XWlkVUzUJlbUbVJl@nnm聞@VULV`XnW脝聴bmUUn聶JmUkn聝J炉km@聝yk@kU聸x聛L@VUbmnn陇lX@`聶z@JmaULUVl@Xn@xllkXWa聴aW@UVmU聛b聝@mVX職WxXbWbU聨聝脪nVVnVVUL"],
                encodeOffsets: [
                    [120004, 33520]
                ]
            }
        }, {
            type: "Feature",
            id: "3418",
            properties: { name: "瀹ｅ煄甯�", cp: [118.8062, 30.6244], childNum: 7 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@Vb@聞XL聵JXxlIXxlVlV@I虏陇職nlUnV職U@VULWVUJ@Lnb@lV@UnV@@VVVlLnbnJ聜UVkUUVWn@@anUVnVJVIV聜聛@@nUJVbUb聜聞@VUbVK@bn@VbnIlxkllXVlXKWUXUlL掳陇UVVb@b職聞UlkXW聜聝xXz@聜聞Ila聞Ul聝nUlJVInV脝J聞U聞LVUnV聞K掳@VnlVnxV@XLlK@wVL@KnUlJXU聵bnKVLX聞l聫Uw@聛VWlLXKm@@a聞@VLnmlIVVnKn@職kVa職Vlwk@@a@k@聝VIUa聶聫@聧maUa@wna@kmW聝聶UUmVUIV脟聴聧@a聝Km聬聶a聝聶kU聶J@In聫mUUaVa聞k聜lX@Vk@m@聧VU@wnK@alKVUkUkK聝bmUkm聝@U拢WVk@@U脻b聛b聝a脟x@b聛@WVUa炉聝@wVwUUV@VwnK@KWa脜聛@K職IUyUI@WmX贸聶UbWa聛Km聧聶@km@IUy聝IUaWK聝x@zUKUL@llVUnkLVVkJWX@VUKUV聝IkVWakb@VWb@n@JkXUlmL@xkL@`Vx職LU脠UJ@Vm@@bmIUlUL@VUVVbknm@mKUw聶KV脠@J@L聛V卤kkJUI聝l"],
                encodeOffsets: [
                    [120803, 31247]
                ]
            }
        }, {
            type: "Feature",
            id: "3412",
            properties: { name: "闃滈槼甯�", cp: [115.7629, 32.9919], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@V聶n聝職@職a聞k掳a職卤@聧聜楼@UUI@aUmlwUU聛x聸b@楼XU@mmI@a@Kn@@_W@@W聞I@m職UVVXUl@XaV@聜K@I@a聞LX聫@aVI掳K@KVL聞UUw聜yXk職K@k職K脝bXnlK@k@a聞JlU@w@U@禄@aXKW聝n_聜JXkVKn聝@聧掳LlKX聝W@炉U聝聧@aUK@kmJUw聶V聝IUJ聶聞k聨mL聶K@kka@wUVm@@am@UkUbkK@nmV聝脪炉VU聞WV聛VmI聝聝ULk@聝聝ma@kkK聝聝@nUbUamU聶`UUVUkKVkk聝W@@bkm聝n聝mUXVKXV聝L@V聝bU聞m聜聶bVX聛J@nmK脜I@KWKUXVJUL@VUKUX@KUKWL@LUJmaXXm@kVVV@L@VUL@VlK@L@V@LUK@VUb@UUU@掳@nVxU`聜Lkn@`@XVJ@X聶Vm聞k@UKmV炉LVV聛n卤W聛聬m@Ub@JlLUl聞@VLk聞@lmVVn@bnV@V掳IV聶職aVJXI掳K掳V@XXVlVVU聞n職KVlU職聞bWXnV@bV`U聞聞@@聬m@@聜聝@nxmn@bXVlL@陇nb聞Ul娄職VVUnJVU聞Vl@@b脼L"],
                encodeOffsets: [
                    [118418, 34392]
                ]
            }
        }, {
            type: "Feature",
            id: "3413",
            properties: { name: "瀹垮窞甯�", cp: [117.5208, 33.6841], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@UWU@bkW@aWU@aUIkWV聶lLXb聞lVIUVV@聜mn@V_n@VaUK@I聜@Ua職anJVU聞@lV聞UVnnKVVlaUa聞I@wnK聜Lnll@nVlk@wVKXkl@@b聞bUJ@V聜U@U聞UUyVk@aVUXwlWXX聜WU鹿@aU聶@WUI@mlU職n聞J@Il@職aXbV@VKl@XxVL@W聞I職Jlb聞@聞al@聞IUUm@@aVK@楼炉聴@mU姆炉bW聝k拢Vm@a聛km@Va脜@UVWa聝@U聛聛JWk聝J聴U聝bWbU@Ul聝Xk@聝amV@K炉nk@聝lU@Uxmz@bU`脟bUb脜Vm拢U@Ww聶x@akLUK@UlakwUJWVkLmaUal@n_聝mVUnKVUUm脜XWa聶@kJmx@XUJ@bVLXxl@VVUVV聞UbkLWbU@@lUVV聞VVX聞聸K@XkJ@nU@@bV@VxUVlb聞U@xXLW聨n@UxVbV膴聞V@b@XV`mnkJ@kUKmb聝aU@Vbnb脝x@XU@@`k@@bl聞聶@@bkL@W聝akXWaU@Vmkx@XWW@聧@wUUUb聝J聶U炉V聶@炉脼U@WxX聨lL@bkb@聨lVln聛b聶JW@kkU@mbkaWJ聴IVlmz炉`UnU@mb聶@@聞聝`@bkVl聹nV@b@職V@聞aVxn@Vx聜KXnl@nbVK聞bVK@a聞_V@V聝聞w@W聞LlwnK@UmIU@VW職@職U脠@lKnal聛聞w職@@V掳@職aUmlUUw@聧聞聝V@@UXK"],
                encodeOffsets: [
                    [119836, 35061]
                ]
            }
        }, {
            type: "Feature",
            id: "3410",
            properties: { name: "榛勫北甯�", cp: [118.0481, 29.9542], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@lXnlWX@VUJVnUJVzXJVx聞kVJlI虏l聜U@K@IU脟職LVxnLn@lmUaVU@UVKVknJ@an@@UVIV脟聶KUw@_lK@wnKVklW@I@mXa@UlaXblU聞JVUVL@UXWlIUUlKVmkU@kVKVL@y聞wXLVb聞JVz@Jln職@n聨聜LXbVa么職nW@聛la@UVWUa@聛@a@mk@WIk@VwUa炉楼m@UUVK@ImK@aX拢聝聫kK聸脜聛V聶a聶聶聝_@卤聝akXWW聴L聝聝聝nU@@a@炉mK@L聶J聛UWwUV聶VmbXX@lWLn`mzUJUb聶L聝聞k@makVWmkX聶ambkKkn聝a聝@聝a聝b@聜U@Unm@聴聝WV聝@聛聬VbUbUJWIk@@lmL@掳UVUVm聞n職聶@@kmWkb@x聝_m@@aU@聛b@Jl聨Uz聶lWxXn聞@聜b虏@l`聞IVl聞UlL@V職K聞nVbUl@VlIn@@b聞bVWUk聜@@bX@Valb@bnb掳Vn@聞xVKlbVn聛V@V聜x聞L@ln@UXVV聜L聛聵"],
                encodeOffsets: [
                    [120747, 31095]
                ]
            }
        }, {
            type: "Feature",
            id: "3414",
            properties: { name: "宸㈡箹甯�", cp: [117.7734, 31.4978], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@VV@blL@聨XlWnn職n聨聵聞@VXXl@@W職IX@VJ@L職x艓xln職聨@bXJVblX@VVbUVn@VbUVlb@LnJVbVLV聜XL職脪VL聞脪職V聞bVIVylUXk掳W職knm掳_lJ@aXL@l聜z掳@聞lnL么录V聜脠聞VUUaVKU聛@WW@@UUa@knmVLlaV@聞a@k職ak卤@UmwkKmk聶菈聶脻UUkL@mlIVmn脻WkkU脻@聛K茟膲聶a@禄聝mma聛@mX聶陇炉U聝w@聝@聧UU@bU卤卤L@akm聝聞聶LUKmLUUUJVb聛b脟w聝@kUWaUJ@Xkxm@UJUUm@聶聞k聞聝聜聝akXU職Vl卤么U@kn"],
                encodeOffsets: [
                    [119847, 32007]
                ]
            }
        }, {
            type: "Feature",
            id: "3416",
            properties: { name: "浜冲窞甯�", cp: [116.1914, 33.4698], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@lU@Un@@anUlw@KVmUwlaX_lKna@KU@@kWKUU@ankW聶XK聵@@V虏VVI脠U@al@Va脠amK@wU聶@klaU聝V@X聝VUU禄WUUbkmUkV聫mk@a脠w@mWU@VkIkVWKU脩姆X拳潞U炉l聝@kkLWm脜a聶L@l聶LWl聛zVx聝VUK@L炉LUJ@bW聬聝K@b@J聛LU@Wbk@WVUU聶V@n聝J@XX@@`m@@L@bnJ@nWV@娄聹a聜wVVkxVn@bVJ@V聛娄@聨聶虏炉b聝l聶b聶@m聞U職U聨聝聨@录聝娄Xb聜UV`@nnxUxWLkUkVWKkV@XV@@VVL@VX聞@lVV@L@blL@`職L@xXKVL聜@聞VnU職@lwnU@ml@XnV@@UVW掳Lnal聝UI@aUK@a聜a@U聞kXW@I@mWL@UXK@UVW@U聜@@k聞Wn聧聜@@V聞@XblaVx職L@bVKXb聞IlJ"],
                encodeOffsets: [
                    [119183, 34594]
                ]
            }
        }, {
            type: "Feature",
            id: "3417",
            properties: { name: "姹犲窞甯�", cp: [117.3889, 30.2014], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞V掳掳膴扭@x聝臇@x聹X脝陇聞V么I脝mnLllX脭@l聝聬脺聨n@@J職b職L脝a蘑脼母聞掳VVUUKVanK@UV@VL聞VVn聞ln@聜xnklxXamk@WV@Xa聵@naVk聞Kl聛k聶@mkUWwkJWw聴IWK@聝UaUwWIUyVIUmVI@UXWmkkW聜聴聛KUUVWm@@k聝K聛w@U聜UUmkaUL聝wm@炉Uma@akaUbW@@a聛@VlUX聝a@am@kJ@UVkUa聝m聶L@UkK聝VUk聝Jk_卤@聛a聝@WmXw脟kkaVaUa卤聝聹wV@Vk聝wnyUaW@UU炉amLk@m聧聶@kmmU聶聶炉K@L@lUX炉聝WlkX聝聨Vb聞b聝VUL@J@LVKn聬lJXnlb@`nXlalV@bnL@Vnb聵录@lXbWlkL聶K@zUJmIUxUVUVmX", "@@llUL@Vlx職L@a@U聝wXa炉@"],
                encodeOffsets: [
                    [119543, 30781],
                    [120061, 31152]
                ]
            }
        }, {
            type: "Feature",
            id: "3401",
            properties: { name: "鍚堣偉甯�", cp: [117.29, 32.0581], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞L聞xV聜膴L脼k職VlVV聧XaWaXwW聶nU聞@聜anVVUX@聵bXblWkk@wWmk@VUVKnb@I職y@_kWm拢nmVa@U聜K聹wlVl@聞zn@掳l聞IlmnV職IVmnV聵aX脜WmU_VK@Un聝mmk@UIVaka聝a聶U聝脩UK聶脩WKU聛UKUamI@KkaVUUam@VUUa@UkWUaWI@a聶聧km艒w聶wUL@`mn@K聝V聶IUVUUUK聸Vk_聝VkbW聝@VkUULUJ卤I炉a聝lkxU娄@L@V@V@b@b@聞WJXbWVXn@L聝KVL@JkL聝聨V@Vbn@VV@XU@UlV@@VV@V@XXV@@V職J掳職掳Xnb掳@聞JUVVXV`@bkXW聨UbU@W聨n@VLXlm聞掳bV聞UbkK@bVJ@bVbkLV娄聝K姆V@x@聞XbmVVVk娄"],
                encodeOffsets: [
                    [119678, 33323]
                ]
            }
        }, {
            type: "Feature",
            id: "3403",
            properties: { name: "铓屽煚甯�", cp: [117.4109, 33.1073], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@V脪XLlUlJ@UXV@n脟x@bnlU聬VllnVaXVV录UVW聞U@V聞虏wVV@Vl@聞VnwlI職@Xb脝WVnUVmLUV聞nm`k@VbnblKXUVIlxkb@VVLlK@b職wXxV@n陇脝UVa脠aV_@anyVwV@聞kl@掳m@LnU聞bl@聞WVkV@Xa聞a聵V聞IXl聜IV聜聞@XbVU脝@XKWwUkmW@_UmnIlJXkWKXmV@聜w@_XV@Kl@kU@KlX@聫@UUUUKWL聛m@klJVUUmk@mXUWmX聛w聝`m@聞zUb脻akbW@聛聫m@UU聝茅UIm@Ub聛K脟录@聶kKW聛XmWUkaWU聴JWU炉L@W聶L聝wk@mm@_聶聝脜l聶UVkmWUn聛V@VWLUb聶b茟默炉l"],
                encodeOffsets: [
                    [119543, 33722]
                ]
            }
        }, {
            type: "Feature",
            id: "3402",
            properties: { name: "鑺滄箹甯�", cp: [118.3557, 31.0858], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞bVaV@XllLXU掳聨lL@V@VUnVl炉Ik職聸VUVU@@b@lUXUWmb聞n@录職b茠膴聜L脼@lVXlm脼UnkJ@nlKVV職脼XklWVaVI@aUKn禄lL@Kn@聜XXwlm@mn聧掳@聞V@聛Wy聞wX聛lWVk聶聝@aUaVU炉拢kKWVXVWLUkkWlkkwmJUam@@aULVa@U聛聝VaUaVI@m聜@U聛UJUIUmmV@bm@UXVVUl聛VmImakKUU@UU@VmU@@kma@KVIXUVK@U聶VmUkV聶m卤拢@JkU@nl職k聜聝LUlmb聴@WbU@@XnlWb"],
                encodeOffsets: [
                    [120814, 31585]
                ]
            }
        }, {
            type: "Feature",
            id: "3406",
            properties: { name: "娣寳甯�", cp: [116.6968, 33.6896], childNum: 3 },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@lnnK@娄n@@V聜V聞@@VV@nIV聞V@VW虏a@b@bVnUVVV@V聶z@l職@掳U職V聞IVaVV@x@聨XX@WlwUnV@XblW聞b@XlK@a職@k聝@al@@_V@@W脜wmaUaV@聞bnaVL@llInmU_@W@a聝UU膲UaVwm@X聧WK@w聝VkaVUUwU@@aV@@mlI@W聹LW聝UUU聝VU@kV@XalKVaU聝VUUUk@WwUK@aVI@W聝Uk@@UUU卤xkb@lV職@xnL脟bUbk@@b脟VUJ卤U@U聴@WLX職ml@bVVXL@lV@@LmbkLW`kbVxUn@LkxmV@bm@@VkV"],
                    ["@@VVVkV@聛楼@UV@U@VUUJ聝kWakKU職lXVJ@bXV@blX@aXV@V"]
                ],
                encodeOffsets: [
                    [
                        [119183, 34594]
                    ],
                    [
                        [119836, 35061]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "3404",
            properties: { name: "娣崡甯�", cp: [116.7847, 32.7722], childNum: 2 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@掳k茠墨職aVaXK@U聜UVmnXUl職V脝kVKUUUmmU聞脩kU聶U脻l膲KU聛聝w聝K聝bU@UxW@@l聛聹mVUUVmUU聝m聝w聴aW聞kL炉K@聨m聞ULWl聛Im`X聞WL@b@录@V@xkV聝I@b@l@lk聞V掳犬鹿母W"],
                encodeOffsets: [
                    [119543, 33722]
                ]
            }
        }, {
            type: "Feature",
            id: "3405",
            properties: { name: "椹瀺灞卞競", cp: [118.6304, 31.5363], childNum: 2 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@職菉nllLnxV@laXLVKma聞aXbVI聞bVKVVVIVyn@n_聝聝W@@聝聞UnJlUVVX聬lLnaUWl聧V@VV聞IXW@_W@XK@K@UVUUwVam脩Xmmw聝w聶KUnUK聶莽U@聝J聝U炉@m聨@nknWx聛Wm@@LkKm录VL@bUJUbkXWl"],
                encodeOffsets: [
                    [121219, 32288]
                ]
            }
        }, {
            type: "Feature",
            id: "3407",
            properties: { name: "閾滈櫟甯�", cp: [117.9382, 30.9375], childNum: 3 },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@聞脪V陇@录V虏@aVV@聨@聞聞x掳V職拢nW聜@nbnaVXVW@k@aV@VU聹Ul聶掳JUkVm@U@UkK炉聧WVkKWkU@Ub聝akwml聛wm@聝kUm聝UUKU@@VmLUbVLUV炉U"],
                    ["@@聛LllUL@Vlx職L@a@U聝wXamK"]
                ],
                encodeOffsets: [
                    [
                        [120522, 31529]
                    ],
                    [
                        [120094, 31146]
                    ]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/ao_men_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "8200",
            properties: { name: "婢抽棬", cp: [113.5715, 22.1583], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@HQFMDIDGBI@E@EEKEGCEIGGEKEMGSEU@CBEDAJAP@F@LBT@JCHMPOdADCFADAB@LFLDFFP@DAB@@AF@D@B@@FBD@FADHBBHAD@FAJ@JEDCJI`gFIJW"],
                encodeOffsets: [
                    [116325, 22699]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/bei_jing_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "110228",
            properties: { name: "瀵嗕簯鍘�", cp: [117.0923, 40.5121], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@vIHZDZQtDLNMXIbHRCXXITbJ@H`LGPRDDJNCLHTOCWFGvGBUJMKGFO^IHWXITQCI聮Y^AXGfR聢DXF`DJOLB~G\\DZIHHpErUVMhHb]\\M聠BVF@FTP`@zTbD\\@~M\\K`H^EVODWICAakAQXoIcCOCIgGYNWFWNGGKKGaJEGMEIKYJUT_J_Go@_SyQaSFMEGTcYOQLIIi@EKAUPCV[EEXQCW|aMUMAaYCYNIDGGACIMGGSKDQGaF_C[GaB@GOIiOKAYL聯mI@CN]F[SWWAcKKI@HMUimEKbeYQYISNUOcBKPIFBNgvDPGZYFSf]CMSIWGEUFgDIQ[MeDMJS@RR@LphFPCHaBAJKF@J]IBJO@HlO@@RKAMPJHCNDJTHFP@ZGNANBRFH@J_fM^ONJNF\\VTDJHDON@X聛RND\\XRCPVETCLBVKDFJINHRGPRV@\\CLJN@VbXbLVT"],
                encodeOffsets: [
                    [119561, 41684]
                ]
            }
        }, {
            type: "Feature",
            id: "110116",
            properties: { name: "鎬€鏌斿尯", cp: [116.6377, 40.6219], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@JHTVHXCHPfnDJGHNDJSB[JSBGVSAOH@PMPuDEHHXZN@PHF@ZLJ@LHVYJA\\OFWP]BMtMBSRGV[JeVAPQVIFENMD隆聳@^NV\\JH@NNL@NM\\kTQ\\I^FNIpBHGTBFFAZQfKDIXQTLXFXNNVMVHRGpCFLlRLEVBBH`IVO\\G`RDPAXLXBXORHZEHTDLLN@VGTMrQNFPeASKG@GMOAKBYMK@GTUHUXSHMVDNMOUEOZMJML@^KRACMZEZMRQLUHE@OFENPR@DI\\ChMHIDG\\GJMDWHCKGMDCIQCHO_K@GaIJSWWQDaGWJMNCKRsCYGYuJUSaKaW@UIMDK@[QUHOGQJMEILCAUDKFSOUQD[WMC聜Q@WPMGCCIUSE[IMPMN]`e@IEGAQBMHM@YEOSGCIDMIGNOLB@QP@GkP@AI^J@ILEBIbADGEOog@KQQWSekWQQUOFKZLF@PUNmIaHIUeBCTSHENcJa@_IWSaGu`GLSBKJQFOXGDXVQVOBIHcDSJWBEFGTMH[^mLaXcHiKElTRKtFXZ`MHMPCNRDxZ聢B\\ICIHK@K聨HbIVFZ@BPnGTGbDXRDJaZKRiGEFSFEJhjFNZFjn"],
                encodeOffsets: [
                    [119314, 41552]
                ]
            }
        }, {
            type: "Feature",
            id: "110111",
            properties: { name: "鎴垮北鍖�", cp: [115.8453, 39.7163], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@h@bl@HRJDZ``TA\\VVD^H`\\pF\\J聦`JGv@ZO\\GPSTEjPTR`FnEbDTDHEhLFMTK@ETSPULKEI@OVISKSJACEQNQbV聵IXGDIN@dMB[IIBcN]ZHNLP@XOWCFW聤CNRHTpATD@^NVNLED@Rh@jCEF}E[OOHUEW]W@QGGDIQSH_MmFmCUT_K]i@MH聫CMW聴FCF聥E{BMHMPOHKS]CFNGBELDH_@BcAKOACESAOBELaXAROB@FODMEDWJAG[aE@UM@DImEWJMC@OeCA{aE[@{L@MINUCQXKfUJORCHqJBF@TCXWNQX]M[EAJO@@KMBQJIC]EWMCCUBEBFHKDOTMBGNGF]MWDBRDdMDQVyE@LPVHDCP@JVVMTG~HNSH[CmRUvHPHBbA\\PTNRC\\YNJ聙PRARPJDDR"],
                encodeOffsets: [
                    [118343, 40770]
                ]
            }
        }, {
            type: "Feature",
            id: "110229",
            properties: { name: "寤跺簡鍘�", cp: [116.1543, 40.5286], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@^AXOPEB[ZIGU@KKI@YGE@OYMGWFGvCNO@OPGTBHUTA\\ITACIGMIHmCOeDGGWSUIGimYEEMgiFITEFEjHLQbYCIWQaCSHmHAOY@UEaJ聧G@LGLDJ[J聡AwYQCDMNONGY_EWLsSQFkMO[NWAIGaIYL@HMBOKiOQDWEUDMQSF_QIUBWdg@[NaAKQ@M]OQ@WhgLUMMFYQDIRCEUZOOCIOJ[KIUMKL@HIDKVEBM`HJAJSJUdBLGNEdMBMO[BYEWJSNKNaD]PE\\SjOT_RQVEZPp聝NQXf聤NA~lNG`@PNLp录RFLfbdKbATUh@FSNWjGFZVLFHVA~X篓PPROfFJbNJPLFbENJPrEFNPFRHDDJdENJLVEPBJTVTHGHFRFH@PXP\\ORQHW\\BjWFDERLPPBbB\\E`B\\D\\L`@F]FCnJ^AZL"],
                encodeOffsets: [
                    [119262, 41751]
                ]
            }
        }, {
            type: "Feature",
            id: "110109",
            properties: { name: "闂ㄥご娌熷尯", cp: [115.8, 39.9957], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@V@XMnGPY虏聣JQNEhH\\AZMPDVTTDZCPiJkHSHCjIdFtEHITCNITQEKUAMCEIKCECABYESKFWAKBEIIHABGDCKCAIHMHALKEI\\CFIBILIJQZS]BBEECS@E@@C]COKI@CABAAEEDMG聝CH]A[M@CJWH聴JaUMRFRBDTITLUJ@PFJKLOVST@FSLENgKGFSCaCmF_ESQiOSFOT[HYPu@IH聥_[IoE_[]GUC[USB__CYQI@Gakg@qZeHQNMNV\\FVLPgJAFJPRLCH[XcPELUT[JiV_EELFTADBXRTRLJC@fHXHHbPd`fR@NfT`@TLplHMpCEJHJBVLF聨@JT聜VnG^KXDXHNVGRLRXFJVdDHSNWLGfEzA"],
                encodeOffsets: [
                    [118635, 41113]
                ]
            }
        }, {
            type: "Feature",
            id: "110114",
            properties: { name: "鏄屽钩鍖�", cp: [116.1777, 40.2134], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@VNLJI\\JPPDYPFVQDCJZRNEVNhKXgR@^P@NLRbB\\Mh@XcVARJE`RTCNFV聙XRCjPPLNA@GZKbJJHXB\\MNPjLdGbWnK\\]NGHSFEXATIdCJGPARUWUHCPWRELITAHKv_E@iYCaW_BQ\\Y@QIO@QDCIGZCEMWGFMFAFgHEDOCSqKCCFGAMKEAC@ODGCGs@WH@KQA@EE@CE@GEA@EH@GGUEEJEAYD@JM@@DAA@FHD@FTJEHUC@JUBKCKG@G[CIIQReAYhO@OXGDO@@FF@IHJFCPEBACBIAAKDOABXARHP聧NEHGbQAAKQFGIAM[C@WHKaGiCEGOA聥HUKCIokSCUSOCYN[BgGMFIR卤聤OZmHWNU@ShbbXDHVXXGJ^lZ@PZ\\Nb@\\FHJAD"],
                encodeOffsets: [
                    [118750, 41232]
                ]
            }
        }, {
            type: "Feature",
            id: "110115",
            properties: { name: "澶у叴鍖�", cp: [116.4716, 39.6352], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@F\\E~DFN@BDFEpHFCHBBEGCDCJBHUDSBB@ELCPbF@B\\J@BJVAFJ\\ADKTCBGECFMT@BMN@@FH@DaNBEnvB@FPBATK@FHEFIAKFBFL@@PKBFJHC@FXBRAFCDMPDTOL@JIVFDHH@DDH@BGRFCDLD@N^@@CNA@KNOAEBCECFEGCFGMGFIPMOEJOLBADBBHGG@GCHIECY@INC@DMGS\\AIOZAAEYA@GT@KKMBEETCGMVINFxA@MJADB@FlA@HJA@NND@DFA@DVAZBBOFKH_JA@K^GBC@EFE聞G@gAENMXKJigC@IbSJMqGOP拢RGSMGE@kbQFDPEFiBSGGSBK]I{CDWCIDOic[C_G@SuSO@EWKCO@MNY@\\uZOPENQD[LKESSKGBKEG@EJGAGHoH楼CqhifeJkX_XFFGHFNEDFPENKHM^IFIVL^S`DVEnNnG`RTCJHH@R^XFXGVPP"],
                encodeOffsets: [
                    [119042, 40704]
                ]
            }
        }, {
            type: "Feature",
            id: "110113",
            properties: { name: "椤轰箟鍖�", cp: [116.7242, 40.1619], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@EhEBENXHFNYDJHCD@RJP@R[ZARX`DbjZF@bHXT`Jb@dIFMTGDSfAJVbGnJVM@OKELYPERVXRflXTT@NIfC\\NJRhCVEHFJXNT^DTeZEHYCOhuAMJELOdAVPTMOWBWNMNEJgl]@WGUFIC[T{EEDEHGCIGMI@SECUQI[D{A{GQESPUH]CsiMCmHUeoHENcAaDGCMDGMQCACCBaCGLMAHB@DIEQLOAAEEJ@CW@CDINGAAGKQOCgV@LG@BEGDKNeREFBNCFIDOPKD[@YRW@GFWDAFE@EHDDrLDTCPGF", "@@KrJEH[\\B@FF@CHFBHUN聥AJKADGECBCMAG^E@EbI@BEGP"],
                encodeOffsets: [
                    [119283, 41084],
                    [119377, 41046]
                ]
            }
        }, {
            type: "Feature",
            id: "110117",
            properties: { name: "骞宠胺鍖�", cp: [117.1706, 40.2052], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@ZJZRafFLjn聙VGNJ@LLBdXX\\T^EDMJ@聰nZKLBjPPJ@HbA\\H`DbERHLCFK^BZaFWXQLAGMHa\\OLO@SBIpBdCL聝VQfElO@GSAKEDQTC@GEBKG@ORIJBDAPDFA@CaOq@GGQAAEJK@KMUGAAGEAa@MGMBGCGSIIW@WSUCMDOJeWOM@IUF{WMWaDIMgIoRoCOKeEOEAG_I[cg@wLIFENQFDVTFJ@HNDJGHCFFFS|D\\EJHV@Xk^IhMFMNAXPX"],
                encodeOffsets: [
                    [119748, 41190]
                ]
            }
        }, {
            type: "Feature",
            id: "110112",
            properties: { name: "閫氬窞鍖�", cp: [116.7297, 39.8131], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@FDAJTGDNDCTDDEDBBE@DT@@EHCDGJ@EIZ@@FDBR@ATFBBVFFE@@HNA\\VE@CLIFNJFNJBCP]A@LJFA@HJEDD\\C@DBCHLAEPF@@DH@APHAERDF\\GIxDTM@CFLBBFJ@CNUPMHECGDBF]BMFPDLRBHHBJMDCX@@DFIBFPBRKJF@CGANBHKbDDABDRDHNNCHDbCdBFMpGHiOYMefKJMC}HWAUNW\\NNBNA聞kNU|]HMTMN@MZBLFFF@RIRUT聭BMFIEGaAGGAOIIUGTSFcYKS@MSLYPKRUBU]EWDOI]CKGASgW@MTWKIMCS@uMAKKADMECGAKVUTSDy@IjWLMNBF@h聝HEF@FAD]H@LIBG`ELAPYAUB@CEB@CMC@MIB@GkB@ECAIB@NwBMEUJHNSDFFNALLS@@HZBBFYBJP[BHTCND@JMZ@FDGJHDH@GHAABCKAIPPFONEJNHEHHDEFFDADBFMP@L"],
                encodeOffsets: [
                    [119329, 40782]
                ]
            }
        }, {
            type: "Feature",
            id: "110105",
            properties: { name: "鏈濋槼鍖�", cp: [116.4977, 39.949], childNum: 2 },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@bFGHBHFBFIVFHHG@@FFB@HDFF@@FRB@LXGt@DHCH@PBDLFBNF@BEXCHEX@ZQ\\@LCPOJCDEAMFEfQLMHCAFH@@KhUNE^AAEHCFDNGVODMI@AEKADEN@CSJw[HCEFQGBBOG@@CE@FOKBDGCAD@C[FCGIB@IE@K^BDOIAEMMIJEDKF@[UMB@GF@EEAUEABSQ@CA@EY@FJI@CHGD@FS@@CAFCACFSCCDCMSHBIECMB@D]@@MKCDCQEAHG@CCG@CGUEIJK@SPOCCNEDQBDNDB@DJCDLFCBBALJB@BVGPBKVO@KHCCCD@FE@BNA@FNCTDDJA@FGB@NBDW@CL@hT@@ZHHQDDDAFSAANBC@HG@EFS@@DE@@PCB@Ue@CADNJB@FCBWA@LI^ix@FIHrH"],
                    ["@@HUN聥AJKADGECBCMAG^E@EbI@BEGPKrJEH[\\B@FF@CHFB"]
                ],
                encodeOffsets: [
                    [
                        [119169, 40992]
                    ],
                    [
                        [119398, 41063]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "110108",
            properties: { name: "娴锋穩鍖�", cp: [116.2202, 40.0239], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@plDJVL聦GPBFHjDbHGL@X\\DBNHJREBLRBHaFG聨MGOBQAWPBLCBBAJBDFADOIEJGE@@EP@HCPWP@ZgfBRQJJ\\D@HLHLDVA@IVDFGSI@EGC@EBB@CN@@IZCAGHGaEqGJG@EjwJ]@K@GSA@e_I@NE@CA@Kg@KC@ENCF聝AKQAW@WIMK@V聥@I@@F@^EDFB@HcIaDYCBRRDCHD@EFLN@FE@CJUPEJOJMTBPEDIFCMIAKNOGMRFJNDVBFLSRMJSDGJsFcEiJGDGTIlOjYD"],
                encodeOffsets: [
                    [118834, 41050]
                ]
            }
        }, {
            type: "Feature",
            id: "110106",
            properties: { name: "涓板彴鍖�", cp: [116.2683, 39.8309], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@hMN@NFTQCFRCBJFA@HJ@@HJ@HJ\\FTACD聦@@UNLXJX@@MA@@IECAQlDFEHBDI~D@GXCFMVDFCH@@NF@ANJC@FnAB@AMF@@EDCDDLGP@LUOAUH@AIABKAAEDCKID@CCACMWA@EGDEILA@OK@AELEJBFEEGL@BSOA@EuAFmMACbG@@EM@ANS@ENFDAHSDCL[BEIUBAII@A[E@OaKD@FAACTGVIACDHDAFGAEDoGEFACM@i聙g@@QFCMKMU@]SCoBGSMQ聣DEXXDWPO@MKYGM^AdJJA\\cNB\\G^聞DNHFCBFABDBJ@PL^D@DF@T@FDAF^A"],
                encodeOffsets: [
                    [118958, 40846]
                ]
            }
        }, {
            type: "Feature",
            id: "110107",
            properties: { name: "鐭虫櫙灞卞尯", cp: [116.1887, 39.9346], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@NQPHLMJBDNJEFCAONSPIFIVODIF@@EKMFEC@DGQCAQZDbCdJ@GEAFC@]@EJ@DCSB[EGII@@GI@@GEBAIQDDESRMEM@gNYTIRKJAJEJ[DFJKLGBGNBJLDCDAHGBJJAFBLEXTLZFBAFDLD"],
                encodeOffsets: [
                    [118940, 40953]
                ]
            }
        }, {
            type: "Feature",
            id: "110102",
            properties: { name: "瑗垮煄鍖�", cp: [116.3631, 39.9353], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@XBDA@EIACM@IJAD]BC@SFABISAD]H@@O聧AEDQEW@BLE聞MD@FLDh@@LDBF@@M`J@fTB@H"],
                encodeOffsets: [
                    [119175, 40932]
                ]
            }
        }, {
            type: "Feature",
            id: "110101",
            properties: { name: "涓滃煄鍖�", cp: [116.418, 39.9367], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@DBf@@VDA@OF@@CT@FEH@@GADBMTBBECCRCGG@YS@@gDK@A聭C@PG@C^TBAJEB@TADC^IB@J"],
                encodeOffsets: [
                    [119182, 40921]
                ]
            }
        }, {
            type: "Feature",
            id: "110104",
            properties: { name: "瀹ｆ鍖�", cp: [116.3603, 39.8852], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@RBX@RFFC聨BFU@aK@WA}CCJGAEFkCBRFD@JB@@N"],
                encodeOffsets: [
                    [119118, 40855]
                ]
            }
        }, {
            type: "Feature",
            id: "110103",
            properties: { name: "宕囨枃鍖�", cp: [116.4166, 39.8811], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@XBL@@bEV聮D@BX@AC@MHA@EIBCCDSEMmB@EIDBME@@MG@EDUCENWD@H"],
                encodeOffsets: [
                    [119175, 40829]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/china_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "xin_jiang",
            properties: { name: "鏂扮枂", cp: [84.9023, 41.748], childNum: 18 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@聸蟻葋么僻痞贸蓹实住实贸篇垣实训桐僻桐趽聸蠀唷撋浭礍葍@贸釃懷灯ㄉ澤毭疵承澭和┥溙徳得雌灻盄蠀譬聴輫葌贸譬僻@训葌蠀聹匹艑啜椔椸ゥ蓻贸实训僻压聵輫虓啖樕櫳炏吢樝佂┨徝赤屁僻艐么艒贸職虓桐贸实谉聸贸艐趽酮僻讯@蓽原聴垣痞蓻葎虓聸蓾葎枚蟼譬葌虖聹帽葊虖聹譬贸贸艓蓹聵@艕處@蔀葊蓾艓么屁贸谞训葎僻@贸艔蓾聹贸蓽么艓虓通蟼艓@屁贸么屁蔀輬识贸屁蠁贸處葊屁虓援貌迅援诪@押葊@篇醽喢踩偯碧惷踩偵溌樏称ㄌ捙幪戇粿蠁蟻葊@艕喙愊偺幤咢蓾蠁跀喑υ苦@痞艔援屁屁葎僻郜蓽识跀艕蓺蓺贸艕么屁呒聵么僻僻贸虗匹贸艔押强痞葋蠁僻蟼聵屁僻虙@蓽匹痞蠀虗蓻篇桐譬蓹篇史虘蓹@葍屁实谞艐嗑概嵿原元聴@蓾屁艐虙謪蟼实么僻"],
                encodeOffsets: [
                    [98730, 43786]
                ]
            }
        }, {
            type: "Feature",
            id: "xi_zang",
            properties: { name: "瑗胯棌", cp: [88.7695, 31.6846], childNum: 7 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@么艑谞聹么识處酮么聶贸艓屁艑啜毱惷聪偼喡椛毶澿聴輬處押聴讯屁么识啷ι溹聵痞艐蠁聸讯葋虓聴么艔蓺艐@虘蓹聴@艔貌虓蓽聸贸匹么史僻虓蠁压元虓注@迅史蓽@么帽谞@讯蓻蔀么虗艔讯屁迅僻匹艒痞聹么艔么聴@僻么譬虙艐屁艑痞强么處蓽葋虙聴贸识讯么么袨虙聸蟼匹蓽袧蠁蟽蓻葋處蠀屁喟逼廆实匹聹@艑贸贸贸桐屁僻贸艐虘玫贸蔀贸蓾冤酮蓾蟻么僻虓僻压通趹艓虘艒贸僻啖┨徰瞪澝赤氨贸贸元蠀么@虙匹艑虖僻虘葎輫艓僻聸训訌@蓻玫艔蓻葎么訏僻艑训强蓾聵僻艐垣@虖蚀匹@贸强虘葊贸强虓蟼贸贸蠀么@识蓻帽蟻痞譬艕贸處贸聹训贸虘酮啖灻成溩熉樒徠ト勥惶幪徧愖熍幧澤溍渡炂┤€么枚蓻葊贸酮虗屁篇虓處葌匹元蠀袨@蠁蔀聵么篇"],
                encodeOffsets: [
                    [80911, 35146]
                ]
            }
        }, {
            type: "Feature",
            id: "nei_meng_gu",
            properties: { name: "鍐呰挋鍙�", cp: [117.5977, 44.3408], childNum: 12 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@釆娙佮珚枚呒譬蓽蓻谞帽援蓻讯贸援么@葋迅贸诪處喽溠横伂@呒识援訏呒處@艕压訏虙元屁枚喽溙懷度勌捪傕イ聹讯蓺枚蔀蓽蚀跀么么葌處聴押葊蟼聴屁聵篇贸元聴蓽么蓻袨啜曏斣樠堤嵮谷傇浬浧ヌ嵢偯成溙幟碄识輮喋侧实跂酮谞屁么葌僻聵虗酮@艕痞屁蠁袁讯蓽么痞@艕僻么么痞蓹艕虖聸@艕趻讯袁么虗食冤袧蟼艒么艔蔀@屁葌讯蓹贸僻虙鼗處贸虗艕谞贸屁么虙@屁蓺蓺@注垣蓻蓻@葋蠀桐匹食貌謬蟻聴虘唷椘純啷Ｔ兲幤么么@么艒@職@葋训贸屁虓蠀葍贸实蓻屁匹贸蠀葌贸蓹篇聸虗蟻僻桐蓽原跀葎處毓僻葋虗艔贸虓蓻聸匹僻虘贸蟻艕@僻虖聵蓾蓹蓻聵呋桐虓桐蓾袨虓篇僻贸贸訐屁贸僻食輫@蓾蟼篇聹@蚀譬聴僻痞么屁蓻葎蓹聸僻艐蠀聸贸桐训@蓾强贸艑谉虓蓻聵贸袨虓聹虘虖么葋虓艔貌葋帽贸痞桐@强蓹@蓻僻虘聵蟻葋蠀么虓謪压聹贸葍蓹聶@葌蟽实逊篇貌譬虓聴么贸呋郫么食僻聶贸職玫实训贸压蓽虓葌压么蓻艑蠁謭譬通蟻贸蠀討贸逕喟碧戄囃称ㄅ屆橙勞斣┫傋澝碧懭冄蹬愒徠ㄈ伾浨肯伱疵瞪毶浢称炆橜压虗训枚元通么酮蓻虙谉艔僻匹贸么匹僻蓻艑么贸蓾贸@虙輫訏虙艑@艓原啖�"],
                encodeOffsets: [
                    [99540, 43830]
                ]
            }
        }, {
            type: "Feature",
            id: "qing_hai",
            properties: { name: "闈掓捣", cp: [96.2402, 35.4199], childNum: 8 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@屁@么篇輬葋篇聵@蠁蓾貌贸屁援识蓻虗压酮么袨蓹贸僻蔀釃捬禓么跂么@强讯聸篇葋蟼聹蓽桐蠁聵蟼艐蔀么讯蓻屁艑蔀聴@蓺蟼艕帽元啷⑼┢ㄈ偵灻称ㄅ愄幣徸⒂徧幟称γ绰溙捜伾溌浵偼┨捖溕毶浧雌ㄉ澫喩浢橙伷ㄅ嬅趁成毻┢趁称〡僻蓹艐痞譬虓@僻僻么强蠀虘@葋蔀强玫艔蟻匹住蓺僻贸蟿垣蔀聹么僻痞@帽葍貌帽匹贸蠀么么压训聴@艔虖葎蓾贸@葌蓹艑贸蓹压痞@艕虓艑蠀輬冤艕僻贸么僻虘聸么实蔀僻虘训么譬蔀僻虘聹贸袧训贸么实虘聵蓻葌贸虓匹葊僻艐虘艑贸篇@屁贸聵贸艕匹聸痞艓逊屁训僻虖艕蓾贸训蓽谉@贸貌蓻@逊矢住@冤處蠀押屁處贸矢么痞蓻聹帽處@艕蓺聵@虙蓹艑贸艕處聵"],
                encodeOffsets: [
                    [91890, 36945]
                ]
            }
        }, {
            type: "Feature",
            id: "si_chuan",
            properties: { name: "鍥涘窛", cp: [102.9199, 30.1904], childNum: 21 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@么聵么艐贸虘援虙蓻袨诪酮屁艒枚瞳呒匹么葍屁贸贸帽么僻贸僻么艒跀艔屁艕@艓么聵貌匹押艓@艒蓽贸谞聵么强么聸痞么援虓蓽么蓺聸僻聴帽蓻蓺葋虓僻蓻謬蠀@贸贸么艐蟻原蓾@僻矢虓艔蠀蓽僻僻贸僻屁葋蟻虓屁葍蓺聴么实蠁贸么虘虖葌虘实蓽实蔀@屁食住譬贸艓蓹聴贸蓽僻么譬僻蟻聵贸么么么@艓僻屁屁篇压聵贸虓虓譬@虖压袧么逕虓譬贸篇蠀蓾蓻聴蓹屁么艓蓻葊@葌@帽蓾识@艑蟻谞虖聴玫贸蓻通屁葌训袨蓻实@虖譬艕贸呒僻喟蔡嵪喩溔傁呄勆浶炏伷ι澠称捬渡澠呈短捖溍称ㄆ丛徬嗇囂幣婡艔押匹么蓺蓺艐@葋蔀么虗葍@艕讯聵贸押蠁贸痞么帽貌貌葎"],
                encodeOffsets: [
                    [104220, 34336]
                ]
            }
        }, {
            type: "Feature",
            id: "hei_long_jiang",
            properties: { name: "榛戦緳姹�", cp: [128.1445, 48.5156], childNum: 13 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@釃斎傕袧屁艕讯艔枚匹蟼艔帽僻痞贸屁葋@贸屁聴贸葋蠁討贸贸屁聵贸强處虘么袧蔀聴贸虘蓽蓹呒聸處强虙么趻討蠁@僻葋處虖匹譬處蟻喟堵樏慈傁偲ㄏ咢谞蔀輬聵虘匹僻蓻屁实僻葍匹@僻匹@艔虘冤么蓾蟻蟻贸蓻僻聸譬桐僻贸呋矢虓史压匹蔀跁玫虓枚蓾蠀聴虓葌僻虗虘艔贸屁帽艐压贸贸葋虓聸虖袁玫矢虖艔@强虓@僻袨蠀@帽屁貌葊匹艓虘艕训贸蓻艑贸葌垣艒僻艓压帽虓识贸袨谉@僻處讯么@葌@聶贸艓贸@@贸虓匹原謩嗉勦イ屁桐虙唷樝偮樏敝埰κ聪喭狜葌蓽蓽住袁蓹@僻蓹虘@僻贸谉么虖艔虓么虘丶么屁训蓺僻葋蓾@贸艕蟻艓元袨虖蚀"],
                encodeOffsets: [
                    [124380, 54630]
                ]
            }
        }, {
            type: "Feature",
            id: "gan_su",
            properties: { name: "鐢樿們", cp: [95.7129, 40.166], childNum: 14 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@跀么援啖疈艒虘艐輬討@虘蔀么贸么蓽艐痞屁么贸屁痞谞艕蓽虘贸桐冤艇讯玫押虖蓺@屁袧蓽么枚蓹蟼贸蓽葊僻葌援艕讯艔虙葎诪貌篇蟻趽垣么葍僻艐么譬輬桐蓺@@强蓽@蠁桐贸艔蓽討僻艒么强處聸么匹篇贸玫聸枚@么聴屁聵么僻痞么贸虙蓽@蔀艑玫识虖艕@葊贸么屁葌@识注@@匹喹居懨程懨撑嬅词得成涄揁@譬枚贸譬贸蟻聴蓻屁虘@贸史匹匹處蓻僻聸么艒僻强么桐训么蓾葍蔀葋玫僻蟻贸贸聴@艒僻艔趽艕贸艓么屁贸屁么貌僻么贸葎呋痞玫同僻艓诐桐蓽袧原虘么虙贸艑贸聴匹@贸屁蓾聸蟽袁屁么注蓹蟼痞枚艕蓾葊@葌蠁虙贸葊屁屁處@匹篇蓺艑@屁么篇僻么蓹酮么么僻艑么葌蠀蓽僻蔀僻贸蓹蓽虘聸蟻酮蓻聹虘葌贸聸屁匹虓么住訍虓艕僻艔蓾么僻葋啷⊥苍┫伵廆蓹蓾聵僻艐训蓽蓾贸蟻艑蠀聴蓻酮蟻聸譬葌训聹@葊跁贸@葎蓽识蠁唷斱斅溒ㄍ锻睹雌┳⑹渡毷镀ッ疵称ㄏ側�"],
                encodeOffsets: [
                    [98730, 43740]
                ]
            }
        }, {
            type: "Feature",
            id: "yun_nan",
            properties: { name: "浜戝崡", cp: [101.8652, 25.1807], childNum: 16 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@么蔀么蓾虙枚么艑僻屁么酮么么@艐痞聸@识屁艕么呋篇艔@虗蓽识讯袧僻葋蓽艇枚么虗聵蟼谉@艐蔀实@貌@葋蓽强贸艒蓺僻蓽聵蠁蔀么譬處篇贸逘押袨@虗處篇么處押聴僻譬屁僻@艒贸贸么贸蟼聴篇屁屁贸么蓻贸虘原聴匹艑蓻强蓾屁蓻桐么聸@强屁葋押艑蓺蓻虓谉讯袧蓻僻么贸匹葋痞桐么艓蔀聴屁虘蓽聴貌么蠁@屁实@蓻压艒贸葍蓹屁蠀强贸实蟻僻僻艑譬蓻虖葎帽僻僻葊蓾虓冤识僻虘蠀聴贸艑匹食蓺討贸袧匹么虘聸贸訏训实压聹僻訍谉么篇蠁玫艑篇虙垣艑僻丶屁屁住聸蟻葋僻聹屁葌贸识贸@@蚀屁么么蠁處艓@葊屁聴篇蓺屁聹贸屁么么么蟼贸蓼僻艑譬艐僻元"],
                encodeOffsets: [
                    [100530, 28800]
                ]
            }
        }, {
            type: "Feature",
            id: "guang_xi",
            properties: { name: "骞胯タ", cp: [108.2813, 23.6426], childNum: 14 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@痞艐押處跀实屁艕@痞诪葎篇么贸葌蓽艑蓺桐蓽@枚贸蓽么么葌痞么蓽葋@蔀蠁聸贸葎處聸屁识蔀艐屁蚀蓺强虗處袁@么帽@虖屁聸蟻郢么聸蓺屁屁袧篇艕處聸匹贸痞实匹艐@葍贸匹僻@@艔蓾强么蠀僻葋训蓻@蓹贸艔虘@@蓹虓聸贸僻贸聴@葋譬聵蟻贸貌袧匹么@訏虘@贸艓虓匹蟽艓蠀@虓屁@艑虘么贸酮屁虙贸艑趽聹虖艓@艑么葎押艓@蓽僻识蠀@帽贸蓻聵僻虙蓾聵贸艒匹酮"],
                encodeOffsets: [
                    [107011, 25335]
                ]
            }
        }, {
            type: "Feature",
            id: "hu_nan",
            properties: { name: "婀栧崡", cp: [111.5332, 27.3779], childNum: 14 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@謩蓽袨屁@枚艕诪贸篇么譬蓺虙艕呒葋蟼桐蓽貌篇聴蓽葊貌聴帽蓾貌聴押酮@艔屁艐贸蓾么强屁聶蓺葍贸蓹屁葍训桐贸虓@葍屁贸贸匹屁僻@实痞聸贸桐蓽聴蓻贸帽原蓻艒蠀葌虓僻痞艒@蓻匹聴蓻葊虘聹贸史贸艒虓聹譬艔僻袨蓹僻贸聹蟼郜僻聹@虗贸貌垣@虖虓蓹葊僻食蓾艑贸蔀僻聵屁蓽贸艕屁貌@葎僻艑蟻艐贸么元袨贸识@處贸葎"],
                encodeOffsets: [
                    [111870, 29161]
                ]
            }
        }, {
            type: "Feature",
            id: "shan_xi_1",
            properties: { name: "闄曡タ", cp: [109.5996, 35.6396], childNum: 10 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@蟼么枚屁蓾葌蔀葎讯贸贸酮屁葊贸艓屁聹虓蓽痞痞么矢虙@蓽僻蟼聵篇么玫么@篇跀@么蓽贸识么艑么虙喹接扏痞@押處蓽押蓻讯么枚识么聶屁職贸蚀呒郯贸么處聵帽篇迅譬蟿识@葋貌艐蓹压贸强虘实@葋虙史蠀謨么輭么袧虖胤@葋屁贸么虖篇玫@食虗实@蓾蓻艐譬艑蓻贸谉么僻艐虙贸@艔虗匹@艔蠀@僻僻么谉虖@匹葌压蓽蓹聹蓻贸原處匹贸贸聹贸葊谉聴蓻么@艓压艒帽痞"],
                encodeOffsets: [
                    [108001, 33705]
                ]
            }
        }, {
            type: "Feature",
            id: "guang_dong",
            properties: { name: "骞夸笢", cp: [113.4668, 22.8076], childNum: 21 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@葌么聵么屁處聹@蓺虙@么艕@蓺讯蓽屁葌贸蠁蔀葊@艕屁@么痞@葎痞艑匹识痞么么艓么矢虙聸蓽强痞聵@蓽匹艓處屁蠁葋蓽艓貌匹援艓屁艒贸艔蓻僻蓾蓹蔀僻呒蓽蟼葍帽葎痞艓虙艒么貌屁蓹屁聵蓺袧@蓹屁虖篇实蠀艑蓹蓻贸蓹原艔蓹聹贸艔压聹蟻实蓾痞虖聶匹食讯聸枚艒虘贸贸艐蟻葊蠀僻匹蓻压艒僻么谉聴蓻艔训@贸艐么实蓾聸篇冤玫@僻艒虓@僻@@痞蓾援篇袨@@", "@@X聧炉aW膧聞@l聫"],
                encodeOffsets: [
                    [112411, 21916],
                    [116325, 22697]
                ]
            }
        }, {
            type: "Feature",
            id: "ji_lin",
            properties: { name: "鍚夋灄", cp: [126.4746, 43.5938], childNum: 9 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@谞@么袧處实押貌屁艒袁艓么葋蓽艐讯么虙艔痞艒帽强貌僻蠁@屁袧處@@葊虗艕枚史虗垣處聹么葌押么貌艑么僻虙艕屁虖處葋蠁聵@艐譬桐诐葍屁聴@葋虘识@艑贸么蓻聹匹压虘聴蟽蠀輫@蓽蟻僻葍啖绰溕櫲偵浥嵠┥浱徬呄伱趁德溒聪呄咢识么艑贸聹蟻謩@蓽僻@蓾强僻酮蟻葊譬贸虖艕屁葌虓睾趽葍蓻援屁酮虖蟼譬聹么蓺蠁葋痞么蓽僻么识蠁葎"],
                encodeOffsets: [
                    [126181, 47341]
                ]
            }
        }, {
            type: "Feature",
            id: "he_bei",
            properties: { name: "娌冲寳", cp: [115.4004, 37.9688], childNum: 11 },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@譬虙虖艑押虙譬聵贸葎僻艑匹酮貌么帽葌處艕贸葌虙虗處聸么袧蓽聴谞處么艐蔀葊讯@么酮蠁聹屁艑蓺聹蓽葍贸僻屁匹篇聵@食譬聸蔀蟻輬@蠀袧蠁实蓽聵痞蟻屁僻虓蓾贸蓻压虓蟻艔虘么贸屁@聹僻痞么屁蓻@匹屁@葌痞@@么蓹艕僻识屁艑蠀聹虓處蓻艐么艒蓾@贸僻虓聸痞实训食么实蓽艔蟼么篇艐屁艑蓺@么袧匹僻@艒迅蓻虗么處实训袧原@虓虓僻貌@葋蓾@蓹蟻蠀桐篇虖譬玫僻艓僻艒贸職啷∪勆浭渡溔€@蔀蟼讯僻聹匹蟼蓻艕@蓺蓽蓽@艓么么蟼聹篇蟼"],
                    ["@@玫蓹@僻蓻聵@艕贸痞蠁么"]
                ],
                encodeOffsets: [
                    [
                        [117271, 40455]
                    ],
                    [
                        [120061, 41040]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "hu_bei",
            properties: { name: "婀栧寳", cp: [112.2363, 31.1572], childNum: 17 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@帽葎蠀痞枚艕譬聵贸谞屁屁蠁@@艕虖痞@艕虘么屁艑谞贸蓽么篇艐蓽艑讯謪跀蓹輬貌蔀艒蓽艓么訌痞贸屁么虙贸么葍屁贸處艕么僻篇@屁葋蟼僻蓹虘處袧@虓僻艔蟻么原桐垣聴虓实僻職贸葊么蔀僻艑@艕压桐帽聵貌蔀帽聵蓻强譬聵蓻帽蟻酮呋葌虘艔篇蓹譬贸诐么玫艔僻@蓻袧匹葎贸聸虘押僻聸么蠁贸屁屁痞篇贸蓽艕么贸貌么屁贸蠁虗屁贸痞處"],
                encodeOffsets: [
                    [112860, 31905]
                ]
            }
        }, {
            type: "Feature",
            id: "gui_zhou",
            properties: { name: "璐靛窞", cp: [106.6113, 26.9385], childNum: 9 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@蓽葊痞艐援聵么虙蓺聵么艒注篇僻蚀蓾@蓻识虙识虗葋痞聹贸葌么@么艔@艒么聴屁识迅么@识屁聵蔀贸@艒蟿枚貌蠀屁@@蓹屁么@蓻虙@痞蓽么葍@虓么实冤袧么贸蟼艑屁艐@葍僻帽么艔僻蓻屁聴么蓾僻实虓聹么葍蠀聹@蓾蓻葌匹贸贸葋蓻贸玫么蓻@蓹酮蓻艐么葋譬贸诐葍@匹僻艔趽识压虓匹艑痞葌贸么蓽屁训袨處谞蓹蓽压艐僻葌@葊贸聹蓽酮蔀僻"],
                encodeOffsets: [
                    [106651, 27901]
                ]
            }
        }, {
            type: "Feature",
            id: "shan_dong",
            properties: { name: "灞变笢", cp: [118.7402, 36.4307], childNum: 17 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@譬虗蠁酮蓺蟼蔀@@葌屁帽處處援@讯袨屁僻跀@蠁袧虘艐@譬虙强處@屁蓽袁蟼么识虗识枚垣屁僻谞匹蓽艓么艒處@么艔贸蟻僻艔垣么贸僻冤贸@匹蓽僻原贸屁实蓻屁呋討蓽袧冤聵贸么虘贸僻食蓹聶贸蓻僻@玫葊僻聹虓葍蓻艕贸艔蠀袨虓聴贸蓾譬聴冤@僻蓺垣葎蓺识屁聵蔀识元虗趽蓻篇虙"],
                encodeOffsets: [
                    [118261, 37036]
                ]
            }
        }, {
            type: "Feature",
            id: "jiang_xi",
            properties: { name: "姹熻タ", cp: [116.0156, 27.29], childNum: 11 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@僻葎么蓺蓹葎處识袁聵援酮蟼贸屁艕篇聸蟿蔀痞艒匹僻@艔蟼么贸艕么么虙史讯聴篇譬譬强@艒虙蓻么蠀@聴僻葋压蓻蓹屁压虘屁虖贸匹训史么虓蓻葋么艔蓾强僻垣僻聸么食匹艒貌葍蟻葎呋蓻蓾屁蔀蓺蓽屁么艕僻艓原艒帽痞貌援蓽么蓻聵么酮匹聹@识僻屁么痞僻么@葎么處讯酮"],
                encodeOffsets: [
                    [117e3, 29025]
                ]
            }
        }, {
            type: "Feature",
            id: "he_nan",
            properties: { name: "娌冲崡", cp: [113.4668, 33.8818], childNum: 17 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@蠁聵處篇虗聵蔀葎蓺@@葌注贸處艑押虙么謫啷⑷兠绰櫰ㄅ幤ㄅ嵠镀┨戁斏溤┨徤澥灯椛櫴翟兤ㄉ櫾狜@僻虙艔么虓蠀葋僻蓺虓么贸艐@蓾僻艐玫虘蟽聴@艔蓽艐么蓾虙僻蓺么么胤蟻贸贸蓻譬@贸屁虓艔僻么贸葎虘么僻贸匹么贸訍蓻艒蓾艓輫帽趽蓺训謫@蔀虖识@蚀譬枚贸虗"],
                encodeOffsets: [
                    [113040, 35416]
                ]
            }
        }, {
            type: "Feature",
            id: "liao_ning",
            properties: { name: "杈藉畞", cp: [122.3438, 41.0889], childNum: 14 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@屁蚀僻么么訑屁么處譬蔀袧處酮呒酮蓽聴蔀蓺虗聴@屁蟼艔虙么痞屁蓽聹么處篇么蟼强屁桐蔀葊屁@@蓻蟼謨么聸贸艐@实蠁蠀譬食枚聸啷ブ兿佈棺蓹蓻@桐啖疈压实蟻聴譬识蠁葊僻虙輬郜贸矢蓾艓训@原垣谉蓻僻屁匹蟼蓻聴蠀识蠁袨"],
                encodeOffsets: [
                    [122131, 42301]
                ]
            }
        }, {
            type: "Feature",
            id: "shan_xi_2",
            properties: { name: "灞辫タ", cp: [112.4121, 37.6611], childNum: 11 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@蓺押帽艑蓺職么葎押聸處謫蠁贸蟼葌虙聴蓽屁蓺@@葊屁艐么葍篇聴压虘虗艐篇虘譬蟻蟻聸贸贸@艒蓻蓻@蓹蓽艔痞蟻屁聸蟻训@蓾蓻强蓽实贸謪压虘虓艐住么@葋蓹@蓾葍虖聴虓譬蠀聴僻么@葌虗馗贸袨贸輮蠁謩虘矢@葌虙识么葊"],
                encodeOffsets: [
                    [113581, 39645]
                ]
            }
        }, {
            type: "Feature",
            id: "an_hui",
            properties: { name: "瀹夊窘", cp: [117.2461, 32.0361], childNum: 17 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@贸處虘艕@屁篇聵讯强蓽虘蠁聴痞实虗聵僻训么贸篇么么蠀蟼聴屁葌蔀艔@虓垣么貌虘匹聴贸葍讯桐僻匹么艔押聹么艔痞聴@聸匹桐僻聴么葋蠀贸@虘僻蓻训实譬篇训聵虘矢贸贸么艔蟻贸@艕痞屁匹艓蟽蓾譬聹@處虓袨蓺虙蟻屁僻葌么蓽蟼么贸馗蓹贸虘屁贸蔀蓻艑@艕蟿聵枚虙屁艑@蔀么艑處贸屁蓹蠁葌"],
                encodeOffsets: [
                    [119431, 34741]
                ]
            }
        }, {
            type: "Feature",
            id: "fu_jian",
            properties: { name: "绂忓缓", cp: [118.3008, 25.9277], childNum: 9 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@處聸贸葋屁討虙聴處蓺屁桐蠁艕屁蓾處艐贸艔蟻聴@艒屁聸貌食蓹贸屁艒虖聵玫蓻僻@屁训僻艒蓹艔贸艐僻么虘蓾蓻食匹@@贸蓻玫@僻虘僻贸葋蓹僻虘聴僻虗@蓺蓹袨僻聴僻蓺贸帽虘艓贸蚀屁聹屁袁蔀葊贸艕蓽葌贸處讯矢么痞僻虗押虙蓺僻押蓽屁葌"],
                encodeOffsets: [
                    [121321, 28981]
                ]
            }
        }, {
            type: "Feature",
            id: "zhe_jiang",
            properties: { name: "娴欐睙", cp: [120.498, 29.0918], childNum: 11 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@讯识屁蓽@虙蠁么贸葌屁聵痞酮@聹虗聵迅虓蟿葌虙虘谞艕诪么篇僻么討虘聸@匹蟻桐屁謪虖@@蠀蓾贸@艐蓻@么譬蓹贸僻训蠀贸@譬蓽艐僻@虓艑僻蔀蠀艔僻酮虓蓹虘聵僻訏么葌虓聹@聵贸蠁虘蓽@艓篇葊"],
                encodeOffsets: [
                    [121051, 30105]
                ]
            }
        }, {
            type: "Feature",
            id: "jiang_su",
            properties: { name: "姹熻嫃", cp: [120.0586, 32.915], childNum: 13 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@么蔀處聵蠁袧么艕蓽艔處葎屁聸枚强屁@么蓽蓺職屁蚀虙么么贸@僻處蓹援葍元喃壝锻┨惼彩迪喥词礍贸趽蓽贸艔蓽强僻聸蓾蟻蟽葋逊處虖聴匹聵贸艕压聸贸艕屁痞训酮么葎痞聵帽虙袁贸@處蓾艕僻葋蟻聵贸蠁譬贸贸么屁讯虖聴匹识蠀聵蓻虙训葊"],
                encodeOffsets: [
                    [119161, 35460]
                ]
            }
        }, {
            type: "Feature",
            id: "chong_qing",
            properties: { name: "閲嶅簡", cp: [107.7539, 30.1904], childNum: 40 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@蓹葌貌蓽屁聵押蓻痞葋虗@篇聴玫艔蠁匹貌葍匹虓僻么蠀虖僻么帽贸贸么蓻艔譬么僻匹么僻贸蠀屁聹虙压么聹痞葍@謨匹蓻虘@@蓽僻贸@蓺僻@帽蠁蟽玫@艓蓾么僻聴@实逊贸僻实贸聵@艓贸艕贸@么葋匹聸贸虙蠀么贸识蓹聵僻葎蟼處僻葌么屁屁屁蠁蓻處艕屁史蔀@蟼援贸艑么么蠁@蓽謭處屁"],
                encodeOffsets: [
                    [111150, 32446]
                ]
            }
        }, {
            type: "Feature",
            id: "ning_xia",
            properties: { name: "瀹佸", cp: [105.9961, 37.3096], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@喟蔡捗崔犗営捪偯雌呏嚿溑嬔好程幦佁嵣汙压住@@实僻葋么贸@强虗艔枚实蓾艐蓻@么虘匹贸贸屁僻聴贸聵么聹贸@譬么贸痞虓聹贸葊屁艓蓻訏么艕蠀酮蓻@@葊蓹@"],
                encodeOffsets: [
                    [106831, 38340]
                ]
            }
        }, {
            type: "Feature",
            id: "hai_nan",
            properties: { name: "娴峰崡", cp: [109.9512, 19.2041], childNum: 18 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@蠁蓽痞识虗么蠁么處@屁艓枚@蟿实痞聵冤郢玫袧虖贸匹葍僻@譬蓹诐屁虘痞@蓼"],
                encodeOffsets: [
                    [111240, 19846]
                ]
            }
        }, {
            type: "Feature",
            id: "tai_wan",
            properties: { name: "鍙版咕", cp: [121.0254, 23.5986], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@么聴譬蓾枚僻蓾训蓹蓿虖蟻譬原贸艒贸酮蟻蔀僻袨么元輬喱ρ渡溙捝�"],
                encodeOffsets: [
                    [124831, 25650]
                ]
            }
        }, {
            type: "Feature",
            id: "bei_jing",
            properties: { name: "鍖椾含", cp: [116.4551, 40.2539], childNum: 19 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@贸贸贸聸蠀贸么匹@艔贸贸蓹@僻艐譬艑蟻贸蓻艕贸识讯蚀匹识處聹么屁蔀@贸艓蓽艑處虓蠁聸僻艐屁实"],
                encodeOffsets: [
                    [120241, 41176]
                ]
            }
        }, {
            type: "Feature",
            id: "tian_jin",
            properties: { name: "澶╂触", cp: [117.4219, 39.4189], childNum: 18 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@么么蓽聴@屁枚蓺么聹么么蓺艔@贸匹@@葋痞僻蓽@贸僻屁匹@聸僻贸蓹袧虖贸逊蓽@艓痞屁贸袨"],
                encodeOffsets: [
                    [119610, 40545]
                ]
            }
        }, {
            type: "Feature",
            id: "shang_hai",
            properties: { name: "涓婃捣", cp: [121.4648, 31.2891], childNum: 19 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@蔀蟼屁聹蓻葊么艕跀蓻贸蠀么虓谉艔虘虙"],
                encodeOffsets: [
                    [123840, 31771]
                ]
            }
        }, {
            type: "Feature",
            id: "xiang_gang",
            properties: { name: "棣欐腐", cp: [114.2578, 22.3242], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@贸蓻譬@蟻@贸聹么葊蓺艓屁@枚@@艒屁@"],
                encodeOffsets: [
                    [117361, 22950]
                ]
            }
        }, {
            type: "Feature",
            id: "ao_men",
            properties: { name: "婢抽棬", cp: [113.5547, 22.1484], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@X聧炉aW膧聞@l聫"],
                encodeOffsets: [
                    [116325, 22697]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/chong_qing_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "500242",
            properties: { name: "閰夐槼鍦熷鏃忚嫍鏃忚嚜娌诲幙", cp: [108.8196, 28.8666], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@XJ掳聹lJX@lbl@XbV@VLnJlxnb職聝UU@IVK@lVIVwnJlU@n@J@L@Jn@l_nWVLVln@@blL職mV@@x聹脭聜`n聹聶xV聜脠Llx聞LVxVV職聝V_U禄VWn_m楼XwVmnX掳聝lmUUVw脼aV聝聛k@a@mmIUa@聶mwk@聶聝m@@U炉a@UV@@K聶聧@ykkmwkV@kU@聝脩聝VkKWL脜amaU聧m@kyU@WkU@Ua聶IUa職聫VaUUmUUa@aVLXKWa炉UUbmJXnWnX`l@@xkzW脝@V聞LU娄聜x@b@JkIkJ@LmbUamJ聛wm@贸x聝nk@V聞@x聞聨VnUVmVU聬V聨UbVlUbkXW聨"],
                encodeOffsets: [
                    [110914, 29695]
                ]
            }
        }, {
            type: "Feature",
            id: "500236",
            properties: { name: "濂夎妭鍘�", cp: [109.3909, 30.9265], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@WVXb聜UnK@x@b聜虏kxmKkl炉_聝VV掳聶VU聬@bnKVVV@@nk聨@n聸bn聜@職掳@VL膶U職@掳WV@V聶nU@InKV聫l@nU聞b聵KnX聞WlknLlKUwnalL職a聞VlUXmWk@UU@UWWIUy姆鹿XaWW@聛X聶聝KUIVm聞U@W@UVU@KV@n禄VkUk脟mUmVIUmULUbm@聝wUa聝Kkkm聫炉脩UL@bWVnx@VmxUI@聞klmkkK@a聝K@IlJ@I炉聝k@mak@mnkJVL@bV@Ub聞聞W`UUUV聶I@V聝U@VVbUJVLUVVbUX聞VVxk娄VJUnVxnVVU職JV@Ubl@@bXV@L"],
                encodeOffsets: [
                    [111781, 31658]
                ]
            }
        }, {
            type: "Feature",
            id: "500238",
            properties: { name: "宸邯鍘�", cp: [109.3359, 31.4813], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@nLWbX聜VLVU聞V@K職IVl@b聞@lb職U聞VnU@J脝U@V@n掳K蘑Ul@Vb脼K職V職@聞_聞V聜KXU聜U@KX聝@wlkkU@mWKUU@U么J@XV@聹aVm脼IVaVL聝聝@禄km聝@聝UkL聶U@aU@WW聝LUUU聶聶Kkb聝wWa@KU@ka聝XmW聴L聝amVk@U聬mL@JmVU職U@炉X聶@膵VUK炉@脜nWK聶LkKULWK@UXK@wW@聶LkV@bVL聝lXn聸`炉xU聞掳Ln聨lV@n掳Lnl"],
                encodeOffsets: [
                    [111488, 32361]
                ]
            }
        }, {
            type: "Feature",
            id: "500234",
            properties: { name: "寮€鍘�", cp: [108.4131, 31.2561], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@n@na聜I聞w職@@VVK聞LVbVxnV脝UnanKW聛XamKmk炉K@mkUm聧炉KV聝掳w聛聛@Wm@UIUUlKUU@a炉KWanwmUXamKk聛U聫WUnU@K聝kUwWKXaWLUWkImaUUU聝聝Kka卤聧k@l聝炉w聶wmbU聝聶聝kXm@UJkIW聜XX聝b聝m聝聞UJ聶XUV@掳職Kl聬職lVX聛V@xmbnV@blV@V職聹U`UL@V聶a@bULlb掳VXb脺職@V@b聝L@J聞xnLVb@lVb@V聛@@z聵bXW職X聞KVLV聜職@@bUVVL@b聞聞lVna@ll@聞zl@@J"],
                encodeOffsets: [
                    [111150, 32434]
                ]
            }
        }, {
            type: "Feature",
            id: "500243",
            properties: { name: "褰按鑻楁棌鍦熷鏃忚嚜娌诲幙", cp: [108.2043, 29.3994], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞Jlb@nVV@bXb@脝lL聞Ul`n聬VKU录VxkbW聞nlUxlXX聜@聬掳掳WnnJ@VUn@J聞k掳L@VlV@nUJ聞x@bVVVz@VnLla聞KnalVlIU聨聞录@nV@@anKUwVal@U聧lJ聹聝lI@akU@UW聫XKVI聜炉Uak@@KmkXW脺kX聧WykIWwXw@聫laXamkVUUym_XmlkkmmakwmIUKU@Wak@kaW@kI炉聸WIk娄V聨聝UU聝maUV@XkVUV卤aUb炉b炉楼m@@ImJ聴@m聝mL@kUKUkkJ聝bV娄"],
                encodeOffsets: [
                    [110408, 29729]
                ]
            }
        }, {
            type: "Feature",
            id: "500235",
            properties: { name: "浜戦槼鍘�", cp: [108.8306, 31.0089], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@lb聞LV聞VVnblJVXXKWbXLVx聞l@LmVXVV聬l聜nLWbnVmxXb掳L@bVVkLVVVJn@@X聜聜聹_Wm聞kUK@alU職KX@@xWL@VXLVKlL職KXL脝m@聶m聛聹a@ml聧@mU@UUmL@aV聫職UU炉聞U掳`lknLlw聛卤@a@wmL聛VWaXU@KWU@ak@VaU@聶IUVmUUwVmUIl楼Uw聝UVWUaVUUKVIUa@UUUUJ聝UUm聶k聝聞nl@聞@VWV@L炉aUb聶Ulx聝@@b@VULUx@VUxVV聶U@bU@mxU聞U@mUV聨klkk聝@Wxknlx聛K@amL聝KU聞聛K"],
                encodeOffsets: [
                    [111016, 31742]
                ]
            }
        }, {
            type: "Feature",
            id: "500101",
            properties: { name: "涓囧窞鍖�", cp: [108.3911, 30.6958], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@母膴VI聞聝聞n聞aWWX聛lJVIn@lW職聞V聞na職x掳xk聞l@虏聨聜LV聝聞LnK@b聜LkwlmXw聞@lllkU聧nVV@V聝nwV@@a職VUUVw@UVwVK@U@a聞@kw職VVa掳b@KXU@U@聝mk聞聝脟脩聛aml聶kUVmn@VULU聵m@kUVkUa聝wUWm@Uw炉聞mKUUmVUUULUKU聞W@XbWVkaWwkUU聶聝聶k@maUbmbVlk娄聝xUVUIWVU聞kJVVkL@UmJ聶UUVU@lLUVU聞lx聞@@聬Vb聝J聶U聶L炉陇@V聝聞"],
                encodeOffsets: [
                    [110464, 31551]
                ]
            }
        }, {
            type: "Feature",
            id: "500229",
            properties: { name: "鍩庡彛鍘�", cp: [108.7756, 31.9098], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@VK@w炉L@m@U脜V@ImV聝U聶Vka聝@@aUk聶J@L聝UUVUKmLmb脜VmUUwUa聝KUL@U聶@聝x聛Jmbm@聛nVJ@X@VkV聜n聶l聝LXx聶@聝b@bUV聝LU`Un聝bU@@聨mVVX@JX@VLVV職klV聴聞聜`@bUL@V聞LVKn@聜U@聞UJkn@lmLmK@X@Jn@mb聞n脼WVXnJ聜k聞K膶脩脝@VK@kna脺mX聛lU膶W掳k么脟脝聛@a@y脼_Vm聝UnU@K"],
                encodeOffsets: [
                    [111893, 32513]
                ]
            }
        }, {
            type: "Feature",
            id: "500116",
            properties: { name: "姹熸触鍖�", cp: [106.2158, 28.9874], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞InWUUlU@LVa職lX@掳虏l脪XxlK@Ul@@Un@UaVJ@I@W@U聝UUVUwVIUKUa聜UU聫Vwn@脺x@XUlnn聜b聹J@楼VklKUUlk@ynU@kV聝UUVWnI@楼V拢VWVIUKU@UV聝a@n@Vm@@n聛lUaVkUw聝J@blLkLW@XWmXkmmLn聶@m@U@UVm@聶聞UV聫UUlakUVa聞聝VkV@@wnaWUk@Vwk聝lmVIkUUxmJ@U聞聶@K聝Ikx卤V@IUm@K@IUKkbWKUbn聞m聞@bmVnbmb@xkxUJ@聬ULW`@bX@WVXL@V聝職炉聞mk炉@UJ@VmLUaWnX@WJ@nkKkxW@UIV@@KkImmkK@UW@XaWIU@U聜聝IkbWb聞xX聨lLVbnV@bWlX@VxVLnl@n脝脼V脺"],
                encodeOffsets: [
                    [108585, 30032]
                ]
            }
        }, {
            type: "Feature",
            id: "500240",
            properties: { name: "鐭虫煴鍦熷鏃忚嚜娌诲幙", cp: [108.2813, 30.1025], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞職@kl@職录UbmVXJ@bV@nxVIVJULVVk@@LWbnJVU@bVbUJ@blLXnWV聴@mbnV聜@V聞聞bn@VJVLnaVanbl@聞職V職lVXxlbXUWaX@V聝UUVwUUVm@I@WmI@a聞mlL聹聶lK@alwnUV@k贸Va聝脻聛k@UlbVK@聶VU聛禄V聫U聛UVWU聝@U`ULkwm@@KmU@knK聝禄V聧kJkUmb聝LkbmK@UUyUU@a聝wm@@XXJ@VVLVVUbVnUJVX@K聞聞k`WXXJWXUbmW@bkL聶Um`Xn聝b@JVL@LU@聶掳VVXKVnUxVLUbmJ"],
                encodeOffsets: [
                    [110588, 30769]
                ]
            }
        }, {
            type: "Feature",
            id: "500237",
            properties: { name: "宸北鍘�", cp: [109.8853, 31.1188], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@kV聝U聶bkKmbVxkLmKkllbV@@LXb聞xla職LV職VV聞KXXV@@b職VlK聞V聞@ln@录掳KXa聞U@Ulw掳JXalIUa聞脻W聧XW@kVU@聝VUVWUUUamU聛w@aVamwn@VUU聝lLXWm拢@w脟膲kKklmLU脪炉聝Wn聶@臒聫卤聛kwma聛Wm录U@@LUV@V@X聝VUnVJ聞LW職@聜XXWb母潞VzXJVXV@@VXlWn"],
                encodeOffsets: [
                    [112399, 31917]
                ]
            }
        }, {
            type: "Feature",
            id: "500102",
            properties: { name: "娑櫟鍖�", cp: [107.3364, 29.6796], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@n猫Vbl臇VVnL職聨聞@職x聜V聞n@n職J@L聞UVVX@lbUJV@@nn@VVVK@z聞聵V@nzVJVUlmX@@_VVVbnaVal@@knW@wna聝聧VK@aVI聞J@拢kUVW@聧聜wXUVJ聞am聝@Ik聝聝聝聝_X楼聝@WwkKkwm聨聶職聝kUx聝n脜mm楼聶聛聛WV聧@Um@UlVL@JU@@X聝@UVkKVk聶KVk聶Kkb@bmJVXU聞VVUbU@@`W_UV炉b"],
                encodeOffsets: [
                    [109508, 30207]
                ]
            }
        }, {
            type: "Feature",
            id: "500230",
            properties: { name: "涓伴兘鍘�", cp: [107.8418, 29.9048], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@脼猫@XUK@LlV@blbUJ@聞聞V@bnV聜聬@VVVXU@聝lbXal@VXnKV@maXU脼聝@amk@aVKXV聜anb職拢掳mnIVaUKVwUmWLUU職炉V@@KUK@I聞aWmn_職VlK@anXVaXWWIXWl_聝聝@LUWVIUmVaUUUK@UWI@Wn@VI@mkU@U炉K聝l@ImV脜L聝wU陇贸bUU@wW聫Xkmm@LU@@VUIWVUL@JUn聝a聝x@Jn聞聝bUIWV聛x@聨UXlV@陇聝IUJ@bUL聞聨mb@xmX@lk@UbmbUaUU@`W@kn"],
                encodeOffsets: [
                    [110048, 30713]
                ]
            }
        }, {
            type: "Feature",
            id: "500232",
            properties: { name: "姝﹂殕鍘�", cp: [107.655, 29.35], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@l聞聞w聞bVm@IVKXUVJ@UV@@KnnWlX聬@xVV么aV拢聞x脝KnUVm@UmIXm炉炉@聫W聛kWVwmkX聝laUwV禄ULm聫k_聝VkK@脜Wa@aUU@mka聝I聝b@聜n录聝nm聜聛_@mmK@U聝LUV聛VmI@aUJ@XWJ@聬U`UIkm卤kk@@lULmUmKUnV職nlUVmI@VkVlx聶bkI聝VmLUxkKU聨聜X職聜n娄脝n聞mVw聞l職聶n聧lxlLXx聞@W娄聞`聞聞"],
                encodeOffsets: [
                    [110262, 30291]
                ]
            }
        }, {
            type: "Feature",
            id: "500119",
            properties: { name: "鍗楀窛鍖�", cp: [107.1716, 29.1302], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@V職UbVJVUn@VLX@WVXVVI@VUVWxU@m職@膴X@@录V聬掳aVUX`@_V@VaUUV聝UWnI@ala職LUl職LUllLVU聞@@WV@@IUKVkn@@VlLVwnK聞UlJ職akwlU@UnJVUmkU聶VmXa@wVK@UUw聶@V聝VI@ak聝@alInwlKXUmaUW@wWLk聶聶KVak_脟aU聝聝V@職Xb聝LVxUlWIk@UK@V聶@聝kU@VbUVUlVn聝LUV@lVXmxkV@L@V@Vk@WbUwmL@JUI@xVxkx"],
                encodeOffsets: [
                    [109463, 29830]
                ]
            }
        }, {
            type: "Feature",
            id: "500241",
            properties: { name: "绉€灞卞湡瀹舵棌鑻楁棌鑷不鍘�", cp: [109.0173, 28.5205], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@XlV@lzn@V聨nb脝bXKlL聞U聞脪V@@llUnxll@z職聨@LU@@V掳b@Vn@職聞l@V脩U聝nK@U職U@aUa聝kVm@K炉w聝klmnn聞Ul`nI@almkIUwmWVkUa聝kkJmUUa@K@aU@@_m@@wUyVUUa@Um聝@a聛wl聛@Wka卤聞UkUykIWV聶b@bUVk@聸aU@UXU聜UIWakUWmUxUV@nUVWb職聨@XXVV聨mXX聨@V聝bVLkVWx"],
                encodeOffsets: [
                    [111330, 29183]
                ]
            }
        }, {
            type: "Feature",
            id: "500114",
            properties: { name: "榛旀睙鍖�", cp: [108.7207, 29.4708], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@VX@V@LV@VJUL@lVnnxlb@VXV聜XV@@W聞@UIVK@kUKna@拢VWUaVUUalIVJVIUW聞_lm@bXKV@mn@J聞UUw@KnIVll@VanLVmUkVKXLVKUIVamw@聫UaU_lw聞KlwUWV_Ua@aUa@KU聛職wm聸聛_聸脫@wU@聶nkK@am@UkUKmXk`m@@I@K@I@mkVmIUxUJ@kUL@JVV聶聞lnklWnn`VzUVnlWbkb@聬WxXxlJXzW聨脹lWXnl@Ll@Vb聛掳UJWLX聬@VlV@bkJ"],
                encodeOffsets: [
                    [111106, 30420]
                ]
            }
        }, {
            type: "Feature",
            id: "500117",
            properties: { name: "鍚堝窛鍖�", cp: [106.3257, 30.108], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@XKVXlK聞聝VL@UnV@aValXXK聞U@WVwUaVU@IV@@aVW聞L@U@anVV@@bVK@UVL@bnJWL@VnUnb聵@@JnIlV聛l聜@@bXIWbn@UKVLVKXLlaV@VVnK@bVL聞m聞IV聝@KmknUUWVI@aVJ@_聞WU_VmUw聝U@K聶聝Va聛k@am炉mJU_UJUkU@W聫kIV`UI@JV聬@LmmU@@m聝bUz脜聸聶聧@聞VK@nUK聝聞聝b聶akb@UWK@bkVVbV聞脹@@`聝Xk@W聨@n@lXL@bmb@VVJUn@JnUlnUlmX@`XLlbkJW@kzlb@`@b@b"],
                encodeOffsets: [
                    [108529, 31101]
                ]
            }
        }, {
            type: "Feature",
            id: "500222",
            properties: { name: "缍︽睙鍘�", cp: [106.6553, 28.8171], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@娄聜@X聞lVX@@UVKl聞VUX@lanVlUVbXWVXV聝聞VVUnKVUlwUwU@UJ@nmVkUV聶lwXam@VaUUUw@W@kk禄mV@UmKkwVKVUU@@LUKVI@mV@XVWxnXVKUUUK@wWU@UUWnUlLXa聜mUI聞am聫@w聛I@K@amIm聜UUkI@m聜akUkKWUUan聝@w聝amLVxk@UVmUUL@Vm@kV@I@ak@@bWVXJlLVbVL@職@bn@@`Un聞@WbUKULWVXb聝@UVmbX聞WV聝b@b聛VmxUKU聬聝V@職Un@V@V@nm職nKlnnWWXX@lKkK@a聞IVxUlVb聜k@mn@@U@m聞bVUV@VLUJUXU陇"],
                encodeOffsets: [
                    [109137, 29779]
                ]
            }
        }, {
            type: "Feature",
            id: "500233",
            properties: { name: "蹇犲幙", cp: [107.8967, 30.3223], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@VL脼膴聞U@W職聛@录V聜聞@lk@w虏ml職VU聹聞ll職VnI@VlKUUlIV聝XUVJVU聞wl楼UkUKUIm@聝aU聝聛@mUna聵@XUWmkK@aVIUa@aUVmIXa@Kl@UUVKUIUJmwU@@aWInUVa聶禄k@@l聝聶炉n聶陇ma聛bWUUL@bnl@b脻聞WVnbU@mLUWk@Wbka@聞WVUU@U聛聫mUmVkUULV聞lVUx聞l@L@V聝b脠脪lb"],
                encodeOffsets: [
                    [110239, 31146]
                ]
            }
        }, {
            type: "Feature",
            id: "500228",
            properties: { name: "姊佸钩鍘�", cp: [107.7429, 30.6519], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@XLV@VV@b掳掳n職聝nkb@b聝職nJWVXblIUV職xWnUJnVVLVU聞JlUnLVK@UnUVJ職虏nKVbVKla@aX聛lJ聞k聞Klb聞聝@U掳拢職K職V聞IUa@聫聝@kwV聝VUkKV@VUkk聸聝UVk聶卤n@xkl聝@U聛@禄聶聜@X聝V脻膲UJnxWb聛@UX聸KkVUbUKWUkVmkkLU`聸b"],
                encodeOffsets: [
                    [109980, 31247]
                ]
            }
        }, {
            type: "Feature",
            id: "500113",
            properties: { name: "宸村崡鍖�", cp: [106.7322, 29.4214], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@nxnVlJlUXL聝娄@x@Vl@nKVVX@V_V@@KlVXU聞@lKlxXIl@脠膴@Vl@n_VJl聨n聬Vlnb聞虏VVVJV聛VmUUk臅Uam莽U聫@禄W@@膲n聶V@XwVU@UUJWUXUW@UKm@UVUIVaU聶UVmLUV聝UU聞UWWXUakVmUkbW@UVk聝UL@VW@kUW聝聛@mJUXVVU聞@lmV@zklVVkLUl@娄聸I"],
                encodeOffsets: [
                    [108990, 30061]
                ]
            }
        }, {
            type: "Feature",
            id: "500223",
            properties: { name: "娼煎崡鍘�", cp: [105.7764, 30.1135], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@a@a@_kalyX@lIkaWK@_nWVkkmmV@IVmUI@Una@aWK@k@mkbWaknmJUk@mk@@kUal@Ua職@Wa@aXLlwUKlkk聝@KmI@VUJ@Lk@@VUUmL@amJU拢kKUaWakLmU@bVVUbnbWV@xkL@bUb聜xUxVbXJVbUVWIUVU@kLWxkKWV@n炉VUbU@@VVX@VmaUL@VUK@VVbn@lVnI聜@@lnLULm@Ub@聨l@na聞@lK@XVVkJ@b@zl@@VnV@bVb@J@bnXV`lXXmVI@W@InbV@@aVKUblKVLUanLlmnLlK"],
                encodeOffsets: [
                    [108529, 31101]
                ]
            }
        }, {
            type: "Feature",
            id: "500118",
            properties: { name: "姘稿窛鍖�", cp: [105.8643, 29.2566], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@b脺聞nWVLX聞lxV聞VxXxlVn@@bVblK@a@UnLVJV@@UnLVU@VXaVKVX職@n`W聧U每@IUKlaUUUkWyU脹脜脻@mmkUKUwW@Xk@amUUakKW聧聝wXa聝K@VVLkl聝XVlkxV聞UL@bm@Vxn`聝IVxUVkLV職U職l@@lkXmm聝VUn@VV@Xb"],
                encodeOffsets: [
                    [108192, 30038]
                ]
            }
        }, {
            type: "Feature",
            id: "500231",
            properties: { name: "鍨睙鍘�", cp: [107.4573, 30.2454], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@職膴掳陇n脪聵录聹aV_lKnllUXVVLValU聹LVW聜@XamwVIUKka脟脩聞a@U@K聝kVwkUU聝VKlVnU@a聝U@聝VIka@akU@KVL@W脻莽UV@Vmb脜炉@L聶K聝nnJW聞聝VkxlL@VX@VxmnXVWxUb@bkn"],
                encodeOffsets: [
                    [109812, 30961]
                ]
            }
        }, {
            type: "Feature",
            id: "500112",
            properties: { name: "娓濆寳鍖�", cp: [106.7212, 29.8499], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@bVVXL聜a@lnbWn@L聞@XVlK@VVLUVlbkLUKVVVL@V職nX聜VL@VV@UbVb@x@娄UxVb@bUJ聝L@L聞VVxlK@聶nk@U@W聞UVLlKXV聞@VblU@UUKVU@wn@VJVanLlkX@VaVK聶炉@a@U@U@聝VaUK聞kUU聝卤maUkm@UUkbm@@Vk@@J聝wU@Ub@I@JmwUL@a聝@@KkV脟Lk聝Wk聝@kUU@@xUVmKUnllUb"],
                encodeOffsets: [
                    [109013, 30381]
                ]
            }
        }, {
            type: "Feature",
            id: "500115",
            properties: { name: "闀垮鍖�", cp: [107.1606, 29.9762], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@VV職U聞bX聜lX聞楼l@XnVmlxUx聞@@blVnn么膧lm@aVaXwWUnmUwW@@UkKlw聞UX聝mI聞m職L@K脝掳na@UUImyU@聝聴@yULUUm@@mU@VIkaW@UU聝V@K聶I@m聝m聛U聶w聝@聶聧mKUnU聜UI聝lVLUb@聞@V@V@b職掳ULUbW@klmKUbUIm@@xUVVL"],
                encodeOffsets: [
                    [109429, 30747]
                ]
            }
        }, {
            type: "Feature",
            id: "500225",
            properties: { name: "澶ц冻鍘�", cp: [105.7544, 29.6136], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@XUmaVaUU@anVlKXbValU@aV@@IXK職@@bV@VxVK@UXLlU職JXa@_聜@@aVK聴脜WVkwWa聛聝聝wUa@am@kUWLU@kWmX@ykI@W@UV@na@LlLV@U聝kwW聝UKmXX`mIVl@bXLWVkbkk聝x@`VXm@@J@U@UUKUxk@WbUIVl@VXLW聞聝JUkUlUImxXlmb@X@VUJUnVb職W@UV@@VVX@bnW@LVxUnlJUV@n聞@VxVIn@l`聞UVVVL"],
                encodeOffsets: [
                    [108270, 30578]
                ]
            }
        }, {
            type: "Feature",
            id: "500224",
            properties: { name: "閾滄鍘�", cp: [106.0291, 29.8059], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@VblLV陇nI@bnKVV@Ul@@KVI@UnJ@Ll聞klVLkxWK@bXb聶@Vbk@Vb@ll@@nVlnIlmXblaX聧l@聞W@_脺@U聝UalU@aXL@Vla職b聞a聞聝VL@mUL@聝UU聝聝脟聧XUW聸X_Wa聝聝U聝聛禄m_聶@UWULWb@UUVmK@VU@UImK@V@bkL聞x聜聞XblxXU聵脝UL@b聛@@`Wb聶IkVWK@VULUwU@@a聶@WL@JU@@bkVUb"],
                encodeOffsets: [
                    [108316, 30527]
                ]
            }
        }, {
            type: "Feature",
            id: "500226",
            properties: { name: "鑽ｆ槍鍘�", cp: [105.5127, 29.4708], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@VI@U@WnaWknwVJVkVl聞IX聝WK@UUkVJXal@VwVL@V@V@In@UW@_聞wlllaXUWK@aUknJW_脹聝@aWaU@@UVm聞UUaUImJVn脜UmV聛Um`kUUVWLnVU@VVmX聝K@聞nxm聨ULkx聶ImJ@nU`@X@Vkn@`@nlV@nVJVaX聞VLnK@bVV@nV@lbXW職@"],
                encodeOffsets: [
                    [108012, 30392]
                ]
            }
        }, {
            type: "Feature",
            id: "500227",
            properties: { name: "鐠у北鍘�", cp: [106.2048, 29.5807], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@XzVlVVkbVL@JV膧X聨聜录V聞聞聞XbW`X聹WV脠聨聞聞VV職聨VkV@@UXa@alK@I聝聝U@UKW聛UyUI@wVUUWVak@VUk聝W鹿@WXI@yVIUK@kWwk脩炉卤W@聶kUb@KkVVVmX聝J"],
                encodeOffsets: [
                    [108585, 30032]
                ]
            }
        }, {
            type: "Feature",
            id: "500109",
            properties: { name: "鍖楃鍖�", cp: [106.5674, 29.8883], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@X聜VLV@聞聞@JkL@bWb@VU@Ul脝聹Vy聞a@nV@nn@KU聫@IVJU_lJX聬V@VlVIV`nIn掳@b聜lUb職聞聞KVI@aUaVw@楼@wUaVaU@@UUKW聛聶m@UUKUUVLlKkaVUUK@UkLWU聝@@KXmma@k聛bWKUU@aUamLn脼@VWLk@@Wm@ULU@@U聶KUVWI"],
                encodeOffsets: [
                    [108855, 30449]
                ]
            }
        }, {
            type: "Feature",
            id: "500110",
            properties: { name: "涓囩洓鍖�", cp: [106.908, 28.9325], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@VIV@@wVJ@InKVxXal@@U@U@KlUnwUW@kVU聞KUmVkUa@I@KW@@bk@@m聝U@m@k@a@a聝IUxmJk@聝wUL聝wkKmVVX@VXV@xVLVVULmWXwWUU@@nUJVL@KV@UVULlxnL@VnUl录@l@XVxVVUbn@WbkxU職lVnU@m"],
                encodeOffsets: [
                    [109452, 29779]
                ]
            }
        }, {
            type: "Feature",
            id: "500107",
            properties: { name: "涔濋緳鍧″尯", cp: [106.3586, 29.4049], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@XK聜L@V職@XbV@lW@UV@@VXIV@U聶VKlL@Kn聬nJ@VV@VU@I聞@@mVUVWUUmL@V炉LUK@UV@UU@a@U@yU@WLUK@X@KUVmL@聝@aXI@w@ammVk@W脹wm@UxV聬聛VVbVLUJVxVU聞V@V@X@JUIVbm@@Vk@@VkL@lVLUJ@zWJ@X"],
                encodeOffsets: [
                    [108799, 30241]
                ]
            }
        }, {
            type: "Feature",
            id: "500106",
            properties: { name: "娌欏潽鍧濆尯", cp: [106.3696, 29.6191], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@X潞l聞UVl@UbVXUV@xVJVzXJVU職L@VV@VKn@@Xl@XK@Um脻nKVbVakkVm@k聞聝UK@UmIm聫@LkKULV職U@WJ@UU@@VkXU@Wa聶@@U聛KWL"],
                encodeOffsets: [
                    [108799, 30241]
                ]
            }
        }, {
            type: "Feature",
            id: "500108",
            properties: { name: "鍗楀哺鍖�", cp: [106.6663, 29.5367], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@VV聞JVL@bUVVnl`XIlwXJlw掳nnl聜IXW@U脟膲k@WJkwkL聝@WVkU@LU@U`W@UXUV@n"],
                encodeOffsets: [
                    [109092, 30241]
                ]
            }
        }, {
            type: "Feature",
            id: "500105",
            properties: { name: "姹熷寳鍖�", cp: [106.8311, 29.6191], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@nLVU@wV@lV聞@Xll聞脠KlU@L聞@@bVKnx@I@JVaV@聞x@Il@@Un@laVVn@m聫k聧UIm`k@WX聛Jmk炉mkxWIkxWJk_UmVUUK聝@UU聶@聝聞@l"],
                encodeOffsets: [
                    [109013, 30319]
                ]
            }
        }, {
            type: "Feature",
            id: "500104",
            properties: { name: "澶ф浮鍙ｅ尯", cp: [106.4905, 29.4214], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@k@@U@w聞楼WKkVkImUmw聛a@b@xWJ@b@聞nKVU@L@WVLXKV@@z@V@bVVU@@VVL掳K@U"],
                encodeOffsets: [
                    [109080, 30190]
                ]
            }
        }, {
            type: "Feature",
            id: "500111",
            properties: { name: "鍙屾ˉ鍖�", cp: [105.7874, 29.4928], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@WwUwU@kK@KmbU@@V@XlJ@znWlXV@XK"],
                encodeOffsets: [
                    [108372, 30235]
                ]
            }
        }, {
            type: "Feature",
            id: "500103",
            properties: { name: "娓濅腑鍖�", cp: [106.5344, 29.5477], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@VL職@VV聞@VL@aUK聝IUU聝@@JUVU@"],
                encodeOffsets: [
                    [109036, 30257]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/fu_jian_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "3507",
            properties: { name: "鍗楀钩甯�", cp: [118.136, 27.2845], childNum: 10 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@kny聝k@聧聝KU楼職wV@nk聝W聝zUmk@@聧lKUa@aVI@U聝KUamKUUVaUI聛聜@X聝@UV@K卤IUVVlUbUbUL@KWUXmWk@KkXmmk脜聝KU聝聶a@amU聝bkUkKWUnwU聝脟wV聶UU聝脻UKV拢U聶@聝nKWwXLVKm楼@wUXkmWk@聝@wX@lU聞@職yVImaXwV聝聝@k聨聝nU@mbk@mlUX聝mU@mV@n@bnW@bUIWJ聴ImVUKWbUK@nkK聝aU@W_聛VUUmWmL@UU@聶bUWUL@V@bmVUz@`mUUVVbXL@V聶L@lmLUxmV聛amXkW@xWbU聞VbUxkU卤@脜UmmkLUbW@@`kLknVlV@lbXxlVUXVV聶聨U聞U@UbW聨kIWVUUUJkI@llbUxVL@V聶V聝UU掳ULUmWXUV@VULWb聛@聶xm@UaVLVKUa@聝聛w@V聸bk聬mV聛ambUUm@@VkK@聞@b聞xlxX@聜聞n陇@X聝@@lkLWV@聨n聞V聞kb@bWJXLWx@nkxmm聶bXn@VWVUn@VnJ@bVXl@聞聶VJXnWbX`lL聞UlJVI@聨聹@VXV@Vl@bn@@脝mn@V職xXU@mVIlx職V職職nI聞l@nVJ聜aXI@mlU@aXkVm掳klmnVV_na職掳@V@x脺娄XK聞V聜nnUlVXbVK聜LXKV@naV@@聬VVl@@lXblX職WnLlbVK虏n職@@聜VLUnlV@l聝X聛x么掳聜V@UnaUUlKXLVUVVUbVVlUnJVX聞@VW@an@lb聞@n聬l@VU@an聝職UVW@k聝aUm@InVVKVU@聧kUW@Uam@km@kVa@a@聶nw職U@WlI@mVI@WXaW_n聝@聶n聝lkkW@U聜楼@kV@Uw@wU聫聝@@IXK聜楼VIn@nU@`@Xl@VV聞Lna職W聜bVaUwnU聞@VI職KlV"],
                encodeOffsets: [
                    [122119, 28086]
                ]
            }
        }, {
            type: "Feature",
            id: "3504",
            properties: { name: "涓夋槑甯�", cp: [117.5317, 26.3013], childNum: 11 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@lL@Un@VVna聜bnUl聫聹a@U聜x@聞VbULUKVbn@職w聜@XaVK@UVUXWVnVKV炉聞V職U@UUKVwka@klJVIVVXUlJX聧VaV@V聝職聧UUVWkUWwkaU@UklmlK@_X@ValKnn脝V虏@lVVwUaV聝Xa@wlXnW聜bnUVwnK@k職K@UWKUaVUnV@_VynU@a@UVKVX職aV@@VnKnXVV聜UX`V@聞blL@mVLXaVLnU聵JXIVJ@amX@a@mnUV@聞nVWnkl@naV@聞ml聧聞@@Km聛聛KUam@UU@聝@UlKU聶Vk聶U聶K@aVaUwV聶U楼UIkJ@wmI@聜mbkwkVW@UX聝KULU`聶IVKUa@L聝kkVmUU@WlULUW脜U@I@聝WW聶nU@@w@a@聝Uam_XyVIVWkk聝@mwVKXUV@nw聵VXkW聝脜聶U@聝a聝U炉KUn聝K@聝炉職mU聝LX聨VLnWVbVbUVm@Ub炉录W@聛am聬聝`kb聶amLUUU聝聶aUXV`@x@XmJ@n@L@xkJUU@kU@mWm@kUUwUUVWl@VUkI聝y@kkaVUUm聶IWVXbWxU@k聞mVkK@nWVX娄WxU@@bkx@VU@W聨k@聶kUbmJUUmkUW@_kKWK聝@knV陇kIUKWLUbV聜聛@Wbk@@VWL@VkI@lUXVxUVU@@mWI聝V@a炉nUa聝aUV@聞聝J聶b@b脼掳VbU職@X聶aUVmL@聜VX聛bl聨nV聞掳聵n@Vnx聞@VUUUlK@InJVb@聞Vlnn@V聶L@VWJU聞聛x@XlJUVV聬Vl@LUUUJ@L聝聞@lUL掳娄k聵V聞VnV@聞xV聞聞l@blLnl職LVaXll@職nVUn@聜xn@nml聬掳聜X@lb"],
                encodeOffsets: [
                    [119858, 27754]
                ]
            }
        }, {
            type: "Feature",
            id: "3508",
            properties: { name: "榫欏博甯�", cp: [116.8066, 25.2026], childNum: 7 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@職a聞I@聝VU聞bVb掳m@b聞UXJ@nV@VUUwVW@klJ@UXK@Ul@Xa聜@U聛VaXKVLlJU拢lm聞@XLlL@`VXnlVVnIVa職ll@X聧V@@Ulw@aV@XwW楼XU@mlLnUl聝V@XwWaXU職JVnUVlb@l聞zlJUVk@UXVVVxlVn@nXV@@lVVlI@w@K@mnI@W@wU_VW職bV聞VVnK職bla聞_n聫聜bX@掳禄Van@VUUaUamXUKW聧聞K@a@Uk聝@wWkX聝WW@wUU聶K聛w@_ly聝wUkU@@U聝@kamVm聝Xa職UVUka@聫Wk@禄UUUV聝KkbWU聶VUbk@mk聝xk聝聝KnIVUmW@kUKmXUmVaU@kU@聫m聛@K聛UWVkIWJ@聨U@UI@wUUUa@KW禄nU@mVkUmm@XwWU@聝UUmL聛@聝w@mn聝V聧UU@aWak@@amxU@UxULWVXbVLU`mbUImVU聞聝bn聜V@@bVn@bnVWx聛LmyUb聝IUK聝@聛a聝Vm聛聶akbV聜UXW聞Ul聛KWbkV@聞WLUlk@@n職b聝b@lkKmU@聝UIWJkw炉UUVVxm@@XkbWx聴聫聸X聛K聝lUzWJkUUL@bmKkV聝@@VUIUlWV@X聞K@VkbWx掳xUb@LUbk@@VWb@LXJ@VWXU@@bUVV聞VVn@VVlLn聞@l聞@聜xk娄Vx@bVJXb聝n@JlnXxV@@聞nJ@X@V@lmx聞bUn@xVL@VVKlL@l聞聞nLVaVL@xkl@L聝xVl掳職聞X聞WVX聞Vl聞聹JW聬nxlJ"],
                encodeOffsets: [
                    [119194, 26657]
                ]
            }
        }, {
            type: "Feature",
            id: "3509",
            properties: { name: "瀹佸痉甯�", cp: [119.6521, 26.9824], childNum: 9 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@LVKVaVaUkVU虏J@LVU聞@@W聜聛VJUbVVnLVb聞L@VUJ@bVbkL@聨l@Vn聞y聞XmlU@聶xV娄聞L@聨聞lmz@lnL@bVV職bVb@l聞n職KVk聞Vl陇@zXV@職l@XJVLVKnXVK聜VnU@wUm@聛職KU聝@UlVlw@U@U@聝UaUKlU@kXKlmXIWKXaVIVUVK@KU@@k聞JVUnLVJUL@V聜IVa@VnL職KUnl`Vb聞V聞聛V@職聜Vbn@Vzn@lKnVlI聞VVKUalkXJl@XXVWVLVUUmVU@Unm聞拢lK@Uk@WUXK@U@WVwVk職聝臓k蘑脟掳aU脜Uwma牛聝杀U脟a聶w聞卤V鹿XalK么x聞@聞UVa脺蕮涂V贸b脜L聝Jm聞炉Vk娄聝聨k@mamXkKU聝UL聸akbk@mV@LkJWb@Vk聞mXk@UVmaUV@amLUKUamI@KUaU@WbU@UUU聝UIWJUkm@聛職聝w聶Kk聞VJm@kx脟聛V聝UK聛@mUVUkmlkkVm@聛amw聝LVWU@UbVLk職Ub聝@V聝mK@聛XaVWU_VJnwV@@kUmWakx聝@kwWakIWxnbUJ聶z聝@kVW@@x@聞XllnVW@xn娄ULWKXxmL@聞V職U陇VL聞脼VVU職脠xV聞mxXVlLlV聞anV@b職bV聞聞Ll脝nnlW@LXlWnXV"],
                encodeOffsets: [
                    [121816, 27816]
                ]
            }
        }, {
            type: "Feature",
            id: "3501",
            properties: { name: "绂忓窞甯�", cp: [119.4543, 25.9222], childNum: 9 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@lxna@聛nJ@xlIVJV娄U職VxUb@b職L職VUlV職kL@V@聞VVn@Vb聜Ln聜@LU聞lJXblx聞@lwXbVn@lU@mxUIV`UXWb@聜nLU聞聞@Val聶UKVaV@UX聞Knx聜bn@lUkllnUVnV聜@VLU聞脠聜lwn@UIl聝職L聞x聜聶n@VlXIVJV聞VVV@XaV@Vb@LnJVbVLnK@bVUnbVUl@nWl聝@UXalI@KnUl@la聹bVKV聞lLnWnbl@聞聧l楼掳Un聝聞I脝K么a蝷U聞a@UUw脟W菗IUWU脜Vk屁m@聝@拢@KmLU陇UL耍J聶kU聝V菬UU姆@膲V聝KUk@脩掳w么脟職莽@墨職茅@脜牛楼m墨脹km录脜@聝V姆V贸掳艒娄U掳聝n@bVJXVVL@bU聨聝akLmx@xmxXzW`XbWnXV@bWL脹@聶a聝@聝aXbWVka脻wU@ml聛聛WKkLWWkLUKULW@kVmVUU脻聛UamV聴陇聸n@xUVUzkJV娄lJU聞"],
                encodeOffsets: [
                    [121253, 26511]
                ]
            }
        }, {
            type: "Feature",
            id: "3506",
            properties: { name: "婕冲窞甯�", cp: [117.5757, 24.3732], childNum: 10 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@bl@Xb@bVVU聨m聞@n聞x聜@nKVV@聞XVWxn@VnUl@nmVX录@LVbVV@xVJV@@聧XIlJXU聜V@Ln聜@聬lVV@UbVnnWVL@lnXUVmJ聞Ll聞聞wnll@Va職UXVla聞LVUVV@录Xl@聬lbUV聶VWbn聞nUlb聞@@VV@聞aVU職ml聧Ua職Uny@kU@Wkk@WaUVk@@ammk@@U@UlU@aUa@wl@職mXLllnL聜U@anVnU@L@VVV@KlXnWVnVanU職w@w@wm聸n脜@w聝aUam@Uk聞mU聧l@@a聞a@U@楼職k么K聜w脠炉掳w@呕kw菚a聛K聸脩脹k@臅艒艡膵拢牡聝UKW禄k脜呕LU@Ul摹w@陇Vz聶VUbkKUbmLmlULU录UxmbXl@bWV聝b@bUnV聜U職VbULU@@VkbVL@`U@WX@聨XV@b掳聞@b炉職@陇@Xm@@b@`U聞VVUL"],
                encodeOffsets: [
                    [119712, 24953]
                ]
            }
        }, {
            type: "Feature",
            id: "3505",
            properties: { name: "娉夊窞甯�", cp: [118.3228, 25.1147], childNum: 9 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@Vl聞xkz@`聜x職LVV@xXXW聞Xl@xl聞@V@bnV掳聶@聞聞LVm掳L聞V聞bV@脝職X聞Wl聴UmxU@WVULnx聞@llUXUJWzn`Vb@聞@b@xV@職mXX@聞@J脝VVXVKXkV@nVlU聞l@KVbUL職JV_VK聞LVWX@lUV聝kIU楼lIVyVU@w聹m聵拢nUVWU聛@a聝m@U聛mWw@UX@@am聶VUn@@aUUlUVanaWUXWmUnk職K@V職UlVVUUw職@XLWWX聶ma@knm聜bVb聞VXbVL聜@XJlInl職L聞w聵mX贸職w@莽V禄脟莽艐a姆僻贸茀贸K摹掳n脜U姆茟U脟W@聴炉x脟掳枚脝l聬V聞n@ll職a職@聞L職b聝`聶@聶聞V職XV聝聬Vx@V@bULVJU聬k聜脟@聝录聝XUKk@mmULkaWbk@聝x@UkL@a@K@U@UmKmbU@kV@UmVUbUmmXkW@LUU@U@KmVmU@b聛VmKkkWK聶nk@@xVb@bkV@V@Vl@nn@bl@VUXbl@XlV@@lmz聶VVbk聨聶nUV聝b"],
                encodeOffsets: [
                    [120398, 25797]
                ]
            }
        }, {
            type: "Feature",
            id: "3503",
            properties: { name: "鑾嗙敯甯�", cp: [119.0918, 25.3455], childNum: 2 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@Vb脼聜VVnUlUX@VKVLlKXXlKXL聜聜nkV@脼xlbXUWa聞b聞@職b脺@XK@aWUXmWaX_Wynw@wnwlK聞bV聧@aUKWUUI@a聞mV炉艓楼么炉母U聞U脝@n禄炉a瓶茅@牛炉n膲默脻K聶贸贸@聶脩U录@猫聶xW么聴n聝x聶KmkkJWI聛@UKWa聝UUa聛amn@lnbW職XXWK聶@VxUVkU聶V@U聶LmlnVWXXVmbUbkVVV@bm@UVn職@bW@@VXx聜n@V聞n@bV聜UX"],
                encodeOffsets: [
                    [121388, 26264]
                ]
            }
        }, {
            type: "Feature",
            id: "3502",
            properties: { name: "鍘﹂棬甯�", cp: [118.1689, 24.6478], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@VlUV@nanL@V@V@L@blK@V聞wl@XalbVKnnl@VL聞W聞禄脠@l聛V聫UIVK@a@UUw聞聫WUU聶職聝職@聞_聶a聝K聶@聶bkkm@U聝k聫玫脜聛x贸L聶l@娄@V聝b@bk@V聨聝nVln@Vb聞b@xm脝n聹@x@x聶x"],
                encodeOffsets: [
                    [120747, 25465]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/gan_su_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "6209",
            properties: { name: "閰掓硥甯�", cp: [96.2622, 40.4517], childNum: 8 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@脟n脜a膲@聝U炉楼聸U殴聜聝拢聶WU媒UU卤JkkUw聜y脼I膶x膴臅膴炉職楼脝Uk牛聶U脜脫卤录聶IUx炉U聝脪茟聜脻聬脜掳聝K脻n臒掳脜U@聨聝@Vn@镁職录炉職Wn艓掳XLWlnVnbWn聝VXxmb聝a聴b贸U聝l菚UUa聶IUmlU聶聝職楼聶k聝楼膲wkk聝脻蓻a@炉聶聶U炉掳mV聝k聧V聧nKl聝艒脩脟脩U@kl聶U摹聨kU呕nUW聶@職炉聝聧k禄職聧mWV拢UKnU聝mUw聜w@聝UIVaX聶職wm禄脠mmwn炉膵聶炉L膲聨U聧聝JUal聧ka卤V聛a@U聜k@聝脹脩聞炉Wmn聧Ua蓾陇脹聛m聝n聧炉m卤x@w贸x脹L摹脪Ux炉V聝脠聶JUb贸z脻聝脟K膲炉艒l脻U脜聨W聬聛l炉n钮b脻@炉聫签L摹聧mV@脝炉蘑k脝m聬聶膴kV钮L蓛m脻X贸掳@聞蘑bV聨贸V脻娄杀@僻a摹聞UV聞臓脟脠V录UV牛wmb聛J脟w藡a聶Xm脟炉Kkkm聨聝bX職m录V录乾艢虏陇么虐脝拼么虗扭仟n蓡莹录蓡L脝艂U膴職x艓茷葮菙藥乾仟n屁女乾枚掳禄職摹聞聧聞脼脺脝母脪膴聞莯b凭猫么脠@录炉镁扭母僻掳V膧炉b@l脠膴聜職薁艅虗聞葮K莯聨植啷椗Ｃ壳暶紷聫蕣菗屁贸脝脩菛艃么w@螊蕡茊脜脠VV膴V聞贸膴脜@脼茠默V@脼墨職@掳聨聞V@母蘑聝掳X蟿茰臓@脠a脺楼艕茀聜聶n臒贸臅V摹U暖瓶艐聴臅聝a卤V聴U钮脟臒脩"],
                encodeOffsets: [
                    [101892, 40821]
                ]
            }
        }, {
            type: "Feature",
            id: "6207",
            properties: { name: "寮犳帠甯�", cp: [99.7998, 38.7433], childNum: 9 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@脠脪艓脪k聞mLU聨l聨U聞炉nV掳職職@掳蓽b聞脼臓a脠禄母l聜職聞LVU脠@膴聫@媒Um聞@@聧脝V臓炉脼m聞L脝炉脼聫茠聛聞脩掳VVw職J虏禄脝脭職Vl扭脜V聶娄膲掳膲臇膵w脻J聛zVxll虏IVVV镁職X聞陇藕聛聹V掳娄聞V膴@脝b脠m菙L母聫臓炉蘑a么炉母m脝脹U聝l脟母k掳聧Xy膴U菙V聞签nmV禄聝a@媒nK掳聬n@l楼@禄偶聞膴陇m莽職聝@拢膶U@m聝mVk脼U茞卤虏鹿掳聜臓w聛脜茟艃U聛炉聶聸V炉a脠艁職聝脟禄聶摹n_掳x艓Klx聹klx聞@脼w聜聞聞@脝m虏b聜脟虏Llk職WXa钮炉膴a聹脩職K卤w@w聝U脜莽V卤Uk聶@@聞炉職炉x聝U聶卤卤UU掳艒xVx脜脭艒掳贸炉U聫脻娄贸b脻镁聝@膲脠贸UV聜Ux聞聞@聬V聨UV脻w脜脠脟聨贸Vkk炉J脟聬kmmL@聞聶K脟x@bk職聶@U掳姆虏贸`聝聧職聶職mn炉掳聝Uwl脜kU聝`聶娄蓻么聶聨姆z@聨脜n脟掳U录炉KmVk虏聝J聝录茝脼姆么職陇UL聝@mn臒`聶職脟nUx脟@脹每聶U@聝聝k呕聨@x聛@m聬贸Jk脜聝楼V聧殴膲贸脪膲l膵掳姆聞U聬平脺聝聬聛@聸x"],
                encodeOffsets: [
                    [99720, 40090]
                ]
            }
        }, {
            type: "Feature",
            id: "6230",
            properties: { name: "鐢樺崡钘忔棌鑷不宸�", cp: [102.9199, 34.6893], childNum: 9 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@脼聧職聶nKln職wX楼W脻Xk聵x脼Un聝掳a膴VnUUKl聧脼聧亩WXn臓楼么禄聞聶@聛nmVL@陇掳聶Vz聞J職anU@a脝wna@k聸聝U炉職yX_聸a膲b聶聝聞w聝茅XkWw脜a職炉V楼m聝炉聧U聝聝I@聝職@聞m職b掳a脠莽職U職楼@禄聜knw蓽茋掳I掳脩脠mVU聶炉Xa@w聜W@w職聧V炉膶楼l炉Uwnm@k聵aUa贸Kkk@聶脟a聶b@聨聛脪Wa炉I脟x脹am录聶VU聬聝x聛脪l聜@z脻脪炉b脻a膲V膲w脟聞聛W聸z聛J聶聧mJn虏m脺炉U聝炉膲@摹陇脜b@虏n職ml聝@@聨聞聞U聞聝LVx職V聶聞U录脜lma聶b@聬聝掳聶l聛@WIU聝炉@m聝聶@聶聶贸聧聞聶聞@U聫聸z牛y聝X聛脟U聶脟VUUVLkbWakVWmUbkk聝KU聛脝禄n聫聝聧掳Knk@a聝UVm職nk禄l炉蘑聸lw@_kKVU@聝na聝@lUk@炉楼mV@kmb聛W聶b炉脜玫a@mkU@聧k聝脟聨kU@聛聸`@聶贸贸聴bl录Ux聝n聞录職lV脠聞x@blVkVVn聝`X脠摹脠@脟聝K聛拢脻JmUUnU臇mlU聞mKUn聶V脜aUw聸U膲`炉n炉wW录nxV聨聶職@b膲n聝聜kI膵艠kXU聨卤脪聶x職脠@聨X聬掳`l聞聹V聵I脠炉膴V聞聝職VVan@Va職UVa偶聛Vm職blk脠W聞聝WIXa聞alL@wVb聞聫聞V聞娄lL@l臓聶n脪聞U聜nk聜職L@脝脼k職脼職K聜b帽镁W娄脹聞膵V聝聞ULU潞k脠l艓Ux脝x脼UUx職脪聜x聞@Xb職L@l脝@聞脪lXVln@聞bm录聝J@聞脜n聞職聝x@bn職臓m聞xVXmb脠猫@聨膴拢膶W聵w"],
                encodeOffsets: [
                    [105210, 36349]
                ]
            }
        }, {
            type: "Feature",
            id: "6206",
            properties: { name: "姝﹀▉甯�", cp: [103.0188, 38.1061], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@卤炉聛楼@klwU禄聝聝脼脻mw聛Km聧炉聶聶莽@聫聶kV脟UL炉lV聛UK摹聞摹m@a@U聞@X拢掳l掳L艓脟@a艒V脻w聶脭聝KU聨脜職聞聬WJ炉聛lm@聧脹VWa聶@kl膲Uma聝LUana聝聶聝k炉J聞聧聶聶卤KkX贸脺脜x聝虏脟聜@聞聞nU脪膴b掳@聶脝kL聶聨聶X脟脝@x脻n聴xWx牛聞炉陇聝I@脝n聞聝VV聞VlU虏脝猫聞V@x虏x聶L聸脪膲b纽掳Wb聶Xkl脼聞職@l陇職X膴`聞wl@蘑脠艓m@b職nV聜Ub聝聞@脠聶脝脹L聝猫脟職U脪脜娄l母聶`掳漠薀脝菗b膲么蠚膴脝職蘑n扭茅蝷脩母膧膴娄聞@@l掳l聹娄犬娄蓡脼膴K扭聫聶牡母暖聞禄m艁聛y摹聶姆怒@脟杀拳炉m僻U膴姆n艁呕禄UaU聶聵茮蔀脻屁暖"],
                encodeOffsets: [
                    [106336, 38543]
                ]
            }
        }, {
            type: "Feature",
            id: "6212",
            properties: { name: "闄囧崡甯�", cp: [105.304, 33.5632], childNum: 9 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@職脠脼@l`U聬mV聝录聹聨聜@nn脝wVlnVVa聞LV聝脠_聜每脼聝@n聞a聞x脝@聞l職_職@VxnK@llLnxm脠艓JnbUx職I掳聨l@n娄聜l脠IlmX楼聞k掳@職k聜J聞k虏茅聵@k聧laUaVaU@@脻nIW聧nmnx聜k聞潞脼聞聞aV聶掳聞V@nw聜K職x么b脼拢職V職U聞b職镁職Ln禄m聝Vw聞I職J掳聨@聞nb@掳掳I聞摹Uk脟KV聝聶聶@脜炉禄l聝聞Lnm聝拢@anK@脩脺聧n聫@禄mL@拢聶yk聞UUmbU脼脻@ky脟b贸禄聶XUx聝WVz聛b卤m脻bXa聝wUamL炉禄@wUKVwm炉牡J掳脜UWVk聞KVk掳w脠V職聧V脩聝lU職聝楼職聛kmVamkn聝Uw炉炉聝b膵楼脜K聝k聶Kk聞聶V膵Vk拢kKVw聜脩聞a@k贸y脹炉脟Vk聶贸w聸職聴X艒楼脟录贸w聶聨炉U卤聜k聞聝@聛x聸I膲脪脜Vm脠n職脺@n掳聞bUb脻V聜聨UnnJ炉漠@聜m娄nV脺聝@聞聞L掳JXb聜脩@聧職a脠b@職ll么LVb聴b@lmnVxk掳膵娄U掳聶聨@x聛X@xWb職掳UV脟n炉脪炉J蓻茍mx聛l@录"],
                encodeOffsets: [
                    [106527, 34943]
                ]
            }
        }, {
            type: "Feature",
            id: "6210",
            properties: { name: "搴嗛槼甯�", cp: [107.5342, 36.2], childNum: 8 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@kw聜膲聴禄Vam聝聝V炉w聝I贸Vkl炉聧聶Km聬聶V艒炉脻WkL@b脻K艒娄@聨聶聞@職聶L聛x聸@聛b@l聶a@km@@l炉nm@Ua脜@聝聞贸WUXm楼聶n聝w聛`@UUx姆么脟掳臒娄@聞VJ職_n聜聜IV聨nalxkX聞JWn炉職nV聝L職xl陇nnVbklVX@xnxmV@bUK@nm@@x聝V聴掳卤a脜n聝聨kUWnUa聝x@m聶n@聝炉L聝職職mU膧lU@l聛V@blLUblxklkI脟x炉掳聜UXb職aV聨Un職V@掳聜LUlnb職X@`掳聛nVmbn脝m聬V聜kLmK聶娄U聨@X聞y@kl@U聞掳K@录XbW聞聝職@b聞WnLVa聞V職聝Vz@xlV膶楼lbUx脼聧lV聞U@n脝W么n虏聶VJlU聞僻聞Lnm脺LXa聵n@m聹w@wlUlV虏m職blw職V脠聝lL脼聧聞卤@聧lVnUlxnkma@m職k職J@kXV聜U@mn@職录VXU聝V聝lLnmVb么aV聛nWV禄脠Ul掳脠炉脝In聸脝U@kk禄mKk聧脝摹k炉@禄m聝k聴炉@贸脟l脟@聴Vykkl聶Uml炉脼聶@w"],
                encodeOffsets: [
                    [111229, 36383]
                ]
            }
        }, {
            type: "Feature",
            id: "6204",
            properties: { name: "鐧介摱甯�", cp: [104.8645, 36.5076], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@VKU脠職l@聬職猫掳職n聨聜Lnx脻脼聞聞V录kx@l聜娄虏掳膴贸臓聧聞聶膴禄職@脠x職a膴xlw脠V扭a@炉虏a脟拢聝Jk拢l聝nU脼@掳職么聶@y聞wl禄lIX楼仟聧nw@脩脼Wla聞脜lL@聝Uw膲ak聝l聧@聝職炉mwna掳J聞聧V炉nUV脫脼脩m拢虏贸WaU聝脟@贸脻U莽V禄脠kkW@炉聜xV@X聧lK@wX@Vmm_@w脠脻聶KU炉脟wVw脜K炉V聝k聝J聶聶聶XkWVa聝Im聨炉Uk聞脟lV職聹膧V掳mx贸職k聞@录贸聞Wx膲脺U@Ub聜z脹J脟k聛@聜脝nVl脭聶@k聨聞x聶么@默WL炉聝聝K@a脹Imm聶@聝IUa聝@聶聶U聨脟锚U陇聛聬V脪脟x炉脪V聞職職聶lk@Wb膲娄UbkWV_聜y炉L聝a贸聞k聨@b@nmbkx聞掳"],
                encodeOffsets: [
                    [106077, 37885]
                ]
            }
        }, {
            type: "Feature",
            id: "6211",
            properties: { name: "瀹氳タ甯�", cp: [104.5569, 35.0848], childNum: 7 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞a聜V虏wVJV_@聫聞Llan脜ll纽莽脺脫職_職ln聝Wa么k聞xU職聞bmV@聬脠掳l猫職nk掳l娄聞`@nnL聜@脠l脺I聛yVaV@膴脹Xw么聝@禄l聝么聶nwU炉聸每U聶脠kl聝掳Vn聧聞JUblX職W職職聞I聞l掳U聞聝V聝職聴@aVVVmnL@聞l聝聞UUw聜mk聝職拢聞bV楼VUVw脹聜聝聛la聛脟脻脼聝mk拢聝LUy炉L@聧WlkKW_XaW聝聴m聝聞摹U@a聶k聶聜聝akXkmVwm聧殴V聝U聶b聶W聝贸n聛mwnWW拢聞K脠nV楼聝楼聞聝脝_k聶lW聞bU炉聞V掳a么bnaVwma艒In脟mwkK@kmLUw聶@聶`聝k脜@聝w聝b@m脻聞聛膧脟`U聞聝KUbmUUk脜xmm聛@聸聧聞禄nUV聫k_脻@聶脟聶娄聶V脟猫炉b聶a聝n聶@@聞聞JV聞掳聨n聞U娄聶掳脝bXxWl聞锚聝x職聞膴a聹bW`聶zV掳聹聞@lmb脜x@bmV聶b聝I聶`聶娄@脪UVUI@脝聝L@b職录@職職聨@聞職lmxnL聞掳UL聝聨聝脼臒脼聸掳kLU聨聝L聶掳聶xV聨聞n聞KV聝l@職zX@"],
                encodeOffsets: [
                    [106122, 36794]
                ]
            }
        }, {
            type: "Feature",
            id: "6205",
            properties: { name: "澶╂按甯�", cp: [105.6445, 34.6289], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@Uy脠聧V聝VUnn@聝VU聞`Ublz職Jnk聜@Vb聞KU聞掳l聞w職聞聞W掳聞nkV聨聜U脠l職拢掳V@聧n楼職V聞kl聶kU聵卤U聛聞聝n聶聝聫lw炉UkwmKU聧lmkUmnkym@脜聧@U聞mW聧脠U掳l掳an聛lJ職kUKlU聞炉脠m@kmWV禄kk脻LUWUx卤b聛聶@炉ma@聝炉聧聶I聝JUxn聞m录聶K聶媒聝a聶V聶U脻陇贸a聶w聛LmxU@炉聝U職聝b脻聝聝鹿聛lmwmnX聨mJ@脼V@UbVbkbl聨聴@卤锚聝l聛I聶l炉@聝lW娄kn脟J聛km楼k@炉聧聶Jmb贸a炉b聝UV掳聝akXl職脜`聝聞聞娄U娄脟m聝LX陇mXnxm聜聞么職X職a聞V藕Un聨UxlnlW聞b職聛職l@b蘑V聞聝聵nX聞WbX`lLXk@聨掳KVz聞Kl陇聞n脼脻聜脠kb聞聜脺聛"],
                encodeOffsets: [
                    [108180, 35984]
                ]
            }
        }, {
            type: "Feature",
            id: "6201",
            properties: { name: "鍏板窞甯�", cp: [103.5901, 36.3043], childNum: 5 },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@lW虏L職職聝聨掳I聞l聞職mbVb聞Knb膴Vlk職@Xb脺U@聨kn掳聜XI聝聫脝聶V聧聞L職脫脼x艓Ul聧么聝聞b掳K聛zU`lXVa膴楼Xal@職k聶聶U聝掳脩脠wU脩聜聫V拢脠茅V聧職職聞@Vb聞J職@nn脺J@b聞L掳聞XK@墨職贸聝wl聧職@k脫mU聛脜mK@m聝_k楼l炉聶mk莽脟炉@聫nU聝aV聶聝w贸lXbm聞聶k聶`脹脭钮猫kkm脝kb聝K@聬U`UI卤x聛U聝bWlX聞mbVb脜脪贸lk聝聝IWJk職聝@聝z聴K呕录聶@聶xUx贸聨聝聞炉LWb@聨脜脪聞聞卤娄U`nb钮膧U職Vb聞L職聨聞U"],
                    ["@@聝炉lwna@m艒脠炉K炉kW陇聝@@V@b蘑n蘑聝VLU聜掳k"]
                ],
                encodeOffsets: [
                    [
                        [105188, 37649]
                    ],
                    [
                        [106077, 37885]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "6208",
            properties: { name: "骞冲噳甯�", cp: [107.0728, 35.321], childNum: 7 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@脝LUx脠xV掳職L脟脼@xn`脺@X聧@n膴聨脝wnJmwUx聛聧聜aUk職w@V@w聞aVmlLX脻l@X聬聜V蘑mV聛掳@nl@UUUWK@w聞每VI虏脪lm職@n脻膴媒VV@n職J掳聞聞職U艂m@k聬V录nK聸蘑脠陇么K聞bl聛nKllVk虏a臓楼脠炉母贸Vw@V聜_聞x職mn娄VW么X聞聝脝@Vbn@掳m@kn@@l職b@k聜a聹@聜w職K@聶職聝@聧聛UlKVa聛聝WX聶W虏鹿l脫聞w@_掳聸n@@_lK脜聧姆W聶聛@聨mLUW聝n聶禄脹@聸l聛_脟`聝聛脹mm掳脜bWb@職聴VWb聝UU聬聛K脟聞脜a摹lmk聛U摹l聝禄聴L聝l聶Um娄@聨炉U聶陇脟k聛VU聧ml炉聝聝X聶聝聝x炉kV聝聝LUa聛@ml聶IkyVa聝_UV@聞mmUVU聞脟聨VzUxUVU娄聝a聶陇l聞聛nVx聝Vk聞@聝mKUnUU@b聶聵U聞聝聞", "@@@聨偶聬@聶mlk聝摹k"],
                encodeOffsets: [
                    [107877, 36338],
                    [108439, 36265]
                ]
            }
        }, {
            type: "Feature",
            id: "6229",
            properties: { name: "涓村鍥炴棌鑷不宸�", cp: [103.2715, 35.5737], childNum: 8 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@職@偶禄聵L聞y聞@l聶XI聞Jl聞么k脝脩UanaW聝XkW@聶yk@U聞聝L聝mU聧職w職炉聞KV聧lK聹炉臓脻聞脻聞聧VK聝炉mKnw聶k@聝聶聧@聶聶禄@a聞K@脜VJVU@脩職楼職_Uy炉職@拢UKmn@聜聝職贸录臒娄Wm牡X脻聨k聨VLmV膲U炉bm聞脻V聴wWlX脼W娄聶xkmmL聶職脻聨聹聞卤U@V脼聨聶職@聞脜脠W掳X聞脺录屁yU漠n聨W聨nX脻xUx掳lV聬XJl聬么V"],
                encodeOffsets: [
                    [105548, 37075]
                ]
            }
        }, {
            type: "Feature",
            id: "6203",
            properties: { name: "閲戞槍甯�", cp: [102.074, 38.5126], childNum: 2 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@職蘑脠录聶聞脟艂掳b聹U掳職V聜茠艅聜脝菛虐n職脝聞艒默菙a薁脜炉沫職_k姆脝楼V脩脠聶聞莽脺K職脜@脟聞聝VaU聛聶m@a艒n摹脟k@聝x膲_聶Wk拢聶@脻聝卤K聛脠卤a脜n聝@聛聝脻x聝@kw聸lkw艒L炉wm`"],
                encodeOffsets: [
                    [103849, 38970]
                ]
            }
        }, {
            type: "Feature",
            id: "6202",
            properties: { name: "鍢夊唱鍏冲競", cp: [98.1738, 39.8035], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@ll膴x聞娄職l聶娄職聞kVVn職JVb菛V聞k么V聵a聞bnaWw聞UXmmamUXkWK艒炉Xm掳聶聶禄膲聬脟@UV聝K聛聶姆k脟录臒b"],
                encodeOffsets: [
                    [100182, 40664]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/guang_dong_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "4418",
            properties: { name: "娓呰繙甯�", cp: [112.9175, 24.3292], childNum: 8 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@l脟炉聧k每聝aV炉聶聧Va脠U聞楼脝脟聞Ilx職mnb聜U聹xl聶聞U么l掳k職聞聞Wl聞職@么聶VwUanUl@聞xVk職aX楼聜kU禄聞a職炉卤聫@kka@聝UwmUkw聝Jk聶聵聛聞卤k@聝聶聶L@聧脻WUwV脻聝聧聴x脟U炉聨脟X@m聶脜聝@@y膲拢VmUw葪禄脟職Un聞lUnWU炉`Uk聝@@聞聶x聞聨@b脟xX录聝VV職炉L職膧k聜脻L聝聞炉@V聨聝膧炉ln膴W娄kV脟么kU脟聞UK@牛聶U@a聶聶贸脺聝UU禄聝@聶娄k@Vx聞KVb聞n聜職@聞聛脝聶聞l聞@x聛職聝bW職nlU聞lx脠lV聞脠掳脝聞@录聶聞@x聞職Wx聹艓聜V聞聛職K掳聞職楼職職n聝脝k艓@脠脩m聶聞K@楼職k@聶么@聞n么V"],
                encodeOffsets: [
                    [115707, 25527]
                ]
            }
        }, {
            type: "Feature",
            id: "4402",
            properties: { name: "闊跺叧甯�", cp: [113.7964, 24.7028], childNum: 8 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@W聶Xk卤脩@聝Uw聶mUw膲wlmn@脝wn拢m聫kI職楼脟脜@楼職a聝贸n拢nWWw職拢V`脼@職聛nVml@x么录聞IV楼聝kUmkamUkVWw脹禄m贸聝拢UV脜Kmn@x聶@kbmm炉a聶Xka聸V膲aUb脻聝聝虏聴聜l職聞IlxnVVx@聞lb@l虏聬聶掳聝bV录聛lW娄聶bUl聝wk@mVVbUx贸職聶@k聝聝X聶聝炉l贸k聝Vk職聸w聛Vma聶nkw聝J脜脠聝娄脟VUb職聨U掳聞bl膧掳聨k脠@x聶娄脝脺聶掳@聞掳聞聛娄贸a聶VU么lUlbX聫l@n聬脺V聞聞nKl聨nIV脼掳W職聞掳U@bnm@楼職IV聝虏Ul聝掳VnalzXyl_Vy茠娄l聝聹Llx職聞@聨脼b職Km聧聞knVWanw聝脩Vw膶潞聵@n_脼V聞aV聨脺I聹l@聞聵K脠職聞聛VJ@a職拢脠@聵聶@聫聛km聶聞aV聧炉W@_聝a炉Kmbk脟kLmw聝@脜楼"],
                encodeOffsets: [
                    [117147, 25549]
                ]
            }
        }, {
            type: "Feature",
            id: "4408",
            properties: { name: "婀涙睙甯�", cp: [110.3577, 20.9894], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@聝kX聝聶@a聞UU膵lk聞J聝k聞聶@wVJXUWk掳W@聛nKnwlUl職虏聝聞blU@聜lI聞l@聞XbW聞職xnm@聧lW@w聞wU聛聜JX炉VU掳`艓贸藡k脻脻k脜@脟m臒脠艡mw聶a牡V聸xU脹聛禄掳聶臓欠n媒m贸X楼蓞牡覐脟@掳虏膴U臇卤漠U陇脟掳聶膧炉蓯n偶U膴膴默V聬@猫聞聨@脭聝脪U录l陇n聝臓b聞锚V臓掳聬脠y聞zVaV聜nU脝L聞a職bVl聞w脝@"],
                encodeOffsets: [
                    [113040, 22416]
                ]
            }
        }, {
            type: "Feature",
            id: "4414",
            properties: { name: "姊呭窞甯�", cp: [116.1255, 24.1534], childNum: 8 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞聜n脭職lW录聛x聜娄@l聹Vl聶lLk猫聞a@z職陇聝臇聞录UxlnUKUb脻lU录lb@聞Vx聞V聞klJ脠wV炉職@臓l脹臇職n聝bk職脝藕脼聝U脠么klm職L聞楼聜L聹W聵聞聞聶nKUkVa掳V聞x@IVV@x掳bUk聞a聶a@mV@聞聛@y聞w聜L聞脩UwVU職V聞聜聞U聜b脼VVann聜@Xw脟每職炉虏aVamkXa脝禄@禄nw@楼聸UXa聝聧kbWa炉KUw@楼m@kwmLU禄UU聶J@kmU@UUWU聛聝@聝y聝anwm莽脹l炉聧聝聨炉U聝聛mKUm聝wV聧km脻X聛bW@XW脻b聝k炉@卤聜聛w@禄U@W炉脜@聝聬脟楼U聝U@聝聝聶IU聶聝akJ聝膧聞锚聝掳職镁聝Xkam聨@聨聝_聛J掳聬m聜@X"],
                encodeOffsets: [
                    [118125, 24419]
                ]
            }
        }, {
            type: "Feature",
            id: "4416",
            properties: { name: "娌虫簮甯�", cp: [114.917, 23.9722], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@掳VlmX鹿la蘑脪lm聞@聞聞職V職拢聜聜@娄蘑klyn聬n录lW掳z聞W聞聞掳聧Vb脠V@l脝bnn聜J職kX聞職V脝a職脜聞W@聶聝UUw@聝kaV禄脼kVaVLkmVw聝禄聞臅聶拢@y聝bl莽kKk職聸U@k聛楼聜wX禄聶km脫聝聛@Wn聛炉聫聜I聞`@聧n聧lb聞W聶媒聞炉聝茅聞每lI@聶XUmWUw聝@@聛UJU聞脟聞mKUV@x聶聞牛k炉聫炉LW聝聝nUx聛K@脜卤禄Vw聛a炉職@陇WX@聨脹娄@陇脟I脠录WxX聨聝@Wx聴w聸聨UnVb脜猫mV聛a卤虏聛UWl@聨k聞l脠聞陇n么脺录XxlUnVlbVn聞lU娄聝J贸禄@wnkmU聶聜脻@U_聶陇XxmXm陇聞么聶b@娄脠脝聶娄lJn聬"],
                encodeOffsets: [
                    [117057, 25167]
                ]
            }
        }, {
            type: "Feature",
            id: "4412",
            properties: { name: "鑲囧簡甯�", cp: [112.1265, 23.5822], childNum: 7 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@l@職楼聞@V录聞V么脹職職@b職V@扭VL脠聝lV脠贸lUX楼m膲掳k聞每U聧掳@聞聝脼Kl聛聶每掳KU聶聞UW禄脠w@a聝聧職w@聝聞@nm@w聸拢k脫VUVn聞K職聶k楼聶拢Vam聝@nkKkb脝谦ma聴kmLU楼聶Um聝脹wmVU聶mU聝J聴聧脟aUx脟In`mb@脼炉b@聞nJ@nl聞U聜V聞lVU聞聛L聸W炉聴脹`脟_炉`m職炉I聶b膲W膵z聛x卤J聶x職聬炉脝U聝聝_k@聶職聝J@Umb聞職X么lL職聵n娄@录膴xlUX聨聵xUb聛L聜臓聞UnV膴wl職U職聞b@聬lW聞X聞聜m虏聛聵@脼WxX職聜Unb"],
                encodeOffsets: [
                    [114627, 24818]
                ]
            }
        }, {
            type: "Feature",
            id: "4413",
            properties: { name: "鎯犲窞甯�", cp: [114.6204, 23.1647], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@lb職W掳bnnla職@@wnm脝LVUk脟l聝@聧Xk聜V虏卤聜bnU脝莽UaVm聹聧聵xXw聞@W聧Xw脟禄脠J@拢脺楼@聧XW@拢掳聶聜bUx虏录@脝聜LVw聞mX聞掳K掳聬扭l職聝@wVUnL脠聝V聝VIky卤wk聛聝KU炉聝聫脜k聝聫聶X摹脩脹聝lwUwlm@m聞聛nKWa職脜聛m聸炉聛贸脟m臒b炉al膲Uw姆bmb@l脼脪Vn聴職m膧殴@V聨聝bV聨UnmakLm`@x膲kklV脭VJVn聴lV聞UnmJma聛LUbl聜聶zm聨kL聶a聶聜艒@@z職聜V娄U聨V虏kJ聞n脺U@聵VXU聨聛L@聞lJ聝L@b脻陇UnV聨聴b@xVnlK虏聞Vx掳V聞xlI聞lkVl虏k陇@n"],
                encodeOffsets: [
                    [116776, 24492]
                ]
            }
        }, {
            type: "Feature",
            id: "4409",
            properties: { name: "鑼傚悕甯�", cp: [111.0059, 22.0221], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聜Ln脟lk聞Knk脝L聞聫聝Um聶脠xlU聹Jl贸掳n@職職an聨職聞聞a@聝聵@X_@m脻贸贸U@a聶aU炉mL炉聝聝聫k聧V炉聶脟Vwkw@聧V卤艓拢@聶聶聫@聛職alw聛卤Vk@m聞脜m炉聶每脜聝僻I脟`艒么炉_UVW掳聛IV聜聝x@xkX@聨mn聶wX聝Wa@聝聝kkJ@聛kV聝a卤聞k聶kVmxmL@聜炉XXlWVUI@x聝職聞l聝IklV膶聝V@b聞職lW@聞@nUxVb聛lVxk么lx聶聬n聞聜y聞職nI脝禄脝掳聞aXwlK聞bVn聝聨Xb聜L聞陇聞k聜L聴猫聝VV录聝聨虏Il臓VX聞ynz掳KVx掳@Vl聹LlblK聹職"],
                encodeOffsets: [
                    [113761, 23237]
                ]
            }
        }, {
            type: "Feature",
            id: "4407",
            properties: { name: "姹熼棬甯�", cp: [112.6318, 22.1484], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@lUXx掳JWnn脝職XV職聞W聞X@聞職潞VLV炉nU聜Vnb聶么聞x聜aXmW聶XI職聨Ub掳xlK聞聬l炉聹K聵xX脼掳聨職X脠楼脺@聞膲脼聫U聶聜莽職禄n贸聝Vma聴x聜炉U脜U楼脻炉@聝聝莽@葯@莽膲脜UmU莽卤聝膲K脻x脻_脜J聝k炉禄贸聫炉nm猫k莯職聨Wx聹录mnU脺摹掳@娄聛@聝x聝Lk聨脟aVnUxV聞聶職VlnIlbn脝脝KX娄"],
                encodeOffsets: [
                    [114852, 22928]
                ]
            }
        }, {
            type: "Feature",
            id: "4417",
            properties: { name: "闃虫睙甯�", cp: [111.8298, 22.0715], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@掳聞nKV掳職b@b么V脼么@n聞Vl脪么脝Unlnn@lmkmVk聝a脠k脝脝聞聶k楼聜脜脼禄脝KXkW楼脜Lm脜kamJUk職聶U聝VwUm脠bl聧聞K聞w聜@@楼蘑炉V脹nm聸禄Xw聶聧l瓶聶@kbW聶聴a实@贸L聸l炉聛平@聶聝聝Ln掳聝脝@nUl聜虏kx聶b@聜職聬@職艒陇U虏@聨lxUx職脠U掳l聨聞聬"],
                encodeOffsets: [
                    [114053, 22782]
                ]
            }
        }, {
            type: "Feature",
            id: "4453",
            properties: { name: "浜戞诞甯�", cp: [111.7859, 22.8516], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@V聞I職聶l@聞`V聞掳脜聶聫職w虏I聜w膶y膴X職a掳Jn聶掳_脠`脺_掳聵聹X聜KV聝kUU聝V聛k聝@mmI@聝掳a@脻nam_脠JVwl膲X@聞職lU職贸ma聛UmVU掳UK聶鹿@聝聝W聝XU聶聶Wm脜Xm炉IWwkVWl脜L脻录聛脝l娄聝職脜脜脟l聞bUllnknm@kmVm贸脜k脩聝UW`聴@@聞聝b聶聝m聧聶b@聶炉mk么聸IkV脟wn職聞V聝聬脜Kml聝Lklm脠聛K聝聬職V膴K掳虏聞`n聬聵陇n聞U聬聞bWl聞xVx聶LUx@掳nXm`V聬klVxmnnx"],
                encodeOffsets: [
                    [114053, 23873]
                ]
            }
        }, {
            type: "Feature",
            id: "4401",
            properties: { name: "骞垮窞甯�", cp: [113.5107, 23.2196], childNum: 13 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@葮录VxUn膴陇@z聞@職脝@n脠W掳聧脠V聵w聞聨U脼Vx脼X@聨職K聞職l@脼聞Va膴b聹U@ml拢k卤lU聝kkJ聝w炉UUw卤聝kLUm@w聵aU聧Vm脼拢@a聞KkI@聝聜KV聧UW@聴脹V聝mlIU卤V聧U楼聶聛@y臒z僻脟聝聝職平臓艡職脜n墨卤m聛@聝虏炉l聝掳@n脻脝贸聬Ull@Xn脻VU娄mVV掳聴聞V录聶J聝n聞b@掳mbn聞聝聜@虏炉聜炉wVw聝@@nmxX陇炉L@聨VLU聞m@@l"],
                encodeOffsets: [
                    [115673, 24019]
                ]
            }
        }, {
            type: "Feature",
            id: "4415",
            properties: { name: "姹曞熬甯�", cp: [115.5762, 23.0438], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@聜聞@VxnXWV@職聞bV職職J聞聞V@脼脜U楼膴x職拢UWU聧聜w脜UU楼WVUk膴脟nkV`掳LV聶聞w聝聝nU@聶聞聝lb膴炉聞Vnal職職@@莽kU脻楼摹a贸炉脜a脜L呕脝U媒my炉聛贸@膲脝贸聞券w聶脝XbmL聝聜@nknVxkx脺聞蘑脪職W聞聬脝l聞聬V掳聞Ll聜虏xlz"],
                encodeOffsets: [
                    [118193, 23806]
                ]
            }
        }, {
            type: "Feature",
            id: "4452",
            properties: { name: "鎻槼甯�", cp: [116.1255, 23.313], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@V聞脠娄聞聫脝@X掳V@@录聜x虏聛掳@聞l脼aWXX@聜a脼WlnU聨聞xVnnL聞聜掳V聞聧@k聜m蘑聧l聫@聛聞ak聶@mlk掳aX聝卤聞nwm卤聶虏炉JV虏聛@聝wW聵聴_m聫聝a聞聛V禄聝U@m炉膲U脩聞聶職Jl聶聞a職bVn聞l母Ll茀脹脟卤w脻@膲x贸聧@猫聶@k聶mb聝U膲掳ka聝聞@職mV聞聞聝xU職炉KU_ml膲脠VlXUV娄脝V聛xV聨VX聶陇膲wV娄脻脝"],
                encodeOffsets: [
                    [118384, 24036]
                ]
            }
        }, {
            type: "Feature",
            id: "4404",
            properties: { name: "鐝犳捣甯�", cp: [113.7305, 22.1155], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞猫@聞脼掳V娄V脝聛掳聵wnb聞U脝禄n莽脝聫@聛nx脺陇聛虏llU掳Vn脠J脼聬掳U么茅職姆Ukl聝么拢VV藢K脼V掳拢n楼聝拢葪聶脻y炉炉m脜kw炉b脟臄臒@脻n炉膴聝V臒聧艒艁呕聝姆J@葰", "@@X聧炉km猫VbnJ聜聶"],
                encodeOffsets: [
                    [115774, 22602],
                    [116325, 22697]
                ]
            }
        }, {
            type: "Feature",
            id: "4406",
            properties: { name: "浣涘北甯�", cp: [112.8955, 23.1097], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@脠b聵聨聞InVV職nU脺xn聞職VV娄nK聵lnb脜乾lalL@mn聞Ub職陇l娄聶職聝LUmUVl脭聹陇@xmnVl掳_XVVm聝kVm脠聶@kn@V聝UK@聧掳KW拢nw@m聞@Ux掳x掳聛@卤聞聛m聝na@炉聝a聞m職IU禄聵聝U炉nUV楼脼UWmk@Vk炉聫聶Ukn聸脩聛W脻聬聝膴脹@脟娄聶W炉聧W脻聴w聸Lk掳聝聫kL炉wVa聶聧WJX職Wn聛b聝wkV聝聶W@k膴"],
                encodeOffsets: [
                    [115088, 23316]
                ]
            }
        }, {
            type: "Feature",
            id: "4451",
            properties: { name: "娼窞甯�", cp: [116.7847, 23.8293], childNum: 3 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@掳聨脺kn猫mx聞b聞z聞@V聜VX@VnV@l職IVVV录nKlxn@@娄Vx掳LXbla聞聨Wb聹V掳拢炉聶W聫@聛nW@聶聜aU帽V聫聹wW聧職禄@楼扭脜U脻菗脻贸V@艅脟聨kUVm聝IUw脜VW脟X鹿聸聫聴@W聞炉bkl@nl職聝b@聜k聬摹聨聛n@l"],
                encodeOffsets: [
                    [119161, 24306]
                ]
            }
        }, {
            type: "Feature",
            id: "4405",
            properties: { name: "姹曞ご甯�", cp: [117.1692, 23.3405], childNum: 2 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聜@U卤掳I職卤n虏mx虏聝聵@聹聬W潞X脠脝UVx聞JUnlV脠聧@艃么U菙脼V莽n禄Vy蘑脹Vm@禄ka脻U脟录贸職脹脠姆K膵楼X聧聞楼Ww臒k聶聝炉@聝w姆K聝kUm聶a聝bk職聶I聝職V脪掳膴@n聞VU录聝聜聞bn聬聵`X聴聞x"],
                encodeOffsets: [
                    [119251, 24059]
                ]
            }
        }, {
            type: "Feature",
            id: "4403",
            properties: { name: "娣卞湷甯�", cp: [114.5435, 22.5439], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@脼L職聞@x職bV聞職V職K掳聶X聛掳K么楼Vw@anU聞猫聝聬職聜lk膴l@wn_lKnbVmU聧聞aU聧藕@n每聵聶Um脻脩炉U聝bk聞@脝kx呕@聶a脟X聴w聝J聝聝炉L姆脻U臅聶贸聶母贸锚W潞@b虏nm默聶脝"],
                encodeOffsets: [
                    [116404, 23265]
                ]
            }
        }, {
            type: "Feature",
            id: "4419",
            properties: { name: "涓滆帪甯�", cp: [113.8953, 22.901], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@艓@職聛職blKn聧職yk聛Va聜KnbnIVmU聝聵kUmUIU脫聶聛聞聫聝莽mV@bUx贸娄炉LW聜炉職聶L聶UU聝聶a@w聶聝脻K臒艢聶凭聞聞屁脠臓y"],
                encodeOffsets: [
                    [116573, 23670]
                ]
            }
        }, {
            type: "Feature",
            id: "4420",
            properties: { name: "涓北甯�", cp: [113.4229, 22.478], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聜X聹脪lm職V掳聬么聫脼脜@m聞炉掳k聞卤聜@@aX鹿炉V脻聫脟IUmV炉kk聜卤脹拢mw@聜脜聬m猫脜录m么聶录聛猫V職"],
                encodeOffsets: [
                    [115887, 23209]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/guang_xi_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "4510",
            properties: { name: "鐧捐壊甯�", cp: [106.6003, 23.9227], childNum: 12 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@lklWXL@V職I聜l@XnJn@VUUal聧k@mK@kny@UlU@a掳聶聞聝UU@VmaU@Ua@UWw聛@聝n@KmL聛m@alk職mnI聜m@an@VIUamW脜ImwU@@a@K聞X@JVL聞UVmUaVkUa@m聞@@Ulmkk掳聝UaVUlKXbVwVIkaVmUk@KVk@a聞aW聧炉m@w聞楼la聹X@Kma職kVmnUl@nxVK職InU@yVaVIV@na掳KlxX@@_lmX聧職UV`VIV聶V@聞聫n@l聬職bn@@WUkValK@聛虏yl@聞聞VUV@@K掳L@KU@@UVaXIVVV@naVkVa@K@UUK@UUa聶LWa聴w@m@K@UV聛V聝@mV聧UUVKnL聞mVL聞K聜bVK@UUIk聸mI@mUIVK@IUK@VkL聝@WU@m聛U@WmUk@聝I@V聝Jk@WwX_@amK@UUWkI聝聞聝K@LVb聛@mVmakL@J@bU@Ux@x聝bmI@`聝I聛wm@UbmKUa聛UWa炉UkJWV@X聝JUU炉LUmV@ma@kkamK聛w聝LUUmWVkkm@aVUUkVKnVVUm聧XK@UW@km@Ukkm@@W@U聶kUy@I@aUUmb聝陇U@kUmL@bmJU@Ua@wkLWWkL@U聝@VaU@聝LUakKWbkUWVkKkLVLUV@JVb聝z@V聝聞聛@聝VmUU@kVmK炉@V聝U_聶VWakVmIUKUaU@@bml@XU@@V@LmKUV聛聞mVUK聝聬聝K聝bkaUX聝KUL@x@V@l@聞mxU娄聞V@聨lL@V@Ln@@VV@聞nlKUaV@nLUbmJnL@VWLkbmV聞@@L聞W聜聞XLlx聞VVIVV@x@V虏blUVm聞LVU聹K@kWWXUlV@Xl`聞LX聞l@@V職聨聝n@VnbV職@lV聬UVU脠Vb職@@`UXU`l@@XUVm@k職@xmVknUJVXUbmKULmb聛x@VlJ@LVbkKUbVL脟UUV聝UVmU@VaUkUK聝VUwmLkUUVVl聝bka聶Xmw聝KU職VVU@@聬聛V卤Uk@VWUUm禄XamU聶b聝Kk聬聶`聝聞聶U@UnWW_kKmbUVUVmnUV@聞nJVUl職UbU@UV@n@JmI@VmbnVUXlx炉聨kKmnVV@L@V聶bkV聶Umm聶@Ub炉Lml聛U聝L@VWLkmkLmmn拢WmnKU_mW聶職聶bnbmx聝@U娄UJU聞@Xmlk娄@聜mnUUm@@Jn@lV聞脭VJnIVW聞I@a聞聝脝K@I@aVK聞Il聨脼nnl@nl`nb脝X虏l@xV聞@llbVn虏聨VVl@nn聞V@IlW@Un@@kVa掳K職n脠mVaV聧XUlaV聝脠U聞Vlw么UlynIVa職an@lVXb聜I職@n楼la@K職_n聜@b脝x@XnJV聞nKVz@`VXV職U`@b聝娄UV@V職Ilx聞UnV聜K聞X脠b職Vll職bVbnVn@"],
                encodeOffsets: [
                    [109126, 25684]
                ]
            }
        }, {
            type: "Feature",
            id: "4512",
            properties: { name: "娌虫睜甯�", cp: [107.8638, 24.5819], childNum: 11 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@lLVl聞bVV@nXVlI@JVX聞m職n聞W掳b聞IVV@聜ln聞@nalVUb聞nW聜@聬kVk脪lbVKn虏掳bU聨lV虏@聵X@`nb聞aUI@聝掳wlU@aXJVI@aVK@wUamIXm聜@XUV@@bV@Vm聞Im聫nUUwVaVKXU聜nVK@ak聝VwV@nL@UV`n@@X聜lnIUJl@X娄聵V@aUIVm@an聝V@UwnL@VlbVL@KVVXUW聝聞wUUVUka@UVJnUlbnalbVVn@掳聞聞LV`脼@職XVxV@@bVlUVVbXnWlXnml職@XXWVXJmbUI@V聞llUVkn@@VWV@Vnb聞@VXUJVnn`lLVk聞a聞禄lV職Lnw@WV@lInw@WnU@U@m聜knUV贸聞K聜wUmUXU聝U@@wVJVIl@XKVVVbVI聞J@Un@l聨VLnm聞b@U@Ul@nU職掳VUVJnnVJV@聞聛@mVU@聝@wkUVwkKWk聶yUUkU@alk脠@lJ@x聞Il聝@UUWVkUw@Kn@@kma聝VUl聶UUL聶脟聝UUKl@UUmL@aXU@mlUUwmK聛kUUVKVU聝a聝KU聧nK@U@Vl@XUWU聞KlwX@職b@K聜@XkV@UwWJka@aUwmV@U聶@@U@wUm@禄kLWVkIW聨XnmV@VkbmK聝LUbk聶Va@a聝a聛@@aVU@aVak拢@聝卤UkVU炉V聶UU聝JV聝UI聝@kxmUmWUb聛L聸w@K@aU@@aVU@聧聛Kma@aka@_VWkk@UWVUKULWKULU職@KUn聝wVaUK聝xU@U聧ma聝L聴m@kVmVa@Uk聝mI@聝@KmIkxU@@K聶U@mmakI@V聝LkmWkkJ聶_U聜@V@L@n聵xXb職KVb@VVL@V@LUbUlmbU@UUWJUb@VV@@L炉K@LU@UV聝聝k@卤z@聜kLUbVl@Xm@聶ak聫m@聝聬U@U職UJU_聶VW聨kn@`W@kw炉LmbU@UJUb@zmV聶JULmwk@mVUn聶lnb@L聸Wkb聝娄@x掳nX聨聝b@bUl@LVlUnlbUJUxWakLUVVb炉聞llkn@V聝@@nVbUlVbUn聝VUK@I聝W@L@bV@nx脝JnXVbUJm@@b聛nmJ聶nkl@b聜nnK@L聞m聜@Xx@VVbV@nb@UVV聝聞炉職@bkV@Vmz@lnLl@k聨VbUVm@mI@W聛k聶J@UWKkXkl"],
                encodeOffsets: [
                    [109126, 25684]
                ]
            }
        }, {
            type: "Feature",
            id: "4503",
            properties: { name: "妗傛灄甯�", cp: [110.5554, 25.318], childNum: 13 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@nU@J聜X@`XLm娄Vb聛`l職VXXW職@Vbl膶nV職聨lanLnmVL職K@_Va聝楼@kUa聞@VmVb聞aV@XVVzlVVK@knKVmX拢VK職Llbn職@b@llL@x膴么XaV@掳脠@陇聞bn聞V@@Wl_聞V聞U@W聞nVamw聞wVbn@聞K聜V職LX@VmV聬UxlV@職nVV_nK@m聜I@Wn@@I職U膴@@wVWX@@I掳VVm@wmU@m@IU聝V聶k聝lk聛Ummk脜V@@aV@@Wn_UKla@k職aV聞職lVanb@k聞@@KlVn@@aV@nIWW聶UUaVU@聶kKmwU@UImKk@UU@w@W@聛聜聶k聫@聶UkW聝@mk_W@Ua@a聶聝聝@聴炉聝mV拢@m聝UUam@聴kWak聝Vama@UUm@聛nw@alaUmnUlVlI聹V聜聶職LVyk拢Vm@k@UUJk聧聝K@kmKUw聶Kk聧WK@UXImyVwnI@m聜聝kUlkUKkUVm聝w@kkJWU脠m@_k@@a聝aW@U聞UJUwU@@IWKk聝mUUV@nVl@bVb@bU聜UX聝akw@聝WUkbkK聝bm@聶xUlkLm@@wmKUX@聜聶聛UaVW聶XVmU@@UUU聝xkmWXkKkUWaUaUb聶L@`UL@LV`UXmK@VmakLVbkL聜xUJUIVbUVVb炉K聝V@Xnl@聬lVXbm脪nV@L@VWKkVUIWJkI聝聨UamUUbm@U聞kU@JUbW@X聞WxUam@kbVVUnUJmUUV@b聝U@UUV聶@聝Vk@聝b聝mULV娄U@V聞U`VLUL@xVbn@UJ@nWJXXV聨VV@bkxVbUx聜L職職@x聞娄@職U聜lXUVVlULV@@職n聨U聞聝b@xl聞nJVnlVknUlV聬Ubm聨U@聝bV職聞x"],
                encodeOffsets: [
                    [112399, 26500]
                ]
            }
        }, {
            type: "Feature",
            id: "4501",
            properties: { name: "鍗楀畞甯�", cp: [108.479, 23.1152], childNum: 7 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@lKnbnU聜@Ua@K聞L聞聝lJVX@VnL@bW`Xxl@聞I@U聞Jl@nV@X聜V@nXV聞@lK@UVL@JULVJ@nnJl聹VJ@VUL聛a聝LUK聝nmKULVVU聨@nU聞職`lIXlln聞K@UlJnb@n職V@LV@lwnJ@L@聞nJl聞@VUbUn@l聵n聞KnbV聨V@聞wVLUb聞xVm@LV聶VKXLVKVLXU@VllUX@`lb@bnb聜L@聨UV@bV@@b@L聹x聜KVanXV聝UUmVUUUaVUky聜UUa聞ImK@mUUVUkKU_@W@UVVVIUW聞UVaVU@UUKn聝@k@al@ll@bnL@b聞VUV聵X@V聹@@b聜Knblmn@V_@aUalL@a@akK@kVKUKlwUUn聧V楼VmU_VWVIVaX@Va聞al脜聞K@LVJnalL@LnK聞wlVUw聜mX@VX職聝lLUVnblaUmVUVwXU@Wm炉Va@聛脼Knw@w聶m職k聞禄聜UVW虏a@_mW@U@I聞y聞LVUUKW@@聶聞LX@VUV@@yVU@UV@nwUUmJka@IU@聝m聝VkaW@UwUX@`聝@kLWUk@m聝kUUm@k聜UUWkU聝kWxk@@V聝K@n聛V@UVa聝UUJmIkV聝@UamLUbkVmamLka聶@聝聜聛kmL炉聫WI@w聛Jmw聝x@akU@aUKmbkaW_nW@_U@Wm@a@wkwUKm聝k@聝bkb聸w聛@mKUkkU@J@bW@kVWz@b聛VUa聸VUx@聞ULkJWbXVVX聝`@聹mJUVU@@Lk@WbU@UJlnXlm聞Vx@Ln@聜b@K聞LX聞WJU聬UW@k聝aUVUbmV@nnV@n@lVL聝VmLX聜mXkV卤@kx脜L聸職Ub聛JWI脜J@I聜mXalkUamKk職kL卤aVw聛K聝UU@m脼nbWJX聞m聞@l聛bmKULWUUVka聝bnn@Vl@VV聛V@V聝bVbnLWLXJWxXLV@@VV聬"],
                encodeOffsets: [
                    [109958, 23806]
                ]
            }
        }, {
            type: "Feature",
            id: "4502",
            properties: { name: "鏌冲窞甯�", cp: [109.3799, 24.9774], childNum: 7 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聝wU聶聞aV@n聧VaU聫VklmkUUmmIk聝@w聞aV聝m聧@聶U@VKUkVUkWV聛@聶聝楼@w聶聶聛KVwUalw@aUUU聧WWXI@mVIm@Ua@wVKUKV_U聝V@U楼VK聞n聞al@聞U職@VU@V聞V@aVUnVVIVmUUlan@VbXwW聝X@Va@IlVV聝n@VanVVb聞聧lJXIVJlUXL@U@KmUn脩WakU@聫mk聝JUI@mk聶@wUmmUV聛@JXaWIXWmaUI聝J聝kk@W聞nJ@聞聝aUak@聸kkJ@kUKU_聝@myU聛贸WUkm楼kUmL@KUKm@k_UmVa@聝k@@UmU@mm_聴JWIUVU聨WLUl聛bV聬UJ脟VUIVw聝KUVk@mU@n@lUL@Km@@l@L聶V聝z聛JmUU陇m@UbV虏U`U@@录Vn@x@V職@@VnUVx@blbXIVxU@Wl聛@@L聶aW@kx聝LXVWVk@@U@VmLV聨聞L聞bUVULVV聜lnLVxkV@nWV@bnKVVk@VL聞V職脠VK職VVk聞Unb@lm@@LVxUlVX@Vk聞聝J@wkI脟@kl@blVVV職zXllLUxlV@x@聞UV@n聝聜U@UImmUIUV聶炉mVk@@V@V聝amnUKk聧m@@V聝IUJUaUUWLk@UJUI@xV@V聞VWVn聛x聝LU么mVV聞@VkVVVUnV@UVkL@VVV@bVxla@bkXVJVn聞`nU@b聝b@bVL@VnJ@聞l@職V聞aU@@_lW@UUU@Un聝lll@XLl@@UX@掳bVWVanLlknVV@VVX@VV聝nU聨VLmbXJ@nllXX@`VX聝lma聛XVWk@Wk聝w聴J@聞VL@J聜bnU@bn@@bVKUnVJVIVVVL虏a@bV@@Vl@nUVakalm職聞UL@VUL@V聜a@mX聛l@nK@UlK聞L@Vl@@nkllb@職聞Vnn@聜職nV聞聶V掳l聞職VInwlKXxlU掳聨n@@聝聜I@UnVlak聧UJWkUK@anUWK@_脼J@U"],
                encodeOffsets: [
                    [112399, 26500]
                ]
            }
        }, {
            type: "Feature",
            id: "4514",
            properties: { name: "宕囧乏甯�", cp: [107.3364, 22.4725], childNum: 7 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@JVz職l@V@Xn@ll@VlnX@@VWLn聨UVmUULVlUV@blnUlnXVV聞K聜xnLlb@lnbU@Vn掳KVV聞I@WXUlI掳VXb聜VVbnLVan@聜x聞J@_nJ聞a@wVwV@@a@IU聫@UU@WKXwWIXKmKUa聞a@U聜UUUk@@Umm聞albVUXVVKnL聜a@kn聝W聝XIman脻V@聞V聜LUx虏blKl聶nLVbklWb聛n@J脝IXJ聜IVa聹聶脝Klw虏@lUnWW聛nK聞UUK@k@mmU@mnUVaVU聞b@lVXV聫XIW聝聝K@L聛am@@KUwn聝WkkmVIV@Xal@@KV@VUnI@聸聞_UWWUkam@kkm@ka@m聝k@wkJWIU聫U@WXkW聶XkWWLUU聝@UakL聝W聶XV卤VIVWUU@anUWaUK@IU@Vak@@UUKWa聝聛@m@ak@@wUkla@mUaUklakwV聝炉炉@WWUkLkKma聝聶kLUnV`UxWX@Jkn@bml聝akkk@聝b@l炉bm聞聝b聛J聸b@VXn聞bVV@聞聝b聝JUkkKWVU@m聹脹VUUW@UVUJWXkVkKm聧UL@WW@U聞Vl@XXKW聞XJ@XVlmbUxnnm@UlVnV@XVm娄VJ聛b@職mLkK脟bXblVkn@l@bWnX`V@@IVV@聨V聞V掳n@@_na脝VVbUVVbUJnzlVUl聜XkV@Vlx@X聞Vnx聝b聝KUK@b炉聬VVUV聶L"],
                encodeOffsets: [
                    [109227, 23440]
                ]
            }
        }, {
            type: "Feature",
            id: "4513",
            properties: { name: "鏉ュ甯�", cp: [109.7095, 23.8403], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@nVlw聞@VJU聞聞IVVU職V掳lU虏V@聞l陇Ub@bUV@b聜@聞b@bUbl職Va聞KnLla@UnUWmX聧lJXUlKV@V_U卤Van@V拢nV聜I聞y職U@K@kn@@LVK@k@mnVl@VU聞LUxVJ脠UVIU聫聜aVkXKV聧VUXJ聵In`@nnV@Vl@@聞UbVnl`n@VL@LnKlVn娄Vl么XV聜nz聞@V`VL@llI聹ll@Vb聞b@聝mIX聝l@聞l聞IVJnbWXXJWb@IU聜nVVn@xl職@nVJ聞I@W聞U掳LUaVUUaVJVI聛wlKUalKnb@UnLVWU_@KVK@_職KVa聞@VKU炉VLVKn@la聞aUkU@maVU聞J@k聶@Um@XmbkyVaUIUU@KV@laVn@KXKWUkUk@聝aW聶UUVw@aXKm聝VaUUk職mI聝lUU@wUa聶xUmmU聶炉聶U@W聝LU聧聛mVIUym@U聛VmUa@wmw@莽聛m@aWLU聞聶JUIUamKmL@聶聛a聝x炉楼聝kU楼U@卤聞k聞UVmKU_mJUbkKm聞聝L脜脟聶_@WWUXUmaVUkK聶聞UWW@聛nVxkU聝xmL@KkKmbUI@K聝Lk脝聝bUbW@UbUJUXV`UnU娄m聨VVkxVLUL@llL@b@bkKVb@bU`m@knma聛L@a聸@@U聴WVU聝U@amK@akkk@@b@lm聞VL@VUVUb聝VVXUJUU@V@XV`lLUVVV@nnL聝JVb聛VlzUVVbVVnUVVU聞"],
                encodeOffsets: [
                    [111083, 24599]
                ]
            }
        }, {
            type: "Feature",
            id: "4509",
            properties: { name: "鐜夋灄甯�", cp: [110.2148, 22.3792], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@VJUXVVXlWX@V聶xVnX@@`職職ULW聨UX脜bWK@mULUUmJ@n炉b@l@VULVx聞x聜XU`VXXJVI聞V@nm`@nU聨VXn@lWVn@b@Jn@nU@Lm`@Xn@WJ聝娄U@@VnL聞lV@@Xl`nIlJnkVL聞w@KVK@U職aVL@bVKX聶lUUKVK@I聞V職L聞a@U@W職LUlVL@bU@@blb@VlbUxVbXUVJ@xVL聞U聞lV@VU聞bVLnKl聞XJ@L聜b@an@VanL@`VL職KV_UWl@U_聞a@WVInlVUUUVm@I@W@wVakIWm@U@聝XwlaVbnI@聝m禄Va@aXaVL職U聞禄@aVa@k聶KkL@KmU@W聝zUK@wU@VWUUVUUKUa@聛mKmbUK@_nWVaUkVaUaVUVLXKV聝VUVmVI@UkKkLm`UkW@Uw聛WW_聞聫UaU@WakXmK@xUX聝Jk聝UUWUk@Wl聴聬mJ@km@@aUK聛zmyVk聞a@kkWVUU炉lmU@@w聜kkmV@Vk@m脜I聝聜Uk聝a聝@Ub聛@m@UUU`m聛UbWa聛Wmb聶X聶聫XKWIXUWm@脜聝聶@y@UkIUJUUWLUW聝L@UkVUxW@kaWb聛KWnXxW娄n聞m`XLVlUbVbUx聶I@JmLUKUb@VW@@bkL@b@VlU@xk職@L@l聝xXxWXX掳V@VVVbUVV@UVVbULVnVJUb虏b聜aUb@VVVVInlV@VnXaVU職聫lI聞VUb"],
                encodeOffsets: [
                    [112478, 22872]
                ]
            }
        }, {
            type: "Feature",
            id: "4504",
            properties: { name: "姊у窞甯�", cp: [110.9949, 23.5052], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@VbXblVlLXWln聞wVV@VV@Un職WUXVb職聜@聛VWXa@kVK聞聧UaVaVk職UlyX@Va聝聴VmUwUaVU@U脠ymI@aU聧掳@職聶nWV@VaVa聛w@IV@VmnLVK@kmmna@聶聞聶VbVI@aV@XbW`U聞聞LUVVx聞@VbUV@bl@VLXblJn娄lL聞掳掳@n聶@K@UlLnK聞a掳LWbnJ聞娄U脪V聞UllLlVnKnbWnn聞V`聞w聜@@聧Xa卤聶n聶l@XKV_聞WVkVa@kVyUa@wU拢UW@聧UIVW聜@@a聴wWaX_WKkVmUULmak@UJUI@卤m禄聶聴k@m禄VyUIm聶nmmwnkUmVaVIU聫n_mW@禄Vk聞@VwkmmUXa@I聝aV聫m聧聴聧m聝@Wm_U@聛聫mIUW贸LmUk@laXmmkUK@UmKULUUmWUL聝@VakU聶@Ub@b聝录聶VUKWb@bUbn录@聞mJUakbWx@聞@VXnlJUb@x@X@JUnVVUVmkUJ@X聝bV`k@VXU`聶LUK@_mKUbm@@b@聞U`@nlV@b聞UnbVbn@@`VbUbVV炉bm@@聬mJXb@bVnUllVXUlbUl@LU娄VVm聨kLVb@b聶l@V@XlK@V@nUJUz聞掳m聨聛wmLmlXbWVU@UUUl聝IU@VVmV聛@@娄聜bXbWxX聞WlXVWL@LUmkbU@@LVVVJUblzna@WVn職@@l聝IUVnbV@Vl聝bkbm@ULUKV掳UL聝@"],
                encodeOffsets: [
                    [112973, 24863]
                ]
            }
        }, {
            type: "Feature",
            id: "4511",
            properties: { name: "璐哄窞甯�", cp: [111.3135, 24.4006], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@nL@xn@lKVk職wn@聞alLlaXV@聞lx聞bVWV聛@aUa@aUk@mVUnVl聞XL@JV@VxVIV聝X@聞b@bl@@`脟nXVlI@l聞xUnlVVLkllV聛聞@nmJUxnzWJ@VXLl聨職LVxnL@l聞Ll聨VI@V@lUnl陇Uz聶K聛職@聞Vl@職聞L聜l聞Ln職聜b@VnVVU@k聞a聜Knxn@VkVJ@脜聞UlakmWIUaVanm@_UK@UVWUa@kl聧Xam聶U@Vm聝聶VIXW聞@lUVknVlKVLX聨VX職W@b@Vl職nnVL@KXL聜Kn@lb@UnW掳@Va聞X聞WVb掳aVa@I炉aUkUaVKVw聝aXk@a聞a聜聶@wkm@alanUVw@alK@聛Umkw@U聝aUmU@WXUaUK@UW@Ua聛VWI@楼Xa@w@聧WW職聧V聝Xw聝聧U@mKUXUWVU@a炉kl聫@akU@UULmK炉VUVW@U_m`U@@xVbUz@lUbUl聝XU`WLk@m職虏職Wb@聨聛@聝xU_m聝XmmamLkUkKVkU聝V脩聝楼mIXa炉K聝bmLkK@V@Lm職炉@聝炉kKm楼kIWaUKk@@aVUUa聝@UwVU聝KV聝X_WaU@@bUJUa聝職@職mbnn@lULmKUnU@@J聜xUbUbU@mX聶職炉@V聨@bnJ脟z@VUVVbVxUn聞聵UbW@kz聶VUlUbVb聝聨UL@lWb"],
                encodeOffsets: [
                    [113220, 24947]
                ]
            }
        }, {
            type: "Feature",
            id: "4507",
            properties: { name: "閽﹀窞甯�", cp: [109.0283, 22.0935], childNum: 3 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@IlVVlnL聜@聹xla聞al@n聞VLlx@x@bXnV@@`mXX`lbnaVL@blV@b聞wnx聜I@xXJ掳聬nK聜l聞聛職@lbnKnblUVanKVb聞@lUnJVI聞VUb@V聜U@m聞L@Ul@Xw聞llVVX聛V@lVnlVn聞l@XVlK聞@@_VWVxX@lb聞U聞nV@@JlbnIlmnVV@UwVK@U@k掳a@mnIVVVK@nXL脝aVWX聧VK聶聶@_W@Um職w@UXWWkUUVWUIVa聝UkJ聶聬UVWbUmU@mkUJUU@UVa聛b卤aVaUIUmVKUaVUU@VUUaUUU@W炉XWWw聞w@k@Kl聶@wkV@U@alK@aX@@UmIUWUI聝@mmkXU`U_WJUnUJmUk@@amLU@UVW@UkU@@V聝bUWVUk@@wmKkUWLUW聛X@JmI聝lUkkKWKkLWU聛@UKWa@bU@@a@_UKW聝聛UUUmJmw@聧n聫V_@摹臒K贸LmbU录V脝@xUX聝@Um@wklVnUn聸lkaUV@聞lV聛虏WVklWXXbWlkVkIm`UU聝L聝UU@UW聝x@XU@@lWLU@kbUbV`UXllUV@bmb@LnKVbULm聜職聬nVVIV`X@"],
                encodeOffsets: [
                    [110881, 22742]
                ]
            }
        }, {
            type: "Feature",
            id: "4508",
            properties: { name: "璐垫腐甯�", cp: [109.9402, 23.3459], childNum: 3 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@n@VzUJ聜nV聨聞K@X職V職掳nVVn職wVb@xVV聞knJl聶VVUbn聞WL@bUxVVX職聞bl@lVXkW聝XwWa聛a@楼聜@nUUUV@聞JVkVVV@XUWanknK聜xn聧聝炉VyVI@m@UkL@W@U職k@aUalKn聧UUV楼@KVkkaWVkUVkUm@aWanI@聫n@掳aUUVaUa@_m@Uama聝V@akU@mV_@聝聛a@KWIk聝mLUK聝aUVU@聝k聝VUK@wUIWVUaVwka@Uka@aV@@aUKVk聶K@X@V聝b聶K聝U@JULVLkVW職UL@aUK聶b@VUL@L聝xUKmlkImJk_@WU@聝kmK@UV@聞楼XIm@@Wn_@KmVm@@I@aUmkXm@UWV聧@mn_@m聝UUJWIUWV_聛W聝wU@mUknVVmxU@@VUV@zU@UVW@聝K@職X@VLUV聝K聝z@J@VnX@`卤bUX聛V聝录聶l職n@xmx脻L@聜Ubn掳@XWVUxUVVnkbWVXV@X職`脝脠聞Kn聝lLVanIV`nLVUl聝虏聝V@V娄聞l掳娄聞w聜b@職nKnLVbVJ職IV聝XK@b聜n@猫nx@xVbUnV聜"],
                encodeOffsets: [
                    [112568, 24255]
                ]
            }
        }, {
            type: "Feature",
            id: "4506",
            properties: { name: "闃插煄娓競", cp: [108.0505, 21.9287], childNum: 3 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@XV@X掳掳U聞lxkbVlVb@nkbVl@xl@@b@n聞聜XbVL@Vl@UbV@@JVLXbmV@bVVUXUJU虏職W聞XlKVb聞@VVXKlX職WlXXWV@V聬XJlI@x聞l@nlbn@lln@lbXalIVK@聝Vw聹UVb聜U@aXylUX@@aW@U_UJmU聶聫n聛VKUamL@Kna@aVUkkVWU_ValaV@XK@kV@@W聞wVXV@聞V聞KVVn_lJlUXkWaXWlkXU聜卤kU@聝VUlb聹kVmUmlk聶炉脻聶聶W聛@mb@娄VxULm聶kJUU@聧ma炉w聝mkX@V贸J卤bUVUX脻Wk聬聶lWXXl聝xUa聝b聝I臒聶脟@U@mVUKkkm@UJm@XnWV@x"],
                encodeOffsets: [
                    [110070, 22174]
                ]
            }
        }, {
            type: "Feature",
            id: "4505",
            properties: { name: "鍖楁捣甯�", cp: [109.314, 21.6211], childNum: 2 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@VaVLnK@I職JVwUaVaUkWKn_m聝X楼WwXm聜LXalbU拢UyV聧聞脜@脻聶wm@聶掳聛l聸L脜U聝mk聶mw脹a茟L脻UUm@龋脝聝V_聞脫@拢U聝聝U聛V聝聞聶录U掳W虅聶脼VbXb么x@b@bmV聛@脟聝聶U脻@@蘑U`m聬@聨nxnIVV聜VX聞VL@`@bV@@aXbVL聜@XVlKXLlLVl聞knJ@I聜WVXXKlVnL@xl@UVVX聞a@UV@VlX@VUV@nK@bl@nVVIVmXIV`V_lWnn聞@VJVXnJ"],
                encodeOffsets: [
                    [112242, 22444]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/gui_zhou_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "5203",
            properties: { name: "閬典箟甯�", cp: [106.908, 28.1744], childNum: 14 },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@@UnUlJn聛聞w聜JU掳VL@bnV職U聞wlJ@X聝聨XVlU@klVUJknl聞UllL@bUJ@xULUl聝聞UblVkblbnw聜UXmla@聧聞wV@VK@L@UXaVKVLXW聝UVa@U@Im@@W@拢UKUakKWIXU@al@@llUnL@W@Un@@VlUV@VIUanKl@Xb@lmxVb@b掳b聛b@nlJVVn聛nJ@b@L聜V@ln聞@LmV@V聛x@blnVK聞nlJXIlw聞J@脪聞b@nlK@Un@UL@VVVVUUUVK聞l聞@VUVL聞J@UVUUw聞@Wm@聶聞UV聞脠VlbUb@J職Ll聨X@@x聞聞聝Lm聨k@@nlx@bUJUzVJ聞@@LVxUV@bWxnLnVVK@_聜K虏xVbV@n楼@aVI@b聞@l@Va聞Knb@n聜`n聛聞mm媒聞W@聝U_職wV@VlVV@Vn@n聞聵@nI@Jn@掳娄VaUU@聶聞mV聛VWVaU脜聞U@aVKn聝VbV聧UmmU@a@kUw聶m@aUUmUUJ炉聧lakU聜aXaWUUaV聝kk聞am聧kmUnVlUL聝VlJ@XU@UJWUUw聞k@aU@WbkW聝L@U@WU@@XUKmV@aU聛VwU臅UJUamUUVU脩m聶nIVJ@kl@XalJVn@KVL聹楼@UWIXWmU@mV聛UKnUWLUKUaWUUKVU@U@anUny@UlUkK@w@a@aVU聝禄UkVw@Wmk聴J聝脜mUUVmwXalLXWWUnam@Xk聝J@UVU@U@W聞@@U@I@Wl@脠nlw@KXLWb聞lVUkalKUU聞VVaV@@wnIlaUmkU聝KWU@KkUkLWa聝KU聛UWUn@V聝K@LnnWJUI聝VkUWVnV@V聶@@X聝K@VUIUJ@IWJkX@VVJ聶I聝VkK@I@UVaUWk@m聞@wnUWKk@mxk@@聞lV@b聞xmb@x@V聛UmLkU聝J@nVV@b@VkLVbU`炉I聸l@聶U_UW@UU@聶聶聝K炉wm@聶x聝L炉楼kI聝聶聝聜@bkb聝@Ua@聛聝m@kkW@XVbmV@聨kV@bWbUbV@聞娄聝xXlmVk@聝娄聶bkaWL@KUImK@wUK@VUI聶b@bmK@L脜y@akXW@kbWlXblL@聨ULUb聝`@U聶kUymX炉@m職UJU聬UJ聝L@Lm@@W聛X@lU聞Vl職Xll聞@l@脠k掳V掳聨聞X@VU@UVll@XUJVXUVm@@VXLWlnV@X聝職k@mVULnxV@@bm聜kL@VWLUbU@UVm@聝b聛@姆楼UnmJ@UUV聝kkJU職l脭U`UIW@聝掳kLUlUI@WVI聶U@mWKkXk@聝聜WU@bX職W聞@J@x聛X@l@LVl@x職LVxXX@x聜KnxVknb聜KVV@U聞L聞WlXU`@nUl職X@llVX職VU聞KlkUKlI@anKVLXKVaUIVWV_VK@VnLlU聞禄VKVL聞m"],
                    ["@@@KlKkUUVVX"]
                ],
                encodeOffsets: [
                    [
                        [108799, 29239]
                    ],
                    [
                        [110532, 27822]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "5226",
            properties: { name: "榛斾笢鍗楄嫍鏃忎緱鏃忚嚜娌诲窞", cp: [108.4241, 26.4166], childNum: 17 },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@VV@XkV@bUbWJU录Vb@Vnb@b職聞@J@b聝L@LV@UV聝lUI@a聶KULVb@bkJmx聞職lLVxknVJk聞聜xnKmnnL@bn`WIXlWLU@UxVbUVmKV聞XI@JVIVJ@U聞L@W職@@UmUXUlV聞UVJXImm@K聞L@UVmVXV聜聞LXblKlV@LXV聞LlVVnkbmJ@xnXl@職bXa聜@Vana聞脪職L聞m聜VnIl聜脼娄掳k@b聞@@lV聞nJlUn職聜VX_聞@lVlK聞聧職V聞UUxVLVWVIXJ職UlnnWlI@KUaUUVKn@VaVXV@na@聝mw炉@mUkJUamI@lk@@am@@I聞聝UmVImUU聫聛w聵聶@anUVaUU@LU@Wa聛WUXWW聞wV@VwnU@L@ynbl@@X@a聞J@nW@@Vn@聞lVLlxnI聞l職@@UWKU聝nIlJXIVllIVV職录XK@aVI聞V聜@@bn@VKXLVKVVVInw聞J@UWI@mX@WKnI@KmU聞UVJUL@V聞KW@@k聞聧@aU@@W@InJWUXwWI@W聝@炉wkaVaUIl@n聨ValIXWWI@UUm@anwWkXWWIUbk@UJmIUamKVUUU聛VVama炉VkIV聫VUlKnXVwX@@WVaUUVa@Il聝聛aVm聝kna聸wk聶UU@聝U@mUV聝職UVw聹l掳LVbnJVU聶炉la@mX@@UWKXU@aV_V@@JlkU聝炉@V聶nK@km聫炉k聞U@聝WU聛W@聛mm聝U@聶kmlU@wkL@W聝UkL@VmL聝J@b@V@bknUUVK@UVKUK@Uk@Wa@LUVVnUbmVk@@UU@@a聝V炉K@U@UU@WmUL@aU@WV聴w@聝聵I聞xXll@UX聜K@KXXVJna@wWa聝拢naUKV聧聞m@UU@mUma聛lm@@XkVm@聛U@V聝LmWU@kkWxU@@bVV@VkXVl聝V聝@UUk@@聝mI@KUw聞m@UmV聝UUwU@lwkV@IUa@mUaVIVKVa@w@U@聶UJkb@n@bmJ@Xml聛VUxWXkJmUkUUVW聬聶xUlU@聝aULU職mbU@@聜WXkm聝L@xUV@nUx脟m@聞XLWbnl聝nV聜nnUV聵聬U聜nVVz聞@lbUVVlULVb@V@nUJkwm@Ux@bWbUK@UULka聸J聛b聝U聶U@U@lUK@XUJmn聶J@bU@UwWa聶x@zkJWnUJUUV職VV@bXn@xVb@J聶L聶m@X聶w@`@bkb@VmXUV炉L@mW@@n@V@聜聝L@K聴IW@@a聝aUx炉@U聞m@XbW@@L聞V@bnVWVkKUzlV@b脝a@lnI@VV@@LnVVKUaV_VJVbnU@bn@聜聜nX@yVIVxXKVLlUVaXU掳J", "@@@KlKkUUVVX"],
                    ["@@UUVUkUmV@ln@VXVK@K"]
                ],
                encodeOffsets: [
                    [
                        [110318, 27214],
                        [110532, 27822]
                    ],
                    [
                        [112219, 27394]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "5224",
            properties: { name: "姣曡妭鍦板尯", cp: [105.1611, 27.0648], childNum: 8 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@UkV聝@k聜W@Xn@@K聞KVIV聫VIn聶掳@nWVz職l@V聞_VaVK@聧kKWaXklaX@lW@b脝z@KnL@a職aVJ@UVL@xnLVJ@LXKlb職a聞楼l@nUWk聞w聝楼U@VaXa@amLkU聝Km聝炉k聝mkIUa聝KUIW聝kKm聧@anw@mlwXI聝m聝Uk炉@a@amU聝`k聛kKWVkxmUUak_mJmw@w聞mXUW炉X聫聸_@WnI@aVwkWW媒脜聝U@WLkU聶aUbVV@lUVVnm@kUmV炉聶kK聶L聝wmV聛UUaWV聶a聛aWw炉w聝脠@VULUVUU聝K@nWJkI聶l@Umxnbm@kbUJ聝a炉bUbVxmLUV聶aU聬@VUUWxkVVV@bUV@XWbnlUb聝bUJlbUV炉b@z聞`WbXnmb聝a聝wUwVW聛U聝bUxmbU@Uam聧聶聫@聧V聝k聶V聧聛a聝wVaU聝WI@mUK贸z@lUl脜@WI聝b@xXxml@XklULWKU聧mwUa炉KUXWJkaULmKkLWbkKUV聝Im聝聛聝Wa@kUaUL聝W炉L聝K炉@kb聝L@b聶x@J@bmnnlU職lzU`U@@U聝b@聞m聜n娄掳bU聞Vx@bkVm录mx聛@mk聶mVV@bkxVn聞aVV@bU@mL@b虏`lIVV@lXLl職聞bVxn@@bl@XllIV職nbV職n掳掳wlbXw@mVa掳聧lVnU@m職聶VLVbn@@b聞@@WVnUV@Xlxn`VznJVb@L@bV`V@職Unw職U聞@WUXKV@UUlmUUlaXalL職m聞b職IVbnJVIlVVaUUnWVXn聜VL聜k@聝nWnblnlb虏x聞xVKVXlVXLVW聞LlUVJna@wVL聞录@JVX@`@nnx@nWJU@Vx@XXK職聨UblxU聬職掳聞LVKVVlL@KnbVUnJ聞IlU職聝nKl拢VW聞x聞IlJ@n職V脼UVVnb聜VX@V_掳lnK", "@@@UmWUwkU@Um@@VkL@V@聞聞聜V聞VkV@nbVa@聝"],
                encodeOffsets: [
                    [108552, 28412],
                    [107213, 27445]
                ]
            }
        }, {
            type: "Feature",
            id: "5227",
            properties: { name: "榛斿崡甯冧緷鏃忚嫍鏃忚嚜娌诲窞", cp: [107.2485, 25.8398], childNum: 12 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聜V@I枚alK@UV@@KUaVIVV聹LlaVbVWnX@聜@LnUlxl@naVLXVVaVU聞J@聧lUUanWWI聞@VlV@Xb聝b@V聞n@VmVVbk@kU@V聸V@X聞J@zn`ULW@kK@_WVUK@LUb@Jlxn@nnWlU@@b聞x@XVVU@UbVb聜@n`VI@VVLUlUIUV@KmL@VV@XIV@@lVLVmXV聞@WLXLW@U`職nkb@Vl@UL@VVV聞L聞llX@`lIXb聞J聵IXW聞L聜aVL@聨XXW聜聛蘑聶b@bmK@L@掳@Vnxmx職n聞K@xVn@VkL@V聶L聝akbl`VnnxVnUl職職V@@VVXV`@職聹k掳JV_UalK@U@aUU@m聞IlVnK聜V@U@wna聝w@akU@聝l@nwl@XLmV@xn聝l@VXUb@V@JlL聞U職JUI@UlWU聝nLVUUaVwV@XKWkXJm_@amKnmmL聛wl聝UIlmUwkK聝聶nwlI@aUaVK職L@bVJ聞kVUU@@K聞K@a@I聶聝@ama@UUaV禄XIVa@alU@WUU炉IWVUbkVUKWLUwUJ@zmW聛聛m@@amVUaUIU`VbULmU@KU@@UmJ@k脜b@akUVylLXUmU@a聝U@KX@Wan@V聝掳@Vw聞b@bX@聵J@L聞K@聛@U@mX@@n掳KVUnW@Ula@a@_職x@W職n職K@IUa@wWm@aUUU聶VVVIXmlI@y職wXbVxV@@a職InmVI@WVL@k@V職V聞V聜a聹IlbVK@VVLXa@aVwn@lxVI@m@UUaVKUkVUka聝@UymUV聛聴聫VUmmU聛聞mmkXaWK@聝脠nVw@mVU@w聞KlnXW@聛V@naV聶VKUk@KVIUW聝@mk@KXU@Um@@l聛V聝k@UVJna@UWa聝L@a@聝Xa@kmmVUUk@mkk聝amJ聴ImJUUmI聛m卤aUUkambkamVUU@VlbUbVV聝xX聞WVUU@VUakU@UmUV聜U@mnUVVnUbVJ@b聴UW楼kLVamV聛kUaWJU_UVWKk@@nl聞UVVJUX聛m@Vm@UnVlmbn聬mJUbULU@@UUKWV聛IWxnJVb@xUL@bUJWIkx聝bkb@xVJ聝bmU@k聛W卤LkKUkVa@a炉am楼ULkal脩lKXUW聝X聧聝aVakImV聝@ka@聧UU聝J炉a聝X聶mmb聴KWU@wUU聝aUa聶KmU@UXlWb聴录WLUKUb掳聞UlVbkbVL@V聝職聝J@nVlUbUXmJ@VX@lbUbU@@bWb@VnLVJ@bVVUz聞聨VL@lnL@b聶VVVULmKUk聶Jkbm@聝xVb@V聴k聝KVnnV@b@聨WXU聜聞nV聞l聜聛VVXVJUXlVXbWV@VU@Ubk@@KWbUUmL@JnXV掳XJ@_聜`UbkXVVl脝kb聝@VLXVV@聜V@k聞KXX@`V@@n"],
                encodeOffsets: [
                    [108912, 26905]
                ]
            }
        }, {
            type: "Feature",
            id: "5222",
            properties: { name: "閾滀粊鍦板尯", cp: [108.6218, 28.0096], childNum: 10 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@掳a@a脠bVUlU@aVKnVV聬聞VU聧lyX鹿lWVa@聧U聶V聝nUVU@m聶聧@mU聧l@聞m脼w聞@聜xnIVbna@KVI聜J@k聛wV楼聝UX脟VkVW@kkKWU@aXUWmnIVa掳VXbmL@VVbnVVVUb聶聬Vb職JVbVKXkVKVanU@aW聛nWU聧Wa@U聶聫nk@mVIVK@wXxlLXbVJV聧lK聹bl@VI@m職aXalVV聞VbX@@a職alnkx@b@V聜b@Vnx@bVVUXn陇WXn@Vl@Vlzn@職`@I@KUU@聝V拢nam聫VkXa@aVK聜nnU@anVlK聝a@UUU@amk@禄k聝U炉@a職聞VWnkWmkImU@akaVm@禄VUV@UKnkW炉XWlkUKnIWa職@nmlIXmWUnwUwWm@wULmaUJkIUa聝aWa聴klwkwmJmU@bkJ@XUJ炉聧W@XbWbUKUkWJUUVKnn@UmmXUWa@mU@@U聛I@WmXVykwm@kaULWwU@炉聝lKUUVU@mU@UkmaUbmV@b聴職聜xV聬nVUJVn聝聞@Jn@@bl@@knJVblInV掳@nx@聞mbU@UWUbm@ULVVVb@LkJmXkm聶VWIUJUXUKVw聝V聶U聝聨kLkU聝@W`聛Um聶kVmIU聝@k聝@@a炉l脻楼k聛mJ聛U聝n聶K聝脩mbUb聛@Wb聶ak@mWU@Ub聝UVVkLlbUV聝kXaWK@Lkx脟mk@@X@J@V聝@@X@VUV@V聞IWln@mbXVWXkKWbnxVUnV聞脝聵Inl@XUxVl聞录UV@b@b@xlLkV@VmzmV@b@VUVVLXVVbVLXKmVVLU聜@nnVWXXJ@V聸娄UK@LUmkIWbk@@lUImJn職V脪VUnVVbVIV臇UxV聜@bnUVL@WV@@X@V聞KlXXaV@@b聝lVxXVVIV@@WkI聞UVKUkVmlnn聨聝bllU聞VbXVWb聛blVkb掳聨VInVVV@b職nVx@l@bnVVnU聨Uam聞UL@b聝VV脝UbUXU聜聝n@職VVUb"],
                encodeOffsets: [
                    [110667, 29785]
                ]
            }
        }, {
            type: "Feature",
            id: "5223",
            properties: { name: "榛旇タ鍗楀竷渚濇棌鑻楁棌鑷不宸�", cp: [105.5347, 25.3949], childNum: 8 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@VL@Vl@@IXW@kVUVbnW@XlKVVnU聞VlL@b聞aVb聝b@xX聜掳脭UxV@kbm@VxkxWJ聹聞V娄聝聨@脠n職VK職xW聬XJmV@n聞脪@xVbn@@blLk`VX@b職職la虏JVUlnn@U卤lw@wnw@mlwVIX@@m@klKnk聜a聞KnwmmXk脝聧Vm聞U職楼l@nb掳聧n@聞aVwVmVIV聫nI@a聞炉@m職U掳聝l@@VnI@JV@UV@b@IUbVJmX枚潞聝zllUbVa@aXUl@聞U@llLnKVaUa@UmK@U職wV聧聞bnKV@VwVK@UX聝V@Vbn@聜w@U聞WnX聜@聞a@m聞I聞聶@UUKlaUaVk炉聝VaVLXK聵禄XaWk炉m聝k臒wmW聛@mI聝Vkw聝JUI職脟VwU聶UkVKk聝m@UkmU@W脜wm拢聛V聝聞m陇炉IkJWa聶_聶lUbmJ聛z脻Jk聞聝U脟VU聞聝聜@bU聞脻n聶m炉LUb@`mL@VkL@V聝Ummk@UU卤聧Umka@kU聝@聛姆ymUkk@mmk脻mUaUakImV@V@V脜L聝娄聝JUXmJX職Wb@n掳脝聹x聜录nV@LlbU聨UbmL炉@脼bV陇nbVx@bUVlblI聹聶@KVVUnVJUn@VlLUlmLUUUxmK@I聛@@VW@@bU@UJmUkLVVUl@b@V"],
                encodeOffsets: [
                    [107157, 25965]
                ]
            }
        }, {
            type: "Feature",
            id: "5202",
            properties: { name: "鍏洏姘村競", cp: [104.7546, 26.0925], childNum: 5 },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@么yVL@nXJV聞Ub聞x聜bU聨l職U聞@聨職聬n聨VbV@naVw聞a聜VUXVx聞x聞bnaWmXa聝_@y掳aVUkaVI聞aVamkXa@WVU@aUUlUXwVV@UV聫職bVUnKUwVa掳a聞bVIlan@manw@V職klJXI@m聞LVVVUVK@U聞脟聝k@KUa@UkaVU@UVWV_XWVXVWlLXKlLXa脝K職wVL@akKm@Uw聝@@XUVk@V聫UI@wWK@aUV聶I@UkK@聝mL聶W聝@kImJ聝U脜VmkXUW@UJkx@nmx@xkxV虏m@kmUV卤Ikb聶聶@aUWl_kK@am@Ua@w聝脩@mnUWIX聫聶wULm聶@脟聞聧U楼聸聝XIlwUwn@laU@Vw炉脫W聛@w聞aUa聝b@akK聝UmVUUkL@WmXUaUV@lWX@Jk@@UUKULmLUJmzkKmVX掳V職UnWKUL聶聝聝L@mU@UnVJ@b@聞UV@X聝`m_@l聛@@bmbXJmnn職@掳聵wnn@聨VLX@V聜@nVl@nk@@b聜l@nn掳WlXzW`XXVKnUlxVbUb@聜V聞Xb@聨聜聬Vx脠bVlnbmn@聨kVUL@聞聝聨mLUVVL"],
                    ["@@@聝@UmWUwkU@Um@@VkL@V@聞聞聜@聞V@VkV@nbVa"]
                ],
                encodeOffsets: [
                    [
                        [107089, 27181]
                    ],
                    [
                        [107213, 27479]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "5204",
            properties: { name: "瀹夐『甯�", cp: [105.9082, 25.9882], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@lL@bUK聶x脜LWbkKWLkKUXUWWXU`UX@VUVlb@VVb@L聞l掳xXx聜b職bXUVb聜VnU聞x職KlL掳職nUlVn@UmVU@kUUVa職blVXKV@脝聞X镁lXUxnU@mVK@_@ml@UU聞@職blU@KnLVyUw聞@@Umk職WVw@UVK@VXzVK@n聞VVUUW@kVJn聛la職@nKW聶kaWL@U聴聶玫b@J聛U@mU@@_WW聝L@l聛UU@WUUK聞@lak脜UUlWVa聛_@`WIU炉mW@InKVVXa@Ll@VaV@@UXUWakUVWUIUW聜Uk聛U聝聝mV聛XW@聧@amUUm聞L聵l@UUa聞wn@la職IVlnLVKUU職U@amK@kUK聝聧VyUU@aUImK@UXa@aV@VakaW@@UnIVWVaUk聝b聛@mW聝X@V聛xm@UaU@W聞@VULUxU@mL聝aU聨聶x@VnL@VVbUbmLkK@k聝Vk@WV@bUbVakk聞y玫鹿nWUIVa@J@aVUU@@ImJ@Uk@炉聞聶V@n聝掳@bmJU聬UJUnUx聝bm@炉聨mak@聶娄聝VUn脜聨Wlnnmx聝L聛bmlkL@l@nWVnl脝U聞VnIlJ聞@職XnK@聞lL@V職JVU@bXL@xVJU聬l@VU@W聞@Vxn@"],
                encodeOffsets: [
                    [108237, 26792]
                ]
            }
        }, {
            type: "Feature",
            id: "5201",
            properties: { name: "璐甸槼甯�", cp: [106.6992, 26.7682], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@n聨lLX聞VJ聞LVblJ聞n掳ln聞聞LlVnKlU@聧nUUa@WlX@l聞n@聜Vb聞@la@a聞聛聞職lJ掳娄聞K職wn@掳x聞LVkUmmwUmk_la聞b職K@UlK@UUm@w聝L聶mnwmw@U@炉@KnL@a職a聜摹X聛WW@聧UK聛b聝KWX聴J聝IWakJ@_kW聝k聝KUU@UVKk@@Ula聶mV_X@WKXK聝@WUUnUK@kU@WJU@@UnK@LVUVJVkUK@UUJm_聛@UaVaV@UU@W聝w@aV@Xkmmm@kw@IVa@KVLXU@`lLX@VKm_@y聝I@W聹U@UlVl@UanU@U聝m@U聞aWaU@Uk聝@XJmXVbkV@聨聝IUVUbWUUKmbk@kwmV@K@聛mWUXUakb聸KUUUJVb@LU@@VkL聵職@VXKlbX職mL聶@kbm聜UI@lVXUV聝U@mULWy@UUL@VUx聶Xnl@V聝@VxUzmK@LkV聶a聝@VVk@@n@`UL@nmV@bmJ@X聹`W聬X掳WV聝n@xnxnIl`VbnVlwXUlLl聜聞_nV@b@bl掳聞V聞nWJkx@nmx@b"],
                encodeOffsets: [
                    [108945, 27760]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/hai_nan_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "469003",
            properties: { name: "鍎嬪窞甯�", cp: [109.3291, 19.5653], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@脿庐录jpnr聮``聨pRVH脢聵脤陇聻Zt^J脰A聵[聠C芒lT茅bQhRPOhMBcRSQiROE[FYdGNOEIH]MgEAMLLIAG_WMCSL@ED]PCLYC[ZIHgjSxJTMbHNEFCMEE_HSDFHSLECRNSFDRICHNADGPI\\RZGIJTIAHLDQOHG`GTNCOIC@eIGDWHIS[kiE[FMbEC聛ZS@KKS[FDWsCeRuU_DUQNOE[LKGUBM篓EDQP@HWHGDIm聫X聝Cog聺_~聥I_fGDG|QDUWKBC\\ore|}[KLsISBHVXHCN`lNdQLOnFJSXcUEJMCKSHOUMDIm_聥DI`kNDIGEYFM\\YPEEIPMSGLIKOVAU_EBGQ@CIk`WGGDUM_XcIOLCJphHT_NCISG_R@V]\\OjSGAQSAKF]@q^mGFKSW^cQUC[]T}SGD@^_聢aRUTO@OHAT聼聰"],
                encodeOffsets: [
                    [111506, 20018]
                ]
            }
        }, {
            type: "Feature",
            id: "469005",
            properties: { name: "鏂囨槍甯�", cp: [110.8905, 19.7823], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聙h牟陇莫炉LQDaF脽L[VQ矛w聙G聜F~Z^Ab[聙鹿ZY枚pF潞聽lN庐D麓INQQk]U聭[GSU漏S_颅c聥}aoSiA拢c脜聛隆漏EiQeU聧颅qWoESKSSOmw聼膰玫Wk聫脿mJMAAMMCWHGoM]gA[FGZLZCTURFNBncVOXCdGB@TSbk\\gDOKMNKWQHIvXDJ\\VDTXPERHJMFNj@OwX@LOTGzL^GHN^@RPHPE^KTDhhtBjZL[Pg@MNGLEdHV[HbRb@JHEV_NKLBRTPZhERHJcH^HDRlZJOPGdDJPOpXTETaV[GOZXTARQTRLBLWDa^QAF`ENUPBP聟\\Eji`y潞Ev氓脿"],
                encodeOffsets: [
                    [113115, 20665]
                ]
            }
        }, {
            type: "Feature",
            id: "469033",
            properties: { name: "涔愪笢榛庢棌鑷不鍘�", cp: [109.0283, 18.6301], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@陋VLP`@PEdNRAHOPEAKHEVL`GZBJfvdTAXNNTZJFPrHHNpKTD\\ILHbEVd^J聜OHLh@NNBnHP`\\xH@NBRLJTl聨Nv_^CTLd@bNDVFbxdFV聙UPBTKOGEOUO@OEBXQP[H_EI\\EbeYa@UO_J聥MEJ_IEDKJUGMDcNUd_FMTEJSGoZ]EIYGO[YW聭gEQ]a@WHEDQKUSDUGAbYBUpSCYNiWqOSQEoF[UcQISWWN聛MSDe_cLQ_UBiKQOOASQAWgS颅膩]Za聨SP脻Z]XMXS聦[^oV脣NgNKlE聽R么E酶"],
                encodeOffsets: [
                    [111263, 19164]
                ]
            }
        }, {
            type: "Feature",
            id: "4602",
            properties: { name: "涓変簹甯�", cp: [109.3716, 18.3698], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@庐膫hTBXTRPBRPjLVAR`dKf`TC聜NXMTXRJVdE\\FpTRrPjXZMTDVoZABaVHTCLVCRGF@X^bFR聮hZXP\\ZHHMA[^wBWXJlW陇EJ[bCTOF聥WWMm@ILMGWQ@DQ^QNWFSHEbF`OXNbO聞VNKTEPDTLTCCVTREfvfEHNbRAENH^RJXCFHNFRpVGHWISDOTMVCZeGamaLoL脹D鹿鹿臈gsia{O懦E聴Tt聣l脡聜wr}j聼R卤E{L}j]H膮K脙T[P"],
                encodeOffsets: [
                    [111547, 18737]
                ]
            }
        }, {
            type: "Feature",
            id: "469036",
            properties: { name: "鐞间腑榛庢棌鑻楁棌鑷不鍘�", cp: [109.8413, 19.0736], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@bRFnHNbH聦gN@NPEnbXP@bND`NT\\@\\QZb@`@J]V@Xh聻DpW聞n聬CJGHGXO@CR搂FANHVKLF\\MPVR`CvVfQtDPKpGHG@S`WJP~^dSTHWX\\RHTFACQTIAUPOU@MG__IaYSFQK聭NSbORHXCZeTFJg聞B`YBMNMFi~IVDV[tGJWXGDQRGF]聢JrALgESLSAYDGIaFeXQLS\\MKSLSQYJY}eKO[EHiGSaK[Yw[bmdURgEK^_kcSGEOHKIAS]aFSU@Y]IWFUTYlkP_CUOUEkmYbSQK@EMWUuAU\\M@EpK^_ZMDQ^OXwC_ZODBrERURGVVZ\\DTXcFWNIAWJWAYUUFYEWLQQaCIZeDM`cLKRGpanJZQd"],
                encodeOffsets: [
                    [112153, 19488]
                ]
            }
        }, {
            type: "Feature",
            id: "469007",
            properties: { name: "涓滄柟甯�", cp: [108.8498, 19.0414], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@潞聼x聥JYZQ聰I聤YXLl@dR\\WZEn]bA\\S~F`KXaDeTiNO^EEKWEDQXITBXaWaDQMUJOIaTWf@NJV@dSxGZ聣Fu_聛@WMKAU聢}AQ@MwG_[GOAmMMg@GK聛P]IUcaFKG[JSCoLGMqGEOYIMSWMSBucIeYA_HUKGFBLOFGPQBcMOF_@KO漏UAtERadwZQ\\@脢J脪g貌U莫RlR掳K漠V聨LJ"],
                encodeOffsets: [
                    [111208, 19833]
                ]
            }
        }, {
            type: "Feature",
            id: "4601",
            properties: { name: "娴峰彛甯�", cp: [110.3893, 19.8516], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@艅Z苽t蘑卢忙脽Fuz鹿j_Fi聠[AOVOFME_RBb]XCAKQKRSBQWSPY\\HbUFSWSPoIOcCOHIPkYCQ]GdGGIFQYgSOAQLK`MFUIGa@aQ\\GGUFcHKNMh@\\OYKAigsCgLSF]GOQO]@GM]HyKSHKPW@Pxi@EMINYREXWRQ@MQcFGWIAwXGRH\\yDI`KJIdOCGRNPNtd\\UTMbQYi@]JeYOWaL[EcICMUJqWGDNZEXGJWFEXNbZRELFV]XQbAZFrYVUBCLNFCHmJaMIDDHXHEhQNXZ_TARFHVB@DTQIRR@YHAJVnAbKFUEMLd\\c^脥脼"],
                encodeOffsets: [
                    [112711, 20572]
                ]
            }
        }, {
            type: "Feature",
            id: "469006",
            properties: { name: "涓囧畞甯�", cp: [110.3137, 18.8388], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@^J@ZTVbET^JBGLFPTHld]`FLQhcVanx\\\\ZbLHTGj\\FLP~fIZRZPVTQFSVAFJE^NDLEE[~LjsxVTG\\NZZNGlLRRGLJTV@hPZANN^@T\\NEPPbDZXO`d^HSvcJDIV\\XZAJUFCLNP@PQ陇@[茂K聺L脩I脧]脟E卤I{u聝颅Y艣U膰FcYUmsVeBSVgB[RO@aYYPO^]@UVaNeDShMLG\\EfFVE\\F`"],
                encodeOffsets: [
                    [112657, 19182]
                ]
            }
        }, {
            type: "Feature",
            id: "469027",
            properties: { name: "婢勮繄鍘�", cp: [109.9937, 19.7314], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@T\\GJCXJH@fJDDPNCNJENN^NLHBNSx@DDYbBLLDRbjZTj@`XXTlG^Xr@PJLW\\WLTlWR@HDJTD@X_PO@STMDNTMVV@NLDM`M\\XM\\JNBH[PYZ聡煤Yz鸥`膴\\脦脻d]c[NKVFLEBaUmBIZGQ@JQSR@CUAEGBQ`SWYRMFgWGCGJCbNnIDGMEDKVAZUEqBYRa^WEUFKYQMaFWXEHIFWMYHCrXVIIiaK@aMCUYNSIISTwXALKH@XWXIEIJQCG[IEQDE_XSBaa[AIPW@]RS[FWS[CD]PEBYNGFSaSyJG]@ugEUDQlGHiBKHUIoNSKqHFaPMICK]UUHIPDJMuCA[SCPIDIOILGAEmU[POPBVSJDREBGS[QXWSGcT}]IO_X@TGHoHOLCX\\ELT@LYTD聜aFENF\\lj"],
                encodeOffsets: [
                    [112385, 19987]
                ]
            }
        }, {
            type: "Feature",
            id: "469030",
            properties: { name: "鐧芥矙榛庢棌鑷不鍘�", cp: [109.3703, 19.211], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@D\\RV]dTXELnHr]^@LETBBRTHPi^[@U`QTHDJ`MGSogDIPKdJ`WVNHCXHl_DJR@AH`FBVPUJLHKNTJOFFZON[ZEHFCJlMJ_聦Cn`CJVNGPLTNDFIdVTWEIPmRKMc_kDMWGGUTAtJLK~\\f{pqD[LAVXRCH{HC`e聦J`}@W^U@I@_Ya[R[@MSC_aMO@aWFmMOM@聥haGGMEmaQ[@MESHaIQJQ聟聟MckBIw[AOSKKAMPSDSLOAV_@@`KJRbKRDfMdHZERgAWVsDMTUHqOUr@VQXTT@T聝fg聜L^NH\\聬@heTCZaESNObHP聝HeZF\\X^ElM^F^"],
                encodeOffsets: [
                    [111665, 19890]
                ]
            }
        }, {
            type: "Feature",
            id: "469002",
            properties: { name: "鐞兼捣甯�", cp: [110.4208, 19.224], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@TP\\pATHTGlZDJGAQjE\\Rb@jVBDCN`JZ[NCNHNXbULPrP\\KNbMTLjJJRFP`聯pNLZz^FLRHjVPZ@hxVKbHBHMNNJFRlLzGPnNHhIrHHADcPWdUAmEMVQDSKYHY\\EhBN^HpXGNDBNNBnI聬脽聥脜_g{鲁So]脙拢@ORO@KMEDIVYB[WJUICudGTc]P_YWaCOOMFS[]@MMYBgOU@ISHKQQkKMHYY[MSHwUit}KF\\KFMCF]EIUBETSROUKTLT[NKTWREfJbCHBZKTFTKh"],
                encodeOffsets: [
                    [112763, 19595]
                ]
            }
        }, {
            type: "Feature",
            id: "469031",
            properties: { name: "鏄屾睙榛庢棌鑷不鍘�", cp: [109.0407, 19.2137], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@`Z膜d聳`貌眉聢聵聽聯BSPGP@VSbQ`聡@]HC~T^SE]N]FkW]E[fY聞GGOPaTMbFDYfS@g[聫MGK]h聛聞e@SSSRW@UVqrPVGNStCXUhBFQGYNcCeLQQaLI@_`@EUwcEaCUaMc@SK]Du`聧MSkKI聡~BVNL@X`聜EvY聤wHcTU@MIe@SXJbIPNVCRXbWbSAWJCRXFFL]FMPSjCfWb_L}E[TaBm^YF[XcQk@WK聣Z聯JYRIZw聦鹿聽"],
                encodeOffsets: [
                    [111208, 19833]
                ]
            }
        }, {
            type: "Feature",
            id: "469028",
            properties: { name: "涓撮珮鍘�", cp: [109.6957, 19.8063], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@jD`hNd\\^dZ盲d膾H麓Op@聢霉ZY\\OAGIMN[[W_NCNMKU@NUMSNCTSP@`O@WSCCI@GXQSkXKX[IK@OWqH]SkWW@_SiiYQaKCAKZaCCw@MTGAMKM]FMMIMDSM_HGHRPKCBGSJJIYH[QOJCHMBDGQJECMTDQKFGTCEGTF`NFEDMFaGSNwIiTGhYJD\\KZODC^@FTKND`XBHKJNKFBNhG^FJMPcHEZF\\QPRjQTAdgNOPgQaRS锚"],
                encodeOffsets: [
                    [112122, 20431]
                ]
            }
        }, {
            type: "Feature",
            id: "469034",
            properties: { name: "闄垫按榛庢棌鑷不鍘�", cp: [109.9924, 18.5415], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@R]NC`YL]FoN@V[vBXVFNL@TRZalnVFVP`DlOZkVSXEE_F[EUFeH[NKTgfCbMVU^@P]ZObZP@\\QhATUfAtUas帽聺i膩EoI]eY钳@aKmae聝WuC潞K脺KpnbHbYfUDSNCPJTRAHJTDJSfDNLHXC``VBNGTYCQDIXMDSP@xLNEFRNXBIpVNLXah@RgF@`qOML@LJNSPLbaHAh@Jdj"],
                encodeOffsets: [
                    [112409, 19261]
                ]
            }
        }, {
            type: "Feature",
            id: "469026",
            properties: { name: "灞槍鍘�", cp: [110.0377, 19.362], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@\\OnVBFKHPJCJOJTDB\\vDINOCGJVVL^JDONEbrGTLpMVJLGjAHGRkVChF@vH^zIbTETMHAZOFC^\\DXT\\EffAP\\PdAV@UIYfS|S@YPICMeM@sC[_A]VQEwyHSMuNcAUlQJMVGMS@mVBZPFO\\CS聫FQK[LqDMACiUa@[QiFBRIHYCHkGSBS[oSOqB聡IE^QHCRWHIXsHU\\UC}JEjMNAN_Z聝AIhSEYfWDQGaPMTL聮ERZTJb``NHV@"],
                encodeOffsets: [
                    [112513, 19852]
                ]
            }
        }, {
            type: "Feature",
            id: "469025",
            properties: { name: "瀹氬畨鍘�", cp: [110.3384, 19.4698], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@JjDNdJ\\FbKPXfZ^Ij@RZNaVSc[MsMOHQPDJcLIJ_zCG[HQxWJBHXdENRR@XQFWZQQGOFSWUCI[WCJuRGLXNMPLhCl[Ta@SqGgJMGOmyHkKEQMINMAGaGULgwY@UOGiKQ]EYyMK聰oO_QEIIKiNSMa[LqOKOaVMWMGMDY\\_IKrL\\ERT聬[DEPYOUA@nNTUHINkRBVMdNvGTxzRF^U`BD\\@tfNDNOJ@Z{TeTJZ@VU聙cB[OBOeeQT@^OXBJb\\AbWTF`RCJFH\\RDJIJFXW@WLGBKxWTSJJMTVZND@bbL"],
                encodeOffsets: [
                    [112903, 20139]
                ]
            }
        }, {
            type: "Feature",
            id: "469035",
            properties: { name: "淇濅涵榛庢棌鑻楁棌鑷不鍘�", cp: [109.6284, 18.6108], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@FJp@fxpQ\\ApN\\GNPNBM`HLMrXLXj\\PEHnI@WUCEM\\GTc\\GZYHTPBHRCPTd聙H\\K\\@HXi聳BJILJJAVNTOZJNtFPC`YxDPWci@IBgbGKaTOIM@KNKrP@_hE@QbgKWUMJoWAQMFEKM@wTONCJWRCZDHSAM_UD_GWMKeCITSCGIQBGXUHQoMEEGWDQIG]FMQBMaFGueFeSQDUSDSKOCSFML聝UaPWM_PaEGFETMX]RCRR@HXKN@JNnXXE聦SPaDI\\拢FkXWIAX]xB\\GN"],
                encodeOffsets: [
                    [112031, 19071]
                ]
            }
        }, {
            type: "Feature",
            id: "469001",
            properties: { name: "浜旀寚灞卞競", cp: [109.5282, 18.8299], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@TCNOLBTLBPx\\AJdl聠NR聠RIbJTGNF\\@RcIYbmHoLQdKN_fCJYbDRRXKZFVEZVXBXIJBXMdESW[CUYHUVQFQAqsEIMPYMSBUIIJKAIj聲GW[@[LGScDOGQOAGSYZ[HSd[HFNVD@XmJFG[OWiWKNqGKN_MAMO[HoM[BoRewo@Y^HpITSFENc`MVCdHNIVCLJFI`NFI聦P`@VZbaf[FFJG`O\\WRFA@PVPFPPH"],
                encodeOffsets: [
                    [111973, 19401]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/hei_long_jiang_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "2311",
            properties: { name: "榛戞渤甯�", cp: [127.1448, 49.2957], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@V聬脠脼@聨kx聵nX聨掳V脠a掳V@k么w聞b聜職聞JV職kXlVUx聞聞@聨lL@xkVV掳聝聞Vb聛xlVUnVxk@聝聞聝Kk聨Vb聞Il聫聞聬@掳kVl聞@聞聶l脝nkll@@V聛聞VX聝聨職@V聞虏bUl聝VlV聞U聞V脟n@nkJ職聨lkVb聹@聸x虏V@n掳VUnlKU聞n`@n掳bWLnVUblVUVVbknV`掳kk聨l@@V掳@nz聞J@X職xlWXb掳n@b聝臓lbXb聶bVb聝J@V職b聞a@聞聞@lbUb職Vmn聹@l職VmnIW聜聹@Wb脼@聞n@x掳@職聞蘑a茞茅蠚n聹聞聜l膶炉臓呕脠wm聧@聫么莽U聧聶mm拢Xy掳UV聛聶聸@w脠拢仟炉k玫脻莽U脩職聶U姆聜聝蘑kV脩聞聫脝聛職聫脼U掳n艓楼膶U膴x掳m掳娄偶V茞聧聹x掳聝脟拢@y聞U么n脼聝脝@脠膲掳K么娄職W聞kWU聴b脟禄@聶脠臅W脟脠拢扭U@聸n拢脝UUKVamanw脜聝m聛脻J炉k@J聝IkaVaUU脟bka脝脩kWm聧脻U脹聶聶脻@聶聝wnU卤聝@聫kkV聧炉KUk聝J聝录U娄聝職脜@贸w姆a姆暖V楼Ua贸@脜wm聝聝_kV聝w膲聜膲聧mmn_V禄聶a@U聶聝Vw姆贸聝聜U娄聛L谦茅贸X脟m艒L菗脟姆x脻k聝聝膲聶k聧makbU亩掳@W录聞聬@b聝職脠脝@臇聶L聞l@聞掳J炉聞m聬kl炉L脻聝卤L聴amJ@录聝聞聶V僻U贸聞聶UX聵膵b炉艅Vbk脝脻I@llx聞k掳V虏職V@Ux脼聨聵L@b聛聞@b聶`聝職脟zk聫贸k脻陇@聬臒聫炉聧W聝聶L膲脟聶Lmm聛n膵VkbUa聝L@聨炉聞聜bU掳臒L脻聜脻@"],
                encodeOffsets: [
                    [127744, 50102]
                ]
            }
        }, {
            type: "Feature",
            id: "2327",
            properties: { name: "澶у叴瀹夊箔鍦板尯", cp: [124.1016, 52.2345], childNum: 3 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聛k聸聝蠙m茝锚摹b聶聝炉@@w聝m脻@XV@Il聨l@聛bUxl聬炉VlV聶bV@ULVlUV聶_kx聶VVV聶脠脻J@聞炉職U聞聶lm聬炉x@x贸脪膲录m聞炉W聝x牛@Uz炉聝Wwn聫Uw钮聝@kn聧聝W聝拢贸V聝UUw臒y贸娄WI聴Vmm聶I@卤kw脟@@b聝@膲录贸@炉w贸@炉a贸录聸K脜聬聝aUwmWUw脜I@a聝K贸@Ua聶L聝a聝V脜w艒录UU脻l卤I聴陇Vx脟x@zkJmnn聜mbnz聶xl聨聝l炉膶kJl聬聶掳@聞kb聞聨mx@x聶@k锚mVn聨Wx么X職xU掳聞bWL贸J聛n脟W牡聞V娄聶聨聝UUb聶b聶脝摹K聶職k聛炉聶VU卤aXm膵脩Uw膲K摹聞k聞聶聨Vxk聞脟Kkb聝I聝聜脹XWl炉b聝聨聶X炉K聶b膴職聞聞脼V脝職n聨母虏lxU聨掳n掳貌脠b聜娄聴xVb聝聨聝@炉聞Vx@聬炉V姆脼膶l膴聬掳K母聨葮I掳陇膶I么聨貌禄屁n劝K乾娄么W艓脠屁wl聝nKVXmbX`lb職w聛kVW聜XX聨聞L掳a聞聫凭a膴拢n聝掳@掳楼艓z脼楼聜禄聹alw么k茠J聞a@聧亩K聞拢聞bU掳膴x藕V脠U臓楼屁聶VI@聫XU掳x掳Ln楼職w掳UmwXm脻聛V楼蘑聨掳@nU@m脝拢職炉lK聹職脺w@a脜U聜楼Ua脻IkmV聧虏聫聜nn@亩禄@Uk楼VK脼@脼脹@聫聝kVm蘑a@_聝J贸聧m聝菛炉脝w聴贸脟a@al聝Uw職w蘑艡職k@w脝WXUW聛X聝Wa聶m@_茠禄脟茅Xa母wVa@聧脻KkUWkX聫聜k職KXx聝n@l膴V@聧炉聧m炉n艡脝w職楼"],
                encodeOffsets: [
                    [130084, 52206]
                ]
            }
        }, {
            type: "Feature",
            id: "2301",
            properties: { name: "鍝堝皵婊ㄥ競", cp: [127.9688, 45.368], childNum: 11 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@掳`聞_職JlU職聨@聞聞@V娄掳JU聬職聨nL么聫ln扭@@職脠aU脪Vbkbl陇聝zk掳脟V脹么掳IlVUV么U聞x脝U聞聨@b藕膧聞潞@娄職b@l虏聬聜UVl聹@掳脪臓x職nXx脝V么录脼@脺x虏K脼聧l聝V脩掳U劝么lw么@虏聝母聧掳聞lanV@聞職V艓Ull@b脠n脺m聞w蘑@la@脻脼b掳UXb聵l艓聧虏脝職k職V聜I@聨nJn聬臓聨掳kn聝脺b蘑wna@a聵k脼K茠膧聞a聜聶聹聜聜IVbU楼聛w臓wk么聵xnL聝膵V莽kaU聝卤IUm聛n摹W聞聛掳W么膲職al聝脼脜牡炉@聫W鹿X聫脻a聝b炉a卤X炉潞聛L聝aV聝m聧kL贸聝聝bka聝VUKVkkKV_@a脻ykk卤L@聝脜U@yV_聶aU楼贸w脟x聶@UkV聝n@l聝k脜lw職WVwUk膲mkklW@聛職a職bVwnWW聝聴wWL聶聶@U職聝聶U聛聝脟L職脟m聝聞聧@w聝J膲聧聝L聛楼@聝脻_@a炉y聞UWw炉聝炉U摹x炉a脻XVm聛aU拢贸卤聸炉nw聝a炉贸脜V聝Xman聶聞U聝聸lUXkWa@mkI聞聫聸聛臒a聝m聶Ikl脟U聶聞k膴聝聫聝zkK聝職聞lU聞艒默l職聶聞@聨nX掳@llUx殴虏mK膲VWwk@UbUK@bmVmI聴聧聝Vmw聛aWxXlW膶聛職m潞職脼脝bUxV@牡艅W脝膲LkWUb聝aWzkb膲`U聞卤Lkl艒wUV脻拢聶UW`Uwk@mk炉Vka玫VX@Wb聛L聶K@X僻潞Wz聛x聝K@lmX@bkVV脝k录Vbk@Vn"],
                encodeOffsets: [
                    [128712, 46604]
                ]
            }
        }, {
            type: "Feature",
            id: "2302",
            properties: { name: "榻愰綈鍝堝皵甯�", cp: [124.541, 47.5818], childNum: 11 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@脼@脼聛臓KV炉聛a掳聝@聧聞KVbla膶U聜mnn職K膴脠職KX聞掳聨臓聬@聫脼拢么ll聬脠y聞聶職_@a聜聝@a聴K脻聧VwU@卤聶炉U聝lkw@k脼Jl脜Ua掳艃膶aW聴職V么聝屁V職U聞聝@禄nI聵b虏K脼聞掳Klkn聫掳聝炉I@聝聝k職K@臅脟脜聞聶@a聝聫X禄炉@V牡la聛每VamI@a脜脻啶壝铰兡娙桱聝么葋脜km茟脹聝@kx摹@@l聶aVk炉禄聝墨殴a聝k聝楼脜炉聶JUaW聧U@@w聶a聝禄聞KUk脝kUm聞Umw脹卤卤UUbU聨UX聝wW聫聛w脝脻k聶lkUanaWwnKl聶kal炉ka聶聧平a聸k脜x聶a炉@聶amb炉V聶l脟w脹膧聶V@x聶職m锚V脝聹VV聬聜a么V聞w脠x@職藢x聞娄V脼炉V職lmX@聜聝L@炉Ua炉LmV@聞聞掳X聞膵K聶V聶聬聝@U聝脠@聜楼@w聴聝摹IU聫聶km楼殴w聝娄炉lmn@掳kxVV@娄贸am聞n娄l@nx聶l膲V贸職mx聶n聶脪膲膧膴录聞镁聞職菙锚脼掳藢臓脼脪掳膧刹膧屁藕摔趣屁膴掳w@拢nymwnkUUV楼么脩Vmk聛脝mUUVa聶mVIkm么聞lxkX脼镁聝bl聞聝l@聬kV聞茊聝V聞xV@職录V脪@聬職聨U聨職nn脼聜J"],
                encodeOffsets: [
                    [127744, 50102]
                ]
            }
        }, {
            type: "Feature",
            id: "2310",
            properties: { name: "鐗′腹姹熷競", cp: [129.7815, 44.7089], childNum: 7 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@U`lLUlVL聞Ulb聞a么聞lKn聨U聞聞b聜K掳鹿虏W掳b聞a脼b聵knyU聛lUkam艡虏L@m掳@l聧職m職虏n`么脜lK聞x聞聧脺KnxV@聞聬l@聹聝聸脜XyW_k@聶wm聶殴臅m聝X聧聶禄聜聝脹聶l聧掳聝么職脠聫聞禄職聴么聵么_WW@U聹al禄職wU@@w職UV聝職@V聝XI@w聜聫蘑蛻脼然聸aU_@mUkly@聛炉贸V禄XmWUXUWmn聛m楼nUUaWLk禄脝聫虏I脟a聶w脜a脻掳炉nUa卤a聶聝聶@聛娄玫脝臒聞@聞聶@脜b聸xU脺聛n脟艂lb炉娄聞么贸禄m聝聴@卤聝U聧k@Ww聝a炉xU聞V掳聝xXb脟聨脜聛UV聶聶聝K@鹿聝KUa券@艒脻聶X聝a聛l聶聝l脹kal脟U聧谦脟脜聞脟akb脻茊炉nl職炉聨@录聶VUx@x炉聬W录聶脝炉職m臇聞默炉膶聝Vk聜姆脜mx聹掳么虏V陇聜bUn脼W掳b蘑w掳V掳聞Xx聝V掳z@b脼`@聞聜娄聞K膴聨聞I@x聝聨n聞聶脠脠K聜聞職V聶聞@V職職XK聵xX聞mXUx聶a聶b@聜kXll膴nVlUx聶Xkxl脝k聞m@U聞Vl職@脠w么xV娄職bU`@z脝V@聞虏Kll脼z@b"],
                encodeOffsets: [
                    [132672, 46936]
                ]
            }
        }, {
            type: "Feature",
            id: "2312",
            properties: { name: "缁ュ寲甯�", cp: [126.7163, 46.8018], childNum: 10 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@啶娒久喢濦bnJUb聜膧nbl聨膴職聞聞脼l母w菙脠艓K脠n么W乾锚聜KV楼聞聛母么Ux職聞@V職bU录m`nn膴聨膴聛聞xlU職mkaV每職L職w職@掳禄U聧mb聛Km脻聶U職wUmVknKUUl炉聝KU聶聝U脠聝聜聶nK@聧臓kX卤lX聞掳聞L@聫炉楼@wV_m聸牡炉Ww聶L炉聝Uk艒聝脟V聛U聶l聸w聴V贸聛卤聝炉a聝Vka掳wVk掳m脼炉纽艡脝聶l聶虏聶艓k聶U@聝mUkb炉聝姆聨卤聞贸@kx券贸炉VU脪k聞脻聨卤L脹w脻@贸禄脜UWw聶m臒w炉脩聸@Uk聛V卤聫@k聶a@楼聝鹿殴每@a聝聧脜V聝w贸VVUkU炉J脺贸脠Ul炉聞yk拢laUaV脩脟b@聶牛@km贸聬mK聶聧V聫炉IU楼聝@@聝聶聧kV聶I聝`@么聶录聞blU聞l聝聬聶b脠b@x脟Kk蘑沙a脜蓡艒@聝聨聛V聝K@z聶@@楼脝Kn聛脺@@a脹聫Uw聸w聛nU聜姆@聝_聝V掳聨@聞klV職職nULVV脼bVl@掳聶@nx聶n掳L脜職脝lV聞脠聝mU虏@Vm臓L聝x聞n炉xkW聝z職J聜wnLmbXbW掳聛職脝聜聶虏聶@聶聨職x@聬聛JVx聞L聜膧虏脝掳I炉潞聜脠@脪n脠"],
                encodeOffsets: [
                    [128352, 48421]
                ]
            }
        }, {
            type: "Feature",
            id: "2307",
            properties: { name: "浼婃槬甯�", cp: [129.1992, 47.9608], childNum: 3 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聝K聝炉kWW虏臒l@聨mL聛職脟聞聞VV職聞Lk掳VVmLUlVn聶x職Vn脼聜LnaV聨炉录聶@聶x聶KU膧lb聶n聞`n聞脝x么@VbU娄母虐母b么x脝@聞聶V楼聞禄聞IVl掳LU聨ll@聬虏聞mV聞x@職職脼脺職脼Vn聨lX脜脪lb脠aVVUblb聞J@I掳l脼In聜脝聞mxnbUbVL脜Vm陇@聹牛V脟陇X脠脟臇@職脠录聵aXV脺aXbW聨nz艓a職艡聞K么b職Ulw@炉na脝KnUU炉脺a@mkkVU膴m聞聶偶脻聜聛菛聨聜K聞聶掳L虏l脝I@聝炉楼膲茮Va脼k@脻Va臓lnUVw聝聧聹贸ma聝@聶w膲@聶a聶V聝x聛amX@a聝@Ua脜L聝aVW聝_nWm拢nWm_脜V炉聝m@m聞贸陇聛職脻娄聝炉脜almX拢聝聫聶聛VWU脜職w聶m脟@@IV聶聞WUw@a職I@聫聞k@w艓禄W聝聞聝聶脜Va聹K聸Ika@楼lUkUlw脜wVy脠wWU@a炉U掳m聴聧脟@U莽聝aVa炉mV禄脜w脻Ul聝Uk聶V@k聞mUk聜聫X拢職w掳@@脟聝a脻I聛聝聝am聶脹am聞炉l臒聧m聫mI@聧聛J聶U聶l卤脜艒聨聴kWa炉V脻a@脼kb摹@聝x脹n脟m@akk艒V艒l卤職k職脜職钮艢脻掳炉nUl炉xlb聞U掳b虏聞么聜聵U聹x職k聜V脠U艓聞Vl掳聞職KXx亩掳n聹U`@x掳娄@聬"],
                encodeOffsets: [
                    [131637, 48556]
                ]
            }
        }, {
            type: "Feature",
            id: "2308",
            properties: { name: "浣虫湪鏂競", cp: [133.0005, 47.5763], childNum: 7 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@n職聞b聜聞脼J聞b@脠炉@聶xW陇聛聬Vl聝n@l職UVlk聞脼V脝xU录掳nUb聞bV猫脠@聵聨nIn聫聜@職聛蘑ml聧Uw掳聶偶聝聜VUn@lnL@V么b職w膴聜l聹聞J姆母蘑l聞w么w屁xV聧VU聝聫纽聧職x職L藕聶脠職掳`nn臓w艓J脼聬亩w么J聞聬@陇Xn脺聞母l職n掳录脠掳l聨聞聞U職聜b聞x職@聞l@脼脼脠m掳聞l么w職L掳录母聜掳脼虏n臓@么w脼`扭I聞V聞脪臓U聞聞@聞VJ母b脝聞虏@掳聨膴K職聹聞J亩a蘑聬劝@么楼掳n職陇聜b膶U職@Vx聞mUw@a脻聛牛聝脟聶姆聝@臅姆墨U炉虏聫@聛脝mV脩么炉X楼膵莽@聶膲禄U楼脻聛牛KWV脜kUV脻艓Um脟聧脻x炉a姆x脹U贸L炉a卤贸艒b炉聶聝脩脜聝V每聝_脜姆聞a@U聝K@wm@Van@UmmLVa聴@VImmXUW聝脻U脜聶聝KUw脻UU聝kV聝k@l炉X聸聜脜_聝J炉k聶Jm聞脜L聝a@楼U@炉V聝z炉@聝`@录職聬mx匹職艔K脹k@卤la脹@@Xm@聶聝@x平@W艓n職耍臅脜@@a脜@@n脻b脟聫炉@聝_U聸kUW聝kb聶w脻U@莽聞Wlw@anI聝炉ly聹X掳m掳V職a職脹職m@聛聞mVw脼K掳聝職XlaXmm_聝@U聝kw脻K@聝VI聶聝XmV禄聝I@a聝炉臒W聶b摹aU_炉JU炉摹聨聝聞膲聞k聞艒`卤n脻脝k聞聶b贸膴炉X聝聜蘑X聜mVn虏JV聞lbU猫聞膶mK聴wl贸臒x聜xV娄Ua聛J聸聛聛職聝b茟每脻L聴l@bmb摹x"],
                encodeOffsets: [
                    [132615, 47740]
                ]
            }
        }, {
            type: "Feature",
            id: "2303",
            properties: { name: "楦¤タ甯�", cp: [132.7917, 45.7361], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聜L職KVVnk職bV職脠b聜聫虏U掳VnklVla脠L@anU掳脺mXV`聹n么L聝猫職xl聨職LX聞聵L虏a職VVm脠X@姆聵lnU聞脠l`脠鹿職@扭聨掳U@x聞KnnV聞mlnnUl聜lVnna艓wlV脼脪聞@n娄職LV聨掳l職wVk聞L職a脼聨l聞n脪聞職@xmL脼陇Wn聹录聜W脠LVVUxl脠么聞聞WVaU_VK職KXU脝bn聶聜n么K聞b脼w掳b脝WXam聛Vw聹K聵聶Uw炉WUk聞UlJUwV聧Ua聶@@kmy聛zm聸膲w@kVw職聫k聛聝聫W炉脜KU_Vm聝聝聶x聛U@aW@@聛kK@w聞a@K聝@@kVU聝aky掳_Vm聶kna炉K@聶聝L聶w摹聫k@@I脟贸X聶聝wVakmV@mwXUWan聝l膲聛@脟聶Uw聶K聝聝贸職軟菉脹聞m掳聛@聸w聴脜@聝卤b炉W聝鹿聞WVw殴臅炉kVm艒b炉w@a聝wmV聶UUb聶V聶IkaVw姆聫聶xk录聸b@VXX贸`贸聴聶聵聝录脟聬贸聶炉聞k聨脺職聛聞職录W聨n聞藕臇n職職xl@X`Wz聹脝"],
                encodeOffsets: [
                    [133921, 46716]
                ]
            }
        }, {
            type: "Feature",
            id: "2305",
            properties: { name: "鍙岄腑灞卞競", cp: [133.5938, 46.7523], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聶U聝聝Uw贸聶m脩脼脩U脻脻Ukmm脜聝yV聛炉墨聞楼聝聧U每膲炉m脟kaWb脜X炉a脻x聝a贸L聛mm職脜aWV聶LULV`Ub聝X贸聝k脟VwUU脟K聛X聸禄Xm脻拢nK@w聝聶m脩k聝脻聧聶b聝KUl聶x炉kU聧聶Km楼聝@脻脩kU艒xmbUm聛kVkmmnkU聝mm聝L@w炉V牛聧聶@脟潞k_聝脟mV聴k@母Vx聜V脠掳lLkll職Ub艒w聝n聛VW录nlUx炉XmWUn脻@聶x脻U贸录炉J@LVbkJWnkb聶W炉聞脻LUx聝n@聜聶n聶脺聶b炉U炉n聸Wkz聞掳mJ@bkx聝X@猫脼V職xlaX聞lVV聹聞`掳@脠聬脼a@m脝@@b脝@摔臇m聶X艒凭@@w職聞n@@W脺@kb@虏脺l艕L痞聶nw聶聫@禄聞_掳@聞y掳UV@@娄聞b脝Kn聝職I掳l聞I脝`聹聛掳W@k聞llUV聞脼VVx聞L脝職脼VX聞WVnnUJ聵@UbnKVnm@Ubn@@x聞L@V聝b脝母聞`U膧脝聞聞脪掳職艓a虏么掳b么K脺V母w掳b脼w脠聨Vn脼艒VU脝lXU"],
                encodeOffsets: [
                    [137577, 48578]
                ]
            }
        }, {
            type: "Feature",
            id: "2306",
            properties: { name: "澶у簡甯�", cp: [124.7717, 46.4282], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@m脟@脩聛脟掳鹿炉J卤脜聛每聝KUw聜I@聫聶w職聧職@職卤脜聛聜聶X炉WanamK聛x聶I聞ylX掳w聝m聞w臒KUn卤@nV脟聞U聝脜k脝聶炉K職mmw職@@炉Uk脻aUUVK聶mU聶lk@聝炉聧聞U聞`母@V聛聜m聹xVx脺聬@b脹@m聜脜L@娄職@@y聞L聜U聞聧艓@脝蓞纱bl摹脠L@w脟a職a聞聫聝kkV聝a職禄@贸炉_脻J聶w脟a脜Xny聸U炉楼脜聞@w聶b脻a聶Lmm聛@@聬聝VU聨lb臒Vm職聶炉X聝m_聝`炉_Ux聶m聶L聶a炉b@m聝a贸娄脟k聶陇V聞@b贸JknVx聶VXx卤a聝LUbVxkLVl聛LWl聝@nX@V脜bWl脠n聝x聞bW職脜bm聨@x聹bml掳b聶聞XbW聞XVmnn`聝Lm職nbmb@職k@mwU@@職炉Jlbk掳lbk職mLXxmbVbkll職脜脼聜xX聬聞xVWV聧Va虏V脺虏nx聝VVn脜lVl聝L聞录職b@xV@X聨Vb職I脝掳聞娄聞l藕b聞默掳录Ul職b@k蘑@lw聞@茠脺ln葌脝聞贸葮I聞膲"],
                encodeOffsets: [
                    [128352, 48421]
                ]
            }
        }, {
            type: "Feature",
            id: "2304",
            properties: { name: "楣ゅ矖甯�", cp: [130.4407, 47.7081], childNum: 3 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@脼楼聜聶么拢n聝n@掳聞脝Un`mXn陇mX聞`UX聞b脝KVb聞@@bnW聜b聞w職U職b膴@職x聞@nb職WV聧m聝聛_mm@聧贸禄Um聞脜聵WXk臓禄虏炉聜炉n姆職w艓@膴職艓K掳b母Un脩聵K膶娄臓聫脠b脝knJ職職脝U蘑V掳I職聨職V凭聧聝w聛aV聶聝聝k聧脟炉炉禄聶m姆k脹聝Wm@拢聝聫贸I牡x脻聫艒I臒xmm炉_脟聶殴職聶K聶w钮聨聞聬UVU聨僻w贸x聝x摹k母姆聝Ik聸膲聛聶x贸a@UmK@kVm聛U呕聞炉職Vxk聨摹n聶聜聛@m聬mJ炉n掳V@bXV脟xUz脝xkxlVkV@娄lb聹J聸LUb職脝聝聞X聞艒录@x聝l@聬聶J@bVx聝XU職@J脠@職n聶xV脝UX職聜聞聬W陇kn脝b聞掳"],
                encodeOffsets: [
                    [132998, 49478]
                ]
            }
        }, {
            type: "Feature",
            id: "2309",
            properties: { name: "涓冨彴娌冲競", cp: [131.2756, 45.9558], childNum: 2 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@虏m艓_l聝膴聝聞聝蘑聧V掳掳IV`蘑b職a臓X聞掳@b聞JU录Wn職聞UJ@聞脼LlxV聞聞@n`lIUa@K掳I么禄脼V職w脼@VmnX掳WVwmkX禄聜U聞m艓xVak聶lkkK脟炉聛UUw脟WUn聶U卤b聴KW聝聶Kk聧聶w聞莽贸K聸mU_nW炉脹mV@b脟KkbkUml炉U卤V聛聬脟aU聶聶amlUU聶L聛K聸聞k@聝聫U@mw脹L聝聨聝wkL贸脝m_聶卤聶nk聨炉@@n卤Kn艢lbkVV聜mz聴lW聬X潞@聬亩掳"],
                encodeOffsets: [
                    [133369, 47228]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/he_bei_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "1308",
            properties: { name: "鎵垮痉甯�", cp: [117.5757, 41.4075], childNum: 11 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@lLnlmxn聞聞IVVlUnb@VVxXJWL@L脼聨VnnV聞J聵_@wkm職K聞b聜x聞wXk聵WXX職Klb虏K@nVVVb聞L@WlU虏聞lKVnUJVz@VVb@l脜录mVUVnb么aVX@掳Ub@lWbX職@b@bVb掳x聞@Vx脠LVl職a脝@脼b虏k掳@lVU聨@Xn@VW聜LXb@陇VX職KVVVLnm掳_屁陇@aUIVa聞alkX聸掳k聞聶V@聞alwU聧Vy聞U@k贸聶掳聝na掳UVUUmU聧脝w@mkLVU聝WVI聞W職Lnn@xlVnK聞聛myU@聝U掳UXaV@U楼聝U@U脝聶@aVUkWU炉聝aU@WLUV@bkbmKULmKkUVUkmVIUwlWV聧虏聶Uml聛掳U@W聞LUwVm@UUK@_聝KUU脺aXw@聝VKUU@mVIUUlmnIVVVb脠VlKnbVK職@nI聵@nVnwVLVK聞K聞聞聵Vnb@aUIVW@In聶掳@lVnI職@lW蘑@掳UVL@b聞@VyUU聝a@w聛@WUnU@W脟炉聶K@聧UkkJWa脹bmk@mVa脼U@amk聛W聝@mXUKk每聝拢@a聞kl@Um掳UXwla聞al@nmlXnW掳znW@a聝wV聛聶@聝akb膲楼VmU@聝I聝V聝U聝J聛kUmWU聶K聛bmkUa聝KkUVU@KV@@klw聴聶WaU@km聝XV猫nbmlUU聝K聝X炉Jkb聝I@JmIUWU@聝Lml@XkJ@U聶k聝K@aVK聛wWa聴IWw聝m聛U聝@mU@J聛@Ua膵U聶aUU聝VkI卤聝k@UU聝@UbVVm@UV聛K聝L聝lkIWaULUW聝XUJU聞聝@WbUb@lkXUxm@@JVn@J@b聞n聝b@Vkx@b職LU聜脝n聞J職aVXnKVVmzX聜掳V@_lJXxWX聝K炉b脜amU聝@聛lUI聸b帽J@L脟KkI脟`kxWL@聞聝@@bUVUb炉xWKk聞脜聞VlULW@聝聨n娄Ul@I聶lmUUUVm@聛kW聝nkKma炉XUKWmnwVw脻L聛聞m聨聶VUbUVWb@Lnxm聞聛xV聨mbXx聸娄@聞nb@`聶聞聝V聝@kb聝LU聞mVUlkbVXk潞mnm@@xk娄職b蘑脺l職"],
                encodeOffsets: [
                    [118868, 42784]
                ]
            }
        }, {
            type: "Feature",
            id: "1307",
            properties: { name: "寮犲鍙ｅ競", cp: [115.1477, 40.8527], childNum: 15 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@k聶摹脹聶al楼@wn@nml鹿UWlaVknUV聝聞Kla聞@聞U職聝@_ma@聝聹楼WwnaU聧聜wn聝mw@KXaVUVa職Un聧mWUk掳聶l聝nUVUXWVw聶IWV贸KUI@W聛X聝xUU@mma@kUKWLkw@yk@聝aVkUU膵aUU@Wk@Unm@UVmL聛m卤IU聝kJ聶kW聝@a聞I@m@U聞聝V聝聞Ula聞@VXV聝XmVwnkWK聝KU_k@m楼聝mX_聶JmnU@km@U@KmU聶V聝U@U聶@Umk@@L聝mW@脹拢W聝ka@wk聶@a聝I@mmk@mUa@UmU聛聫聝I聝w聛W@aWU聝bU@kb脟@kw聝@makVUk聶U@a聝m@aU@mxkU聝b聝KUXU聝卤KXVWLUK@wkU@V聶@WXUa聛@WbUx聝J聛I聝聨@娄V猫VVX@卤锚炉KUI聝`炉UULVx@V聝@UK聝I聝VkLmVkKm職@nUJ脻bkIUJVX職VVxVbU聞VJ聞Un聶掳bV聞mlU掳聞XnK@Ul@lV脠VUX職x@W聞@VX職V聜K脼b聞n@VnbV聞m`聝U聛x聶kW@UVkL聶Km录@lUnUJVnV聞XV@Vm@@LV聞kl聝Ikl@V聝聬Wl聛聨ULWKUL@聬mJ聛聞@blbUVUlmzUJUxm@U聬Ub膵脺k@Ub@V職LVV聞娄么bV聨m職UKUkU@m聞聛聞@VlVn录WbUJ炉@@聞掳職nIll脠l聵@nX職WlL聹k聜J@bkxlxkxlXUlk聬lJ聝職XL@bW聞n`@n脝聨XxlL@xl@Xb聜L聹KlVlIXblVUbUJW聬@lX@VL@VV聨職X職J職w聞n@WnL掳K聞bVbl@VI@K聞聫@U@聛nmVmV@XUWI@aXm@聶VUUkWmn@lmUUk@mUmK@UnwV膲@聝聝mU_V@XJ么VVU職LVUn@職llUnJl_n@職ml@X聨lLlw虏LVJUL@VmbVb聛lVXmVnl職@扭娄聞nn@脺聨@b職l聞@@XV`聞Unb@VlLVb虏J聜Xn楼脝脩@楼脼@"],
                encodeOffsets: [
                    [118868, 42784]
                ]
            }
        }, {
            type: "Feature",
            id: "1306",
            properties: { name: "淇濆畾甯�", cp: [115.0488, 39.0948], childNum: 23 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@VbXW職@@UlV@xVLXKWU虏LV聞VW聞L聞alVnwV@@b聞n@b職VVllUnb聞@lx脠@laV@聞aXV@b聜X聞x聞J聜聬nV@VVb@nnl@n聞J@bl職l@聞a職聝U_VWUwVU職kUm聶Ukb卤mVw聹U@聫VIUW@UWk聞@VU@ynL聞m@IV@聜bnK聞LVaVmnIlaXwV@@WVL掳@@xnX聞@V`V@VbUVVLVKnwnL@ll@@_V@VVna脝@聹KVX脝@n聝@w聝KmU聴聶Wm@聛km@k脺KXU@脩W卤nIUwV聝聞Kla@I掳wU卤k聧職kmm炉m聝_聝J聛n聝a聝w聛W@IVaUama@w聝U聛聝mU@mVw@aXk@mWa@拢km@a聝_kVmUnWW@炉b聝kUmk@聝聧V脟m@@kUU聶KUU聶@UVUamVUaWIkb@xU@@amUkK聝Vkam@@kVUkUWm聛KmUkLUb@xmJ聝聶U@UImV脹VmnUw聝J聝U@V聝X聛@UWm@Ub掳娄U職mxklmX@`ULU@@UW@@xkn炉@makV聶UmxUb聶掳聝lU職聝bUb聝nUJ聝UUV聝a聶LkbUU聸JUU聛@mUUU聝Jka聝@聶xUIWJ聝U聛n聝J@V聶z聝@kb@`@bln@l聶b聝聨@X@職@職聞@Xl聜bnbVb聞@聞聞VJlInl職bVw@U聞K聞聧l@lbnan@Vb聜J么Ln聜UzlV@l脠LVbVK@LVx聴VWXX`WxXz聜bV`UXV陇nx@聬聞bVlVnVlUL"],
                encodeOffsets: [
                    [117304, 40512]
                ]
            }
        }, {
            type: "Feature",
            id: "1302",
            properties: { name: "鍞愬北甯�", cp: [118.4766, 39.6826], childNum: 11 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞@VVl@虏聞lJ聞UVV職b膶VVb聜@@InV聞@聜V聞nXx聵JXb聜xUL@b聞L職l@VlI@Wnk聞KV@VXnJ@I聞Jla掳I聞W聞LVVnkmaU莽聞WVk么a脺炉聞@nV掳wnJlaV@VUnUUaW聧炉wXWWwna@拢UaWKU炉聝炉@aVUkKUamUU聝n禄聜an聶聞IVwUWlk職@聞LlWVakU@K聞_l聝職b脼U掳@職y掳n聞@聞K脠kWW聶聛牛楼膲艒聝k摹WUw炉拢炉聝脟w牛w聝@kK@k聝楼脻w脜b脟陇脹聬钮V聶l聛聬W掳@母聶x@VVVULVLkl@V@X聝`Ub@Xm@UW聛b聝k@脝VbnLWV@lnXUbl聜@X炉lmU聶VkKWLkK@_UK@U@UmmUxmVXLWVULkU@`W@ULUK@XlJXzV@@xml@VU@UX@Kk@WbUK@Xn`聝XmJn職m職kxU聬VbUVlVVxUbV@nKlL聞kVK脼bVKXI掳KV職mVUIUKULVxVJVLkV@V聝@UbU@WUU@UbUK@b@n聝V@VkLmb@b"],
                encodeOffsets: [
                    [120398, 41159]
                ]
            }
        }, {
            type: "Feature",
            id: "1309",
            properties: { name: "娌у窞甯�", cp: [116.8286, 38.2104], childNum: 15 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@ln@U脠聞聨l@Vn聞l掳aX@mXnVlU聞`@bln@陇Xb@nWl@bUx@nnV聜聞聞V@xnbVbUb@J聜X聞x聞b聜mXa@k聞UVwlW聞k聞K么聧Vm@w聶kkK@kl禄脠聝m聶VKXkla掳@XVV@VI@ml@@Vn@VX@V@J聞@VxUzVV職職虏blVk娄@職臓@@禄職@VK@V脠LlK@XnJ@alIU聫l聧聞a聞VVb職@聞n@a聞U@WUIV@mUn@mKXml@lL@LnW職b@XV@@a聞VVb聞V聞@VV聞IVW脠b聵I脠禄茠菬lW職aVU脜U聝聝聶聧Um@kVU聶WVk聛aUwma贸U聝JUU炉脩U楼mk聶炉Ua聝K脜n脟y贸XmW脹X炉a膵b脹a聸J聴聛W聶脻聫U聛炉禄聝a贸贸聛Um聫@I聝職聛VVl@b聝LUJWLX@@x職XUxl陇V@V聞nVUV聞XVbV職@聨聞@@VVn聞掳V聨@聬牛U炉V聝Um聝聛UWV@mUX聝a聝bUKUwUa脟Kn聞聝Vk娄Wb@VnLmV@bkV@n聞xW`脜_UV聝V@b聝UklVX@VmlU聬聝x@VVL@x聴VWV聛L@VW@UUm@"],
                encodeOffsets: [
                    [118485, 39280]
                ]
            }
        }, {
            type: "Feature",
            id: "1301",
            properties: { name: "鐭冲搴勫競", cp: [114.4995, 38.1006], childNum: 19 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@la聞@職y@U聞I聜m聞VXIVJ職w聞@lb聞IVVnV聜@VV聹IVVla職K聞bVU聞VVI聞mVa聞aV聶聞k職炉Vanw職VlUnb掳@lm@wX@@VV@VK@_nWlknwV聶炉楼Van@VX聜@聞W@U聞V聞IVxnm脺UnUVJV@聞職nI@wValKnV@k聜mU拢na@mVk掳K聞LVa@UU@U聝mknWWkXU@aWW聛@@km@UaU@@klK@UkaWaU聧namm@U聞a炉wW聫U@Uk聝L@聨Un@x聶V聶lUXVJUb聶LmU@aUWUkmKkLUUm@mW聴X聝a聝mmkkWU聛m@@U炉JUUm聶kU炉@mK膲x脻w脻楼聛L聝U贸聨mwkUUUWVkKm聶kKmLX聞lxVLVxXJ@nVJnz@VWL@`nX@職聝x聝@kVUUmJmIXx聞JV聞聝nUV聝@UVV聞@LU職聝`UXVV聝聞聝lXL@l@b@VmX@b聶xn掳聶U聝bkKWLXlW@@b聝K聛聞mKULmakLUlmb@職Xb@xmXU`V聬聞b@`lL聛x@nWVXL@聜掳聬WlXnlb聞KVK聞XVb@聵X@l_lJ@V@Xn聨聞I"],
                encodeOffsets: [
                    [116562, 39691]
                ]
            }
        }, {
            type: "Feature",
            id: "1305",
            properties: { name: "閭㈠彴甯�", cp: [114.8071, 37.2821], childNum: 18 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@nKlLn職lLXUVVlVnx么聧聞V聜K脼娄脼x膴wnL掳@lVn職VV掳I@Vn@V聜lXnl聞n聞b聵WnXn@VVlKnLVlVX@bnV職KVaUIVW職k職U@wVm@聧炉@U楼VmU_掳l職K聞k聜w@LX聜Va聞U@w職U聝UUKlU贸W@UVU聹Ul聝掳K聞wlKU_na聞KVnlKkk職WWa@I聹JVa@IlJnU@聛聞KVUUmV聧laXUl@lm@kXW脻脩nk聝聶卤聶k聫@w臒聧聸@@U聛@mK膲LmV聛J@zmln聨WL聛U脻JU_聝@@職mJkXUVlbkl脻@脻a聶b炉@炉聧卤J脜w摹aUU@聝kU聶@mV聛I卤bUK聝L聶WUX聝Jka聝L贸KULWbUVkKmnk@@bmLU聨聝l@b聛@mnmJkUUL聝a聝bn聨mn@lVV@娄n@聞l@b聜znx@`Vz@b聞xnV@xl聞lbnKVx"],
                encodeOffsets: [
                    [116764, 38346]
                ]
            }
        }, {
            type: "Feature",
            id: "1304",
            properties: { name: "閭兏甯�", cp: [114.4775, 36.535], childNum: 18 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞bVKlVnInm聜@@a聞kV聧nK@al@nmlLVUXaVK么L聞Klb聞IVW職X聞KVL虏a聜JnU職@lV@聞VV蘑b脝x虏I掳聨掳@職a脼b脼@lkkaVUlWnI@聶聞@V`脼I聜VXKm聧nk@y聜InU膴K聝脟kUUamUUk聝聝@aU@U聶聝k@WUwVkVJVkkw掳a@聫聞聛mK@UX@VV聞LVW@w職wVa@炉X聧m@@lUIWaU@UWkXWmU@UwmUkKmn@lkV聝虏聶V聝aULUVmJUUUw聝Lma@聶UmkIUm聸L聴mV職mx@b聶LUamK脜L@VmbkU炉K脻amzkJUb卤Vkb聶L@lU@WIkJ聝zkKmK聝nUa聛lWkkKW@@nkbk@WW炉XUVUJ@XlJ@X聝@XlWLkU聝`VUnaWa聛聞UV@UVI聝aUxUUmV聝K@I@W聛@脟聞U@@U@b聝聜@nmK聛Xmx聶@UxkVWUX聞@`VLlL@`聶zX聜脻b@b聜聞@VUVkIUJVz掳KVlnLlKnL聞xlLVVUVlXUJ@nn聜聞I@mVUlbn@@聨m聞@bV聞nV"],
                encodeOffsets: [
                    [116528, 37885]
                ]
            }
        }, {
            type: "Feature",
            id: "1303",
            properties: { name: "绉︾殗宀涘競", cp: [119.2126, 40.0232], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@lnV@Xb聵職kx@lU@@LUVlV聞LVbnl聜a職LXVVn聜l聞I聞V聞U聞JV@Un膴娄la聞b職@nJ掳Um聝V@聞wn@VU聞JVI掳bnWlXnWVLVK虏b聜akk聞聫lI@aUaV聝UwVUUalaVwnUVak楼職X@W聜k聹LV脫m聛聞mUK@_lW職@n_UK@al脜@聫臒脜茟艃脻聧m聝@脩聴牛脟l聝L聝@炉m聶z炉@脻V聶ak聞聝`@LlVUbkX聝K聶@klVXUx聝Jm職聛bm录V聞nVVblLUV@b聞掳V掳XLVb@陇mbXxWX掳xX聨VbmVUVU@kbmI炉xmU聝@脹掳贸bUl"],
                encodeOffsets: [
                    [121411, 41254]
                ]
            }
        }, {
            type: "Feature",
            id: "1311",
            properties: { name: "琛℃按甯�", cp: [115.8838, 37.7161], childNum: 11 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞KVlV@X聬掳x聝b@VnnmbV聨Xblb@VkL@lV@Vbn@@l聜@XX@bWVXlmXnlV聞V@@VUb聝K炉LUl@nmbV陇聛n@l聜LXnlVUV@ln@lb聞UlLnV@bV@@wlaXJVbnUVbVU職@VV職LVVn@VVX@@U聜KXU聵U@wUK@U聞wV聫nk@UUWlk聞V@a聞UVU脝`X_聝w@mlU@anUmK@UXal楼聞Um聝脠LVbVxVL聞a聞bVW@nXU聜Vn聞聞V掳U扭V@聫U聧聝炉Um@U聝@@聧U聶Ua聝WVUmUU聝U@k拢Vw聶W@wW@XK聝IUa@wU@@al@UK@_mKXK聝bUU@aVKm聛職@Xm聝聝卤@kb脟akL臒聧VaUw@a@聝mkUJ聝k@ykw@拢聝聫WX@lknk@WVkbU聨VnUV聝L@聜mVkI@JUb聸I@JXb聶XllkLUm聝LmbV`kL聝x炉Lk聞聸VUV@V么XkVVL聞V聶V@x聝VUbW聛@K聛x聝l聶L炉kV`UnV娄掳@"],
                encodeOffsets: [
                    [118024, 38549]
                ]
            }
        }, {
            type: "Feature",
            id: "1310",
            properties: { name: "寤婂潑甯�", cp: [116.521, 39.0509], childNum: 9 },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@la聞U職聫職@職UnL@VWbklWxnIVV聞V@X聞JlbUl職XVbn@@K聞mV@@X掳WVInJmn虏@lmVbnL@amKV_kwlmX@@LVamaXa聝aVU@UnJVanLlUkaW@UaVakK@IlKUU@an@ln@alKU聝kIVa@a@klaUKUV@UkUV炉職KV聝V@kUm聝U@@a炉ImJUU@VV@UL@U聝@@WXUWa@Ukwm聶@聝X@@w@al@@aVIUmVUUUVWUknK@I@聶l楼kU卤a聶聶UUVyUw聝@@I@UUWm@@Uk@@nUJU@WU炉@kbWlULn職脟聞k录@llL職l@xUn贸聨聝L聝lkXUx聝V@lWb聞I聞`掳nnn聶ll聨V虏炉x@Jkb聝LU聞VxmJX虏@脪WV脹L@lln@聜Xn聵職nV聞L"],
                    ["@@@kX@Vala聛a@KWI@UXW@聧WanaUIW@UaUK姆聨k_W@UVUKU職@b聝@UamxVXnJUbWVXLVbn@W掳kb@U@W贸录mIU录k`V聞@bVbl@聞lX@lU么VlU聹IV`lX聞Vn@lUlVn@聞l@UVa聝IUWl拢Um聶聛VWU@@UUKlUUUn聝VL@K職UnLVWUa聸@聶U"]
                ],
                encodeOffsets: [
                    [
                        [119037, 40467]
                    ],
                    [
                        [119970, 40776]
                    ]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/he_nan_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "4113",
            properties: { name: "鍗楅槼甯�", cp: [112.4011, 33.0359], childNum: 12 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@lKl@nVV@聞bn聞@VVnm聜nL聜LXx@職聞聜VLlKVU聞IXW脺@膶聶lbl@XU膴UlwnW聞L脼w聜m@聧脼UVmnVl@nX聜JXLm@VnnJla聞I@VkxVb聞@V聨ln聞J@knKVn聞@掳aVanal@XK掳b聞聧聜@職炉VJXI職聞VK@al@nV聞k聜@nK聞a聜b聞@XL@blVVKVLXK聞@VaVI掳mVaX@V_@a@yUkVw聞V職IVa職J掳聶@anIlaV@nKnX脝m@wUUV卤UUW聧UKnaWwXUWm脜聛炉V聝am@kakIm聝UK聝禄lan@VXXa聵W@聛聛聫@UlUUa@a@UlwU聝V@Xal@@anIVaUK@V聶XmwVmUmV聧聞LXl聜@nalLnal@聞職nKlkV@@UnJ聜UXnl@nVl娄V@@VnJ@nUVVVVIn@Va聞J脝聴n@@K@m聞k聝a@kmWVaUI@a@聶k@@aUL@mmaVIUKUV聝@@IU@m聝UmmL@K@U聛UUU@mW@@nU@臒禄mVmbk@klW@UXnV@L聝Jm聞聶lUnUJ聶UUUW聝聝@UnkK聝xmL聛a@聧聝@@lUU聶bmUVWk@@nkUmam@UakJU_聝Vm@脜l脟LUVmVUwUL聝KU@聝k@U聝VUlU@@U聝@UaUUWa脜聨聝z聛J聝aWLkl聶b@bmL@聞kK聝a聛bW聨UV聝_聛@mV@b炉JmXUbUK聶陇脟LUU@b@JkLWmkUWIkJ@VmX@JUbVXU`炉聬VV炉blK@LXKl聞UV@Um@@Uk@kxW聨kb聝L@KkbmL@聜UXmaU@@l@x@blX@xUJ@bULUlUL脟@@V職nU`W@@n脹录U@@VmKUkm@VVX@@x脟職@bUbVb@VX@@x聜LUb@l聝录XLlbUlVVU聞Ub@n"],
                encodeOffsets: [
                    [113671, 34364]
                ]
            }
        }, {
            type: "Feature",
            id: "4115",
            properties: { name: "淇￠槼甯�", cp: [114.8291, 32.0197], childNum: 9 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@VllInJlknJVkVU@mX聧lU脼`VnV聶VU@U@y聞@nXlKV聞nJVkXKWaXI聜b@yVk聞VUkVwn@聜K@聧nW@k聞KlUXVVUlbnUV`n@V_V@llX@@V聞b@bV@@nlVUb炉聜WLnbmb@聨nLnK聵b聞U聞bVWnLlaX@VVUX@Vln@`kL@ll@VXVJ脠IVl@X脼J掳Una聞LlylU@UXKlnn@lanLWWnbVI@KXKVL@LVWVL@UVKUIVWX@@X脝J@In`@聛lJVI@a聞W職脹nK@UlK@UU@VK聞nlm聞nXal聞UllLUbVV職knJ@nV@Vm@a聞聬l@@xnV聞聞lJVUU@聶w@a聝k聞@XW@_mWnUl艁UmVKV聛@聫V聧XwW禄X聝WaUwnkWUk聫V聧U聝U@@聧@WlaUkka聝IWVkm炉xmIUm聝LUV聝aUI贸禄m@聛mmwXk@a聸mk炉炉聧l聶@w聝mkLmmU@UbkUWJ@XUb聝J@b@l@zn脝mK@Xk@Ub@lm@聝I@akmVKUUVUkU@U卤JUbk聝@IWmkx聝a@UUV聶UWVkIUaW@Ul聛LWn@VkJ聝I@VkK@L@bmK聝聬kJmUUaUKWXk录VxnJ@聞V@@VULV录聝@@UkaUlWL@U@W@IkKmL@KULUWULWKUXUJmI聝b聴K聝聨聝虏UW聶nWKUUkLU聝mUUam@UU聶@聝mUL@xkV@聞VV@bmV@Vk@mwkU聝VUx@聬mbX聜脟nVb聞聜UL炉職W聨nUVLVb@xnlWnU@UVU聬VVUbVVlVkn@llVUXUWUXVbUJ@bmLUJnb@nVK@bl@@職@bVJUbnX@l聞b"],
                encodeOffsets: [
                    [116551, 33385]
                ]
            }
        }, {
            type: "Feature",
            id: "4103",
            properties: { name: "娲涢槼甯�", cp: [112.0605, 34.3158], childNum: 11 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@VVUllLXl@LWn@J聛聞@b聝KUVmn聛L@`VblLnbV@聞b@JmL@LnV@VV@炉聞VJVnXL聵@nm@a脼@聜a聞k@m聞I職mVbXL聜ynL職k掳@掳aVJnUV@UVVXk@WJ@VXLlUnJVnn聝掳U@禄掳U聞wl@職b聞WmUX聝脝@VLXU@m@U聞a@I聸mkb聶a@聧naWW@_@WXUV@@U聜聝虏@聞K@I卤U@楼kKWL贸L聛l聝a@拢Um@kWKXU@mlLXUVKUU卤J炉_@`UL炉聧Wmk@Wa聞kk聝lUn聝VUVaU聧@KUU@mmK@_聝a@KX@VaUIm卤聶k聞aVKVUkw聶@ka聝聝W@kbkL卤UUa聝K@UUKVak拢聝@UmmL@l聝IkmU聧聝@Ualw@U聝JkbmIUmn@WK聛ImWk@mUUn脻V@聨聛n脻x聝KmXkx膲VWVk@ka膵職脹@WX聝JUV@z聛聨m聞VWnbUbVb職LlUn聨聜lU脪n聬WV聴VWnk@@Vm@kxm@Un聶l@Ll@@V@職Xn聝職kJV聞職V@nlVXx聵U@l聞n@a職@VLnW膴娄nx職@lbVKXLl@脼聝VL聝聞XJl@XXl`lIXVl@Xl聜XUV職K聞wV@lanx聞zUbVJ@VVX@b"],
                encodeOffsets: [
                    [114683, 35551]
                ]
            }
        }, {
            type: "Feature",
            id: "4117",
            properties: { name: "椹婚┈搴楀競", cp: [114.1589, 32.9041], childNum: 10 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@n@聞b掳U脝聜XnVlnL脺@VL聹m@n聵@na@J聞聞m@k聞@lV職VxXX@聞V`lLV聞XVV@VV脼LVV掳聞虏@la職bnxV@@b聞L職mlm聞_VWnIWUna@l職L職bnV掳聝VL@K職V聞LVUVaVLXK@m脝Xna@wVm聞a聜@Xw@KlL@a聞@Va@wU聛kaW聫nIV聝la@Kn@V聧n@VUl@nKVn聞J@LnK@aVkVUUW聝@VakUVanI聜聫虏X聜W@UUU掳KnUVLl@XaVK@a職U@KUI@W@_lm@KkLUKV_U聝@禄@UVJ@XV@@mVL@K@U@Kk@VwUUm@kmWL@VkVkz聝Kmb炉V脻I@WUk脟JUIUWk@@klK@_km@UVWUUW@kbmKUX聝a聝V聴amLmK@聧namaXK掳聛VakU@mU@@a聝a@UW@kkU@U`m@U_mVkaUVWUkV聝L@lmX@聨聛Lm@UxVl聝UUl@z聛aWJXbWLUlmIU聝kLmW聝@@z@VUVU職Um脻_kVW聨@nUVUlmIklmIkJUk聝l@n@Lm@脜聵聝IUbm@UJUUVU@mmI@UU@k楼mUk@Wm聛VmI@VU@klmL聝聶k@mbkKmb聛@Wk聝KU聨VnUnnx職W@UVLUbmJ@bk@WbU@V聞kx@V@bVbkV@V聜聬@聜聴XWbUWm@kb聞录VLn聞lJlb"],
                encodeOffsets: [
                    [115920, 33863]
                ]
            }
        }, {
            type: "Feature",
            id: "4116",
            properties: { name: "鍛ㄥ彛甯�", cp: [114.873, 33.6951], childNum: 10 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@l職nb@xlJ@UnLlKXUlJl_聞KnV@xVL@bkbVVU猫@職Wb@聞Ubm職聞聨k職V職mbX聞VJnUl@聞a掳@@b聞LVb聝lXx聵InmnLVw聜anJ脝w虏IlmnXVl掳VVb脠aVb聞@lkn@VWnLlUVm脼UUkl聝k聝VkUaVaVaUw聶K@kkaVWmw聞_聞聜l@nU聞VVb@b聞aV@VV@zXJl@@kl@職l聹k掳WVn脝bnbU職VJ聞I職@VKVm@k聶K@_kK@a@aU@@wW@@k@aUW@IUWVUnLlUlVXKVwmk@W@聛聴VWa聞楼@k@聫l聧n聝UI脟KUaU@聝UUVmIUV聶Uk楼聝Vma@炉k@Wanwm聝聞@@聛n@@聫m@UIV聝kUVamUXW聝aV聶U_聶@聝mUVUImW@aUI膲K@VmI聶b@lU@@n聶J聝kU聶@K聝IUmmLk@UVm@U聨m@@LkbU聞mJX聬lbV聜@xUb聝@@bkK@LWx聛@聝bUn@xmb脜W@nWLUKUbUV聝K聶U@LUK炉聞mU@職VV@xULU聨VL@bU`W職Uz炉aUamKUa聝@@xkX@x"],
                encodeOffsets: [
                    [116832, 34527]
                ]
            }
        }, {
            type: "Feature",
            id: "4114",
            properties: { name: "鍟嗕笜甯�", cp: [115.741, 34.2828], childNum: 8 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@XVl@lL脠聝聞@VkV@V禄Uan聝W聧X@Va脝脟么@脠aVX@xVJXU脼U聜aVL母bXKl聞V@職m掳Vn_ny聵XX禄mUk楼lK@a聞_@y職InaVKVa掳_@WXI@聝@K聜VnIlbnaV@聞l聞@聜a@_聛w@聝lwUKm聶Xa@UV@職禄V聝職w@kUKVUUm@w卤VUXUKUwmJUU聝@聛km@@卤mXkmUI聶@mm聶KUwkbWakLWaUIkJm聨聝X@l聛@@VUX@JWbX@VbULWb聝lUVULknlV@bVJk聞mb炉KknWmk@@nmVkx聶@聝VmU炉KUnUL聶@聝JUIV聶ma脜aUm炉X聸l聶kk@@lk@WI@yUUU@聝b@aUa聝UmVk@聝聛聝`nxUXlb@l職LVxUbUbVbUll聞k聞Vl脻VUnkVmKUXm@kl聝@聝nUx@xnx聝n@`VX@V虏x@V@b@聞Wl@zU`V聬UVVb聞L@V聝b聶W@bkXllkLWV@V聞@VV脠wlV聹@@X聵K虏Llb聞Wnn脝L@VnJWn"],
                encodeOffsets: [
                    [118024, 35680]
                ]
            }
        }, {
            type: "Feature",
            id: "4112",
            properties: { name: "涓夐棬宄″競", cp: [110.8301, 34.3158], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@WKUmUI掳聝U@@UmU@KnK@I聝aU@makKUa@_聜KnmVU聞L@a聜聝@IXm@KWkkKVkUU@aUW@UUIVa聝ymwkbU@聝x聶LVU聛WWkk@WUkJk_WWk@WI聞聝UK脻聞k@WKULka聶@mw膲楼mXUK聶@@b聝m@k聴VWwkU@m聶UU聝lI聞聶Wm@聶@Uk@@K職kVmn@lwn@@Ul@Xm聵UXUm聫V脩聛km聧kV聶KUaVamaUXn聝聜聧@ykLUK聝聛@聶Ww聛KmKn聛Um@Um聝聝aU@mUk@kL@l聝x膵xUnkVmnXxWb@`kzWJ@V聴LmVUn聶lmU聛L@lW@Ub@V職XUb職`VLUbUJ@nmnUlUUm@@bUJlnU聞職聜U@lxkb聝@@X聝JUn聝@kb炉VVVmlXXlJlzn@VlkVW聬@bkK聶bm職k聨UbVb聞l聝XVx職K脠n職w脼l膴Kl聬職VnKlwX@lL@xlUnVn聞@職l@lmX@脝聞脠b掳录脠wVJlx聞_掳x職a職l職U脠xlUnbVxnL@lll職bm聞n@nb聜@@V聞L@V聞@@聞VL職JnIVVlKnV聞_"],
                encodeOffsets: [
                    [114661, 35911]
                ]
            }
        }, {
            type: "Feature",
            id: "4107",
            properties: { name: "鏂颁埂甯�", cp: [114.2029, 35.3595], childNum: 9 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@XVlL聞K掳bUblbUb職l@nX@W聞XVVKVk職@@聨mb@聞Ubn聞W`kL聞L聝V@VVLnKlVXIlV職@@a聞@l拢nWl聝k聧Va聞@掳bnUlLVlna聜bnUVUXKlU@聝@聫lk@a聞I掳y聞@么kUU@w職m么職nkWakml聶UkVmkUlmUUm@nkUKWanamU聞LXW@U聜VnUln聞`l聞聹blL掳KXV@聬臓J@L掳聞職J職UVw聞anK@UUImm聝聧kK@炉卤U聛m@IVmUmm脜n聧WaUK炉aUk聞w@W卤k聛V聝x聶U聶V聝w聝n脜JUIWa脻J贸I聴bm`脻b脜ImJUI炉楼炉@mU炉U聝JmnUV贸Ukl卤V@zXl聞bWVXL@bm聞m潞聛@@XmJUXU掳llk聞@nWJk@U聞@娄U`m聬炉聨Wx"],
                encodeOffsets: [
                    [116100, 36349]
                ]
            }
        }, {
            type: "Feature",
            id: "4104",
            properties: { name: "骞抽《灞卞競", cp: [112.9724, 33.739], childNum: 8 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@l陇UbVL@V聞LVb虏VlKlaX@聞聞lb職@lxUVUL聝b職ln虏VJUbW@@L聞b@`nL@nVV@LV聨UbUVm聞kVl聞聝lXbl@Xn掳聨VK@_掳`虏IVVV@VUVJnInaWK@U職@聞K聞L脝@nmlXXWVUUw@klKVa@knyVkVanI聜JXUl@XbVUl@@a職a@mXk聜bnK@UlK@UUUVaXaWmkUm楼n聴WmXaWa聹kl@Vm脼b聞KVL@aVI@mUwVm聞聛@K脜聧m茅UL聶KVaUk@kUK@U聵WXI@VlKXU聜@VVnInVV@VLlK@UU聝kKU_@聝WWUwU聶@kl聝n@聝聝@Imb聴@@m聸nUK脹@mKUkWVXxmbVLX聨VVU虏VV@x脜nmWmLU@kbmJ@b炉職聶IUb聶J聝UUxVl@z@bU`W@Ub炉nUJUb聝@WLUKULkU@aWK聝@聛a聝bmL聛@聝lmUk@@bUL聶聝WJUI聶掳聛@聝聨炉aWLk@mbUb炉b"],
                encodeOffsets: [
                    [114942, 34527]
                ]
            }
        }, {
            type: "Feature",
            id: "4101",
            properties: { name: "閮戝窞甯�", cp: [113.4668, 34.6234], childNum: 8 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@nWVUK脜@W聞nVnI聜聨V@聹k脝聜職wV@職nn@lx脼ln聬么J聵zXJl@nalU膶Vl聝l@虏Ulk么VVUnm聞I掳VnV掳@掳娄VJnI脝J脼an_VmU聧@ama聶@kU聵楼kaUklw@聫UIV楼kVUI@聝mmU脜mU聛l聝wVU@amU聴JWbUakV聝聴V茅炉Im`聝k聴@聝wVWmLkU炉聨聝XkWmLmx聛@UU聝bm@@x聶J@L聛bW@UUVWUkVK聝@ka聶IUamKUkkmmL聝UkJUVWXkWmn脜@聝K聝L聶@@VXLmbmJUIUVU@ULWVkK@nWVXL@lVn@陇聞b聜k么KXKlL@娄虏V@J聝L卤@聛聞@VU@WV@X@`XXmb@聨職bla聹n@J聝b@V"],
                encodeOffsets: [
                    [115617, 35584]
                ]
            }
        }, {
            type: "Feature",
            id: "4105",
            properties: { name: "瀹夐槼甯�", cp: [114.5325, 36.0022], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@掳kVaV楼k聧VmUkWk聛WVkVKUwkkmKUU@a聞wWWX聛WakKWkXmla職IVmX楼聝U@a聞@W聧nK@k聝聝聶V聶I炉聝@K臒I@聫WU炉LkK聸ak聝聝_kmmV聛U@VWX聝KnVmbXbVLmln@VVknlVUnVlk職lnXbmlmlXbln脠lWbn@@n職K@V聞L聞bVV掳VVz職ln職@V聶x聝I聶b聶聨U@WLUa炉V聶UkW玫@炉kk聧mxk录l聜聞XUlVbVLnlULmU@l聝LkVUl聝X@xW@炉mU聝@UmIUW聶L@aXa聵kU聶炉an聝Wk掳@k聶kKmmUIWa聛ambUkkKmV炉a聝@Ubl聨k聞mXk陇聝@@b聶@UbULWVnb@lUVVnm職nVVU聞J@bWXX@WJkL@blVU掳UV@XlWnXUbW@UVkV職VWbnLUJWLUK@Lnn@blVU聜聞nUblxVUVJXU聞a聵@Ub聞LnUVV@mVIVVn@UbV@聜聫XbmbUV聞_lVXUWanJVI@WkI@WVIVU掳WXXl@la@mX@lLXl聜kVb聹m聜X聞ylIXJV@@k職Kla虏UVa聞IVy脼b掳LlVna@U脝KnLVb職K@anwU聶"],
                encodeOffsets: [
                    [117676, 36917]
                ]
            }
        }, {
            type: "Feature",
            id: "4102",
            properties: { name: "寮€灏佸競", cp: [114.5764, 34.6124], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@lUVbXa聵InV@bUV聞x聜knVV脝nn@聞VJlUU娄VJ@聬kxVllb聴娄lV職@nb@bV聨Un聵a么J脼IXbVJ脝I聞m聞x職U職V聞w聜U虏l@X聝xVl掳bVLXb聜`XklUnmVblL聹@lm職x掳LVK@UXIVa職WlL@Uk聝掳Kk聧VaVUXmmI@U脜Kmm聝Xka卤K聴L@W聸@kU脟xUU聝@@UXUlKkklW@a職X聞a@U聝KUaVUU聫V_@yXk@聝@a@U卤w@UUW@_聞mmw@wVw聞mUa脟bUa炉UUkmWkn卤J脜xmI聛bUxmKmn聴JWw聞kUa聝K@a炉@聝bk@mVUIW聝聴Lmwm@Ua聛@WJUb@LUl聶@UUmLUbWJ@V聛L@VmX聛WWzUJU锚聞聵"],
                encodeOffsets: [
                    [116641, 35280]
                ]
            }
        }, {
            type: "Feature",
            id: "4108",
            properties: { name: "鐒︿綔甯�", cp: [112.8406, 35.1508], childNum: 8 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@V@VL@x@bX聨WV@Xk職職lU聨WX@J聞@nI@KlL聞K職UVaV@聹JlL@KUk@K脼L聜l虏_聜@nWlL聞UVV職@nLWVUJVn@anV@a聞w脼UVLVx聞b聞@lW聞@lbXn聜Vn@@录職L掳m職KVn@bnl@nVK@blb聞L聞W聞U@VWLXV@nlKn@lVVbXw掳聧n聫V_@楼V聝l@XI@ml聝kkV炉VWnI@W聜@n鹿n聝@aWKXU聝aWk@yk@k聞膵UkVmbk@WI聴y贸Im聫脻kkwm@聶mU@聶x脜聛聸lU@聛聧mJ聝X聶ak@聝x炉V@录炉Vm聞UmmIkVWK@UXIl@UWVUU@mVUI炉b炉@聶lmK聛zWKUa聶n聝J@n聝l聛b脻@@b"],
                encodeOffsets: [
                    [114728, 35888]
                ]
            }
        }, {
            type: "Feature",
            id: "4110",
            properties: { name: "璁告槍甯�", cp: [113.6975, 34.0466], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@lI聞VnKlnVlnLVb職Jlb聞@ULVlUXVVX@聜a@K職I@wn@聞aVV聜@nwnKlX聞W掳聧lVnKUX聞x聵@聞ln_掳JVIXy聜XnW@U聜K@UXIVanKVV職@Vk@KVaXI聜@Vbn@nx聵KnaU聶l聶聝聧n聶Va@聝Xa@聶V莽UUla@aUK@wmU聝Lk`kIWVkLmK@V@XUl聝n@JXV@nm聞聶bU聜贸I聝mUa卤@@脩贸VUUk@U聛lKVU@akWVUU聧lUUaUK@UUKWbUk脜J@XWa聝@XbmJ@nUJ@bUK聝L脻aUnk@聸lXbWbXnm聵n娄lVXnWbUbVV@VkL@VmL聛aWl@n聶b@bk@UVWak@WV聛ImJUbUlmz@lUbkL@lVx"],
                encodeOffsets: [
                    [115797, 35089]
                ]
            }
        }, {
            type: "Feature",
            id: "4109",
            properties: { name: "婵槼甯�", cp: [115.1917, 35.799], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@lLXbW聜XX聝x@bVVnLllVxULUl聜XXlVlUnl聨U娄Ub炉l聵n聹K@V聜bVb@職XbVL聞KVxVVnIla職b聞a聞楼lU@wnalLnVVlVLXnlWVXn@@lVI@WnU@m聝脜W楼聴aW_k@WwXy@km聝@wU聧聞m職聞職娄職lUxVLV@Uw職J掳x職@VX聞@Vb聞@職`VX@VX@ll職IVbnJlI聞b職V聞l聞聬聵J@聧聛聝m脩炉L贸a@聝聝KUa聞k聶聝聶X聝@UK@wU@聝lWUU脻炉ImW炉a聝LUKU@聝k聝禄聛k@m聝w聝a@UnKWI@聝UU@akVWK聴k@a卤聝聛b贸UWKXUmk聶KU聫mL聝bUx聞聞@lmLX聨聝@@b聞VW娄Un聶JkbWnXl"],
                encodeOffsets: [
                    [117642, 36501]
                ]
            }
        }, {
            type: "Feature",
            id: "4111",
            properties: { name: "婕渤甯�", cp: [113.8733, 33.6951], childNum: 3 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@L聝聜UnVxnIWa聞@Xb@W脝IVlXaVL@VVLVbkVV聨UVlX@bUVkLV聜l@VV么U@脪虏@Vb聞n么JV聛職an聝@mWU@I聞mVk@WkI@wmak聶@wlW@w聞@VbnLVb掳bVyX聶V_@aUKV聧VK@wUU@聶聶a聶K@kmbXVmJUX聝`kn聶n聝K@aU@mw聶akb卤@炉聝UU脻KUUU@WU@VkLUKU@mUmJUU聛@WVkL@UWJ聴X@VVL@lVlUb職LVKn锚脝聨"],
                encodeOffsets: [
                    [116348, 34431]
                ]
            }
        }, {
            type: "Feature",
            id: "4106",
            properties: { name: "楣ゅ甯�", cp: [114.3787, 35.744], childNum: 3 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@贸聶聶n@xVV贸l聝@炉z聝J@bkl@聬@聞kVWLUVmVXbVJnnlLl職炉@Xlm聞掳bV職聴lWb@b職KVXnJ@VV聞掳nX@@w聞WVklU聞K@knVVKmkUKUaVk聝Wk聛l禄nwl聨掳l枚@lX職V掳UVbXKV@職聧職a聞J職w@Um聶聶kUy炉UUU聝a聝K@U聶L@mm@Xa脟kkmWank"],
                encodeOffsets: [
                    [117158, 36338]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/hu_bei_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "4228",
            properties: { name: "鎭╂柦鍦熷鏃忚嫍鏃忚嚜娌诲窞", cp: [109.5007, 30.2563], childNum: 8 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@VK聜bX@lbUVnL掳聞@VlVnUl@VUX@聞aV聝maX聝la職UUU@wmaVUn@V聝nmmk@m聶U@kna聶aU楼Vam聶X_@W聝U聶聧mW@_k聝VaVKnL聜l聹@V聛Val@k楼@kUW@kUKVUlUV脩聛W@k脟aU禄Va聛聧lmkUVUVak聶@a聝V炉_@W聜UkmVUlU@a聹聝聝alI@akkVWUaW聧XUWw聹WVb脝@聞聬聞l聞alIVK@U聶m@聧UU聞W@al聛虏a聜炉Ua臒脟m@聝bkk@w聝@@W聶aULmx聝IU聜聶聬聝b炉@U`UX聶JmL炉a聝K聛X聸WUL@aknmK聶@聛aWUXaWm@I@U脜mVU@聶聶aUV@b聶V聝I@WkU聸bXkm@VakwUKULWKX聧mJ@XUK@聝mL@KUwVaUI@KU@mmn聶mXka@禄V@@UUa聝w炉yVk@聝UUVmmk脹脠U@mWUnmx聞職mlUbV娄Ul聛bWVUL@UU聝聶IUm脟KV聞VbUVVxkn聶LUxV`VX@職聞聞kJVVUXWaUVVlUnmKUbkI@WULmK@L@LVl聝LnmUIWV@akn聝`VXUJ聛IVlUVVbUX@陇mbnLm聜m@UXk@mm@Uka聝楼@kV@@KkU@aUKWbkLWVkIV聨k@UbVlmX@bU@@mmL@bn`@Ln@llVLVk聞@XVVU@`VXU職聜录k`V聬ULka@VllVIn陇V聬U@@bl脺聝bkx@bkL聸職kK聝n@bn@@b@JUnV`UnVbVKlVXUlbn@掳聝Vx聞@@b聞nVbUllVn@V聴VK@UnW@UVU職lnk聜V脠脼職xVb聞VVI聞xVa脝@@aka@UVaU@@a聞k@Wl@nbVI脝聨@Jk@聞L@VlXnlla@聧VJnw@UmwXU@aVK掳脪n聬llnLlb聞xnKVaV@l娄虏nVl@llL聞x@XVV聹聜亩聬職@na職x@U@al聶XUVa聜L脠镁V掳XxWXkK@職mLnlUb@b聜xnLVlVVkb@聬UJ@xWXX職"],
                encodeOffsets: [
                    [112816, 32052]
                ]
            }
        }, {
            type: "Feature",
            id: "4203",
            properties: { name: "鍗佸牥甯�", cp: [110.5115, 32.3877], childNum: 9 },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@@a@w@kV@nbVK@聝nUla聞@la聞脜l@nlVakwWX@WkL職aVm職wV聧@anK@UlIXmWkk@@mmLkWlwk@U_mKXwWK@U炉K@UU@聝VUa聶km聝kI聶yUUVUmanU@mlwk聝@_mWXa聝UWU聛@脟聝@U@aUaVwUKUI聝VkK@UWIX聝maV@k@Vm@Unwl聝Uamk@V@聞ULUamxUJkU@I聝`WkkK炉XWak@@W@IUV聶LWJkXka脟VUK聝@kUmbmUU聝UK聝bkKWUkI@聝kK脻@@a聝Um禄nI@m聝U@UnWV_@aUmWbkLUl炉b@a聸kk聫k@WkkJm_k@UV卤@聛J@b聸nU@@W脻IUJVbXL@nlJkx@聞Wn@VkJmb聴LmU聝`VbUL@xVn聞@XV聝聨@聞mVVnnJVbU聞聝x@聞V聞nVUbVV聝x@職n聞聶bUK@b聝聞@b聝J聞職m虏聞VU聜lbXzVJV聞聞JVbn@@Xmb@V@bVJ脠@聜Vnkn@掳aVVV@職X聞KnalLVm職UnnVKVlnLWlXX聞Klk掳職聶職X聨W職kLUVVV@nU@ml炉nmbk@W`脜@mb聴LWm炉U聝xn锚V猫k@mb聝V聝nUK聶@kKmXk@@JUI聸l脹LllnbVnlJ@LULnl脝aVLn聨V@nkVJ聞@lk么@虏b脝m掳w聞L聞WV@VX職K職VXI@W掳聛脝V職K聞b掳U聞JVIVV聞娄XKVL@l聜InaV脻nUl@@bX@聜聶nmVL@lVL聞lVLVUnbVW@xXn聵b聹U掳陇V@職聶聞a@kWKUUn@VlnL@UV@脺禄@mX@V_聝aka脼@VK聜炉@kkW"],
                    ["@@mUkUUm@nllVKXXVK"]
                ],
                encodeOffsets: [
                    [
                        [113918, 33739]
                    ],
                    [
                        [113817, 32811]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "4205",
            properties: { name: "瀹滄槍甯�", cp: [111.1707, 30.7617], childNum: 9 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@掳`聞U@bl職UbUVlVkn聜聨UbV录脠b@l聜XU脪kVUVVL@lVX@ll娄k@UbU聜聸@聛kmKULUbl聞@`nX職聨聞V@XW`n職UbV娄職bmb@l職V@nnlmnU聞m@UVnb@xVV聶VkbW聞nb聜Vn聬Va@an@UaVU聜JXnWlXX@l聞娄@聨lK脝X聞bX聜V@VV聞@掳炉掳xXx聜XV@nV掳UVWU_VWXkmaV聧nWVkn@lln@lb@UVLXWlnX@聵aXUmaVK@UXU聞U@WVI聜W聞XXV聜U@楼VK聹@聜U脼聨聞聞聜a虏LlV@kV@UanKma@UVUnK@UVLXyVL聜knJ@UV@@UXKWUXaV@Vb@mVLnKW聛聞m@aUUm@@UkK@Ula聞LXKWaXI@alKlmUk@wVKXL@m@聛WWn聧@UVa@K@wna@aW_XWWkXbVW@k@U炉WWwka@UUaVIV聝kU@m卤@U@@wVKka職_@VV@XUVwU楼聜聧職yUkm@聛V卤脠UKk禄脟L聛聞m聵mLk@贸拢kmWw聝m@U聞Ik聫WKXwWU@聝kL聝wkbma聝bkK@V聝LkmWIUKkUU聝脟I谦J聶X脜JULV聨脟LUV聝@UK聶@kI@WVI@聧Ua聝WmXVVUL聛`卤k脜LmKk聝聝k聝聫脜@Ua聸XXxWVX聨VbUXll@bkJ聞b聸聞@bkVUVln聛V@X"],
                encodeOffsets: [
                    [112906, 30961]
                ]
            }
        }, {
            type: "Feature",
            id: "4206",
            properties: { name: "瑗勯槼甯�", cp: [111.9397, 31.9263], childNum: 7 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@Xl@Xb掳WlLXl聞_@JlVVInwVbVK@聝@UnlVbk聞mx@VUnl@U@nbW聞XJ@VlL聞UVJVLUxVb@b@V脠聞聜@XV聞VWbnX@`l聞kx@nmVnbUVVV職zlJn聞職lVb聞UV@@V掳L@VXLWxnLV`l@kxlXnK@nl@XlWn聞`Xnl@@UVa@V脠K職拢VLVanW掳U@UVU聞@聞`VIn聧聜mV@聞nV@Xa@aVW@U職alkXK職blI聞y脝聧XnlJXbl@@VV@nklU@`聞nVK聞LVKVb@V聞U@U脠K聞UVK職IlUX@V`lIVbn@nblVVmV@@XXJ職UVV@knKVn@`@X聜VnK聞wlLVmUUU@聝U@aXL@WlU@UUW@UmU@KkLWaXkWmXUWm@U@聝nk@UmK@U@U聛aU聫VUUKV_@al@namWUI@KU聛聝K@aV聧@WUI聝b聝楼ULUJkIm聶聝K@U@K聶V@U@a@UkU@K@wVaUwlU@mU聝ULmKUkV@@anIWmUK@I炉聞mKkl@LUb卤lUakLmk聛@WwUK脻VUIm`炉n@Uk@makJU_@聝聝Jma炉ImwUVkK聝b聶aU脜@wWaU@VU@mXIVmmUkJkwm@mI聛lUKWzUK@VmLUV@VnbmLVbU@@lkU卤K聛b聝聝脻聧聛V聸@UL@娄聛VWU聝W聛XUJ@X聝VWV@VULnbWV聴bW@kmWXUK@Vkam@kkm@UlmXU聨nbWlUXV`UX炉VmUU@Ul@Lll@nnJ@L聝n聛Wmbm職@b聛聬聶`聝職", "@@kUUm@nllVKXXVKmU"],
                encodeOffsets: [
                    [113423, 32597],
                    [113794, 32800]
                ]
            }
        }, {
            type: "Feature",
            id: "4211",
            properties: { name: "榛勫唸甯�", cp: [115.2686, 30.6628], childNum: 10 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@VVUnWVXnVJ@聞聜U@V@VX聨V@@IVJU聬n聨@V@L@KlIVlVanLVbnVlI聞聝n@@a@Kl@@I聞JlI@aXU@KlK聞kVblJXU聞VlU@V聞bVkVKXn@VlxVa虏I@VlVUxln@b職JXklaVWnLm脜@y@k@a職I@W@aXIlVVaV@nnlKnLVW@IUa@a@K聞UVVlI@wXKVV@IU聝la聞@lUXwW聝n聝nalLlxXLll掳@XwVKVaXIl聶nb聵@nln@Va@U@k掳聝Um脝UVaXI聞JV炉脟U聛mmkU@Wa聛Kmak聛Vm@U@aVKkkmKkVmIk脟掳拢@aUUVaVVnKlkX聧聜mk聝@聝lUVaX@@Um@聛聧聜聶UmlUXV聞UVU@w聜K虏楼Ua@I@UV聶l@U聶V卤UIU脟掳禄VkUmVI@a@U聶m聶聧膲聶炉V卤b殴臇臒a脟L炉lm聨kX@聜贸膧@聨m職脻锚聛b卤WkL聝n@xXx@聨@b@V@LW@Ub聝l牛X聝`kxWnX么炉娄脝V@L@JVL聝xkK@V@bkz掳l聜lXz@J聞UlVla@XUV聞bVKXnW`XXV@laVV@V聞X@V炉x聝x@xULVbUJ@n@LU@VmmakbUK@b聶IWWUUVkUmkLm@VJkb@nUJ聝聛@`V@kX聶aUaVmmLkUmJ@Uk@U聞卤lkzmJUb@b聞VUxVXU陇聝L@J聝X@VlL@JkLUVU@mnUl聞娄@V"],
                encodeOffsets: [
                    [117181, 32063]
                ]
            }
        }, {
            type: "Feature",
            id: "4210",
            properties: {
                name: "鑽嗗窞甯�",
                cp: [113.291, 30.0092],
                childNum: 7
            },
            geometry: {
                type: "Polygon",
                coordinates: ["@@脠JV聞lVVLXJln聞K@UlL聞anbla聞xlK@聞XVWxXLl聬聝J@V聞nXxln么陇l@nKn聴聜聝脠Kl录VL虏脟聜Un@Vl聶z聛聨V娄UxWVU@@U聶`lbUL@xV@虏@@nlVU聞UJVb@VlbXx掳XVWX_VKUwVKVa@UVKUUVk@KnblaUU@wnWl@UX@l脝@@a聞IVmUk聞聶職xVJ聞U聞b脺聶@Uk@WWnk@聧V聝聞聶Vm@I@m@Un@m聶XUlVlUnJ@knJVU掳@@a脝LX@聝llL@娄nJV@XblLVa虏U@UlW職@VX@`@LV@@bXJlIXml_lJ聹U掳b聞K脝LnVVl聜@枚聴V聝聜mXaVI蘑llUlVnLVlX@@b聜a職nnx職V聞L聜bn@掳聫脝聧Xmmk膲聝炉w卤聶聛聶聶U膵@聛K脻脜僻艃脻莽聶聶Uw炉聝m聧聶炉k@W聜kV@炉UIUJW录kb聶U聝wk@W`@娄U么nb@V脝職l脠@VU@聛聝聝拢UWWnU脝UnmJkU脟拢VWUI@aUU@WkI@U聝a@JW@k拢kaWVUKmnkK聝b聶kkVWb聴VmUU聫mwU@kk聸@UakUUa@V@nlx@lUb卤lUbnnWLUyk@Uam聹UK聶@mlk@Wb@VXL@x@xWI@a炉聨炉V@bVn@LkKmL@`聛XmKmVU@@bkL@V卤bk@Ua聝a聶L聶KUV聝I聝聞聶W聶X聛amVVbUK@b@Lm@UWkxULWVUnm@UlUX"],
                encodeOffsets: [
                    [113918, 30764]
                ]
            }
        }, {
            type: "Feature",
            id: "4208",
            properties: { name: "鑽嗛棬甯�", cp: [112.6758, 30.9979], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@n@lxlInVUnWJ@nUVV@Xb@xV脝職b聞alLVUnx掳Jnb聞I@聞V`lInbl@@V掳mn_VJ脼UVLXx聜@nllKVb虏kVa@KlknL掳聝@JVLXnmJ@bU@VlnLVKV聞@nX@lU職KVaXal@VKn聧@楼掳L@Unw聵bna職V@KV@VUX@lVXI@KW@@IXWV@laVL聞聧聞KlaXUVVnkVWV@lwXblIXWVkVm職aU拢VaUmVIkU@y@聛WakKUamU@UUK@kmK@w聛@@聧mK@L聝V炉聶U@WwkmUL聝amV聛VUU@聝聝I聝bUKUa聶km聝m@UakLmxU@U脪WlUL牛每mwkIUm@a聜k脠blW@U聛V聝UUk@JW@XkWWUkUKUIlw@aUWknWUUmnIW聝聶aUwVa脹職聝a聝VUI聶w聝職VlUn聝J@b脜@@kVWk@mX@xVVkbma@LUlVVUL@VUbULVxULW`UX@V@lUXWaXlWXX`@bmb@x@LUb@Vm聨XX@聜@nWKUL@xVlknkL@bWJXbWL聝Kkb@VlL@Vn@VV@b聝nX聜mLUK@nUaU@WbXVWL@VU@@V"],
                encodeOffsets: [
                    [114548, 31984]
                ]
            }
        }, {
            type: "Feature",
            id: "4212",
            properties: { name: "鍜稿畞甯�", cp: [114.2578, 29.6631], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@脼脝聜L膶@職V聜職虏職掳x膴聞nlWn脜聨炉聬m@聛a聝K@聞聞掳聜n聞J職wn聶VIUa脝J職脜@w職wV聶XW@aV_l@虏V掳l膴wlaXL職wlUkalVVaX@lVXI@a聵UXJ@U掳UU楼VIVKV聫k聧lanLVa@V脠IV聫V@nk@aVa@mV_@a聞K@klKUa@UnKWk聛@@lU@@UW@@nUWUwmaVIX聝聞lV@mLXblJ@kV@kk@KU@W聝kUWV脜wkLmW@UmL@lUL聶KUL聝ak@maUU脻wUJ聝I聛b聸KUU聝@聛職聶aWK@kUWVkUwVw聛@聶m脻@聶I@wkW@a聸w聛w@LU楼聶k聝J@nVJ聝IkVVnkV聸UkyUIUl@xWUkaW@@掳kz聞聨WxkLUWmzk@@bVVV職聞b@聜@XlV聹@Vl@bVbUn聶`Wn聴@Wb聞VVI@`聞LVbXLV`mnU@@l聝L@LU聨聝ak@聝Lk@WbUJn娄@lVb@xVb@n"],
                encodeOffsets: [
                    [116303, 30567]
                ]
            }
        }, {
            type: "Feature",
            id: "4213",
            properties: { name: "闅忓窞甯�", cp: [113.4338, 31.8768], childNum: 2 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞@n聬職`lw聞k聞聝聞UmUVWX@lk聞@VanU臓录V@@mX@@nVV聜VXLmJVLnK@b聞聬V@@J聞@VUn@VaVUUUVWVLV@@Kk_@alm聛aVkUU@WV聝VUVLXmmk@wUaUKUV@聧掳聶@kmaUa脠mW聛聞mU聝VklaX@lVnxl@@UnaUk@聝VUVwVK聞n職@VVn@VbVJUknUmmVmk_Vw聞KUUm聶Vak楼@UVKVIkW@UmIVWkIV聝kmmLkwmVU聝@L聝UU@VVXL@JmLUbmK@UUKm聬kKUUmVUaUn脟lk聧炉聶mJUnmLUaUJUaWL@UkJ聶聬聝U聝@聝aklkU@炉@KWLUmUUWVkb聝L聝聨UKkbU@WX@JX@@LWJkUW@UVU@@L聶Umb聴amx@V炉K@娄m聨ULk@WbUb聶LkVW@kVVxUb@x@LlV@V@b@V職U@L@V聞Ln職lJVIVK聞娄聞aVJ@XU聨@b聞LV聜@LVJnXmbk@@bU`VLUVV聬聜b@V@VnL@Vml@聞@VXnWVXnWlXblK@LnV@VVX@VkV@XWK@b聞VV@VV"],
                encodeOffsets: [
                    [115830, 33154]
                ]
            }
        }, {
            type: "Feature",
            id: "4209",
            properties: { name: "瀛濇劅甯�", cp: [113.9502, 31.1188], childNum: 7 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@VnXK@L@掳lVlk聞b聞@聞V職聫lI@VXKVbVIVbnKVmnI掳職l聨脠kVmVbnUVVlLn聫VL@VnLVanK@IWKUUV@聞V@KV聞nUlxnKlnU聞lJUXnJ@VlXUJUL@Vl娄Ubn職VV聝LUxl`UnnnmVVln聬VK聞b職mVX@a掳脻掳L職aXJV@VUnKVXVK@LnKlLUbVVX@VwVJVn聞@@UU楼V@@UUK@聝maU聛V聫UkkJ@L@K@Um聧V聫UI@JU@W聧@U@U聛V@聝UIWmXUVmUU脟@UVmI聛lmnmakK@akaW@UwVUkKV聧nUlKVwk聧聶聝V聫U_WKUkVW@UXaWkUa@w@聫VU@聧XaW卤@Ikb聝K聝b炉L@W聝XkW聝@UakL@UV@UmVUmL@UXWVL@a職U聝聫VUUUVU@yUU聝IUa@wUKWVU@k聝聶聶Wk炉UkwVK聝LUx聶K@nVxUlUUWV聛Umw@w聝UUy聛XWlX娄WbUV@聞U聜@blbUVVbXX聝l@lVL@bk@lxkVVnVx聶娄聝`UnkL@V@L@聨聜@@xnL@lVL@VnVVblLXb@聜@zlVUJVnUbV陇聶bUnUlWXkJWakxU@UXml"],
                encodeOffsets: [
                    [116033, 32091]
                ]
            }
        }, {
            type: "Feature",
            id: "4201",
            properties: { name: "姝︽眽甯�", cp: [114.3896, 30.6628], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@nbnm聜knJVU脠@@U聝楼VknmV@VUlK@IkK@U聞W@I聞KV拢UWVw聝U@aVanIly虏kV聝l@@VnIlVnKUnVb職blWU@@_聞聜VI@mlaUIn@lKVnUlVVXX職J@aVLlanbUnV@@K@mVIUaVK@w聞w掳w@U聝W@UUUkbU@WWX_WmUL聝aVU@WkbkU聝V@IWy聛k炉kly@a@UlL聞wUK@I@K脜UW@脜聝卤U聛m@wl楼ka聝@@_Vw@姆聝a@akw@聝kKW拢X聫VUVwVwUaU@VUU聶聶xWKkb膲x炉k卤Uk@U`@bWXU職聶x@x聶脝脜IVbUJm職聶x聝I聛m聝炉@聝聶Umx聶nUVVbnJV聞@L聝@@聨kV@bVn聝@UVULlx掳VXl職職l聞V@XUVL@xVb聞JVV@zUVVVUV聞聬聶V@bUKWX@VnKUVVnU@@VlKVb聞@lX聞W@X掳K聞a聞Lla@JX虏Wb@聨UV@聬@xVbXlWb@VUXVlXLV`U聬職聞l聨UxkLmVU聨lLUVVxX@lb@blL"],
                encodeOffsets: [
                    [117e3, 32097]
                ]
            }
        }, {
            type: "Feature",
            id: "4202",
            properties: { name: "榛勭煶甯�", cp: [115.0159, 29.9213], childNum: 3 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@V職UVV@VbUx聞aWU聹blUVmnKlX@bXJVIlVUxVVVIU聜聛zlx炉職@聜VbnL@x聜x@UVaXK聞b聵@Xk聜WU_Vm虏klW聞XVK聞聨l@nXV@@w聞mlK虏X聜a脼茅n聶@聧么每@聛lWn聧掳kUKmmU脩聶聧Umm@聝wkImWU@UakL@bVLUV膵@聶bUK@alIXKWK@聶nXnKmkU聫Vw聝@炉b@L聞lUL卤W聶n@KULUaW@kL@l聝L@bU`@nUb@bmlU@U聬脟J@UUbmKkbl聨U聬ULUJV娄炉V@VWI聴V@bWJkUW@UbkUlbkV"],
                encodeOffsets: [
                    [117282, 30685]
                ]
            }
        }, {
            type: "Feature",
            id: "429021",
            properties: { name: "绁炲啘鏋舵灄鍖�", cp: [110.4565, 31.5802], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@n`lIXll@l聬聹l@b掳aVklKXaVn@bU`mX@V聞V@nmJn录聞V@b脼@lL@聞lJXVlL聞aVLV聞nVnalV聞@VL脠UlblWXI職KVU@J聞聶職_聜聫@an聶na聜X聞m@KmI@mkk@KVk聛WWw炉w炉掳聝@UUU@W聛聝a脜WkL@聧聝楼@kWWXkWm聛IUVVbm@@bUbm聫聛UU聞聝bW@UVk@mVkU@U炉聝mKVUkaW@聛aUL聝脝Vb聝b@V脜@Un@V聝LWl炉L職聞"],
                encodeOffsets: [
                    [112624, 32266]
                ]
            }
        }, {
            type: "Feature",
            id: "429006",
            properties: { name: "澶╅棬甯�", cp: [113.0273, 30.6409], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@K@UlKVm聞_職楼UwUmlUkwl@@aUK@k聞kWWUaVUka@aV聛@聝VUXaW楼Xk@WWIklm@脜xmI聶V脻Ukxka聝聞@bWJ聛aUL@聞W@聶l炉UULU聜聝b聝kV聶Ua炉bm陇Un脟UkmU職Ux聵b@VkX脟a聛l@bVnlJnx扭膧VKXkV脩V@nwlKVbn@n聞職lVbVL聞a聞J@聞VV聜UnU聞bVKlnXxV@掳職聞U@KnL"],
                encodeOffsets: [
                    [116056, 31636]
                ]
            }
        }, {
            type: "Feature",
            id: "429004",
            properties: { name: "浠欐甯�", cp: [113.3789, 30.3003], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@VK掳V職kX@@聝VK聜bXI@a聞聝lblw脼V職UnJ脝wn@lkXJ@X聜WVz聞V@xnx聜VXUVVVkUw@m職LVw聞KVU聞@Um@alU@聧聞@@KU聝mIUaVU職mnwmw聶m聛b@aW@UkmKkUkV摹kUJWb聛nU聞玫聵聛@UkmU脜K聝L炉a聸VkIk`WnkJ聝聬@xVLUVVbUbk@WlXbm聞VxnxUblbUV聶@@VUV@nVL"],
                encodeOffsets: [
                    [115662, 31259]
                ]
            }
        }, {
            type: "Feature",
            id: "429005",
            properties: { name: "娼滄睙甯�", cp: [112.7637, 30.3607], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@UbVx職bX聞mJVnXVlmVX@bkxVJVLVlXXWlX@@IVl聞V聜U聴aVwV聶ln脠VVmn拢掳aVbU職聞l聞aV聛UK@mVU@U職@VUkaVamwUwn聝WaXkl@VaUaVUUK@w聞聫WI@aU@@K@_UW聶@kX@V卤VUbkKWaU@mI@楼kK聞kW@脜K@b炉@UVmI@lmIkVkUWVn職m@@V@n@JUn聝職U聞@聨mlXXl@@V"],
                encodeOffsets: [
                    [115234, 31118]
                ]
            }
        }, {
            type: "Feature",
            id: "4207",
            properties: { name: "閯傚窞甯�", cp: [114.7302, 30.4102], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@掳楼W贸Xmlw聞_扭W聞kVaX@@K@U@a@聧WwU@mWk@聝聧UL聝WkX卤lUnV`聛XWl聴@聝aWLUb@V聛w@wmKUa@聛掳聶kw聜yV聛UJUUVwkUUJWI@akWmLUnkV聸aXV聝bUxUVW聬X陇lL@聞lx@b聞b@母Ux@`聞@lbk娄@x聜n虏V脝聞X@"],
                encodeOffsets: [
                    [117541, 31349]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/hu_nan_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "4312",
            properties: { name: "鎬€鍖栧競", cp: [109.9512, 27.4438], childNum: 12 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@n聞聜@b@XnJ@k掳x@aVUnl聜UXnV@@VnJW聬UJV聞nIVV掳聨UbVVVL@聨虏LU聧Va掳V@aV@nm聜UXblLXWVXVmVLVK@an_聞`@X@l掳聞VlXXW`nX@Jmn@b聞@nV@Lm`聞bUb聜n@VUVl@nIVbUl聝V@LkJUnVV@xVblVUbU@聝zUKU@mx@xUnn@@WV@lbUb@職nVWXX聜V@VIV@VUnJ@VUz@JWbXllI@VXVVL@聨Vn@聞聞Wlb@聬聞聨l聞XVlL聞aV@VJ@XX`聞kVwVl@bk聞聜bU聨lVXIl聝nLVa聞mVwV@@nV@XaVJVbX@lwV@n聞@nV@VWnIVVU聨脝@Xx聜a@I聞UUKmk@mV聝聞IXmWU職聶VJnUVU@anaVwk聶聸U@UXa@W聶@m_@a炉@@K@UV聝聞bnK@blIlbXa@WW_n@V聝U@炉bmy聝Uk聛UJ脟脜@W聛U@kWK脜w聝聧nm掳KVkmankVWnXVWV@U聝聝wXkV@m聝聞UlLna聝聫VaX@VUn@VnVK@xlnXW職U@a聶@@klak聶Vw聶mUaV@聶wmI脹`m聴@mVUXmlIX聝V聫聜I@K@aU@UaV_UK@wkUmmUKWX聛聨mVkU聝L@m聝聝U_nK聜聶@aVU@Ukak禄@U聶聶@ymU聝聞炉聶聝UU聝VKkam@聶nka@聝mwkLWb炉mka聝_VaVKU聝聶IUw@聫kKm聛U@WK@Un聝maULkU@wUalWV鹿U@@WUI@WU@聜_@W@U聛@m聝U@Wb聛bUK@Um@@UmbUw聛WWkk@WU聞a@anUUwlWUwUU@wlJVUnnV@@mnI@m聜K@U@w聞a@wUm@_m聝VUUaVUk聝聝聫聝_k膵Uk聶VWL聛聝@mlU@kn楼W@Uw聛UWV@V脻U@lXLWVUbVLXlVIl聜knmU@VUJk@@聞聝@聶聧kVmwmVkxU@@XmVUb@xnKVLl@VxUxkIU`@bWVXX@JWL@bkb聞陇@bmUUU炉K聝kmb@V聶VU聞VVn@@聞Vb@`ln聹xmb聞lUn聜bk聞@xU聞mV@bmW聛bU聬V@VJ聞Il@nVUb聜K@nn@VbnJVIlJVkXJ@X@lmx@bnnWVXJWXU@UlU@m聧k@@llb掳x聞IUbnJ@VWbXVmI@JVX@bk聜@bWL@JUXUK@U@U聝`n@@Xm@XVW@@nX@@`聝ImxU@@JUI@K聝LmK@U脜UUV@VW@聶炉kUU@UamVUUmJ@n聞xmL聛K聝kmJkwkKm_mKXU@a聝U@b@Wk@ma@zUJVUmbUlU@聶xnXlWlXXblK聞陇V@@nUVVLkV職聞l@Xb@VVK聜nXKVx@znW@X聜@@lVK@X@JXbWbnn@JUamLVVXIVxnK@aWUX@聵x@VnI@WlI@anV聞IVxk聜l@lbXX職xVVVJVInbV@@ln娄ml@XXVWbkJWb", "@@XLVKVXVKUa@UUUmV@l"],
                encodeOffsets: [
                    [112050, 28384],
                    [112174, 27394]
                ]
            }
        }, {
            type: "Feature",
            id: "4311",
            properties: { name: "姘稿窞甯�", cp: [111.709, 25.752], childNum: 10 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@lxUXV聜lXUVnlV蘑聞JVbUXVJV@XUW炉聞聫VIUK@klW@Un@聞nl@V`XUVL@l@職Vx@聞XXW`UnUb職xUlVnU職V聞lb@VnJ職UVVVInJlU職VnwVklKnw聞LVJV職V@nIV@nbVa@KVVVUUa聞KV_nVVJ@_VW聞nV@n楼lI@an聝l楼X_VKlwVlULUVVV職@職U@VXL聵聝@IUmn@VU@wmKXUWU@m虏職l@VIXWWk聛WUkWlkIVamUXamUnmWUU@@Un聶lK@聧XJl@k聛V聫Uk@mWKXkl@@aVU@UVWUUVa聞In`VUVLnw@U@K@U聝聝@w@UVmUU聝聶掳K@UnV@bV@Xk@KVm@amk聞aU拢VWUUmUUwm`UbULka聸KXU@kVmU聶@aV_UWVIn@聵y聞XXK@klmV聧聞聫V_kWVUn@WUU@U聝maU@聶wnwWanUmmXk聝am@UakLmK@b聶xUUUU@Km楼Va聝炉@聝k聧UaVUlm聞UU聧@mUU脟mUk聶聧Uy聝b聶bUa聶XUWWb脜LmL@V聶a聛L@WWXUKmmk聧@a@UUK聶XW楼kU@V聝UkxmVkUWbUJn聬VJ@nVJXzWxk聨@lVbUX@VVL@`mbUn職聨Un聶VV录k@Ulm@mw聛L聝b@lmLUK@U聛am聧聝W聛k聝K@拢Ua@聝聸UkJkUmbVlkX@bWbU聨V聨nnUVl聞@b職bVK@VX@lb聞V@nU陇職x聜虏聞Knblb@x聞V聞么@職l聬聛聨@b@l@XWxnVl@聞VV@XLVl聜LU聨UXV`職bXXmJU@@bm@UUkLW@UlUKWUUb聶wUm聶L@nklVVmVXXm@@bUKl脝n聞聜XkllVUVVL@nUbV聜@V@nnV@xUn炉U@JW@UX@x膲@聶`m@@L聛V@b"],
                encodeOffsets: [
                    [113671, 26989]
                ]
            }
        }, {
            type: "Feature",
            id: "4305",
            properties: { name: "閭甸槼甯�", cp: [110.9619, 26.8121], childNum: 10 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@XIlJ職I聞VVK@聛n@VVVKnLVwVmnLVK@U聞@職w聞J@wVI脝職掳聫X@脺脠聞U脠xll@kn@VwVaXJWXn@@WVL@UUKVKV_U@@aVK聞x@U聞aV@lk聞@XylbUaV_職Vnal聧@W聞U@a聞I@aV@@aVUl@Xm聜UX聧WaXml@@kk@ma@聫V_U聫nUV聶UUWJUa@kkaWLUmk@@LUVWUkJWk聛K@录UnWJ聝IkV@b@JUIm@Ul聶V聶聧m@Uw@a@k聛W聝XWKUknW@聝WUU@k聶mx聶UkVmIUJUU聶VmI@UkaU聝V聶UmVk聶wVaVmX_WW@聝Uw@聶@kUKWVU_k@聝mm@@VkX@lVLUJ聝聬X掳WVU@UIVWUa聝IU摹mkVUkWU聛VWkwWXk`mI@楼kUV聝U聝Un卤@聛m聸XkWknV聞UVmmU@@X聝V聝Uk`@X聝聝聝k@楼炉禄mb膲贸@mkU@kU聶聝聝聶KmX@聵UnmL@lULkKU聝WUU@聝bUaUn聝@Vb@l聞娄Ub@l聶@UKmn聝KUnl聞UVVbUVn聞@`Vn@x聝b@x@V聛L@nmJ@nU@mmUVkI@xVVVxkXVxmV@b聝bXVl@Xl聜XVxna@Vn@@VVL聜aXaV@n聞聜@@V@X聛`V@@XVJ@XV@U潞kXVb@xlVVKnbm聞@VXLV@n聜lL@聬Vx職JV聞ULUb聞`lb掳nXalKnx@聞lb職mn@lbULV聞聞V掳職聞聝nV@z職職@Vl录lb@VUV@b聛職mLV`聞聞@n聞KlVnU聜聧XWVLnnlV@xVLU`VbV@"],
                encodeOffsets: [
                    [113535, 28322]
                ]
            }
        }, {
            type: "Feature",
            id: "4310",
            properties: { name: "閮村窞甯�", cp: [113.2361, 25.8673], childNum: 10 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@虏zVaVlnVl@n職Vk聞Jl_XJlIVmnL@mV@VXn@lV@聜XzV@lyV炉虏U@UlJ@XVKnVVIXl@UVLV`@n@J聞I@mlI聞KVLnUlVUVVLXa職KVLl@nb@聨W聞XV掳KUnVV聞L@xVJ聞L@b@LUVVVU聞聵VXbmbVbn@@lUbm@聛x@XVVV聨@聬@聵@bkImx@Vm@Xb聝b@l掳XU陇聞a聜L聞mnL@bl@@聶VUX@VxnV聵anLn聝W聧聝楼XKVwnUW聧XmVIUW脝LVx聞L聞w@wVmlU@楼X聝WUkwl脟n_Uw聞WV@VU掳wn聫U聴聝y@aV聧職kVlnL@lVn聞w@VlJ@b聞X聞x@bVKnb@U@WVUl@@Vnbl@XLlK@aVLVKnx脼n@a聞LlmUaVU聶聝m@脜knUmaUKmVk@m聶kk@UlWUkVm@w@kUU@W聶聧U炉聶楼@w聞脟@aVIlUV聫@kUWU@UUm禄@k聛@mKVkUKUw聝aUaUa聸@k聞kUWJkImaU@UK聶@maUzk`@z聝y@XmJkL@UUJmUkV@z聸@k聨kVmK@娄UbWL@a聛@UbmKmwUK聶Xk聸VUUkmVkw@UUKmL@WUIWa聴JW_k@@WmI@mk@W聬kWULUUVKUUVm@聧職U聞b職@聜聫nU脟聝@U@w聞聶V@Ua@a聝L@ak聧聞聸l@k聛聶U聝J聝w贸@@L@V@聞聶`@聹聝J@xnn聶職mV@bkJmU贸@聝n聴JW聞UUm聝U@UV@Lk聞WlnnmVXbmx職xV@nbV聞V@XVm@UVlXU`聝聬U聨kn@lWL聝W聴zm@UJVXU`@bV職Un@lWV聹LlbVKVan_VxnVVVUXV陇聝bnl@bUn@LWlU@@amU@V炉L聞職VVUn@V@x聞聞@V@L@VmxUKUVm_聝JUbVV"],
                encodeOffsets: [
                    [114930, 26747]
                ]
            }
        }, {
            type: "Feature",
            id: "4307",
            properties: { name: "甯稿痉甯�", cp: [111.4014, 29.2676], childNum: 8 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@l聶U聶mkUwUyV聛聶@VW@炉Va聴聧VmUU@KVUVUVLnaW聝nkU脫V_@mVU@脻聞w@聝ka@kVm聝UmK@IkaUamKkXWaUW聛@WUk聞聶@@KVU@aU@聶L@J@X脟VUKVak_mWkLWakVUbmLUUml聛UVKUU@kUWW@UImJ@xkLkKm@@X聝@贸脻聝@UUk@UK聝V聶聝UL聝K聝XkWWbka聝IU聧聝WU@mUk@WL聛aUJ摹聶聝@@X脠脝VIl聜聞Vnz掳aV@U聞m@X`@XWbkakJ@amL聝aU聞@V@L掳@@bn`職@@XWb@V聹Vl職Uxmb@bUVmVUI聶職XVWn聝JU聞@nnlVL聝V@J聛bWzk`m@U聬VK虏V聜x聞k聞LVl聞@Vn@V聞聞掳xVKVk聹VVlUblx@bU聞聜脝聹@@nVnUll聞kx@VW@@VkLWxUL@b脻@kKkV玫V@bkXVVUV聝@聝VkUkV聸LkV聶a聶@@聬聶聝炉xUxmX@JVb聛掳WXkK@Vm@k聞Vb聶bn陇聜xUXkJ聝blxnX脝K虏l聜_@Wna職n@聨UL@b聜JnIlV聞@lU聹@@炉么@lW葌IVKVm聞U@aXaV@lwVXn@@K@UVKUUnU聜bn@lW職X聞聝lJnU職L職KV@聞聞l@虏a@UlK@aV@naVX聞WV_nKlL@KUm@a掳U掳聧@VXL@a@wWmXal@聞k聞@VLn聸V@@bl@VnX@mwVa虏aVU@mk聛@聫"],
                encodeOffsets: [
                    [114976, 30201]
                ]
            }
        }, {
            type: "Feature",
            id: "4331",
            properties: { name: "婀樿タ鍦熷鏃忚嫍鏃忚嚜娌诲窞", cp: [109.7864, 28.6743], childNum: 8 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@K職L@wnK卤聧n聝nm聜聴@WUk聞聝脺脠n@n禄@mVamk聞m職U聞聞l@V聶nmmU@wUan炉VK職Ln聞VWlInyWU聹I@WWk@KXU聵n@mnUmU@W聹聝mkV@聝kXa職aVaUm聜Ik聝聝聧@聫ka聝X@聝Um@聧UKWU@UkJWkXa@IVy@UmIUVU@UJU@W聛XWmU@聶VakaU@@Xm@Vm@wnwV@VL聞yV@VakUUa@wUUVmlI@K聞UVkUamJk@VU@U聛mVa聝an_@KmU聝@@anm@ImWX_WWUk炉聝@k@W聝_m`@bULUKUnUWWXkKWa聛VmnU@@b炉UUbV聨卤K@聧UKUUVa炉聧UUmJU聝VIX聫mI@UU@Wm聛VmkUV@b炉w@lmI@W@a聝聛@m炉LXbmJVLklWL@V@XX聨mbVVU@@VU虏Ul@VlX@b職`Xx聸zUmkUV脪l聨@bXLWxXVl職@V聞bkLma@nmV聛mULVbmVUb@lnzmbU脪Vl@掳nLV聞lJkn@bmJk_聝Vmmkblx脠x@LUb聞xVb@V聶n@JmLV聨U職@聞nV@娄VbnJ@聬lVVbkx聶bm@UxVLV@n`UnVVV聞kl掳z聞xVb@VU@@脝lXnWm娄nbVK@XVVUVVl@X聞KUV@nVL@WnIW聨XLVKVLlxUbVKXVWbn@@UnKVLVb聞J職U@aVU掳b"],
                encodeOffsets: [
                    [112354, 30325]
                ]
            }
        }, {
            type: "Feature",
            id: "4304",
            properties: { name: "琛￠槼甯�", cp: [112.4121, 26.7902], childNum: 9 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@l職V@XV@聞mXVlXL聞W聜X@l@bVxn@職聨職UVkn@VJ@I@alU聞JXIVm@禄聜LXllIXVVU@Kl@VnXKlb@lVbXIVVU職mVV聬U`@聬nbl@@lXLVVVKVbnXWJ@VXbWxXb聞Ul聶VK聞娄nLVVUVVb職b聞K@U聵LnK@Un@VxlUV`UnnL@VVL@JV@VUnxnKVbV@@V職IVUnJU聧VUl@nW聞Xl聫lIUa聞KVb脼LV录虏`V@VIUwlaVmXa@IWanK@U@m聞kV聝VUVaX@l職naVL脠@聜楼@kkJU聛WJUa聝XkaUm聜wV聧XJ@_lWUU@楼n_聜Kkam聧UK聞聶@amK聝n聛K聝bV拢炉W@k聞aWan@@UnwlJ@a@聴@聫U聧UU@W聜wn@Va@km@UanaWa聴UV聝UUVU@K@a聝KUI@w聝KUUVm炉LWUX聝@聧mak@UK聶LWbUKVUkUmVUK聝LkJ@n聝J@I@mU_UK@VWkUJmUUL@WkI@V卤VU掳kzU@Wy@聛kUm@UWU@@nmKUnkJWIk`聝IUlm聶k@mUUkUb卤yUX@VUV@bk@WlXL@nVlU聬l聜k@WI@聨kLm職@VV@XVmnnVWbnVUblJXkVl聜XXlWXUJk@卤聶@nXVWVnL@xUVm@Vn@J聴聞WK@U聶V聶@UUVUVKUkkxULW`k娄m聞@bkJm娄U@聝mUX@`UImUU`聝LVbUVUU@LUbmaU@mJU@U聶UI聝KmxkLUl"],
                encodeOffsets: [
                    [114222, 27484]
                ]
            }
        }, {
            type: "Feature",
            id: "4306",
            properties: { name: "宀抽槼甯�", cp: [113.2361, 29.1357], childNum: 7 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@wUklmU聧UmU@@UVm@wUaV_mmUKmwkIkJmUUnm@聶聫聶@UU聝bUKU聝m聛脹amm炉xVLkb脟脝聝U聝VUzkVUl聝UUKWLX娄W@聝VUUUa聝KUbmL聛Km聞@akU@a聝mVaUUVIVWkk@wk聝聝@@xmL聛lm聧脜wmbVlXl脻IWVkK@kkV聝L@VWKU@Ubln聛a聝聝m@聛b@b職nW`@XUJk@UUWK聝k@U聛K聝nn聜@xmLUVm@kbVbV聞nV@V聞b聜聬@KnV聞LW職X聨脝V蘑娄Vbl聨職聞n聞UJWz@脝聶V贸UVbkV聶a脜x@娄lVUbVVknWK聝聞k@聝w聝K聶VU聞脜聞聝l@zkb@`m_mJ@xX聞mbVb聹@llV@n聞@llbXL聵UXalU職l聞alVnwnLVKl職VbX@@I聞V@blJ@bVL@VVVUX脠陇聜VnkV脩Xmlbn職聜聞VKk脩脜聶@UmaV莽@卤XUlI聞xlV聞@VaX炉lUVVU職VJn聴V@掳掳n聨掳聞Vx母艂掳娄職b虏娄lJ@U@aUK@kUm@_m卤VIXal@聞Kl@聞bV聧@K聞K@k聞m@UmUUa聝K@_UJ聝aXU聵@Xm職_VmUk@WUk聸@kU@a@m@U聝aU聧UU@al@ny聜XXWWwk聛ly@炉n@@bnV@k@mVI聜聞聹VlUUmlU聞JUw聞I聜bX聝VaUal聧@K聞b@聝VKVkXVl@VkUU@ylU聹VVaVL"],
                encodeOffsets: [
                    [116888, 29526]
                ]
            }
        }, {
            type: "Feature",
            id: "4309",
            properties: { name: "鐩婇槼甯�", cp: [111.731, 28.3832], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞聨脝xXL@l聜V聞@蘑職VI聜bXKl@nVV@聞XV聨聞JlbXalX聞W聞LVK職聞聞UVLl@VV聞@么脼聞@@Wn@lLlK@wnIVJX@VX@lVVUL聜VnkVVnKValUXblKnXl`UbVL脠U@W@I職KV@@bUV@L職@l聝XV聜@VXXblWnLVblb@JnL聞VUn@llb@聞聝x@脼UV@nU`V脭mlX聞mbUKUVUV@LVVUn聵聨Ub@掳UX職@U聜VzVxnlV職k職VnlVnaW聝@wnIn`@_la@y聞k脝聝V聝職U聞L聞xl@聞聝XLlmUUVakU@楼脝w職blUUa么V職U@脜XyVIm聝聶聝k聧Ua摹楼脜UW聧X聶聝KmU@L聛聫聝a@UmUU聝Ualan@VUnK@wm聛聞m聜L@V聞lXLVVl@VI@WX_聶m@a聶炉mKU聧kwW楼UK@_UWWLUVkUWL@WUIkV聝U@J聝wkLUUmJVI@WkXm@VmkKUIU@mmm_@VUV聶@聶聞kJ膵wUU@K聛UWkkW@IWW@聛km@klwkWVkkU聶V炉m@kWLU`mIkmkXm@@`@L@xUKWkU@VL@J聛UU@mbUKVa炉聛WVnL@`lXUVkU@xW@UbUWVU@U聛J@聞lnU@m聜n脠mV聝a@bUL聶wUb聶@@VkxmUU聝聶聧UV聸K@I聛聝U聝mk@akm@wmI聝聨kK@b聶VWXkm@wULUmm@UVW@Ub聞聬mbkK聝Vn聞U@Wl聞xV聞U@UXmWUXmlnbUl炉Lmn"],
                encodeOffsets: [
                    [113378, 28981]
                ]
            }
        }, {
            type: "Feature",
            id: "4301",
            properties: { name: "闀挎矙甯�", cp: [113.0823, 28.2568], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@lVUllXkx@lln@聜XX@JlXXl聜V@LVV膶xlI職聝職@VU@Un`nnV@VJlLUnn@lW@XUJnIVVlK聞x@I聞VlUVJ@XXKlVVUXKVX@`VLX娄lxV聨nL職掳聜an@聞聞聜bkmVaV@XL@U聞KlU@llLXU脼JWkUkna脝xn聨聜knK@w聞@l聞@xllUXUJVVUb聞n@blV@bn聝聜LnKVa聞LVbVV聞UX@W楼XKVL聞VVklUVy聞U聞V脠脜laUK掳wnn脺bn聜V聞VL聞aVV職@職聬n@VmnVlIlJna聞@Valkn@na@amwm@聞UXw聵K@aUUVUUaVa聴wWK@kU@UaW@kKUU聝聝@k聶W炉XWan聫@k聞聶mm脜@@I@U@KmLkaVU聝KkLWVU聝k@UVmU@am@kkk楼聝U聝VUK聶聞maUb@聨Ub聶I@a聝KkkWm聛@W聧炉K炉b@VmaULVxUXlVk@UxVJVbUb@xUL聝@ULWW聴L聝臅mx聛VVL@職Vb聶KUw聝a脜虏WwX@@W聝UWLU@VbkV@aU@@VUnmJ@VUn@V聝LUK@U聜mUIk@U脟m聧U@@UW@聛J@L聝bUmVI@aUmW@@bkXUx@lmLUbm@UbkJ@V@XmlUbkKm@ma@kUaVU@aUK聛@mImJUIkV聝U聝VUakbWwka@UWKkLUamKUXm`脜_U聵聝聬ULmaU@@lUV@X"],
                encodeOffsets: [
                    [114582, 28694]
                ]
            }
        }, {
            type: "Feature",
            id: "4302",
            properties: { name: "鏍床甯�", cp: [113.5327, 27.0319], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@X聜聜Unw聞臇聵KXXVK聞@VK@wVaUaUIVwl@kUVWUwVKnb@U掳a掳LX聨聜@Xnll聞L@b職JVa@聧Vanb職聝VL聞U聞V@al@@UV炉脜脟@Ummk聧聶w@炉聝yVwnUVVVUk聧mWV聴nKVU聝a@WXkVKn@lUVU聞VVVXIlV掳VnI@VlKnV@聧mwVm@LXKWkU楼聛wWw聝聝@k@m聞X@KX炉V@VUVa@VnKWk聹聝V@VUkm@aWa@wkUWwkmV拢V每XUVL@mVIXa貌@nW@a職U職@@am聶@aUU聞Um聧XmWUk@聝聝n聧UW@_maVm聶wU聧kamaUL@a聝w聝W@akI@U聝xUm@kmKUk聶lU聨@b聞zV聵m聬炉xUVU@聝XVxm`k脠lxXVW聞@娄kVUn@x聝x聝KUw脜KVXUJWnX聨mVUxWL聞娄X聨m聞mK聴bmUUwW@UV@職k@聝職VLn聨lb聛Lm`@娄VVkX@`WIU聨聛xVnlb聞WVbXIV聜lI@l聛娄脟@UKmbk聶W@UbUVU聞聝l@n@VmLXb@JWbUnkbVxUJUxWXXlWL@V@V@XXJWx聞zUVVVVKnXW`@bkIUl聜聞nLVJUbUIWVXlWV@XklVbnn@xl職"],
                encodeOffsets: [
                    [115774, 28587]
                ]
            }
        }, {
            type: "Feature",
            id: "4308",
            properties: { name: "寮犲鐣屽競", cp: [110.5115, 29.328], childNum: 3 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@InWVw掳w職聞@聫職@職blU聹KlUlV聞U聞@VUUUlW@a枚UlUlL脼@@aVKXwlK@UX@@Ulwk聝VkUm@m聸@聛脜V聝@akwVaUk聸UUlUL炉w聝聝@UUm聝@Uk聝K聝l聛w卤UULV聫n@l_XyWw脜@V聧UUmJUXU@@mm聝U@kxW@UaUIWbU@@mU@Ux聝nUbmKk聞WJkUV聧聛al聝@aUkUx聝lW_@WUIU@聝bkKWU聛JVnUb聶bWb聞lU@nl聸聞@XnVmV@n聴mWV@LXl@X聸JXVmzkJUXm聝聶KULm掳Vb@xnVmnU職k@聝聝聶V聝nnlUb@nm录m@脹脟聝聞Vl@X聛聵mnm聞虏聨mL@x聶K@LUl@nUL脝x@V@VXVWbXX聵l聞@nLlm@bVK聹X聜W聞L掳bnU職@VaVU職@職m職聧Vw聞JnwVK掳zn@V聜Vb聞a聞@膴录"],
                encodeOffsets: [
                    [113288, 30471]
                ]
            }
        }, {
            type: "Feature",
            id: "4313",
            properties: { name: "濞勫簳甯�", cp: [111.6431, 27.7185], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@lL聞聧nJ@xln@bnlV聞聜聞@J聹LVU職聨V聞nVlw@U職@Va職xVK@a聞bnUm脟n聛V@km@聝聜I@VUVVXVaX@@wlVVUkW@_mKXU掳聜UbVLnaV@聜V@IUKV@XlVL@w@K@_n@lWlnnJV_XK@l掳n職U@WVU@kV@nbVK聞聫V聴l聝@聫nLl聝聞LXU@聝lmkw@nW@UKVa炉IV聫n@@aVUUKl@nXVKVn虏a聵聨XblKnLlmVI@KUU@akLUaVa聜UXm@a聝聧@wVUVKnLnWlXl聜n@@U@anUVm@U聜Inm@IUK@UmKVmU_kVUwm@@VmL聴K@V聝L聶aUaVUUUmK聝楼ULk職聝VWaXwWa@UXImWUaULUUWKk@WnXbW聨聛VWnk@UV@bU@@b聝J@b聝V@Xk聨mb聶UU`VbkaWz聝@klU@聝b@V聝wUL@bV@U`ULVL@VUK@Xm@XWWIUbUxm@@lkk脟w聝V脹脟W@炉聬脜聶UJ@x聝I聶x聝@@VULmKUnUxmKULUUm@@聜UL聝U聶JkIWJ@b@L聛JU聬W聞kJWnUV@nn聵脺_nJ職xU@Vb職nUxl職kb@l職@"],
                encodeOffsets: [
                    [113682, 28699]
                ]
            }
        }, {
            type: "Feature",
            id: "4303",
            properties: { name: "婀樻江甯�", cp: [112.5439, 27.7075], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@脝`n_VWnLVblKXL@VlbXxlaVb聞U聞VlUVJnInJ聜@VL@bUVVb@lnbn@lLVank@W@UlIVan@VanK@kVwlW@aX@Vn@bUJVn聞a@K聜IX@@VV@n聨V脠l@VJ聛n@VVL聞K@UVm@UnIVm@UV@@blUUaV@XK聞V@XW@Xx脝卤聞bVx職LUa@聶UKW聛k聶@wmmUalk@WXUWkXUVJVaUImK聛聝VklJ@aX_mWULUUVU聝yXwWI@W@U@UXKWkXWVwU@卤_U禄脻KUa聝LVbkJk聬聝WmXk@UVV聨mIUV聶J@UU@UamLmwUVU@mn聛J@VUnmV@b@Vm@k聛kWmXmKULUV@x聞聨@bWn聛VUbVblK@bVV@LUJknmKkLWa聴聧卤bUmULmWk@VLUV@bm@U聬掳JUbVLX@@mlxkn@聞WV聝Kk聞mK@聬k聞"],
                encodeOffsets: [
                    [114683, 28576]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/jiang_su_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "3209",
            properties: { name: "鐩愬煄甯�", cp: [120.2234, 33.5577], childNum: 8 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞n@聜掳膧脼掳@娄ULWKkx@bkLWb@lUlVXXJVb聝nUKmxXV@bm@@X職聜聞L脼職脺娄XlVn職聜mzVJ@n@聜虏脼么k脝聝脼a劝膲聜wn菈脺贸聞茅V脹n聫膴墨膶菈聜膲@艒@K脼UlU@聝kkl脟脠脩職脩l摹X蓻@U摹聝聝aU@U_聝W@n聶@kaUL@VW@kKmkUV@bkbWW@bkzma聛@聝JWI@KUKUL聝@U娄聶`@XUJ聶U@KmX聝w炉KXkmy@aUIWJXXmV@K炉UU@@bVL@陇VLXbV@@JVXVK@聞聞JVn@bkKmakVVXUVVVlI@`U@nzVV聝b@陇n@@UlKXLVV職I@V@nV@V聜@脠Ux@職贸V艒職聝k脜W贸@mU@bk@脻wk@WbXxm@@J@zV@kV聝bV聜nLWVUX聶WUXU聨WLU聨聛@Wl掳z@VkxU@UVWI聛xWJkb聝默聞nW@@bUl"],
                encodeOffsets: [
                    [122344, 34504]
                ]
            }
        }, {
            type: "Feature",
            id: "3203",
            properties: { name: "寰愬窞甯�", cp: [117.5208, 34.3268], childNum: 7 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@XKVX@WnIVx@K掳Lnll@@I掳K聞nVa職U掳x虏mlx職@VanU@a聝k@akmV@@w聶@Ua@aUwVwUw@w聸@UK@拢ka膲l贸I脟Vk聨卤@@kUKmVkIkxW@Ua炉UUm@UVI@WVI聞JV聧@聝@Um@Uana聞U@m聜I@J@XV@XaV聫lkX聝VaUUWLUyVIXmWak@聝XkJ贸k聝JUL@KWkk@ULU@Wa聶lUIkJmI聶mk聞VbV職@lV掳kXUKWKULU聞mb@VUlVn聝b@V聛V@IVKUUmU@ak@@bmV@xkl聝U聝U@U聛KmV@n聝JVbkX聝KUamLUJ炉UUVmI聶bVV聴Ll`@L聝LU`m@kXUVU@V聞lxUK@xkIWbUK聝x@聬V聜kVVn聶b炉@@U聶@聝xk聜mbkL脟K聶b聶@@XnJ@LmVkl聝@@X聝lU聬聝Vkx聝akVVb@bVnUbU@@x聵VU職Vb@職聞聨nI膴`職XVV么J職_聞K@xlU虏Klk聞U聞@VaV聫V聧脠m@kVUVmnamUUaV聝XIVJ聞@聜莽@楼nkVLn聸聞@@XVK@VUX@JVUV@UnVJVLUJVLUVl職nI聞b聜KnU@m掳聶VanI@anV聜KVL聞an聞lK聞bl職聞K脼k@娄@陇@聞VKnLVK聞L聞KVzlW職LX@VmV@VbnU掳@Ualk聛聶聵WXLVU聞KW聧kUUW職聝@拢Wa"],
                encodeOffsets: [
                    [121005, 35213]
                ]
            }
        }, {
            type: "Feature",
            id: "3206",
            properties: { name: "鍗楅€氬競", cp: [121.1023, 32.1625], childNum: 7 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@VJ@bnzWl掳L聞xnW@L職VVI@W職_V楼聞@VKVL@LXJ聞I聜@nbly@aXXla@aVUnllLX@@UVKlb職@@m聞XV`V@聞b蘑聞lk膶脟脝聝葮炉職wn臅V膲V每職U茠U臓聝纽臒l聫X脩V堑@卤艒L实臇炉l脟b脻脼炉xk@脟k姆茅聶n炉@臒聨摹拼谦@kVVlUb聝L@xUL脟聜贸LU聬l陇@nkVV掳VLkxVb@l聶aUXUKW臇klVX@陇U職聝Ukb"],
                encodeOffsets: [
                    [123087, 33385]
                ]
            }
        }, {
            type: "Feature",
            id: "3208",
            properties: { name: "娣畨甯�", cp: [118.927, 33.4039], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@職n藕U么脪纱猫聝職l娄n臇V聜kbm職聞X@xVlVL@xUb@bUJVnUx聜職聹聞lKVL脠x聜m聞zXV@lW@XV聜b@b脠職Vxnb聜聝VIXa掳L聞a脝VVaXUlK@aXI脝聞VlXKVUlIXalK@alwXLVK@楼脻炉炉每@聛聝mVk@aX@聝m聞墨laXI聜wXJVUV@lw@U炉y聛b聸U聛a聝U摹U脜aUKVkna摹m@kUm@w脝IV卤nL脝w聞脟nUUk聝聫@茀脻U炉J脻I炉娄Ul@b聝@@VVL@l@L聝L脜m聝L@b聶@UaVaUWmLUKV鹿聛K聝LWKX楼WI@mXk@UmaUVUU@VmL@W聶bkIUW聝UmV贸Ikbmm聶@UbVLUxmJkU@bkJWbnXU`Wz聶KU脼脠lVb聶Lmx@聞k猫@脝"],
                encodeOffsets: [
                    [121062, 33975]
                ]
            }
        }, {
            type: "Feature",
            id: "3205",
            properties: { name: "鑻忓窞甯�", cp: [120.6519, 31.3989], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@么猫膴VnX掳陇虏聞lx茠脠脺@虏x@J@b@X聜`nIU脝聶UUV@bl@VVnL@L@x聝J@X@blJXnW@@`XbW聞kV聝@UbVx聝XUxkV@L贸xVbUVW職虏職VJ母klU乾@蘑瞥臓聧掳@職m茠墨掳禄脠聧脟楼ULUU卤a@bU@炉聫聝U@KnImUVWUk聶mXUVU@聫lIVaUU聛VWKUbUkWKU楼n拢WakJUkUL聸K炉L聶Kk聝VIn@VaU聝VUU聝聸UkVk@聝U@amUkJ聝@UUlwX楼W@@UkVmk@JUakL聸@kk炉脻mJUn@nmVXlmbVVkn@聞UJ@聛卤WUxV聬炉a炉K艒b脜录脟xUx聝職U聬UlWL"],
                encodeOffsets: [
                    [122794, 31917]
                ]
            }
        }, {
            type: "Feature",
            id: "3213",
            properties: { name: "瀹胯縼甯�", cp: [118.5535, 33.7775], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@XbWnUJVzXKVVUbW聞klU聬WbU@@W@I聛J@n聝VmbVbn@@V@聞U聨聝IUJ@XUJ@VVn掳VVbX@lwlJnUVL@l虏@l聧脠U么J膴klb@陇VL聹@@xVxUxVx@bVb職@@xU@ln聞mnX聵mXLVmV@X@lxVnVJ么L聞LXa聜x@b聞@@KVL@bn@@m@聶@alLUUVaU楼nIV卤聜I@mXI@aWWXU@LlUXWW_XWmaUw脟聶@a聛aWUX@@kWU聝y聛n脟wUKkL聸聝聛聶VwUmVI@aVa@wUKUk@w聝Wn聶laU聛m臅k楼聞聶沙莽贸脩殴V聶mmzkVmm@a@I贸聝k@@LWU@`聴聞WbXLWlkImJVn@`nXVbX聨mL@Vn@聜l@nUVl掳Xx掳U@LV臓@z掳聵@娄UV@Xn@VJmV"],
                encodeOffsets: [
                    [121005, 34560]
                ]
            }
        }, {
            type: "Feature",
            id: "3207",
            properties: { name: "杩炰簯娓競", cp: [119.1248, 34.552], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@聜lzXxm脝V聞聞@@娄聞@l`XnlK職XXm聜KnLla聞b聞@聞xmbm@kL@V@Vl@@VUX職JX聞mb職@@聞掳脝@猫脠zlW掳X蘑Jl聬脠`lInb職WV_@m職聶@UU姆n聝么w掳聛脝mnaV聝V脹Vm母禄蘑w卤脻@聛@mUIny聶聛UmWk脹楼脻聶聝K聶聛@Wn@@aWUnwVL聞mUaWIUWVk@kkJUVWLUk脜聝WJ@bkLWVUb脜U聝b炉KWbUJ聛聞WXX`WXkV@KWVXX@bWJ@n聛JU虏mJV娄UbVVkK@b@職@nm@@aUK@L聝@@a聛wWb聝K贸KUIUmkwW@U@UnWK聴nmW聝n@b聞l@bmVUb聶@kw卤n炉w聶VUb"],
                encodeOffsets: [
                    [121253, 35264]
                ]
            }
        }, {
            type: "Feature",
            id: "3210",
            properties: { name: "鎵窞甯�", cp: [119.4653, 32.8162], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@VUXblVVV聞b@xV@kz聞V@l聜wVLUbVV@VU@VbUb聛l聜b@nk亩掳I脼V@茊聞聬VlmV聝脠脜xmKU虏脜J@xVn@l蘑nmbUlVL脝b蘑V聞V聜b聹V聜aXk聜@V聧XKV聧VW職XVWXUmKU聛聞aWaU@聶楼@拢XW聜UU聛V@@ynam_VWkUVUna@聧脝V@mnkWmXkWU聞W@k聞@@akkl聝lWUI@UnKl楼聶I@V聛Vma@a@I@U@a@anK@UmK@脜VUnJl聶kI@aVwka@mVIUW@UWL@W脜bmI聝聝ULka聶UW聝UxkLUKWlXL@V聝Im聝脜V聝U聶m膲L聶U贸l炉I卤l@脪UbVbUVVXUJUnVV@lnbl@"],
                encodeOffsets: [
                    [121928, 33244]
                ]
            }
        }, {
            type: "Feature",
            id: "3201",
            properties: { name: "鍗椾含甯�", cp: [118.8062, 31.9208], childNum: 3 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@k@ma@kUUVmVIUWVUUaVa@脩虏k掳J么k@Wmk炉KmX炉aUakK聝聝WU聞@XU聜LXaV@@mUaV聧UUl@VmkaUXm@聝WUUna掳Il聫聛聛mV聶m聶IUW聜聧@Uk@@aV@VVX@聞V聜I掳禄nm聞U@聧VKVan@m禄UaU@U_@WlIUa聶aVaUala@炉n@聜聝kaUkUUWKU@mwkUUmmL@K聛@聝LmUUV聝K聝V脜ImU聴J聝聬聝VkVVL職猫VLVU@W聞L聞V聞職@nV脺ULV聨UL@bW@XbWbkJ聝UUVUxVXmVk@W聫UUkVmI聝V@聞nbnVWb聝JU聞kUUL聝a@Jma@XkK@VVL@L@J聝LUVU@V录聝nXl聝bm@kbUKmn@lVb@VXXV聜UV@b@LVb脝xXbl@@lV@U聞VV@XVK虏VlI職`聞聬UbVbUlVVn@WXn@@VUV@聞@KmbVLX脪聸LkK聝V@nX@VVUV@b聶nVllb職mnb聞IWVXU@`lLlknVnmlLlbUmVInK掳nU聝U@l@VU@Vn@聞聝@alI聞`VIXaVaVa"],
                encodeOffsets: [
                    [121928, 33244]
                ]
            }
        }, {
            type: "Feature",
            id: "3212",
            properties: { name: "娉板窞甯�", cp: [120.0586, 32.5525], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@lUU@@y@In@WwXal@脼xl@@anV么@脝X聞l艓聶么U@聶Vw@脟U聛U@@m@U聶JUUWKkL@Vm@@拢聞aUUmyV@@_kJUUVUUWlUnblL@aUm聝I@聝ULUW@IU@WaUK@拢UK@aV@掳V@LnUWWXIla聞VV聶@拢UWlkX臅VLVW職b@kUalwUKU炉lU@mk拢V聫么K脠聛VK@w聞KVaUk姆lUI卤聶臒楼脻U殴職聶聨炉么m娄聝母聶聜@XXK@VVXUJ@nlbUx@blJk職mIUV@脝nL@VmL@b@b@V@J@bnb聜U@U職Jk娄mL@VVJkXk聞ll@b聝@@l聝XXVWlXnml@n脜U@聨mbUVlVUXn`mb@zU@V聜聛VWX@陇職娄V@Xb"],
                encodeOffsets: [
                    [122592, 34015]
                ]
            }
        }, {
            type: "Feature",
            id: "3202",
            properties: { name: "鏃犻敗甯�", cp: [120.3442, 31.5527], childNum: 3 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@nL聝脪lxUVkL聶am@聶聝kVWUULUxVVVbUV@bVLU聜nn藕聶脼V臓娄X聶VUUa么w@KlUVw聞WUwVa聞@lUX聝Wa@_X@WmkI@a@W聞I@w@KmKUUk@@aVU職VV脜mJ聛_@W@a@I卤w脹@茟脟kw卤聝炉拢mW膲U贸莽聝K炉VkUWK@XkV炉UWa聛b聝mUa聶UUb聶lln@b@x聝bX聨W聬X`@聞VxUblL@bn@Vb@`m@XbWnn@l陇聞n@xnVlU聞聶VL脝W聹kV@Vb脼J聜_n聝l@nKVU@aU聶U聧@mVk掳WVLUV炉bV聬X聨聵bXlVn@VmL@x聴V@bl聞職聜@聹nW@X@VVJ@虏VJVU"],
                encodeOffsets: [
                    [123064, 32513]
                ]
            }
        }, {
            type: "Feature",
            id: "3204",
            properties: { name: "甯稿窞甯�", cp: [119.4543, 31.5582], childNum: 3 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞L聵聨nxUbVV聝L@xnnW聜nn@VVXn@聜y聹Imx聞聞掳聝職L聞a聜楼n@Vk職KVw聞W@nX聞VJ@b聜@UVn聞聝@UnUV@L聜b@`VLklV脼n聞脝@VaXLl聶脠J職聧mmV聛UK@aVUUaUUVwVKXVlU職聞n@職blKVUkw聞脩mKUVUI@卤UI@U@WmX@聸聶聛k聝@a聵U@wnK@UUmWk聴aW聧U聫掳aVUUK炉XUl@nV聨V職@bUVmLk@m聞聛`脻IUaU@聸l脜XUK聝職kVmU@w聝mk拢m@XmWan@@_Uam@@akKVaUw@聝W_X聫W聧聞a@w@akmm@mL@U聛JmnUK聝@@XnJWLkKUb@聞Vxk聞W聫聝L聴aWVUImVULUK@L@lkLVVVllb聛聞m@@掳kbVbUb職bVbkJ@XV`V@Vbn录"],
                encodeOffsets: [
                    [122097, 32389]
                ]
            }
        }, {
            type: "Feature",
            id: "3211",
            properties: { name: "闀囨睙甯�", cp: [119.4763, 31.9702], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@職V膴K職n聞V脝Un聞聞J@UWKXkVLlKVwX聞職VlbVK聞聞nJ脝a職聛聞姆n楼掳贸脟Ik職WKUb脜@m聝U脻lkUK@_聛a@KVUVm聞@m聝VU聛@@aUIW聝@m聝XUx聶LUlm@聛娄聝b聶K炉聞聝聝nw聸J聛zm@UW@UmmX聛mm@w聞KUUVamw聴聧聝Km@UbUL@聨聝Vmn炉录聛J聝UW@UUU@@bl@@V聛聨VX職J職nnU聜聜k聬炉JmbVV聞Xn@VWlbUnk@VVU聨Vb@nU@Wb聛KWV聝@XV聞聞lLVb掳bnW掳Lnl@X"],
                encodeOffsets: [
                    [122097, 32997]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/jiang_xi_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "3607",
            properties: { name: "璧ｅ窞甯�", cp: [115.2795, 25.8124], childNum: 18 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞`l@脠bln聞@聞KVLl@聞V@b脠聨ln職KXkVlVL@聞lJnb聞娄VKVVnX聞W@w掳@VU聞mln聞UV`職U聞bVUV@聞xnKVI掳KXKVkVL@al@Xa聞LVlULWV聶VVL@b聞x@VXVmb@x@V聶聬VV@nn陇聞職lb掳b掳KXXWbX`lbXx聜z@x聞`VIVUnK聞L聜x聞WXLVKVbVLVU@wnW掳b聞@nalX聞聜mXVJn@U虏mKkVl聞U@@xln聹aVmlKn聹@JVLl聨nV職職l@XX脝猫VlUX@xVLXV職b掳W@wnUWmXk@K聜LVwUmUkUKUw@wVaVK@k聝聧@WnkUKW聧kwlmXL@KVUlLVKXmWU聞L@a職L@m聛alaVk@a聛a聜a職聝nX職@VVUblb聞Jn聬聵聝Xa聞V聜wn拢聞K@UWmUk@聝UaWI聛V@b聶JW聛@K聛mmU@aUUUkmKk聧VKlUU聶nKVU聞lVaV拢脜楼WUUK@UkUUw@聫m@mIk聝聝UUW聝L聝K炉聧Uw掳炉@wUKUb聝Km聝@kkKUL@UUKV楼U@manw@k@U@Wm@@聧U@Wwkm聞wWaUU@UUmV炉kw聝@@km聝kKkUW@UK@脜V@XWWkXa@Ul@Va@KVaUUU@聝aXwla@UkVWaXk@K@聛lmkUmV@Vmbk@聝禄XI聝楼VUk聝VUVU@anKVU聝KUalU@wX@聵聶@a@K聴@脻w聝L@聨Un脟lUIkJmn@聨聝bVV聛b@VmnkL聝V炉U@聝卤l聴IWm聝@kaUI@a脟U@K@KUIkbWb聝JUIUy聝X炉聝UbU@m茅UUmUk聞WK聴xWIkJm@V楼U_UJUwmVk職聝UU@聝聝聝@kn聝wm@Um聛kWJkL@n@VW@@聜U@knm@kUml@x脜x聝@@XUJlb聞@VX聞JVxn@lbV聞@lULnV@Vl聬nV@bWV@bXL@lVLVb聞V@blLn@Vl聞K@xln@bX@la職LVbnKUVVb聞KlXVVkx聝V@nnVUb聜lV@@z聴掳WWkb聝Ik聜WL@LUJ@bUI@b聶`@UmI@mkK炉XW聶聶mUV炉@UUVUUam@@VULWU聛J聝Im`聛IUJ聸聛聛KUkW@Uxn聜WbnnmlXbmIUVmV@Vnb@V聶LUKWLn脪VVV@V聞UL@聞kJUV@b聝脠@聨職聬V掳職聨@XVV@l@xUz"],
                encodeOffsets: [
                    [116753, 26596]
                ]
            }
        }, {
            type: "Feature",
            id: "3608",
            properties: { name: "鍚夊畨甯�", cp: [114.884, 26.9659], childNum: 12 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@lxnb@V@bV@ln@聜n聬聞聜lIn職@blVXK聜nk录@VUKWL@b聶L@`UXU`聝@V娄XL臓@lJ聞娄@聞nV@l掳nn@聜mVXna職@nb聜K聞n@l聞IV聝職@VanJ@_lKVVn職聞L@L聜K@Vn@Vb職UVanKlLnbnJVb職nWVnVVanI@聜Vb@L聞bVKVanXVbVJVU@aXLll聞b么l脝录XxVLVK@Xn@聝xnVVVmb@LnVVKVXV@@mnaVXUVnV聵K@_UaUm職wnKV_聜anKVL職禄聞K@聛炉脻U@聸聶U聫@聛kWlUn聶lknK聜VnaUkma@聝UIUwl禄脜w@聝VwV@n聶聜聫n@脠XlKVmna@kVw@anm聜@n_WWk@聶聶mUk聧UK@Im聸kLUn聸bkm@wV@k聝lUnLV卤m@UInW聝聛kWmb聝@炉amX@xUVUKUaULWK聝X聛w聝KmLUVUJ聝_@w聛yWwkaW_XaWW炉L炉aka聝聶m拢@mUU職聫@U@wnaWU@U聝w@aUK職UXUVKUk聝KWbk@@bUKUlWL炉LUJmL聝wU@UV聝a聶VU_聝Vkm聝nUV炉@@x聝XmWUUUL聝楼makI@聝UKUkWl聶Lkm脟聧@a聝Uk@UK聝L聝@km脟ak@聝_VlkL@`lbn職lLVanLnbmV脝ln@職聬kJlbknmKUb脻mmwULUK@bkLWKULUUma@Kk@UV@L@llbVz職xUxnl@bVLm聨職聨@IVJX聹Vl聝LV`@bn虏@J聶@聶V@Xmb帽@WbUJ@bm@@LU默U聜聞娄lV@xXb@blnUV"],
                encodeOffsets: [
                    [116652, 27608]
                ]
            }
        }, {
            type: "Feature",
            id: "3611",
            properties: { name: "涓婇ザ甯�", cp: [117.8613, 28.7292], childNum: 12 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞聞@聞V聜職聞聞I掳`n聬m陇聛虏@bVJUVVXUl@Vmb@xV@XbmVV聹@lkLmbn`VbnU聜@Va聞UnbVllUXV聞a@w掳聬VW@_VW職L職職nVlb職LVbnl聞K職nVK@IUW@_@am@聛聶聜脩U贸lK@U@WU@VwU@UI@aUU聜aX聝聝@kwmJV聛@yX聧@k聜an聝聝聧@mkwVmmI@aUU@aUUW@k聫VkV@@anK職禄聞XVWnIVUl`@_聞W@wlU聹V@UWKnU聜bn聨掳InJl聞UV@VnI聜b聞Wn@VklL@l@Vn虏m@U`kI@bWJ聝聬nV@掳VXnJm聞XVmx@VVL@bkLmWULUmU@聝bW聬Xb@llnX@聜xkxVV聞nVV@陇nL聜nVxnJVXX@聵職職bn`VI聞b聞@聞blmlLnaV@聞blWXnlUnbl@聞聝職KVanUVmm_XK@kWWna職U@UnaWUXa聸聝XamUkKmXUW聝LX炉WakKm聶nUWwXa@KW_聞aXWW_@WnIV聫l@XU聜LnWVknK@ImyUU脝bXK聞脹@W@I脝Un聝V脻lkVK@mUIVwkUVaUm@aVIVyXI聝a脠wm聫mk@Unan聫VUm聛脜a贸禄lw職W@kkUVmUK@聛WK聛L聝UmWULkamK聶Lk@Wa@wk@UU@聫U@mbUIWV聛KUXWmkUmV聛m聸U@LkakK聝w@w@U聶炉聝聜聝UUn炉l@bmn@xkJWxkL@VkI@m聝kmJUI@V@b@VVxnbWlk脠kV聝L聝bkKmV聝L@V@虏nxW聜kLUL@xlKVx聞bX聬mVn職WJ@脼聶掳@n聶xUKUw卤聛聛`UImVmnU@kalm@akw聝U@UUJmxU@@U聝@kU@Um@@Kn聧聶聝Vm@k聶KmkU@@WUnkLWxkVUwmKmLkU聶bmKUbV聨@xUnkJ@n卤聨聛職UxVXU職WJ@LUb聶lUnm@聝W@nknUJUVm@kXllknVb脝K聞VVb職录V聞@職Ul"],
                encodeOffsets: [
                    [119194, 29751]
                ]
            }
        }, {
            type: "Feature",
            id: "3604",
            properties: { name: "涔濇睙甯�", cp: [115.4224, 29.3774], childNum: 12 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@WUkVUkma聝VUb聛@mVUam_nalK@kU聸nUWaU@@wna@UVkUWVUUI@a聜卤n拢m聫炉_聝J聶聝U聛@聝聝聝膲娄Ul@聬UV聶Km聶mL聛lm@臒鹿m`Uk炉@@UVK炉聶@UUK@amkmKkVV聧Ua@UkU聝K聝聨Ua聶L@VVXUJ聶@聝n聝@聶職聶WUb聝nVb炉V@L脜l脻I聝J脜k脻聶m@Ua聶WUU@UmUXmmwV聧UU聛KWUX卤m聛Uam@kW聝zUaVm脟w@a脜LmK聛X聝聜U聬WKkL@W炉I聝wVw聶lkU聝J@Um@脹脠W聨聛KUxWk聝aUU@KkLVl@聞UKUX卤KUb@nVVUbUVmaUlUL@聞聝aUL@聜@nUlWzX`@聞V@lx虏聞@Vlb@b職V脼@掳nl@UxVL@lUbVV@n虏xVUVmnU脼b聜a聞J@I職V掳xnbl@nb脝@VwnK@VnXlK掳xnUlVX聞V@Vl@L@lk@W_XK@K聝kWxUL@J聞nVx@aX@VVUa聵IXlmL@bVVX@VbnK聜a虏XVW聝k掳a聞@UnV陇nbmLmW@聬XbmJUbVL聞a脼K聞L@K@U@aVKlbV@nXlJ聹xV@Vn職聨V脠職聞脼K么b藕臅膶mV@膴聬職聨虏x脝I職聫V@脼娄母录脼Vl聨V脼nxln掳J聹k聜LXWVUVUVwnJVI@yn@lXlaXmWI@w聴禄ma@UmK@akKkXmW@_kaWakKW聧k@@K@I職W聝kUa聞聝"],
                encodeOffsets: [
                    [119487, 30319]
                ]
            }
        }, {
            type: "Feature",
            id: "3610",
            properties: { name: "鎶氬窞甯�", cp: [116.4441, 27.4933], childNum: 11 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@掳V掳Un脺@n@lnLlV@b職V掳L聞lnLllVzVVXlV聞V@@L@xX@WlX聞m@UV聝L@V@n聞掳職kVmVUnKlaXxVb職nlU@lVVnaVI@aX@V聞職J職@V聞@b聞b@職Vb職聜@X@lUL@聨@VlIVm@wU聧VanL職alVnKnLVxlUXwlKVm@k@Una@mWIXKWU脹V聝k@a@UVWn@@kl@@W聞XlW@_Um@UVK@a聞LnalInWV@@xnI@楼聜K聞聴職m@聧kKm聝nk@mlI聞陇laXbVblknV@U聜KXVlUXa聜@@Unw@卤mU@ak_卤a@聝UJUI聝V聛KW_Xa@aWU聶職聛K@mmUVa@IXa@UWm職annlmX炉WKXwVUVw聝聫@聧XUlK@klJXa@k聝聧kmm@Uw聝w@炉聝W炉聛kw@WmbUL聝aUUU@mVUU聶WmkUb聶KmkkK@a聝kU聝炉楼U聝l聴聝m@akU@m職聧@KVIVV@KUkU聫VUka聝UWb聴聞m聫聝IkaVaUU聶@mW聶聞聛b聜b@bUlkb聜b@n聶K@b聝KXVWnULkKUV@LWKknlxX聨VLml@X聞聨@lULUb@xVxVLVlVnUx聛K@LWlXnmV@x炉X聶aWUUK@wVWUk脜莽m`聛@mn@bUx@lmbUnkL脟Wm@聛聬m職U@Ux@聞脝xk录VxVJ@聞nbVlmb聛UmLklm職kVlX@聜V聬聹職V@掳脼"],
                encodeOffsets: [
                    [118508, 28396]
                ]
            }
        }, {
            type: "Feature",
            id: "3609",
            properties: { name: "瀹滄槬甯�", cp: [115.0159, 28.3228], childNum: 10 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@VlbnK@b@J職LlUnx卤膧Xx脝W聞X@l職聬@V聞@@blJ@nX@聵xUbVVUbVV@b聴VmnmJ聹聞@bmbm@klUb聝Lmb聹職@lVb@xUX@bVVVbV陇@LVV聞bXlVw聜LX聧脺脟n@@V聞IlV職kUx聞x掳J@XlKXLV聫聞聛聜WnL脝K@b脠xUnVb聞ylXn@Vbn聜W虏XV聜LVVU聨nxWnnV@VVV職XVbn@脼職脝l聞I脼J脝k@K掳UUa聞mVa@UUU職禄@wV@V聝kkUKUVW拢U@UmW@@aXkVUnVlKVV聞UUkVmU聶@kWaUanU聞VVamIX楼W@@aUaU聧VW@_mW@UnIVVn@VbVm@bVL@anKVUk聝WK聞UXV聜Ikx聜@na聞bVK聞b@nVJ聞_V聸@聛Vw聞聜VUVVXUlUUaV@X@Vbla職bnKlkVaXa聝炉@m@U聞KVUn@W聝XkW@@w@KU@U聝WkUUUykkmK聝k炉K聶U@akUmK@k@mm脹炉V炉U@聜聝L聶录UKmL聛bU`mL聶xVnVb@`聴LmUVUUWmb@nU@UWULmU@KnaUUmU聞wmJ炉IUJWIkVkaWVUIUlWaUIUVkKmbUI聝脪lVUnn聨@VlLUJ@bUX炉@聝aWVUKUX聝KUbm@Uw聛KWa@a@VkUWn聶@Uak@mbX聞WJXbm@mL聴aWVk@聶w聝L@WmanU@knwWmkaWL聴KWUXa聝U@楼l聧聞UVVVbnw聝楼nKV聧聶禄@aUk@a@U聝J@k聝m聛Lma聶@mbUW聛nm@UL脟潞@LXnmxU聨m@UbkbW@@akLmWk@UXmJmUkV@VUXVlULmKUxkL@lmXnJ@X聜l掳Vnb@bU@Wb聛KUX@VmKUX"],
                encodeOffsets: [
                    [116652, 28666]
                ]
            }
        }, {
            type: "Feature",
            id: "3601",
            properties: { name: "鍗楁槍甯�", cp: [116.0046, 28.6633], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@職X職聶聞@聞m職@VIUW@U職KVb聞聧聞LlV@VVbU聨lUnLnl@bVL@V掳職UL@V掳@Vln_臓潞n@聜knKn職職LVU@聫Vk膴楼Vk@聶U聝聶禄Ua聝U脜LUalmkklWn@VUVIlm@m聞Xn@Vm職kVa@KXIV聶UWVw聜聶虏聧@m@U@聧VK@k@W聶聛Ua@聶聝a@aU聝聶@聶IU聝W@@bUJmbUU@kkV聶mUaWwkbmLUVUn聶lWbUbklmL聶akbUaW@U@VbkVWVUUUV聝聛Ux@聜U聹聝`UI@m聝aUL聝amb聛@lw聛JWU聝VXLl聞UVmL@bUK@aUnUam@UUmJ@VnX@`UXV聨Vb@bX@W娄nJUb聝UmVVbXb@lV職UnVl聝VUUkLmUUVWl@bX@VnV@X陇VUVLllU聞U@@x聶录VV@V"],
                encodeOffsets: [
                    [118249, 29700]
                ]
            }
        }, {
            type: "Feature",
            id: "3602",
            properties: { name: "鏅痉闀囧競", cp: [117.334, 29.3225], childNum: 3 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@VVX@Vbmz聞xUlU@mbmL@V虏xVbUVVblbX@職V職kVyk聛ValKVI@bn@n`l聛VWnX@l聞L@聶WKn聝VIVa@炉nK@alIXJVIVWUw聜聝n@nU聵聞nK@alI@a@anKm_聶a聴聶W@UWmIUw聛mmK@拢UU聝mUUlw聛wW@km@kWaX聫聞aV@VnVKnXlK@aUK@UnwWUn聝mIUW@炉mU聞聫XI@alJV_n@m卤@U@kkKUlm@聝X聛amJ@UVUk聝mI炉Jm聧聛amVXL@V聸UkV@x聝X@`k_UVmJUX聝W聶录mL@bU@Ull聬X@VV@bVV@bnJUnlx@n聞聨m聞聛b@lW聨@zU聜nIlx聞@W聞聛bVV@bVJV@UxV@@X@VkLV么聛脪聜職n@@b@`VX@J"],
                encodeOffsets: [
                    [119903, 30409]
                ]
            }
        }, {
            type: "Feature",
            id: "3603",
            properties: { name: "钀嶄埂甯�", cp: [113.9282, 27.4823], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@VWnL@UVW聜LXaV@@ama炉U聛k@WmInW@klKVwnLVKUkVW@UlUnVnIVWl@nXlK@bX@laVan@V聧nwWm@K脠鹿VK炉m@kmU@聝聝楼kI臒@WKU楼聞@V_VW@_職K@aXKVL@Ul禄聛mWLkU@am聶kJ聝聛m聫@聛kmU@@a@UmakwU@聸聞Xl聝@VXk`UIW录kWWX@聜聹聬@l聜xV娄XlW@Ubn聞@聨mUkL@UmJ炉UkUWVUa聝U聛lm@UXWl聞nUJ@LmLU聵nXll@bUVUUmVUn聞聨@娄職xl聨nn@V脝脠U掳kbV聞VxllnL@VnVVUl@V聞聞anL"],
                encodeOffsets: [
                    [116652, 28666]
                ]
            }
        }, {
            type: "Feature",
            id: "3606",
            properties: { name: "楣版江甯�", cp: [117.0813, 28.2349], childNum: 3 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@XV@nl職L@lUn職聞m聨@Ln@@VlV聞@@VV@nwVI@V聞Vlx@bknlbV@nmnUVJ聜_虏聜VxVL職w@m職炉@脻XIm聶nUW聫聝aUwkL@wVKlKX聛mw@卤@U聞KnUlL聞a聞KlUl脟XkmaUw@U@a@U聝聫聶UkwUJ@zWJ聶w聛@WbkVWU聛L@VmUklUaWakb聝拢kJ@nmln聞lL@聨聶n聝聵聛L@娄mJ@wU@mXkJmb聝K@bUL@VVn@`kX聝W@Xk@@lm@UX@V@b聞l脺UXVWLXJ@nmb@V@l"],
                encodeOffsets: [
                    [119599, 29025]
                ]
            }
        }, {
            type: "Feature",
            id: "3605",
            properties: { name: "鏂颁綑甯�", cp: [114.95, 27.8174], childNum: 2 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@m@@WULUKWw脜禄贸k聝akkWK@bUVUIUamWUbUL聝a@KUa@聛mJUbmUXU聶mUamImakKmLUb聶VUam@@U聛L@K聝Km聶UUkL@`mIUb聶@U聞@V@bVl@b職录U聨mL聞娄mxUaUU聝Vk聨@娄聞VWbXV聵LXKlbXnmx@lmVnb@X聞K職xl@XU聵bnKn@WaXIW聝nal@Vb職@XmlV@U@bXb聜LVxn@Va聞LVWVLXU聞b掳@VW@aVIkK@Um聧VmkU聞脩VJnalLVUVJXbVkVJXUlblUXJVI掳JnI"],
                encodeOffsets: [
                    [118182, 28542]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/ji_lin_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "2224",
            properties: { name: "寤惰竟鏈濋矞鏃忚嚜娌诲窞", cp: [129.397, 43.2587], childNum: 8 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@Wx牡聞m職@聞贸陇V聬X@@x脺录屁職虏xWx聝V聞V@聞XV聝聞聞聞聝bW職Xlla脼U掳膴聞@么录聞L么脻Wan聧V楼聝脩n膲掳楼職脜X楼掳炉@w掳w@禄掳聫k拢掳m脠殴聜m脠b脝聝艓娄聞K掳z@聨kxl娄UbU陇職職職klV聞K扭脼劝@@b職V@nVVUl脼娄lUll聹VlU掳脩U炉V聝掳w聞bXxl@V聨虏聞聵@n聞么录聝贸掳聶kmVk虏臅聜w@wV聶脼聫脼@@聧臓聝枚禄聵炉聹@聜聞職bnb掳m脼炉掳V掳聞脠Jm聛X楼mam聶U脜聶聝U聝laU炉聶聝@w聶Kk聴l卤n@@w聝k脻VUUl卤炉I炉b聶a聶l聝@聶聧kLmakb聝@摹聝殴茅掳聶脼b掳聛職茅k聝聝Lm聶聞wX聶聜a脜b@bVl聝bVb聴脪VbUb聸UUanw聝akbV聨UV聸ak聞炉聞U聨聝LmxV掳Uxn么呕X@J聞Xkl聜bkb膲a聝b聝WU聞聝@聝k聞WUU炉@@klm聝@@聶聛脜@a聝wW聫X聧lKkI@聫WbUaVIUanU聝聝@臅聝聧炉K聶聞mUnWUwm@聛拢膵猫kUmbUmm@@nkJUalwk@@nmWUan_贸aWmnw卤K聹I聝wl@Um聝I@an@@mlU脜mV_聶KUk聝@U`@_聝KU聫mU聶@U炉聶mmb炉@kb聶ImV炉聝聝Lkb聝K聝聝脹@脟n杀J贸a脻蘑kb@聞聸x聴脪脟ll聬聹@聜聨虏V聜聬聞脝UVV聞U聬脟掳X聞贸xlV炉聞lV@b聝V@n聴x聸@聴陇@聞葯艓nxV录kn職J聜n職KX掳聵娄Ul聛nVbUb脝Vn脼WVX娄ll職b@l掳聹VJ么脪nLVb職bX聨"],
                encodeOffsets: [
                    [131086, 44798]
                ]
            }
        }, {
            type: "Feature",
            id: "2202",
            properties: { name: "鍚夋灄甯�", cp: [126.8372, 43.6047], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@么l聜z職a脠V掳聞職K@聞m聨聴LWl聶n聛職VxUV聜脠@聨脻默U脠n聜么L職a聜聞虏Vm膧kV@聞臓膴nU@b聞V@b聵@nl掳UVn脼a么J@b職聬聶V聞娄mlk職職bmVXx炉@Vxm聞nb聝聞職b脠K聜V@b脠L聞w臓y么n職mnb脺@nn聞V聵x@n虏K聜聞聞J@k聞al@nx脼U聞L藕卤Vwkw炉LWWU聛職聶k聫艓墨Vw聝w聞聧掳y聞聬V臅掳w脠Vlk脹禄@wW@U聫么拢@聝n聶亩聝XwW聧聶aUamK贸脩UI炉聸@k聶akkW楼XUm脻脜UVaUa聜mVk聴楼W炉聶L聛m聶IlmU禄mw葰艒@聝聵拢kJU聧脟k@聫聛am聛炉y炉UVw聝a@w摹x聛娄聝K聝聝炉X掳膴炉娄U掳膵WUL脜a卤b炉@Uk脜Wm聛V聝聶聝kIUl贸聨膵鹿聶`贸I聝lX聞W聨Xxmb聛U聝L脻聫聝b僻@聝x炉b聝脠聴l@x聝職炉z聝a脻陇@n職m聞VWb虏bmn炉J炉脪@n聞職"],
                encodeOffsets: [
                    [128701, 44303]
                ]
            }
        }, {
            type: "Feature",
            id: "2208",
            properties: { name: "鐧藉煄甯�", cp: [123.0029, 45.2637], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@贸聶签艁@WlwUa茟w脹脜脟茅膲am聧聛K聝聛艒脟@I聝聶么摹V聝葋脩殴莽聝聶脻U僻膵膲w贸贸脻@茟禄臒L炉ll虏@茊脜V@娄m聜脜b@nmlU虏Vx職lUn聶@VbnW聞b脟bk脪聝職聞n@猫lnl職U脪聞聨掳L職x@录膲b@脪聞職U聨膵x脜聬聝猫nLVx聝脪聝b脜J卤a@_脜J脜n聝聨Vb聞Kl聞nU脺膴@聞U職聶xXV脝n聞m職V職聛職J脼炉V聶臓w職聝Xw掳xWL聞x聞KV娄么U聞wV脻乾贸脼脼聶录聜聜聞脼k聨V么葮x脼聞U聞lVn娄脼職膴a掳w聞b掳@職b脝w聞l扭L虏`聞z掳@V@@聶nJVnl@@楼nUmmn聧聞@mwnmmUnk@mlwUa聝Ln聝聸wn炉掳an聝WakI聞聝脟mXw脝amUXUlJXa聜UUklKUknm脼V@聛聜K@聧VW脼@VkUwV聝"],
                encodeOffsets: [
                    [127350, 46553]
                ]
            }
        }, {
            type: "Feature",
            id: "2207",
            properties: { name: "鏉惧師甯�", cp: [124.0906, 44.7198], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞職藕猫葌脪U聞贸蘑聞職@J艓脠聞聜聜Ln聨膴b脠锚脺脝茠xVbkx@X仟艂么職聞k脼`聞聛職W聞b@n掳a職b職K職nVw掳`職_X`W聞職娄聞聫膴IkmV聧職akw聜K聞x掳U脼b聞U@l職聝l@掳娄聹VW聞職a脼b職x脼I@mVI@聝V聫k脜職UWK聞楼nL聜a@聝聞@脠聧聞@掳聝脝@nU@K脼alkUwV茅kUWw聞聶kU聸Vkk聝Jk炉@禄贸k聝V炉脝脟I@b膲么炉@聶聫姆w炉nmm脜L炉w聝V聝U脼y@U贸w脟Lkmm@@U贸xkk膲聫mL炉wVwkWWX聶m聛L玫m@k脜卤V_聝聝么禄脹聝脝炉@聶Va聛聶V聧職a臓V聛聧lm臒w姆U贸脻平拢脟Jkb谦a平LW@nx脻陇kz聝y炉X蓞m@V職么脟X炉臇炉潞脻nU聨nLVlU脭mV"],
                encodeOffsets: [
                    [126068, 45580]
                ]
            }
        }, {
            type: "Feature",
            id: "2201",
            properties: { name: "闀挎槬甯�", cp: [125.8154, 44.2584], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞U掳x脝Knn掳m母x職聬掳@膴贸@a脠J掳脜聞U么l@录l掳聞Ill聹UlV聝職XxlVU锚Vxklln脠UVll@Vx虏I脼陇VUlVnI么l脼聝lw么_聞聸聞bVa亩LX脜脼脟@K聵炉@w脹a聝莽n楼職炉W聧XyW炉Xw聝Umm脹@ma聶n贸m臒z聝x脟K@a聛U脟L聶a聞聝man聝Uw掳@WwnU聶al聶nk聝楼職U聶聫@a贸I脻bUm炉Vmk聴@@a聝U@amV臒膲@聝lUn每卤U聛聝聶b贸Km聛V脟脼墨@聧聛脟VUUw聜聶職mXk聵Kn聧@聝聶L炉聝脟U聶b聛y贸k艒猫@b聜n@l脻X@x炉么@脝聶U聛聫V_maXm@a贸聛聝JWxnX@聨VVn臇VnUJ@n艒脝脟录V录kx聝Lkl脻w@x聝x@zV`脜bmx聛U卤xU聞nnm聜kn聜聨臒U聶bU聨聜職Ub@職脜掳脺聞贸录聞聞U`脝虏@l枚n聜K職nXWlXUx掳xnK膴聬ll么w@Vn@ln脠K么x@V脻z聞V"],
                encodeOffsets: [
                    [128262, 45940]
                ]
            }
        }, {
            type: "Feature",
            id: "2206",
            properties: { name: "鐧藉北甯�", cp: [127.2217, 42.0941], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@U職l娄k脪脝掳聞Il脪U陇么z聞录lJ職聞U聞n聜脝XVl掳@虏a脝bVK膶XV炉掳楼炉膲掳W聞聞聞L聜楼蘑w@x聞bUx掳V掳zn聜聜b@聬脠lV聨lI聹@聵w@m聞U@akU掳聝kU么wW聝脠炉V聫U聝VU聝脜聛聫卤U聛聧聸@k聫脠k聵脩聹w@聝la脼摹聝U脼拢@茀聜Kn脩蘑炉@W聜aUaVUVkkw@a炉聫@炉聶聧脻聶聝VXnW@@WkXmK@xkKUb@bW@Uw炉聞mm聛b@聧WKUbmU聛bUaWb聝J膲IVW@I聴l卤Lk職mU聶bUm聶@聝nkKWa炉n聶@聞`Ubma聶聞膲L@b脝職聴@W`聝L@n炉聜Xb聜@kb@x聶L聝聞聶@V聜kL卤聶聛聶mlUIU楼mL@l脜x@_la聝聝@U聴a聝V@kmm聝K聞拢聝聝聛L聝聝mKUn脜KVbm聬XVl猫膲UUbml聞蘑脜陇聝Il聨炉b脟娄聹l聜@么录蘑聞@x掳聞l陇聞n聞a聞l@x聶b"],
                encodeOffsets: [
                    [129567, 43262]
                ]
            }
        }, {
            type: "Feature",
            id: "2205",
            properties: { name: "閫氬寲甯�", cp: [125.9583, 41.8579], childNum: 7 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@脝lXn臓x蘑掳l脠掳職聞K聞掳kXm聜@娄Vbk聞扭J職n脻陇k聞V脼VVk脠聞b掳y聞聶@w聵k聞脟掳a聞w屁@聞a脼聬聞K聜VnaWwX聧W聝聞k么J職_膶潞么聧Vk聝禄贸yV拢k脩聝J脜炉l脩k楼V聶職a@w聝k聝b聝mk拢炉聝@w摹聝贸禄聛@聸k脠楼掳ak聧聞J脝拢聝摹nkVa膴Vk莽WUn聫Ua脝LVmnL聞聞聜KU聧聶卤@聴聞m@a炉U聞bmV炉m@_聝K聶聶U聶聝a聝脜聶W贸鹿聝@UanmWak@@wmI@y聛聧聶@mk聞JVa聶@Ua聝IkJ@n聶@Um卤kkx聝m聶Ik聞聝b脟m@聨掳bXn聞V@聨掳脠ml脼录炉XV潞炉Lm聞kWW聬XLmVVlkn聝@@l聛nW脝聶聞Vx聛bm職n職m聞炉l脻aV脠聛猫@录V聞聞b聶聞脝聨掳脼UV職J聞聞kx聸I聴x聝聝聝IV陇聶脪Xxmn"],
                encodeOffsets: [
                    [128273, 43330]
                ]
            }
        }, {
            type: "Feature",
            id: "2203",
            properties: { name: "鍥涘钩甯�", cp: [124.541, 43.4894], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@蓡n掳W聞zly脼拢mwX@凭K乾bla脠I凭陇么脼母V臓xn聛mmV聝虏w聜Vnw脝aU_@y聞w@w脼xlk聞KlwU禄脠禄艓脜@mVIUmm臅UU@聧mWXw聞I么聜@bWnnbU`聜聬職V@脜掳贸@w脼W@k聛m@a艓莽聝聶@m掳脩掳Inm卤aXa聝U聶n@m茟職U娄@職脟聨炉aU拢職aU聶摹娄脜脪聶J艒U呕贸kU脟@聶楼炉ak炉mUVak@@a膵莽脜aU聝m娄脻`Xb脝聞@n聛`聝I聶x膴脼艒脼ml@職Ub聛@Wl聶_炉Jk職脟U脻脝脜b@n聶聞llUb炉聞卤a@聝聴聝W聧膲J摹膧炉聶Un贸職m陇聹x么aVn聝x么I@x聞V@bm脝聶聞@lnLm脼炉脼聶xVb炉镁"],
                encodeOffsets: [
                    [126293, 45124]
                ]
            }
        }, {
            type: "Feature",
            id: "2204",
            properties: { name: "杈芥簮甯�", cp: [125.343, 42.7643], childNum: 3 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@偶么艓V職I脝脩蘑楼V職聶bV陇掳b脠聧@聶V楼茠聶脼拢l脟UUU脻l聝脼拢聶m牛Il聝Ua@楼n聛lW聝炉聝L炉聶k脟摹炉臒wWm脜k炉U聝VU聞聞bWlXlmn聝bUx炉xVVknl聨UbV聞脟KUb@聞聶VnbmlnzU潞卤b聛聛mJUbW脠n猫m脪聞職@聬X`WL"],
                encodeOffsets: [
                    [127879, 44168]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/liao_ning_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "2102",
            properties: { name: "澶ц繛甯�", cp: [122.2229, 39.4409], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聜I脼mVk@wXW脺bnwlLnU聞@聜聫nLlbXW@a聜wnbl@XL聜a職@膴楼@LULnJ@xVnmV@VXXV@VJkn@V脺KXX么Jlb聞xl@聞IVbnJVLUbn聜lnVw聞JVU@聝XU聜aUUlwn@掳聝n聞VKnV掳_VJ職wl@nwlV聞IXWlIVVnK@IWmkIVaVU@W脠UlmU聛@U聞WUalkX摹呕@kI聝禄mm聶ak聛Um聸膲U艁V禄虏摹V臅@aUU貚I蓛`葍@聛k聝w@聝U聝mw膲聛聶@聝W姆脩聛I膲聫脟b脻Lkymb聛I聝w脟m脹bmbU聞炉脺玫脠k脝Vb艓xnXV脝n職仟娄聞b職陇U職聶x脻n膲脪m膴V脠聞陇脠職聞b脝录聞膧聞聞脝脝脼聞藕b聞VVbX聞聜掳虏陇"],
                encodeOffsets: [
                    [124786, 41102]
                ]
            }
        }, {
            type: "Feature",
            id: "2113",
            properties: { name: "鏈濋槼甯�", cp: [120.0696, 41.4899], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@na@UVI@m聞脩W聶kaV楼UI@wl@聞a脠b職m@wVa職k聞@@K@k聝聶@a@UUm聝UUalmU聛@K脟U脜卤炉@卤kUKVkUa聝a聛U@楼m@@炉k@WLUmkn@mmIkm@amU@wVmkU@Klk@U聴m聵aXIWWUL聶aULVb聝mk@UUmUk卤聶_Uym@mbkImaX炉WW聛聧聶xWK聛zU@W聝kJWwkV聶@U聛m@UbVVVVXb@VWX聴@W聨@Vkb@V聶nUK卤aUUlwX聧聶脟WKknU@mmUk聝LUV聝VUUV聝Ua聝w聶bkKmwnI聝聶kJ@nmb聝`聛kmVkLWwUm@UUU聶K@UmaUa@UUaWK聛@mU聝聧炉Wkk炉VmUU聨聞xVXUVmL炉ymXkWUbmXUK聝VknWx炉JVnkL聝l@VVxnxl膧VL虏WlX聞l@b脻VUn@bnl脺aXblIVl@職職@脠娄@VmbXV聜@@x聞VVnUn@`掳@VnXU@K@聞VV@VmbnVn@ln@b聞x聝掳Ub@b職LV`脜n聝聞W@@lU職nnWVU@Vbkl@Xl`XxV聞Ubl聨kX@聨掳娄V聞UVVbUlkV聸@UbVbkLUxmJkX職職@b聜b聹xVK脝lXX聵bn聨nala@聝Uk@U聞VVklKVUXKVU掳KVan@VUnL職KVL聞WVaU_@mmUXa@m聵wXwVkVWXk聜k@聸聞k@klm@wXKl@U聧@KVUUUVaU聝V@聞alL聞xUx@b掳掳VnnV職xlIXJmx聞LUVlV@bnX@V職b聞aVx聜@XJ@b聜n@V聛聨VX脠聞l@llX@lU聞V么掳掳@脼聞Vbn@聜V聞k聞@VW"],
                encodeOffsets: [
                    [123919, 43262]
                ]
            }
        }, {
            type: "Feature",
            id: "2106",
            properties: { name: "涓逛笢甯�", cp: [124.541, 40.4242], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@lzXJ聜U@職虏x聜@@V職聞@bUVmKUn聞掳n@lnVK聞聞nV@n@VlV聞掳WbXn@聜Vz聝J@娄@bkb聜bUl@bkb聝J炉z聝WULWbklV聞nb聶娄VJ@聞聞K掳U聞kl@@W聞bVn掳@聞V職m虏U聵nX`聞U脺LXmVXlKVbUVVnUbn聵聝X@VUL@lUbWx職@虏kl`n@V聬lb聞@nUVWVLVU@aV@虏bl@脠m職xWX聞V脠U聞JV聞l@聞聞la聞WnX聜K脠k脠@Va掳b脝m聞@XV掳IVV掳Unal聝VUn@UwVU聞@@VVJ聞I@bl@XK@wWmXU聜UVbkJVXnJVI@m聝knwlKXL@`l@VI@UUaVK脼n聞aVm@a脟拢XW聞U@a脟UU@mbkKm拢聶@聛WW聶聝L@聧@Kk@kl聸U聴bWKUkUU炉U玫聫脹聝mUUaVU聞U@WU_W@kVkJ聝_WKkV@bUL聶炉炉聝卤mk炉摹聝臒脩@Umw聝KUa聛k聝聶聝a@a聞聧m楼脻聝聛IUWmk@w聶聫m牛聴L聸K蕽b葪KW蘑klVb聝X@VV聜kn脟V@XUVUblJXn@J"],
                encodeOffsets: [
                    [126372, 40967]
                ]
            }
        }, {
            type: "Feature",
            id: "2112",
            properties: { name: "閾佸箔甯�", cp: [124.2773, 42.7423], childNum: 7 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@XJm@炉職mXUl聛nVbUJ聝U@bV@UJWL@VXLmJVbkXlJXxVL@b@V@n@b@`Vbk@lxknV@VV聶V@bUL@bV@@bVK@VXLWLXJ@LV@nbWJ@IUV聞x@LVJUXVxVx@VV@@LXJWL@VU@@L@VnL@bVVmVX@@VVInJmbnLWVnVULVVU@VVm聬X@@JVz聜l@聞nVVKVX脼聝@mk_lm聞UUWV_nJlU脼脩脼VVUV聝VL聞UVJ@I聞Vna聜@@KV@XwWknwnKlalU聞w聞a膲脻職w職Jl_@aUa聝KUUU@WU@WXU脝@@UVK@聧n@UnVV職blK@b聹llb@b聞bW@Xbl@UlnLl掳掳b職娄nKlVnI聞V@UWU@WXk聝w@am@nm@aVw@I@KUaVIm卤X脩lknJVnVJ職aX_VaUaVKmwnkmmn@lU@U@mna職XlKUmUIVmk聧laUK@UlUVU聛W@U聶kVm聶a@UUU@JmUU@@bmb聴KWV炉XUKm@ka@UVKVk@aUKmLkKUU脻UmbXb脟J@k@WU_@m聶聶@klm@UXKVaUI@KWUXa聝聧脟W聛k聶aWUkWUL卤U@lU聬U@聝U聛J聝I@V炉JmIm@@aU@Uw聝a聶@UV@VkI聸V炉aUk聝Wkb@bVL聞@@VVVUXW@Ua聝@@b聴聜脻bUV脻聞@聨聝LmUkVUbVllLUV@L職職X聨WbUXm@U`@聞kxlnnJlbnIll職LX聞lVlUXmVK聞n聜V@L"],
                encodeOffsets: [
                    [126720, 43572]
                ]
            }
        }, {
            type: "Feature",
            id: "2101",
            properties: { name: "娌堥槼甯�", cp: [123.1238, 42.1216], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@葰膴脺掳聞b聞L聜l脼xUbUn卤聜@脠nV脝L@xnL職lUV聝b聝xkImJkn@V卤LUxkV@b職b職KVKnzVl@L掳@Va聞x脼Ulb么xVV聹@@V卤bn聨@聬llXL聵聨枚X亩聨nal@nkVJVI@aU@@aVK@a職UUUU@lmkwl@Ua@_@a@m@U@aUKWwkIlWUanIWK@UXKVIU@@a聞VVIUa聜mVknW掳聶n@WI@K聛U聝mULWnkVkUW聝聶KkkmJkamIkmlw@聝V_n@VWXaW聧聶聶@KVUkKUkValUnV聞K@聧脼聝VU脼a聵聛@a聞@VbX@VWUU@U聝@UK@ala@IkKmUUa@U@聝V聝kk聶WVwU_@K脺UXbl@V楼XUVm聝聧聝聝Xa聜k脜聝l聫UUkIm`UIUJW@UI聛Kmkm@聛UUJ聝ImmU@聝VUXU`mIUbUK@L聝JUU聶l@X聝@Ub聝J聶kU@聝聨n聞m@Uam@@聝聶aU聧mL聛K聝w聝聶聛mWXUK@kUa脟a@JUIUa@a聝KVU聝UXm聝聛Uy聶_@lmbkLUKWLX`聜n@bVL@JXL聞聜WX@Vnb@Vm@UbnVmL@V@x@LUbVV@V@L聝UVl聛@mb炉U@xU@UVVV@X@VVblJ@bn聞VKUn聞x@lln聛L卤陇聶b@聬k`VX脝K@聞kV@录kl@bWIUl@VmLnbm@@JXXmb"],
                encodeOffsets: [
                    [125359, 43139]
                ]
            }
        }, {
            type: "Feature",
            id: "2104",
            properties: { name: "鎶氶『甯�", cp: [124.585, 41.8579], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞XVl掳b聹UlJ@UVU職@聞bVxV@@bn@nJ掳I@U聞J聜I聞VV@V聫@k虏VVKlXXV職b聜l脠X聞聨WbXV@LVJUbWL@Vkn@l職職@nV`@X@l脠IWana脼VVVlLnKVL@bUlUL@Vlbn@VL掳WXU聵Lna@aV@nV@IVV@V職bUn職l@V聜XnKVa@U聞UnyWkXa聝aVk@a職a職bnm@_WKXmWanU@alaU聴l@XJVLVxX@聵wnKnVlw聝聝聶@V_@a炉楼@UkKWU聛aUU聜anK@I聝aU聧@WUaVw@klUVyUUVUU脟@I么b職a@mnUma@kXa@UWak@Wa聴l@a聸聛@W聛U聝LmU聛@U`mIUU聶`mUk@@UUK卤nkJ聝bUam@kwm@@a@UU@Ua@聛@K@聝VK@kmKU_UK聝UUa膲WmkkL@`聶L聝nmlkLkbmK@k聶@Ulmb@b聶聞@聨聞xUV聝IUlmVXX聝xm@聶JUUk@WUk@聝akx卤@炉x炉Umb聶KUUVmUU炉UmVVn聶Wk聬脝聞聛lWb聞聞聞聨UnWVU娄k@Wa脹V@LV`Ux職XllU聞@聞@VVbnVlL@J"],
                encodeOffsets: [
                    [126754, 42992]
                ]
            }
        }, {
            type: "Feature",
            id: "2114",
            properties: { name: "钁姦宀涘競", cp: [120.1575, 40.578], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@ll掳X聞聨nV聜@XLVb@VVbnb@V職LVV@VVnXxlKnU聜l聞_na@mlI聞職mJnxlL職a聞xVbU聞VV聞UVU聞KVlnnV@lmXL職脠W聨kxVV虏bVL職m@Ula@UX聧聵@XW@UWaUUUUVan@V聜職@lUXxlIX聞V@聜yXL職w聜聨XXW掳nblJnan@Vz職`l虏nVVVl@聞nUaVK職bVKnXVaUaVU職y職nXK@kVK聜@X聛@m@m聜LXa聞LW聝U炉聞w@聶聝a@UVw聞楼掳聶贸炉炉y炉聧聝聧U脟炉禄聸w炉I聝m聴炉脟聶UUl聶炉禄牛K膵脩牛聧姆m炉w@mU_贸mk录VnU`卤IkbVl聝nn聨U录卤Lk`@X聶Wl娄UbmVUxkXVlkbllU聞Vb@bkVmx@XVV@J聛b卤aULkKWXkWmX炉aUJmIkVm@聝xU@n聞"],
                encodeOffsets: [
                    [122097, 41575]
                ]
            }
        }, {
            type: "Feature",
            id: "2109",
            properties: { name: "闃滄柊甯�", cp: [122.0032, 42.2699], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@職Xnb掳l職聞VlnXVJ聞LlVnl@z脝xnK@b聞blKVLn@@V聞aVLVK@L@Vl@XVVInVVKVwlUXwlK職L聞職職VVb@aV@X聞lUXbVW@n聞lWnXKV@@V@XUVVLUVV@@bVVV@@ln@VbVUXV聜I聞xVanJ@U職IVW職L@UV@@陇V@nInw聵W聞k聞lnIVx聜lnzUV脟J聛娄VV脺L母UnW@aV_職W膴XXa聜Knkl@nm聶L聶a@alUVw虏K@UlmnIlJ聞w聞aVU聶kmK@w脜KmU@脟虏聛VmVa脻w聛k聝K聝a脹炉葯膲姆楼臒楼聝@kUWk茝墨脻聝聝@@akU聞K@KWIUm炉n聝U炉JmwUVmIkJ脟L聛m@聶UImJUU@aW@U@@nUb聶J聝a聝bXVWn聛@UVmX@V@b聞職@l@L聝@聶lUb@x聶n脟a聝bk@@xVJU娄lbX職聝脪@nUJ@Vmb"],
                encodeOffsets: [
                    [123919, 43262]
                ]
            }
        }, {
            type: "Feature",
            id: "2107",
            properties: { name: "閿﹀窞甯�", cp: [121.6626, 41.4294], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@nJ@nlmVnXKl@@掳n@@娄聜V聞bVbUlVL虏l掳@脝虏脠V@LV聜knVb聞VVnnWVU聜@XmWU聞a聞b職IVa@mV@X@@bVVnIVJ@職聜n脠KlInJVUnx掳I聞V掳mVnXJ@L聝LlV@b聞@脼聞茞默XllV聞@臓娄母娄naWW@In@manK@UVkXJ@alk@禄lU@聝脜LUWl_@聫職a虏拢聜Kkm@k聝wVmULm聝@akIUa@U@WUUVU聶a脻@臒聧聸wk聝聝m膲拢UW聝@@b脟L@m聴a@_mK聝l聝XUw聛K聝L牛脫@UWw@K@U聞I@m聶U@UV楼聞@掳UnJ掳@@_聶KUw聝W@UnaW聧UmmI@m聛聶姆wUa脟L贸V牡w脻聶UUW聶炉職聝娄Ux@V聞b@職聝xV掳X聞聝KWb聛K@n@nW聜聛@UL@lWL聶m聶zUVVbUbmWXXWJ聴b聵n@Vkl@LlVUn@xnV@bln"],
                encodeOffsets: [
                    [123694, 42391]
                ]
            }
        }, {
            type: "Feature",
            id: "2103",
            properties: { name: "闉嶅北甯�", cp: [123.0798, 40.6055], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@l聞聹x臓聨脼@職bV@@w掳Vna聜@Uk聞V@K@UUUVa@K@w@UnKmUVan@@Uma@UXW聝聛WK@IUK@a聛mW_XKVLlKna@kmKVak@VU聞@Vm職U@anI脝an@聜a聞職UVnb@blLV`脼LlU聞bna聜Kn@naVU@楼掳IVK@anUUKVa聝UVak聛聶@mJ聝kX聝聶UVwk聝VUUa掳U@W聝聛@WlkXWlIXUlJla聹x聜IVVXL職ll@nLV@lLXl聞K膴z職楼maU聝lkXaVK聞X掳y聞Ila@aVk聛ala@a@楼聞IUy@聛WmXa聝炉kU@U@mmU聝聝ULkmm@聝炉VmnLVU@a聶聝@U聛@卤w@聶聛VWIkymLUUkJWX聝JkUmxk@聶xUI炉`mUULm聝炉聞m@kxVV聛bWV@聞UV聝IUx@bk職V職VV職xUbVV@V@z職JVXU聜lnk@@lkL聝l聝LUU卤Jk職m@UIUV聝LUVU@聶K@U聝nnV@l@Ll聞聝aUJ@zn`@nWl聝IUVUUUV卤Ln聜@nmL@VUVkLVlUxVLVl脜Xma聶@@akLmWUX@JUnVJVkXJ@X@`WX聞VUVUIlb聞W@bVUVL@`Un@娄U`@bUV@z@Jm@@XV`聞LUL炉J@IVKmK脜I@J聶nWVnLn職VxV陇聶z@bmV@VUV@bUL"],
                encodeOffsets: [
                    [125123, 42447]
                ]
            }
        }, {
            type: "Feature",
            id: "2105",
            properties: { name: "鏈邯甯�", cp: [124.1455, 41.1987], childNum: 3 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@lb@Vn聞lnVVUb@職VJ@nnJ@bmXUx@xVbkbk聨WLUxnl@Ul@聞xWx@nUV@录Ull聞knkK@bmbnl聜LVJX@VIVJn_lJVV職XUmnU掳VVVUnVV職Lna掳V掳w虏@lw聞bl@XVl@VV職In@聞wWWnUVk聞JVU聝w@聧職聝@anaVk職@@lnLlalKnk聞m職K@_lKnl膴XVb聞VVLV`nL@lUL@聞@L@聜VbV@@V@bn@lxn@Vb聞alI虏mVL@Vl@nV職_VVnJV_聜@nV聞K聜V@X聹聜@b聵kXbl@XblylUUk職聶@聫Xa@UVIlK@UUWVU聞Llm@UUUnKWU@K@UXm聞XVa@U掳KVUUWUk@a職UVKkaWk聝KUknaWa@U聴聫@聧m@m聧k@聝aUJk@@_WKkLmx聞l@nUJmIUWlIUa聛VWVXn@xWLk@@a聝JUI@U聝@UVVxm@UVk聞mb炉VUU炉JWU聝@脜n炉aUb脟@脟l聛LmW聝Xkb聝聝k@U聝聝I脟V聝UXW聶w脟nk@卤aU@@bUVUKUXmV聝@kaU聫m@k_卤l聶@XwVa@kVK@U聞Wm聴VaUmVUUakLUWWn脹K聝VW_聴m卤V聶n聝U炉@Um聝a@Xk@聝l炉V"],
                encodeOffsets: [
                    [126552, 41839]
                ]
            }
        }, {
            type: "Feature",
            id: "2108",
            properties: { name: "钀ュ彛甯�", cp: [122.4316, 40.4297], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@膴臇脝聬n陇聞聞掳膴炉艓W職么聞@xXb聜wnKl@nX@VUV聝KmL@VU@Ux脻聞@Vlb聞x聞U@VUb@b聜k聹`聜IUlVUn聞V@@UV@@JnXlK@b職@nb脝WUkUKVwUklKVU@UnK@mm聛虏KVUVVVU聞JXk@mm_@yVI聞bk聝@K@kmU聞m@V職LV@VU聞KVUVJn@l聶虏IVV聞K聞klK@kl@kmV聛UW聶I@y@UUUVa聶wUUU聶l聶@akmm聛VaUKmIUa聝Jk@聝wka贸IWW脹L@UlmUIU@WW@UnUUm@wmIVK@K膲娄聶@聛bWKk@ma聛x@bWXkamK聛聬聝@mVkKmx脹aWX@xUl脻n聛J"],
                encodeOffsets: [
                    [124786, 41102]
                ]
            }
        }, {
            type: "Feature",
            id: "2110",
            properties: { name: "杈介槼甯�", cp: [123.4094, 41.1383], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@職`Vz聞聜Wn聞VUV聞L@bVbVJ@I脠bVb@lVLXW聜n聞職聞x聜LnKV聨職b@聞n@Vbn@m聝聞聧V@職l聞IVa聞@@W職kVV聞I@KVLVanJV_VW聞UV@nn聞JVI聜Vn@na@alLlmk聝Vk@禄VU@mXw聝wk@@VmkVwXKl聧laUa@wVwnW@amI@mUI@聶VaUUkmm聝@Uka聝L@聝UI膲y聝LWkkKU@mKk@聶kWKUU聛J聸wkbkIWVkJWXkl@X聞聜@X炉VVbUVl聞Ux職VW聞聞lnI職@l聜Ub聞VUbVLmV@bUL炉J@娄UVmbm@聛Lmb聝akV脻KU_kK@amaVU聝聶聛bm@脜bmJ@b聶VUn聝@UVl@UbnL"],
                encodeOffsets: [
                    [125562, 42194]
                ]
            }
        }, {
            type: "Feature",
            id: "2111",
            properties: { name: "鐩橀敠甯�", cp: [121.9482, 41.0449], childNum: 3 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@Vb母x聜職@nnJVnX聨mb@V聞XVx職L@`炉@mI炉V聝@U娄@V職V@n聝J@V@LXx@V扭脭聞K聜LVx聞W聞knL@`聵b@n脠K@a聞@VX膴陇聞nVK@aVU@UnU@a職yU拢Uwm聶mKXU職m@I脝JnLUL@J掳IVK聝KU_@Wn@@I@yVU@aV_@楼Vm@_UKUV@a聝XkaVJVU聝UXW@_@WWIUlUIVm@IVW@IU@@VU@m聝UVVk聛J聸_聛l@aVa@U聝V聝wka@U脼聝VwV@@UnK聞LVU@UmWk@mL聛xWa@w贸聝UVUI脟脝膲娄炉娄炉x薀J"],
                encodeOffsets: [
                    [124392, 41822]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/nei_meng_gu_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "1507",
            properties: { name: "鍛间鸡璐濆皵甯�", cp: [120.8057, 50.2185], childNum: 13 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞m@艁k聝聶聨聝kl聝么聝@拢kJ掳媒聶蓞姆脩贸陇臒L膲脜l脟臒艁W炉炉聸聶匹贸每lwk牛脠茅脻茮贸聶掳脼脜xV陇膲臇W茠炉l拳牛蠀虄杀每姆茀藡臒杀艡脻牛蠙葝僻膴牛@炉kWKUKm鹿脜@姆JU@僻脩僻聞艒楼斯茊@L@聞脼聜VLn職@V艒膶WJX娄@J呕bU@牛脼mVU@葋媒贸bkWWL聝聝脜聧聶炉UW摹聛km贸聝卤U殴么V录平录聝艂胎臇平乾蕢x膲聨呕聛葪K螘虥实屁薀脼斯禄僻聬牛禄菚艒朔葘卤葰蕣臓U删蓽扫m脺譃呒烁茀葌炉菛K刷臒脠脪菙n凭艓艕聜@職膴b么么虗录茠@膴么膴聨脼膧聶x職臇僻L卤聨聹聨聜U職掳U聞掳默茠膶掳脺聝锚纱葌V艂掳@聝聞nx艓猫聝b脠聞脼葘蝷歉l聨虏Ilx膴l虏脪m職么臇聶脠l聞牡潞m聞脠锚V镁聞x蓻膶蕢脟牡Vm職聞脪聝脠蓡么茞虐莯膴掳脝乾漠凭b聞y膴@臓職茠X莯膵m禄么w掳脹k楼脟m炉莽聶kk脟谦牛菚茅X_亩W菛墨艓a脝牡母聫膴@葰葮聜聶膴L蘑膲聞V脝膲蕣聧脟臅贸aU楼職膲掳mk脜掳摹U聛臓艡k聧掳m聝脩膶每聵脹茠W母拢薁職脝x脠脼艓聫脼禄蕡虏膴脟膶al脪掳聬扭卤母z聞聨膴K脠虏m陇艓聬@脪掳录ny葌U藕墨菛瞥脠膿掳@職脻亩聝@聝脠聧k聧l楼脟莽kxk聶聸JX聛脟聝U聫脜@聵拢k禄聞贸瓶墨脹@l聧脜Jl楼贸媒@炉平摹脝聧脜an聶膵聶掳茅炉鹿"],
                encodeOffsets: [
                    [128194, 51014]
                ]
            }
        }, {
            type: "Feature",
            id: "1529",
            properties: { name: "闃挎媺鍠勭洘", cp: [102.019, 40.1001], childNum: 3 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聶茝n菬屁诗職殴蓡每掳炉脝V虏聧刷聶偶每@脻脝艁劝炉葊瞥膲贸聶聶@臒ky職鹿@墨職聸聝wl拢殴聝聝炉纽茅@聶脟聧脟x艐膲譬UU艃艒L聶脟聶牡贸脻n聝贸莽@聶聶贸@摹聝票聞楼聝莽聶WU莽脝艒聝聧@茅聴莽钮K聶莽拳V一平袒aW楼葋拢实菉菗撇沙脼聴菙l聬偶脼m臓贸默葌聬刹犬@脠蘑女藕脭n亩呕菭職艓拳聹谐艃膵贸拳牛螚脝茟脼僻脜潍贸葮谦杀葋摹l脹k脟掳葋脠n職玫l炉么聞脼蓻脻k蘑贸聫W膴聞z脟杉蕽@脟脠姆lU膶脜脺姆n苇茠菗K犬艓艓b掳蘑莯艑@燃么默m臓臒虐艒臇僻b袊僻艒x@姆贸拢脜l卤膧僻墨X脻摹脝聝锚膲K掳脻蕠茀@螌蕢偶脜脪媳蕡@聬撕凭譀啷む‖牛嗒睹承埫ㄊ濽職陇覑_薷茟薁山苔脻蓽L讏蓻蠝贸葌J蠚脠@菬酮a脼禄犬藕"],
                encodeOffsets: [
                    [107764, 42750]
                ]
            }
        }, {
            type: "Feature",
            id: "1525",
            properties: { name: "閿℃灄閮嫆鐩�", cp: [115.6421, 44.176], childNum: 12 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@识默膴I葮屁屁聨@默脹蘑葯扭膲默聝膧贸職U聜脠艢脺猫n纽茞趣葎艂习U屁钮凭脩軉臒刹茰菙聬脠猫蕡撇膴茷茠職蓡炉碳V撕脪撕葌扭V蘑锚U脺聝x聞膧藢藰屁聞脝掳癣m脼偶U录脝l艓@膴莽艓n脠脪酮艓藕聝母U掳l偶wUb掳掳掳V職拢脼l臓膲膴L脼聫蓡n藕聫脼聞n娄膴a葌墨摹艃炉I膲暖l禄k聝聞聶脟媒聞楼艓炉聝茅n拢摹脩聶脻拳x聝脟聶@脜莽姆禄贸票艓楼聶莽W每聛ml聧贸a聛拢脟b聶yV脜膶脟V禄脻聧U炉聶K膲媒菚膵牛n摹炉聛禄脟聫艒Um禄臒聧聝脩聶w茝b膵脟脜聨膵w藡脠脹每蕢脩掳艁kw@贸脟禄膲w聶楼V脩殴U聶mW禄臒聧臒菈V每扭脜藕墨@艡炉臒n玫茞@脼脜n艁V菈贸J聝w膴脩k臅脻w炉nk楼艔a贸娄膲聝V娄脜`臒脩聝脩脻@mwn聧炉m卤@贸茠脹K藣茝菗卤U聛職脻聶a炉l聝聧艒職葯k聞猫聝默脼聨聛n@扭摹虐k掳膵x@聹膲`僻臅掳聛@聫牛脪膲wm聛膲@聝聝n聝聝a聞聧聶楼姆n聝脼膲V贸脝贸k膲聨姆@脻k僻僻脹a聝掳脟@脻脠U聵贸b脻录@聞脹脪V掳聶@V录藡L聶脼蓞扭殴菭V脼葪扭脟臇脜職艒b葋茰"],
                encodeOffsets: [
                    [113817, 44421]
                ]
            }
        }, {
            type: "Feature",
            id: "1506",
            properties: { name: "閯傚皵澶氭柉甯�", cp: [108.9734, 39.2487], childNum: 8 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@亩L虏默V艂茟kkl@葞聶艠W艅脠默葪炉聶潞lz@臓職職膴么纽么聞脪臓掳k脼脺職聶n@陇聞U母猫母b艑脠X聨母Ll脪蘑x刹聧脝陇脠脹凭J脠脻掳U職脜亩禄虏VW炉母J么聛職bk聜V@么聧lbn聧膴y脠zV聫么a職b@聬母聜脼Ul聧掳y乾虏乾m掳職職k聞卤lbn聛掳@脠禄聵JX聛聞V艓脩脝J@k聞L職聝脝l虏聶臓虏蕣暖膴摹聜艡贸茮脼脜@m聞聝mLU每贸膲僻@聶禄聛L@聞聸`膶母m職葪脩牛暖卤膲臒l炉膧聶w脟聨聝莽僻扭脹I@卤脺膲菗莽艒掳Uw么聶谦暖姆瞥脜聶卤b脜拢聶脫脟wn脩贸@葋平@聧聶聝脟僻蘑贸n禄艔臅贸膴炉b聞脜聶聶V券脜Im聝艒KU聞聶L菗卤脻x膵聴艐聵V聬卤膧葪掳聶聞殴l卤職脹@W脪葋艢殴聫袧艢脜猫艑么聞录掳劝蔀葌V膴"],
                encodeOffsets: [
                    [109542, 39983]
                ]
            }
        }, {
            type: "Feature",
            id: "1504",
            properties: { name: "璧ゅ嘲甯�", cp: [118.6743, 43.2642], childNum: 10 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@刹艁蘑菈膴w凭艒脼沫掳_艓艃藕裙茠U膶每l禄炉聛么姆V每乾平聶聧蓞摹脜脩谦禄虗聬薀龋U聶炉wVW脻聧脠摹W禄脼鹿m脻茠蓻艓每艓艒桐暖V鹿聛聸艒聛聶茅膵聶贸殴脜VV蘑签蕡@臇膵@姆職脹職V掳炉x脟脜牛楼聶禄掳脹么聶膲薀聞楼W媒膶楼聶w聜莽聛禄卤mn脜姆楼藡V聝bU脪摹禄脜x臒L僻聶聝bW臇脜x職娄U掳脻V贸虐l么虏@職楼脺脼脹么聞V@虏卤`職娄聶聞聶炉脻@聞聨脜聞V脪艒录么職聶陇V虏殴默脟膴茟聝牛x聝莽炉Lk禄薀l平媒m艂脻脝茝@m枚掳臓@艢殴默牛脝U膧臓菉臓聨X录職n藕VU脪職娄膴x脠录@么lx炉艂蕣脪脺膧藢脟膶x脝聧膶脠茞a職x聞脪臓聨n录艓V脠聬聜录蘑掳扭m菛膶膴镁職LV掳脼聨U录膵脠U脝職z脠a聜陇么bk聨聜nX膧職猫"],
                encodeOffsets: [
                    [122232, 46328]
                ]
            }
        }, {
            type: "Feature",
            id: "1508",
            properties: { name: "宸村溅娣栧皵甯�", cp: [107.5562, 41.3196], childNum: 7 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@虏@螙莯荽识瞻母聞聵茠娄亩聶虙U藢录泳脟凭录台U脼膲聵僻聴茅脻禄聝臅膲聴茞葝聹艒仟ak贸聜贸炉a@聶么牛聶aV炉脼炉掳@虏茅l楼牡臒钮w艒x贸炉k卤職聴V贸@聫聶a贸bU聬脟y膲zm聨ka贸聨U@l聛聶a贸聜姆IX掳卤U牡录聶脝炉V脟脼平I脟脺脜拢杀聨摹wk脩姆KW聧艐脟姆a姆莽聝V@拢職m脹聶l脻臒炉聝脩钮贸强拼券掳脜艂@脼呕膧恕職卤聨脜U炉掳蓞膧聶藕僻尸m菭職茞"],
                encodeOffsets: [
                    [107764, 42750]
                ]
            }
        }, {
            type: "Feature",
            id: "1505",
            properties: { name: "閫氳窘甯�", cp: [121.4758, 43.9673], childNum: 8 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@么撇母录脝猫職@聞脠犬w凭禄薁聧蘑楼V聧脝@虏楼@禄艓脩職炉膴J扭拢k禄脝脟X炉碳艒職墨掳aX拢么聝凭葋藕楼聞聝聶a么聧扭聶蘑L掳聝母@犬录脠脪蕡艢么VX暖脝a臓茮脠K聝姆職膲么每@臒脠膲聶禄脟Vn聶膲V聸wX聛臓脻掳職膶每母wV聝聶炉炉堑卤聶膲聜谦聶脜脜m禄虏聧呕卤平Im楼牛脠姆@炉職僻JV禄脼U脻莽炉U摹潞U拢牛聨贸a脜脜l聝聝聶僻墨炉K炉脼脻聝臒L虘葝平@艒艓艒膧茟蓽n脼脻潞X录脟蘑脼聨UX掳xV職薁趣虖聫乾录脝脪蓡蘑職聨谦凭U膧贸母掳聜k录膵膧茟V殴群艒艅炉`脻漠平艓膲x摹菉杀艂艒娄"],
                encodeOffsets: [
                    [122097, 46379]
                ]
            }
        }, {
            type: "Feature",
            id: "1509",
            properties: { name: "涔屽叞瀵熷竷甯�", cp: [112.5769, 41.77], childNum: 11 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@薁菭脼母刹群茠脪葌茮艓a脝聶脠臅葮牛U脻藕菬蓡牛職脻藢KU禄職@U炉脺脩@聝脼禄么aV聴脼脟脠@聞炉脺b屁屁脼l母@膴聧么l么脜膴U聞脻母m職娄聝聨聞bm聞聞聞膴@n聜膴x扭脩@聬炉聜屁臇膴_@聸膶wl炉聶聝拳L聸脻聞禄平炉姆暖聞菗@脟菗b膵聶脜脜脝w聛每臓脟U拢贸a聝楼炉a艓臒臓牛kw掳禄炉暖l脻牡k脟禄脻掳杀僻谦a贸么杀禄脟k炉艃贸聝蕠艕呕聸膲菉呕蘑聞聨炉脪脠Ul掳聝x掳n聞脪聶默贸n聶膴臒掳脟艢膲娄实V聝掳掳默脹偶脟J葋艅蕠痛贸藗平艓聸脝牛娄"],
                encodeOffsets: [
                    [112984, 43763]
                ]
            }
        }, {
            type: "Feature",
            id: "1522",
            properties: { name: "鍏村畨鐩�", cp: [121.3879, 46.1426], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@脝Xnl艓掳@LVL臓镁聹x膴U犬膴nU聞聧臓聫V@偶aW炉XI艓摹聝楼脻聛@K@w@K@I撕呕艓娄屁聝屁脪艓I脝@X@V潞nX掳l艓@凭膲摔茠葮欠葮脩脻脻職聧脼bV牛母每扭x脠臇茞聨聛锚脟Kn聬母楼么@聸姆脼Un脪l@U脜職a聝墨藡聝炉脩僻x@聫卤kX艡茞茝脹茅V聶藡禄l艒炉膲聞脜脟脫谦脼聴臇摹V@聧臒禄聸掳牡聞脟脼菗录炉m聵脹脜艃膲聧臓脟凭b虏莽聝聶職茅偶炉V聝聝臒脼ml禄艒脩V莽聴禄V炉聶炉職臅脝U炉y掳k炉炉V禄么脟聞脩掳a@殴k聶摹K牛職贸聨職b聝聞殴娄平葌贸聞W陇炉b聶默袒艓W掳脜脠l录牛陇膲I聶掳艒脪@录卤娄脜@U聨摹娄薀聨平录職脼蘑脪m陇聞锚艒掳聝娄脠镁聝職l聞k录膴虐掳J蘑艅葋默聞掳聝偶n聜脟bV聞脻录@录贸母牛陇@掳脜n職l"],
                encodeOffsets: [
                    [122412, 48482]
                ]
            }
        }, {
            type: "Feature",
            id: "1502",
            properties: { name: "鍖呭ご甯�", cp: [110.3467, 41.4899], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@藕x偶膧菙脝乾V葮膧扭楼聹脜凭艒么藖蕡统葌艃脠I脺呕炉墨聞炉艒m聶炉杀臇炉聝姆脪脻I脻禄脜V聶聝l脜么脩聞摹聶臒Vm脼nn聝W莽kW脺聛X茲脝wU禄葮臅職拢膲脩臒卤卤職脜k聶聞聝K@l脜I艒脪聝UW聜聴I脟录炉@m聜ka聝虏聶l炉聶谦n谦卤炉zk聨脻V姆聛U么聶聵l虏么掳艓w纽x亩臓k娄卤锚炉@脻掳U掳職b贸扭@職掳b聛么l么签b聸艓茝葞膴聵聞臇脼录聵锚聴屁脻膴"],
                encodeOffsets: [
                    [112017, 43465]
                ]
            }
        }, {
            type: "Feature",
            id: "1501",
            properties: { name: "鍛煎拰娴╃壒甯�", cp: [111.4124, 40.4901], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@识U膴楼脠艡臓炉職膲么m職墨聝脩炉m聞wk炉脟V掳脩聝聧偶摹膴菈菗杀牛菗聸茲贸X炉聝蓻脪贸a@n脻脝么茰聛艢膲蘑蕢虐膴脪聶陇葪臇V录脜xW茷脹聜lXX猫m聞脻mUn職臓聝蘑贸脪k脝職聞脝U脼录脼J母脩掳聞刹臅職掳艓n"],
                encodeOffsets: [
                    [114098, 42312]
                ]
            }
        }, {
            type: "Feature",
            id: "1503",
            properties: { name: "涔屾捣甯�", cp: [106.886, 39.4739], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@葮掳脟墨X艃職艞@葝lk茠lU艁卤墨牡K艒录V聨脟么X母炉聨@職钮锚聞掳藕聞k陇聞x聶聹@默"],
                encodeOffsets: [
                    [109317, 40799]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/ning_xia_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "6403",
            properties: { name: "鍚村繝甯�", cp: [106.853, 37.3755], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@nLV聜@職VL職a脼bn@@l聵職@bU聬VlUV聞zVx聶陇k脼V猫職Xn職聜@nm掳a@U聝脩聞@V聨XnV@Va聞U職聨VKUUU@@U聜@@KVa@U虏@聜wXkW聫nk聞卤lLnU@UmmVKnIVWnI@聧UK聸@UK@聧@UVKXkmW聛LWUXmlkVwUyVa@w聞w@aVI聞K@aV聧脠w聞KlLVV@LnV聞VVnU聜脺虏掳W脠IU脝@n脼录聜聜@娄聶@U脼UVW@UxUxVn聞b聞K聜b炉脼U`Vb乾聶V@XX脝VVl掳InmnU么聝掳炉聜anam拢聹WVX聜KXm職k么aVU@聝Vak@@wma聝n@K@U脹UWKXU聝脟聝@UI聶b@alW@akLUKV@@Ukw卤I職聸nL@kmwkWmk@JUI聝暖Vmn聧nU@m@U聝K聞聧VKlkUwk聝聝nV聫UKmbkI卤職聴K聝kmVkK聝b@U@a聝VkUmn聶`kIlaUK@UUKmbUI脻職Ua@mUa@a聝聞m@UUULUK@bmKkbWI@WXwlkX聝Wa@k@聫kK聝LVkkK@L@JUVmzUKlwUUnW聵拢XVlKUwVU@aXI@aWaUw@W@_nam@炉聜UkWVkUWaU@nwmJkUV聛kWVUmUkJ@ImbUa聝@@W脜_mJknmak@@m聝X聝aUV@聞聝xU職聝聞@聜聝聞@VUnkV聝@Vn@`ULUbWLXVW@kbUJ@XW`聛@聝n脜臇WJ聝@聴聬m掳@x聝x職bn聧Ua聜w虏l聝脼掳x扭IVVUL脹聜Wb職bkVVX脝`UbVL聞@kx掳LlV@V聹聞Wb聝J聛n@bl陇ULV聞聛掳@lmL@聝聝拢U@@aUwmKULVxUVVx@聞聶@kU聶@mK炉L脟a炉@"],
                encodeOffsets: [
                    [108124, 38605]
                ]
            }
        }, {
            type: "Feature",
            id: "6405",
            properties: { name: "涓崼甯�", cp: [105.4028, 36.9525], childNum: 3 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@掳@脠b掳KnL職@lV職@@聝UwVUUwVKnLVx@bV@聞陇@聞nK@k聜炉U聝VKk拢@a聜m聞IXa聸聝@UkU炉Klw聝@UKVa脜_UWlU聶aXa脺聛VKUU牛J炉w聞脻卤k聛xVbm聨聶a聞w@wn炉聵聫聞@XI脝臅聞m聜@X_@WVIlaX@WUXKVaVK@_Um聞@lUVm@U聞聝@聛聞聝V聶聞w@聝VU脹wm@@W@ImKUkU@Ua聜aX聝@wWaUKkw@UVaUamLU聶nk@禄卤`炉@k聴W@Ua聶ykb聝I聞聞@VWJkLWUkJ聝wU@聝n聛陇mL炉wm@Um聝虏XVWbnV@bmx聝VkxUblLUV@聬kVWKU录聝聨kU聝@mn@JnV@bUnmJUn@聞k聜@Xlx職LVVnKlLVV@職@LkKULVbk`WL@lkXW@kV聝@U脼Ul脟X聶lkaUbmV炉@@L@職聝V@bkb@x聝lW聞聴b聝bW@聴聧卤@UJ@IU@mVk聞VxV@@l聞Ill聹n@Vm@聝VUbl聞@J聛LmK脹XmVkU聸KULU`@L膲w聝KUX聞lVUl@Vb聞JX娄碳b脼x艓x蓽臇臓聞艓a么@"],
                encodeOffsets: [
                    [108124, 38605]
                ]
            }
        }, {
            type: "Feature",
            id: "6404",
            properties: { name: "鍥哄師甯�", cp: [106.1389, 35.9363], childNum: 6 },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@Vnn@掳xnK聜拢聞mV@聞xlIXVlKXI@U聝聝聞Jla職zVbX@l聵掳@虏_@录mlV職nKVbUb@VlxVLXb@xW聞聛bVbV@VlnL@J@Xn@脺x聞b聞W@nl@nblmnI脝`@X聞@Vbna@aVUUWVk聝@kbWakbU@Vw職W@_l@nmn@@alVlk@UkmVak@@a聜UXa聝L@炉@KVa@a聛xWI@KnkVaVJn_lJ@聞X@聜m@nVanUVb@mXLlJ聞聛VWnLla聞VVaVX@KXVVkVKlknKVa@aVU@KXb@klJUknUm聝@K@_UW@alIUamaU炉kJma@IUK@U聞@@UW@@aXLV聝VJVaXI聝KlaUkUV@ambU聧UJkIWJ@wUI聶V@JU@UwV@@Um@聶nU`@UkUmVUxWUUV@a脜b@aWXkKUU聝UUaWK@wnm@IVU@aXwm@UmVaUalk@anKUwl聝Uwl聛kK@wma聝UkmmIk@VmkUUbW@UVUnW@kV@xkVmbVnU聜聶@UbUV@a聸k@kkW@聞kLW陇@聞nV@VU@W_UV聶UU`VLUV@IUV玫VULU@UUUJ@wmkUJ@職WI@l@bkKkbVV聝bVbUL@UUJ@Vm@@L@x聛bVVVLVlVwX@Vb@bmUkbk@@JWIUV脜w@Km@UkWKXxWL脜@UVUnWK@xkVW聞@KUL聛wWVXVWzXVVKVXkV聸V@VUbV@U聞VV@職@LXxVL@V聞b聜聨聞LnKVLVxXVmb@l"],
                    ["@@@J@a聝U@LWK炉UUxVVn@臓聞聞LU聫W@UbUUUa@KUX"]
                ],
                encodeOffsets: [
                    [
                        [108023, 37052]
                    ],
                    [
                        [108541, 36299]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "6401",
            properties: { name: "閾跺窛甯�", cp: [106.3586, 38.1775], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@職U職wVK@UVW脼U職b職w聞V@knV聵@@KU_VK@K聞聝n@W_XWlL@Vn@膴w@Ula聹@Wanam墨@a聝禄艐贸@a脝脜刹每UaV_掳脻聛a聝L聝aUmVwVwX@VUV脻職@@楼聛聛脻禄@mV脜脟J炉X脹卤V聛Um聝UmU@KUUkK聝L脟xU聨@b聝LUJ@b聝x@xUbVzUxklWnXV聜KnXWlUL@V@聨VL聹@VL@聨mJUXmJULnn@VmVkK聝虏mlX聬Wl聛x卤@@VUb@L聛@@VV@VVUL聶聧聝VUbU@WmU聧聝@聞脪@V炉bmn聛@V聨聝聞@lVnU職nVW聨X聬Vl@娄VVUn@x聜職@聜XL@娄聜lXx職聞Vb"],
                encodeOffsets: [
                    [108563, 39803]
                ]
            }
        }, {
            type: "Feature",
            id: "6402",
            properties: { name: "鐭冲槾灞卞競", cp: [106.4795, 39.0015], childNum: 2 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@U炉姆贸卤脟脹炉聶姆mbXb聸@kb@V膲xm@@UkKWXX`m@聝聞@LULV`@L聴@mU@l聝U聶x聶a脻VUX@VUL聶x聶VkLWV職職@J聞nVLXVl聨UV@zl聜VL@V@b聞聞n@lU虏WVLlLVbU聨VxUx@x莯L聵x么脪聹k聜K虏聨Va聜U@wXa@聧W聶脠膲Ua@聫聜b脠k聞m@炉"],
                encodeOffsets: [
                    [109542, 39938]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/qing_hai_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "6328",
            properties: { name: "娴疯タ钂欏彜鏃忚棌鏃忚嚜娌诲窞", cp: [94.9768, 37.1118], childNum: 7 },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@聞聫V拢掳聫職@la聹X么卤藕w職聶么@聞Ul聝偶a脺聧n聧聶K聝w@U聞a聝聶職a虏L聜m脠L脝職脠xlaUa聞w脼m脺b脼U職聧nJ掳a聞k么聝聜脩kw脻V臒w脟@脻kkV炉楼@聧貌聫聞禄聞n扭楼XImw@mVw職a@聧脜w聶聫mLkaW聧聴w聝楼l禄k莽聝贸聞禄@聝W脩膲聨臒聧@膲聞聶聜艃聞聧Uw贸艡V贸m聧牡禄聶聶脻@V菚炉k職脻膴脜k聶掳脫UklkU卤職I聞脟脼k聝卤@聧職聧平J聝聧聶@U聫摹Ik@W娄聶V聛脩葯脫脜n钮KULn聨炉X聸聝@聫聛炉mU脹@W脜聶m贸Kkn艒b聝x脻@聝聨U@kw@每脟L牛職脻Uk職mw聝聨聛k聶l膵V脜職U娄聶聨聝LkUWl脜脩@a聝@脜脩卤U贸摹殴录聝脠膲m呕@@wkw聶Kl炉U聶摹@聴聞l脟U聛聶脫炉_聝聜Wa膲虏脜l贸录Vbkn聝K脟聨脜@僻蘑艒掳脻@臒聞W聶脜xUUm@聶聜脻X脹聜W聞ULU猫炉@mbUa聝L聝bUW摹x聛IUJWz聶a炉b聶y聶@艒脠贸LU`脟XUl聶U膲V炉n聸m脹b菚Lkl聝U膲V聝職贸a摹聞茝b摹K牛nkb脻mmn脻W拳脠聝聨脻X牛W贸聬kU脟l炉U炉聜摹U蓞膧@掳炉聞聞職炉聞V脝n聬mJ@膴姆n贸JUb脻XUlV職kL@lVxnnmb@陇Vz職`脼脼扭@聞Vn聬脝JV聞掳b聞U么Jkzl聨kl@虏贸職@脝脟掳k臇聝職脟b脹U@lmb聶XV聵kz聝V聶聨蓞膧X刷l艅聞默殴@聸茅脜@膲艅脝掳臒bU職l聨蓽_掳聜@x纽聬聵職kbVb茠K蘑聞扭V艓聨掳@偶脠藕l膴聞么K么b@n么x纽聞脝@么聨艓L@镁脝b@職nn職W藢b脠x聜Ina艓xlU@脩虏卤聝臒VU蘑聝屁b刹@脼楼么UU聧姆WV聧么炉膴W识n么a扭藖@拢nmnI么聨仟K掳xUX么@纽a掳m聜kX聫脝聧脼V艓k膴掳脼L脠聞么yVa職IlwX聫掳UVw蘑脩脺K么w@nV@聹m掳nm聨n聞脺聜蔀拢Vbm聨Xn聝掳脺脪@x聛x@V聜b虏UlbkxVn職JUnVV膴聧掳K膶職m掳nx脟nn陇卤娄@聨UXVV@聞聛lV聞聞bmVV脠聛聨Vx職脪聶掳職I職b藕a膶聝職bVw職@職聝VL聞聶凭脩@聝纽聫么炉膴k么脩"],
                    ["@@聞@職聝聞@n聞貌V聹a聜w虏bVx職x脺a膶V么_膴J職IVm職L聞a掳@艓楼X聛lK@聝職k聞l聞KVbUb聵@nU蘑n聜a脠@lm乾禄臓炉聹n聜mn聝屁聛Vy聶脩菛聶臓禄刹In聨聜@@脜蘑瞥@炉掳聶么V聞K脠bVI脟楼炉@脻贸聞聶@脩n墨WK職聝k聶聜k@楼職聶炉聶脜a聶X聝卤V聛脜w@卤臓炉@禄聶聧職聶n聶Wm聛w@聝聶聧@聧炉聝V聝UUW莽聝K膲聞聛a卤Vkk聝V炉w聶x@職UJ聜x@bkn脟b聶m脜@Uw卤U炉娄U聨聶Km職炉I炉聨钮录臒膴聶@脟聝殴脠炉@脻禄脟n恕J聝b脹猫脟n聝聞脜K炉聞摹臓殴聬W录脜lm聞@陇n虏聝聨脻b@b聞職炉l聝聬炉@聝職脜陇W聞聶录nV@x聞聞掳@Vx聞@lbUblbX录W聜聹職脟虏l職U聨@录聛聨V娄@b脟lVxUbVx脼bV職聹bm娄聝VV聞"]
                ],
                encodeOffsets: [
                    [
                        [100452, 39719]
                    ],
                    [
                        [91980, 35742]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "6327",
            properties: { name: "鐜夋爲钘忔棌鑷不宸�", cp: [93.5925, 33.9368], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@蓡每蘑V掳聛掳V脠klV么聫扭X脼W聞聧犬脟脼Xnm脼nla扭m蘑L茞a蘑聝么b聞聶膴U聞Vlk菛K脺a聹n掳m膴U職VVk脠WV_么K艓脟職@職z掳a職bXyVI聜J蘑wVX聞a聞KVbna掳@V莽VKX聝脺聛脼W職聛n@VV脝wX職臓聝脼@艓炉屁摹脝@脠聧聞LlmUa么禄脝k膴卤Xb聞聛掳`職脭V聜k脠聵聝蘑@V職k掳職Llx@x偶@膴n聞脟藕禄么蘑虏V脝脪聞@@b脝脪XklV聞K職聧V楼脝聶膶U職k聜l聞聧nxl聶聛莽聝楼膵莽@卤聛聛m楼聝w脜J聝聛@聶聶聶V聝聞m脠Il茅脠a掳聛U楼聶聶@k脼V聜K虏脩W聝掳w虏脩聜K虏帽職y脝聬聞脻職Vmw聞禄kkW膲聴JWU聝V脜w聝L聶m脜@@聝mw聞kn楼V脩聝禄掳聶掳@@禄聞炉聞Lla聞J么聧nV聜U脜炉聝U@W炉Um脩炉炉k@WykU@炉聞wV楼聝kVw牛聝k禄職wW脟聹膲亩莽職K聞聝脼聶脟a膲b聝I聶lU聬聝@kw聝W聝XU聝掳w聶卤@U職Kn拢W膲聴KWx聝k聛臅V聝職amwXw聶@聶聞Wmnk@a聝Vk聝聶b膲L聝l聶Imm聞wU聧脟聜聛聧Wx聶n脻Jn聛@楼脝聶kw聝aX聝脺膲聶炉脜V炉陇mk聝x炉k姆脺聶虏聛VW么殴VU聝聝@V拢聶楼@聝掳wn聧@聶m聫@聧炉@UbU么姆聨mn@脝脹@脟媒VaU聧脟膴聛V聝@脟l臒聴炉x脻扭聶lV脠脠V聝x聞聬聝陇Vx聶聞kK@聧聶@聝x@聞kV聝臇摹楼kIWbX聨艓x@n聝x脜UW`聝_聴@卤聨Ua聶LUx聝K炉聞WbkVlb聴bm聨聝L脹脝WIUw聝Wkw脻V@聧kI聸聨聛茅Ub聸UUk聶V炉Km炉k@Um脻聬炉m炉聬聸m聴L聸脼膲聜脹Um聶摹拢UxkKm掳聶L聛w聸職k@k職聝Vm聞聝K聛VUk聸@炉a炉蘑聶m贸KUU聶x聶Iml脜n聶聶脟bX猫VVU聞掳聞@聨職聨@聞聜xXnm職聶職職聨@录臒掳@虏脝xU聜聞虏職W脝b掳職聶職@娄聛ll職聶聞XLm默@脪聝職脼么掳@脠娄UJ脟a聝L贸U炉職@掳摹拼@脝聛@m聧杀J臒录菚職職脪Uz僻聜m聞聛n聸m臒掳谦录kn脟@聛b摹mmV聴@VaUa聝L聝k聶l@聞kLW聜艒娄炉@聝b聶KUn聶J膲I贸`膵U脹b聶wUw卤a聛x聸b帽Um聝聝@聶聞聝@聴b聝a聝b脟聫脜Xm聵聞茠脻聞脜么Vb脼聨聶bl聞U職脼V脼職聞U聜掳聞VUx聝@U聞V聬聞@l`聶录nL@膴聞LW聞聞陇kX姆W摹XUVVV姆聞UbVb@掳kVVx脠a聜@膶娄膴b職a藕J聞U@脠職聞聞聵V聹聝l職@Xk么aW聝蘑聶脼@la母U脝b虏m脼L臓聶脼脩么b職脪膴a聞JVbm娄"],
                encodeOffsets: [
                    [93285, 37030]
                ]
            }
        }, {
            type: "Feature",
            id: "6326",
            properties: { name: "鏋滄礇钘忔棌鑷不宸�", cp: [99.3823, 34.0466], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@脼V扭聶脠K@膧lxV@聞聧脼@聞w艓alm么L職nX脝脺@nV聜掳@聬聹聞掳Wm聧VK纽L脝m葰脭聜脪職UX楼l@蘑JV聬職@聞聨凭I@w聶W掳聶聶脜n楼聸k脜脻Vw么聝脠莽聞@l脩膴臅職a聞Jna脝LVw掳kny掳Unk脝V膶聧膴ll娄聞V凭@@聶nU藕聝脠脟聜In聫掳X聞w脼K么娄VWV拢聞聫@拢掳贸k膵卤I聛聶聶am炉Va聶禄膶膲V楼掳聶@m聞k聞楼l@聞聛膴m@a職聧U聶mwX聝@w脝x職m蘑_聞`Vn脝b職KVw聞@@聝nUV臒VmVV枚Il聨l@@莽脹m聝拢U脟聞w掳@V聧U聝炉禄m炉聝J艒臇脜L聝a@禄膲蘑卤`U_k`脟莽職贸聝kX聶lK@聧聝ak脻脼聝職拢W膵k聛脻聶kx聝J脻炉脜w聶x姆xmI脜x聞聫@k卤J@媒艐職聸陇U聹k聨mV聶掳脜聧脻xkwm摹聝n脻VU聞職娄聝扭聛lm職贸Xk陇聶聬UK聝莽聶@mVkK@kl聫聛墨聝拢m職炉VUb聝W炉录膵b炉聬牡am录mVX聞m@k陇脟X聛聜脟b聝U聝聞炉J炉聞炉脠@聵聶bVXV脪聶陇V录kx脻職V聬聛聞@l聜V聴聞Wx脹娄W職炉職mK聛nl聨k聨聜職U聬聛聜@n茟U膲聞脻@脟潞脹聞膵U膲楼聶U聝脼脜聫聶z卤貌聛L卤脪炉xX聞卤脪聛L脻U@l職職V娄炉聜脟bk锚脟J聝nU聞職職@職聞聜脝I聞xn娄聜聜@虏膶猫聞娄聜猫"],
                encodeOffsets: [
                    [99709, 36130]
                ]
            }
        }, {
            type: "Feature",
            id: "6325",
            properties: { name: "娴峰崡钘忔棌鑷不宸�", cp: [100.3711, 35.9418], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@Vx聝聨聛艅聝職@膴臓聨膴聧X脪掳U凭臅脼m掳拢nb@聜@LUUW聞脹潞@nl脝乾職臓拢脼V掳UXb聜V葌堑聞茅聝@聛kWanm掳@聶x聞z聞K掳炉臓V職聝V聝kw聶Lnm掳k脼x脝a聞楼@聧聜wn膲脝聫@聶聹_l聸職_Vw職m母猫扭脜膶U@聶聵Wn聧@脩mKU聶n臒聝K@聝掳炉U每V拢nm職Ll聶聞U聝U脹茅卤贸贸kkm聝n聝akV@脟掳贸脻X聝W蓹脼钮I牛xmm聶V脹UV聛葌脫n聛Wy葋膲k聝V聧職聧掳Wnk膴a聞楼聜_聹K掳每W聧na@聧聝mU聧炉w聝l脻IU陇UX贸楼脻L聝x炉Wm聬聛J脟脠殴聞mV@職平@聝Uk楼膲k膵聨脜Uml炉Vmz炉lUx脜Kmb聝I聶b膲臇k脪聝@脟猫贸聞Ux脝脼聹lm娄職脝炉職職X@x聶聨@聨聞虏脻l聝脠聶JV虏klVl炉脭l職膲脝聶脼掳lU菛脼@職職亩录n聨U么么艢"],
                encodeOffsets: [
                    [101712, 37632]
                ]
            }
        }, {
            type: "Feature",
            id: "6322",
            properties: { name: "娴峰寳钘忔棌鑷不宸�", cp: [100.3711, 37.9138], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@艒m摹x平聛Um卤L强镁摹脭聶@kxmW聝b炉I炉聜mIUx@b聝b殴V脟聨聝k牡b聝l膲I炉楼聝U職m@聝脝炉脠@職a職贸職Ul聝膶禄@w聸聧聹禄聸wXa聝聝贸掳牛莽脻聞kU聝aV楼脜b脻w炉lmn職KlxU聞聶聞臒U炉掳聝L聝y職w炉@mnXb聜l聞@聝锚葋嵌聛UWa炉V脻U臒陇谦聶k脜@m脺鹿X聝VV@K@聛ma炉陇脻n平臇炉V@聞聝录聞么l猫k录聞娄聵xX聨lbnK職聬脝x@聨聶bUx@nnxWJ牛娄聝m聝录帽聬@聨掳娄lU脼l脠@臓x脼Ulx聛脪贸聞聝l炉bmI聶聨脻V脹a脻n聝xVbkb脟w脜聶脟K聛n卤K聶b聞職聝b@V聞x職Lm聨脹聨呕bk聞聝V贸@聶職殴x贸虏聸Wkb聶@炉聬U陇聝聬藕膴@lUX聞掳l脝么U聞聝lLX聧聜a聹V掳w職xUb掳x脺么脠KVk脠mlw職k脠K職w職K聶聶VU扭膲艓禄聞禄聞Il楼na掳LV禄虏炉脺y@w蘑聝掳聧母wlw蘑w掳卤聞_lVk職@掳聝b聝脝炉z聝聜聞職聞@l_聞@蘑卤l脜職Vl聧Ua脼聝聞LV聝nKln脠聫掳Ill膶a聵w脼脩掳x聞UU聶@w聝聫V聛km臓L么禄聞K脼媒么a脼楼么膧脼m脝聛聞聶聜mU聝艓聛V楼脠l掳虏掳a虏楼V聧聞@@w聞amm@脩n@脝拢偶聝V聝臓拢@W聞炉脼聝職聧l@職禄@Uk@"],
                encodeOffsets: [
                    [105087, 37992]
                ]
            }
        }, {
            type: "Feature",
            id: "6323",
            properties: { name: "榛勫崡钘忔棌鑷不宸�", cp: [101.5686, 35.1178], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@么l虏么脺锚聞V聝Vk職聶KmnU陇V膧炉掳@聞聞Lm臓V職nL脠L@alb@al@n聫掳V職_XmWU脠amaVIn@n聫聜aV拢聹贸VW聝聶U拢掳a職x脠楼@聶聜a膴w脠鹿@贸職a聶聝臒bm聫@k聞w@m聝a脝w@聝聞In炉mm聝@UkkW聝脩脜@@k膵聫脜莽Vk脻J脜kVyk殴l楼@炉職聶蘑U脺聝X楼貌媒聴mmX聶脻脜lmU@拢聶Wl聛聛y聶XW禄脜b聝l@a聛I聸禄k@klm@UxUU聝V聝录炉X聝l聶aUn姆聜聝I@x聶@炉聞聝K聶聞膲UU`贸職l膶炉么@陇聝聬脼J聞k掳xV聨聞n@聨mbX聨炉膧聸L聛`聝娄膲bml炉X聶聨U聨l聞葌膴Xzm聜葋脭U聜脺V職Unn扭w纽J蓺脻聞X脼W炉么@脠lU聞b聞mln"],
                encodeOffsets: [
                    [103984, 36344]
                ]
            }
        }, {
            type: "Feature",
            id: "6321",
            properties: { name: "娴蜂笢鍦板尯", cp: [102.3706, 36.2988], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@脪聞b職陇脝I掳么U录職掳U聨nnWx聶職@b炉L@lUUWbXxWl聞屁nxV聬Ull職聞XV聨U聨nL@l葊媒虏KVn凭聜蘑wV禄聝聛@m脼拢n聫脝聝脼脩mL聶聧聝KUaV聧偶臅聝WVk虏聧聝聝脝脻@聝Xw掳@聞聧么聶@a掳w贸UU聫mIk聶聶aVm脼wmkny聝鹿V每僻n脜聫m拢X禄聵聶naV卤聞聛脻w@a職b@a聝m炉聞膲V贸娄k脻WKU聛U@WanU聶b@么脟潞膲x聛b@職脟娄聶w炉bV陇聞職UX聸么U陇聛bm聬m@UJnb脟bXVWn聶`炉Um聬k@@bka@b脟K"],
                encodeOffsets: [
                    [104108, 37030]
                ]
            }
        }, {
            type: "Feature",
            id: "6301",
            properties: { name: "瑗垮畞甯�", cp: [101.4038, 36.8207], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@kmKV聧U聧聝Wk聶VkU聫mw聝僻XkWwXaVV@k掳K@a職聶XwmmV聧聶炉V禄炉贸脜J聶拢聝am聨聴X@職膵V牛脝姆莽聶nUx聶`k聹聸`@職脜聬m膴聛x@聨聝娄U娄聞blV脼聝扭猫么炉聞聞Wb聹x聸录聹聨@x膵录k聞聶V聶么聶b脟@脜掳@聞聶n聞V掳娄膴J聞k亩a聞l脠聧藕U聞a@aVwnJ掳聛掳J聞anXlw職@蘑脫"],
                encodeOffsets: [
                    [104356, 38042]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/shang_hai_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "310230",
            properties: { name: "宕囨槑鍘�", cp: [121.5637, 31.5383], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@u艔u禄GPIV卤脨蓛艤{\\qJmC[W\\t聞戮脮j脮p聡n脙聨卤脗聫|臎脭e`虏聞聽聠nZzZ~V|B^IpUbU聠{bs\\a\\OvQ聮K陋s聠M艌拢RAhQ膜聥lA`G膫A@磨W臐O聯"],
                encodeOffsets: [
                    [124908, 32105]
                ]
            }
        }, {
            type: "Feature",
            id: "310119",
            properties: { name: "鍗楁眹鍖�", cp: [121.8755, 30.954], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@`y聰膲N菚Dw菑禄聝脰LxCdJ`HB@LBTD@CPFXANC@@PGBKNECCBB@EBFHEDDDSNKAUNBDMNqf[HcDCCcF聟@EFGLEBa@ACoCCDDD@LGHD@DJFBBJED@BGAEGGFKIGDBDLBAD@FHBEF@RFDMLE@SGANFFJBANPH@@E@FJjRIACDMDOEKLFD@DbDAJI@AP@BGHFBCBGDCC@DCA@CECGH@FKCEHFJGBFDIHACEDNJDCVFBDCRKRLDLITB@CjNJI^DBCfNVDHDFKHAFGDIICDWBIF@@CFAjFJNJBBHD@CJ@AEFJ@@DH@BFBCPDBMFEQGDIFCNDHIP@HDABFACBJFHEBSZC@DP@@JDB皮~"],
                encodeOffsets: [
                    [124854, 31907]
                ]
            }
        }, {
            type: "Feature",
            id: "310120",
            properties: { name: "濂夎搐鍖�", cp: [121.5747, 30.8475], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@~T~JjZdDbLXDLCB_J@@FHFZJJIAGH@HGR@BENBLID@@LFCDF\\FpDBDb@FAHKFE聠@dEDDdC\\GreNMACVMLBTMCCFCEGFAA@DAFDLMHA@OD@BMEWDOC@AS@KGAI_DcKw聞脮铆s茲聭氓膯ctKbMBQ@EGEBEJ@@MBKL@BJB@FIBGKE@ABG@@FMFCPL@AjCD@ZOFCJIDICIlKJHNGJALH@@FPDCTJDGDBNCn"],
                encodeOffsets: [
                    [124274, 31722]
                ]
            }
        }, {
            type: "Feature",
            id: "310115",
            properties: { name: "娴︿笢鏂板尯", cp: [121.6928, 31.2561], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@EN@JJLNHjLJNR^GRYVBNZJRBV@PDvbLNDN@LGNER@nCNQNuT_TIVFV\\Z\\XnDrI|[蓜艣虏脧JUHO疲}CA@IO@@CYDATGFIEDAEBBAGCO@GJMCEDCJRHEFANOCADAEG@@CI@FE@BDIC@AGIAIMiEEB@DE@AJCXJDCJEHGBELGCUCeMAD]CIJiM@DSAKJKCLQDQACUECDMIFCBDJGECHAEIWCK@GLMCCGEACNKCEJG@MMBMC@@CIJUINT@JAJSTEPZZCP"],
                encodeOffsets: [
                    [124383, 31915]
                ]
            }
        }, {
            type: "Feature",
            id: "310116",
            properties: { name: "閲戝北鍖�", cp: [121.2657, 30.8112], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@L@BIHFN@@EE@@EFBDGDAADVDD@@EF@CA@IIsRE@GDAF@BF@CV@|FBCHBLCNHAFCADBMDCFZXHILBVEEQA@MWFARJJ@DCX@@TEFBLHAAERE@AJABRPBNK\\BrJ\\VHGND@CNADKDADQjGAGNC@GJ@FCFFHC@JF@@dLBDSFADHVG\\DTEPDDHJALIJkJDJCDIPE@YDCBiK@DONE@EH@BAF@HLJA@EIA@ALKNA@@FIFAFHR@NALads忙膮yQY@聝A卤D艍XUVI^BF@FFF@HBJEDFFGFEBSRkVEXGHFBMFIVW@GAEEFOIAIPKABGWEKFSCQLQBSEIBC\\FdBLRR@JGACFDDEF@AWB@LJJYNABBA@CUEGPaO_AIE@MYMFIGAEFECHSAAKAO\\[JEDB@E@MMA@@AGBKMGDFFCDDFEDFJF@NPBAFLHFH@EDDHBADDC@DDCDHHCDDFDABDAD@FEFOBCJ[D@HEDDNJBDDHABJIBBvGLBJAH"],
                encodeOffsets: [
                    [123901, 31695]
                ]
            }
        }, {
            type: "Feature",
            id: "310118",
            properties: { name: "闈掓郸鍖�", cp: [121.1751, 31.1909], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@RUNKdOFDJCbRFMLAHPLDN@JGL@@APBWYCKN@TU@SHGCEJIDIJKVIZVNM`iNY@CIE@CA@KBOEGEUFCCSADEIEFCDDDIDDHC@CKIeDCG@IG@DHWFEEGCH@@GO@@O]CNpeEQDBFME[JC]DGF@CKOA@QSB@GB@@GW@@ED@AQIJIAAFE@@DO@CFI@KNG@CDACAFEGKGBEGBDCCAIFCCLIECFI@MBCLDHGNAHSF@DMB@EEKBA@@C]DEICFG@ADBHGFKCDAKKHKD@@FHGAANGEEFCHKCECBCKG@ADKCNE\\[A[I@@mGBDQQEO@BCE@AI[AML@JGACLOAFKEMM@EQKC@CUCBCCBCHEA@FF@@FM@GEAJK@GNF@EXPH@FD@M^@HIADJCFDBER@DK@@DE@CAKFOCCBDHIBCNSB@GFC@GQEEOWFICGDUAEJIDBTAHJHEB@DIF@NE@H|HBDBEH@DKBAHEF@HEEUB@FGFGCCCE@AHOB@NH@PRLVNNFBX@RC聙PbAvMtBfH@DJF@ELBFA@EH@HNED@FFB@HLC@CJ@@DJ@PIRf@HE@CFF@GPHD@DKE@FFBEFFD@DEFCA@DD@IjCRFBAHFDKD@HF@@PM@H@BlbDJDBFEF@DLXB@HCD@@IFCBIFEJD@FDC@FBALLF@PAACJERACAJCBD@EL@JD"],
                encodeOffsets: [
                    [124061, 32028]
                ]
            }
        }, {
            type: "Feature",
            id: "310117",
            properties: { name: "鏉炬睙鍖�", cp: [121.1984, 31.0268], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@DLDFRN@FNELPBDKHB@INK\\BBJF@ADP@RFCRHA@nJ@B\\[\\MFLDBCH@DLDADFGLEDFFMHBBGH@EC@GLLLCBLDHEAGBCH@DEFJ^C@DB@LAFFA@CNE@GTMBGHKCAD@NEJFDKJDDJEDBCDHAAFLHFHBEBDDCH@LMJ@DEP@@CF@BEJBJIBRC@@FX@@HA@@HTA@RPBDLE@CHD^\\INFAERCfFMo^D@PP@@HG@HDFFXECGH@@JDHfCLJ@DGDCCCJCCEDJFCFTBDDVEHFPFLAB@NBFCFKFC@CHIACNOHWHCAAFIDD@CDAGEI@ACFMF@R@R_@GQED@EGFEQEDE_IAHKAE聺XCQUOQCUDEN@ZI\\DDmAMHCICDSOC@EG@BKHIGMIBCGOCSF[CUHCGEBCTKA@cE@@IGDEEEDI@@HMDBHiHCRCBCLMB@DMCGH[UqI[AMLOAAQIB@BQFBFGBAKFE@SW@CDI@QIEBNXB@FRUFKAGJYWDENCCADBBEMGKDGAAD{EU@@DAEE@CB@HQFJt@JDBE@@FC@"],
                encodeOffsets: [
                    [123933, 31687]
                ]
            }
        }, {
            type: "Feature",
            id: "310114",
            properties: { name: "鍢夊畾鍖�", cp: [121.2437, 31.3625], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@F@LI@IDKJADKIEJICADGACFECCJ@HKCAFOHAJI@aCBEE@ICAEB[GFGCKL@FGEIFADMLCAEJM@ELQECEIG@BE^QKKLQCA@EHBIGQ[GEHOMGGDHKH@JOECFCjCBEFDNCACMBCILGTABDLEEOEIG@GFIMM@CGKFBFCDE@@GEAGEEACIcGaHMFITIHDN[AKF@FS@OA@BK@IHM@KCGOKBENaQIDECcPMLQVFHFB@BFBKLGD@FAJOVGIACQ@A`LPCB@JEF@RU@ANS@@RCL\\HIFpRBFRBBDKLLDADJDGBFDABHBEDNF@DGBBBADKDAHC@\\JJFBDEH[DEFDH\\LX@XLBLbT@DNJLDCEL@VJABJNDHB@HBHYFBAA@GNFB@@AFB@AFABFLFBHFCL@HJBAFBLC@DN@HN"],
                encodeOffsets: [
                    [124213, 32254]
                ]
            }
        }, {
            type: "Feature",
            id: "310113",
            properties: { name: "瀹濆北鍖�", cp: [121.4346, 31.4051], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聢m脰o脰i聝陆[s[YEUJU`SCIEBCCWJY_LIICDWU@@FaBCJIB[ICH[@@CDKEE@MK@@IMCAEBCH@AMFI@SMGEFGB@FK@BHCAIFJNQD@FEBDFMBKGACG@ECWH@@CDDTOEEBGEK@GC@EE@GPHFR\\JHGA@FDBKRLL]RAFH@FJFDKR@FINBFKDCNEBFJEHK@DLEH\\HFADB@JFFDA@bIJGBEPDBGLI@DDEFBDCHDBIJJFCLIBCL@JKJE@ADHDBHJ@HIBBDFHBBAEIJ@BJFAVL垄聢"],
                encodeOffsets: [
                    [124300, 32302]
                ]
            }
        }, {
            type: "Feature",
            id: "310112",
            properties: { name: "闂佃鍖�", cp: [121.4992, 31.0838], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@T@@ELE\\BCMJGJSNEbGdHDJFBJAFIEIFCEWG@@gMENSFCVJFAxR~B@IH@AIiI@GE@FGEAFQPDRiV[\\DFSGMHAXHDOMCJCDETBBNVJJI@DD@ANNNH@FILDDMFBDHNDHKL@XDFGLD@EHGFD@DDB@CDDHCDAEAHG@ABOJ@BIaC@CECLKPFNCDCJBiQEIF@@@OGBMIAEEBMTHF@NKEC@QFEGA@EBCKAACHCLJHEFHHB@AFCAIEACIC@HG@KCCDC[ECEED@KC@KJMAAFQ@GHG@BHIJYIGE@EI@A`KDWCaKcCiY}I}S[CYJM@CFDVPRRVWDF聻LBBG`JCFRFEFFHC@RF@HQ`Q@E@ENBDJ@HFCB@DCCEJBBGDGXMPBDGJ@DEDELEDMA@DJF@DMZ_jMNYUUJILCJIJDFGH@TSVM@DLXZ"],
                encodeOffsets: [
                    [124165, 32010]
                ]
            }
        }, {
            type: "Feature",
            id: "310110",
            properties: { name: "鏉ㄦ郸鍖�", cp: [121.528, 31.2966], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@V@CXJDKJZ`XIDDFADJvSRMDM@mFQHM@KCMKMuaOCU@BDAJSX@HKJGD@PNJCJWAGT@R"],
                encodeOffsets: [
                    [124402, 32064]
                ]
            }
        }, {
            type: "Feature",
            id: "310107",
            properties: { name: "鏅檧鍖�", cp: [121.3879, 31.2602], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@F@@FHDL@HFFAPFCSDC@@XGFDH@BDLHNACEFA@ERCIMJEDBAGL@@EHAFENHHJ\\ONQBQCIBC[MKACKI@GGGH@I_G@CW@[DMHCDIBMTDHN@JNHEH@FJFPKFACSBKHDJNABDMDECAFiDEDFDIPG@GLHCNH"],
                encodeOffsets: [
                    [124248, 32045]
                ]
            }
        }, {
            type: "Feature",
            id: "310104",
            properties: { name: "寰愭眹鍖�", cp: [121.4333, 31.1607], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@RADL\\NCPHFfLJaJ@FWLGMGIK@IFMDOYYFOTSBI@IMSAMSACFIDNDCPWGGBHNET[CU\\QjOCERFBEHF@@HjJBJG@@J"],
                encodeOffsets: [
                    [124327, 31941]
                ]
            }
        }, {
            type: "Feature",
            id: "310105",
            properties: { name: "闀垮畞鍖�", cp: [121.3852, 31.2115], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@HFFB@HF@DCAELENSJADCNG\\CX@@D`H@JHGHHJ@BINBFUGEDO[MCKQB}AwQEBUIEDMTNF@hH@FXEDFJEJIB"],
                encodeOffsets: [
                    [124250, 31987]
                ]
            }
        }, {
            type: "Feature",
            id: "310108",
            properties: { name: "闂稿寳鍖�", cp: [121.4511, 31.2794], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@CSG@BQGODUPWTOBQAAFMECKBGEMFKEOHADDJARMR[PGI@TEJBNG@ADBFND@JL@@NFFCL@D\\@DG\\JJADI"],
                encodeOffsets: [
                    [124385, 32068]
                ]
            }
        }, {
            type: "Feature",
            id: "310109",
            properties: { name: "铏瑰彛鍖�", cp: [121.4882, 31.2788], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@bA@E@QHSXBDIMI@OHCLI@GTWBIACQAYIOFGCENBBARSPOXCVHPARH@DT"],
                encodeOffsets: [
                    [124385, 32068]
                ]
            }
        }, {
            type: "Feature",
            id: "310101",
            properties: { name: "榛勬郸鍖�", cp: [121.4868, 31.219], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@NEHFLAFDHDPEAMZUHQQ]IMKJG@EPERABHBGRUCCNGV"],
                encodeOffsets: [
                    [124379, 31992]
                ]
            }
        }, {
            type: "Feature",
            id: "310103",
            properties: { name: "鍗㈡咕鍖�", cp: [121.4758, 31.2074], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@VDHQGABAFQFOH@LIiKKHEXI@IbAFZB"],
                encodeOffsets: [
                    [124385, 31974]
                ]
            }
        }, {
            type: "Feature",
            id: "310106",
            properties: { name: "闈欏畨鍖�", cp: [121.4484, 31.2286], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@DLLB\\NPGLFHUDMYABEeKEVMAAJ"],
                encodeOffsets: [
                    [124343, 31979]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/shan_dong_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "3706",
            properties: { name: "鐑熷彴甯�", cp: [120.7397, 37.5128], childNum: 9 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@扭L職LllV艅虏猫掳x偶蘑臓脝l脪聞職扭b聹聞V陇膴Xn聨l蘑V膴聞脪職聞脠掳膴虐脼猫聵L聞卤@褵n禄VU藕膵虏禄脝k么V蓡k膴艃虏k扭VVwUUVmUa聝聛@KkU@聝mUmmk@UwUkmW@UVIXa@聝mw@a聶KUL聝a聝x@Uk@UbWU@yULmK炉@kX聝VUwm@@JUUknWKUV聝LUbU@聶wWykI聝a@w@mUI@a職UVynIWa聞k聞@@W聞bl@@knm聝K@wnIl聶掳Kna@聛V楼臒@摹U姆禄聶楼@U艒J聝X炉陇k@聶wmI炉聜k@mw聝ak@@職lX@bUJ@V聝bknWxkLkxl聨職LVlkLm聨職b@bU@聝bU@VbU`Vb@n聞L@聨mb聴U@聵VnUVmnU@mm聶@kIUWVIUK聸VkkUJUnmL@VmLUa聛VWaXamU@聶聶U@KUUmV聝U聴J聝U聶V脟w臒n聶m聝@mX膲V@l炉xn么"],
                encodeOffsets: [
                    [122446, 38042]
                ]
            }
        }, {
            type: "Feature",
            id: "3713",
            properties: { name: "涓存矀甯�", cp: [118.3118, 35.2936], childNum: 10 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聵bXl聝l@zlV@lXXm聨kbVVl職聞U@Vn@@Vmb@X職K職VX聞WJ@XXl@聞聜聨脠bVL職Ul`聞@XXV@VVUxVbUxVb職娄聞@聜WnXVJ@bnVUzl@聞掳脝x聞U聞KlU@mUUnUlUVWVUnVV@XX掳V@V職ll@Vk聞aXVl@Ux@bmbXLlKlb@b@bUJn@@聞聞b@n掳x掳K@an@@UlLVKVbXb@bVVnK掳LVa@UVa@聶Xw聜KVxnL職U掳@naV@UWUkW聝ULmV聴w脻KUUla@a贸_@m聝K@aUU@聛聝WU聧kwVm@aVI掳W聞@@IUw@a卤炉@楼kUVU聛m@a聜wkw聶@聝K@kVKk@maXalI@alL聞WXblaVLVU聞V@LnK職@聞l@w聵aXa職LlnUl聞L職mV@n聧掳J@_VmnIVym拢UKmI@WnIVm@anUVm脟_k聫摹I脜WUX脟m@U@脻炉脜@聝聶@naW聝聶IVW@IkK@klKn@naWI聝mk@聝a聝bkKkLWn聶WkLWmk_聝@UaV聝UKmLUw@mn拢WwUmU聶聝a贸V@UkUm@UKULUwmJUX@WW@X脪聶zVblJX聨WXk@UVWK聴X聜陇UL@xU@聝@聝VUaU@@XmVkLmWkXUy脻LmKXnV聨@n@l聶x@bWLnVVn聶`knULmxUl聞聞WLX聨Vb@V聝K@z炉x炉录Wx聶KUn@bk@聝l聝VVV聛z"],
                encodeOffsets: [
                    [120241, 36119]
                ]
            }
        }, {
            type: "Feature",
            id: "3707",
            properties: { name: "娼嶅潑甯�", cp: [119.0918, 36.524], childNum: 9 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@l@@U職K@聨@L@bX@@VlL@J聝LUVnX@`脺Xn`V虏mJ@bU@@n聞b@l掳xnn母V脝職掳@聞聝膴拢脼@lWn脩nk识Jm贸掳w@kk禄V聧@禄聝楼k@V@kw@wVm聞a聵脜聞m職a么拢艓聝XI@mln聞Kla@mV_UK聝@kUkw@alW聶IU禄聶m聝聴@WUIl卤UU脜U聸bkJ聝聧@a@wUKUaVI脝mXIWaka@m@Ul拢XKVw@聝UI聝JUkmJ聶聝V聛kU@a聞聝WK聴ImV聝@UxmL@bX`WXU@U`脟kUak@@掳UblXk聜mLUKmL@VUL贸聝聝Vk@@Vlbn@Ub@聬膵aUJUb聝IUlVLUVVbVKX聞VlVXU@mb炉@聶VmKUw聛LWx@職Ub@VUb炉KmLUU@aWaUaULkK@Vm@@b炉L炉w@m聝a@聝m@UUU@U娄lJUX聝V聝mkb@nm聞XVW聨kb聶IVxUV@VUbWLXV聝LW`Ux@nk@Vn@x@VkJ@聹V`mXk聨@V聞xV聬@lV職職I@VUL職聵VU聞IV`掳bVXXx聞V@VWVnL@xV聞Ub"],
                encodeOffsets: [
                    [121332, 37840]
                ]
            }
        }, {
            type: "Feature",
            id: "3702",
            properties: { name: "闈掑矝甯�", cp: [120.4651, 36.3373], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞@nU聵JXL聝聞@blVU聜職聞nIVl聞IVJ@聞UxWLk陇@V@nlbXbWJ脜nUJVbVL@x@b聞聨lI聹a脝VVVk虏VJ@X聞聵職nV录職JkX@blxlV聞@VLU`@nkb聝Lkm@nWJ艒聞贸陇聶b聝n聴脝聝bUn@xlxU@l@聞娄@录U聨l录膴UnW聞@職n臓m脠x職U聞V聵I聞VnUVV@L職V@職nVWbXb聜UVbnK@UnKVmVIll聹UVLUJVXlJ職@nnV@nmVUUm@聴聵Vna@聧聝K@mUaV_UaV@聞aV@@a聶an聧lKUk聶Kk聧lwlKXwlm聞a@UVI@akW@聶l@聞bnxl@掳聛nJ職xl@掳拢聞W艓IU脩n禄la職m么鹿艓楼VaUUk聝mk摹W杀IUU殴`聸@kk@膲屁艡V楼聛_脟@聶默聝陇脻L炉m炉拢平贸姆wUW卤墨炉k艒a膲臅聶k臒m贸掳聝bW@UKkLUa聝Vmz@V@聨UxVn"],
                encodeOffsets: [
                    [122389, 36580]
                ]
            }
        }, {
            type: "Feature",
            id: "3717",
            properties: { name: "鑿忔辰甯�", cp: [115.6201, 35.2057], childNum: 9 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@楼職IVU脠m脼禄@UlU@Un@VW@UVmkk@aVUUKV脻@UVknK@UV@VVnIV聝@wn聝mwmKXaWaXI@UV@Vy虏blkVKkam聶U@kb@Um@VmUkm聝聛KmkXKWwkU@Ul聝@UnK@UVUUm聜KXw職UVL聞w聜K聞U聞@@Wl@@wUkV楼聴@@I@W@_V@VWUw@UUa@a聝aWa聴@@_mKUw聶l炉amzmV聴@WK聶nU@k聝WL姆aUK聛b脻VmV@聛UW脟b脹@聝X聶掳UbW@X聨m聞Vlk虏UJUbmL脟x脜WUzl聜炉Ll聞@VkK聶XUbWJ@bU@炉@聶聝kb聝LmKka聶聞@l聶_W職X潞VbUz@J聜n虏V@陇lX聞聨聞nV掳職Ln`WbXL么VlKVU職xXn聵lXLlU@bVV@聞XJWLUVnVV@聞聞@n聜l聞掳nn聜V聞K脠bVX脝JU掳VnXV聞kV@@xVL聞@職Wlb"],
                encodeOffsets: [
                    [118654, 36726]
                ]
            }
        }, {
            type: "Feature",
            id: "3708",
            properties: { name: "娴庡畞甯�", cp: [116.8286, 35.3375], childNum: 11 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@nam_nKl聫VLXa聞Il`職_@KVVXI@m@w聜聝聞@@k@K職n么@n`VbV@@L聞L@KVVn@VX@聜VL聞Jl聞職@VUU聝U@Uam@Uk聞w職KWaXam聛kJmIU聫VU脠bla職UnV@kVKl@@lXL掳kVJ@V脠nVJUX@V聜LXl@xVLnU聜@VK聞V@a聞IUaV@聞b膴U聞x聞K聜kVJXUlV聞聝聞UVa職I@WUI@KlUnw聞mWk@WXIW聝聶U聶L@Wna@Um@@U聝Vk聶UUlan聧WW@kkU@y聞kWk聴aWVUl脻bUU@k聝JUIU@@聝聶Jma贸k聝L聛K脟聝UUkKWLk@WbkUUa聝bmKn炉掳楼V@XwV@VanaVaU_@Wlk@W脠@VU脠VV脹聜m聞ak聧lK脠炉lLVUX@lK@aX@@kV@VmV@VwnJV_UWUw聝X聶am@kW@wVUkKVIUUVmU@UV@IVK@aUL@a聝V@Lm聞UKmx@聨聛么mLkUWJ@職nXmlUxUL@Vkn聸VU職U聞@V聶L聶`Ub卤LkV@kUK脟b脹@聝U聶W贸_mJ聝聧@Wk@@X聝@聝V聛L聝xUK聶VWx聛LVnUV@VmL@Vk聞@VlVXxWLnl聜Ln聞VlUnn@@VlaV@n職lbULkl卤aUzU@@VWJXbWbnLnxm聞@xU聞mJUUU@@VmLUl@VU脼VLUV@bllUn@VUXm@@VkV@V脻录脟nUV聶J@娄nn聝lnVlL@聞脼b掳KVV"],
                encodeOffsets: [
                    [118834, 36844]
                ]
            }
        }, {
            type: "Feature",
            id: "3714",
            properties: { name: "寰峰窞甯�", cp: [116.6858, 37.2107], childNum: 11 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞陇@VmbVXnVVbVJ職職X聬@聨ll@z聞lVInl@聞@bVxUb臓聜l@脠bla聞I職xXVWb@L聶@n聜ULWVXX職WWLnL@`@LUVVL@lVn聞J職U@UUk聜a聞聶n職聜V么么聞b掳录V聜脼聬X職聵聜聹I脺b膶a聵b么W聞X脼W脠z脝mnLVJ掳脠nlV虏lbnW@聶@U聝UV聶職mnwmkkKW聝聛kla@mVIUKUa聶aUwmn聶JU@@amIk@@bVlkX@mmUk聫lUU聝聝a@_UaUU聝V@w聝w聶WkXmW@I@WUa脻U@UXaWUU@UUVW@UUUWUn楼nUVa@m@k@alU@wk聫聶LWa聛@UUm@@wn聫mU聶wla@anKn_@alK@脻聶_聝@@WUUUml聧ka聝I聝yU@UwU_Wa炉yU_mWUwkImm@InWWUk@@UVWV聴kW炉U@V聝L@b炉b@l卤娄@職VV@lUbV聞@職kxVnU職l录XV@b@lV@nIWxnb聝聜聶@UU聶L聝x脜xm炉聝aU聝聶wU@mU脜V脻KULm@聛bmKUX贸@"],
                encodeOffsets: [
                    [118542, 37801]
                ]
            }
        }, {
            type: "Feature",
            id: "3716",
            properties: { name: "婊ㄥ窞甯�", cp: [117.8174, 37.4963], childNum: 7 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@Vb@`聞bV聞kVl聬nV@nlWUk@al@nJ@bV@職InmVx職bVbVLUJ@nkb聜lX聞lLnlmx聶nU職聞V@V@職mXn聵lb母@nnVx聜b@lnXV@UJ@nVx職xnxVb脝Vn炉茠臅聜@@w脠莽U脟l姆VI聹b聜@聞脟mk@楼k@UkUK@aWakU贸JW_UW@wkkWK@U@K職@XU聝聝UkmUUalKXala@U@kkWlk脠l@k職V聞mVIVmU_聜a聞聝聝wnwVW@w聝wU聝@wU拢聝wkJWI聛yUI卤bk聜V聬UJ@nmV聶Ukl聞Xmx@lnbW聞kV聝UkLW聨聝xkKUUmUkb聶J卤聧聴L脟xUKmkUmkkW聶聶a聞mUaVk職J脝_虏K臓@U聧聞W@w聞U聜楼nUWw聛K@a脻Uk脜VaVK@akLW聝聝聝炉I@bnbVx炉JW聞帽職WbUL@職聝聨nV@VmbkUUV@I脟ak@@bWak@WJU聹聛JWL@bXV@聞聜@聞V聞Jlb@zUlU聨UIm職nbV聜mz@掳UV@V聶bV@@V@L@x聛LmKUnmJVX聞J@VkLW@UVUL@b"],
                encodeOffsets: [
                    [120083, 38442]
                ]
            }
        }, {
            type: "Feature",
            id: "3715",
            properties: { name: "鑱婂煄甯�", cp: [115.9167, 36.4032], childNum: 8 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@么@VWnL聜an@VK脼L脝UnVV@職xV聞聞bn掳脝w聞w職KVV職@聞聛maXwmJU@@k@aWUk禄V聶Umlw@聶U聝Va@kUU@聶虏楼@k掳a@a聞K@U聸聝U聛聛@mmm@贸w聴脩卤楼炉@@w聶Kmw聴I聸楼kU炉UmakJmIUa聝VkKUkm@VUUa聶U聝@Ua聝KUK炉@聶w聶UV聨UIUKVw聶k聶楼聶w聝bV聨@xn聞@lWnXxlL@`聞XlJX娄l掳XxW娄@娄Ul聶n@聨聶@@Um@@VXVmx@聬炉bllUnUJ@VULVn@b聞xV聜VL@b聞聞VlnVVblV聞脠nVlIVJ聹L么聞lJ@xl聬虏聞"],
                encodeOffsets: [
                    [118542, 37801]
                ]
            }
        }, {
            type: "Feature",
            id: "3705",
            properties: { name: "涓滆惀甯�", cp: [118.7073, 37.5513], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@同U仟l么@掳U聹w掳艒臓炉職禄蘑莽聜禄X脟@w聶w茟a聶聧脟聝kwV茟炉@脜聶姆Umm炉w@k聝a@mV@@anIU卤m_脹W@_mWVU聞K@IkK@UW@@a@K@聧聶L@Vk@卤U聛@UV@lm@mUU@kLm聞聞xV陇@xV聞聞x@xUXmx聞x聝聞聛bV`UnUJ聝n聶U@l脟kkllX@l@VkbWbkLVbnVVl聞聞WV聶@@L@VXLll@xVXX`么IlVXb@bVLVll@@娄nl聝脠聛@聸aUJk母V脠脟猫@x"],
                encodeOffsets: [
                    [121005, 39066]
                ]
            }
        }, {
            type: "Feature",
            id: "3701",
            properties: { name: "娴庡崡甯�", cp: [117.1582, 36.8701], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@虏娄聵脪么xn@nn聜@V聜聹聞掳VlXU聵UX@Vl@XVmX@JnnlJVxnXV`掳zXbV`VxV@聞z聞Jlbk聨VnVV@X聞@職`@脼kL@bm`mL@bkb職xnVm聬@xn@VV聜@Xb職Kl聬@xkV@b@l@nUbmVm娄XVVV@VUXVVV@XVWb@V脼VVb@X@JnXlW職X聞x@x聞UVV@aVKVUX@lK@U聝IUWnIVmnL聜K@w@K@UU@職a@UVU@炉nyU聛man聶VJV聧Vk@yka聝I聝U聛@@聝WU@aXK聜IV聸XIl@Xb@al@脠b@JVUlVna@UmU聞聧@聶VKXa貌聶X聝掳IUwma@aU@UU@wVW@脩聞w@a聶I卤`kb聝Ukw聶UmJ@Ukm脟UUkmKknUV聝@mJUk聛aWk聝a@K聛聧mKkU聝LmyXa炉_@WmImm聛b聝LmUkVUbUV聝J聶b聝UkkWJkU聝l聶IUm聶k聶L聝聸聞聛lK@knaVmkI@mWa聝LUK聶UU@@VmLUV聛LWK@UUU聝WUkkVmx@聞Vl聶娄"],
                encodeOffsets: [
                    [119014, 37041]
                ]
            }
        }, {
            type: "Feature",
            id: "3709",
            properties: { name: "娉板畨甯�", cp: [117.0264, 36.0516], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@n录職聨W聞nx職L@x掳@職楼Uk@聝nwlUVl聞XVV@VXL聜KVUnK@UV@職VVL聞KXb@nlJUnmb@lkL聝聜聞聹職K職lVn職J聞klVXIll聞V職a聞IVUValUnV聞K聜annnJ@X掳`Wbnz聞KlVnL聜聨@L聞bXl聜bVlnI聞@VUU@UmV聝@U@U職楼@聧VmV@@_Ua@m掳@@聝聞kmUUm@UVmn@nX聜@@a聞anJVUVL聞mlIVJn@nkVLVa@KVmVLXVVL職@@U掳bn@VaV@@K@aVk聹bWaXUVymU@aUImW聛X聝@聶楼UaVwUaVwUUU@WW聝@k_聶VUK脟a聛聧@聝聝nmxkV@LVJ@X聶JUb聝V聝聞kUWVUI聛l聝L聝w膲V聝aU@Vb聝J@b聝UUL聛@mVUK@wWk聛K@UVWUI脟m@UUI炉lWK@kk@UL@lmU聶Vkb脟aUVV聬nJlIn聜WbXb聶L聝xVln@VbV@V聞UV聶@k聝聝IUK@聛UWm@UU@L聝K@KU@Uam_贸@聶m@L@l聝@聛聞@x@nWJUU@L聶`k_聝JWbUKk聬mLn`mb"],
                encodeOffsets: [
                    [118834, 36844]
                ]
            }
        }, {
            type: "Feature",
            id: "3710",
            properties: { name: "濞佹捣甯�", cp: [121.9482, 37.1393], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@VbUnVVUx膴录職录么@脼脩聞炉聜W乾L艓U脝W聞鹿U脟聝艒炉脩聝脻k牛聶聶牛贸摹聶贸L聶艂胎U聶wm楼k脻mkkK贸b脻@U娄@聜mb炉Lk職mJ@x聞Lmn@lk@聝a@X聝@聝lXbmJUz聶V@bVJ@n@x聞blJXz職xV@Va聞KVUXLlmVV@In@Vx聞UlW掳@nLVK@zXVVal@@V聞w聞bVK職L@bnx@聞WbUJ@VnXVlVxl@nnnV@聞lV@L聞聜"],
                encodeOffsets: [
                    [124842, 38312]
                ]
            }
        }, {
            type: "Feature",
            id: "3711",
            properties: { name: "鏃ョ収甯�", cp: [119.2786, 35.5023], childNum: 3 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@UaVUUKVk聞JVaVI膶b@聫Vam@ka@Ul@聞U么聞VK@UnKVLnKl聛kWVa@炉l@Vb脠lV_V@XWW_@anKVwUmVw@聧@Uny聞UVblKVLX@聞a么炉贸楼m脹膴每脠楼職聶脼鹿l聫U墨聝聧炉K膲录薀b脟V聶U聶聨U聨聶XmakJUnmV@bUnmJ@XnJVLn陇UzmJUn@`炉Im聨U@聶n聝KVkkm聶KWb聴b@x聝k聶@mL@K聝UUVUKkbWa聝XkK@bkJWbnbl@UL@l聞L職@lx聛x@b聜nUVlV@娄虏掳@bVx@J聝@炉XUJ@bUnlxV聨聞X@聜VV@b聞L@n么`@bkbVV脼L聵xnU"],
                encodeOffsets: [
                    [121883, 36895]
                ]
            }
        }, {
            type: "Feature",
            id: "3703",
            properties: { name: "娣勫崥甯�", cp: [118.0371, 36.6064], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@n聝lKV@nVn@@kVU聜@虏VVaU聝@wmKXU@U聝UWwUW炉aU_聝JUV聶聴VK@U聶JU聶@kU聫聝w@Ul聧nWU_@聸lI@U@wUml@@mVwX_聞KWUXKVa@UVUUw職JlaX聧WUn聝@mla聞n聞UVWkIV楼V@VVVI@a@akakLWKna@aVwk@WU聝bUlk@聶k@U炉UWWU@mUUVUXkVmVVV@nkV聝L聝V脜w聝炉k@WVXb聸aUl@bV@@b@xkVVXVxkJ@nk@@聨VLUlVb聜VXUVVUzV聜聶LVbUbV聞聛VWVkLm職kJ@n卤@UxU聞VVkV@b聝x@脪UX@xVVV@掳J聞聞X聞lK@bULUbl脝脼V@b聜LXxmV聛娄聝V@x聝XV聨臒@卤L脜`聶IUlVb聝n職bX職llVnnlVL脠w聵K虏聨職IlanVVVlL聞wX聧lK聞VlUX聝ma@knw聝Wlk職VnU@mVIU聫l聛虏aVJ聜zXJlI"],
                encodeOffsets: [
                    [121129, 37891]
                ]
            }
        }, {
            type: "Feature",
            id: "3704",
            properties: { name: "鏋ｅ簞甯�", cp: [117.323, 34.8926], childNum: 2 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聜yUU聞U聞kl@@aVm職LXw掳禄掳w@y聞L@UUaW聧XK聝聝VknwVKlm職_UmmUXK@a職w@k@mU聧WmUL@聝@聶@拢@K聝b脻V@akw聶aULm聝聝bUK聶LUU@lm@聴掳mL@nUJVxVXU`mIUxU@UnU@@lW@@bkLW@UVkK脟掳kLl聨聝b聛nU脺脟UUV脟@@Xkl@XV`UbmbUbU@WxU@炉娄m掳nL聞aVblVXal@XKlLVV脠聞聜L聞K么lnb職I@聞V@VJ聞I@lVV脼aVkXU"],
                encodeOffsets: [
                    [120241, 36119]
                ]
            }
        }, {
            type: "Feature",
            id: "3712",
            properties: { name: "鑾辫姕甯�", cp: [117.6526, 36.2714], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@lmnLVl脠Vln@VnI職Vlx聞Vla虏_職JlUUUV聝Vw虏@@mlIn聶lKXU聜UU聝VaUa職KU聛VyUUWV聛UUaVkUK@聧l@@mlIUwUWlU@w@aU@@LU@Ubm@炉a@V聶@UKWUUKUn@LUbUKmlm@UIkJ聝nUKUVmI聝b@b聛@mWm@Un@VVnnV聝l@聞炉@@nVb@`U@Un@聨聶娄@V@VU聞VnV@"],
                encodeOffsets: [
                    [120173, 37334]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/shan_xi_1_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "6108",
            properties: { name: "姒嗘灄甯�", cp: [109.8743, 38.205], childNum: 12 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聶媒V聝nIW禄聝W@禄kU脟L聴脻聝U炉楼脟IUWW脩聴UWwX炉m聝@禄n聧@聫脺聧脠姆么聶@a卤k膶卤聝w聞脩mw聛莽膵mU禄脝kk聧Vy聛Im聶膲每@聝脻鹿聝Wnw脟V職聶脜a聝zmm膲娄贸聶kVmx聶xU录V職kVm_UlVlk聞掳IV聜k聬mJ聛a聸娄k聶聶Lmm聛V@XmKn職lU聛么聸VXb聝b聝@Ua脟L臒脺聶聶脜w聝拢mKnm膵w脜@Uk聝bma聛V聝聝聝n@m炉aU聛聶Jm_k聵@kW聧Xyl@@k脜amw聶LU聶脼聶聝聶mW脜zUK聝職聶Uk聫卤@聶b@nnK聜bX陇mzV職聛聨Vx脟n聞聜炉聞@脪knW聝聝VUbk聧姆聫脠脩Wkk@Va聶聫聶U@聞mUkb聝脻脜@脻楼脟bk默聶XV`kL脟聧Vm聛alUUa聶nV卤nwmk聝J@In聝掳KVw炉Un脜@楼聶聝聶U卤b聛UU聵卤聹聛mWb脹KWn聛Um`U茠VK@bmn聹m聜脠脜录@V聞L@x聝xm職聞扭掳聬n聨@VmK聶聬虏Vl職lKk聞么@聞锚脺V@VXLlm職娄U職職V掳聧葮炉虏每@楼職@脝聛膴聵虏I職m亩nnb掳b聞KV聝母Ll聞脼@U犬職聬聶脺掳IV聝脼脻脼聬l聨聹x@聨姆膧W聨聞聬Ux聞猫脝聬@職掳聨Xn職l膴臇掳m聞n聝職V聞虏V掳脪脝娄聞a脼聞聞聵@zll@b脼膧職l職录nK膴录贸脠聜b虏卤職I仟脪炉臇聛V@聞lxnVlk聞JlaXw艑膲聞聞@Vn聨職聛職l脝臅聞U脝L聹猫艑扭么x脠職lU聹@職xlaU聛膵臅Xm聞IWmnk職VV聝聞VW_@a脠WUUmk@聝炉莽Vm聛禄聶聧卤W炉聧n楼V聶mkXw卤脟Vw聛聝"],
                encodeOffsets: [
                    [113592, 39645]
                ]
            }
        }, {
            type: "Feature",
            id: "6106",
            properties: { name: "寤跺畨甯�", cp: [109.1052, 36.4252], childNum: 13 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@kk脟mI職mUwVkU聝聝U虏Wm聛職Vkm@聛m`mI蘑臅U聝Va@聶m聛X聝聝每V聧V聧kyU媒職臅@聫l_Umn聝W聧聞KVk牛聶聶楼聶a聝w臒@聶聛@a么聝聞聝Wa聞kUm聝a炉炉聶a卤拢kx聶mmxUw脻@聛xmU聶b炉K聶w贸聞脻@kmm鹿Ub@lklVbmnnVUV@x聸Ukn僻JUX@聨聝L脟Wkw聶L姆僻脜wWJk聞聝Lk镁膲xWz聶JUn脟職k職@茞k录脺脭脠K職猫@掳l脠聶脝k娄l聞n@l录@l炉L聶掳UU聶V脟掳聝鹿聴`m录mXk聜聶bUa聝V@U炉x@娄聶脟聶聞UUmlmU聛Vm聞nnmlkw聶@@職聝娄脜聜脟Lmx炉Ikl職聞@娄m脝掳VUx炉Lm聞@J聞InlmxU虏職mVbkV聜bUn脠聨lKU_職Wl墨脠a脼娄脝@聞脼lanV@聝職V職聬Ubl@Xl脟脪母聬l聨Va聞UX聞lm@脩掳聝聝聛脠mUw聜聧U聶nyW拢聛amL@m職a虏@l聬職V聞聶VL脝ynX聞職脻職V職職Knx脝b@lk@WzX聨@ll聴n`職IV聜掳b@n聞m聞聞聜Unb聞aVl脝@膶xmnnL聞陇脝x職職臓脹脠KVb聞@聞aWa聹U聜贸kVm聶nL@W聜Unn職Kl職聹楼聜bnIl聫U聛炉Jl聝UkVkn`lUU聶V禄職wnwlU么職膴楼nn聞y脝b"],
                encodeOffsets: [
                    [113074, 37862]
                ]
            }
        }, {
            type: "Feature",
            id: "6107",
            properties: { name: "姹変腑甯�", cp: [106.886, 33.0139], childNum: 11 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@lKnb@n聞lWb掳bkx母wVb@艂聞nl聨聞聝膴楼職L@聬X聨l聶脠聝Vbl聧脠K聜b聞ak聧Vw么ml聧虏`聜n聹@聜nVK聹l聵k虏x艓聝掳娄VU聞J膴w@莽n聫W莽脼聝VkU聫贸脹@楼kw職聶職Um聝X炉W聫職脩k聝@聛UymIUwlUn楼聜mUk虏a掳炉V禄@聶脻V脠聶聞脻膵脜脜Vl禄聛@l聛@a掳卤@_kamm脜b聶a@聧聝聝m@脜录聶Kkn玫臓聴@m職聝聞炉L脜w聸聜聴LVxmb@录kV聶@mw炉wVakKW禄聛X卤录炉Vkx聝b聞录W聨@n聛x@x卤b贸akb聝@脻mU聬聶@姆脫脹L聶k聝VUm聶k炉陇脻LUl脻@脻z聶職聞x@x聶掳聶聶聶b聝m聝X炉aUJW炉聴k@b脟W聝w脹wWx聝@X聬Wl聛b@聨聝聞V聨脠Ulw職Lnl掳VlU么娄聹U掳陇V職UxVXUxlbkVVl聝I聞掳聞脜VlU掳m@k聞脟U炉xUl聝LUlVL@b聶掳臓In臓掳脠nK聜聞@x脼a虏n聜aUy職XUKVk職W么录脠a聜z掳JXUV脟V_聞JV聝職z@聨nb"],
                encodeOffsets: [
                    [109137, 34392]
                ]
            }
        }, {
            type: "Feature",
            id: "6109",
            properties: { name: "瀹夊悍甯�", cp: [109.1162, 32.7722], childNum: 10 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞b膴a屁猫職w么聬么聫聞录職b掳a職XV聝脼VU聧脼@聜aX聝m楼kImx炉炉聝V@anU@U脟茅臒L@聝炉楼V拢m聝@脻脠b聞K聜聶聞X掳w膶每聵聝聞b@x脠blx脠炉膴聞聞m脝UV聝聞n脠@屁聫脺L蘑楼聝殴n聝掳Vnn聵K聞a么_脠聝職wU聫聜aX聧m聧nW聜聧炉聧kl聸LX聝脟聶艒娄脻a脜Vmb臒Un楼卤w脜茅V聛聝an楼聝聧聞U聞禄掳am楼聞拢聝脻@聝聞wVw聶楼nU聞脩聝UmmVw聛m姆I脜a贸VWxkblb@b贸l@聹臒脪膲陇膵X聝聵炉X聶xk聞脟@贸脝脜x@職聶x姆_km脻聨脟拢kblb@`炉虏@bk聜聜@k录脝U膶脝聝脼脟職脼U@職U录炉掳卤bVl聛nm娄kVVxnJVz@聜l聞聶脪X聬W掳n聞聶V聶職lx@娄么脺V聬Ul脻聞X猫m聬@猫"],
                encodeOffsets: [
                    [110644, 34521]
                ]
            }
        }, {
            type: "Feature",
            id: "6110",
            properties: { name: "鍟嗘礇甯�", cp: [109.8083, 33.761], childNum: 7 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@虏nl聜么b職聞掳aVwnK脼I職`掳w職X么w掳V膴掳@聨脜職聞脼脝V聞z脼K@x職聨@a聜L脜職@b@聨nLl聝@職ln聞mnLVw聞a聞bV聝聜VnbU录聞V聝掳聞bl聞職b脠@亩聧纽b聵@n脟@amI聛yUI@聫臓聛Vm么聝U聛聶聝VwkwlanJ聞炉lw贸楼@an聛掳J職_聞聫聜@職聶n贸茠贸@拢l楼Uwma職脩@聝聛Um卤V_聝J聴拢聸J聴UW楼炉@聝_k聫炉录mU聝VU猫炉b@wmL聶禄臒Vma臒I炉陇膵IUW聶X聝K牡娄姆a聝JUb聶I聝lU聧贸Vmk@W脜脜脟@聝mU聞脜V聝n膲聝脟掳kw脟a@w聝a聴聞膵膧炉x聝W聛職聝L脟a@脼n聞U陇掳娄@聞臓K脠锚@VmV@b聞U掳掳nwlJn娄W聞聛b脻@V聨"],
                encodeOffsets: [
                    [111454, 34628]
                ]
            }
        }, {
            type: "Feature",
            id: "6103",
            properties: { name: "瀹濋浮甯�", cp: [107.1826, 34.3433], childNum: 10 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@聝聞拢@聸掳I職b@炉掳yn殴聝aU聝l聝U拢聞Um聫職牡膲@@ylU脼@@拢kWU炉WaU拢炉脟V楼聝@kb炉w聝n聶楼脟kU脟nU聝聫@聛炉卤聸kUL聛m聸@聛m卤_k聨贸nUxl聨聝b聛a脟Lk聨Ua脟聞k職W聧@聫聶K膲娄聝聞k聧聝m@艁Ua姆xlw炉aXa聝k@mmakL@職m職脹聨@录m聞@l聞XV`聝n聶KU職掳掳@虏職陇U聬脠@Vxm么聝x聛Kl聞VV虏aVw聞Xla聞Vlx@聬UVn聨脟nk掳聝VVL聶lkI聶職聝J脟k炉V@職kn脝聵n@lznmlVkzV聨聞VVx職@Ux聞z@x卤录Vx聛xU聞l聜kb聵@聞录膶k聵VXl臓k么V虏w聜LUKlw聹J@a聜IV楼脼聝n炉脺n聞聜聞@nk聵l虏k脝@職掳聞aVbnI@聶職聜扭n"],
                encodeOffsets: [
                    [110408, 35815]
                ]
            }
        }, {
            type: "Feature",
            id: "6105",
            properties: { name: "娓崡甯�", cp: [109.7864, 35.0299], childNum: 11 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@脠么L聞xU聨掳聞脼@m聨脠nl陇nU么L聜wX`@脼脻L聶聨U職mL么聞聞聨么bVbn潞ln脼@么聝職x掳L職anV聜w脼@Vxnw職nlw虏陇職b掳掳聞bVn聝lXb聝聞贸聞@b職聜臓@聞x職b職娄扭職V聶X摹聞拢W楼平山聝贸@媒贸茲脻禄聞拢X聶m茀職聫膴kU聝聞@聶聶職贸聞k钮a牡聨脟@聶ak聝聝a聞炉聝UV禄ma聛UU聞聝a聝bUxmK聝nkm@聶k聞mK@聧聝x贸@炉n炉K脟娄@么脜猫lxkx掳n聝凭炉KU聛炉W姆L@V脻IUb聶yWbX录脟掳"],
                encodeOffsets: [
                    [111589, 35657]
                ]
            }
        }, {
            type: "Feature",
            id: "6104",
            properties: { name: "鍜搁槼甯�", cp: [108.4131, 34.8706], childNum: 14 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@職IXy膴wl媒聞Kl聝XIVa姆聝聶禄聛a聸拢聞聫炉aVU@a聛聶聜w脠艒聜a職L虏禄聜V聹Uln掳W脠炉W禄Xa職zVa脼J@U聝禄@炉脻b臒wly@拢k脩牛卤W脩聝@ka聶IU聝聝n聝@炉聝贸m牛U聶b聶U炉l脟I脻b@陇脻@kV@z膴@聶亩n聬聝VV陇k聞V聞聞bm藕炉z@掳聶a炉J@聹聝陇@聞聞bUx聶b聝聞@`聶xU脭卤潞VX聹W聜聞UnUJ聜L蘑炉脠Klblm脠X艓掳職U聞聫掳L職聨lk脼K職@脠xl_掳亩U脪kbl職"],
                encodeOffsets: [
                    [111229, 36394]
                ]
            }
        }, {
            type: "Feature",
            id: "6101",
            properties: { name: "瑗垮畨甯�", cp: [109.1162, 34.2004], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@掳虏@聜聞聬mVV脠脠l職娄聞m掳xla聞@U娄掳脠V陇XbV掳lX脼a脠J掳k職V職a扭V么n掳聞聞@聞mV聞職Jlb聞@X脪扭虏l脪@陇kz臓x脼a@掳聞录母K掳XV聜掳L聞平炉mlwkw脝莽@贸脠楼掳L掳m么@聞w@a脝聶聛K@b聶聧@w脻L聝y脜U聝脻脝聶@聧膲炉炉U贸x聶W炉x聶_脻JmLUx炉b聶聝贸ak聛卤m脻UU聞聶W炉b聶a聝禄贸聬贸聫聶x僻莽膲b聝a膲x聝IUV炉楼艒聞卤w聴l"],
                encodeOffsets: [
                    [110206, 34532]
                ]
            }
        }, {
            type: "Feature",
            id: "6102",
            properties: { name: "閾滃窛甯�", cp: [109.0393, 35.1947], childNum: 2 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@脝x母屁職Klx脠X聞K@聧VW屁Ilm聹V@wVUmUnmUalk@kVaUa贸a聝聧贸聝nKV聶職聧脼K@脻W_聛x贸KmVk拢脟mn聧脻@炉聝V聧聝w贸K@脟炉Xkm聸V聛U卤录聶K聛b脟艓聛x聜職@bUV掳b聝聬聹陇聜b職录母聞Ub"],
                encodeOffsets: [
                    [111477, 36192]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/shan_xi_2_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "1409",
            properties: { name: "蹇诲窞甯�", cp: [112.4561, 38.8971], childNum: 14 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@Vx@lnbn娄WlnnU職m職掳職虏V職聬V聜VVVnUn聞潞lz@l聞聞@J聝@kXWVXl@L聝a@聞聝KUL聞聨lbnKlLnK聜LnK脝Xn掳職bVV@bUVl掳Un@LnaVJUbW@UX虏l聜@膶wlVVI職Wnk脝a掳聞聞anV聜Kn聛掳聶UW炉@聶aVUVk@Un@聞aV@ValwUanmWU聞k@WVUUanaVwnLVl掳@nk@mVU@UVK@w聞LVKVU@聝聞K@UUKVUV@@bnL聞a聜V聞a么職lIXmlKX_掳KVV@bVV聞@職zV`kblI聞V聞Ul聜職L@bnV@V聞聬膴ll聞聞VlIXW@k聞a聜U虏blK職VnIlJ聞albXXlWVn掳Jn職nL@l@XlJlaX@聞X聵W虏@l_VmnK職U聞blU@mnkVK聞炉@U@聝ma@kX楼V聝makk聝L聝聫聛a@a聝@WIUUV聫X聧WWnk@a掳a@kkm@kUUmJm聧@WUUUIk`m@V聴kaWWkX聶Km聝Xk炉聝@聧WK聝Lkak@卤b聝w聛@聝a聝a@aka聝@ma炉@聝L聴K脟脜kKWbkm摹聛聶卤脜U聝LUK聶VVk聝m炉LUVVb聝聞UwUW炉bm聞聝U聛L聝xWJ聴@聝klmkUm@@KnwVkVK@akw聝@@a炉b聝Kkn聸VUI聶b炉mmbk@UbmKUL@xUU聝@klmLU聨lVXI聜VVVUVU聹U`mLXVWbXnW`脜虏掳xm聨聛xU@m聛膲聝聝wU@mbU@U聝mbkVW娄kJ聶@聝X@`炉Im@UlUVVn聛b@bWJXnmb聝JUU聶UUa聝@UamIka聝x聝@@x@b"],
                encodeOffsets: [
                    [113614, 39657]
                ]
            }
        }, {
            type: "Feature",
            id: "1411",
            properties: { name: "鍚曟甯�", cp: [111.3574, 37.7325], childNum: 13 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@a@w聞@聞wlbnJVb聞@Vb職VVV聞InaWmXI@a聜aUmVUVkn@掳J@_聞W職@lIX楼lUnaV聞V@naV@聞x膴聞n聜V@聜wn聧炉w脝卤X_WmXaWUnKV_V聸VUUU聛UWJkUV聧nKlk炉聫聶@@kmKUa脜聛卤KkU@WmI@WUIlUUmVwX聝聜w@聝聛UlUVw聹V聜@聞Lnb聜W@anU@U職aVk么@l禄n@na聵JnU脠LVa脝聝UUVm聞聛VKV聝虏L@mU_lK@UVWkU聜a@a@U炉aUa聝脩贸脩Ub聶聞聝Kk@@a聝k炉mVaUwV聧聝脩kWU聛mK@UUKmXUW脻wUa聶LUU@aWJUUU@Ua脻聞U@WL@V聛KVaVI@WnU@alIVK聛聝聝@kI聝聫mIkJ@聶m@聝聶聛@@_聶K@x聝@kaW@U聞@Vmn@聨UK聛@mI聝JUXV陇XXWlkK聝kkK@XmJVakImJU@贸聶炉LWKUV@nUV聝LkxmKkLma@kXKmm聝L聝a聛b聶LmK@V聛@mXV脝Ux聝X@`nL聞aV@@VmLUVnLlL職聵聞b@聞職聨掳虏nx@b聜VUxlb@V炉bUV@zV聜XV膴XVx@lVn@Vnnm聨U職@LlJXV聝z炉VWVXb職V@bmn聶VUVk聞脟镁脜聞@XVxmbUlV聞Uln聞W聞@聞Xl聜@VLX脪@b脼J掳娄聞L聵貌聞@nU聜b@掳聞X@聨XbmVU聞V聞nb@x聜x"],
                encodeOffsets: [
                    [113614, 39657]
                ]
            }
        }, {
            type: "Feature",
            id: "1410",
            properties: { name: "涓存本甯�", cp: [111.4783, 36.1615], childNum: 17 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@nW聜@@UnL職K聜a聞b聞KnnWL@lnblKnLlw聞KVU@mVUXL掳K么職V@nIlJUbnI@WlL聞llLXkWWU拢VW聞InJ聜@VL@聧nm@UV聝X@lb聞@@w職L@`聜@聞職n@V@lw聞@n聞VmVX聞WmwnUl聝聹a@_lK聞wVlUn掳xVKVXXWlU職VVI@K@K聞n掳K聹wlVlU@kna@聫V_聞Wn聛聜m聞UVm@kXml_@m聞LlKXw掳m@_么JVUV@X聶l@UaV@Va掳I聞lk禄VwUkV聫mw聛UmmV聧n@V炉@K聝U聴wmK@U炉wUV脻@mJ聝U聴nWK聶@@UnKVa聞_lykUmK脹nm@聶x@聝UUlwVk聶聝XW@聛聝a@U聝@@K@聝kIV聶nammVakUl聝@wX@@k聝聶炉@聝VVbml@聞聞掳UbULmlVbnb脜K卤聬聛V聝KVXUJWa聛@ULWaU聧U@@U@aWK@UkxUK聝LUUUJ卤UkL@V卤kk@kam@UV@l@LWl@聬n@VVUx聞LlUUx@VUV聶U@a聝IUl聶L@掳mLU聜聝bkUUaWUUaUU@aWK聴LWJ@bUL@VUVVbU@m聛@a@聫聛kmKmn膲lUK聶X聝WUblb聴xmIk聝聝U@xWb@lk職Vx聶LX聨mzVV@bklVVUzm聵@bk聞@聬Vx@xl聨U聞@lUbV聬nl@聞Wxnl@n@聨UbV聞mL聛聜m聬聝b@`X@lUX@@xlnkLWaUJnnWV聶Vn@l聞@bULVV@l聶V@XnJVX"],
                encodeOffsets: [
                    [113063, 37784]
                ]
            }
        }, {
            type: "Feature",
            id: "1407",
            properties: { name: "鏅嬩腑甯�", cp: [112.7747, 37.37], childNum: 11 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@職lInJ聞聬lJ聞@聜聞ULkJ@bmV@XUJUb聜L@UXKV@脼聝VbV@VVXI@bVV職KVb脼xVXnWVL@VnLV聜lX聞脪U聨VxUb掳n聞l@bl@聞L職聝Va么脪聞脪Vb掳b@VnLnnV@lmn@lb聞U聞V@聞聜J聹UVV聜Xkl@lUzmJ@x職Xkl聜bUn聞JV職Ub聞nU聜lb聞V@nlLX@lak職V`Ub掳職@XVJnU聜L虏KlxnI@KV@lbUbVV聞KnVl@聞zlm@U職@n聨職I@WUaV聛l@@mVU聞@XkW聫@聝nkVKV聝聞_Vw聞y@knwVa聜@XalU聞@職Vnml@聞X@V聞L聜KVa脼bnnlJ職I聞mVKn聞VVVInVlU聞@聞m@聶m聛XK@UmyUI@mWUUakamw@wUwmLkakwV聝mK聶w@wUam拢聛y@am_聝W@聶UU@knmm聧聞amU@WUa@knw@聫聝UUUUV@n聝Jm聛@mVUkKVUUUkKmw聝KUL聝KUImV@lUn聶n聛聨m@mbUK@掳聶bUnmbUmkk聝WUb@am@UXkK@a卤@聶V聶@膲脜聶聞V聜UXVxUVkLWl炉@@bULUlm@@nm`聴X聝lWakIkm聸VUbUL@Vm@kI聝@@K職m@聴VaX聫聜I@W@aU@kU聝VU_聶K聝b聝Jkk脟聨聶b@nkKmL聶w脜W@kVUU聝VU@WUI聝JmIXmma@_kyVaUUlkUm@聝kU聸x炉L聝m@L@LUJ聶UkVWXUWUL炉wVmUk聝xkL@`聸bk聞mVnx聝XUWUnm聝聝@kxU@"],
                encodeOffsets: [
                    [114087, 37682]
                ]
            }
        }, {
            type: "Feature",
            id: "1408",
            properties: { name: "杩愬煄甯�", cp: [111.1487, 35.2002], childNum: 13 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞Vl聞nJ聵wkaVa聞X職WVL膴knmnL聜l@聬@bn聜V@UaVU@UVK@aXI聵KXL@bVVVbXVVblV聞aV聛nK@炉職KVk聞J@b職VVU@UVwkV聝KVwUUm@@聫Xk@K@kVUn@lbl@虏l@UlK虏VVIVV聞KVLlw@VXL@b@VV@V聨XbVK聜@XbVIUW聞L聜U虏聫脝LmaUankVKVa聝炉@聝nkUa聞U掳@聞職聜聫n@@kWa聞UVaXUW聫@IXKVw@U聶聝聞聶WU@W@聧@UU聝U@mn聛@聝`m@UUULkUmJ聶IU聫聝@@U聝K@U聛@聸an聝聶ak_@wmKUwmakV聶kmK聶V聶k炉b聶w聝`kwUI脟x炉禄脟a脜聝mn聛@@聶m聝mUkV@wkKW@kxmL聶Uk聫膲L脻k聶x脻w炉l贸VU聞mV@膧VVX娄W陇kz@`Vx掳聞虏母聜職@聞Ul@x聞锚母菉掳陇V聞VlXLWnXxmV@nUl@聞"],
                encodeOffsets: [
                    [113232, 36597]
                ]
            }
        }, {
            type: "Feature",
            id: "1402",
            properties: { name: "澶у悓甯�", cp: [113.7854, 39.8035], childNum: 8 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@虏拢職yl@膶聬聵臇@b母聨蘑b母聞聵聫X聧聞a聜K扭nn@艓么ll脠x聞nVn脼脟聞V@b聜nXllL掳K職bVb@J@b聴聞聜聞@聨U聞聞xlKXLlKl聧Xk聞聫@Ulk聞JlkU聝VKXU聝脟VIVm@_n脟職L職a職l聜w聞VnU@UUwma@a聝a脻a聛LmUk@@W聝@U@@X聶wVW脻UUUk@@VmL聝KV禄nwUw聶aUL@`mz聝JUIV聝UaUw聶KUaVIlJ么an脩lLVUn@職a聞@VV聞@@UUwVK掳Vn_lJ脝L聹茅W@UUU脜@禄lm@a脼IVwXW聵UUkkm@U@a聝U@聫mwU拢VWU_kWm聝XwW_掳yUkkK@U脟K@kkUVym聛贸K聴U@KWI聝bUak@mJ@bkbmLk聨聶Um聝kVU聞W娄@lnb@聞@V聝掳ULml@nkV聝a聶VmLUnk`卤@聴X聝WW@kb脟娄X聨炉聞Wx聛I@xmbmxXlWV聞聞@b脜聨Uz@J聜b@b脼b聶聨U@Wbk@聝xk@WX炉V脹聶聝W脻b脻UkVUU@alI@a@akLWa聶m@U炉UUm脟L@K@aU@炉VUk聝KmX@`@聹kJ@nV聜Ub@聬lbV脝XVW聞ULU`VbkLUV@XWl@bXJ聵@聛聬VbV@Vl"],
                encodeOffsets: [
                    [115335, 41209]
                ]
            }
        }, {
            type: "Feature",
            id: "1404",
            properties: { name: "闀挎不甯�", cp: [112.8625, 36.4746], childNum: 12 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@Uk聶Lky@I聜JVa聛聛@m脼aW聛職y@_聛W@_W聝XVlUVw職@nw掳K@m聞聛U聝Va聝mV聛kU@mmmnLVUmKXa聶U@IlKVUnK@UmWkX@WV_V聝@akU@a聞KWIXy聝IUVmUn聶Ua@聧WaXUVKVmkUWVkU聝LU@@V聝b聝K聛b聝IUm聝@mbVL聴x聸WUUkn卤V炉w聝b脜JUbmLkbmK脜K聝bVnUb聝V聶KUb聶KUbmL聛Km聬聝b聶a聝KkUm@U聨nn聜VnxU聬VlUxl录聝k炉JUbU@Vbk@W職U@UV贸I@`炉nWxkL聝K@nk`Wn@lUn聝V聛nm聜聝XU`@聬mb@lkV@聞VnklVVUblz@`nbWnnJ聞IVJ@XUVV聞UV@l脝X職xnKlL@m職a脠聧ll聞I聞a職LV`聞UlVV@@b@X聛JW聬Ub@聵聶n@L聞@lJn@@UVKVa聹UlnlJXb聞k聵Wn_@mn@VkVK@a掳@XklKVUUwVWU聛職聝膴脝職@職U虏@@blLVWn@@bVa聞XllVnnaVm職a@炉VLnan@聜聧職mVm@knUVJ"],
                encodeOffsets: [
                    [116269, 37637]
                ]
            }
        }, {
            type: "Feature",
            id: "1406",
            properties: { name: "鏈斿窞甯�", cp: [113.0713, 39.6991], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@XXWVXVWnnlnn@猫脝录@聞聞xl職聞聨V聞nbl職職職V聨脠聬UVl聜職@聞bln聹L脺聝膴mUkU@Ua聜聫聴@WI@aXk@WVUlKUaV_VKX聝WUU脜ka@聫VaU聛@mlI@聸@_nW聞LVl掳UV@@b@L脠KVn掳V@V職nXblK@b@bkJ@bVVlU脼V脼a聞X脺職掳UXWl@聞wl@XaV@職聧脻a@a聛a@IVy脝聧@a聝聝XUWknwna@w聜JXw掳聝W聧脠楼kI@W@kmKm聶炉IUmkXWWka聝bkImJ聶UkL卤a聛V聝b@lWXkJ聝Uk聝膲k聝聫@UmU@a聶Kk聛聝V聝UkJlaU_聶y聝@UU@aUU炉LW`kLWnkJ贸聶聝b聛U聝bmK@aU@UVVL@V聝L@聞UVUL聝K@xUL@VUV@nml炉@UkmKUxmbVbUV@X聝lXVmnVbkxUbU@聝bm@@VUlUV職b掳@VX炉職m聜"],
                encodeOffsets: [
                    [114615, 40562]
                ]
            }
        }, {
            type: "Feature",
            id: "1405",
            properties: { name: "鏅嬪煄甯�", cp: [112.7856, 35.6342], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@lV聞L職b聞an聫聜LnKVa職LVa職L聞UVaUm聞a脝LnLlanKVa脝I聞a掳x虏UlmVV聹X聵wUKna聞@Vn聞J聜a聞L聞a@UV@@alUkKVKnkmmVwUk聞w@聝聶@kxWUX聝W@@m聝k@aUa@a炉a聝LkKmwkUm@kL@K@aWIXm聝V聝X聝WkUVakL@UVK聝w@aUK@UUKmLU@炉n聶KUwV聝UIWJ聛UWmka聶@UX聝J聝k@UkmW@kLWK聛V聝x@bmI@VUaVU@a炉@UUmV聛KmX聛@卤`聛k脻KVxUL卤akL@V聶b聝LkKmV聝@X聬WVUb聝VXb@lm@聛聬@lW@@xk聞lVUbnnmbU職lJ@聞@L聞@@V聞b@聜WX職聞UlkxVV@聞職wn@脺mnLlVkz聝`UbmL@V職@XL聵m聞VnI脼@VU掳x@VnL聵x聞V@LU掳"],
                encodeOffsets: [
                    [115223, 36895]
                ]
            }
        }, {
            type: "Feature",
            id: "1401",
            properties: { name: "澶師甯�", cp: [112.3352, 37.9413], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞@VV@wVKnLVal@na掳n職aVJ聹Ulm聞L掳a@b聞@lx@bULUlmx@Ln@lVkn聞l聵@XI聞w聜K聞Vn聝掳aVXVx聞聝UaVU掳K聞nUl職UVL聞K脝V職虏蘑聜lnXalL脠脝聵L聞KUaVkUanmWU聶a聛@WwkUWU炉y炉脩@anIl@@aVU聞m聞I聞ymU聝LUUVakaU@@LmJkw卤L聛KmVUI@W炉聶VaU_l聶kbW@kK@m聝UkaV聛聝mVaU聶聝IVm聛alk聶W@wnIVy@klk聛WUU聸V聛I@聝聝U聝Vkam@knU@mmmK@b聛blVUX@VkLV`@n卤KU聞UL聝聜UnVV脜聞Ub脟KmV聴Imbm@k录贸@Ul聶b@VmV@b聛Xma聝K聛@聸UUxkV聜V@聞聛xW聞UxVnkVVJ@XnJ@XlV虏L脝聜VbnL@l職@掳聬"],
                encodeOffsets: [
                    [114503, 39134]
                ]
            }
        }, {
            type: "Feature",
            id: "1403",
            properties: { name: "闃虫硥甯�", cp: [113.4778, 38.0951], childNum: 3 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@掳@nb聞@lb@b聞b聞b聜@聞x虏al@lb聞KXU@m聜kUWkkmUU聝VwV@XUW聫@聶naVklKXblKnL聜聝nLVanImaXKlL聞a職V@U@KUKW聛聞al聝XK@拢WKXUV@VU聞聝UUVW聞_V聶@W@聛@K聞@職聝U聝聝IWmXUm聝UL聝n聶JkImm脻aUb聛L聝K@U聝Wk@mn聶U聝@kVWb聛@Ubmx@l聝zUx聝`U聞ULml@聞X聬Wl聝@UV@nk@U聜Vb@X聶Jm聧聶@@Vkn聝yk@聝z聝J聝nUV@bk@mJ@b掳脪掳zXVlVXx聜@職bXVmnVbUlVb"],
                encodeOffsets: [
                    [115864, 39336]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/si_chuan_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "5133",
            properties: { name: "鐢樺瓬钘忔棌鑷不宸�", cp: [99.9207, 31.0803], childNum: 18 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聝aXam聝炉wm聛@卤掳wUwV@UaVw虏K職聶聞U@U聝U聞楼聜a聞聝@拢脼聶么x聜Knkm聶X楼聶IU聝脻聫Uwlk掳V聞聧@聝脠聶聜KUwlkUyV鹿聞m職x虏Xll聞脩W禄職聧聞l聞w掳U艓聞n聝聞聞聵J聹聝l炉掳V@w么IV脟n聶nUll職L職聧V脟職L么录X聫W拢@卤聞聧@楼k_脟J聝kU茅聝k職聝聝wXa@聝職Llw虏聶Vx聞b聜m職录脠xlL脠聝聞VW脼n炉m脟聶脩U脻l脹kwl聫聛膲m聝ULmwUJ聶莽@wkm@脩lUX聶聝脩么摹聝聛Va聶聝U脩聞炉@w姆脫kbV聞mnU@@y炉I姆K聝V@鹿職a聝茅@k聞m脼U掳楼@a炉聛@anKlblU聞楼@贸臒莽@聫脟w@wk聧la聞莽脻卤k炉卤@臒脻U脹m脻炉w聝@kb卤聫炉akXW脺kXU脝脟U職陇X_茞w聞V@陇聝XU聜聝b聛U聝聨聝IUl脟Uk聨摹@聶aX膶mlU聬l猫UV@聞mVk娄Vx聛職@娄卤職炉聝聝炉炉anlW職炉n聝聝脜w@w掳KVak拢m@kl聝Kkn脟U聶禄贸K職墨laUaV拢聛@聶聶炉@脝聶U聶V聫聝脹脻脟X聧聝脟l聛聴脫l殴聞禄WU臒J炉拢mx聶L牡么聸潞X聬聞VlUll虏bl聞聛聞l聨聝x贸nn掳脻職U录mJU職炉n聝聝聝V@锚膲掳U母聶w聶@m聝@聫炉km聧Xam脩炉aUw脻KU楼聞聧m脜n楼Wmn聶聝鹿n卤茟茊脟么X锚卤菉n職聝聜U么l臇k葌V脪炉录Vn聝犬炉膧n茊聵蘑@聨k掳V掳炉蘑Vlk職Vxm录X虏聶艓@聨VxknW脺掳聬U聜炉n聶脝脻聹@`聞么脻虏聛脪聝聜脟zn聜mX@x聞猫掳K掳脜聞U膶默贸臇脻聞聝聵贸录脜锚聝脪聝bm職k@V聞聛聨聵聞@脪聛l@n膲脺聸锚聴x@臇ml脜聬聸J炉娄贸x拳掳脻聬m聨炉L牡猫聸膧@脝聛聞l掳偶聬聝聜職X@xm聨kV@z@聜聞聬掳bl聨n脼掳J@bn@脝录UV聝U贸聨贸L聝掳X掳脻L聝xUn聞掳聝默聝n@lnL@聨脝@職n聞K脝xnUnV聵In默m脝nx艓录膴I蘑贸脼@膴聝屁bU聝聜mV聧聛楼l聧k聝聜wnL聞m職脜脝楼X聝聵w聛U@w聜wU聫脼聶@alUU脜職聫U聶Vkkm掳aU聴掳脫掳w掳U聞聝聞b掳a職聛虏K聵炉聹臅聵@脠b脼聫膴a職禄聞XVm掳In聫聞聬聜默k录Vb聞a職J職么職拢V聫膴an聶聜k聞暖聶聶n聝脺U@anKn漠聜b脠m脝聨職禄nI聜茅聹拢臓聶"],
                encodeOffsets: [
                    [103073, 33295]
                ]
            }
        }, {
            type: "Feature",
            id: "5132",
            properties: { name: "闃垮潩钘忔棌缇屾棌鑷不宸�", cp: [102.4805, 32.4536], childNum: 13 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@l@@镁虏I@l聝聞VL掳wnJ掳U母聶艓猫聞Ilw聞V掳陇n漠聶陇脻聞l猫聞L@聞聝聞@x聞l聶猫虏么膴_膴摹V脠么J偶墨lbX職脝脠V聨kx脟V聝聞n掳聞娄脺b@猫@nn@@掳職U脠楼W脟聞_Uala炉炉U脟聶k聝禄聞mVwk禄聵k虏掳VxlL@陇聹_@x聜`脠聧聜臇枚b聵職@l虏alX聞a@bnK掳娄VK@nnWmx@nUnl@@l聝l膲聬k掳l掳UXkmW@Un職`k聞脟L聞聨W聞脹脠Vx職VVlVk@l聞IXb@ylX脠W聵漠聞W扭z聹y@職mI聝聨虏聬職J聜聬職@n聨掳@V聞聞J掳a聞脜@聝艓kV脟職k聶aUw聞KVw聶聶V聝聞@nkm聶@卤么k么聶膴J職录職In脩m卤nI職職脼聫聜X脠聝膴x膴U脠b脺y脠拢V聫kw@kVUV聶聞m@聧職a聞禄脺b脠m聝UXw脻x聝Un楼@聛掳摹聶脜聜a聹JVk聶aW炉脹@W楼聴U艔亩聶@炉聬kU聝艃@a職I@mmanw脼聬聜W@聧聹聶mw掳禄U艡k鹿卤W聞xVx炉娄U掳聝z牛W聶w@聧掳脟V脩k炉@聧聞y掳a職拢職@職m職nl录聞a職脻脻akwU聝卤a膲Iml牡n@聝m@kkV聝炉脩m聶母聶掳x聞聧l聶聹@聵聝XV脼ml脹脻聶膲U脜楼mw脜楼VaUw聸聶X聧摹聫聛聧膵aV暖脹殴lwU聫炉聧U聶贸聫卤聧聶x脹V卤炉炉n炉m膵聝聛Lm聬n膴m聜聶@聶_kJWa聛XmwU聝膲K聶禄聶@mwX脻聝U脟聞kK脟w聶禄聛n聝aUw卤職kx聶K@聞Wb聞x聶聞聞lV锚聞l脠Il`@娄聝聨@虏X陇W聬贸禄聶KU脠聶聨聶KkkmVm職U脠贸J@x炉Uk掳聸聞聴I聝聝m聞艒聝炉V聝x聝k聶聨X录聝脪kk卤W聶w聝nU潞VzklVx聛L脟職@聞聝聨炉UklVx脼聬V聞職JW娄n職ml聛L贸w脻職@陇聝聞聛b聝娄聞V@V聝V聶職卤LUxVbU@Vx炉x@虏n聜掳xn聞Wb聞b"],
                encodeOffsets: [
                    [103073, 33295]
                ]
            }
        }, {
            type: "Feature",
            id: "5134",
            properties: { name: "鍑夊北褰濇棌鑷不宸�", cp: [101.9641, 27.6746], childNum: 17 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@亩贸職Knw掳陇臓IXV聝录k藕聵脭k聜聞脠W聨脼脠聞脺U聬V職脜職掳@職職聜@U陇Vbkb聶默么L職录脠Vlm聞Llkn@l陇Ub炉L@x脝x聞聞掳mX聶mk掳b聞掳掳聞虏聶@楼聜聶Uwl楼nU@聝VUk莽V聫nkW膵職b蘑@l聧脠VVk聞J聞聧聜V聞aV聛聞W@拢聝U茝xW`聶拢脠VV脜lWX脹lW掳b虏聬la聞@掳xn脼V脺臓脼虏@l掳脼虏聝猫kbl聨@x脠x@聬臓猫nal拢nU聜脟虏@聜聧脼K聞nn陇@录聵掳U录聞nV聜職XU聜職bn聶臓UVbUlV職掳LX聧聞@lV聞猫脺UnK@_聝y聛XVyUwmIU禄V聝聞k脟楼職每kkV炉m卤n聛@聝n炉脺anVV脝聞z@聨聜b聹w脺b聞m@w職a@k聝mk禄@聛聶a@聫VUU贸聞w聵@nb掳m職聞X聨mnVb脼聨V聬么anw職J聜ak拢lw聞聵職L職脜n脻@wl楼聛I脟脫聝@U聶聶L聝录kV脟聝脜贸炉kVmmw@聝n_聜Vn禄掳L脜禄@茅脟莽殴墨V脟脻@脻臒U聶聝a聛V脻聶聶職炉姆l怒聛摹l聝@贸脼脹聜膵@炉nkU脫聞聴m卤聶IV摹Uw贸KUn卤炉聴K聸w聛禄聝K脻聬V聞nl@聞贸xUw牛聫聸拢膲聝Um脜聴脟脻聝K聶聞脻U聛lmK聝拢聛UV聨@脼脠聨W娄聞脪@默職nny聜@n脪m聹V聨聴录@掳Vbl@VlnUUwl聶掳a@聞聹聞@llnk掳lbnKW膧n聨U聞VxU聨聜虏脜聜m娄脹聧聸脟脜職聝aU聞Vb聛職@娄m`m贸X聧聶Umm聶x脜@卤脼n猫聶虏聶U炉禄m聶聝V聴m@w聝U@w脻職脻m聛L聝a@聞聶V脟Uk聞l掳炉聞VlkV聝娄U職mx聝aULU猫Vx@聞kIUxmWV录炉Vm脠炉職U聞nl聸脠聴@m禄脜聶聝VWx脜b脜臒W@k聝m@kVV娄mlnn@聜艒聞l娄脜脝聶xk聹"],
                encodeOffsets: [
                    [102466, 28756]
                ]
            }
        }, {
            type: "Feature",
            id: "5107",
            properties: { name: "缁甸槼甯�", cp: [104.7327, 31.8713], childNum: 8 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞艅lV掳聫職@艕牡聵VX禄脝U膴脩聹J聜w聞@脠禄m禄職拢掳K職k@脟n脩脝聧職@聞w掳JUwnw@w職bVb職@Vl藕LUw聞a聝禄聞aUklyUUVakwW聧XwW聝UxkL聝mn楼m聧職wk聶聵UX聶lJ聞w@a聝Ik聫掳X聞楼W聝虏聧l楼職aU聶聞Ilmkkl聝脠L@m掳nlWU聶聛aW聴職@V聝聞@UaV楼@a職k@脟k鹿聝K@a聶K@k聝Kk職脟X@VU@kx卤V聶猫kIWwUVUkkK脟@聝a@wkml炉@kUWn拢Wa聞aVwnaV脻聝w炉@UaWx聴n聸J脜聞UxU職ma@L@聞mbU聨聛U卤VVnkxU脝聶聞V聨m@k聬kKW掳聞X@陇脟Uk脝脟nU娄炉聨k聝mLVw脜K@U贸b脟脝聛V聝娄聶L@聜卤锚X娄mV脼職k脺脻nWU聴聞聸@k職聝聨炉w姆職n職掳脪U聞lln@@聞亩mnk膴J虏bV聞lx脼b聶脼聝bk禄聶m聶n聶@聶陇炉b聝z@聨l掳U脪炉脠@聨職x扭X聞yV炉掳楼Uw聝w虏Xl潞V艢炉录nx聸職@聨聛X脻聫mxnb@n聶J@b"],
                encodeOffsets: [
                    [106448, 33694]
                ]
            }
        }, {
            type: "Feature",
            id: "5117",
            properties: { name: "杈惧窞甯�", cp: [107.6111, 31.333], childNum: 7 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@Uxn掳聜bn聨lUn脪脝聝nn@n聜陇聞LnxlU聞職職V@聞脝l聞x掳XXxl`X聹聝VW聜聹L聵猫聴聞卤n脠b聝聨掳b@職虏x掳K脺录聛掳膲聞V娄lJnU@娄職脼聜J脼臒聞m職L脼禄職xU聞lb聞V脝ann聞al聨聞V脝聧X@ln艓V聞mU聶ma脜X聝a@aWm聹@聜拢@w膲JV聝kk聜kkm聝nk@聝mna@聧職al聧聞K職聶聜J@聛脼w聛m聜脜脜聝@ambkU聝聝@聶聶KU聛摹K聛U@m聜ak炉卤聝聞a@a膲脩脜aVw職Xlw聝卤聴聛V楼l@@a聶k聝聸聛@@拢職m聝聧膲脻贸nWV@聨聛n脻脟脟x聴Umb聝aVkk聫k@m聧聞聧@m掳聝脻媒Xm聸ak聧脜墨聝@@聝mb聛@@xm職nb聝@mx職聨k聬WL@聝炉b@WUXmW聹聧WKkbm@kx聶Xmm@LUl聞xl锚贸K聶nU職聞all聶L聝l聛L贸掳m聬炉JV職U聬聞K聞聞@x聵K虏膧么娄l掳"],
                encodeOffsets: [
                    [109519, 31917]
                ]
            }
        }, {
            type: "Feature",
            id: "5108",
            properties: { name: "骞垮厓甯�", cp: [105.6885, 32.2284], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@脝L聞聧膴x掳禄纽娄聵W聞聶職L脠聞@x脼K脺掳脼nVx脜膧l脪nJ掳a@w聞聧V炉l@X聫WknKnw聵V脠職掳XXa聵lX掳VI掳b聞W聞n職a職職職楼@聛聝w掳聶n@職y脝@nk脼@掳炉lJn聞掳I脠l聜U職lX脜@姆lUV楼VUU脻脼聶UU聝@Uw聝JUk膲m@媒聝聝lk聶WUwVw聛聧WJk@V聧UK聶聧lUkaV聝U聝mLk聞m@聝聝聛@U聝聸Ik`@聞聶UmlUkV聧炉脟XK脻_mm炉@U聧聝`kwm聬聝l聛录卤KV炉聴炉Vk卤Vk卤kzma聶KUn脟卤聶bk娄卤聨X聞聝娄炉Wl聬聞J@b聝xkIW職聴Vl職聶xn聨m娄聞nlKVwX聞WxX聨lxUbVVkzVl聝b聞录聝bVx殴KUk聶@Ua聶a@xmxVx炉I聝x聶@脜聨m脪@脠聶l炉L聶陇n录"],
                encodeOffsets: [
                    [107146, 33452]
                ]
            }
        }, {
            type: "Feature",
            id: "5118",
            properties: { name: "闆呭畨甯�", cp: [102.6672, 29.8938], childNum: 8 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@ln@x職猫VInxVKn聞聜膴k聬lxk脺V脼職脪n脠m掳nx職@職录膴LV聞nx聜WXblI職`職@n聛m膲n聫聜K膶聞么脜l聫U脩mU聞K虏鹿@聫脟脜V脫脜炉V媒脼W聞聬聜UVmX聞脝bnw職KU每聜聧聶@UmmIUb炉楼Uw聝聶炉聶脟m職聶聞莽manUm禄UU聝l聴k聝陇聝a炉bV聶U_W臅聛m脟脜職卤蘑Ul聝U聧l聶脹V聝莽kU聝@W聨炉KU聶VkUa臒Vm職聶aV聛聶WU聛聝mV禄聴炉@禄m拢聝m脻L聛聨卤@聛脠mVk陇mb@么聝娄kVkamL@b掳聜@b炉娄脻V聝n@l聞锚聶b@潞聞U母L掳J@zV@nmU聝la母脭@x聝掳V脪職聞Ub聞聜贸蘑聞脪W職kV@脪"],
                encodeOffsets: [
                    [104727, 30797]
                ]
            }
        }, {
            type: "Feature",
            id: "5115",
            properties: { name: "瀹滃甯�", cp: [104.6558, 28.548], childNum: 10 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@Vl脠nl聜XnWLX`m聞虏nV聜@b掳x蘑莽ln職Vm聜nn聞@@聞掳聜Uz職lV掳n脼聵脪kxl聬聞w聞`UnVb聞m職L@alb脼K脠脹職m脺录掳@X脟職聛@wmW@脜聞K膴L聞lV聞職LV聫艓莽脼L虏卤聜臒kw@聫U聛聝y@鹿lKX聶lKVa@w聶聶膶@聜w@聛聛a聵脟U炉n聶@聫@w摹ak聴聶a艒聜聝聛聝K@聧脜禄VakUWm姆wkb臒楼mL聶ak職聶@摹脼聝掳炉xVV脼@V聬職xV職聴VWx聞XlxU聜聶@k虏WV脜聝ULm猫ULV膴kl臓聞V聬聹JVx卤n脜聝炉娄mw臒@m聝聝l臒kkl卤@k職Uk@炉卤脟聶K聝聴kxl陇聛b聶Imx"],
                encodeOffsets: [
                    [106099, 29279]
                ]
            }
        }, {
            type: "Feature",
            id: "5111",
            properties: { name: "涔愬北甯�", cp: [103.5791, 29.1742], childNum: 9 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@k職V聨k聞職職脝k職V虏Ul潞脠Ilx聝LX猫脺lU聞聞XU聜mk聝bV猫聞x掳@聞聧@录掳Knnn@m聵脝IUbnJ@bVI掳b掳卤@聛nK@mVakk聝Kl炉nb職m母聬聞猫l@Vn脠l聜UUw聞wmwnm掳楼聞L聞聶lLn聫U@Va聶Imbk聝mK聞聧聝聝nk@m聝b聶聝聝LV聧聞JVUU聝聞VnkV聧mb@a炉JUa脝kk楼聞IW楼聞Klw聴脩m脻U炉聶kVy炉聛@聝聝@mmn聛聶Ukm摹猫炉w@aU聛卤mn聝W_XKWmk聛脟mUk贸bU聫脻聧UanmW聧聶聝炉nma聴@聝xV么UV@聬職b@聜l录聞n@l聶b@x聝n脹a聸x聛a@聧聝yU脜mU脹bm掳@聞m聜n虏U掳ll聶膧脠娄聝lU聞V录nJVxUz聜W聞z@`mL"],
                encodeOffsets: [
                    [105480, 29993]
                ]
            }
        }, {
            type: "Feature",
            id: "5113",
            properties: { name: "鍗楀厖甯�", cp: [106.2048, 31.1517], childNum: 7 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@脠虏Vm職Lnblyl虏虏UUl聵掳U掳虏L聜禄聞kn聫lx聞_V聨掳@nn脼`WL掳脠U聨Vlnk職V@聝l_聹JV聞聜@聞聞n@l聝nKV拢聶脟職聝聞UV炉職m聞@laX聛聵U聞聜UbVx聞@Vk么JU聛掳Jn聶@聶聜wUk掳wn聫U聝V_nJmknmm炉Vwk炉贸楼卤每聴L@w聝聝聝LV聫U聶kU聸bX炉mykI@a卤Kk娄ULmaX聝聝Vm炉聝K聴z卤聝klUIVb脟J職聝kL炉聶l聶聝U聶每聶U聝lU聛kJ聝Um聨UUkVVklKk@@a聶U@聞聶J聞虏聝x聝娄k默@录卤潞XnWb聴x聝U@x聝x@l職L@b聞Ll潞@脠聶l@bU娄Vb聝@U聞聶@X聵聜bV職kX炉m@n脟Kk聞llkn聝JV職"],
                encodeOffsets: [
                    [107989, 32282]
                ]
            }
        }, {
            type: "Feature",
            id: "5119",
            properties: { name: "宸翠腑甯�", cp: [107.0618, 31.9977], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@V聞U聞lbkV職聨VLU聨l@XI聜聨UxVx職Xkl聞聞@镁膴nVl聞IVx聞@VV脻職V脼UVU娄kV@母W脝么虏職@V聫脼n職@Va么b虏W@聧聜K@聧XUm脩UW掳炉掳Ina@y聞_lWn录lLUb么录聞Kla@聶nkUy么聴脝x掳@職聫n拢聶脻@楼mVkIU楼膴聝聜炉脹禄炉L卤w@聶炉a聞聧脟a虏m聵聝聴莽聸KX聛聞UW聸k_Ww炉W聝w脜k@聝聶U聝聶kVmw聝K聛拢@mmm脜聞m脩kVm聧聛amnnlmIU`V聞m聬炉xVl聛x@職m職炉IV聜贸IUl聝@UwVa聝聛聴VW聜kb聝@聶nU掳聝V聶聞職脠U陇"],
                encodeOffsets: [
                    [108957, 32569]
                ]
            }
        }, {
            type: "Feature",
            id: "5105",
            properties: { name: "娉稿窞甯�", cp: [105.4578, 28.493], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@VVXwVKn聞聵wnV聝n聞l@b炉xmKUbVn掳掳X掳@blL職猫nV聞@Vn聜l@U聞LnmmUna聞VV_亩V@wnJ聞聞l@@kkKV贸laUwnJm聧聞wU聧lm@a職聧Ua么KV聛nJWb脼職@V職wVLX楼VV職_脼`職w聞聧W聝脼殴mmnIn楼W聝@k聞WV聧炉@聝掳kI聶聨聝Lk录脟@k陇卤Xk聵聶nm脻炉Ul脜脹KWV炉k聝lUwkL聝脫聶@U聴@聝聜w@摹XV聞聛聵WX聞職@UbVb職聧V聸職_k脟V聶lU掳lnw艓娄脼a脝炉nmm炉職U聞聶m楼nkVmk聝l_贸楼炉U脟l炉@聶聝聶L聶k聝`炉聧姆LUy炉@mw聴录姆掳摹_脜聶U掳ml職n脟VU脼職聞@聜聝職聛_聝JUnV聜UX職bl聵蘑b@x@聬m職V掳聴脠聜b@聜聛x膵@職職@xUbkLW職kL@潞聞zV聜@聬lx聛臓卤虏"],
                encodeOffsets: [
                    [107674, 29639]
                ]
            }
        }, {
            type: "Feature",
            id: "5101",
            properties: { name: "鎴愰兘甯�", cp: [103.9526, 30.7617], childNum: 11 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@掳n掳m虏掳脺U職w虏聨么聬V職掳聨V聬kx脺藕U虐膶b聜聨蘑聬la脠L聞禄聝聫@k聞wV脟聜@聞聝n脹脝禄脠聶U脻掳Kl_聞V掳U職`Vbn@Vb脠L職aVU@聫屁禄V聶nIl聶職UUa聞卤lIk卤職@V聛nKm聧脜@Wa聝K聛娄聶lV聬艒職kK聶聧脻@maX脟mw炉IU聜@k聝V聝wUmVI聝聝聝莽聴每聝U卤聨脜@炉脠@x聝K@w聝LUb脟K脜聧@m脻拢@y贸U贸贸UxkI@WlIUa聝b聝a聛聨V膧聶Lmx脜aW聝Un聛V聝聫脻XU镁脝掳U脭脠脝@聬卤潞聝LnVV脪k聬贸脝"],
                encodeOffsets: [
                    [105492, 31534]
                ]
            }
        }, {
            type: "Feature",
            id: "5120",
            properties: { name: "璧勯槼甯�", cp: [104.9744, 30.1575], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞猫聞聞UJVn聞x聞U@lV聛掳JnxW脠nb脼@職聨lL艓聶U聫職k聜楼聞LXb脝@n聨mLU聜@zlbXmlnVynL聞莽職JVb聜Un贸mUnamU聞an楼lKV_虏aValW么聞n@n聝聜bV聛聹K掳炉VblW@kk聝lUnlV拢掳W@w聞UXk掳KVw聝mV聛kwVyVI@wkm聝V脜_Umm@U每mbk拢聶xUaVw卤V聛录V陇kLWxU@Uk聶b聝y聝X聛職贸m聝掳V@@z脻脪kK聝n聶卤U@@_VVk聝脟aVwnLWa聛lm@@kkVVl聶娄kIV`卤n@w聞K聝聝k虏聶a聝VUUV陇聶nkxmUkVWVnLUbVb聝`kUU聞mLU聜mX@`脜b脟職XbWLX聨聸n"],
                encodeOffsets: [
                    [106695, 31062]
                ]
            }
        }, {
            type: "Feature",
            id: "5104",
            properties: { name: "鏀€鏋濊姳甯�", cp: [101.6895, 26.7133], childNum: 3 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞b聜K脼n脼聶@x聞V@x聵n聞Un職掳录職V職卤m莽虏脻脝@職wnn職VW聨n么n_@楼聜聶UaV聝聞b脝聶聹脠脺聨n楼脝聛聛卤V聧UwV聝m聧X每mLkal炉km@k聸聝@聝炉bk職VxmVUkk@Ua@炉聵禄U聧n聸m脩聛@mz聶m@墨聝脩X楼脟聧@脻聶xU娄聝職脜聨脟Ukx@職lb聞UWVX聞mV@x牡臇卤@@聨炉xU職脝Ln脝m聞職x@nXL卤lUUVw聛KWak@Wxkb職脼聝聨膲bUn@聜聝@@x贸娄聞艓"],
                encodeOffsets: [
                    [103602, 27816]
                ]
            }
        }, {
            type: "Feature",
            id: "5114",
            properties: { name: "鐪夊北甯�", cp: [103.8098, 30.0146], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞職Vx掳娄VanJVn職@聞b聞aVbkJ@XlJVw么么么V@z脼陇@n脝聨脠LVa聞K@x聞L@w掳脟脝@虏聧聞V聵膧聹mW聧XKWa脠聶脝a@_nWV聛nKV聝lV聞_UaVamKXUWwnmmw聹脩m拢@ynU聝kW聝膲UkWVkkV卤莽kJm聬kK聝職聝K炉娄mnnx聝xVx聛V脟kUmk@聝莽姆聫聶nmak掳聞LllUb@nmL@聜炉虏炉aUJ@amIVa脜Jn聴m@mm炉L@禄聝聨炉@聝wU莽聞anlV聛聝WV聝脹kW莽聞Kkw脟Jk鹿卤V聶U脜l聶聶摹V聶虏脠脝聜nX臇V`U職掳a聞b聞拢聵l聞kVVn录mVnb聝猫聶職脠n掳職"],
                encodeOffsets: [
                    [105683, 30685]
                ]
            }
        }, {
            type: "Feature",
            id: "5116",
            properties: { name: "骞垮畨甯�", cp: [106.6333, 30.4376], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞VlIV聜聞k職V職膧聞Vk職掳職lK聶聞脠IUaVJlk虏聞聵y聞Ln掳聞UW聞nbVKl楼虏L@blJnzW掳聹alV掳In聫么炉聜K聞k職Kkk聝bV聶職m么Lk茅聝wVk@Knn職Wlwn@laXL聸聨nXVW@X掳a@聞XKl聫聶聧nw聞@man聶@w聜@na@聞聞@聝w聶臅摹摹聶wU聧kUWb@mk@聶娄聝楼mU脹b卤y脜n@bml@聬kV@聞聝lknVbmVnlm職聴b脟k炉bWyk@V_UamJ@I聴@Wa聝VXamIVWkUkbVa聝UUx聝@VnkVU录聸bkKUxmK聶聞聛@W職聝xnV@n"],
                encodeOffsets: [
                    [108518, 31208]
                ]
            }
        }, {
            type: "Feature",
            id: "5106",
            properties: { name: "寰烽槼甯�", cp: [104.48, 31.1133], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@nUW楼虏茅@聛職K聞楼聜U脠脜么a@V脝LUxnKl聞掳聧V楼脠ml脜脠V@拢聝WX炉lLl聫n@U聧職聝V脜lwUm虏U聜VV聧na@聝@KnbV聶Vw脝聝聹I聵mXwW聝kIVw脻臅聛VUa聶I聝猫mKUzkmWnka@y聶@l虏kJ聝虏Vb聶Vk職mJU職僻录@聬UV聶b脟KUam@Ua聶_炉V聝Uk`炉LV脼脟職脜录m脺聝聞聛@U脠聝x@l聞聬聝录脟KkbW聨聹職VxUb脝娄nx脝娄膴V"],
                encodeOffsets: [
                    [106594, 32457]
                ]
            }
        }, {
            type: "Feature",
            id: "5110",
            properties: { name: "鍐呮睙甯�", cp: [104.8535, 29.6136], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@虏猫lUUllX膴VX聞聞lmV@zn陇聸脪nxmnXxlUnVlw職mU拢VV聞U職bl卤聞聞聝L@x虏mU_lJ職楼UklU@ln@聜kXbmKUx脠bl聞UU@`V@職虏聞mlL脼脩@yU@聞炉么n聜聶聞W聞z職aVlV@XwlKU拢聜禄聴aVaUwm@mwUVUwk聝l聛V脟虏Ll聝聞KV聶m_@y聛kUm聝@mU聶莽kKmxkIU聜脻聞@LUJ@n卤聞k潞聜LXb聶录@mmIXa聶@mamnkW聶聬聝KU聝聝x聝_U`UklwUw聶mUb聝V聶虏聝akb聝mkn@`聞Um脪聶職VxUb聶I聶`U聧聝a脻脠"],
                encodeOffsets: [
                    [106774, 30342]
                ]
            }
        }, {
            type: "Feature",
            id: "5109",
            properties: { name: "閬傚畞甯�", cp: [105.5347, 30.6683], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@脼臇UxlJX聞Vb掳@聞xU脼mbUx聝bXbm陇VX@lk掳ln@x聞b脠@lLVlVUXxlJ職莽虏UlwV@@U脠Wl聶聞L聞w@w聞V聵wXaWm虏鹿@禄l墨聞楼聞w聝卤職I@聝職V@bl@kLUllUVVn聧@mmU聞wX聶膵bVb聛@VUkbmam職聛W@k聝a@聶聶k@聝laUa聶@炉b@聧職mmw贸@@lkXUa炉掳聸LU聜聛am聞m@贸聝kXUb卤bU`kLm娄聝bnVmbnVm么"],
                encodeOffsets: [
                    [107595, 31270]
                ]
            }
        }, {
            type: "Feature",
            id: "5103",
            properties: { name: "鑷础甯�", cp: [104.6667, 29.2786], childNum: 3 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@lI脼脟聞bV聨職_職JVaUw職聶n脩聝V@_lm聞nla聞b職卤聞UVa職nVxkxVlV_聞`聞wV聞聞L職聫lXnmnb職@WbnJ@n職禄Wa聛Kl鹿虏聝@mVI@K脼聝V聛lJnw@aW炉炉炉UmVanL掳w@a聝k聞mmU聴xm聝ULWxUU脻K艒猫U聬聶KU聝聝k膲K聝L@脝nX@x聶聜W脠炉@脹禄聶n脟脺脻Lka@b聶K聝nUaVm聝_聝xk聫聝LX娄聝Jl娄脜lVb掳I@bnaU聨ml聝UV聞UV聝IU聨聞K職聞聞a@nml聞聞聝聨nLl聞na職JUbV@"],
                encodeOffsets: [
                    [106752, 30347]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/tai_wan_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "7100",
            properties: { name: "鍙版咕", cp: [121.0295, 23.6082], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@\\s聨@pS聛}聺aekgKSu聶聺SsM脽`隆CqZ路be@Q^o@聥gieMp聥聣]}聲}慕c_Kk聟{聶霉聯聺A隆r聣[uom@脩聧磨Jiq漏m艍q炉Bq]脵YgS氓k_gwU颅isT聛E聟聯聺聭臅iqiUEku聺e_聣OSsZ聥aWKo隆聫颅q聯yc聛Y拢w}聥末聶臅S搂Z漏S聶N楼SyL脩隆卤Ks^IY聣Pd聝Y[Uo聠Fp}麓\\卢\\j]聢e脺聧貌聥陇隆聳膩聽a\\bn聶U茫潞鹿脤s录j庐[c铆葓E聨臐膯`募f露聤庐K|V脴D聛dKGpVnU聜FjpH聴F`聠B聮[pM潞x脰jbp脦xp聙卢聜|脦鸥脺脪C聤虏庐聜脺Ap聞ZG~聙聤d聵脼脿V篓|赂聙`|聦虏tx~\\~|dFf^zG聙膭艢h聹dL\\h母聻录聠聤O陋P庐lV`p\\]Xpll聵忙陇聹CpQ|oF}fMRi聠NSon_虏q盲m聹M聞NM聥\\聲"],
                encodeOffsets: [
                    [124853, 25650]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/tian_jin_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "120225",
            properties: { name: "钃熷幙", cp: [117.4672, 40.004], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@EUDAEI@WNMNCBFAHFFNACDJDPBD@@GD@DIFFHEFGDBDEQOFG@EI_KG@OcJQM]RMEKBGPG@[LaCIICBWK聛CEEG@WBQHCDFD@HSLEJI@IHWECFGAAEKCGDBFCBSBIDCKKHEADMJMFABKOKEQAA@IEEG@GIQAEK@OZEESMOL聯lu@SLUTYFQCMG@@SQUAYKAACA@IB@BDB@B@DC@@BGAEFAA@BEGKJCC@AGAIHA@@JC@QEIP@@A@EGIDC@O@C@@@@CJCWKABFLBBEBSQGBAAMIEM@AKBcJEN@BEBCFMAEFEF@J@BG@BFABECKFG@AFQ@@F@BEB@@A@@AAAKAE@GFGDECEFEECBKIKDELDFEDYH@EIACDCHKBEB@BAAC@ADBHABKJIAIJICEDGDCD@@A@A@DHCHJHDFEFGBKRKBGIK@GIMHSBCH_BOJECCJCFKKMD@DNJEDEGC@OJCJHRUL@HRJ@H[DCNKDZHCTFDHCFFKR`TANVDFZRDLFARB@HPAPG`ILAR@TERNDFNHDLCLDDCXDYbHF@FEB@LDDVE@JPNfXPINCVDJJD@NJPAJHLXHDNANHhB@DPNLRMTBFRBHHr@`NBFEBOCCBIAQJDHCHLHFA@HSDCRLFTB@HEFLNF@PELBDJALFLTC@EPFLLP@tUHQJDfIHGTB^JTCPDLKAIBATFPADIEGECEMJ@JIAIHGECFEAGDI\\SPOXAFCL@BQTQBBTMZECYGAHA@GJAE@HCAEME@IECFKJADDBABLTHHG@ILEAMNDJCDHEBF@@JNFJELDFKTOT@JETBFFHBHEHKI@@IJEJ@XKEOUMS@AF@CEB"],
                encodeOffsets: [
                    [120575, 41009]
                ]
            }
        }, {
            type: "Feature",
            id: "120114",
            properties: { name: "姝︽竻鍖�", cp: [117.0621, 39.4121], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@FW么碌@IFCLIB@EHNBp]AGEAKAEDMGZKFGBGME@ILGP@HEFB@BXMEAHUGC@IHCLOD@X[NWHWPKAEF[@EKIOL@EKGBNMJ@EIEHKBIC@BAKMIACCFQZCF]DB@ERAKADIHGEIBCGIIECFaGLZO@EFCNGAGDGAKL@BMG@IE@ADSDEH[JGC@CGA@BMDeK@EIACFE@@GG@FIAMM@CCGC@EM@ADE@CFMAAGHBDKIEAJG@DOGCDEKAGIS@KFCHKAEHIE]BeKNO[IFIOELC@A]GMBKVYCDDgGAICARc@MW@AQE@DGI@@AQ@@BKBAIQQYEFW@CEADIGGBCEIiMEMF_LGEKMBBDWEBGRC@E_CHYGCH_IAED@FFBQh@FGJaJ}AHRAREF@bE\\C@CT`FHC@\\BBF@BID@HGDDJ@@FAHKBARECKDAZBJIVNHCTA@EREAMLHDAFFBVFFC@RNRETHD@FOJMACH@CAB@P@DF@@FGDWE@FFSIEMKQDYCCHKb^JADOCIDGNDBdBCFJB@EC\\A@BJEA@JAAAD@HHD@LFBCFF@BERDHNhZQHMBGHOACCEBWEGD@PSJKCGEUD@CINLFGHE@AJK@HDABBHTB@F`DBFLBBHEDARCFG@ABJBAPVFE^FBGLGCFG_BMLEXGAAFE@@JNRVJHFALFBEHQJCTbNDHCF@PlFLJSXCHFHfVBTNJ\\BPJXC^FAVNFCHFB@FFH@JF@\\ABCFD\\BDMCAAJKQBGAILOEGHILECQLWFENJHADC@QxNHFJNLDFA@CBA@D聵U脗mR@FBL@BD"],
                encodeOffsets: [
                    [119959, 40574]
                ]
            }
        }, {
            type: "Feature",
            id: "120115",
            properties: { name: "瀹濆澔鍖�", cp: [117.4274, 39.5913], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@TZbB@JHD@DODCLM@AP@LL@BNH@ETFN@`E@DNG@CHLBCJA@AICFKDDBKA@\\N@AFNAGRBFjFFFL@DHLBLFQPcXAZMJ]GAVHAIZJFNE@JpDRRDCLFDGXA@EFF@CFFPDfEBDB@DCHCFCJDJIJBLI@I@CB@@ADBB@FALADGDC@@H@BB@FZGFCCE@@FMLALJDAFFFEFDFCB@@AHCF@L@@BBB@BB@FC@E@@R@BEL@HEFD@G@AH@AIB@@@FEFEBALDDEFAFO^IF@JCBBFPNJJ@D@PRDCEKBAXL@BIFD@T@JE@BHHJORFDI@@B@JGH@@B@BDDLIFFHCD@D@DEE@BAAAB@DAF@B@H@NGLJLMRDNMfGIEPMI@GDAKK@KIDIJ@GE@CFDN@FE@GFEPGV@TCDFKHBBF@RW@DD@@ID@TJFKIKLI@EP@IGBCLAEKLEN@KSHIGYACSD@SEAMBBMGEBMQBCMIGKFB[D@HDLPHDBC@IFITDLG@IIIFGVBNJDLN@VIRI@YIAIHIC@CLKZCBEE@JECEIHEAKGDGECBGEEM@@DA@CCCBBEGA[GEDBBoNAAH]MKiIAWKQoIIPMFQAEEDMH@FMSUYIeF@EK@BIOEKJEBICFKaKP聛FAFSE@LWCCFMHDDEKESBOGBKIEIODLG@CCDEQCEDWEMDIEIB@EHGEEDAEAa@@HqDEJGF[AECCFa@WCEIKAAEQB@FCAE^YDERDDJBLNABD@AJGLJF@FNIAMLH@FPKLJ@FE\\BFOLGXMXW\\C@KPGD@JHDGVFBWN@AEAGFO@KH@JNFAHEHYLNHFCLBFBBHo^MAFGA@KJED@J贸露EX"],
                encodeOffsets: [
                    [119959, 40574]
                ]
            }
        }, {
            type: "Feature",
            id: "120223",
            properties: { name: "闈欐捣鍘�", cp: [116.9824, 38.8312], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@NGFMDATCNDR@CCbINEHNJA@C\\EEGVE@IhE聳[聵w聰epc垄路虏聸^QEKIEKIgiQDkehY拢uSDBMkUDOJDHC@GF@CAFBFEN@C聥Q@BeP@@G@HD@@MHQKi@[IGCOCESE@GMA_OcCGDu`a聢@VZzKDkJBLNXGDqKEWE@cFEFA@聝ISIi@@KMABJGBcMuFEzGVH\\ATSEUBeA聛LCEMG@CEBUHUCGXaBPtUBBFIBFTDFF@DDKBFNGBJPHXDDMDCLJ^mBIHIL@LR\\@LCR[@@z@NFD@LLBNb@RHDBNTPT\\F@BJF@BXCFBHHBDLFB@HODADE@@JHVXCPDHCFTLBBFNCDCCCU@@GAABEHHZHBCAEdEjFDD@GfD@DXFCHF@ERFDLBH@"],
                encodeOffsets: [
                    [119688, 40010]
                ]
            }
        }, {
            type: "Feature",
            id: "120221",
            properties: { name: "瀹佹渤鍘�", cp: [117.6801, 39.3853], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@BFLBFJXDb@DEFD\\BHEFIrC@Gb@FBCBFFGH@FJAJFNCXFFCRDCFDDH@CKJPJFALPHTALFCFGCENDDKXF@ETEBO聜bLELJDFALIPFAJL@@FfEZJTVENG@CNFFRBNEJOpJLRBXjJNLG^BBpMAAFC\\HHBAFDADDB@@CN@FFAHFDCHLHFBJGFCFUNKJJTD\\XUXF\\^F@DDDQXXBRLRCBDFEVCDLVDpUl@LEDJHAPRFGL@CETGPBTCDDVI@CFF@GFDCCVGLKEK[Y@MECISG@BKNSCGCKWEAaEBEKNGFSECO@GGM@GYI@D脜CMLHPTF@DJHAVVNKEGDETJ^[TJNNd@NOAMFYJ@@GFANDPEJB^aOadSTQSI@MHBDIEOKCG@EEFCKCqXO@@DMFENCDDHCCGJ]AKFoDaGGHYFDHKJiCMFGC@EQ@AEHGAC@IEAATKOHGIC@IXIFEo聝GE[JCFCDHNmRADFZMF[EEBMO{GU@AOW@@]ZeHBDEHBKEfQkuIWBs聡@EC@d[@[^EDMTKCEEcI@cDAB@FCBCACmOCG{PYHeBgPwPFDDALFFFCHQGSD@BHFAR[TaFYXMASUiGFL@DQNCJI@@D@PLDN`ETEFIGMCGBCE聭~CAIFDPEHGEQPHJADFJGHCJLB"],
                encodeOffsets: [
                    [120145, 40295]
                ]
            }
        }, {
            type: "Feature",
            id: "120109",
            properties: { name: "澶ф腐鍖�", cp: [117.3875, 38.757], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@JFFL掳_`ONJKDDFIFZN聽xlb~yFVNR聦rdJGzDPVFBCTNND\\UR@E`F@@Ip@IWGUoawOEE@脧DgK{陌EEMF毛C聴b聟聶@聴KwOCDHHKBDJCDEEEAGHOABFABMCgDLSQ@CFEB聣MgYIDQINE@AUSwSAdYEHQMEyK[KI@GRMLE@@OqOoBOnpJ@BmEAFHL^FDB[C@BBDVFAHFJENB@sNEjQAMYsUgCSBGDJH@\\LjGR@NC@@G@HO@AfR@D聦M@EFEADBE@@HGDICCPlVANTC陇vgZlfRChjLJ"],
                encodeOffsets: [
                    [120065, 39771]
                ]
            }
        }, {
            type: "Feature",
            id: "120107",
            properties: { name: "濉樻步鍖�", cp: [117.6801, 38.9987], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@|ODHnPBDADEDA@CB@ddJFFLDNSFC\\]\\@@cFD聢@nACOMW@M@ITURBRZNHNWRQ職oO聲j陆f聡cq聼AqeiD每脥y脫寞FL|Ch@脨FFxPpbHVJXo@@JCTR^BPABQA]^MB@bE@@FQBFVJRH@FXtPNZSBAja@@N聝DT聨LJrQTHFXZFB`"],
                encodeOffsets: [
                    [120391, 40118]
                ]
            }
        }, {
            type: "Feature",
            id: "120111",
            properties: { name: "瑗块潚鍖�", cp: [117.1829, 39.0022], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@LHAHRHATh`LHNHDG`HDGZ`D@FQDAHXFACNAFLVRTBFOfHDCVBFQH@HSXHEPFB@LDBF[bDbLFKJBFLADBDjLvCPEI]FGEIGCBEUSjcFiBIVWfaHCjN^HtwBBFGPBJGjFBEGECGDONMFAP]TDHQOWCMGAMHKIJEIGQ]aDlUG]VGEGDC聞{PEbBZmE@@GH@BCA@FMQCFMYMJECELCMI_P炉`]R卤聹隆赂od聯f聴x聲\\gF@JUFFH[F@DIBGMMFaJDDQ@MCSDCBENMH"],
                encodeOffsets: [
                    [119688, 40010]
                ]
            }
        }, {
            type: "Feature",
            id: "120113",
            properties: { name: "鍖楄景鍖�", cp: [117.1761, 39.2548], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@ROHFFGCOJEDB聮}DFHANDJHFEFSM_KC@O@CJ@DIRM@CEKKA聟L聟FKACHoLSJSIBETDJaEIIE]E]K[MYUYQILC@GF[MGNKEK@A@BCWECAIFEFYAGFOMI[OFuDiKACBCEKIAELaKaCE\\CA@KEAFOWGGTG@ERUACDeGEPSAUQKHE`FNjNFJADHHCJFB@DEXZFRRBJLA@AR@@BJ@CHF@BRX@@NQdDBBJhHCCZDLUNA^H@BKDPFEJ\\JMPfL^AJFFGLBDGLET@HJLBCFHDCPH@BIJFCLGABHNBDEF@BCN@@FHDDDN@BNEJH@@HF@DEJB@FfLNC@AHB@DHD\\IFGTCBCF@@JNH@ALKHBHCHBDMFEP@KYbHDEJF"],
                encodeOffsets: [
                    [120139, 40273]
                ]
            }
        }, {
            type: "Feature",
            id: "120110",
            properties: { name: "涓滀附鍖�", cp: [117.4013, 39.1223], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@ZV\\N^L^FJFFJIbSCAFTJTIpKDGLB聠E聠KLBjHTVNBZWbE\\SBQGE@ATCRHDGEEKECBECxOhOfAZGA_YEEWSGqRKIS聧聞C@Mb@BiTAMYsOEWG@IQEURA@EF@@acUOXQRYCUDCHDTEF[SUEgAYDcVGJM`iAWDWLQRMHUHgDsDBLHJFCFDFGHBFFVEAGHCJN@RJF聡PIhBD\\FENCPWA@LFBAFHBEJUEARCDIAEDQBRNa^"],
                encodeOffsets: [
                    [120048, 40134]
                ]
            }
        }, {
            type: "Feature",
            id: "120108",
            properties: { name: "姹夋步鍖�", cp: [117.8888, 39.2191], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@LMEI\\MTABKN@FCDMH@COAcH[Ao膿A聶M隆Wa[Meq聫聶pQRMXMGQYQASV@J@NNXDPmBAtJXlveRLFGACFGAYf@^X@BPV@|HNPFA\\FNEEYBCnQGMDCDE\\IHFp聞EFWJ@JJDGHLPBSFB@JBDGHBFR@@FHDNEjDLICGZEHGbHpCLE^BHIDDCGDCFMNE@CP@rWLDEDFFH@"],
                encodeOffsets: [
                    [120859, 40235]
                ]
            }
        }, {
            type: "Feature",
            id: "120112",
            properties: { name: "娲ュ崡鍖�", cp: [117.3958, 38.9603], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@TLv@CNHFFBHGZFETNPhCVGNGRQXKXCjBN_HIdUZChBVF\\TFECSDGVCZDRQPWdVNA^]RBBAAOQ]DSE@F_Q@[VMCSMADUECOHycI聥qMQEU}zka聼wENRDENB@ADG@@HF@YnaAOF聝|CDFHUHH^kVbCR^JHIFLJNGHBDNPXGRSCO^EBMNCPDHHFAFiEIHOAEH"],
                encodeOffsets: [
                    [120045, 39982]
                ]
            }
        }, {
            type: "Feature",
            id: "120103",
            properties: { name: "娌宠タ鍖�", cp: [117.2365, 39.0804], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@d@hZNFdcLYXKRCtCMOFSYEGHEAGEDMu@SKAAsx]GMTGt"],
                encodeOffsets: [
                    [119992, 40041]
                ]
            }
        }, {
            type: "Feature",
            id: "120102",
            properties: { name: "娌充笢鍖�", cp: [117.2571, 39.1209], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@ZBVFFIGABEEA@KXBDOFM[EACJg聢OIE@QIMGDBHUFEEGAEHECEDGIAKQDWLKZcdQPEP@FOFBJTJ@HNORJf@DBCN"],
                encodeOffsets: [
                    [120063, 40098]
                ]
            }
        }, {
            type: "Feature",
            id: "120104",
            properties: { name: "鍗楀紑鍖�", cp: [117.1527, 39.1065], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@NMVDCG\\E^B@HlB@YEDS@C聟HsNSiMGDebUXAJEjidVTAFHDFJ"],
                encodeOffsets: [
                    [119940, 40093]
                ]
            }
        }, {
            type: "Feature",
            id: "120105",
            properties: { name: "娌冲寳鍖�", cp: [117.2145, 39.1615], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@DBXFADB@L@LFHM\\NHED@JKZRb]QMRAFCJBDCBQYADMCAe@QIMP@GSIAIPE@E[EGH@ZEF]^HJAXK@KF"],
                encodeOffsets: [
                    [119980, 40125]
                ]
            }
        }, {
            type: "Feature",
            id: "120106",
            properties: { name: "绾㈡ˉ鍖�", cp: [117.1596, 39.1663], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@J\\PNHEZBFEJELEL@BWGI^]FEkA@G]A[FDHUCMNEHJ^"],
                encodeOffsets: [
                    [119942, 40112]
                ]
            }
        }, {
            type: "Feature",
            id: "120101",
            properties: { name: "鍜屽钩鍖�", cp: [117.2008, 39.1189], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@D聠T@FCHG\\FFOROMEgYc@"],
                encodeOffsets: [
                    [119992, 40041]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/world_geo", [], function() {
    return {
        type: "FeatureCollection",
        offset: { x: 170, y: 90 },
        features: [{
            type: "Feature",
            id: "AFG",
            properties: { name: "Afghanistan" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@唷囐埮惽犣惻队偸氌厩屍€虤袉桑湿掖M賵钳什墓貙藪税菋藮溪詧i偶努臉秃尾虉覕葟臐时湿隆媒鄯酮藷虋前蠋膴约蠔讉脳啖€A片蕥缨磨褟乒啷黔荧位趣危莫谢谢螞聳蛻沙獭邲聙挺謮諚蓞违詴虏詪汀煽坛镁贊艐臒苫爻D业訃聡軑嗒ノ撟懨辞澣佋嚺嗋牽疟喽а栟€迉氓咋購茪脽諗藷冖维尧喂女刹貟蝹啜�"],
                encodeOffsets: [
                    [62680, 36506]
                ]
            }
        }, {
            type: "Feature",
            id: "AGO",
            properties: { name: "Angola" },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@雀氐蕦詪葮藭蛺询謯忙摔艩椰艧挪蓘蓚莹远聬庐皮褨H帽獭唰碦f諌菫蜁奴詰脰垣霜谭颅唰內济嘉簊源糯夕鹿臉使末小屁峡暖炭卯虂醿聺幡抵ほ嬚涸洁怀蝸釒澟犠嬓栤偔聴诺脧詢蠟寨~詨茲袡菂每請艤輮虃迴陋伟藲荻权螁訕占藧蠍臉噩芦訆剩虦伞詺鹊詭庐迁识同虱呒牵謿褋諓膭菐螌艛蕭g處母釤淸"],
                    ["@@蓧臈桑賱图未湿茦蛝私泰钳茘蓫位"]
                ],
                encodeOffsets: [
                    [
                        [16719, -6018]
                    ],
                    [
                        [12736, -5820]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "ALB",
            properties: { name: "Albania" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@艃朔泞苇螔瘸i蓹藯脓禄藱戏小茮脨g葌爷税帽袗卯侄艝始茥苽脡藢胃邪脗瓶扫么谴丧泉膹脢抬"],
                encodeOffsets: [
                    [21085, 42860]
                ]
            }
        }, {
            type: "Feature",
            id: "ARE",
            properties: { name: "United Arab Emirates" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@片陇聦杀趥苽蹫u詵{趾知馗諣諑援菃斯艝趹褧G莽粘篇艥蠞菓E螀蕮螐u头菨潜帷嬔娡忇聧葰"],
                encodeOffsets: [
                    [52818, 24828]
                ]
            }
        }, {
            type: "Feature",
            id: "ARG",
            properties: { name: "Argentina" },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@邨搂褤虜詰x啵慇A釄炌捪笛€乜嗒ㄔ嬥瓤蠙锌"],
                    ["@@哟貒蜖诎啷犅撈娗粪欢嗟嬠娕粪▎丕唷就∨ο囙牎啾о森啶寂汾斊堔傎⑵庉愋肚堁動漣冢刍药譄蝸啷呧爟喃冉讠桑唷筎酄非饺嚸澱嬔┄軝艞變諃谓搂效忒嗒佮皼覊醽嬊┼膸前詤牵鼗坪褖詪虖唷迸欉碧暽椗溹牫吱失覡藛盛学逈驶诃怨奴唷嬋Ｒ囘廍趦褭蕥乜酄炟欉η澦枯Τ觾毡唳熮嵧呄克斷謹印螣篓蕞苺釒撆捨懹猦鼐謸脙虖台贸啖嘿は喫堈捘屟拒斕珮臎硬尉莿臋蛣系菤刷螠蠜蛨葷啷和盖⑵權█葼唷采ぽ⒃娞ㄊ爯E逇賻崭o郯訏酄嶥逌蓳贫檄喔愒『每酄€虦迍占邆爪院圣廷乾藬喽斷６写虁啖幠股傐亨缺"]
                ],
                encodeOffsets: [
                    [
                        [-67072, -56524]
                    ],
                    [
                        [-66524, -22605]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "ARM",
            properties: { name: "Armenia" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@喹炂€迁蓹蛯疲菦蓙覄私蕘藡桅色蠘茝l讒蹋}蝺英H偶蠂C蕽嗓签u艇蕱乇燃膭肖茮虙"],
                encodeOffsets: [
                    [44629, 42079]
                ]
            }
        }, {
            type: "Feature",
            id: "ATF",
            properties: { name: "French Southern and Antarctic Lands" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@炸藘邜目聢菂山希嗖嚸僸覀女螏脢洽"],
                encodeOffsets: [
                    [70590, -49792]
                ]
            }
        }, {
            type: "Feature",
            id: "AUS",
            properties: { name: "Australia" },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@吆虂覝艠倬菉詭脡脨唳剿教伳撢壣白嵶懬€原軜艞謭訚芨t犀占玫"],
                    ["@@挞趪闸蛣甩巍袞蜔膽蠇谴軟鸥薪蓜墓涩軙膮靴藮汁啵π嬛炍慌嬋斦兺溹＇筒葌途畏却藕脾啖棺┫竿嬟€诠蕗诃t訌脣猿袗軏碌輷啤系嫂荨j訒菚谆蠂迖孬协太俦双谐蕽堙蜁薪蓞鼗艍讈陋藝訒虈啶德夀∥囅櫾曃熛堅テ佳澢冚佖壾┥壠動懨斶渴愓毁捜浹屝具蹦杆⑿犎残ё壿澠费队炌樞Ｘ佨懺克酵徻涃轿妦襽钥貙压蛝莻葮嗒冊氉焭忒笑嗪撃佮獩虧啷櫵∶堗⒒褭墀葪菈驯坛涂軌q諈玫輵贫卓臒纸聺詠覂蕰聹褍蕘袟藡貢聬譀B啖秸溡嬊刲訓泻艠茪葤聡虪暮讗模蛹鸦唷柶徲捖樣幫秙蕷蠇桶慕趧訐跀艡为蟿蔚顺蕃懈蕬蕿蜅a褬械趲膬藙葲师臓訝洽雀艠褉臋赢螏貈脷贂微讇踿爽笑为贉贪悉脿纱幕趲毯詺膜哦葊蔀眉椰o啖ㄊ栆毾幧娨営惭惵溚瞯覙讟軒螤堠桅菤虠袌藗孝蠄腔母贃覡邪犬通褑茰`杉蟿沫d蓚蟿纽袨艛亘汐也咏諅M諙每潜姚袛讵蠝蓸趴染魏訏詷虙褬谋酆莻e褨貨刷覀弄謳然襽螄奂蓩蕡膼远实蝇蕣蛡帽葼菉犀械伞覈蛪突丝聝漠捅蕶锌虠协脭蕘跍耀侉藦褷虂貓踊蕚B寻蓫哦史撙说謭思菒見菭蠈木窑拾跒艥袨脭蕯墨訑艑賳菆菭沤爽犬丫菃姚t蕡谈叹蕚些脦諆染姆聵螞台褢脷訃聡胎"]
                ],
                encodeOffsets: [
                    [
                        [148888, -41771]
                    ],
                    [
                        [147008, -14093]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "AUT",
            properties: { name: "Austria" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@脹蝺觼C菐腔帅乍菄茥芙s褖葟蹧脼喈惾壧娻牕疲沫菂詶泞褧x蠞贫藕却聫片湿虏褜晒扭蓽輲聲赘飘袞}藔牵镁茰拧崭虪艅虙习夭藫觻螁虗脷俣时袀陋习莵茫艃膶虆"],
                encodeOffsets: [
                    [17388, 49279]
                ]
            }
        }, {
            type: "Feature",
            id: "AZE",
            properties: { name: "Azerbaijan" },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@蕿桑蠄DG呕蝿印纸艗褖习苾蛦仟v"],
                    ["@@蠆脣茷蓤詧秃汛训褣篆虾聼矢骚蹢茫疲俚茻虓汰葷v蟹冉楼曰巡虃写蕽蕷炭脳唳讓蠗茞违涩蕚藢覂司菧蓚蛬皮千蓺榷茙囟蕧覑鹿艠牟斜覕蓴艢蕗聟讇詸"]
                ],
                encodeOffsets: [
                    [
                        [46083, 40694]
                    ],
                    [
                        [48511, 42210]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "BDI",
            properties: { name: "Burundi" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@脕唰ι兿⒃溍熓灿幰€脜赂艇歉葟T藯裙黔蜎勋抬胎螎聼"],
                encodeOffsets: [
                    [30045, -4607]
                ]
            }
        }, {
            type: "Feature",
            id: "BEL",
            properties: { name: "Belgium" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@販谩蕺仟諓慰姚葷魔支蓵聧臐一芸夕褯脽讚袉戏投戏`农虙讵菙"],
                encodeOffsets: [
                    [3395, 52579]
                ]
            }
        }, {
            type: "Feature",
            id: "BEN",
            properties: { name: "Benin" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@蹧寞裙讍聻釆炃浨β嵭囂屖笔炁喲短€抹菭尉歇膧葊胜水蕵虪F贅訖聫拴葞咏菗头臉骚小猿实食莵諌t諚碌啻�"],
                encodeOffsets: [
                    [2757, 6410]
                ]
            }
        }, {
            type: "Feature",
            id: "BFA",
            properties: { name: "Burkina Faso" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@止蓯辖聥虓蓛蠗前匹甩蠙蔷脜应僧韦o舜跉邰努旨刹却袨艙螝洽艠蓭俅蠔菃藔藜螔姚泞蓘菄諣J谩小艛希觻展聙袧啷喝弇只强剩些每菬谓丝魔輥l铣芒藫茐蠅脰喔Ｂ訅艠賲"],
                encodeOffsets: [
                    [-2895, 9874]
                ]
            }
        }, {
            type: "Feature",
            id: "BGD",
            properties: { name: "Bangladesh" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@i捉虊哦脝诏蕢熏碌褦菂袣螘莹逕聮眉螊藘页围菭农频蕛臓蜅酶沤蹡虆賱茰話垣嗓葐酞諃碳貐鸭虜之跂蔚袙拢么讖邽艡蕺^訛茮席軈蠒碌史訊尧靴茙諡啥F讯喑�"],
                encodeOffsets: [
                    [94897, 22571]
                ]
            }
        }, {
            type: "Feature",
            id: "BGR",
            properties: { name: "Bulgaria" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@蕩螇蜌脰佴趴喁韭干屶Μ葴貟泰哟臅靴螐太坠藬訌埽艗唷ニ僓谢迏每住虋讧杀丞|脩謯褋藧茠泞臐拇茦藢蛯藔小未梅态雀葠"],
                encodeOffsets: [
                    [23201, 45297]
                ]
            }
        }, {
            type: "Feature",
            id: "BHS",
            properties: { name: "The Bahamas" },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@鹊拢蓢訙炭蕫蔷諗狮聭處郏J鹰"],
                    ["@@啵菲吤徧葱偯ぶ坽~蓵"],
                    ["@@茻庄品艈`旬蠐酮C莫趷蠗"]
                ],
                encodeOffsets: [
                    [
                        [-79395, 24330]
                    ],
                    [
                        [-79687, 27218]
                    ],
                    [
                        [-78848, 27229]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "BIH",
            properties: { name: "Bosnia and Herzegovina" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@苔F瓤蟽袦蛽奴袃取聶平没藱葲奴谣輷蛨蛥螛蛬葎檄叹腔屎些暇乾螔虨葧羌迁暇n軤茡讏\\蠟葏"],
                encodeOffsets: [
                    [19462, 45937]
                ]
            }
        }, {
            type: "Feature",
            id: "BLR",
            properties: { name: "Belarus" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@呒M啵巴勅氂勠愃惷肯斣溒氞蜄啖伵⑷谎材脆爳颧膴衼欠骚談战蝹瞥禄票枝譬蕩伞蜐强诔聢菈每葼帅雀諠軡鹿实葋脙褏铜膯莘隆蓹葹炭匹蛠浓趰j啶脿俦m摇嫂袚聫e蠍史洗詫洽L桶煞蛯聶蠆"],
                encodeOffsets: [
                    [24048, 55207]
                ]
            }
        }, {
            type: "Feature",
            id: "BLZ",
            properties: { name: "Belize" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@O女母聻拼谋虨詳莿ZH奴莿Ga森茓蔚么呕臅虧脌膬墨褖菗蔁票菗虆剩@脿啷哖跇"],
                encodeOffsets: [
                    [-91282, 18236]
                ]
            }
        }, {
            type: "Feature",
            id: "BMU",
            properties: { name: "Bermuda" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@OEMA]NOGNG\\Q^McMOI_OK@CQSGa@WNLVWHFLJXVFGJ`ZRTDLeeWKIHGIK@@[MQNi`]VDTBHCJAPBJLVFjT^LV\\RJZRn^RH`TfJjZHHOTTFJP_NOX[EYQQKMEJOLANJH@HQHAARF@ZEPS[U_IcRQXE@EEKKOCGGCQCOGISKYGUC"],
                encodeOffsets: [
                    [-66334, 33083]
                ]
            }
        }, {
            type: "Feature",
            id: "BOL",
            properties: { name: "Bolivia" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@啷熉斖熩池堗炔郢莨貐艞汀喹喴嬥ず藛呔殉微艔貑蝎植諏啵⑽臂喝査捌锻犙€h軒陇谞歉硕堠啻犡裁爊葓湿輤途讯蛡嗒钙毮欂侥纪撁Ｖ涏０莴啶雌懲μ恢ㄇ曃愂懻圱应薀職訜菒蕰Z纬蕮a蛼唳忇緰聯奴訜臏艇覟山趣怨偏趮莎蟻膭訌士钎a识蕹褬蕲^喔笔撔曒媠覌庭唰暺壡�"],
                encodeOffsets: [
                    [-64354, -22563]
                ]
            }
        }, {
            type: "Feature",
            id: "BRA",
            properties: { name: "Brazil" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@喃啷嗋爠譅蝹奂要j冥褍訛械菄菕訙艝蛹B姚獭拼炭茓袒聹寞蛿媒迶瓶胜芝瑟蝺菑啖鼻埫堗瑴蕽掖藔铅膬訍砂蟼片趯龋院覞删臎通努訝嗑暵斖戉蕯bY未菑蕱聶訝鹰薁諊S螐蕭支菛庭碳啶称掄／莠盲譁幕蛿臍鼐嗒菲櫻低佨客饺囀┭焟乇卯觾茻稀莫脠啾ㄛ徲份弙蛥覄謴露遣伟冶詾螕荽蓽贫A微詵蕩膵覕蓨虉脭霞啷χ槽幥娕斉摧绰熛氠槹p胃趴訑蠉态L貝觻茠菤膿聠蛺盈臄Y諃嗫杒甩虃筛藟菒臃莻募舀鸦俑脝菍什卮葹螉茞漠韦赘蕟炉钱軈冒艣諍聮譃蠐蓲莯镁噩艆跍瓤蕫趣貈啪啶蔡咎幣徥傃毴溔椗壪兲€诺葨戏煞虖茀軓蓪褘脭铣袁峡挟楼蘑菕藛聵蠣痞藲散椰铆炔聤覛莽酶洽茥菢膸蕫秃玫袌膾訑潜尉钎屎瑟葕聲艠煽袛脪蛼蛫蚀丐蛹迴撕垄群耀壹喔揭埰憍讌賲蹠示施喙て伮娻贁謤喋愄熰秺浴楔颖茝耀唳幨多繍压喟绰庎皵蹪喋膏さ侏蕪軚聭苔藚烁喋斣椡倒褢辗喈呧諜啷嬝縢苫亍脪嗉缴灌矒臋謪藝艇偏喃编嗒逼涏诠畏葻詪啵疐喑曂撟∠嵿さ蕳唳┶澻呧牤农胤茢耀平唷撊徯ё椧ム喙曒壼椫较ミ浿売懮酚埾埿娪熤糙囈」諣坦{唷呝罢蹦�"],
                encodeOffsets: [
                    [-59008, -30941]
                ]
            }
        }, {
            type: "Feature",
            id: "BRN",
            properties: { name: "Brunei" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@同叹軒尧聸携路諞袘聙黔斯膝薛"],
                encodeOffsets: [
                    [116945, 4635]
                ]
            }
        }, {
            type: "Feature",
            id: "BTN",
            properties: { name: "Bhutan" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@蝹藣脧冤蹏{劭脠諊趴迏蛫k菤謱夭覓蓤赘葯押q蟺丧"],
                encodeOffsets: [
                    [93898, 28439]
                ]
            }
        }, {
            type: "Feature",
            id: "BWA",
            properties: { name: "Botswana" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@菧骗藙印啷庎萎臐D虘蕷諔侔殴諝蠞喈懾］顾┲撌佉櫭Ｆ撃徥秸澣涆伮ば懮疚熌感ト櫲敌撔壥肯懽荒懭囂惷荚犛竭毶睞釣氞牑聢|岵矩绰勦矕處蛶螎諟亭十D觽葞瓢脵蛿冢"],
                encodeOffsets: [
                    [26265, -18980]
                ]
            }
        }, {
            type: "Feature",
            id: "CAF",
            properties: { name: "Central African Republic" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@蹨脷坪蓭茢g染葟喋斖愇ね犙屇壧愂偯歼郝竭喯簇娻：褞途諓茰莫潍訙钥F蝺茓螕脛驶虇蕧贃慰尧突T藯譅勋螙蔚蓡詪睾桐茒藟耍臋铡p賰臉坦茂懦缺藭}艇遣啶较ツ幣椕澥ピ曍非愗櫮娬椞篡撍敢壦撏浹徝棺撜Ｂ仓┢樤呇谎蹦検惵浵ο斕逞犆犘囇κ⒛嬑灻炠慈囱嗋"],
                encodeOffsets: [
                    [15647, 7601]
                ]
            }
        }, {
            type: "Feature",
            id: "CAN",
            properties: { name: "Canada" },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@貛艙蕺x携螀痰脜喋ノθ克喪柑幮�"],
                    ["@@啸c嗒澦傓喬劽珕蓙唷梶品"],
                    ["@@褏艥嗟∠⑹ヌ樰┨屍堗』瓢蜁覝冒葰啖ㄇ吭ㄅ颠勀椝禾冃葱嬥牸螎螌药"],
                    ["@@謮芸崭舜譅堑虖虊輾杀习却酄际凳关涀樒炁喲渴荚肺澼壪澛嬛兦偳聚屔慌勦墀詤聠爪袀攉炔啵櫬灌繀~殴薁约虗位涩鄹話啖勦尘远訋懿虃隙聶菋色覅諌"],
                    ["@@@@@@@@甙盲圣啷撥囤疍詰溪痰袭褔示苹蟿潞藥袀艐"],
                    ["@@汀殉蠂卯蓹盛聽脦蜄师螁k蓤牵"],
                    ["@@唳澮ё强瑟夭喜喱糞i菎"],
                    ["@@萍蠀褬偶莹蓷啶偹洁オ式枚袓丐脼锥衰輽藘嗖橙较氞牠襾喈⊙Ｋ坑瑮膬艽写艈趯撕迶貓氓"],
                    ["@@啶仿ト啃σ嫁柵溬旧稾苇魔艡毡蕸"],
                    ["@@苑虓喱壥兡熰蠘輮始讟味啖际冊幤η呍犕�"],
                    ["@@G唷趧唰愓ナ∝局ム貓貣塄掳啶堗疄脻喟斉泄录蟹爻覂驻覈艃校嗫┳椸呕啖兪ㄊＱ冞帝绞撐苦蜘喈趁囑徫∶囌编目啜壼秽－啷佂欄徛编喟偲曄溵幌假戉菙嗉炍掂蛬缀袇喋喩赤⒏螣嗟堵掂４膮茘塬始唷嬝屶こ喟ㄟ椯ㄋ氁斷『循喑⒆Ｑ多磶衻啷捵溡斆е樦屶Х賱唳侧ⅳ谓菥双嗖咀捜樴犯色唷改囒犐氜此掂樱十蜋嗪劽泒鄯霜喋涋幣控層掂瘱野擀啶斨屜纲狠｀喋赤唰櫷嫡呧觼莅訐啻偵徴⑺嵧冑寂復锻吤栢せ貚蛠捉虖嗟椸蹜喾嚻嬦厸钱啾丳啖嚸嵺弊洁┏蠅喁夃珬啷缔≤屍愢礃喃勧剤郦喟改屳斝嵵熕娻藴賴嗒ば苦蹈浓唷嗋脦貚摘胎啜Ｕ结嚪詠酄洁く貋贀脰聧軉喔ほ炧磵聝啶Ｄ拐挥咮喱ㄏ嵤愔浧浰氋欃壥辟固曄∥ヅ剿徛ツ嵢灌唤A啾蠜品啖地兡棵熕嵧澽桞酄汫蠜茀茒菓酶石e膹嗒沸秽〗趴唳壱吷丂朔苽磨纽n臄葌處袀姚蕵雍菣艽堑迋啖曅偰酒荷矦菦茊楼趣菎膿丧聙戮膴取膴膰蓺俚藧诠霜酄懲樳佁ㄝ兯漇啜暽斱慌夃爜屎唷喿暵臼黄溒に矷E蛽醿廈岙滱岘疈帷傽釥緻釤橜幄酄汙釥丂釠稝艖F嗑洁牅椎未嗪轿愐齿柵ぴㄠ┗唯僻诖唰巌褷也袣w諏喾櫿樴…啷犝佔巨懴氈Ｎ堁垦⑧藭酄囈馆浿傋撓€酄嬌膏牊|J夥嶯岱侧棘拳喑樞權没輪螙唰八€喟⒛灌凹蟿嗟樔局疚懾溉犎娦勛埬權穯莴喃χ栙戉〝茞蛦蕱唰奥粪奔螞釈柑瓌茮酄柮勦瑠褝喈佇粪憾欠釛樐曹捚︵詪啵囱屶々桅摘思唰韭炡δ広慈┼覘啶懊む耿蠜嗖勦o沫院轂痞嗖λ礙邞諙跔诎u蠟唷娻园唳曂好む唳敦庎珜茋唷樝囙瑸啷呡椥紶菨"],
                    ["@@薪峡釄幨瓲褖啷娧栟愃熪屶牄褎螔篆唷拜娕牪茋啶锻拐嗋爥始抓喽掂喊袎臐蟽嗟∶Ｕ毻撍碧汗苽喔兩禄嘟吽丰拑疟喙荒佉曅嗋僧輽模啜涄栔斈氞矘茰喈埪涏痞嗑啡炨厳茫喈梛逊檀釈幫侧矖[喔飞氎顿€讙彤釚犩‖菋"],
                    ["@@輭謬嗖棺毸概炧聮贁葋"],
                    ["@@枚傻啖縷啵焜啵颗懯懧监丫聵虪袠脠釆惸涏笂遥"],
                    ["@@趲越蓼诖釖單堗泛啖吪会€捠掃捦垁褘喹勑徟娢洁細葠啖樥椺帎桐芨凸邜藁嗷贯寴展喑踩佮瘈迿喑柮囀阶涏箟唳嬥维喑撨侧獧目艁訒啖ム瑴席螌蔁沾酄┨佔苦瑟釕徻ㄠ畮埽啖斣暺幪夅棻筒釁┯むС笑虒蕚喟溹孝`蕬釢∑呠兯局嗀む綀d醾概喫溙娦距獨酄娚诚娡曀距笨袪醽乘赫炆嗋⒎院輯麓趶烁覈蕸嗪颗呩禎葓釀氞垂糯邾虗啖炏︵疂H藟唷氋ㄠ『蝿釗⒇Ｕ�"],
                    ["@@唰娗簞艅蓶蕬薹袝啾溛逼陛赤禎蜅叱锚讐蛶釔≠甹藥醾柲洁占唳感�"],
                    ["@@啵撠灌聦越輪`泻旬唯酄吧儶聡嗑埲编俺轃唰壡�"],
                    ["@@釙嵭櫻废傖姽押萎韦讓貥馨謧酄懺︶瓓苺喈п挵卤酄勈戉螡喋嵣冡彎谉啜橜谓"],
                    ["@@覚蜋喁澝樴П蓶覀蠚喁€扫芗虓态藝"],
                    ["@@贋系聙褭希爻嗟蹦戉茍j蝇嗟澝澝佡啾屗亨畟碌脺艓"],
                    ["@@廷虣轄茦啖⒙櫰┰澬嬦瓧沤釕粪暴m艆藴醿炏娾懀某喹酄愡埳踞泟顺喙队秽负脹喈边ㄞ斕沫瞬袕"],
                    ["@@啶⑺撫€€F塄恕葢蛠啷嵳斎о瑠聶喁掣羌醾娒班祤脧啵捦吶娢嵲缴熰碍欠喋侥羔湵呕醾玞啻坚杹藬虄姚墓卸唷囄踞儖暮唳吺纪偽堘偩脕"],
                    ["@@艞伲侃虈薰拢嗉澪磵殴喱椙粿@喾斬坚偖债嗖哰喱概�"],
                    ["@@希y嗉矫偵∩坚仠]诪苹牡末"],
                    ["@@嗉┦嬥皾藬诩藥喁愢畧趴拴圣"],
                    ["@@唰角忇秹Bb扭唷词σ屄澿菨"],
                    ["@@喟暻ホ內毼偯∥庎獪聭营脜唰愄嚿�"],
                    ["@@蜏螘嗟從む旦藰釄徛屵菏犩Й犬脮蛺嗫杜曖棦太贋袓"],
                    ["@@唰λ曕薀嗉囐冟攻脫醿撆嗋蝿^苔跀散嗷啶徦ㄕ懴犠屜幾娛侧〈脦慰葨釈溌ㄠ┒覅喽盖掂禐莾趻謬"],
                    ["@@釚⒚熱叜艆嗷ど櫳♂弲畏釒櫱熭蝗夅啲J釋≡權祰蕛喾囜偪茡諜恰帷纺涏瓐目讎骗蹫斜邫私嗖浭冃嬐∴剩艦葟喾恖瘸釚熢嬦敡纱釣颗秽哀母嘟熉啃栢紛葠斜貑寓脨釚の赤闸啻骨堏纪樴拱权蕜虋喈嬐犖パ犪槥聴趻臐嗖继墐默岚矫佮梗烁郓图唳検樔佀亨唉菆唳樎傕坎茖喟偺亨ì漏啵ど劫斠掄珢茍嗪毮⑨⒉聳襽臐釢毱氠啍脕釂捗�"]
                ],
                encodeOffsets: [
                    [
                        [-65192, 47668]
                    ],
                    [
                        [-63289, 50284]
                    ],
                    [
                        [-126474, 49675]
                    ],
                    [
                        [-57481, 51904]
                    ],
                    [
                        [-135895, 55337]
                    ],
                    [
                        [-81168, 63651]
                    ],
                    [
                        [-83863, 64216]
                    ],
                    [
                        [-87205, 67234]
                    ],
                    [
                        [-77686, 68761]
                    ],
                    [
                        [-97943, 70767]
                    ],
                    [
                        [-92720, 71166]
                    ],
                    [
                        [-116907, 74877]
                    ],
                    [
                        [-107008, 75183]
                    ],
                    [
                        [-78172, 74858]
                    ],
                    [
                        [-88639, 74914]
                    ],
                    [
                        [-102764, 75617]
                    ],
                    [
                        [-95433, 74519]
                    ],
                    [
                        [-123351, 73097]
                    ],
                    [
                        [-95859, 76780]
                    ],
                    [
                        [-100864, 78562]
                    ],
                    [
                        [-110808, 78031]
                    ],
                    [
                        [-96956, 78949]
                    ],
                    [
                        [-118987, 79509]
                    ],
                    [
                        [-96092, 79381]
                    ],
                    [
                        [-112831, 79562]
                    ],
                    [
                        [-112295, 80489]
                    ],
                    [
                        [-98130, 79931]
                    ],
                    [
                        [-102461, 80205]
                    ],
                    [
                        [-89108, 81572]
                    ],
                    [
                        [-70144, 85101]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "CHE",
            properties: { name: "Switzerland" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聬偏殴瘸蠟频褨w谩螀蠂茩丞艀腔凸袕啤苿一说袥隆伪嵌私蟼袘趴^蠣貧揖聛蓤悉没刹茷軒M铅羌啵捠�"],
                encodeOffsets: [
                    [9825, 48666]
                ]
            }
        }, {
            type: "Feature",
            id: "CHL",
            properties: { name: "Chile" },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@B釄澿@話w帅突軟驶协聜踊盲貜狮啖熍ㄠ腋唷庎瓋啶钝樓謼喃溙熝⑾樦恨犖幾澳�"],
                    ["@@廷喹呚喤樐荷佀苦啵敌陈€喽撉撌ν∽ピ拐贿佁涋兡€呖垣唷瓜笍蓴频C逈討酄峱郫賺辗F迿十酄徳壧］∪熰”茪唰客非∪炧ス蠝蛧恕螞隙菣臍蛢谓莾臏颖太喃椦杰撃嬎囌戀Ｏ吤脆⒐虗抬謹脛g亟螔萤釒斉戅枯漃袡确莘蹋茐薰危o啷吽氞ェ讙@@啜秤斔佌捠動把呏捙呧筏桅甙啖促班保蕯邽輶烁喽娻い虖旬醿捴澤犑苦ɑ諌艩藗喈菜亨紥袭指蕧酄幟┼螤聞渊啻堗磶韦喟椸凹胜蹥牡啜炗▎瓢嗑核掅儨藔釄っ曕禈签喈勓溕屔ρ毿迸愗呇次∷呥揭屶す"]
                ],
                encodeOffsets: [
                    [
                        [-70281, -53899]
                    ],
                    [
                        [-69857, -22010]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "CHN",
            properties: { name: "China" },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@詰啻撐徰奋偰┴多牅讦賻熄省疲該", "@@堠袟蹚屎y堍邪蠣啵旧居歰葕蛵蟽蟽葯訜"],
                    ["@@喔嵿庄图邇啾–馨通嗟甘溠齿蓖櫶洁帧酄囙У篇軡虘蓽軝钮唳逞晈L褟诈雍童一嗖櫸逼€压堠聦袓藗纸篆啶懸嬠冋∴蕬兀辖啵澤傁辞炡栔犙寡曹诽撪讖垣诈酄櫬⊙撓谎钢┷屍徛勏曏斒曕じ锥輾蜐宅u茖驯喈撋幌灰忇爣褍褯讬啵溡ネ︵牆詾迵之佶_丿諈莎泉覂佣驶呕蹆蓢跅曳梅貤啵и灌蕲唰嬥蕖喹熪秽末裕蠉虄藰訃泄喹佮⒌殴嘶啖币飞欂幦ν樴藧袊茘唷嵣斝徫€苿訙迯贫袡蛝軕覂酄嚹覊瘸靴奴哦啷ヒ儀梅娶}螏貪蕮蔚聘乇蛡蕯郅諒菐颧逌啖逼撃脆邤郛聰蹥{贍谓权谁佣迎脵啵熍菜次溝吭鹤澄澺等膏シ諚迖爻诔目慰搔压r追葰覒蓢謰乇毛趯詿黔唳撃堗葨诳蟿俚菙睡袞医纽唷撜岗┦次懭┼瓭讟酄浾捝洁拙艖聜褨铜褬膼蹎啵權嗟际澷ω┫计屌秤幝埻溤浫斔熌徤囖ㄊ埲斉浫犨ば堊埱愢⒏艖蛦諟嗒偰蔡毻硿覕艩葠茫訍旨蓴荼喔︶€樛惭樔堌嗋簰醼犓∫蚕灺⑧郐膧贃謹廷猫蓺讜鄹呀喈孔嗂蓖曕挞畏唰偲澿瑔艥唰辉材∠ま熡灿苦n醿勅夃艤酄ε皵詻唰瓸蠈式唳愐屶船虉喟韭屶虙拙覉讱税茓摔藣蛿汛炸觻霉唷呵澿牳丫啾餐氊炛娮犑嗋癄艕趷磨臓虡菘讝讷藧佶坛酄Ｅ居嚺兩徫喿ㄠ牼笑賵唰毻冟畣諑Q蟿莞啖疽菜怶要遥圈蹨屑啜捌侧珳v喟甘≥執痹班蛝伪虋冤潭酄�"]
                ],
                encodeOffsets: [
                    [
                        [124701, 24980],
                        [112988, 19127]
                    ],
                    [
                        [130722, 50955]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "CIV",
            properties: { name: "Ivory Coast" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@希U讜菕諢W唳蛊プ嵤嵿牜摊菋v脼蹡膭艀}通危螝藟脠蕰刹蔷蠋膷袨聽蕯苿B赂尉脻菍膭艤谈亩裙讪葪螏忙烁菢脼艎煤筛懦佼O聘蕱脾g蕩摩啪潍葹艂螌虐蠚墙痞衰蠘钳處蓜暇聦趾蓮蔂喈∥熪飞曕胃埽聸艇"],
                encodeOffsets: [
                    [-2924, 5115]
                ]
            }
        }, {
            type: "Feature",
            id: "CMR",
            properties: { name: "Cameroon" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@慕掳踊艊詽艗袐脜嗟卬努趻蜔謯惜茪菬蠔蓩纽X啥蓭转袔吒蕭R詣赢蛨b揖螇志瞬膧螖葘秃啪褜覇螉菫讱遣葕泞穴蓽諝劬俨卢栓臓撇瞳桶聜藢蕚露彤諢脢謴聥謴覝迏曳T蕘脧膝膶腔袇痈萤渭茮艩螐藛變趴嫂褏唷浫趁澷衬屛澝ナ⌒堁疤熖囱熛ㄋ撀溝ツ樖徝撘戁浫ぺ飞溹聬"],
                encodeOffsets: [
                    [13390, 2322]
                ]
            }
        }, {
            type: "Feature",
            id: "COD",
            properties: { name: "Democratic Republic of the Congo" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@禄唳櫷杜曀懱椡撋熗嵮仿壁浲峅賴蕧晒聥詢艞脻媒覠蓜稀脗唰テ稗澞嬔樣Ｓひ挂掄庭膾喃科櫳Ｄ凳囌櫲娤嚻Ψ幕唷嚿ㄆ樛澤财疵贌R螄姚坛唯贌艩葖寻裕藚讧艦双息諘眉辖q碌示虂r膝潞猿懦喂t然没庐唰勊┨该曉捛澩杄諍唰砆貌挞褧G颅疲缘聫蓙缨疟瓤耀艩耍艧謮氓蛷寻葪藮蕥詫确囟釤沑\虓姆蕬h螊艙艧始蓨臉聙渭茙蓭酞前蓺膽思蛺覝S脛蕛碳譬佣談莹楔蓡藧聝蹟胃酄喯炛勑溎宼贪茙虇芦訆艀輺菒跃师覉赂詳煤讛蜏褠見藬蹟朔諛坛貧膲馗菑师詵艠脼夕膷啶ㄐ就ㄇ彼杶糯炔毯冒賱臈闸o摔臍詷蹤蠘姆嗓茤喜脜叶遣圈潍輮謴"],
                encodeOffsets: [
                    [31574, 3594]
                ]
            }
        }, {
            type: "Feature",
            id: "COG",
            properties: { name: "Republic of the Congo" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@炭司施茥突纬蹚啖纲栆冎屗旧傊δ好は屢喰椵惵暿葱埮傊捘澸€袎雍味唳勅角権趁谎⒚斘距聫诟蓻跍龋脭覓寻薏詥鸭知茥栅卤路該圣覈菑越目輹卢訅茘虆s摊末藡謨袥汐褲畏酄吢勠撋吽徲в嫡兲黄兪勔汿嘶蛷蓹膾"],
                encodeOffsets: [
                    [13308, -4895]
                ]
            }
        }, {
            type: "Feature",
            id: "COL",
            properties: { name: "Colombia" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@潍趣协栓蕝茀軌艤缺伟平_酄坑捙暿禾济毬浹側⑻π该娢炚喭愌刺橙η動θ忁惽干毱冘勍灰勁喰⑺斆懬偸犎浻赌号�賭讛螌臍T甩坪軅訓细諍f盲仟趥茅趯褗蜑葕袨袣號禄蓺蓻菎吮眨茣蓢锌蜅蕥蕮谭墓椎煞迎癣脟艈檄葎葋芒凸某痰聢谦雀茅权虊嗒娔動ε冏④⊥寄氊偮惸斊熎币嵢囁熥磺溨懯喪熉喨壯嵭惶ㄈ兩犔嬍班牴莵幕菑痈煞藠衰虂嗫昹Z钥影膿聟蛷菣臄铱茟K貜蠋太苺訐o畏蠙針恳偸摘唷べ熛驹嵜Ｆひ澵蹬€拥啖は成愃嵭喼懶娚∧�"],
                encodeOffsets: [
                    [-77182, -155]
                ]
            }
        }, {
            type: "Feature",
            id: "CRI",
            properties: { name: "Costa Rica" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@覘葐菬钱默皮聣葎煞泉庭菙虂艈脜蕱蓹飘脛蕬菞醛葥筛藨膴艞菫L十艓藛蕘艩葨菍糯艌謫蓾葨艎藠茅茢钎蕼脟泉遣蓤覚蜄头袀惟蜅玫L头仟疟疟谋聬票毛菬漏菚"],
                encodeOffsets: [
                    [-84956, 8423]
                ]
            }
        }, {
            type: "Feature",
            id: "CUB",
            properties: { name: "Cuba" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@塄脩趭W邉斯彤汰藓抹虜取軋猿院蠜刷\\詥菬脮蕘卅聯賹螀谋葻謶艃帧楼變芒喈衬呏溡段伾斦執兪惾ビ幱兟忁瞪κデ啪虌菒蛝蓘酄椔ㄗ垦廩钮瘸械臒潍膫押矢羌踏蠟葓褨菐賻膭劝蘑"],
                encodeOffsets: [
                    [-84242, 23746]
                ]
            }
        }, {
            type: "Feature",
            id: "-99",
            properties: { name: "Northern Cyprus" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@脨J浓犬貏Y迒盛支围脭瓶臋聢菄脵疟j楼聧i膸脩戮菋V色茂瓶卢"],
                encodeOffsets: [
                    [33518, 35984]
                ]
            }
        }, {
            type: "Feature",
            id: "CYP",
            properties: { name: "Cyprus" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聙茫唷蓖啃┡娙熗缎幝屒€芦涩冒菍U脪陆j膷娄聨挪i菆脷臍聡"],
                encodeOffsets: [
                    [34789, 35900]
                ]
            }
        }, {
            type: "Feature",
            id: "CZE",
            properties: { name: "Czech Republic" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@席莻衼漏俚什虖脵铱螀乇藬觾伟褧痊臈螤僻薁貟蔷谈染拙菐蓚菃蓽墨蠏臇袏藫丶帽驴沙覙千挪蓲旨磨膭士夭禄袭携省C沤漂葧聴脜葢菄隆w媒斯膿蠇b拧葋"],
                encodeOffsets: [
                    [17368, 49764]
                ]
            }
        }, {
            type: "Feature",
            id: "DEU",
            properties: { name: "Germany" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@d蜅唷斎汼虠唷⑶傄旧班艇袉藡葹褢晒桑台虣群覅脽虂螆諞蠎臅蓻默蓙菂捉菎谭冉貞墙屁薀臉螣褨全觿委虘席虩艃泞辗媒茮士扦袝~追骗輱聳牛蓻褘珊施卤啵懯睬デ卉峃艅状褜趾喁吰感嚿樎聪偳椚惸ㄖㄆ椸ⅱ詭@蓤蛡染迶瓶舜菒遣郯掳萍葍之胁葥蛝聺訄賹艒諣鸥"],
                encodeOffsets: [
                    [10161, 56303]
                ]
            }
        }, {
            type: "Feature",
            id: "DJI",
            properties: { name: "Djibouti" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@趣使螒訌醛萎莎瘫覈葏片拳脧曳b_十脽啥舜衻虗蠆萎帽湿却"],
                encodeOffsets: [
                    [44116, 13005]
                ]
            }
        }, {
            type: "Feature",
            id: "DNK",
            properties: { name: "Denmark" },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@詪诠啖熡勁澪掄栓藥褍"],
                    ["@@鹊蛢省臑貋貋僧啸諢欧賸艓徒也}唷斏屖屆€虗纱诋蕚聝褲薀藱亩山覙诺"]
                ],
                encodeOffsets: [
                    [
                        [12995, 56945]
                    ],
                    [
                        [11175, 57814]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "DOM",
            properties: { name: "Dominican Republic" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@艀茷倬I泳蓮蓽t拼虝覡h聛省蠍聣挟摊谭涂袓羌汐聲恕垄票频蛻陆欧炔耍钮统只蓮茊搂蕩j涩蓫师炔茪脼蛼贸覝"],
                encodeOffsets: [
                    [-73433, 20188]
                ]
            }
        }, {
            type: "Feature",
            id: "DZA",
            properties: { name: "Algeria" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@岙┼浇釢┼糠喈囅戉膰U諛系茖怨蕣颧衻岈会喆岈会喆峁曖帬f菍@脢Q唳亨船亘酄寂港幧ν幯傕酮聵噩英貌蠟潭嗒钙毱竿溕浨蔡冟⒉鹿詾蛠諣甙覡啵ζ⒄屛庍妒班穾片嗟济ρ埮娡ㄠP蝷葷趾戮菬褯苿邿取蹤原业么賲蹔詢R券援凸为嗪澦栞徛跋灯й嚸斚ヅ円熋舱囃椨贺撀幬樢迪计岗捪废傉�"],
                encodeOffsets: [
                    [12288, 24035]
                ]
            }
        }, {
            type: "Feature",
            id: "ECU",
            properties: { name: "Ecuador" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@覀睾腔尉蛵系詨蟼菫蕗茩迍處糯坪约蛦咋脥蝿尧歉讇桶唷€討凭`炔委軍艣蕟茊挟帅维龋艦贀式粘啵粪唰熗гボ登冎Ｓ呂嬑櫻娡荒炍嵜坍蕡权谋螖"],
                encodeOffsets: [
                    [-82229, -3486]
                ]
            }
        }, {
            type: "Feature",
            id: "EGY",
            properties: { name: "Egypt" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@山头枪賶色雪葷匹拴藬蠜蠏椎喈改懨刮愢元唷嬞屶驳檀覚藪觾莓啶浨椘Ｂ傉赤莪屁牵峥籃峤堾鈦〡@岫禓岵词ペ采愒芭晃ば栢b卟蓾酄彩浵磁抠ㄋ娢屖娸幟芭兩等溗溭ㄈＹ悸承吧勚傕方"],
                encodeOffsets: [
                    [35761, 30210]
                ]
            }
        }, {
            type: "Feature",
            id: "ERI",
            properties: { name: "Eritrea" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@嘶藮螇影蠇藪蓮虅芊投只X拳乾盈取詻息式胤唳懬櫷次侧皜膴謷藛蚀丐茞褜訏应唳兩崔椧⑿｀邚也訊覗訚藔丝邪失施瘸苇貌"],
                encodeOffsets: [
                    [43368, 12844]
                ]
            }
        }, {
            type: "Feature",
            id: "ESP",
            properties: { name: "Spain" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@娄状蝺胃喈捸嗋▕票喃綨啵偲澺β串聝桶蜎嗷合√ㄇ亨蠞唳喤娐ミ撝撪獊钳玫吮冤爷蜁蹃蜑討訜蠎枪粘賶菞砖佶喋邿h諆虛蛵蛥些锚痰舜蕛託薹啪茅甩潭蛝艢涩虄盛啥謤统詫未猫聮袌茙努Z倬喜瑟苫褎萤聢茲艁庸C蓙鞋蝺奴胎蓢"],
                encodeOffsets: [
                    [-9251, 42886]
                ]
            }
        }, {
            type: "Feature",
            id: "EST",
            properties: { name: "Estonia" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@漠痈瘫艁論虡帽訕喋炆监浓啵戉|糯疲庄訚蕿薜潍藟蹤D堋谈蟻募軓譬"],
                encodeOffsets: [
                    [24897, 59181]
                ]
            }
        }, {
            type: "Feature",
            id: "ETH",
            properties: { name: "Ethiopia" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@詼稀影娶犬谦旨W芨偷蓯虄蠈藨螉盈思藭虖蠅顺峡脿傻`虱腋a犬脨葐偏墙虝檀咬檀袡蛶虥岍ㄠ酆N釠涐嗒欇熥Ｕ莎藚址B凸舜迧螜蕽螕謺脿葍默葻w藝T喋熫屪慇斯刷@揖学茦踊啵聪ト毱囱嵭υ捤赣愐€r挪拾[莶蕿啖犘娚灸幬勎溤斝肝€酄犉嗆犩谦示馗"],
                encodeOffsets: [
                    [38816, 15319]
                ]
            }
        }, {
            type: "Feature",
            id: "FIN",
            properties: { name: "Finland" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@奴讬嗖€謸蕖賶唳庎帧軟荽爻螀盏喟樦煌佈撧熱叀喋掂粌谩喙懱祪钳印覟呖藸葓酄⑿≥缎愑傉嗎妿啵柷撐⑧瓱袌顺蜏u嗖掄不植喃┬娚炧い鸦嗒猜︵拳郀蠆鞋貫嗖多獎童巍讻"],
                encodeOffsets: [
                    [29279, 70723]
                ]
            }
        }, {
            type: "Feature",
            id: "FJI",
            properties: { name: "Fiji" },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@虃蕧茡循猿艞药募膮蟿蜄虁悉幕燃茞"],
                    ["@@諞钳艆碳芯扦藠掳影藔@效諘确"],
                    ["@@茅颅@楔迁聻慕袟"]
                ],
                encodeOffsets: [
                    [
                        [182655, -17756]
                    ],
                    [
                        [183669, -17204]
                    ],
                    [
                        [-184235, -16897]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "FLK",
            properties: { name: "Falkland Islands" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@唰樤屲幦吭屚蹿ο櫴ヌ嬥瑡圣蠙虒軏蠙锌蠚"],
                encodeOffsets: [
                    [-62668, -53094]
                ]
            }
        }, {
            type: "Feature",
            id: "FRA",
            properties: { name: "France" },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@耍侪稀菭葯症菧毯炸蛶茰軟"],
                    ["@@讛袇褱脿輤膝葕帽蕩j袌蓷喁喥费嬛古冏成逼澫Ｃ悸偵囏櫼絔蠠袙苺司蟻聯蕘蕷炭虆石蓯俦覗艃末畏菘訁醼吷藯末詰唳吪夃た蠟抬枪嗷瓜⑼溠⒃幥嗎€班啖へパ庎惫蛼膷貣嗒犌距懂蓮藝啷庍屛嫚倬狮蹘芫菫弄虘细_细偷"]
                ],
                encodeOffsets: [
                    [
                        [9790, 43165]
                    ],
                    [
                        [3675, 51589]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "GAB",
            properties: { name: "Gabon" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@唷灌謮蹥詸啖劼偹ㄇ舅幦藏斍溫绰多SO唰犘屆喸炁懹寂埬韭撐缴佳∝疵ㄈ厩椢掂袏庸臑倏艁謶食袊輳聳覅袠茫蠇芝墓私蓙蛣謰贂药"],
                encodeOffsets: [
                    [11361, -4074]
                ]
            }
        }, {
            type: "Feature",
            id: "GBR",
            properties: { name: "United Kingdom" },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@覊纸賸铅员[铅見钎覉鄞聳啵斣�"],
                    ["@@啵嬥＇唷ε樴I蓵蹍莜荸啖劽兠つ曒犩Ρ趾茋袁啷澥埻оО菂姆諠褤蕳筒眩荼询喃砇喾澤毕磺捴壪哭ツ澩嵰伹樴啖ㄝ篛B嗖狡斒兺班屎摇覑菃占喟⒚稤@女婴譀援_\\唰灯ㄈㄏ捤∩匆嵭嚶愤堆壯斕ㄠ俣诰冥谩唰γ�"]
                ],
                encodeOffsets: [
                    [
                        [-5797, 55864]
                    ],
                    [
                        [-3077, 60043]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "GEO",
            properties: { name: "Georgia" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@挪维瓤执訜滩噎默摊蚀暮牟軇茲喟喥嬥袝痞苹詺苽薅黔蚀螄諉葯蓳艡胁覔艞谋覐潞氐蕩鹊茘喹澟窟承隆"],
                encodeOffsets: [
                    [42552, 42533]
                ]
            }
        }, {
            type: "Feature",
            id: "GHA",
            properties: { name: "Ghana" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@喑売乘捷呈戄∈喡溚ㄎ奋ど栢螤鄹蔁喈⑴椯唕訆喔ぢ⑾娒曀斊娤疵∶暿课栄烠貚膭趰蓚太葏莩盲泄散論葓虓"],
                encodeOffsets: [
                    [1086, 6072]
                ]
            }
        }, {
            type: "Feature",
            id: "GIN",
            properties: { name: "Guinea" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@蕛t恰头蕘J菑谴脠投螚渊蓵魔堑m沙鲁V坍茋蓸聜蕯腔螠晒虦讠D葲莵傻o茲欠墨晒覅蟽蟻蛹蜎廷蓩艎瓤菛魔蠆奴葌蕮茞蠋笑十e蓶茦葎D苿艓茂栓蘑臇d硕袦U貈缺葎l脷膜覝谩浓麓露汰茊B蓶艗茢聝筛蓢维茫刹呛藮艗痊艩菤u葓葋拇沙螁螜牵蓮聫藱谴膴艀寞芦省什蕧菞脻氓朔葮螎群讧谭牡膬艣脼菋路谓苾A"],
                encodeOffsets: [
                    [-8641, 7871]
                ]
            }
        }, {
            type: "Feature",
            id: "GMB",
            properties: { name: "Gambia" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@艈蠈啵秡葞圈藠`通确始I刷茪菫蕪蔚葖喂d苇前谭葪骗Q全艥迖l"],
                encodeOffsets: [
                    [-17245, 13468]
                ]
            }
        }, {
            type: "Feature",
            id: "GNB",
            properties: { name: "Guinea Bissau" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@覅螛螡脠葧蕗L鸥石谴脕嵌鸭茖甩聛搔抹嗉埪昪说摹臅冒帅苾艒葍C蓵茥虱f蠉啸"],
                encodeOffsets: [
                    [-15493, 11306]
                ]
            }
        }, {
            type: "Feature",
            id: "GNQ",
            properties: { name: "Equatorial Guinea" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@瓶糯虁啶监祮mP唰熰T顺碌"],
                encodeOffsets: [
                    [9721, 1035]
                ]
            }
        }, {
            type: "Feature",
            id: "GRC",
            properties: { name: "Greece" },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@覡吮俸露卮脩q疲覝亩目蕸喁兠璗茠啜伹幤何�"],
                    ["@@使諄去磨詿|勋膧唰鄙撟屢垦徠嬕矨鸦褳瓶葋葕詤褉衼蛢强掖席卸蕬^訁蕙蔂蕼褧論臅蛨輳謴Y蹗渭炭讦僻謷蜐袭褭訍脡蕟细孝录藲藰浓j蓺占枚蛯葊覗g茠痞菃聞鬲{讪刹注虊迒膧V屑笑蓾"]
                ],
                encodeOffsets: [
                    [
                        [24269, 36562]
                    ],
                    [
                        [27243, 42560]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "GRL",
            properties: { name: "Greenland" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@岈溤嗎睊聸喋刺瘁矆膭鋩δ裤墛跅嗉呁曖粰聶猸從囇埰矏臓帷毺佮繄蚀郐虧啶囉п挒毯鉁樛氠牸菋揖潍鈨澴庇內曖啤釈埪∴貢诏寨聙啶о辗嗖铰撪掸藝嗉傃饺④嬥媒嗒炣♂垍脩唳埼佀熖戉畤沤喹喋喼‐\蠌醼曃愌浬｀瑢瓤嗒荚Ｍ堏编簛菈佾蜄啜Ｓ標贾训釙柭曕瓎炉釚滇椏趶釣佮I啖呁撪瓱啖贬叺讻讌聯喃粪葷軟员[讻褘湛嗟嬟嘿肯椲澭權爫喈吢洁皪蹐醼縇酄佉⒅曕爯喔澿ú褝崭艞莓喹撧⑻⒇χ椞掄牚唳氞眾毯通螛乾趢啷√曇浥｀◤藴脡职廷覀蕃\\醾斏熰房諗荸司酄放熪监ぎ薮詽毯跅讏唰∴⒓喋歑螝釚酚劵脰釚熉戓弲脳唳囁屶抚請釙偹勧仛卢鈮股栣墘蝿艢蜏岷娦樶稁袠蜆酞釛椞犥和搬讝喁⒛毼撓樶尣蓽幔毱傖R啵菏结暫舀釐樚洁谩醿炈欋崊覑艠萎"],
                encodeOffsets: [
                    [-47886, 84612]
                ]
            }
        }, {
            type: "Feature",
            id: "GTM",
            properties: { name: "Guatemala" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@褯痞曰f烯菛覎螌r蕱漠葼拧凭袣蹎嗒凢t烁茓戮摹呛痰葰坦爽蠝DB觽薷B蕈UO跅脽啷吺藲票貌虐蕵艃膝蛵袎苫脧菈芒菓千蓢葻陆卢谋瓶摹私蓛}怒"],
                encodeOffsets: [
                    [-92257, 14065]
                ]
            }
        }, {
            type: "Feature",
            id: "GUF",
            properties: { name: "French Guiana" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@蛻蛪袚脩艞蕗葔聳使嫂谓铅蓤为貌悉脾萎蜎痈谩趾血軤烁臒丐去啖港科斘囉晦懯池�"],
                encodeOffsets: [
                    [-53817, 2565]
                ]
            }
        }, {
            type: "Feature",
            id: "GUY",
            properties: { name: "Guyana" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@謤摊源盏z褵蛣o覉效酮虈茋荼詻蓵掳龋乒褵蠆貜藧A艓觾寓艹缺聣耀卯藱伞蠠匹藚聴摹菓协娄垣衻脫洗蓩褜茊軔筛虗葧细丝哦艎蟿葲葮雪聶蜘賿涩刹i喜袁茒染凭私谈么态跂硬"],
                encodeOffsets: [
                    [-61192, 8568]
                ]
            }
        }, {
            type: "Feature",
            id: "HND",
            properties: { name: "Honduras" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@啤藔虱貌脨痛艞臑牵脪蟽某聥艛施茍欠菤蕸矛迁蓤谩菕脨菉袏杉夕蛶臄聫葌屁蕣\\镁氓啪娄细霉喜v藪蘑陌摩藥漏泉脡蓸n菛貌熄艣苿k什瓶蕫葔台殴蓽沙私j艣艜虈艐蓛A葏艃菣聹茮藕臅{艊醛膬Ra钎虊沙乒谋膽慕蕸菫枪桑谦P葻ql协奴Q目葥式聯"],
                encodeOffsets: [
                    [-89412, 13297]
                ]
            }
        }, {
            type: "Feature",
            id: "HRV",
            properties: { name: "Croatia" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@炔蜅藠蕠蛽蛢蠞葐讎[軣茢辖m腔千虧葨谦螒歇辖羌使袭探蛯葍蛦螚輸蛧摹茮邇潭樱挞迲薁酃丐菫脴膝螢e瞬榨苿时纬蕽水n虇聤b讙聟聘茪烁茘亭gG杉虉膾膱秃跒蔂藠幕丶苇蹨菈碳挪"],
                encodeOffsets: [
                    [19282, 47011]
                ]
            }
        }, {
            type: "Feature",
            id: "HTI",
            properties: { name: "Haiti" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@寓聶馨苼么覜脻蛻缺茩蓭圣i色謴茰袇脥浴脭辖瓶覊示枚藬逌艣賷茫挞葓惜胃P蛶諎啪葘啥"],
                encodeOffsets: [
                    [-74946, 20394]
                ]
            }
        }, {
            type: "Feature",
            id: "HUN",
            properties: {
                name: "Hungary"
            },
            geometry: {
                type: "Polygon",
                coordinates: ["@@栓炸菎羌觽D脺蝿褣蓩滩臒鄹募盲菤彤~笑啪臏脙袀艀葼娶藸录啵捠茨捯采幧Ｔ∏壷曋┣佋铰氋∩櫶慌臂浨娯晃壞记嵥雌梀"],
                encodeOffsets: [
                    [16592, 47977]
                ]
            }
        }, {
            type: "Feature",
            id: "IDN",
            properties: { name: "Indonesia" },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@螞e喃澴氜辞捬词幨簧�"],
                    ["@@軝葋某亩酶烁伟寓酄ㄍ惽揻诗辗毓"],
                    ["@@挞桑圆猫燃违啷壳涀壟懸峆虁託窑P嗓號"],
                    ["@@奴冶啾吺呧木E态跉仟諅圣謹脺莠坍"],
                    ["@@嗑斈嬋偽屶紭袟酞寨啾€频啜愑苦蛬啶嵧篙粀啖嵜樲黄班蛶貪膶螕艁嗷曃屍Ｎ稗懨樦歼むФ路诖汀螔脹艠虠"],
                    ["@@褲直膰賳片虪乾舜葤蕳C袕"],
                    ["@@炭衰讌聘菑伟唷樎⑷舅�"],
                    ["@@台贊劭螌郫矛觾脜讎聢圈姚啜犅斷蕰"],
                    ["@@杉啻詨郯啖监ギ詳轀B軜虊禺虥啵樓嘼岍慴岍戄熪愢菧确蕠喋桅蹅請珊蓵啵残曐膏績軉蹢锚啾冝κ浶Ｍ懨橙徧瓽魏贈挟啵炋⒆磄毛蔂喁礑桐詣荪坪巍写喱埲把毸溹礃螄苽坦"],
                    ["@@诃酄兦夁鼻愢稉楼芙脓牛賺莳輿覓蠣嗉该慌褂壨欉掄┛频丝莶啷籕湛覅蕶汀虗袦蹖酄櫷椚簧杜娡栘呌裁樴爩謺虱卯唳撀斷論农委蕷蕦逌沤吒螞P驶趾螏站扭跉褎啾幥庈庁百臼涏〇艣啷绰栢牗貛痞葔"],
                    ["@@漏芙褵膱欧詽螌逊山牡凸諕薀喋呵氌にㄌ斠澯该衬€蝺"],
                    ["@@啶皋о寞双值職菘弑址u酄吠曕被怒虤啷曄櫷ぷ陈葱凰愢虩泰袨战炉蹢默殴喃盒缴盒曑樑澼€漠蕺詡謵茤謼指訁炸菭諟脩营褗袞么邟山蹎嵌褮喹犕斕執嗋啷睝馨茩訊莘丌邠啤檄"],
                    ["@@啶沰刍郯嗒呟娢氋嵺勑坟举曕輩郦蕶軤坛趢莸諍循軜賲液啖椸贸褣咋聭嗖⑶嬢斷爴佼肢要螕邤啵權、_酆止訝鄢贅膝统蹓訓虆虨s茰讜虋业貭玫肖諒蓙啜甭戉矡"]
                ],
                encodeOffsets: [
                    [
                        [123613, -10485]
                    ],
                    [
                        [127423, -10383]
                    ],
                    [
                        [120730, -8289]
                    ],
                    [
                        [125854, -8288]
                    ],
                    [
                        [111231, -6940]
                    ],
                    [
                        [137959, -6363]
                    ],
                    [
                        [130304, -3542]
                    ],
                    [
                        [133603, -3168]
                    ],
                    [
                        [137363, -1179]
                    ],
                    [
                        [128247, 1454]
                    ],
                    [
                        [131777, 1160]
                    ],
                    [
                        [120705, 1872]
                    ],
                    [
                        [108358, -5992]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "IND",
            properties: { name: "India" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@啵氞膹蹍彤褩聛褧捉艗删啶忇牅諔喹炞椪懴熗涋秽爛蛥邐协嗒耙秽艍訙褢佼膩唰犎澺猙莫酮艐諙脼尾誀钱矛趮l菣迒蛪請苺軃脟蹐|脨元蝸藥诖艀迗卮啷刚樭度纷次炐€怨顺螞啵犈泵溚囂嵠访ㄔ菲侧獩讌~訐药鄣搂啸蠌蹢趤葤聧啖嚾徦鼓毼Ｐ橙パ掂嘲傻E茘諠摇薛矢訋蠔露习軉訚茰蕞]邼艢贸讗袘陇跁味虛汁貑鸦钥袒葏泰袁桑茮詰虇賰啪蹠牛太直Z啜浨┞促円冇秽瘍帧啶赤Ι賰諎酄氛籆檄谢裙莩虧辖芦圣贆仟嗒∥＿橧喾椦Ｂ∠Ｙ櫴八＾嬍兯敝凳嵾戅赶赤蛻唷捥嵭堁窟叭秽﹤啤諃迏喱嘉戉縺剩喋綡唰扒嵽距詨祝亩嗒编Р袠踏蕽亭唳≤娭斨栣嚋C菞転医褞末侉栈蠘啶掄ⅱ唳娒權啖⒄勦酄勦_状軖訝诔写虈知虝輦鞋尾啾と编お虐吆鄹"],
                encodeOffsets: [
                    [79706, 36346]
                ]
            }
        }, {
            type: "Feature",
            id: "IRL",
            properties: { name: "Ireland" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@茠追賸荩喙灌畱哦诩啖氀、喱ぺ勝屜记σ嚽ヒ壴瞈\賹钎"],
                encodeOffsets: [
                    [-6346, 55161]
                ]
            }
        }, {
            type: "Feature",
            id: "IRN",
            properties: { name: "Iran" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@輬菍装訑謿{蟿凭装媒啶樠嵹つ熰イ輷馗聣貌刍蝸啜飞必懳号∷犣∶犝撡惼櫭φポ枯啃堆低冈撨ο厁輭袛茓锚席喁壯⊥冟嘟嵤７葨啷嚺娢о◥袝篇伲骗唷懶澿▏甩唷戀呈堉椷権о覎茓諘甩袒蜐噎汛S覀藣@茞貙褲贁啜嵰⒆夁溔溬狙喬偯櫽渴ㄕ覠讪菒始士啷际埰勍呇娤九懱唳柏ν€脴蕿蕶虂谐约驯染娄藞廿邧签讕褍喈犉熰簿蔀膭葹"],
                encodeOffsets: [
                    [55216, 38092]
                ]
            }
        }, {
            type: "Feature",
            id: "IRQ",
            properties: { name: "Iraq" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@謤失脷荧褏虂葲俳讑邲啜幰⊙炠撈徹嬎嶡T襾耶殉涌陇譄锚貪攮嗉熋め泹醽栢矮讱唰∩灌Ь釃多蛦唰佖樢⑷貉樤疚芭距艊虗蓧袞茪债唰�"],
                encodeOffsets: [
                    [46511, 36842]
                ]
            }
        }, {
            type: "Feature",
            id: "ISL",
            properties: { name: "Iceland" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@葯斋啷娭掂贆釢撝管Ｆ掂珘女釟懰堗牋蠄釂躬菐聴蕵釀嬋溨ㄕ多睜虐嗖钢报覝喋捠冟祵覄喽喢�"],
                encodeOffsets: [
                    [-14856, 68051]
                ]
            }
        }, {
            type: "Feature",
            id: "ISR",
            properties: { name: "Israel" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@匹藚蹋艤谦謸蓚磨蓩艡聴蓻袆艝p蜎薪啻壷佮肪蕯刷脣露蔀霞菭賷扭蓡zV爽C镁痞嗓\\`螄艜诺hM"],
                encodeOffsets: [
                    [36578, 33495]
                ]
            }
        }, {
            type: "Feature",
            id: "ITA",
            properties: { name: "Italy" },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@虩趮挪使黔褲贊蛣褢臑喹┭惻炑溹没唷犢捗�"],
                    ["@@詫篆艧喃曄Ｃ偽佀嚿灺戉Ж葥訏舀楼褉始"],
                    ["@@喈吧從澬и澟佁椔残纺皇囁犙戇€褔褑蹧啶壁哃炔葍山菞莳胎貭施軠勋臄瓶平虥爷霞艹茞螡斋貓谭谋勋螚鹿覅軟螘脻H什洽見羌嵌蜐婴时褕螒艀蕸未眨拼蔚投孬脝倏蠝迲沾织訙士酄鼓佀は曈澫滴撁暷敢暸勆徺蔡喪笆櫷€聰蕚尾堑袦垄壹硕脾苾袗聙羌秃鬲目蠄茪芒螁詷拧漠菃酄ㄆと娞�"]
                ],
                encodeOffsets: [
                    [
                        [15893, 39149]
                    ],
                    [
                        [9432, 42200]
                    ],
                    [
                        [12674, 47890]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "JAM",
            properties: { name: "Jamaica" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@症梅襽全茢莎谉e虱茥夜茒討酞亩葦螠脦葤聝"],
                encodeOffsets: [
                    [-79431, 18935]
                ]
            }
        }, {
            type: "Feature",
            id: "JOR",
            properties: { name: "Jordan" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@痞藛啶开啵喭亨Ы菂懦醽呇冟牳酄克Ｆ浧懰櫯櫲┨∥凳掂ぇ茊聝浓芯啻妎蜏女蕷@预"],
                encodeOffsets: [
                    [36399, 33172]
                ]
            }
        }, {
            type: "Feature",
            id: "JPN",
            properties: { name: "Japan" },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@艈私铱詴螇藧褭葲蓾迎辗蕡R袏椰詥訉墨螉螠貭枪"],
                    ["@@蛠凇皮褋雪祝喋剐冟箯陆喈｀ァ帧蛿聯睾喔┤冟Ψ袃唳漞唷炟Ｖ椸窏斋螡袧蜏榷荻諒蕭涂志邜识巡請唷屟⒇炛羔€む牵啖犩购謹袘喁距訉蜏請啜埰熰ぞ微諑啵€聘覟喹梷诨蕙唷峛啖�"],
                    ["@@谞堑专韦葓啶灌皾莎輥酄编硴指覜啶佮ぃ]艡酄葱促ㄠ虏蕱喹愂溬监Θ啖撡に�"]
                ],
                encodeOffsets: [
                    [
                        [137870, 34969]
                    ],
                    [
                        [144360, 38034]
                    ],
                    [
                        [147365, 45235]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "KAZ",
            properties: { name: "Kazakhstan" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@訒乒喃嵶撐孔固筀杀袏喋偳≯幮脷唷嗋貥喾访熰Α农撸荻蹕蛦嗖プ计矫搬摋庸聬岫窖櫬Ｗ欄喼监签蠂帅卤炔榷螙菂虋唳吽合涊┥喡吽溹爦膩聨貥軒茙芗疟撇酄幤侧牽拢軑却唳兿冝登徠屇愌炚欀権痺軌脂訛賽蕰洽冖啶娻『樱艀貥醿勦４嗖総釃⒆夃突啖嘉犩嘲j喋貉ナ斒犩聴蓚袏啻纷€弋笑瓶僧弋蓴貐趾犀思岣埿ㄈ横憜檀莅螔嗪⑶顾勦啖毴侧獑斯茅覞弋麓釕屵幪佮┒侪釄犪拺覄寻喹動涏瘈蓭要漂袣訜讟菋唯违嗒幣捬驹Ｙ曋撣ッ柯∴冶蠞醼熕⒇呧簯褩葒醼椡陛侧弗只蓳盲訌原努褍虪喟澞栢秲x抬摹喈ノ炗壡接灌旦虃謨艧葔蟻"],
                encodeOffsets: [
                    [72666, 43281]
                ]
            }
        }, {
            type: "Feature",
            id: "KEN",
            properties: { name: "Kenya" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@泳蹤讬捅裙螘炭脮拧祝藨凸菑謶头衰喈秽脣婴岬佱倢茩蘑S啖菏娡拘爸屘ㄘ斚冟グ寞褌袎讕袁詧脂謫穴茥@医撕恕讙@喋犥嬎圫葼x葎墨謻脽蕿螖迬螝秃顺指A芙啷慩岬�"],
                encodeOffsets: [
                    [41977, -878]
                ]
            }
        }, {
            type: "Feature",
            id: "KGZ",
            properties: { name: "Kyrgyzstan" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@葕蟼謩艩嗟伵居河娗ㄠ螡台蘑喽剋喟災曆勌熢熑忇硾覔虣铜嗒伳蓖呎涏⒎艗讎菑撸袊艤葻蕠葥嘟熍掂ā藰啵澞傆溹４茣坍矢贃膲喋矩傕迅妆冉廿蛡鄱债薀膴"],
                encodeOffsets: [
                    [72666, 43281]
                ]
            }
        }, {
            type: "Feature",
            id: "KHM",
            properties: { name: "Cambodia" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@蝸熏褘啖勅｀Ж諣郇嗒樓嗊€钮蹥汀蠟讋輺瘫葴謺幕唰曕冻侑蟿詸啖ッ撥粉迸�"],
                encodeOffsets: [
                    [105982, 10888]
                ]
            }
        }, {
            type: "Feature",
            id: "KOR",
            properties: { name: "South Korea" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@塄唳赫璓啷吠円ポ角壼ノ忀趁ヒ毱假€蠂啖斬捌氈卉樏偯合捖囃炏溩β⑽埮ㄈ�"],
                encodeOffsets: [
                    [131431, 39539]
                ]
            }
        }, {
            type: "Feature",
            id: "CS-KM",
            properties: { name: "Kosovo" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聸牵艃P脡台醛膼浅搔凭葘泉脪艤栓瓢虏泞艧凭驴艑茀茠聼菐苹泞L磨瘸某某聞脳葔聫庸呕"],
                encodeOffsets: [
                    [21261, 43062]
                ]
            }
        }, {
            type: "Feature",
            id: "KWT",
            properties: { name: "Kuwait" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@乾蠂玫葥藬賴砖u冉袗轃膯貫弋譅茅"],
                encodeOffsets: [
                    [49126, 30696]
                ]
            }
        }, {
            type: "Feature",
            id: "LAO",
            properties: { name: "Laos" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@藲蠝聹軉诠芨驴酄曏举嵜幥浱売痽剩屁啖卭莠雀啖灺吃幬肥盖刺曹愓睹溉∫剋诺啷ρε徬栟呧O蜌芄諠蓷蕢虩唰斣壽︵Τ諏輯賻讖蓜抓频酄枯曁蚕澴冔櫷�"],
                encodeOffsets: [
                    [107745, 14616]
                ]
            }
        }, {
            type: "Feature",
            id: "LBN",
            properties: { name: "Lebanon" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@桑[媒匹双D虡蹌屑注f聢蠘搂茞停覜蛢确覠"],
                encodeOffsets: [
                    [36681, 34077]
                ]
            }
        }, {
            type: "Feature",
            id: "LBR",
            properties: { name: "Liberia" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@蓷Q唷叫愞呝栜徱⒅Ｕㄈ惵斚溡樝合呵秐蓶抹螛鸳脟偷菒浅蕚I洽透蕜s聼蕮膸袧墙蠉蕱杀藠脟韦螜~艇膬目脻蹠"],
                encodeOffsets: [
                    [-7897, 4470]
                ]
            }
        }, {
            type: "Feature",
            id: "LBY",
            properties: { name: "Libya" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@拽谭铱窑喑蚕佌勞懴赶黄诽椧堵嵨关斖樏闭埮勔犆撓ζㄛ埪端曒愋ㄈ溍拔犇椢捴就斒端愋κ屄促︵Ζ虂螠冒郛茡喃炏撔€輿莓菎喈單權泄笑蓴袞袭葲贍藗肖貏衻讉艠喱捛Ｋ合懱篒藢茮酄茨比菜ＬＰ暸嘉徳盄岵矦岫礍醼粪ケGY螜鈥о緪鈥о緬唷撘�"],
                encodeOffsets: [
                    [15208, 23412]
                ]
            }
        }, {
            type: "Feature",
            id: "LKA",
            properties: { name: "Sri Lanka" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@懦啖撐櫴囓等撔嵹溒瘈蠣啻甲喴毕鹤⌒炧"],
                encodeOffsets: [
                    [83751, 7704]
                ]
            }
        }, {
            type: "Feature",
            id: "LSO",
            properties: { name: "Lesotho" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@虇施食校茮藳页趴乒藣虥膵乜侉覄諓覗廷霞菭尉实"],
                encodeOffsets: [
                    [29674, -29650]
                ]
            }
        }, {
            type: "Feature",
            id: "LTU",
            properties: { name: "Lithuania" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@茫蓨臍刹蠂苿啖∑ㄇ臂膏エ蚀喽佮牅膴艦签覀脙卟小膧蠐蹚藦葯觾啵冞籒全识褭臏"],
                encodeOffsets: [
                    [23277, 55632]
                ]
            }
        }, {
            type: "Feature",
            id: "LUX",
            properties: { name: "Luxembourg" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@菢葟鲁蟻蕧i葔貌臑壹蓶聨"],
                encodeOffsets: [
                    [6189, 51332]
                ]
            }
        }, {
            type: "Feature",
            id: "LVA",
            properties: { name: "Latvia" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聠賳挟諉邐思跍毓讵h菉伽軔篇蟼幕堍谭蹥C袣葧卯小藪臃啵椡曉浧欉毙⒁伱勁澢牄膲喽傕ェ食"],
                encodeOffsets: [
                    [21562, 57376]
                ]
            }
        }, {
            type: "Feature",
            id: "MAR",
            properties: { name: "Morocco" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@話违邷脦啖娙兾篣蛡諢潞詽虅啖鄙溓逼吠涏茩蠞痰印帽聴孬唳櫷┩嵮佦嵣ム牷欧啻唳古稝@@p覊员聛藫葢稀@胎艎酃臎藳倩士脮衼喋曕瓱啵∷｀瓔螀蠗牡獭釅吤D聽隙蛼僧藶血脙硕虁驻掖諙瞬茒蔀蝇p覀踏圆謹酞諕唷琭\\褑蛿薨蘑趲指褌蔂郛郛瓤啜锻娷⑴斞墩ぶㄠ夕禺螑謽啖埶勗"],
                encodeOffsets: [
                    [-5318, 36614]
                ]
            }
        }, {
            type: "Feature",
            id: "MDA",
            properties: { name: "Moldova" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@权女謷膴丐式螉聧蠟丧脩说酞茝浓螚虋蓢脧疟凭膷蓾脳臃|膲艤谦茫脪骗杀藣匹私蓙臐漂夕臉为蟼訚詡藟螤使薁石膱"],
                encodeOffsets: [
                    [27259, 49379]
                ]
            }
        }, {
            type: "Feature",
            id: "MDG",
            properties: { name: "Madagascar" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@蔂违群謮茒唰澤捪侥壭椘┦櫵酚扒伿澢堌滴ド等椔寇呁о斜喹呍涧蛻喹熛涏蹃龋芑巍記蓨跈虦沙押脟輼虘跔霉貍飘貏习脾D霜袛賽酶諝葯袌莾諏茫逘虋液艛諕屑聦叶扦潭撇蟿\\訍訋蹡援师褑艞维桅牡要讕f詯甩蠑虋委"],
                encodeOffsets: [
                    [50733, -12769]
                ]
            }
        }, {
            type: "Feature",
            id: "MEX",
            properties: { name: "Mexico" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@蜋輩匹貋脮喃纺呅ひ浭盒氋持庁橙炗復⑿编⒕蓾螑螜輨删贇膸丶瓢諍茽諙蝹权蝇猫鄹脾蕱脂蓺啖度気斅囋毭甭呅櫼嬙伻ピ澠钙ヅ蔽成佡缴吷幥璫莾Y虧該瞥牟姆聺P怒蕙V薹AA觼蠜C毯双潭葯蘑枪茖陆s朔嗒僂袡蹍泞平沫葻q蕰啷嵿褵藰蹏蓶曳脫讷蛠褔膲抓蓽乜莿薰犀乜艩啷嵪港毙捝兩ひ孤亨’藞螕夕啵椨娧佌屓λ埬懯埲柹擩虅吮蠘霉彤谁褗輯酄脆趢校约軡蝿品却鸥圆褤葹庸肖冉讛覎忙樱迅峡肖聶藔覎賵虛贍^蛿貒同双聶討纱茋涂茢袝膯賮虁螊禺讈茠取鸥脫艓私片\\菧诈十蓢谴虝諉褢栓薤薁蟻筛峡虏逊袣聝投稀台蠎q骗螡瘫偏J蓻詾栈訋貎袪褩蓤聞貧诺覗袕屎挚蠏艔艊蓛蓶原劝臃应脰脷螉鲁谈碳聨蠝侃锥颖啥瘫諃谭站铣讦涂莶啷柮炧┆臑每菓啾斝♂妧祝醼狿跇@D螌喔淍酞虝褬藝詟蟽栓循染谣癣施郅圣諍趻蹔h驻捅褎止虅盈痈訌葌讞删袃倬使桩葋蜑|"],
                encodeOffsets: [
                    [-99471, 26491]
                ]
            }
        }, {
            type: "Feature",
            id: "MKD",
            properties: { name: "Macedonia" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@艅O聹扦雍偶葕聬撕露洗b褌藦脪謮菂聝茟匹視h蛬强栈玫螒却拧萎艅烁"],
                encodeOffsets: [
                    [21085, 42860]
                ]
            }
        }, {
            type: "Feature",
            id: "MLI",
            properties: { name: "Mali" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@税贫茦佣藠p讝苫觿菛蜄脟糯葓鈦歗葓讱疲募袥鈰埿涒媶啾綿岈坚喅岈坚喅权峡院蕢隙茓V諚啶犇團釆熤椕浧冟茂坛虠铡聫諢I瓤菆谣拧藁螒菂士俪蠒艞蓫螜恰袧艛杀瘸奴只跈邸p顺森危脝鹰螊暖葷艁沤维蕧磨啤h品蕰侪P煞糯艍霉时蕩卢盛目陌浅膲聬藲扦蓯螀螝某纱葒葌菣v全艧藭艖杀枪潍盲煞蓤茡聞蓵艖茀A碌坍聻示铆蜆探蕗菗訑聺院"],
                encodeOffsets: [
                    [-12462, 14968]
                ]
            }
        }, {
            type: "Feature",
            id: "MMR",
            properties: { name: "Myanmar" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@荧畏抓聸膝啵ノ熎承炤呎斬椢堉吿堤兤谷冎栚櫮穇系蜖迡遥薜小唷纺冐笆促犓济︵８徒绚藳唰斊编蔚邰謪褍啷曌骋矫对橙犔傕í谦蘧趨啷耗继⒂喿喢呞疤娕礿拙写圈臋韦葠撕聨啖堏側懴愛樎ㄐσ秨訑嗒溩喿钙泵г幤该浲堄毸滴救贌聯蹤邠郗某唳洁⒉茢权逈諓菎蕮郏夭蛠味品貫蕯~螎軓盏浅瘫訐葪"],
                encodeOffsets: [
                    [101933, 20672]
                ]
            }
        }, {
            type: "Feature",
            id: "MNE",
            properties: { name: "Montenegro" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@脕莯畏携脢藡谦脼山藶蔚菛蘑茰努姚藲葴凭眉蔂茻努艣藸臎蛯千莽茂平葖骚贸"],
                encodeOffsets: [
                    [20277, 43521]
                ]
            }
        }, {
            type: "Feature",
            id: "MNG",
            properties: { name: "Mongolia" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@啖⑧緞埭啾勡词赤]謽辖酄悸夃瘣蓙酄堊捦坑多啖娻ざ螎迋寞唳ㄉ嵡堌苦疁螞邜坪喋炁屶艒酄栃椩氀曓琓喋捚嬣溔监珗茠喁缸ぴ屇澭八锚啸賴拽酄缴愇呌埮勦牑沤佴檀诂藦迉讜臒虠趶摩喁熍徸熓呚澲夃北蜋酄费洁」菫铱煤殉乍藥蛽茖耍讬睡捉覈唳椞戉敖聥啻囙覌蠇示唰瑼喟撛溹牓虐喃Ｅ涐儍葕啶憁颖詟希逘员蘑唰┰监瑓艦唰伷炋∥竿栢讌诓喈┩€鄯丫蓹讝"],
                encodeOffsets: [
                    [89858, 50481]
                ]
            }
        }, {
            type: "Feature",
            id: "MOZ",
            properties: { name: "Mozambique" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@賱忙唰炇伾柵勛抰虤师詫a啶€蜏跒婴茒蠒聯酄纺据吢愢部屁蝎剩追蜋讔諚缘迯蛪啷冃∴啵曂撈底曌嬋椕承屬徢斢盳剩篇娄{酄椘嬒啡て澟蔽撐椞椲椝赤視蟻坛冒螣蓨脡铆训賾R茂蠆暖蠔铆虪片啶撟靶撪畟啖蓽貑哦煤抹佣茐蕿聵睾菒讓E喋犙ニ捫徝斍谷枷城佰玤脜碳膩装幄堐樣毿暽疵纪ㄉ吢竿登访樧≌冈笔沧屛肚懊獖螜貓蹋藮虆]山嗒ι举�"],
                encodeOffsets: [
                    [35390, -11796]
                ]
            }
        }, {
            type: "Feature",
            id: "MRT",
            properties: { name: "Mauritania" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@謬志詶丐謲蔀袚蕷业U效墙泄冒私藦茂覑珊邪艀邐模酄敌耗屝忌懶幯滴辞舅緮M莾喁幦囱溸€酶聛釖羔獋漏F啾炨箹釒熰苯c袦鈰呅溾媷皮幕葒讬鈦橾懦葒蜁脠觾菚讜杉藟o茥拥睡频"],
                encodeOffsets: [
                    [-12462, 14968]
                ]
            }
        }, {
            type: "Feature",
            id: "MWI",
            properties: { name: "Malawi" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@山贀删嗒ヌ哵踏藭螝貒卯嗒壩登弊嬚吩裁椬⑶跋嘎吠锻喩趁挥櫺栄瞪斒勌埱囒⑶氌计炆壾屝呄愢牁平菧傻硕瞎删喱�"],
                encodeOffsets: [
                    [35390, -11796]
                ]
            }
        }, {
            type: "Feature",
            id: "MYS",
            properties: { name: "Malaysia" },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@脿褯謭亩藶螆葮媒痈該螠譀露郑臋稀膯丝脰踊虙傻亭輵e顺撰脡邞禺唳第毮捰熤毰涆犔∫溎犡斎兾てて埾�"],
                    ["@@兀斯墀茪啷盄虆啷椡撎囇權瓱蹍堑邞删袝贸萤褖諞脪乍菬址訂茣謽販私佼莯菧軉维莻唰柷鹤沮斝愊ρデ盒�赂諟聹邪侏讗褕趢图H褱褘聻喂謫苫郜失脩汀譂楼飘效"]
                ],
                encodeOffsets: [
                    [
                        [103502, 6354]
                    ],
                    [
                        [121466, 4586]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "NAM",
            properties: { name: "Namibia" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@乇賹汀貣葍酄娙坟屗矑m唰捙呉炌浳屟≯溠赤墙諉蹆酄惵毁⑿毲喸娖炚皚詣蠞哦脨鈧樧屝曖帪艧嗷次傐屓捳奥低ㄈ峆茅觼葝虱C諞停蛵螏嗖曁嵷陈儃岵洁牐聡B釣橝岱嬢Ｑ曇嬅曊嚽勏椕斊椢┥靶撔�"],
                encodeOffsets: [
                    [16738, -29262]
                ]
            }
        }, {
            type: "Feature",
            id: "NCL",
            properties: { name: "New Caledonia" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@蹛缘穴檄蛪全谣瑟坠蠚乍鸭謮驻艣硕尾[液斯蠁朔藥苫"],
                encodeOffsets: [
                    [169759, -21585]
                ]
            }
        }, {
            type: "Feature",
            id: "NER",
            properties: { name: "Niger" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@n旨啷谷�袨铱蘸艙悉芒孝闸聬檀虡喱拜溒劽犞楨釆畧蠏釢扛岙骄喑ㄎ庇€遥专谈雀嗖旧揱藡螖私腔委蜁醽宦喋尺嬑赤珘螖痰C榨闸m膷袃蕘碌聛藡苹m蜘啶側熉捼佉焚笔斠嵚甘徟熡瘇臃围褤q唰⑿壢笛揵炭蛦唷吿监谋蓵腔艧訔蕥凸脥荩贄託虩E谁蕳"],
                encodeOffsets: [
                    [2207, 12227]
                ]
            }
        }, {
            type: "Feature",
            id: "NGA",
            properties: { name: "Nigeria" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@啖嵦⊥壜撊壼覈諅恕貖砖謫賰Y輱B露啻諛莻諍识蚀孝源臈扫菙透葝泳聬霜脦荬蕦秃艩訕蓶羌啵樐侧袒蛝蛥褦a袏榷唰把⊙攔痈唯影}蕫艩規路俨蕮趥腋葼聭知啶伷糿同童臒票芦帅劢俦蓻諜拧学潜葔菨讬覅螇沤褘葖凸每螕纸吮医螉蛧a詢迎蕬Q袓叻蓫砖"],
                encodeOffsets: [
                    [8705, 4887]
                ]
            }
        }, {
            type: "Feature",
            id: "NIC",
            properties: { name: "Nicaragua" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@虄藛辖秃葋瞬螣藙褋蠝膜啪茠诺脷脪示聰艀葦努Rk挟葼r乾O呛嗓蕼菨膾木坪牟虋纱b铅膭Q艌泉臇|茰殴菤聸葐艅蓜B虉艑艤艝司i茂膬搂葔膼太葪斯臎头聛蠀庐蓮t蠙殴膲媒潍脤蓻牵蓩聽嫂藕茝醛潜蕸脠茡铅藟锚葧艍謪蔀懦艊"],
                encodeOffsets: [
                    [-87769, 11355]
                ]
            }
        }, {
            type: "Feature",
            id: "NLD",
            properties: { name: "Netherlands" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@郐y莯顺冉迵蓢蛠詬@茦啖∫ト炚徬€蕞签貨芒褷刹輤喟嗋螛"],
                encodeOffsets: [
                    [6220, 54795]
                ]
            }
        }, {
            type: "Feature",
            id: "NOR",
            properties: { name: "Norway" },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@幞嗀權獚桑啶務呧窙偷诘没微诇嗒兺班搏说蝎貪邿蠅啵椚楼啶Ｑ荚壣澰仿撆冟綋茒蓾业攮H謬妆酄苦嗖畞台斯虈瞳酄痓毡蘅戮喃熣炑嵥ムΗ郄只蠀記譂元醼嬥喃熰瓘褦虥啵毸囜姸逓咋釙犤夺€屶嗷む釐亨敬喽勧樇喋娽噹蟺嗟碑邰嗷柭涏簽菢"],
                    ["@@釄澪呧節葴讍蓯詴藥醿斍毻苦瘖葝"],
                    ["@@岐栘滇憻庭冶兀輩莵袓邸唰Ｂ忈叺寓迋虡喟绞愢繒軅俜趧針幪溡⑻嬥\\蛫思喁韭堗〇虌"],
                    ["@@嗫忇皾覎釢蹦贬煓茤偏纱喈筪啶佅４杉喁炄胜釕喝�"]
                ],
                encodeOffsets: [
                    [
                        [28842, 72894]
                    ],
                    [
                        [25318, 79723]
                    ],
                    [
                        [18690, 81615]
                    ],
                    [
                        [26059, 82338]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "NPL",
            properties: { name: "Nepal" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@脻伪艑諘末桐郓a唰熑炠傆浹掄艎嗒歼壭客喭溵颊捪犖捜赤辗揖钮税袝俣菗踿蟽啷屓曕膰"],
                encodeOffsets: [
                    [90236, 28546]
                ]
            }
        }, {
            type: "Feature",
            id: "NZL",
            properties: { name: "New Zealand" },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@葤螊装途蕫巍B螡坦铣展廿褩头檀袟侪Y軛蛢桑栈計唷椱囅撔绞囖漧窄刷啵泵惼椞耙屫班酄φ€拙蛯軠寻詭薛蠋馗蛨蓡虐叶诇洗葐围"],
                    ["@@貙啖玪指蠝莎挪賸诎藳吱茫訏蛶褞沫券輻石荧贈j伞虱镁伪奴苹蛥覐蟹止侪童茻蓸螘浓訛蹟藷舀啵浲瞶苔貓虒茪侉聼宅突譁v篇袘螏趮輸螚转谈脿覛冶俸蓱蕚荨"]
                ],
                encodeOffsets: [
                    [
                        [177173, -41901]
                    ],
                    [
                        [178803, -37024]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "OMN",
            properties: { name: "Oman" },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@袒止蠠陋签颧茐褝募謼每幕席F越袒膰啸葥钳怨P汀蓛J突袩煞药膫謼顺媳鲁藵讟倏嗟瘁牼酄局栣亗烯转v透蕯螑F螁蠟菕譬艦猫沾褨H蠔值腋抬貫艐蛹瞥蠝訒扫帅虨艃C葔泰詢茀山螣藦"],
                    ["@@艍瞥菂撕蕯撕木帽膩螎"]
                ],
                encodeOffsets: [
                    [
                        [60274, 21621]
                    ],
                    [
                        [57745, 26518]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "PAK",
            properties: { name: "Pakistan" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@鬲匣蕿佶嗟ㄍ贿观粪ぉ暖啾Ｈ残碧栞佁堉┶葱耻懹焋壮酄冟諆唷澿啖∴脷啶戉ⅰ占蠗莫侑揖褝菢軡釃汥謸謺貨蓡剩貈侪贅嗷磺佮纯e喈兣澩勦喁娧⒚┫靶撈寃輮撺蠁头詳械讯喽ㄑ曕挪詧艆菫葌讙贸嗒ξ斅堒幰队堌碈臓杉贋艑檀媒廷蕗卤詫桅詵諛蓡庭謯邷纱挞聲蛼屑螠末屑龋韦蝇渭啵樓ギ漠褠坪莹摩"],
                encodeOffsets: [
                    [76962, 38025]
                ]
            }
        }, {
            type: "Feature",
            id: "PAN",
            properties: { name: "Panama" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@双蕩堑覓群散蓞脦瓶摔谢筛慰脕菨虈突蓙墙聡膲签袙覘莎艆脓怒戏漏啤詧艐茮恕赂菨透螄脠蓳陌苇C腔末哦陋菛矛菭聫撇挪牟签挪K透蜆枚虪虧i潜筒聸膧忙纱鹊挟脭唯蓜詼菫撕胜椰路聥膲叶聟蠋啤藴失蛣傻墓奴葴拥莵薀藫脪艆小"],
                encodeOffsets: [
                    [-79750, 7398]
                ]
            }
        }, {
            type: "Feature",
            id: "PER",
            properties: { name: "Peru" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@丧褭褯蓩唷呌樏蔽堘€涏嗪椸＞佾园螐蹨茞蕩軈嗒距牐嗉勥嶀€呄に冐べ氛鹤蓖妓栂捫熯⑹甲氌⒄幠参撌嚾汰螏芒图臐螝褖訂螌莿证驭芏唰犕ㄠ８啖犑菊磁澷斏⒛傊捫壦幮呄瓷徲多ⅲ囟目舀蔀踏疲詭冒贍辖诈唷Ｊ褉襾莩聽艙懦蹗菈啷ブ泵撓簧壧嚹屢撛暿岯巍蓻频螖莩也詽潜委謵碌蛦覂輴u蹛痈脟啾⒛┯勂犥礋欠说拢谉g軑蜔锌飘痰葧睡尾酃諎啵�"],
                encodeOffsets: [
                    [-71260, -18001]
                ]
            }
        }, {
            type: "Feature",
            id: "PHL",
            properties: { name: "Philippines" },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@膼謴潞医斯迲太唷ㄏ窖嵥庁ナ壪苦Ι应煽貖拾袔諔袌藖螒袃聬孬业茟蕱廷劬諏蕗覝蛣虜蠞贁砂茙蠏专v路侔诩袐锚褏脨瘫"],
                    ["@@虩恕藖諐藘蕽垣讏铅嗓蓚删蘑愿舀赂茐郑噩吆膩摺"],
                    ["@@喃＿曅権堅霸幾娧班牪飘蹍謬咬殉挚"],
                    ["@@詭使諛Bg螚铣危諘失聡细脪褦沤袗"],
                    ["@@蕗啶瀓谁榷辕袓葖聲注失陋苼詷佣茫Y蛨裕贉弋m纱袒"],
                    ["@@蔁堠苇芯褤贅軞聣虉獭"],
                    ["@@援蕢识蓶眉蓢茘螒思谆蓻邾臃衰苼诔葕跐丫摹蠆牟啜疽円櫵溔撓恍笛瓷嵦椩娹兣蝗喡ㄎ幩€蓨剩葮艊獭斜託疟渭聧擗秃恕臄喑勊溵€詷A"]
                ],
                encodeOffsets: [
                    [
                        [129410, 8617]
                    ],
                    [
                        [126959, 10526]
                    ],
                    [
                        [121349, 9540]
                    ],
                    [
                        [124809, 12178]
                    ],
                    [
                        [128515, 12455]
                    ],
                    [
                        [124445, 13384]
                    ],
                    [
                        [124234, 18949]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "PNG",
            properties: { name: "Papua New Guinea" },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@山膷蔚蛿蟻諗欠贅艤膯臏省尸葟袪諔袌说艥山"],
                    ["@@询莽苾山覠缺褯葻呀B蹚蕯討珊锚屎莠农覡脿哦袞纽r膯呀訍脺蕚思腋虤摹痈詫f菧茝g爷睡浴"],
                    ["@@荬湛詹啖挥柭劼懴壻浭デ佮螡摹蕪謰脧确蓴軣摩唷暸促氛氂壱ρл€嗒€車蕠浴耍艅廿趪丝一茤啖吢朼岍抋岍掄笭變嗉娪撟勓椧囱吪赣掂稊员炔呀逈臎葎謺"],
                    ["@@士伞莵痈葷蜆蠞藶訊为貒蕷珊犬覓苫烁葋螠全痛螞蛫藦亩学"]
                ],
                encodeOffsets: [
                    [
                        [159622, -6983]
                    ],
                    [
                        [155631, -5609]
                    ],
                    [
                        [150725, -7565]
                    ],
                    [
                        [156816, -4607]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "POL",
            properties: { name: "Poland" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@螄諟脿虃裙覇抬虤珊嗓葷褣指蕵嗖枷脆舜酄计櫭毴边竃啜毮о欢^褮臎痊实職蠅筛蛬K童詪恰矢铣f蠌褑芑臎山蟹寞迌邾蓲蠗强露邫蛿貋拧袊膾庸堑褔號螇艜鲁录檄邪乇录膬藔只摩疟蓱覘迁脌纱鼗貌袎藬"],
                encodeOffsets: [
                    [15378, 52334]
                ]
            }
        }, {
            type: "Feature",
            id: "PRI",
            properties: { name: "Puerto Rico" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@褬玫瓢菚蓩蓛賲L荧聡路维泞努蹖K"],
                encodeOffsets: [
                    [-67873, 18960]
                ]
            }
        }, {
            type: "Feature",
            id: "PRK",
            properties: { name: "North Korea" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@艦匹蛪潞畏说剩朔聨捉眩葏偏僻蛢蕽謸茝畏丧畏寞摹桶茓訄蟽脓拳围脟抓隆蜐蠜蠎聢脕霉小菃牡瓶蕶茅聡莯蓱眉丧茊砂蠁趣陌玫贫蓡覓脜茙萤臓袊嗓蹌闸啶捯屩咀幩佨嬇垦亨矚尾桶壹摘庸"],
                encodeOffsets: [
                    [133776, 43413]
                ]
            }
        }, {
            type: "Feature",
            id: "PRT",
            properties: { name: "Portugal" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@苔蓤蝿努蓚蝎雍D茷艂营聡杉褍媳嫂Y俳茘奴聭袊纬莽痛詪傻湛虅省艡色痰炭锚衰头蓳逊艩褵摹鸥趥每袁蠐镁醛蛨盲占桶台脪图仟詭k韦菣虪聶瞬"],
                encodeOffsets: [
                    [-9251, 42886]
                ]
            }
        }, {
            type: "Feature",
            id: "PRY",
            properties: { name: "Paraguay" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@挺唰杢覍袞輰喔彩斵甝薮褩b实蕿页脟喱涏⒉菄蝿菒枝嫂莯剩镁迵陌蛽碳聸蛝茖挞瞥A谣艜踊菓記茘輳迊佟趽茋啶慌膏僧酄⑧报钮蠄唷酵⑧▍亘蹓鸥嗷掂祵"],
                encodeOffsets: [
                    [-64189, -22783]
                ]
            }
        }, {
            type: "Feature",
            id: "QAT",
            properties: { name: "Qatar" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@脟財扫巡砂臏尸藖d盈墙映傻脩诗菛"],
                encodeOffsets: [
                    [52030, 25349]
                ]
            }
        }, {
            type: "Feature",
            id: "ROU",
            properties: { name: "Romania" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@未嵌源摹諣G细瘸撕藕亘膭蓜葼螤@拾膰屎薀藠螣訛詠聙蟻臈惟瓢膝蠏乒袀茒蠣茻p蓮袩枪石膧苫唰ビ衬栘懱Λ葲蟹蓩喁铰テ€蜋脮蕧螉频痞葰茦确艀藘葖萤蕯脽螌詿娶磨藢視亭讵莻詵之袏脂寓钱"],
                encodeOffsets: [
                    [23256, 49032]
                ]
            }
        }, {
            type: "Feature",
            id: "RUS",
            properties: { name: "Russia" },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@唷屶公喟曀ぴ瘝酄屶〕y讜購話战俦苹鄹膜酄娔о＂葰賹職喃从牅么喱稗ο聪惻犐斨壧嗊祏酄熚庎"],
                    ["@@嗷礭啜櫮ㄈ捪勦瓓藲啖⑵埰兡櫳泵ど�"],
                    ["@@枝冉葲貝釛概编卡藁酄秽禌膿s酄懲城┺絶贄虋喃Ｊ柸壩膏茙啷椗壱椞幥继膏去蠚袃訅危@鈥炨彋贈釘亨牫茂苑"],
                    ["@@啶兟┢屶┎螙@址"],
                    ["@@嗒陈籃指艌聳軋E喁捠壝椸〗醛"],
                    ["@@啾醾Ｄて樛﹢镁喈炌從干�"],
                    ["@@啷客┼磯酶嗉浲ㄈ栢绩懦釕斏�"],
                    ["@@趬乇岫絲喽內ａ€櫿惨幾€喃幥傖暈聶岽�"],
                    ["@@庸贸岍Ｅ娚熛庎汗搔奴覓唷堵呉炨€炣掁櫮横崹輪嫂息釄ぱ横闸岖犌€喾刺膏繍艎讗桐譄驶岵椥丰袕幛欉澿矮酄嵿硥弑菭邾嗑庅�"],
                    ["@@扫谐迱炔釣釅埿и咳窖о蕽釙呉伿熰ì艧喟柹冚辞勓斦∠勆斷磰苽岌懭聪解啿暖麓贉釀计ム磩L啻废澯刮權趮喑斖窟膏ⅵ啻栂權发搔嗑际地な€嗟柵熦呣珢味洧€毡軔涌釘操涒値莿醼戂嵞关權蕠喃辞む拱v嘟毲戉姜蘑喔拜涏í藥诜諡蠍蠋岌喩会儰潞釢傂戉谓@鈥滿K嗒囅冟獫脰荻襾詣蹠喜骚漠螐蓱蓾嗉踞殱賲輿沫啾阶熰瘺鸳瘫希喈娽敆趪希谈叩潍喃迸標撝佮呓聤突啷溔嬇戉蕲聥潍郾螖伪喔窖曁呧ァ喟呈ム喁囖程匙偽业釄埿樴瓨軃詥陋暇嗖叭娻簥喋掄竸唷亨孩冖诋喈嗋Х毛詬蹢釖夃蹗啜栣摟朔釕冟锭蹥鸳釄櫳曕矟膿脭貖嗖多ī协幄灯犪獜薀屺┼繘峄п対喑毰佇罢冟爠葏諡芯啶埫冟瘜啶嵚嗆嵹佮牻毛唰嵪涏磯啾嵿瘬睡讎喱權喱囙セ诈庸喃┯闭塝諊肖喃回櫯克┡澠褠褨x纽唳瓷涇氒炋掄Ф譬症酄埶距蜌坍汛莶嗟肥涇о抱D突邉唳棺班斧藥痰酄柼壴课苍輫滩喟肥⑧珱u啜臂浶灰と药冶藨莘啖籖蟽喈呎嵿蛣唰嬅┭嬆炧祝喃嚻戅浫秽茖瞢S詸褨酄曅樴艓喋澟嬤徠灌疀螠菄賭唳庌伳班さ螏啖夃蝷拥酄囎戉瘡蓚酄宦娭椣距^艹蚀啾冟緝埽啖⊥∶а皆む獚艖围桅讞菍袡訝药瓢喈可嵿瓋訙覂询釄熱拻喋蒂傖憢邖攮鲁锚覟嗒吽亨缺藘啖娻骸呛莜螒釕吿承贯腑虈汐嘶貑止攮蓳莯森攮啸啻钢可佇夃聵蕮薀喋寡︵朝i啖晃熰图釃∽娻步s醿冟３目貤唷褂ぺ∴蕱恰訚購軍肢匕x諝謼膹褲褠茓膝咏呖茟酄赤迒邥膲郑啵监Λ試凸茲蓢蠅脤挚詺煽聠諈葰食螆薜钱詸苼匹萍喱バ栢皡茖軆茷墓谋喋避傕蛣堠哟貟茍郅郯夜酮喟屛剈葊莜茐聜蠋褷杉呒脰苿霜葏要蝷寻W蕷喟壦氂璘辕衻佟苾喋┨恖菕虠胃跓陇茅始蓘菫諠訄啖嬆吺ι內懱铰斎氛炄熕ㄇ娔€诖聡蜑葊蕧散芝篇录撇蝸拼諆站歉扫膲袀酄懭ㄑ蹦撑∪监蓚藨痈铆孝袡葨维藠蕽薅装訛懦皮啷樢ⅰ袔釁⑧┒蕻訝蛡褦喟椫嘉喺遁池粗④溹啷氜①娻笨謹努讱诙眉喾溚多虉嗟υ曖槰颧峁亨伽袐脝謸啶熝赤祻伞鈴焚斬熍冟祵貨脗系脝唷獙石趥蓳艌袪詰伟諛蛨釒栐观救仓Ｘ溼嫤酄栟⒙缔柑嬘€郢詣歇詩亍远釟犓懹斠灌幕N页趯私嗖溓既墩氠兌袗岚炠娐｀牐詸啜曌妓监季x喟⑽愢詮啷栔屶ⅰ英血摔釤⑹瓛士岽距ィ謿寻唷⊙簕谴唰Ｄ埶⑿屢呝紏藧嗉勢局€迒夭菕釙浨边曏皆核嬎捵椚忇啶捲曕揩喈澿ウ怒彤挞啶幧幧炐盾幱┯屜贾堗？锚全也冖唷堗蹎嗪捴θ欁靶糿汛爷艇叻啵惼迪ヘ勦钉挺醿毬紙訌輿郦膵啵嗋辅菫釐韭欋啒艑蹃旬唳傊傕ゲx嗫幮羔暊艕霜刹釙偯聚屓嬦埓襽嗷瞐啥未撙唯釋の堗犯藯喱ト丰墵殴"],
                    ["@@獾櫷曕粸喃€蹝摩賯脙釖堄嬍熗�"],
                    ["@@喃脚嵼泵浥浧忇茟啵τ愂踞垗~嗫炂多报X洽骚訕痊邐茞喟炃客椗�"],
                    ["@@釂衬酷殙蕩喽呁庂Ｗ距菙釘喼羔啂葞嗫屟囜姮呋裙莜"]
                ],
                encodeOffsets: [
                    [
                        [147096, 51966]
                    ],
                    [
                        [23277, 55632]
                    ],
                    [
                        [-179214, 68183]
                    ],
                    [
                        [184320, 72533]
                    ],
                    [
                        [-182982, 72595]
                    ],
                    [
                        [147051, 74970]
                    ],
                    [
                        [154350, 76887]
                    ],
                    [
                        [148569, 77377]
                    ],
                    [
                        [58917, 72418]
                    ],
                    [
                        [109538, 78822]
                    ],
                    [
                        [107598, 80187]
                    ],
                    [
                        [52364, 82481]
                    ],
                    [
                        [102339, 80775]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "RWA",
            properties: { name: "Rwanda" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@同觾碌拥蕪艁芽脝时訊詻脿镁覡艠脼聦詣蕩珊劝膹詧矢"],
                encodeOffsets: [
                    [31150, -1161]
                ]
            }
        }, {
            type: "Feature",
            id: "ESH",
            properties: { name: "Western Sahara" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@o見鸥@@脡e菋E啾濁獊陋聜釖忿棵啡逞浨勦瘝峋揘墙双聵微bC釅喢つ短⑽喯標む瓕喹犩＂袀喋査€脰藴偌酆臏苔艍息@藬葤圆聜"],
                encodeOffsets: [
                    [-9005, 27772]
                ]
            }
        }, {
            type: "Feature",
            id: "SAU",
            properties: { name: "Saudi Arabia" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@艍为施狮脻筒选虨覂鄞蕘蹎讎讇蠎茞謰郀墨讗聳泳訒啶炏客犚懬ㄋ∮柭叭幧寡κ暼娡澵苍熩囱撝拘籌啪姚聹虒募筒啶ㄆ呂妒度①毰毱捤て溹牱唷€醽喲勄喤脆Б嫂喟欋泿醽曕紶茫轄膮染袕转v蜖堀邪葥茽虖执螞录螎膵拴艂睡蕩山艕藷挪鹊尸菚啥脪菃蛵聨葯蛺唷欋褖菫遣溪砖謺醽佱牻酄结潙蛻薹蠙谆啖ハ蛊暽佀徛н荒幤纺屶スm色霉螇蓴蓾协膾螣蟻藡"],
                encodeOffsets: [
                    [43807, 16741]
                ]
            }
        }, {
            type: "Feature",
            id: "SDN",
            properties: { name: "Sudan" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@艣hd屑牡虁褵通牡貏亩亘铣脤脥葒詬漏痊蕰冒詬遥遥谢貐褵膽酃营蛥钎膽蕮褵莾聟钎酄礍艡铅貎聠獭茲沙卯褲蝇茻刹貎艞杀系蓮荩丝莵食臒氓聽虆蕩脙始茖螖E蝿記諃末维Z劝瘫蕼U应黔蜄虓碌膸贪蓲螙魔螑刷蚀谦葹蔀园熄卅堞脧楼鈥俍螝啷睭@醼糕仾@峤夽峥粿藬酄椚伷撑』贪唰嵧屓芬犔逞嬘懾Ｆ徦吺衬壷懳编臍统茀軣涂酄熢撔肺浤嵨冃壣绞澿D某"],
                encodeOffsets: [
                    [34779, 9692]
                ]
            }
        }, {
            type: "Feature",
            id: "SDS",
            properties: { name: "South Sudan" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@X俳疟石芽q朔訌渊脩褞啸屁统夕葯蛹啵持呍囋诏葻諘葕螊森輭謵去维业潜媳脝桑茣蠗母詶蹥茐藠毓酮蓞詫螘味譄熏S藰摇图织蜖蚀臓虁莻蓯荬刹隙貏艠茽杀褳荧纱铆挞茷貏聟艢钎酄禓聠铅褷莿膾蕯蛦铅酆萤褷膾屑貑窑窑茂詭全蕱詭陋脦葓洗脣牡丕亩貎褷艇亩丝c谢艤g"],
                encodeOffsets: [
                    [34779, 9692]
                ]
            }
        }, {
            type: "Feature",
            id: "SEN",
            properties: { name: "Senegal" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@螎俸薪虤蠁莿袪诪圈褱司藧泻茂楔蔷叶V袛蕶謳蓾詷兀謭纸聻怨菙訐叹煽卯蜅聺式脓鲁覜芒脵模葍k卓炔袥V嗉嚶柹ツヂ傃黄嬈徺⑥坘痊艦飘R谈葮萎钳魏c味葘菨蕫恕茩驶J艇雀藟_葝去啵祔"],
                encodeOffsets: [
                    [-17114, 13922]
                ]
            }
        }, {
            type: "Feature",
            id: "SLB",
            properties: { name: "Solomon Islands" },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@删丝讞N蛪袁詧券菧聣"],
                    ["@@蜐m鸳膸谦偶脌彤謭苼藴黔茙蓹"],
                    ["@@懦乒丨馨谦詧撕@虪讠痛袟"],
                    ["@@聳菦趨桅覠虪炭霜虐膼袭全蹛檄娶藟"],
                    ["@@菞鲁慰葤螄螉篓茤詧巍桶藳"]
                ],
                encodeOffsets: [
                    [
                        [166010, -10734]
                    ],
                    [
                        [164713, -10109]
                    ],
                    [
                        [165561, -9830]
                    ],
                    [
                        [163713, -8537]
                    ],
                    [
                        [161320, -7524]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "SLE",
            properties: { name: "Sierra Leone" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@骚脴貋秃雪覉僻态墓鬲覇蟿默珊茷歉啥p葴莻讦C珊虥羌螞聛蕮茍蓷U汰纱麓瞎瞎蠜覘芦蕮醛藦"],
                encodeOffsets: [
                    [-11713, 6949]
                ]
            }
        }, {
            type: "Feature",
            id: "SLV",
            properties: { name: "El Salvador" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@摹取印^獭膭螎菢冶脌蕛嵌~女司蓜莯蘑芦牟葼戮蕼毛歉菣湿茋聦艙蟿拇扦脩艠臐脧统"],
                encodeOffsets: [
                    [-89900, 13706]
                ]
            }
        }, {
            type: "Feature",
            id: "-99",
            properties: { name: "Somaliland" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@蠜冤讚郢酃M岍о蛵虦坛袣坛舀蔷號滩覉藲乒菕螐蠝螚泻G邐蓪啵茨摧屖夹该喬毱队幝圞aE螊A唷慇勋"],
                encodeOffsets: [
                    [50113, 9679]
                ]
            }
        }, {
            type: "Feature",
            id: "SOM",
            properties: { name: "Somalia" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@鸭膸袏司蛨Fp傻媒缨H殉钳蹋蕘啵バ權く员喋奋澿軗啶掂Η喱┼诠喟粪牤蕹贂啶佮П葪逊葝龋咏蹥W岬ぼ距砂藛闸f轄驻嗒氠洔帷勛斲溤狜熏B唷扚螌Lb藧h习虐"],
                encodeOffsets: [
                    [50923, 11857]
                ]
            }
        }, {
            type: "Feature",
            id: "SRB",
            properties: { name: "Republic of Serbia" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@誀取脿螊营蕮藙葘雀目葯茥贫匹确葟酶太孝纬蛬士茥藡臑某茟拧铣a斯碌聝脴拇拇摩却拧K菎萍茟聽艐茊平脌拧艩漂卤艣帅醛脩猫冒蛬迁藷臏奴艤蔁茽娶職努袆袥蛿蓘蟿胎E蛿蛣藟蕡缺蜆佗蓺跃聶覗停摩藡"],
                encodeOffsets: [
                    [21376, 46507]
                ]
            }
        }, {
            type: "Feature",
            id: "SUR",
            properties: { name: "Suriname" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@唰斍櫮炂摆睹斷丧雪軣芒止亭咏匹委贸烯蓧螞訐遣袊膽凸枚膷蕪茦菞梅恰覚猫浴艽艒觿藦B蠅貝坪褷炉趣詼蓶茍莶"],
                encodeOffsets: [
                    [-58518, 6117]
                ]
            }
        }, {
            type: "Feature",
            id: "SVK",
            properties: { name: "Slovakia" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@麓禄螉艝褕虝雍嵌袌膽貍泞邭蛽煞蓳菑凸浅膽啵懯熉蝗熑⌒伳磕浢勑ヅ酵瓆茫菣鄯幕瘫臓褢蓪膵虇盲艅泞葌蠈a撕臄x镁菆垄脝葤葨聵啪瓢盛D"],
                encodeOffsets: [
                    [19306, 50685]
                ]
            }
        }, {
            type: "Feature",
            id: "SVN",
            properties: { name: "Slovenia" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@蹨脻褗葠芫t菆茦茦U菐顺跐蔁膰凸虈膽H苫停h朔茙品茩讘聠葓煤全唯臑邪"],
                encodeOffsets: [
                    [14138, 47626]
                ]
            }
        }, {
            type: "Feature",
            id: "SWE",
            properties: { name: "Sweden" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@酄佔暺€豫喑冠颈堋負喈冏沧＿σ椸啖懭澩嵿董計蘅唰衬営呞椸聺藟邜鄢啷斮撪異蠁訙郇旨甩唳ㄕ澭幝洁珷詹還酄癮虉同抬撕嗖畟唷€啶炛堊策瓽蔀叶嘟斊壟勗嘎斷些嗖贾眝嗖懰赐涏竷蕛"],
                encodeOffsets: [
                    [22716, 67302]
                ]
            }
        }, {
            type: "Feature",
            id: "SWZ",
            properties: { name: "Swaziland" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@恰蠉迎臎詤覗S虅砂蛝膫蕯蕫脪褕频虐蠒冒蠅"],
                encodeOffsets: [
                    [32842, -27375]
                ]
            }
        }, {
            type: "Feature",
            id: "SYR",
            properties: { name: "Syria" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@嗫┼啶┩琯N艝哦_螆雀覡覝蛣茝亭蠗篓每贋榷螌嗓葊嗓葊掳腋藶菑啶幧阂偲扣朏啷赐€覑a啷樑狙椩揭∪鼓傌椡呧Й釃掂"],
                encodeOffsets: [
                    [39724, 34180]
                ]
            }
        }, {
            type: "Feature",
            id: "TCD",
            properties: { name: "Chad" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@膸袆铡nD咋螕潭未喃娻┐邔卢嗒ㄍ栣伡羌伟螕司_藢探蓴确嗖班覡鈥︵緫鈥︵緩娄鈥佨ッ愊жド澰澦∈衬ㄎ徤懳暷嵦幝肚昖鹰滩蕸Y券諒茮褝徒貕啵惯呄尺孤臼伱荒娞徰嬑Ｍ熰蛷冉葠茡h乒蓫蹧脵苺瑟藚讋艧螑位茰臃营羌袉夕膵蕚脨腋S覜迒聦謵脡謵铜諣"],
                encodeOffsets: [
                    [14844, 13169]
                ]
            }
        }, {
            type: "Feature",
            id: "TGO",
            properties: { name: "Togo" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@诒浅葒處伞諗茫泻葐荽蓙态膬趲D貛螘褷脰藔輦k艆训什蕽虉虌聨协菧钎聺釆澣鹤�"],
                encodeOffsets: [
                    [1911, 6290]
                ]
            }
        }, {
            type: "Feature",
            id: "THA",
            properties: { name: "Thailand" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@莪犀軛e努趫輭K谩啶嬕戉藱輳脤貗斩蝷迡瓢墉叶訐詺沫绚学藵螄謬牡脽褱蹏蟼疲骗艇蛼茲卸襾觿袩袑茝映莾也臓跃蕷攥孝唷敢ま锻熮宍隙末腋謺跉醛褎虅坪坍芏螄謫論貥袧輪螤拼夕啵ψβ溣赣斎樜甘仿丛嵵澣粪p莴啖霸喪てв皕菧虋賻脥贃诮脌酄ペ很仿涇吽櫹涋颗︵獥菂諢郄趣唰�"],
                encodeOffsets: [
                    [105047, 12480]
                ]
            }
        }, {
            type: "Feature",
            id: "TJK",
            properties: { name: "Tajikistan" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@汰史啵称柲佊涏，脼啜⑺椸綘哦蓤蕨藸膼詼葥聡蜎糯訊唷緽讈脴曰蠒蠉膲虊钳桐藸镁鄹施垄臑什覔葠伪虈臈凸呕奴試j藭烯睡菍貗藨时暮觻唷樓关敦熑ㄉ斚嗃熜屢屨⑧葴签系扭晒螏v"],
                encodeOffsets: [
                    [72719, 41211]
                ]
            }
        }, {
            type: "Feature",
            id: "TKM",
            properties: { name: "Turkmenistan" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@帽奂胤聤啷］斱Ｄ犩褞庄镁蟽平謾|庄訐輫菋苹专弄啖炠剿渡幹褐徛溉嗃具娙递埶庁撛幨売斱鄙嬆徹浭空跋埶ㄠ仟吱苫讱趨褮陇啷哱\茝褑軚虃劬应喱喲鼓溭⊥惽｀＆聻水瞥邪唷洁ウ讎崭袃啖炐┼潍w豫施聙袇嗓趴虣劢菋菣讠觼虱趶诺谦蠠賴艔唷┩�"],
                encodeOffsets: [
                    [62680, 36506]
                ]
            }
        }, {
            type: "Feature",
            id: "TLS",
            properties: { name: "East Timor" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@牟趣堍葘讝聠藔艀蛦慕摊色啖曃扣呈媏尸膹菙"],
                encodeOffsets: [
                    [127968, -9106]
                ]
            }
        }, {
            type: "Feature",
            id: "TTO",
            properties: { name: "Trinidad and Tobago" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@託艎钱聡聭氐郗摹漂煤蕭刹i酮"],
                encodeOffsets: [
                    [-63160, 11019]
                ]
            }
        }, {
            type: "Feature",
            id: "TUN",
            properties: { name: "Tunisia" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@惟嗪炘篞劝蹓詣贸賳援叶娶蹥苾郀菭褱啵锻鹤毮祡褘軍滩脪菈锌蝎M媳虇冉艒塬謨褏莿覜绚a蓜袓蛫趴鲁佶啸蕥实藦纸蛽臉螒茂螣效葲"],
                encodeOffsets: [
                    [9710, 31035]
                ]
            }
        }, {
            type: "Feature",
            id: "TUR",
            properties: { name: "Turkey" },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@喈和椸偶埭玫唳惭垄叽协茰虘膬校夭然通蕰只蕠藔啷徥灰犣暺櫶徤娻艌委沤啷椗揭廱啷程扣旹襾莯啶嵣顾澢惵飞Ｇ可Ｇ刻毕犕埻傇熋比栔坑權保磨诠見啵熉喨椢懽嚹尺灰勦；e咏酄敦椧靶刚撔掄擗嗖捖捨溬斷線艔唰炚班蕜嗟糽喔缸�"],
                    ["@@郢覐藘虾\\铅圈摩屎諅啸蔀唷λ勡づ懩赐撥妓撈等掂卤惟史"]
                ],
                encodeOffsets: [
                    [
                        [37800, 42328]
                    ],
                    [
                        [27845, 41668]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "TZA",
            properties: { name: "United Republic of Tanzania" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@茪摹岬傖倠脤樱喈监牽媳啜櫬赣壵犔﹡蓳沙該露虱脟袚虒諆螑酄√扒口澯｀？蜎詪b虣圣讘s蓵艃唰澥傎兠ド洁说虾菦啥酄椘居壥ㄕ暺樛樜椛堃戉〇樱液菞婴膶穴漂逓螏聽台苔蜏熏群钱S藰欠葠路通蕫艂露佣瞳觿處亩啶刐醾幟�"],
                encodeOffsets: [
                    [34718, -972]
                ]
            }
        }, {
            type: "Feature",
            id: "UGA",
            properties: { name: "Uganda" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@啶僜\虓牡試史券膼P賵葴蛶虏诂前细蛶熏蛿蔂藪虡偷艝录唳毼屔柸壼叭犠袁袭袏讔陌褋蟿啷ж撔嬍壨絋啖贯倣脽"],
                encodeOffsets: [
                    [32631, -1052]
                ]
            }
        }, {
            type: "Feature",
            id: "UKR",
            properties: { name: "Ukraine" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@叹聯蓜葤十楼啖屇喺炗嚾壳澝悔犅Ｌ樜穔菓喋徺⑵勗跋坑甐喟娝橷蕶涂询葐药苾拴呋脮褵苫聛蠉凇茫謶藭藿芦埽袒赂怨歇拳唷记徧涏啤喱浻熞鼻犎勑傕＝蕵屁菆擢霜蕬葦嗖喢嬏嫁┠惶芬з必┫熎犘伷壪懫荷偰炂λ旧菜幟懫つ娕浻竰蔀脴平膸脨挪虊蓤脓螛泰茞脪硕蠞搔螇聨兀示謶膲颧怒螣@蓛葻丕膬斯殴戏却諢H猿蘑纬堑脥嗓冶僧菒秃筛蓴葊碌蓱蠘迍郐懈陌臏删褏芗袛聬尧瑟俨n唷柮熰が全趲i蛡脓蛝痞蓺葷莞垄彤膮脛褑识葌転潞"],
                encodeOffsets: [
                    [32549, 53353]
                ]
            }
        }, {
            type: "Feature",
            id: "URY",
            properties: { name: "Uruguay" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@詹臍唷嗁簗唷赫熩堃犞毕囆壣赣囄嫡囙冶丕菤覔臎蕙伟肢聛詿椰脼宅蔷葓S酄干む『染讦"],
                encodeOffsets: [
                    [-59008, -30941]
                ]
            }
        }, {
            type: "Feature",
            id: "USA",
            properties: { name: "United States of America" },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@农茣冉扭|删茡台娄膜皮茙脥菙赂镁脺e蛺茩片帽茖艖蓨虓q炉蜔堑藦趴"],
                    ["@@谁脩茻钱墨猫Q脌膱卯虡膩蓸殴毛牡"],
                    ["@@臐覊|脷母邪聲"],
                    ["@@颅碌脫Z虈聢艃葤聫聮嗓艢锚脙蕫衰"],
                    ["@@谋膲吮拼陋脰鸥膱葮ij葷"],
                    ["@@片遥始茮讝陆唷呧爞使诩艎啜柹撍濼莰蕜邆抬酄捦椱核┵端從埳櫲⒛壜侥壣�菐臄娄龋菧茀纱@努墓慕偏啖栃伹掇伹氒呈椨剐佉ト佁峬膿摩钮烁苼蓚@唳娨嗋【苺嗒感糵膼梅拾茐菕蠝茊酄淗迾A藥蜑艀脿啖敦勏溒膏宝N嗷綛膸群藧娄桅啪號息什俸贇賷栓蓹譁茰蠋蕪A喱д加吰⑺澿袩唷诽冟⒈蕽鸦涌茮葖S呀摔呀螔s臈态师葒茫蕠芝茓袟h丞匹位楼鹰楼郢蕪喟€莻薁莾喹呈フ桟|暮虱煞蕷聺枪捉貞侑脳蓭葋陋藷蓘仟覎燃骗^蛥藦蜎铱凇没聬屎植褧蛶寞郐菈蔚谴諔謬苺讉藫聵邲蕣脥臇虄艩唷佌曍蕽謥颖薪脕褝瘫牛谁啶囌庇佇嵭呌脚蛔嵥椣幾㎜蔚袏唳吢佒ヂ椡浫吭∈Ｅ冃浩佅偼嬋栄卉⑾官炁蓖⑶ぶ惿揭慧餐熍亨稀骗娄小霞諆群啷嬇佪椖べ櫭嵨徟科采焌徒谴菗菄艒痰女蛠莾貚聙胤押芑目貜葰怨脧刍葷迖丨酄澄骋澬懭曄桿讌篓袝莿斯蜐{篆葌俳屎山袆葋讟臃訍虄影褍趾祝筒蹓g諌趹郏师选湿冉姚帅旬涌蟿褩藞泰號喔汙C螊跅@醼㎡釅孔む睋孝膧菕喋┠澿脻茩褨窄託匣拇臒蕦一娄虧瑟蕲膴蓧茖墓尧酄佮郓喹犅埲毾囁べ磁欅喴円炄€邰聟軠藣佗蜖邐母迋暮迋票喃妓囓樖撓赌盖愢瘨朔覀邒群蓽茋蹛朔蹘釠窣釥侤酄淍幄釤欯帷€@帷凘岘癅岙濨醿怉F蛿舜J"],
                    ["@@酄酵嬔暽惻叫€迍虡覇鸥謵脡韦驶塬袓"],
                    ["@@鸳沤战凭詻僧酄ζ炡毭鼓偼�"],
                    ["@@园菂跃膾诟蓻酄才懨┠澷徢辟暻就嬈草嵚等绰和�"],
                    ["@@貖蠜蠋菍喾劼宦谷曕本茮唷屷剼藚嗑つ佡ㄅ夃茙啾⑹о２艥@@M岱盜夥嵿牋{酄屔底斚佪溨佮爤液唷埶栆€选证螄迴蠙諅捉唷喾氄梮諎冶袡谣蛡輱藢蕛芎嗒徻阂嵾庍勦撤r唳熓屷儔啖庍┣勦附虦喹懨炕犀唰兾ㄠ钳铅讖耀脕唳伹壦编浅钮佣蠚酄氞识杀蓚喋币抵抵戉瘏妆貧小邚卓啵椢椸时然蠅嗖窖∷呄苦潍纸脼薹苫唷澦观饭蕢趴茦啶€暇酄斒膏覡啜ㄐ参堗瓨詩葓菤亘虙脾賿褣痈啷故撈犚曁д费幧澨叫监牽统冤B茂詣撇坍榨虤嗒デ囓佇€址痊I訄侃为蜆訕蹎腋虤褮诤脰志茋诖袦貛茂贅始苹熄夜瓢噩蜄冤W啖磺绞冓徣勦畯磨喁啡浲膏应喹疚樶垬楔蹟@艜薪釀⒙広皆多〞蛯妆褉攉唯喱剿堃貉侧拱聜喋毾θㄐむ‖袔酄娔姜蠋逌脡嗖愐勦睔黔"]
                ],
                encodeOffsets: [
                    [
                        [-159275, 19542]
                    ],
                    [
                        [-159825, 21140]
                    ],
                    [
                        [-160520, 21686]
                    ],
                    [
                        [-161436, 21834]
                    ],
                    [
                        [-163169, 22510]
                    ],
                    [
                        [-97093, 50575]
                    ],
                    [
                        [-156678, 58487]
                    ],
                    [
                        [-169553, 61348]
                    ],
                    [
                        [-175853, 65314]
                    ],
                    [
                        [-158789, 72856]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "UZB",
            properties: { name: "Uzbekistan" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@x驭喃Ｎ歇辗袆啷プ埿【谁拼啵ヂ澩徢つ涄⑧瑓押劢鹰軙虂茞褏啷匸聫岫踞摌雍凭茂嗖ψ慧屚呥ぽ掂Β弄喾该犩貤脵唷呅洽蹗喋伾残壧篖蟺缀喃幾斢柶菏犇壽嫡ν佔踩距逊喋截佡暷娢島牛珊仟隙喃比浰嬚⌒嬕犐撓呚犎贺狄苦賴前页N"],
                encodeOffsets: [
                    [68116, 38260]
                ]
            }
        }, {
            type: "Feature",
            id: "VEN",
            properties: { name: "Venezuela" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@y龋颖沫藴稀Y循蠀鹰蛦跈未脝葘貓驶虙搂賻啜段€艡袉處藛虨谉诇_沾业聬帅莓Q啵屇斢栂曎災灰际綳蓜啜监\\軌蕸思袊讦脳賽携茊讧熏n廷龋跁颖贸太司谭冉平垣茐j媳色杀知賾艕蕘汰蛵啶碧阶颗绞徣Ｚ浬€孬艈瓶媒蠑蓱聭譂艤諌軉茂掳黔追蕝沫危螇茝爻葷菋时俜脜咬鸭石酄荷熖屘勓幮悸吶娛吺犌浿捗犠既埶捌惨幪撈犛從┴伮荒欁≤⒂ヅ勦獕膬颧虋确锚聡乾拇潭谩秃葍葌艆袭选脠筛赢暮锥蕯谈蜆蕦蓤褉栅茤"],
                encodeOffsets: [
                    [-73043, 12059]
                ]
            }
        }, {
            type: "Feature",
            id: "VNM",
            properties: { name: "Vietnam" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@喃椲嵢佔嵸犩藓嗒侈傇痹炡紞艜喙撣冟ェ榨蹏郢啜忿碧д犑€脂丿訉墁透啖γ斚冊氞洞侉募唰柸浿柶多蓛爪賺讗諎輰邾唳脆詩蕣虪諡蓸蜋芎啜橮蠒迒迎趷見却冖I酄埬捯勑毺哭惼灯冇浶愅苦蓳"],
                encodeOffsets: [
                    [110644, 22070]
                ]
            }
        }, {
            type: "Feature",
            id: "VUT",
            properties: { name: "Vanuatu" },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@耍艒谁蟼聦嗓諉訔"],
                    ["@@茖诒丧艀签颅钮纱i佗袛实"]
                ],
                encodeOffsets: [
                    [
                        [171874, -16861]
                    ],
                    [
                        [171119, -15292]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "PSE",
            properties: { name: "West Bank" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@裕怒蕶袃艜聵蓽蓪艢蓙摩乾謹踏艣"],
                encodeOffsets: [
                    [36399, 33172]
                ]
            }
        }, {
            type: "Feature",
            id: "YEM",
            properties: { name: "Yemen" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@貕丧菋蠉o斯酄肺熰磭匣荸祝蠀卤圣潞迎螒諚菈鄯漏蓛碌强蓻蓹脮呕蓢械l藣艙讐篓蓳蝇z覡茘蕼菓鬲蕥螉菤陇膽熄母菉聶尉蟼藢膽螤蔀挟螉蓳涩煤啷簄聘膵呒膷蛺篓蓚双虾茤准啖赶氠潚蛼趢嗟乘炞�"],
                encodeOffsets: [
                    [54384, 17051]
                ]
            }
        }, {
            type: "Feature",
            id: "ZAF",
            properties: { name: "South Africa" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@菑脓危褟苫褯訃谆啷嬥祝詪賸希啖浲櫻撀嚿吩浥靶登呧＋菉詸墓螐卢唷客┸撈冊蓖呄危虤顺f伪蠏聼艣艔搔L影藱譃藬拼s伽战藜褏軋AF捉嗒ば斝赐樜樏撜埱円屆栞ぱ朆岱屔ㄅ庇具櫭辉熑執徸寄捬€蠏袏狮榷袛笑葰螤姆袙山蹅拢諡葴膼示屁袛覛盲狮蛡霜謹莓睾喈捸の俇袨茮瞬亩覀膵袛喈伾斪ぉ卯虩褔贫蕪脩膩蕮莎炭T虄詥視赢臏洽蠋賿Q瓤貞谋邾蓱蠜值褖", "@@谓识匣菬視汀覂諒賭侑虦膶坪藥掖苺茰藴蚀肖虆湿"],
                encodeOffsets: [
                    [32278, -29959],
                    [29674, -29650]
                ]
            }
        }, {
            type: "Feature",
            id: "ZMB",
            properties: { name: "Zambia" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@袉蠌蓨軏茲嫂菣诨菆邸藘虈虱蕲讯蓳幄囒椖傋嵟櫽嵧固吿浢熫帝撘硂藯默啶蹦犉歄锚艇葞寨露蹕葢展跃郑蹖聻幡夺儴Y铆虃虐蛝僻衻莫孝臈屎虃q露式暇r諙没爽稀讪艥预藛葘询贍艧檀围螆谣贍Q毛啵犐逼匙椡炆监片唳溉壪埵堈毶つ多瑎茪挺膽螛蓢桶茥諙茥訆失"],
                encodeOffsets: [
                    [33546, -9452]
                ]
            }
        }, {
            type: "Feature",
            id: "ZWE",
            properties: { name: "Zimbabwe" },
            geometry: {
                type: "Polygon",
                coordinates: ["@@襾膶吮牡袧茰蝸V諜蠟侬藕蕶諕C虙苇臑啷嵿藘英菦飘蛽冥啶材熕樐磒耶债芏蹟虦脿暮虇訋桶賻艢脝袒郜h洗钳呛然袗脫薛藨F喋熐徸嬄椮蛊娛澞в蹬得股涁呧啷�"],
                encodeOffsets: [
                    [31941, -22785]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/xiang_gang_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "8100",
            properties: { name: "棣欐腐", cp: [114.2784, 22.3057], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聶@}ScT薀@cWuJ脕聳]聞l娄RLj录B膭脿聵聽聨H@TOHCTDDDHDNAT@PEHDDNJLX@BABALHFF@DKHADBBLDHHFBLEJB@GDBBFBADDB@@KFAFBBJJA@BB@@FFDDADFF@FADDDBJC@AFBD@@DDD@DAA@D@DB@DHHBFJBBFEHDFAN@DGDC@DLCBDDCFDlAFBFCBEF@BC@GDAB@FD@DZJ聜X麓H膼Mja@脻`聛p_PCZ@lLnRGSDMFK|a\\聺Y聫}颅聝搂聫聶聛聧M毛n"],
                encodeOffsets: [
                    [117078, 22678]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/xin_jiang_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "6528",
            properties: { name: "宸撮煶閮钂欏彜鑷不宸�", cp: [88.1653, 39.6002], childNum: 9 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聵@脠脪膴anw艓V聞聶犬娄酮艃蘑聞脺艒葌莽膶茅茞聧偶L蓡贸膴聜膴a蕣艁卤炉虏Um禄藢m脠禄V聶薁牛W脩脜炉菗茅聝聶么茟茠臒脝墨艓墨@欠聶w么聶撕L脼炉屁V仟脩茠職蘑聶葮V掳w蘑聨么k掳炉茠禄蝷@葌禄母聨菙@蝷聝蛿么么L蓡贸虗脻蓽L刹艒酮聝屁贸扭K@墨@IU聫軆脹m然牛签脻斯脹菈钮菗谦艒@茲虏炉V莽艒K涂艁螚脟牛禄平聶蓞聧茟L聛脫艔聧脜脜杀V@脻膴U炉脩膴沫脼L職脼艓J卤虄X龋藢艒l聝U聛脠炉艓K脝茀掳聶X脩脺卤n艞摹V炉聶贸aU聝僻U艒艁聞脩聶卤聞莽刹楼l膲k臒掳聝k楼聵聝n臒牛L炉脻脻U平默蝸l姆掳@聞艒聞X每脻炉V禄殴L蕢脼杀扭膲聧贸掳脻J聶娄脻K脻拢牛脺聶脠膲@聝x签U膵聧茟@ky蛽鹿聶`U虏膲V摹禄臒a炉楼钮@膲聛聶聜贸@呕脹脹J聝w炉n贸炉摹W平施姆脻蓻w膲臅脻录拳脼姆聫艒@贸拢脜蝷茟聨炉么券脼炉劝聶脝艒猫膲X脟录贸@脻職n潞聝母聞脼V茰母葰U识玫藔牡臇杀艓脻臇V啖坝捬⒙八榥蠚V藢聶脠m杉牡纽W陇枚蕣玫蕯@掳脠XV聨聶猫n艓葋b炉聧谦聫膲聞卤脠臒`摹w艒脭臒禄mVV聨聛聞脻楼贸@聶母姆么@職職bX聞亩mV虏虏`脼_聵聵纱b酮脠掳聞脼W母脠艑m脼聞職k刹聨脠U脝禄n录乾V姆母藕么炉掳n娄蓜脟聹脠"],
                encodeOffsets: [
                    [86986, 44534]
                ]
            }
        }, {
            type: "Feature",
            id: "6532",
            properties: { name: "鍜岀敯鍦板尯", cp: [81.167, 36.9855], childNum: 8 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@屁楼職猫藕侉螛茟岍刡U啖災暽才嵞赌暶妒縑实姆葯U茮聝脻聞姆m鹿脼聶么@脠禄膴W艓莽職脜掳券劝脻掳贸茠聧脝涂膲禄探莽n聝m聫杀牡僻潞贸U聶聶平@卤w贸L炉掳袒L卤脝炉V聛拼姆b炉V脟楼臒虏菚bk楼脟Kl聧聛脜杀摹@脩聝聶贸K@聶脟a脻X臒聫牛x膲膶谦聫姆锚炉K@脩聝a殴聞茟K聝录炉V贸a贸n摹w聶贸脼茅U聶摹b贸膲臒脟l鹿聶aU贸臒KW聧聞聫V脜炉聧n聸脟艐茟聸姆n蕠禄贸x膲w聶莽脟掳脜w聶掳膵聞X聨聶聞贸b卤聝k脠脟J聴聝m虏牛x@脪脻聨職纽脟潞n聞贸录n掳脟bU脪卤录X母臓艂平Xmw膲潞聝z脠脺m聬nxmx虏臇m脪職bn聨僻锚U潞膴锚脝V贸臇贸U膲录脜默茟掳蓡茊呕艢l艂脼L職录n臓聝录@脼聶職脼藕@艓脼掳V職蓜纱卸霞賽蛨艓聞"],
                encodeOffsets: [
                    [81293, 39764]
                ]
            }
        }, {
            type: "Feature",
            id: "6522",
            properties: { name: "鍝堝瘑鍦板尯", cp: [93.7793, 42.9236], childNum: 3 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@Wn艕脝亩L蘑娄牛潞藕聞lx脜母平艢聜蓜聴漠聵猫@么虏脼U臄茞艅V掳炉母X娄茞m虗b茠禄蓡a蝷職蘑聶茞L摔聶葮脩n聝袉菈母每n炉亩a艓炉蘑臅葮炉掳聫蝹聹la炉楼聶菚菙w摔颖l钮袨袒n呕m聧蓛臅膵牛Uw掳WU贸屁脜牛姆掳媒V卤贸脜菗茅蕢炉平艁聝茅艒菛葋脻茝暖菚w斯谦葪菗僻菚V媒聶茅@默牛L僻么桐聞杀艓蓻K虖脼蓞么贸K@虏@掳艒艠職录l纽炉虐贸茰脹lV录姆录聝掳k劝聶虐聞臓聝乾聶艢脻艓m臇聛`@聬脟脺n聞"],
                encodeOffsets: [
                    [93387, 44539]
                ]
            }
        }, {
            type: "Feature",
            id: "6529",
            properties: { name: "闃垮厠鑻忓湴鍖�", cp: [82.9797, 41.0229], childNum: 10 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@V脝職x藢艓脼艓聝掳n聞葌脪掳虏V膴炉V臒凭藣乾屁脼脼K脠脼膴V藕么蓡脼蘑猫艑聬么W膶虏扭V脼母识bl聜炉么n_V脝母lm脼nV藕_母录犬m菛聞職茅母聛W掳掳聞母J聞k薁录脝w掳陇脠聝lx蓡z膶潞亩I虏脝菙U職掳么@脼娄聜聝U聧nU臓录艓脫蘑x臓_虏脟膴聝乾聬掳聨葌am艒職莽U聧脟W@炉枚蕮玫蕢X拢亩钮n苫職脟U藡m蠙炉藯討选岍僡螚茠聹蓽掳xW拼Ux蓛脪耍陇蓞w臒聞蕢艒贸脻殴聧卤掳葪@炉聞脝茠虏录", "@@艒聶谐w葋楼僻掳殴脩姆V聶录脼锚膴禄聜l牡職m娄脜W@膧么脠藕a蓽x脠b脼脝亩I袨艠nI脟艃脹脻膴脩臓茝"],
                encodeOffsets: [
                    [80022, 41294],
                    [83914, 41474]
                ]
            }
        }, {
            type: "Feature",
            id: "6543",
            properties: { name: "闃垮嫆娉板湴鍖�", cp: [88.2971, 47.0929], childNum: 7 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@刹耍膴I脠楼聜脜U卤膴媒k艒掳聝膲平贸禄亩平X贸实实聶券茟脜葋蓞炉膲@脟釄桲譀@@摔V譁实褉茠乾V母茟艓@茊席脩贸聨姆@蕠禄姆娄苇ml脠母膴X录W藕脹脼脻迅聜蘑膶镁聞膧膴么维V枚录膴U屁掳掳猫艓膶U脺脝聬贸么V么么聨虏锚葮l藢莽掳`n虏乾聨膴a職聶聝脹掳卤k聛臒mm禄職@掳脻蓡脹脜脟Va脻聧Vm蛿臒么脻脠b聜聧聞@聞聫聝聶n炉職聶脺U蘑脩膴@藕墨偶W扭脠菛W么艁脝I虏脫屁L@聨膴X聞mm脩脝禄劝脩k聝亩艒@媒掳m聴炉"],
                encodeOffsets: [
                    [92656, 48460]
                ]
            }
        }, {
            type: "Feature",
            id: "6531",
            properties: { name: "鍠€浠€鍦板尯", cp: [77.168, 37.8534], childNum: 13 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@膶@掳聝臓聞么脫么@艓膲@瞥母@扭拢蘑lV聬么WV聧贸艡X膲扭锚脼@茞脪蘑脩l猫脠V@職臓Ik掳脝艠@脠脠膧@嵌钮脪臒@職聞@脪膲l呕_@職僻臇脜默艒脝@b藕脼n聝茠lV聹脻默職W脝录蕠聞聝脻脜@脟脜脠wW贸膲卤臒z聜默膶屁脝聜脻I膲脻炉b脟脩膲聝炉蕡V聬掳xU虐膴陇篇_么脫蓺I@l葰X犬聶艓l纱葮諛職聞娄刹脝蕡_纱聨藕聨么脼蕣艓臓聝蓡x摔拢蓜脩VwX瞥炉w聸蓻殴侑聶莽僻娄艒聝購蛧械匣蓛沙U聶脻炉@艒脻殴職聶@脻聞禄m臒聶禄脻Kk艁偶艡蓞茀茠炉脝墨膴禄么V么臅脜U膲茅V鹿屁茅m聧聶an脩卤臅nwmwn聫脟脹聞y膲鹿殴l艔k牡猫姆m艒脼摹K帽脭膵K脜猫膲z聝聨聞么mx葪每瓶I@镁脜膶脻K脻掳@录脠聬V潞職@脜蘑職脝U聬膵艂n聞脻脝菚膶牡Jm拢脻J聛娄@膴聝xV掳茝L膵录签聶@聶m@脜蘑贸m脟脝臒鹿脟職聶脝職臇脼K職x聞w么娄脝脩脝L虏脝凭聨U聬聞聨卤艢脜聫呕臇@默扭脠帽聞@菙脟x聞脠脟茠", "@@V聧脟聶牛掳臒U臓聧炉mk炉贸楼姆I摹每茝b聝聞膲a卤脪母膧lKU聫聞_m禄nw職聨聞m@脠扭娄膲b脼掳卤脼偶艂苔掳蘑艁V茅"],
                encodeOffsets: [
                    [76624, 39196],
                    [81507, 40877]
                ]
            }
        }, {
            type: "Feature",
            id: "6542",
            properties: { name: "濉斿煄鍦板尯", cp: [86.6272, 45.8514], childNum: 7 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@萎n母楼蕡录母@么聧习脪@茀茠艒U姆茟谦识锌U譀軆L讷K@螊母@脝拢脼摹聛脜臓膵職LV脻聞禄聶@脜禄脻nm炉職禄n呕膴@n聛姆艃@炉贸m贸脹脻菬炉a脻贸拳楼聝職艒Umx膲b脟脩聴@聸bU潞炉X炉脝僻bV脪膲n菚w炉掳茟聨V聞聴聨脟@kx卤U聝職杀n聶聨脜K聝聞炉茠臓菭U掳蓽L@掳聝xn默聜膧艐艓脟L聝聨臒職媳脼苇茰k么脜膧菚艂聝母膴扭U虐蘑掳聞娄葌习脺扫掳x@掳偶菭脝茍膶V臓禄膶L掳脟職b膴脩虗贸脼l亩w脼聞蓡V脼w乾x仟牛脠录脺L艕亩刷@", "@@贸K牡膧V蛨膲艂凭菉脝扭聝zXl掳聝脝L虏录藕聨么脠蘑菙聶娄l聞么掳蓽脼蕣聫臓臒脜聝m禄实瞥茟蕽葪墨V楼炉膲掳脩@艃脜I聶禄膲聫m臒n聶聝a職聧聝膵屁b職聶V臒聴w聸摹炉@U聧艒a聶膲脻J臒脩脝艓k艓脼膧l藕聝娄"],
                encodeOffsets: [
                    [87593, 48184],
                    [86884, 45760]
                ]
            }
        }, {
            type: "Feature",
            id: "6523",
            properties: { name: "鏄屽悏鍥炴棌鑷不宸�", cp: [89.6814, 44.4507], childNum: 7 },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@釄楲@脠掳膴葌蓡茠脝膴拢聞钮么聛W脫蓡b蘑脜艓聝脝娄膶脩W楼掳姆U炉茝艃V膿卤脻@贸聴莽聵沫聛蓛凭艡脝姆kw殴聝扭鹿摹楼牡K艔脜Xm藣聬褖w菗陇茟聧@w贸聫艒V姆拢杀職摹么脹a卤脪葋聞贸猫牛IV聨平录k陇贸鹿摹Jmx聴禄脻U聝虏聶@脜脝聝母谦艓聞膴m艓乾諛"],
                    ["@@脼么掳b脼菭么脺么n@掳母艅聵嵌k艂聝录U脼聶K臒膶聜脝脻蘑脜陇姆@@螌诂L軇K@耍葌谁l膲脜聞W楼牡V脝媒@艃脼膿U艃葪茀@殴譬菚膲禄k禄脟聶V臒贸艡X聧聶聧呕K茝聨膵锚葋猫脹艓摹聝桐艅"]
                ],
                encodeOffsets: [
                    [
                        [90113, 46080]
                    ],
                    [
                        [87638, 44579]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "6530",
            properties: { name: "鍏嬪瓬鍕掕嫃鏌皵鍏嬪瓬鑷不宸�", cp: [74.6301, 39.5233], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@藥谦臓平掳UU膲炉卤葋脩m聝聞炉脻艒藡艒聶wU脜卤禄脜茟掳聝葮@虏炉沙聧蕠`杀脜聝楼諚聶沙葪艒k拳職葯W@k蓹J贸脭譬`膲拢V暖炉wU聫掳蕠膴聞脠脪掳a膴脼脼J脜聛膵僻聛墨臓y膴虏X么脟x脠脝脝@聞脼蕡聝脜禄聶X脼墨U聸茟km聞殴脻@a艓脜脝墨屁臅@聶偶`膴k@脩聶聝臓@纽脩@堑脟每@脟脜艞l炉臒J@聶脟Uk莽摹脪茝脩脻@牛茅W膴么艢U聨贸XU聫摹k牛陇姆@@拼艒膴贸@贸脭臒聝炉聞膵@@脪職陇k么耍虐蛽聞k禄聝KX炉膵w僻么臒蓯職脪么IV脝聶職炉U姆乾姆職n聨聶录么b掳脪劝VV脠脼掳聝母贸陇V录掳聞V掳虏锚聝l蘑脪聜U屁娄么聫劝拼膴VV录菛I膵膴聞脼蓽茅職n膶W烁歉職a聞艡脠w卤墨職莽母陇膴聧職么職w職聨母U蘑娄聵茅菛默聞膧么录l脼k脪掳x掳茊脼x聞職脝V虏聬菙禄聞b掳w脼聨葮楼掳n聞職艓V@掳聞聞薁猫聜虐葌b"],
                encodeOffsets: [
                    [80269, 42396]
                ]
            }
        }, {
            type: "Feature",
            id: "6521",
            properties: { name: "鍚愰瞾鐣湴鍖�", cp: [89.6375, 42.4127], childNum: 3 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@么K聞膲仟a虏录l脺么@薁锚掳默聶么葌聝虏脩脺b蘑贸刹聶母陇艓U么聬@x茠聨菙拢褗x藥聫m聝脠脹@聫聜_n臅脼艒職艡聞谦聝臒職暖l券聞炉母禄U禄脺k么茮掳暖k钮聶禄艓艞@炉@卤蛽贸涂聞菗@姆聧葋录涂@茟录炉掳贸l摹聧炉x葪U摹職茟聶签脪僻U脻掳斯K贸職職x@歉艒默脜默茟臓贸茠聞職菙锚脝掳X脪薀扭U職脟录藡nn录卤V虏掳葌U艑脻聹b薀菙蓞么@偶乾a規脠"],
                encodeOffsets: [
                    [90248, 44371]
                ]
            }
        }, {
            type: "Feature",
            id: "6540",
            properties: { name: "浼婄妬鍝堣惃鍏嬭嚜娌诲窞", cp: [82.5513, 43.5498], childNum: 10 },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@膲聞脝艠葋虗m脼炉膧X掳卤录@凭炉拼掳艓脻镁艐娄W脺脼b葌膲藕U聹脟mwVU葌贸么@劝脻蝷聧n聧脝Jn聶凭聶薁聶艑L膶贸仟炉聹楼菙a菛職艑a么脻蘑L職x聞聝脝L職聧刹m聞聶虏Vlw脠@聵聧U聝茠聧掳炉菛x膴mU脩屁a掳脜掳WV鹿聹a聸脟蓛脠m楼掳炉殴贸母姆谦Um禄脜录脟V杀聧聶l脻聝艐n姆脟脻X炉聝桐脟沙a聴聴脻`卤_U卤牡nW聝聶a@聶母贸職姆聶炉菗V卤脜牡J膵鹿蓞ykw脟聞炉拢脜x薀禄聝l姆I炉聝X炉姆聜聶锚菚聝拳n姆禄殴`卤聞k脼@聨職聞脻么@脼掳x職扭艓I屁脝Ux艒職炉虏菙默乾lU艢"],
                    ["@@脼膧l藕聝娄炉母扭K脼聶職聧聝膵屁b職聶V臒聴w聸摹炉@牛聬平J"]
                ],
                encodeOffsets: [
                    [
                        [82722, 44337]
                    ],
                    [
                        [86817, 45456]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "6527",
            properties: { name: "鍗氬皵濉旀媺钂欏彜鑷不宸�", cp: [81.8481, 44.6979], childNum: 3 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@萎茮喜脻臓聶聞聧脠K艑艒聛每m墨聞w@炉蓻KV炉臒菬掳茟聶w摹K贸脼艐b菚聶菗b聸娄签掳膵么艐K薀職平職m職脜Im聨涂聨券脼贸@葋么UVnx聸脠殴V葋膴脻a聛b呕拢炉掳l聞贸x葌扭母k膴職脼y膴锚膴m蘑xV聞屁聧脠聨臓X聞聨螛脝臓脭藕聜蓡牛掳LX聫凭聬扭聫扭b"],
                encodeOffsets: [
                    [84555, 46311]
                ]
            }
        }, {
            type: "Feature",
            id: "6501",
            properties: { name: "涔岄瞾鏈ㄩ綈甯�", cp: [87.9236, 43.5883], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@職聨W聨么艢U臓脠職l录膴录篇菛@藕葮茊@媒l脺職XV艠脼聶職娄V录k臇贸脪聝猫k膴葋水譁@谦諚n艒聝膲乾艒聞姆脝脜職@聞卤脼V聵录nw蘑I么潞l拢凭禄U聧扭J么莽職贸炉墨薀茅贸@k脹卤禄签b聝膴贸L覎脟谦b@呕蓡贸薁菗聸a艐脼葋V蕢艂膲b膲聛蓞么"],
                encodeOffsets: [
                    [88887, 44146]
                ]
            }
        }, {
            type: "Feature",
            id: "6502",
            properties: { name: "鍏嬫媺鐜涗緷甯�", cp: [85.2869, 45.5054], childNum: 2 },
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    ["@@蓽脼蕣聫膴媒Va脜聝m禄实瞥茟蕽葪墨V楼炉膲掳脩@艃脜I聶禄膲聫m臒n聶聝a脻職牛L掳姆贸K牡膧V蛨膲艂凭菉脝扭聝zXl掳聝脝L虏录藕聨么脠蘑菙聶娄l聞么掳"],
                    ["@@凭I扭聫@UUw艒a聶膲脻J臒脩脝艓k艓"]
                ],
                encodeOffsets: [
                    [
                        [87424, 47245]
                    ],
                    [
                        [86817, 45456]
                    ]
                ]
            }
        }, {
            type: "Feature",
            id: "659002",
            properties: { name: "闃挎媺灏斿競", cp: [81.2769, 40.6549], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@nI脟艃脹脻膴脩臓茝艒聶谐w葋楼僻掳殴脩姆V聶录脼锚膴禄聜l牡職m娄脜W@膧么脠藕a蓽x脠b脼脝亩I袨艠"],
                encodeOffsets: [
                    [83824, 41929]
                ]
            }
        }, {
            type: "Feature",
            id: "659003",
            properties: { name: "鍥炬湪鑸掑厠甯�", cp: [79.1345, 39.8749], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@V茅V聧脟聶牛掳臒U臓聧炉mk炉贸楼姆I摹每茝b聝聞膲a卤脪母膧lKU聫聞_m禄nw職聨聞m@脠扭娄膲b脼掳卤脼偶艂苔掳蘑艁"],
                encodeOffsets: [
                    [81496, 40962]
                ]
            }
        }, {
            type: "Feature",
            id: "659004",
            properties: { name: "浜斿娓犲競", cp: [87.5391, 44.3024], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞莽么脩l臅U禄聶楼脻職U艞聶Wk脹@镁V艅脻臄@艅脜镁亩UX娄脝聝"],
                encodeOffsets: [
                    [89674, 45636]
                ]
            }
        }, {
            type: "Feature",
            id: "659001",
            properties: { name: "鐭虫渤瀛愬競", cp: [86.0229, 44.2914], childNum: 1 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@l艁聴堑m聜膲@m偶聶录n掳脼m脝录職@"],
                encodeOffsets: [
                    [88178, 45529]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/xi_zang_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "5424",
            properties: { name: "閭ｆ洸鍦板尯", cp: [88.1982, 33.3215], childNum: 10 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@屁蕯母b脺潞脼wnx藕b脼掳么@聞聧亩聨母I脠录膴J艓脠么U職脻茠陇菙L脼聬艓@蘑聨葮bl聝么L聞脟藕莽脠陇么L職楼脼I脼炉亩x蕣钮屁聶瓶脩膲XV姆纽炉葌K脟菚職脩炉IU聫職拢炉脫瓶拢V臅脜聧脼每脝w聝茟聞拢菛x脼臅卤脟脻aU脩脠聝U炉聜聧U艒脠脻聝wW艁牡聶卤脻聞贸蘑每掳I脼卤m脜蘑炉m每聞楼掳Un脩扭聧蘑臅亩w乾呕酮w艓录藕脟蘑聞臓臅藥艁掳贸屁录脠a聜m聛聧@楼掳w菙聞菛聧掳聨屁脟扭聹職摹屁聞艓艃么b脠脹艓膴掳@臓w虏脩脼J脝聝脝b虏聝掳锚膴U脼聜l脠虏聝V聞脠K膴脪母膲聸禄脜聛么钮U脜脟聝k炉@脟聜脩k聧l脟聛脜l聶蘑聶V脩贸聝@聫掳@聞脹母聝V炉聝脟膴聶n炉U臅職聧平炉m聸炉b聶脠@脪掳默聝b牡聧聸录聞聜kx姆媒脟Jk拢脻aU脩脜贸亩菬k脫蕢n膲聝脻录茟聞贸禄脼mn拢m聶膶炉@聝犬每V炉母聝聶k@脻贸w聝禄臒聞摹卤菗L艒聞聝職V录茝猫姆膲聶猫卤b@脪牛聞U脩贸ak聝l拢聶脫@聧炉L@聶脟lU贸葋職炉a摹脠脜臅脻L姆聫炉臇炉@W默聴x聜脪脠nW掳牛么U虏菗脫摹虏V掳炉么聝菙脻L聴聧膵職k聶職禄脻禄脻職炉脼聝V聝w脹聞脻脟艒桐脠膲膵禄膲m炉拢W楼牛Kk贸摹茝聛W@炉卤k艒聨聛脠聸b@脪聴職脟a聝脝炉a聶聞聝k贸聨脹聝脟娄脻a炉職脻聶膲@脟禄脹聞m聝菗x姆茮炉lV膧脜脼摹b聶聶脟JU聬脜V聶臇茟W聶z艒禄艒職聝W聶n@猫炉脼贸Vkw譬nk藕脟脼聞脪聶脼炉聝聝媒臒脟Ux脝脠n猫卤b膲聧脻禄脠艃聝w職w脼@m禄脠V@媒脟掳姆聶聛x聝a聞脻炉X膵楼聝脠贸W@么kxln聛xV脠贸膴k扭摹录@掳炉虐茟L袒虐卤艓脻V聴脼聸V聛聝脟脼脜聨脟ak茷聜職@猫臒艓母偶職凭掳脪職L脼么臓K劝臇藕V脠脪臓聬聞陇聶聬V么職聨U聞脠镁钮L@么乾脼l脺脠n脟脪U艢聶@聛職膴屁W掳聶掳X聬聝聜@膶脟镁聞拼膲脪姆娄@聨蘑么W膧么艂U脼蘑乾聶藕掳录職@聝么V掳聞bU脝nzm陇平母聝脠"],
                encodeOffsets: [
                    [88133, 36721]
                ]
            }
        }, {
            type: "Feature",
            id: "5425",
            properties: { name: "闃块噷鍦板尯", cp: [82.3645, 32.7667], childNum: 7 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞脟凭姆n拢myV脜聝aU炉聞贸聶@炉禄職殴摹谦V脻贸艁X每摹贸@聧母楼膴脩聝瞥脠媒@膵聞聛W聫職炉X炉膲僻聜聶職@V艡脠脩脟mk脹谦脻@贸纽K脟媒V聝聶聧U贸職聫聝拢臒聫脟脩殴U券臅臒L脻贸聶K炉脩聶平姆呕臓艒@莽聛聶l茲脠b脝聧脠脻聜聞聹U聵脻脼U虏艒碳暖茠K掳暖@炉UK卤聛聴膴僻b艒脟m莽脠摹聝贸職脜贸b聶聶藕贸職楼k墨脝炉贸l聶莽聶K么牡U聝脜聞V艃姆楼n脜艔m炉鹿脜聜聶禄@脩脟聧贸x脻k蕠趣U陇姆b@茠炉膴脟x炉母膲Km掳職膧k娄l聞聞Kn默葊凭脹娄W脝脜聬m菉膲掳艒U牛陇U職艓聬掳職艓K脼艂脝聞菗娄聝脼聶聜聶聛聞艡炉bm聫U聬脻l炉Um聶臒l炉拢葯w脜聨谦a脻n膲亩聝k@炉聶K聶職艒禄膲n聶a脼禄钮nkml聶母楼U脜職呕k脩钮聝聛膲V聶么贸掳L么墨臓U聞每膲菚脜z卤K聝陇聞虏艒陇炉臇炉U脻楼V牡聶贸脠钮脻w姆脠聶脩k陇贸聞聶聝W媒牡臅聶聞V臓聝V贸聧聝聨菗聞姆掳k聛卤VU卤牛娄U菬脻脜聶JV脩聶楼XU膵U脜聨l聬脹茊菚脝葪茊炉w艔脼脜@聶職膲l脻聛贸聨聝脪聶nU么脜聞lx贸l脻么脹聨卤聶聶L脹么脻L@聜摹炉X炉脟U脜录贸a贸陇聸录X脪摹艓贸Lk娄聜么脜录母臓聶录聶K摹茊么娄聞脝茟脭膲亩炉Im脪掳娄n掳炉脼l聵脻膶n聞茠脪職K臓脼職臅k聝l媒凭钮聹職么I聜臇扭脪n茰m录炉ln偶贸脼@女贸娄聶么平臇膵艢n掳脻掳么脠U茰聝bl脼贸聨@聨菛么掳U脠茊掳X聞镁么聨么聛聜l癣聬職聨虏臇m娄掳職@陇聶聬X聨膴bl脺職zk潞茠臇mX聞職艓WV職贸脼n掳l聬臓x葰a掳禄偶L藕聝聞b@脝掳X臓脻葰x膴臅扭a葰聬聜掳脠@聞聞@猫扭娄脺录聹W聵脼k聨脠@V聬掳l扭k艓卤虏娄茞U職菈掳a脠脩艓b蘑聝艓b脝楼脼I葮l職職么V脠U聜聶職b聞k刹亩n聞mnXb碳貌凭臇艓@蘑聬葌脩么脫臓臇蕣職膴脭"],
                encodeOffsets: [
                    [88133, 36721]
                ]
            }
        }, {
            type: "Feature",
            id: "5423",
            properties: { name: "鏃ュ杸鍒欏湴鍖�", cp: [86.2427, 29.5093], childNum: 18 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@亩臇X镁職聞么聝l拢職脪母脟脼x脟纽職么U亩脼娄掳V掳臅艓拢聝卤聞拢虏L脝y膴菛聝膧臒V贸默炉K贸么U職聜膴纽聞l脪聶偶V脝姆娄k職ln纽m脻录職b膴m艓录職聶職L@掳聞l膴牡脼m乾b脝聧葰x掳陇臓kn職掳V脼kV聫n聬掳a聝艢職聜職聛聞脻菙楼脜聝脻艁艒L炉聶艒聫V聶扭拢艓V膴炉n菈脝聫X脜脺楼强平m墨聝Lk聝l楼聶每n炉膴L掳姆脠w掳膲@茟母aV拢蕡龋脼l么w脠聨@脪職录脝聛掳潞艕nm脝母娄U艅脝聝V聞贸亩職L職猫么k脜掳l默聶娄殴么職職么a聶脝聞么脟蘑n猫艓脠屁a聵膲虏聜VL蘑禄l牛么膲U脟聜wkmlw@贸么X聞脟膶娄掳W聝脼聞b聜w母職脠炉@镁脟Un录脻@聶x聞x脟艅脼录膴聨虏am莽脜脟Vw臓脠聞镁掳聞職脻聝脩脠脻l殴篇mlx么U掳脻@莽職m聞X艓聶艓录職y茠X職臅脝UV聫脠I職職蘑a脝脻U每掳k母茰菙wn聞脺聝脠录膴@脼職掳聶脼b脠楼脺聞么聧聞l職聝掳b聞脜脠b聵聶@脩聹a聜脟炉UU炉V摹職禄聝聶炉aV聛炉脟掳脜聶mn脩扭莽乾V乾聶卤膲炉楼V臅炉脻k拢聵艒聴w@卤摹脹掳脟V脩聴聝@脹聵a@聫膶L聶瞥聶聞聝聧脟a炉陇脻I牡录U楼瓶聧艒姆脜牛呕贸k脻贸臅聜楼炉聶U禄脝拢X炉摹艃脹k脻掳V掳贸录炉猫W么脼臇聞葞聝聨k膧僻膧贸wm楼炉J脜鹿脻J脻聶艒VV脜聛a脻聬茟@聝聵臒怒脟聜炉_聝聵牡聴聸Vnx脜聝贸n聸聝牡x脟臇膲V脻脠臒V聶脪贸聝炉聬卤呕膲拢姆脝脜L聶菆膲媒聵牛脹聝炉V聝nV陇脻脠@掳脜脼脻陇聶虐臒艁m娄脻x贸K聝楼杀脠U臓么锚V么脹录脟W脻莽牡a艒娄贸臇僻l脟蘑茟聨n艓脟聞V录聛录聜潞脹@m娄平聞膲mm炉脻K脹莽炉b艔艂聛默聶b聝录脜Lm聨聞x钮掳脜U聶職脻Xk聨脻m膲娄W聞炉K聞脪kn脻aV聞脻猫炉K蓞艅脻Kn脼炉录"],
                encodeOffsets: [
                    [84117, 30927]
                ]
            }
        }, {
            type: "Feature",
            id: "5426",
            properties: { name: "鏋楄姖鍦板尯", cp: [95.4602, 29.1138], childNum: 7 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聜V脠艂V么脠k@職掳K@聨職脭k陇l聞么bV脪扭聝@脩虏a職莽母膴茞莽U禄聞聶艓聝菙K蘑虏臓聝聞录么x@脼職l屁默聞Ul炉脠LV聜職聛脼J聞掳脺n蕣聫聞w脺bX锚聜V脼炉掳職職anaU聫掳w脝录纱脩W脩掳m脠媒脠am楼脼拢扭@聞楼么bl脼蘑聞藕楼么x脠脜m脻職聶聝臅脜聝V禄膲艒扭艒n贸聝禄脠墨姆IU聝臓脩掳摹母L脼炉V脪脝聜@膧聛b職录W么脠@V录么贸扭K脠脩U禄職wV谦偶nW脪脠x聶录聜l纽拢膴艒扭x虏炉@聝脝聝U炉職莽脝@聞陇掳拢聞茅掳k掳l職暖脠贸@炉扭脟脠膲聝kk每贸楼脻X姆脩聶脺@脪贸艢脻炉掳膲贸w聛脟卤娄脜JU脪膲膧姆w炉掳m臇炉聞卤akx脻脜n聝聶禄l脩聝K@聧炉lU聶炉UV脩炉贸膴炉m艒臒V菗茀聝脼聝W脻脠脹@瓶么炉脺摹z脜镁炉聧贸lm么蕠聛摹膴脜U涂艡艔葋藡艁贸脟恕艒僻聝脟b聶w聛掳亩么k娄職脪聝nU镁摹脪聶脭k菙姆猫贸@聝虏@艠艒艅牡y聝z摹a脻陇脜I聝陇蓛聧钮娄臒脩炉陇姆b贸職炉贸卤聨U虏掳陇膶聧脺Vn脠脝聜聞艢艓掳么蘑聞镁脝z聛猫V膧脟聨聛膧脟聵聝X殴脩炉陇贸w膵姆k娄職艂U脪摹z脟@聛聝聶脝脻x@虏脼@脝陇聞U么娄U職掳x聞U"],
                encodeOffsets: [
                    [94737, 30809]
                ]
            }
        }, {
            type: "Feature",
            id: "5421",
            properties: { name: "鏄岄兘鍦板尯", cp: [97.0203, 30.7068], childNum: 11 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聶聨V臇m掳膲職聞脠U掳姆聞聝脺炉@@聬么聞U脪摹職k職聜脝k脠l聨聛脪@脠l掳脠聞V脝贸纽脝聜聹录聜a聞脜蘑聶蓜wn聫艒w@楼艓娄掳殴脼mV職掳wn每聝w聞w脻w@炉職m脼艞掳w臓聵母k脼臒l臄虏娄掳@聞臅母wV贸職al@n蘑脟膴n掳@娄職聨藕UX莽菙暖母V職聶脝K聞脠脻臓職虏脜臄么@l聧職聨脠_m聵聞z菛聫l聞職aU录么wV掳炉娄聜默脠a聞l@膶脟聨聞录聶聞n聨聵I聞x么禄蓽@屁楼蓡艁聞艃仟葋k茮屁葝蕣取贸沫聸@聴脠脟V聝暖脼聝母茀m膿屁钮聶脜脠蕢V堑掳摹V怒脜骚掳每n蓻職拢m聝姆聧虏艃贸脩U膲掳m脟禄炉@mxU膧炉猫牛聧掳葋脻莽聞摹U炉脝脟牛脠@掳脟么聶虐炉k炉l聝锚炉陇聝拢脜@聶猫V掳脜聞@聞卤掳牛w膲艓钮陇聛k職禄脟wX脩呕mU乾聶xV录脟脪牛L贸么U禄脟@X贸聶禄聜a@每脜聛U脩脻掳姆K炉蘑臒脪V聞母J脟默聞录m么牛艓膴艓U录脝聞聞臇聶職n脼脟脝贸w殴娄摹聝k脻贸a聝娄牛@脻陇n娄脟b脟镁炉nX脪沙脪脜禄炉xV聬mb聶b炉聶脻掳聛UW茅脹a聝x蕢聬脹m聝炉脻I聶聜U聛脟Kk掳聝V僻墨姆聞U掳拳膧@聞膵掳n職m陇脻n么录茠聝脼禄膴聞蕣ml脭牡菭脝么V脪脼bl陇脠I母镁lw聝聛聹禄亩聨聞a炉墨@脩職脟掳an聹凭掳"],
                encodeOffsets: [
                    [97302, 31917]
                ]
            }
        }, {
            type: "Feature",
            id: "5422",
            properties: { name: "灞卞崡鍦板尯", cp: [92.2083, 28.3392], childNum: 12 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@掳脼U臇掳娄虏膴么脟脺L菛膧蓽聨葮虐脼L母聫藕锚脼@U聫脺U扭掳蔀炉脺聞掳W纽膧m艓聞娄蘑yV脩聶艁l楼膶母么x掳拢藕脪聞W脠聴聜每脠聧U每聜莽脜y聝媒贸摹艒炉聝艡脜聛m脟脹U膵聨炉拢V卤虏聧掳么么聶母a掳拢臓脪纽楼蓜聨聞拢脝J脼拢蘑b聞y亩z艓艃@艞聞卤么@母莽l菗職脫蘑脩V媒聞m聶脩l楼牡贸聜炉袒胎聶茮谦脻一脟僻聬膲y牛录覎膿V亩膲艓掳母m職脼V脻母聶脪脹a膵聞贸聶殴臇聝猫脠脠l录k陇脻X@`脼聬艔录聛脝艒录脟莽膲KU脻脻拢臒陇@娄摹l炉脪摹聬膲炉贸職聶m贸x脻脼臒V職拼膵K@聬聴b@脺聵聞U脪炉脠蘑脺@虏聵x聴艓l陇"],
                encodeOffsets: [
                    [92363, 29672]
                ]
            }
        }, {
            type: "Feature",
            id: "5401",
            properties: { name: "鎷夎惃甯�", cp: [91.1865, 30.1465], childNum: 8 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@艓聧虏l@掳聜X蘑茞l么扭LX娄掳陇膴n膶录脟膴艓酮脼脠脺聝聞x聞U掳脻脼聶脼录聶录l職膶聶聵聨脼K聞菗掳贸U炉蘑卤菙脭V卤扭贸X炉脟m聛脩聵wX墨掳@掳臅母聬脼K脝臇蘑脟掳b葌聶脟艁聛U聝V炉wV聶贸楼聝V脜拢脻@@卤脼w職脜聜聞脠@聝楼n艒钮每炉X脹聝蓾掳牛炉脹VV聬脻@殴茅姆聬脻K葪暖蓻聧菚每脹K贸脠谦職谦U牛猫m脪職n炉脝掳脠U聜掳b聞職聶录U蘑V掳掳V"],
                encodeOffsets: [
                    [92059, 30696]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/yun_nan_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "5308",
            properties: { name: "鏅幢甯�", cp: [100.7446, 23.4229], childNum: 10 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@U聜么虏聜a@聨虏虏亩楼聹V掳職亩聧虏bl陇k聬Vxl聜@聬聹掳聜艢虏@聵聞聞y聞@么娄炉聞@x聝xVxU聞V職職bV職聛脺m录艓聞聞蘑m潞XXW脝@膧聹職m聨mXU掳脜脪m录脼x掳w聞@掳聜X锚臓聧掳禄nV掳U聞l@k聞@V卤么墨@拢聜聝膶艃脝拢聞K脼媒@楼聜k@y聞a@聴nWV聧聞UV聝職w聝m聝拢聛J聝knm@wmkn聫聜X聞聵職X聞楼mUU聫lUnb職炉掳聨nk聝聫VIn聫lIUw掳聫n聶m聧k@@mlanXlanm職k@wVWUw聶_@茅臓a職聬nmUa脺拢聝mX聧聝楼炉@@聞贸Um脻炉炉脼脻lKnx么拢職禄聞禄臓聧聞J掳aV聧聞U脻每V楼脹b聝I@wm聨贸n炉y脹L@聝Wk脜聨m脠聶`聛IWa炉K@炉mUn聧maXm聶bmak聞炉聨聝蘑聶脪脻m炉聛mV炉K脟b炉K脹聹WW聶X@a聶V聶聫kn膵LUWV聶kX贸W@k聶a@聝贸b炉U聝wmb聛楼UUlaU楼U拢ma姆職聝KXk聝m脻@kwm脩炉聧k卤膵bUUVaka摹娄聝聝kL@`聝聹聶a炉x聝m聶聬脜聝聶LUW聝@膵n脜聨UV掳LkL@b掳掳@陇職虏聝聜職n么么k聞l掳k猫聸脪脠zV陇脠聞W么么聝nV@聞聝娄@录Ux"],
                encodeOffsets: [
                    [101903, 23637]
                ]
            }
        }, {
            type: "Feature",
            id: "5325",
            properties: { name: "绾㈡渤鍝堝凹鏃忓綕鏃忚嚜娌诲窞", cp: [103.0408, 23.6041], childNum: 13 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@掳掳n脼么V@聝掳@聞娄W聨聞n脹陇Vbmn聶聫臒b@锚職`VxUX@x職聞脝聫脼Unn聵W脼母蘑聝職脠@聨脟猫@z脹脺W職脜锚l職虏聞聵KnV炉臇膴x@bk@@聞掳J脝拢脠bl聫聞nnm掳nl聫UkVUUwVm聞Kn聞聜nV聨脼xVLX楼laX@@xl@Vz脠聨Vm職k@b掳職脠母m聨V娄聛`W聞X職聝bUb聜bX录掳x@a職VVkn@l镁nXUlVx扭脜聞y聜IU聝ka聜I艓膴@lXx@b聞z@聜么聞聝楼聞_V@l聜n@聞聛么y@al_l`n聛m聝脠禄@k聝mXwWK聶U炉禄聶a聶脜@w聝mU聧脻KUa聶UU聝聶wW聝@w虏禄@k脝聝V拢聴mm拢VKk脩V@@禄nw聝楼聶聝@k脝聶nllIVlnLVakalknJ職聛WmnaUaV脩VV脼聧n楼m聛@聝聞炉U每l聶@聶聶聶V莽聝aXaV炉UyVLVk職@nJl職XLl聨kxlbla虏脪l@n聛VJVk職x聞KlkUa聛V姆聧脻脩U聫@脜m炉@卤聶U贸掳臒艅姆臓mU聶脩@脟炉炉脜录@nml@掳炉聬炉`@w聶拢@炉脟聝k@聝禄nm膵炉U禄聶I聶聨炉L脟亩脹n@b贸掳聶U聸職聛wm聨炉聞聶Um脟炉a聞聶聝聶聝I@ykI聝VU聨炉b聝I臒聨聝录聶录贸陇mwkL脻脼"],
                encodeOffsets: [
                    [104243, 23429]
                ]
            }
        }, {
            type: "Feature",
            id: "5326",
            properties: { name: "鏂囧北澹棌鑻楁棌鑷不宸�", cp: [104.8865, 23.5712], childNum: 8 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@職w么聞職@虏炉maUm么U脝x職@X職聵b脼InlVUVw聞JVaU聛聞K掳楼聞xm脼XnlKlnna掳@膴聫膶聞脝wUmnkl@掳聝聝拢nyn@V聧V@Vak聶聝@@k脼脻聞bmx掳Vnw掳kl聫脼In臇脼VlKl聶@聧Xa掳聞聞KlV聞U@聧職Jnx聜U@脠蘑bUKlm@ak_聜w職anWUk掳聝l禄聞k@Wk@lwU_聝@Ual贸U楼聝脟n聛聝聶kJW聧聝@聛聧mVXx卤b聝K@n聛V卤a@聶脜a聶拢脻K虏聝WknamKkn脟聫k炉聝aV聶聶V炉膧聝U聶聞聶脪聛楼聝I@mm炉炉x脜聧W@@`k@贸禄聝UU聧炉lm拢脜Wl牡聞w@mmw脜mW聛聛U@y卤U聴xmwU聞炉U聝楼脻楼炉拢m@k聨脟VU聬V掳Vbkl聝L聶wUlUIm聜k@卤脩kbkalwk聧WKk聶mI聶@UlUKVzU掳Wb聞bU猫職職@職k職V膧聝掳@聞n聜m娄脻聨UUU脪VbmbXn聶聜mIkllbUbmKUkkJmk脜職@l職聞聞娄mx@录U@l脪ULn陇聵nU陇脜聞@l卤录@xX聞職xV聞職VVb脼LV聨聞n@x職脝職b掳录職V"],
                encodeOffsets: [
                    [106504, 25037]
                ]
            }
        }, {
            type: "Feature",
            id: "5303",
            properties: { name: "鏇查潠甯�", cp: [103.9417, 25.7025], childNum: 9 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@脠娄lK脼臅U聧V聫炉Um炉聞脟VUnVVU聝膲n聶膴脟凭Ln掳掳脠聞J脝w聞@lb脼a聞娄V聞XJ掳炉W炉聞a脼JVkU聧職a聞聝@聧lKn脜mWUk炉a炉禄@聧m卤@脩聝kkbWWX_W脫U禄聛_l聶k脩m@U禄m@聛l@IW膵n炉l@VanV聞UV聶U聧VwVx聞K脠聞VmU膿聜@聞聝n@V脻脝L聞w聞VVwnVlmkUV脩脟掳ka@k聶每脻a脼Ul拢聶聸聛聴膵臅X卤卤膲聝a@UnVnal贸nk@wl聶UVmk脻J聴aW聶聶@脜w贸VVnnb卤掳聶@贸聝聶xXLWx聞n@l脟录n聞m聜k_k`@b贸z聝聜m@k聛U@聝`聞娄贸聝@nW職@脺脜XWw聛@聝y聝b聛娄@脪lnUb@x聶l脺聬k聜@虏脟@U聝炉bmy@聬kV@b聝b聞娄U`lLVx@b聴Ll录脼陇@聞掳VV脼聞U@W脼聬Ub聸J@nn職@lnnm聞職xU聨聝UUb聝K@職脟wklkU聝VWakn@聨lbU@@聞ULVxkKUn聜掳炉脪@录聶聞km聝娄m@kl聶劝@lU聞l娄聞@Vl掳w職nn镁膴U脝bUx聶b聞聨V聞職臇U掳聞a聜nna職V聞al@@b"],
                encodeOffsets: [
                    [106099, 27653]
                ]
            }
        }, {
            type: "Feature",
            id: "5323",
            properties: { name: "妤氶泟褰濇棌鑷不宸�", cp: [101.6016, 25.3619], childNum: 10 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@m脪聛XU`Wn職職聶@Xl卤娄職聞Uxnbl掳knmKUx聞聞聝xV么Ux掳录么脪脠聞掳Jln脼K臓聬聹W掳娄聝聞Vx虏JVw職_掳楼@UV@@wnymknK炉I@聫聜聶虏b掳聝職拢V楼職wU聧聜V聞陇nL職k脝J脠w么么掳聞l禄膶炉聝摹V聝UU@聛@聝掳聝聝脻X聧l@U禄掳脜聞@U聫聞炉@w卤炉Vm聛UUlm@m聶聞脩nIVyUwmak拢Vwm卤聴@脟w@n聝@Uxkwl脟nL聜mk脜聶@卤聨k聶ka@k贸JV炉脟禄U拢lw炉聶Xalbl楼炉UX聝@a聵聶Ua脠L@脟VIV聝kaU炉mm聶akLWkUJ炉Umxn職聝@聝kUx炉x聝聞mW脜墨脻kkb聝扭聝bkxWmXwWk炉w聝Kk聝聝L脜陇膵艅聛聞@陇贸默U虏聝@@l聝k炉VmU炉录@xV@k掳l掳kbU職掳nm聜VnU職@掳聞職聞UV猫脼聝脝bU脪脼nU娄聸V聴录l么聞@Vl"],
                encodeOffsets: [
                    [103433, 26196]
                ]
            }
        }, {
            type: "Feature",
            id: "5329",
            properties: { name: "澶х悊鐧芥棌鑷不宸�", cp: [99.9536, 25.6805], childNum: 12 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@lb聹KVIUa聵@虏m@b聶x么脪脺xXLmbn職l@職聞聞K掳職職录k聞U么聜x么lV娄nJ聞U職聶脝n職m聞@職x聞聧脝w職bX職脝聫么么聞LU聧Vw么K@wlm職aVw聹@Wknm聝IUml聧nJla@_聶@k脻mKUa職脩m炉Xw掳aUaV聧l禄虏JV聛聞b脝Jk么亩膧虏VVk聞m職bVwU贸聞w聝聝VwnLlmk炉maVw聶聝虏楼Wk職@聶聶XmV_聜Wn脩Uk聝@k贸聵禄聹UV楼脻mV脩脜a脻聞U莽聝V聝聶@炉V聶Umn聛炉mV聶lak炉l炉U@@w臒聨W茅炉聛聝@炉x脻w炉職炉J膵a炉聛U楼mLU陇聞b脼趣聝b脟L聛WUwmIUVW录kb職`U聞Vb炉L卤膴脹k聝每脻Kkw聝K牛锚聶U膲镁聝脠聝V炉脼VbU聨掳KV職k虏脻聜mI聴聝mV@k聝m聶Uk職Vxm聞炉KX脠姆JU娄V掳ULWx職L@m么聝職b@bkx卤LnVU聨VLnk脺WnwlL脜茠mW@kkJU_聝V聞職W膴聞脼"],
                encodeOffsets: [
                    [101408, 26770]
                ]
            }
        }, {
            type: "Feature",
            id: "5309",
            properties: { name: "涓存钵甯�", cp: [99.613, 24.0546], childNum: 8 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聜x蘑聞l`虏X掳聨V聞職x@x掳脼掳KXa職臒U脩職W聜bnIl`X虏掳b聞xl掳聞聞職V@xVxk娄mb聞l@x職XV聜脝zX陇聶聬脝聵k聬掳聞kx@l藕锚laX禄VUnJVx聜X脠K聞a脻龋聝aV拢nKV娄掳聜膶b掳I掳聶n禄脝脩V炉nWn聧聸聶@每X脜WWn鹿聝摹艒聝n禄聜脹U聶聶aU聶V聝Uw聞w@w掳聝贸楼聝@聝z聴聝卤@聛艡聸炉@聫k聛Uwl聫k拢卤a牡聨炉聶聸U牡娄卤卤@聧聛b贸卤V聛脻@贸陇聝w炉I@m脜聞贸m卤聬X聨炉I贸l聝K@聬職掳Ullb聶zkKlln@@脭聶潞聝UmVk虏么脪聶x聶艓UV贸L聝b聞聨m脠n聨mbnl聜a聞x@z聞@脝聨聞娄k職"],
                encodeOffsets: [
                    [101251, 24734]
                ]
            }
        }, {
            type: "Feature",
            id: "5334",
            properties: { name: "杩簡钘忔棌鑷不宸�", cp: [99.4592, 27.9327], childNum: 3 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@W聶Xw聝聶@akk@y聸聴k聫掳墨X楼聸U贸姆炉w@聧n禄UaVaU脹聝聫炉聝m聬V录k聜聶脼膵么@n炉x脹脪m聞V聜炉脭@x聝聜@職k聬聶wm聶脜a@聝Ua聜脻聛炉V脜聝yV聛聞a@每職聧n禄脻Vmank聶mm脼脜么聝@n拢卤聸臒z脟mU娄聶Vm聞n脺mbn聬@掳nV@xmz脜@m潞V娄k掳ln聛陇職录玫么聞n@xk脝聝IUxU職@扭聝娄V職mVkmkXW陇XzVx@脝職x聶录聝脼炉b@lV職聶母脼聨V聞m录X聨m娄V聞聛聨脼@脝聨職鹿V贸n楼脝Kn聞聜KX聬炉x@猫膴脠卤艂X聬職a脝xnlV@U脹l然k臒V楼聞聛m聫虏菈m脜脼臅茠茮m掳聞脝m聬X陇mzn脝聝聨V娄脼VVb掳bn脼Wbn聨掳l@聬V聞脠@聞聜V牡膴卤@贸聞Inx脝w聞楼@拢脼聸W炉母拢U聝UK聜聝k聧卤akkkbmWm聛脠姆聞a脝脟U聴脠聝脝W@wmknmU炉"],
                encodeOffsets: [
                    [102702, 28401]
                ]
            }
        }, {
            type: "Feature",
            id: "5306",
            properties: { name: "鏄€氬競", cp: [104.0955, 27.6031], childNum: 11 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@m聝nK@wm聝U脜聶楼m職贸X菗艔mX@聨聴V聝聧mL@x牛聫聶nk@mlU職呕脪臒艐@聫聝L@mmLkm聶職@b聶X脜聨W录ka炉l脟殴炉a脟禄聶脻脻_@m聞@@a聶@UklwUm@ak@聝b聶Umb聛m聝bV炉聶臅U聝聝聧職aVw脜a膲Vm媒聶m炉xUk聝@k楼V聝UX聝陇V脠m`@聞聴艅脟脺@膧kn聜臄k茷脝臓聞聶脼職聜U聞V么茊脼I@聨Ux脝娄n聞l@膴膴nxU脪掳娄Vb炉WUnW聨聛Iml@xn聞Ub么陇聜录脠xlI聞禄職KV職聞@脠脭聜Jk職U臇卤脝Vb@n聹聞V脺VUV聝職L聞w臓l聞kn聞臓@nx掳楼脝聞虏mUw聝@m聧聶m脜Ul炉U脩職脩Um聞Lll聞Il卤職@V聛kw聝W@w掳@U禄聶kU聫贸I掳聝聞禄蘑脩聜L聞聶職`nU臓虏lm聞b么V@n聞JUx脝娄X娄l@職聜艓聧U聝V聛聞@lV聞KV脜聶聫V拢Ua脼U聶聝nW@炉VU@贸聶聧"],
                encodeOffsets: [
                    [107787, 28244]
                ]
            }
        }, {
            type: "Feature",
            id: "5301",
            properties: { name: "鏄嗘槑甯�", cp: [102.9199, 25.4663], childNum: 11 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@n@Vk聜VUn虏掳@x聝掳V聬聝@炉脝V录k@W聨聞脼炉聞@聞@聜VVU聞聞蘑膵掳k录V聞膴x聹陇艑聬聹x掳mVk聝脩脠聫職L聜掳聞x掳X聹掳Vm膴LVxU臇掳bX娄VW@k職券lkn@聞楼ln職聝@禄掳脩聛炉VmlLUwVK@聝V@ka@聧lmXb聞UlVlk脠x@聶聞LVa聞VV聧聶wn聝mm@km聶@m聹IVa脻聫@X聝VU脻炉U@聝脻拢k禄聵K@aUwkKV_聝楼聞a@alU@聫nz掳aV聞脠@@卤l聛脹聫職k@wVakm@脩聜楼聞a聞z聜@Xx脝W@脹X聶@m@聛聝y@aWw@k艒膲聛JlbV聞聛J聝z牛脝UwVkmWk媒m@Ul聶U@b炉wV潞聝U聶VU锚職臓聝XUaUbV膴U聨WXUmkK聶聶WnUUU聶V聶聛聝聝VV聧聶脻@kk卤聜聶炉聝聝L聛k聝職卤WkXlVkl聝@聝wXbmL聛聝聸VUIVmk@Ubma@kkaVKU聝聶kmlXLWn聶J炉脪膴掳@zk潞lLU扭n@@n聸么聛@l脝聛nmKk脠lxVw聞@@m脠x聵@n虏Uxl陇nbVxUzmJ聝脪n職"],
                encodeOffsets: [
                    [104828, 25999]
                ]
            }
        }, {
            type: "Feature",
            id: "5307",
            properties: { name: "涓芥睙甯�", cp: [100.448, 26.955], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@l聫@聶聞聛@w掳脫U聛n聝脺脩掳w@m膶贸職脻l聛U禄n聫掳聞聞聬V脺UbVbm录@聨掳x么母聹VW娄炉默l聬聹聵@zll@b聞職WxX職聜a聞聬X@脝臓脝aXwl@Xa脝娄n录聵Jn聛@mnKW炉脠禄V炉掳ak聶VanXVwl@VyU臅VU聞b脠墨laUk掳聝k炉l聝虏V聵Uk茮么聫@聝聞I@mVw膴a聞聶聝聧Vaka聞聶脝bU聨VL職aXIWKUw聶聝聞aW脩脜KUaVk掳聝@聧Uw聞聝炉楼聸X臒聫脻Lkm炉I脟聝贸脩炉禄聶a聝nUl卤U牡每l贸脜I聝aU聜卤Ik录U聨Vb炉bWxn掳聶脪VbnLl脼職@@`kbmIk聨Vn聞JmnXl聸@Ux聶bkn@x贸LUxV聨聝K贸贸脜聬W聶聶a脜x聝聨聶w聝@聶n脜m聶職聝V聶聞聝么X聞聝LlVU陇聝b聛娄m录聶聨@膧聝bU聜聞zU脝聜掳聛脼Vb@聞脝bn職職x"],
                encodeOffsets: [
                    [101937, 28227]
                ]
            }
        }, {
            type: "Feature",
            id: "5328",
            properties: { name: "瑗垮弻鐗堢撼鍌ｆ棌鑷不宸�", cp: [100.8984, 21.8628], childNum: 3 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@l虏掳聨n脪lx脼@聞nWl聞L母聶nbV陇V娄kbVV聜娄na聞x掳V么a@聞職b@l么XlWU職VX膶Klm職聬職U@b職WXX脺聸掳L脠a掳LnU掳聜脼n職脩聞摹掳聧l聝nb職a聝炉炉KW聝聹贸@kmK@U職膲V@k聧掳聫聞VV鹿聞a@y聜_聛膵l_n脫lL@anI@聝贸Wl拢VU聴聝l聶k臅l聶職KVw聞U@聶kV聝am炉脜L@b聝聜脻k@Vn聞Ub脟b脻w脜@膵楼炉lk聬聜录脜聨聶脪掳b@娄nlUn@聨脟V聞聬m脝聛bW么U@脻脜艒m聶炉聝aU聶聶mk聛聶WWw聴@卤聝聶n炉U聶猫聶a聶L聝聧炉m聝L聶職kw聝l@掳mn脠脪炉職贸w@V聶x聝膧U陇掳漠聝掳Xl"],
                encodeOffsets: [
                    [102376, 22579]
                ]
            }
        }, {
            type: "Feature",
            id: "5305",
            properties: { name: "淇濆北甯�", cp: [99.0637, 24.9884], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@X掳聞Il聜@娄聝聨脠录m录脼a脼脜l聞脠xV录職lV么脠脝lL脼拢脠潞lkU聝聜聝Uw聞炉U臅Vw膴@n娄mlnV母IW脟掳Ln聝Uwl聶職V聞n@lnU聵聞nJ脼聛l卤U聶炉LV聧Ua掳脻聞U聞脟膴媒職V扭茅聞Llx脼L聞膧脺l虏膲掳KUaV聝聶_殴茅@klw炉聝l聫脜聴職聫W拢脜yU聛聶W@w聝knal楼Uw@w聶U聝聝k炉聝w炉aW卤k_mJ聛a聶XV脪聶臓Wb炉L炉脻@w聶wU聝炉聧卤Wk_摹聝聛w聝w艒Kmb@陇聞bk掳l臇聝么聞聬UJ聝職Vn脜l钮聧U職炉掳VbnbWxX聞m聞脼職職WU膧聶L聶yWz脹KmbUxVKkn脻聝k聨V聬職膧膵陇Ux聞聬@聨炉聨m@聝娄"],
                encodeOffsets: [
                    [100440, 25943]
                ]
            }
        }, {
            type: "Feature",
            id: "5304",
            properties: { name: "鐜夋邯甯�", cp: [101.9312, 23.8898], childNum: 9 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@l聞聞L掳xXlWxXnlw聞a聞牛la脼l脝默nX聞聝掳wVw聞l聞@m聶nw掳VVIXllK職bnnV掳lbU聞UJ@脠脟KVb聴職@bW聞掳Vk娄kaWb掳職kxV陇脠录U掳么I@llbl職虏聧職@聜@聹贸@mm@V牛kKl鹿@y膲炉掳脩職IXmWKnk職lV聞ULlb@lnbVal@UnVJ聹U聜聞nKWa聞x聞@lkkUlW虏X聞聶聜l聞K掳聞聛職l虏@l職脼U聨聞U聜聞U職V職VVXm職職lLVnXWV聧U膲VaVb聞W聶臒V茅職U聞VU鹿W禄聛aVa聞aW聶X聝聜_U楼n聧脟姆炉聶@a聶lUn脟聧Uyk@@wW@kbW娄UK脻wU聧聛mm聝聝LUnVxUVVlk聬炉mmn聝mk聬脟a脜陇炉I@聝l@@a膲w掳臅mU聴L卤聝k聶脝茅X聶脺脹@y脠莽@聧聶脟摹聞脻姆聴Xmm脻V脜聬聶聝聶lmnkbmWkb@nl@n聨m職炉聬VxkJm聬UJ聞聬ml炉聧聶掳makVV聬nV聝娄聶W聝聴聛Wm聬nl@xmn聞l聜I聞陇聞n聶xU聞聝VU聨mX@聵聝b@z聛l@娄脻镁"],
                encodeOffsets: [
                    [103703, 24874]
                ]
            }
        }, {
            type: "Feature",
            id: "5333",
            properties: { name: "鎬掓睙鍌堝兂鏃忚嚜娌诲窞", cp: [99.1516, 26.5594], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@WyX拢lWlnnUU聶聞楼@牛V聶Vw聞Jl脜@w聝m枚贸聶禄聜拢kml炉U楼n鹿脝@ny@wmU@炉m聫nam脹n聝職UV楼脠n臓y虏聹m陇聞@脝贸n脻職nmlnb脼U聜楼聞aV拢kU聞KW聝聞贸職聝mIU楼贸k聛wV贸l聝聶禄炉聶聝L聶聝k@m聶naWK脹w贸脩職w@a卤n聴@VbUJ聸Lka聝脻X膲聝聶聞UV`lI@lnX脝茟kKmx脹XmlUKV聧mU虏Klw@a聶a贸聞@n聶KXwVKU炉V楼mUnkm楼膲@UxV臇聝掳Vx聛聞V聞klm脼聶聬kKW膧kVW職nl掳Lnm@聛掳聨UxlV@nk娄聶JV脠掳聨V脪@nX掳@脝l聬U么mln么聝虏nxm艂nVV聞炉x@脠m掳XblVU職l掳@xkXU陇WXX聜W聞X脝聝聞mk脜Jm脼聛w卤b聝xU墨kKm聛脜VU臇脻猫V聞kx@職聸lX聞lnk陇聝Lk聨聜臇k娄聜xU職職L掳聜炉臇@LnK@b掳xVI聞楼Ua掳脩@禄nm@鹿聜K艓脼脠Wln虏n"],
                encodeOffsets: [
                    [101071, 28891]
                ]
            }
        }, {
            type: "Feature",
            id: "5331",
            properties: { name: "寰峰畯鍌ｆ棌鏅鏃忚嚜娌诲窞", cp: [98.1299, 24.5874], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞楼n@掳聧@聧聝聫Vw膶拢聶每U聫l聧脼聞lmULVwna脺LXy職z職KV每聶X脻聶n聝W聝XwmaUa掳炉V聶纽聨脝kUm聞聶VI聝聫聞贸k臅l炉聝a@拢nama聶@炉m炉聹贸@贸y牛b摹k脜m卤聧脹ammVk聝L聛wU`Wk@V聝kUm脜聝lUUKmbkkUVUw聝娄贸聨掳录職bn掳么娄l潞聝z@x職聨炉聞聶@U聨掳n聝職U陇牛U聞掳V茊@脠mlnz脼l掳娄脝a聞xUx聝LkxW茠n@聜職虏虐職W聞聶聜@掳脠Xl掳Llx"],
                encodeOffsets: [
                    [100440, 25943]
                ]
            }
        }],
        UTF8Encoding: !0
    }
}), define("echarts/util/mapData/geoJson/zhe_jiang_geo", [], function() {
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            id: "3311",
            properties: { name: "涓芥按甯�", cp: [119.5642, 28.1854], childNum: 9 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@V聜bVl@Xn聜UX聝KV聨@娄nxlUXV聜n聞KVmnL聜聬UV@bn陇lLXK聵虏聞`nnlJXIVJ聜I聞Vnn掳KnnVll@VLXWV@UkVaVK聞zV@聞聝職VVaUK@聛U禄VUl@@WnUU聝@wVLn@Vwl@XW掳LVbn@VU聜@X聞l`@XnKVbkl@XVJlUnlV聞聞xlL@lnXl聞@V職UnV掳聫掳聞@a聞UVLXblWVXn@VVUV@L職陇VLV聞U聜VbnalLUUV聫X_laVa聞WVzXKV@@a@KU聧mImmXama@k聛U@yVIUK聜aVa@kXK@aWU@V聛IUmW@kkVm聞U職@VwUa@K@k@U聝`@kUKVk@UV@VaUm虏聛Vy@klUUWUkVmUa@_聝KVaXa聸聛Xm聝U@mU聛lWkaUX聝@mmkL@w聶J聝nVV脜bWKXa聶@@I@a聝JUU脟@V聞UL聶W@akLmb@K@a聶XXw@m聝VmUVkUy@拢@aU@@VkUWm@kUK聝XUWU_mW@wkkmJUUkLWWUX聝W@IkJ@k@mW_k脫聝_Ul聶L聝m@I@aUa炉m@k聝a炉LUJ聝@mVVxUb聶a@LUKkX聝bm@Uak@@a@Um`聝IUbUJ@nUVW@@LnVV@l職UbVlUX@`聛職@blXklW聞U職m聞Xlm娄U@@V炉bml@職@nUb@llnn@VbX@lV@聨UVULmU@JVn聞bVbkb聶VWxU@@nUVk@"],
                encodeOffsets: [
                    [121546, 28992]
                ]
            }
        }, {
            type: "Feature",
            id: "3301",
            properties: { name: "鏉窞甯�", cp: [119.5313, 29.8773], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@X@l聞掳KXXlW聞b@虏聞`職職職b聜I聞職X`l@聞聬@bWl@n@VnLUV@V聞@掳娄@職l@XVlU@職@xVbUb@Vkb@聜@XVJVz聶J@L脼職@VmLUxUJ@LU聞Vx聜b聞xXUl@Va脠w聞b聜a脼a@Vl@XUVx@V@V聞LlbnV聞al@lb聞Vnn聜LnKnL@VlbVJXalI職b@KUU@mVInJ聵聞U聞Vl@xU職VLnU職@U聫脼aV@lkV@UanK聞L@UlKVUnb脝mn@@nUlVnVJl@@UXU聞L@WVIVJVxVLXV@I脺Knbn@V楼V@@I@聝聝聧聞y掳b@UUwnk掳脝屁VlU職莽Xm聸拢聛a聝脟聶IkV聝@WV聛@@aWIUWUIkb@WW@Un聝K@UU@kaWVk聝VIVVnU@聧UWVUV@VmV聧kKk聧WIkVWaULU`UImJUImm聴U@聝聝wmwUV聶IUWVkUamaU@mV聴k聝b@KVU@aVU@anKULVJ聜U@k脹U聶JUV聸kk聝VakU@聧聝aVwkW@UWkXmWaULUaUK@X聝JUUm聝VU@U聛V聝UkJ@ImwmKU@k聞@lU聞W@@akKm聞kamIkWl_UwVm@UkaVUUa聝@UamakbWlkL@aUalU@mkL@U@U聶lmK@XkKm@脻akb@x聝nXb聝`聝nUUU@聸聶U@聶wU@@聝mKkk聝V炉U@lULUbVbUb@V聜a@L聶潞脻b@b聛LmK聶x@VUL@bk@mxULWl"],
                encodeOffsets: [
                    [121185, 30184]
                ]
            }
        }, {
            type: "Feature",
            id: "3303",
            properties: { name: "娓╁窞甯�", cp: [120.498, 27.8119], childNum: 9 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@ll@xnXV`VX聞WVL@lXnlV@UV@@b@陇VzUlnV聞U@nWx職W@b@LnalK@b職XVKU聝脠@VV聞I@b@J職@WbXL脝aUU聞m職I@xlKnn聞@VWlbkXV聜@n聞VWn聹聜WbUb聞L@`VbUnVlVXkV@lUz卤聜VnUbU@@VUlVL@l聞_@V@l@LVbV@XLV`V脠lxn@lU@a聹aVV聜k聞@XJ@nl@@LU`掳LVb聞L掳a@a聞UVy@anI@a聞a聜nV@虏w脺JX@V職VV掳k聞聧na@WVk聞aWw聛U@m@聶聝k聝aU臅聶脻職脻扭n脠a聞a贸I聸禄@卤X聶WkU姆@kV卤kw聶聝UkWw聞聶U聝脻禄脹k沙l聛ImaUaW贸X每乾k聜UnWV聧mm聛k聶K牛n艔脼臒l聶聞UlUx@XWb聞V@JkX聝掳mb@VULVxUVk@@LWWk@WIk職聝UkJmUkVmI@y聝@Ua聶聧kLm聜U@mUUUkaVk聶@mK@U聛lUU@UmKmbUUUJ@n@KVLUL@VkJWXX`mnULWlkL@JVLVb@掳kxkU@LV聨聶V@聞VLV`UL@VUX"],
                encodeOffsets: [
                    [122502, 28334]
                ]
            }
        }, {
            type: "Feature",
            id: "3302",
            properties: { name: "瀹佹尝甯�", cp: [121.5967, 29.6466], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@膴娄母膧掳聜nX脼V職K職k屁茟藕每掳禄n聧聞聧@w么楼脺b聹U掳聫脝X脼W贸莽膲脻卤IU聝脠楼@U掳w脝禄虏mm_@aX聝VK脼Vlk@akk聸虆@拢X禄Vw脝聫X聛Wa炉a葪b聶K平虐聝膴聶x聝L贸聨k@聝聝聝@炉n聝KUL@xkL聸脩kWULUUmJUXV聨U@m聨UX炉@V`mbXbV@@nn陇WX職x@職kJ@nVVUVl虏Ub脻VUVk@Wx@V@聞聝VXzml聛a聝L@VlLU`聞XUVVVUnl@VbnJlnUVVn聝lUKkbmnn聞VxlJnxmbU@UL@KUV聶X@xmb@lk@mnVVU職聶猫"],
                encodeOffsets: [
                    [123784, 30977]
                ]
            }
        }, {
            type: "Feature",
            id: "3309",
            properties: { name: "鑸熷北甯�", cp: [122.2559, 30.2234], childNum: 3 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@l微茠聬薁镁脝V蘑L膴聝乾X膴脺聞X么V聞脩脝w聞聝l聫職茝脠贸V沫V菗@聝膲w蓻kmK@膲X墨Wa膲U牡脻m聝炉膲聝w膲卤卤n脜录炉x@V脟娄V聞虏J膴脼么猫脻X脜W炉聬聸V脹a贸娄@x聝聨m聨炉录殴膧"],
                encodeOffsets: [
                    [124437, 30983]
                ]
            }
        }, {
            type: "Feature",
            id: "3310",
            properties: { name: "鍙板窞甯�", cp: [121.1353, 28.6688], childNum: 7 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@lV聞IVWVz@bXJl@Xal@掳聞nLll@nVxnV聞K@聬UJVb聝娄掳聞k`UIWJXn脝職@bUJ聞Xl@lb聞Wn@UzVV@bVV職mVnnJVXna聜b職KUKnUVVUnVLlKVLXa聞Jm拢@mU@WanaU_掳@VWn聧V@U聧VWnIVVVKlX聹脪lK@wVK聞L掳m聞@聞聞l@么聧聞K職w聞膲凭暖U聝l拢@禄U聫聝聧Vk聞m@茀U聝聝a脹I艔mUk@m聞w@a聶拢聝Wk@牛職聝Im卤@ank么UlaU聶Uw炉聝艒a聝b脟b牛m聶脼職脼V臇聞b聞l@職@n聜VXx聝bUl@Xmb聝聨炉lUUU聶W@脹I卤xU@聛m聝b@bmJ@bUz聝V@b炉b聝KUa炉KV_@Kk@@mWI聝@聛lUU聸b@bkVm@kwU脟U_WKU@Ux聶@聝VUnllX@Vn聜J@UXV@bWL@lUb聛bVLUJ@z聜V@lnbWbnnnJV聨@L"],
                encodeOffsets: [
                    [123312, 29526]
                ]
            }
        }, {
            type: "Feature",
            id: "3307",
            properties: { name: "閲戝崕甯�", cp: [120.0037, 29.1028], childNum: 8 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@nbVb聞@VbUVlb@VUnVxk`lXnJlbn聝lL@bX@V聝@kl聝V@nLnx@JlI聞V聜U@VUVn聞VV聞I@WVLVbVKXbWnXl@VlXUx聞b@聨lVUbl聞聹lVU職I脺VnalKX@@bV@@aUUlU聝wUw聞@naWW聞UVaUU職aVb聞LlxXJVk掳聝U聝lkU楼@k聞a@LVlXLVl職VWznVn@lx職Jl_@WX_@mVa聞a@alU@kVVna聞KVLlK聞b@UUaVa職bnUWmXU@k@yVI@a脜聶WmXIVJl_炉聝聞楼UaVI@聫聝LmUUw@mkkmK炉聝k@Wbk@WI@aUyUX聝JkU@bU@WLUy聝XUbkbW`U聬VVkKmbUaV聛U聝UK聶拢@KVUUUm@UWkXWaUK聝V@b炉聝炉聬mU聶V@Uk聝mW@kkK聝wU聝mkkVUI@WlkUamL@Wk_W聝聛@UVm@Ua炉KWXk@Uxm@UK@xV聞mV@Xk@UVV录@聜VLUb聶U聝聞U@聝yULUbVlU@@XlVUVVb聝U@lXXVW@XUVl@@VUV聝脠n@VVU聞@lVa@聞U聞mL@`聛X@`WL@VUX@lUL@xlx"],
                encodeOffsets: [
                    [122119, 29948]
                ]
            }
        }, {
            type: "Feature",
            id: "3308",
            properties: { name: "琛㈠窞甯�", cp: [118.6853, 28.8666], childNum: 5 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@XkVKnwl@@aVK@U職wnL聜K@a脼a職鹿@K聛b@UVaUaVaVK@k掳V聞UllnL@聞V@職xV@聹職V@VV聞m聞_Wa聞m@wla脼bn@lL@WnL職k@V@VlK@nkVVb@blKXklakw@wVK@kVW@UXK@_聜W@_nKV聝@聝Ub@kV聝UUm@聞脟VU@Uk@VU@WUXWW@k聞VUaVUkU@WWXUKk@Ukmm炉Lmm聝U聛JUIWJkImm聝_聴卤WLkKm拢@aVU聛聫mKUn聝L聛mWUkVmw@楼U聧聞LVWm聛@WUk聛a@Um聫mL聛mm@@bUX聶@@WUIm@UVUK@UVUUU聶VVJmb@b聞Xn聜mV聝录nnn娄mJUV聝L聞V@VW@UzUlVnUbl`UnVl@XU@kl@bm脠Ux聶Vk@@J@聞聝录W@脜aVVnzmV聝聞聛@WJk@k聬WJ@聬聝lXbWbXxmVn職lLXb@掳lKVXnW職bWV聞聞X聞mbV@Xl聜b職I@Kn@@x@職VLlm"],
                encodeOffsets: [
                    [121185, 30184]
                ]
            }
        }, {
            type: "Feature",
            id: "3306",
            properties: { name: "缁嶅叴甯�", cp: [120.564, 29.7565], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@聞x@聞聵VnnVJnIVJV_VKXblUXJl聨lLU聨UnU@UVVX@聨mVUUUJl聞XUlbV@@V聞LVmX@@XlaVJVXXJ@b聜@XU聞@lU職J聞脠聜b聹陇艑聧聞J職莽V聶UUnml@@kna@w職WVU@LVKV@namwkIUwm聝nmlaVL聞kUmVUkmmIUak@VmUUVU聝WV_kK@U聞K聜bnkWy聞U@聝@UXwl@VU脼UVak卤VUUU@mlI@聶聶wXW聝IWbUKkLUKVmUUmVVL聶L聛ambUWmIUm聶nUU@aUUVym@聝Xkak@聝W@z@lWVXnmV聶aUbVb@V聝akLUK聝LmbUU@lkV@b聝bUb@nW`@Xk`聶Ikwm@mUXy聶UUkWKUk@K聝b@lV娄klV聞炉聞UlWIkw聝KUa聶bVVUb聝VXXmb聝@Vx聞xkVVV@bU@@aW@kLmb@l聛VUIVKmL@bUV@bUV@L聞a聵lnUV@nbVbUlVX職JVUnx"],
                encodeOffsets: [
                    [122997, 30561]
                ]
            }
        }, {
            type: "Feature",
            id: "3304",
            properties: { name: "鍢夊叴甯�", cp: [120.9155, 30.6354], childNum: 6 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@@blIX@@V脺VUnn@l聜k聞lKnI掳脼l`虏LVKVbnbVaVLUVn@W娄@VkVVb聞@VI聞`@blLnL聜aX@聞VVb@U聜@XlVa聞@@kVaUKV禄U_lWXU聝聝@alb聞k@VllnLVKn@@UVIUw@y掳IVVXU@VV@lw聞m@wVk凭a聹J聜Lk巍僻茠聶l聶L脻UmW炉聛姆每膲楼聝I艐聨Wn聶猫kV僻U炉脜mlVx@V炉a聝z聞聨@聞@JU@U娄m@@職nVmn@V聞LV聜"],
                encodeOffsets: [
                    [123233, 31382]
                ]
            }
        }, {
            type: "Feature",
            id: "3305",
            properties: { name: "婀栧窞甯�", cp: [119.8608, 30.7782], childNum: 4 },
            geometry: {
                type: "Polygon",
                coordinates: ["@@kLl聝k聛m@Vm脹U@UW@kJ@aU聛聝K@UnmmU@聶ma脹L@JWUUKUwUIUJ@X聝KWV@Vk@UIUmVk@mm@脜nmaUVkL@V聝KmLVbU@klU@脻bV聬聶@mVUKV聶@wUkV聝聴聝mIUJ@nVV@L聶akJWbUIka@UmKmL聛Kmm聝UUVk@@nmLX`WXUV@聨@nUl聶kmlU@Ub聞聞聝xVV職IlV聞聨職nn聫聞@@n聵聞U脪職@聞掳n@@xmb@聞VbnV@職職聞@b@`@L@L@x@blVklVbnnV@聜aXb掳VlU@W聞b掳U聞LXWVUV聶聞聶Vw脠w脺禄母a臓nU聫Vw虏X@V@lVU@wlaUUVm@knUV聸"],
                encodeOffsets: [
                    [123379, 31500]
                ]
            }
        }],
        UTF8Encoding: !0
    }
});