
// const stats = require('vizchange-stats')
const stats = require('../stats/module.js')


const config = require("../../static/server.config.json");


const configs = JSON.parse(JSON.stringify(stats.configs.production));
configs.dates.start = global.startYear;
configs.dates.end = global.endYear;

const http = require('http');

const axios = require('axios').create({
	httpAgent: new http.Agent({
		scheduling: 'fifo',
		maxSockets: 1,
		maxTotalSockts: 1,


	})
})


checkIfSeasonOrMonth = (type) => {
	// check if containing Winter, Spring, Summer, Autumn or jan
	if (type.includes('winter') || type.includes('spring') || type.includes('summer') || type.includes('autumn')) {
		return 'season';
	}
	if (type.includes('jan') || type.includes('feb') || type.includes('mar') || type.includes('apr') ||
		type.includes('may') || type.includes('jun') || type.includes('jul') || type.includes('aug') ||
		type.includes('sep') || type.includes('oct') || type.includes('nov') || type.includes('dec')) {
		return 'month';
	}

	return type;
}

class DataHandler {
	constructor(data, specs, subtype, baseline, station='', subtype2=[]) {
		this.type = specs.stationDef.set+`-${subtype}`
		this.values = data
		// last element in str
		console.log(subtype)

		this.values = data;
		this.baseline = baseline;
		if (subtype == 'diff'){
			this.calc = 'diff'
		}
		let val = subtype2[2] ? subtype2[2] : '20';
		console.log(val)
		// extract season
		let p = this.type.split('-')[1];
		let period = checkIfSeasonOrMonth(p);
		this.type = this.type.replace(p, period);
		console.log(this.type)
		console.log(data[0])
		switch (this.type){
			case 'viz-annual-prec-diff':
				this.yKey = 'annual_precipitation'
				this.xKey = 'year'
				break;
			case 'viz-annual-prec-rain':
				this.yKey = 'rain'
				this.xKey = 'year'
				break;
			case 'viz-annual-prec-snow':
				this.yKey = 'snow'
				this.xKey = 'year'
				break;
			case 'viz-grow-weeks-avg':
				this.yKey = 'weekly_grow_season_length'
				this.xKey = 'year'
				break;
			case 'viz-grow-weeks-diff':
				this.yKey = 'weekly_grow_season_length'
				this.xKey = 'year'
				break;
			case 'viz-grow-days-avg':
				this.yKey = 'grow_season_length'
				this.xKey = 'year'
				break;
			case 'viz-grow-days-diff':
				this.yKey = 'grow_season_length'
				this.xKey = 'year'
				break;
			case 'viz-grow-first-avg':
				this.yKey = 'first_frost'
				this.xKey = 'year'
				break;
			case 'viz-grow-first-diff':
				this.yKey = 'first_frost'
				this.xKey = 'year'
				break;
			case 'viz-grow-last-avg':
				this.yKey = 'last_frost'
				this.xKey = 'year'
				break;
			case 'viz-grow-last-diff':
				this.yKey = 'last_frost'
				this.xKey = 'year'
				break;
			case 'viz-season-prec-diff':
				this.yKey = 'precipitation_'+p
				this.xKey = 'year'
				break;
			case 'viz-season-prec-rain':
				this.yKey = 'rain_'+p
				this.xKey = 'year'
				break;
			case 'viz-season-prec-snow':
				this.yKey = 'snow_'+p
				this.xKey = 'year'
				break;
			case 'viz-month-prec-diff':
				this.yKey = 'precipitation'
				this.xKey = 'year'
				break;
			case 'viz-month-prec-rain':
				this.yKey = 'rain'
				this.xKey = 'year'
				break;
			case 'viz-month-prec-snow':
				this.yKey = 'snow'
				this.xKey = 'year'
				break;
			case 'viz-annual-temp-glob-diff':
				this.yKey = 'temperature'
				this.xKey = 'year'
				break;
			case 'viz-annual-temp-nhem-diff':
				this.yKey = 'temperature'
				this.xKey = 'year'
				break;
			case 'viz-annual-temp-64n-90n-diff':
				this.yKey = 'temperature'
				this.xKey = 'year'
				break;
			// TODO next
			case 'viz-annual-temp-max':
				this.yKey = 'max_annual_temperature'
				this.xKey = 'year'
				break;
			case 'viz-annual-temp-min':
				this.yKey = 'min_annual_temperature'
				this.xKey = 'year'
				break;
			case 'viz-annual-temp-avg':
				this.yKey = 'avg_annual_temperature'
				this.xKey = 'year'
				break;
			case 'viz-annual-temp-diff':
				this.yKey = 'avg_annual_temperature'
				this.xKey = 'year'
				break;
			case 'viz-season-temp-avg':
				this.yKey = 'avg_temperature_'+p
				this.xKey = 'year'
				break;
			case 'viz-season-temp-max':
				this.yKey = 'max_temperature_'+p
				this.xKey = 'year'
				break;
			case 'viz-season-temp-min':
				this.yKey = 'min_temperature_'+p
				this.xKey = 'year'
				break;
			case 'viz-season-temp-diff':
				this.yKey = 'avg_temperature_'+p
				this.xKey = 'year'
				break;
			case 'viz-month-temp-avg':
				this.yKey = 'avg_temperature'
				this.xKey = 'year'
				break;
			case 'viz-month-temp-max':
				this.yKey = 'max_temperature'
				this.xKey = 'year'
				break;
			case 'viz-month-temp-min':
				this.yKey = 'min_temperature'
				this.xKey = 'year'
				break;
			case 'viz-month-temp-diff':
				this.yKey = 'avg_temperature'
				this.xKey = 'year'
				break;
			case 'viz-perma-perma':
				this.yKey = 'perma'
				this.xKey = 'year'
				this.calc = 'perma';
				this.station = 'calm'
				break;
			case 'viz-lakeice-avg':
				this.yKey = 'icetime'
				this.xKey = 'winter_year'
				break;
			case 'viz-lakeice-diff':
				this.yKey = 'icetime'
				this.xKey = 'winter_year'
				break;
			case 'viz-lake-freeze-avg':
				this.yKey = 'freezeup'
				this.xKey = 'winter_year'
				break;
			case 'viz-lake-freeze-diff':
				this.yKey = 'freezeup'
				this.xKey = 'winter_year'
				break;
			case 'viz-lake-break-avg':
				this.yKey = 'breakup'
				this.xKey = 'winter_year'
				break;
			case 'viz-lake-break-diff':
				this.yKey = 'breakup'
				this.xKey = 'winter_year'
				break;
			case 'viz-lake-thick-iceThick':
				this.yKey = 'max_thickness'
				this.xKey = 'winter_year'
				break; 
			case 'viz-lake-thick-diff':
				this.yKey = 'max_thickness'
				this.xKey = 'winter_year'
				break;
			case 'viz-snowdepth-decade-period':
				this.yKey = 'avg_snowdepth_deci'
				this.xKey = 'month'
				break;
			case 'viz-snowdepth-period-period':
				this.yKey = 'avg_snowdepth_deci'
				this.xKey = 'month'
				break;
			case 'viz-snowdepth-annual-avg':
				this.yKey = 'avg_snowdepth_deci'
				this.xKey = 'year'
				break;
			case 'viz-carbon-co2':
				this.yKey = 'co2'
				this.xKey = 'datetime'
				break;
			case 'viz-extreme-temp-high-20-extreme':
				this.yKey = 'temperature_extreme_'+val
				this.xKey = 'year'
				break;
			case 'viz-extreme-temp-high-20-diff':
				this.yKey = 'temperature_extreme_'+val
				this.xKey = 'year'
				break;
			case 'viz-extreme-temp-low-10-extreme':
				this.yKey = 'temperature_extreme_'+val
				this.xKey = 'year'
				break;
			case 'viz-extreme-temp-low-10-diff':
				this.yKey = 'temperature_extreme_'+val
				this.xKey = 'year'
				break;
			case 'viz-extreme-temp-high-daily-extreme':
				this.yKey = 'hottest_day_temperature'
				this.xKey = 'year'
				break;
			case 'viz-extreme-temp-high-daily-diff':
				this.yKey = 'hottest_day'
				this.xKey = 'year'
				break;
			case 'viz-extreme-temp-low-daily-extreme':
				this.yKey = 'coldest_day_temperature'
				this.xKey = 'year'
				break;
			case 'viz-extreme-temp-low-daily-diff':
				this.yKey = 'coldest_day_temperature'
				this.xKey = 'year'
				break;
			case 'viz-extreme-temp-high-weekly-extreme':
				this.yKey = 'warmest_week_temperature'
				this.xKey = 'year'
				break;
			case 'viz-extreme-temp-high-weekly-diff':
				this.yKey = 'warmest_week_temperature'
				this.xKey = 'year'
				break;
			case 'viz-extreme-temp-low-weekly-extreme':
				this.yKey = 'coldest_week_temperature'
				this.xKey = 'year'
				break;
			case 'viz-extreme-temp-low-weekly-diff':
				this.yKey = 'coldest_week_temperature'
				this.xKey = 'year'
				break;
			case 'viz-extreme-temp-high-monthly-extreme':
				this.yKey = 'warmest_month_temperature'
				this.xKey = 'year'
				break;
			case 'viz-extreme-temp-high-monthly-diff':
				this.yKey = 'warmest_month_temperature'
				this.xKey = 'year'
				break;
			case 'viz-extreme-temp-low-monthly-extreme':
				this.yKey = 'coldest_month_temperature'
				this.xKey = 'year'
				break;
			case 'viz-extreme-temp-low-monthly-diff':
				this.yKey = 'coldest_month_temperature'
				this.xKey = 'year'
				break;
			case 'viz-extreme-prec-high-daily-extreme':
				this.yKey = 'wettest_day_precipitation'
				this.xKey = 'year'
				break;
			case 'viz-extreme-prec-high-daily-diff':
				this.yKey = 'wettest_day_precipitation'
				this.xKey = 'year'
				break;
			case 'viz-extreme-prec-low-daily-extreme':
				this.yKey = 'driest_day_precipitation'
				this.xKey = 'year'
				break;
			case 'viz-extreme-prec-low-daily-diff':
				this.yKey = 'driest_day_precipitation'
				this.xKey = 'year'
				break;
			case 'viz-extreme-prec-high-weekly-extreme':
				this.yKey = 'wettest_week_precipitation'
				this.xKey = 'year'
				break;
			case 'viz-extreme-prec-high-weekly-diff':
				this.yKey = 'wettest_week_precipitation'
				this.xKey = 'year'
				break;
			case 'viz-extreme-prec-low-weekly-extreme':
				this.yKey = 'driest_week_precipitation'
				this.xKey = 'year'
				break;
			case 'viz-extreme-prec-low-weekly-diff':
				this.yKey = 'driest_week_precipitation'
				this.xKey = 'year'
				break;
			case 'viz-extreme-prec-high-monthly-extreme':
				this.yKey = 'wettest_month_precipitation'
				this.xKey = 'year'
				break;
			case 'viz-extreme-prec-high-monthly-diff':
				this.yKey = 'wettest_month_precipitation'
				this.xKey = 'year'
				break;
			case 'viz-extreme-prec-low-monthly-extreme':
				this.yKey = 'driest_month_precipitation'
				this.xKey = 'year'
				break;
			case 'viz-extreme-prec-low-monthly-diff':
				this.yKey = 'driest_month_precipitation'
				this.xKey = 'year'
				break;





		}
	}

	get 'shortValues' (){
		let diff = [];
		let values = this.values
		return values.map(each => {
			let x = each[this.xKey]
			let y = each[this.yKey]
			if (this.xKey == 'datetime' ){
				x = new Date(x).getTime();
			}
			if (this.calc === 'diff') {
				if (x > this.baseline.start && x < this.baseline.end) {
					diff.push(y);
				}
			}
			return ({
				x, 
				y,
				sort: each.sort ? each.sort : x,
				station: each.station ? each.station : this.station
			})
		}).map((each) => {
			if(diff.length > 0){
				diff = diff.reduce((a, b) => a + b, 0) / diff.length;
			}
			each.y -= diff;
			return each;
		})
	}
}


class Serie {
	constructor(meta, type, key, id, callback){
		this.meta = meta
		this.type = type
		this.key = key
		this.id = id
		this.callback = callback
		this.specs = JSON.parse(JSON.stringify(configs))
		this.specs.coordinates = meta.stationDef.coordinates
		// TODO for redirect but not precalc
		this.specs.url = `${hostUrl}/data/production/url`;
		// TODO for redirect and precalc
		this.specs['url_calc'] = `${hostUrl}`
		//this.specs.url = `${hostUrl}`;

		switch(type){
			case "avg":
				this.station = meta.stationDef.station
				this.tags = Object.values(meta.tag.data).concat(['shortValues'])
				break
			case "max":
				this.station = meta.stationDef.station
				this.tags = Object.values(meta.tag.data).concat(['max', 'shortValues'])
				break;
			case "min":
				this.station = meta.stationDef.station
				this.tags = Object.values(meta.tag.data).concat(['min', 'shortValues'])
				break;
			case "perma":
				this.tags = ['perma', 'yrly', 'shortValues'];
				this.station = Object.keys(meta.series)[this.callback].toLowerCase();
				break;
			case "period":
				this.station = meta.stationDef.station;
				switch (key) {
					case 'allTime':
						this.specs.dates.type = 'Full';
						break;
					default:
						this.specs.dates.start = Number(this.key)
						switch (this.meta.tag.render) {
							case 'periodMeans':
								this.specs.dates.end = this.specs.dates.start + 29;
								break;
							default:
								this.specs.dates.end = this.specs.dates.start + 9;
						}
				}
				this.tags = ['snowdepth_single', 'splitDecades', 'shortValues']
				break;
			case "co2":
				this.station = meta.stationDef.station;
				this.tags = ['co2_weekly', 'all', 'shortValues']
				break;
				/*
			case "first":
			case "last":
				this.station = meta.stationDef.station;
				this.tags = Object.values(meta.tag.data).concat(['shortValues']);
				break;
				*/
			case "extreme":
				this.station = meta.stationDef.station
				if (meta.extreme) {
					this.tags = Object.values(meta.tag.data).concat([meta.extreme.type, meta.extreme.lim, 'shortValues']);
				}else{
					this.tags = Object.values(meta.tag.data).concat(['shortValues'])
				}
				break;
			case "diff":
				this.station = meta.stationDef.station;
				this.tags = Object.values(meta.tag.data).concat(['difference'])
				break;
			default:
				this.station = meta.stationDef.station
				this.tags = Object.values(this.meta.tag.data).concat(['shortValues'])
		}
		this.updateTime = (new Date()).getTime();
	}
	get 'serie' () {
		return this[this.type](this.meta, this.type, this.key, this.id)
	}
	async "data" (st, tgs, ...sr) {
		let t = Object.values(tgs).concat(sr)
		
		let subtype = this.specs.dates.start;
		if (this.specs.dates.type === 'Full') {
			subtype = 'Full';
		}
		let url = this.specs.url_calc + "/data" + `?type=${t}&station=${st}&specs=${this.meta.tag.render}&subtype=${subtype}`
		// let url = this.specs.url_calc + "/data" + `?type=${t}&station=${st}&specs=${this.type}`
		return axios.get(url).then(res => {
			return new DataHandler(res.data, this.meta, this.type, this.specs.baseline, st.replace('calm', ''), sr)
		})

	}
	'preset' (config, serie, meta) {
		const preset = {
			"label": false,
			"lineWidth": 0,
			"marker": {"radius": 2},
			"states": {"hover": {"lineWidthPlus": 0}},
			"visible": false,
			"tooltip": {
				"valueDecimals": (() => (serie.decimals !== undefined ? series.decimals : meta.decimals))()
			}
		};
		$.extend(true, preset, serie, config);

		if(config.name !== undefined) preset.name = config.name;
		preset.className = config.className;
		if (!preset.color) {
			preset.color = config.colour;
		}
		if (config.borderColor) {
			preset.borderColor = config.borderColor;
		}
		preset.type = config.type;

		preset.promises.then(() => {
			$(`#${this.id}`).highcharts().hideLoading();
			$(`#${this.id}`).highcharts().redraw()
		})
		if(config.group !== undefined) preset.visible = (meta.groups[config.group].prime === undefined ? false : meta.groups[config.group].prime) && config.visible;
		return preset
	}
	get "max" () {
		return (meta) => this.preset(
			meta.series.max,
			{
				"promises": this.data(meta.stationDef.station,meta.tag.data, 'max', 'shortValues'),
			},
			meta
		);

	}
	get "min" () {
		return (meta) => this.preset(
			meta.series.min,
			{
				"promises": this.data(meta.stationDef.station,meta.tag.data, 'min', 'shortValues'),
			},
			meta
		);

	}
	get "extreme" () {
		return (meta, s, k) => {
			let tag = "extreme";
			if (meta.extreme) {
				tag += meta.extreme.type;
			}else{
				tag += '-high'
			}
			return this.preset(
				meta.series[k],
				{
					"promises": this.data(meta.stationDef.station,meta.tag.data),
				},
				meta
			);
		};
	}
	get "extreme-low" () {
		return this.extreme;
	}
	get "extreme-high" () {
		return this.extreme
	}
	get "avg" () {
		return (meta) => this.preset(
			meta.series.avg,
			{
				"step": "center",
				"marker": {
					"enabled": true,
					"fillColor": meta.series.avg.colour,
					"lineColor": meta.series.avg.borderColour,
					"lineWidth": meta.series.avg.borderColour
					? 1
					: 0,
					"radius": 2
				},
				"promises": this.data(meta.stationDef.station,meta.tag.data, 'shortValues'),

				// "promises": data.avg != undefined
				// ? data.avg.values
				// : data.values
			},
			meta
		);

	}
	get "diff" () {
		return (meta) => this.preset(
			meta.series.diff,
			{

				/*
				 * Regression: false,
				 * ClassName: meta.series.diff.className,
				 * RegressionSettings: {
				 * Type: 'linear',
				 * Color: '#aa0000',
				 * Name: 'DUMMY',
				 * },
				 * Name: meta.series.diff.name,
				 * Type: meta.series.diff.type,
				 */
				"promises": (() => {
					if (meta.extreme) {

						return this.data(meta.stationDef.station,meta.tag.data, 'occurrence', meta.extreme.type, meta.extreme.lim , 'difference')
						// return data.occurrence((e) => meta.extreme.lim > e).difference();

					}
					return this.data(meta.stationDef.station,meta.tag.data,'difference')

					// return data.difference != undefined
					// 	? data.difference()
					// 	: data.avg != undefined
					// 	? data.avg.difference()
					// 	: data.total != undefined
					// 	? data.total.difference()
					// 	: data(variables.date).difference();

				})(),
				"color": "red",
				"negativeColor": "blue",
				"visible": true
				// Tooltip: { valueDecimals: meta.decimals },
			},
			meta
		);
	}
	get "first" () {
		return (meta) => this.preset(
			meta.series.first,
			{
				"keys": ["x", "date"],
				"lineWidth": 0,
				"marker": {"radius": 2},
				"states": {"hover": {"lineWidthPlus": 0}},
				"promises": this.data(meta.stationDef.station,meta.tag.data, 'shortValues')
			},
			meta);
	}
	get "firstDiff" (){
		return this.diff;
	}
	get "last" () {
		return (meta) => this.preset(
			meta.series.last,
			{
				"lineWidth": 0,
				"marker": {"radius": 2},
				"states": {"hover": {"lineWidthPlus": 0}},
				"promises": this.data(meta.stationDef.station,meta.tag.data, 'shortValues'),
			},
			meta);
	}
	get "lastDiff" (){
		return this.diff;
	}
	/*
	"linjer": (meta) => ({
		"name": meta.series.linjer.name,
		"className": meta.series.linjer.className,
		"type": meta.series.linjer.typ,
		"visible": false,
		"tooltip": {"valueDecimals": meta.decimals},
		"showInLegend": false
	})
	*/
	get "snow"(){
		return (meta) => this.preset(
			meta.series.snow,
			{
				"promises": this.data(meta.stationDef.station,meta.tag.data, 'snow', 'shortValues'),
				// "name": meta.series.snow.name,
				// "className": meta.series.snow.className,
				// "type": meta.series.snow.type,
				// "stack": meta.groups[meta.series.snow.group].title,
				"stacking": "normal",
				// "color": meta.series.snow.colour,
				// "promises": data.snow != undefined
				// ? data.snow.values
				// : undefined,
				// "visible": true,
				// "tooltip": {"valueDecimals": meta.decimals},
				// "borderColor": meta.series.snow.borderColour,
				// "states": {
				// "hover": {
				// "color": meta.series.snow.hoverColour,
				// "animation": {
				// "duration": 0
				// }
				// }
				// }
			},
			meta
		);
	}
	get "rain"(){
		return (meta) => this.preset(
			meta.series.rain,
			{
				"promises": this.data(meta.stationDef.station, meta.tag.data, 'rain', 'shortValues'),
				"stacking": "normal"
			},
			meta
		)
		// "name": meta.series.rain.name,
		// "className": meta.series.rain.className,
		// "type": meta.series.rain.type,
		// "stack": meta.groups[meta.series.rain.group].title,
		// "stacking": "normal",
		// "promises": data.rain != undefined
		// ? data.rain.values
		// : undefined,
		// "color": meta.series.rain.colour,
		// "borderColor": meta.series.rain.borderColour,
		// "states": {
		// "hover": {
		// 	"color": meta.series.rain.hoverColour,
		// 	"animation": {
		// 		"duration": 0
		// 	}
		// }
		// },
		// "visible": true,
		// "tooltip": {"valueDecimals": meta.decimals}
	}
	"iceTime" () {
		return (meta) => this.preset(
			meta.series.iceTime,
			{
				"regression": false,
				// "type": meta.series.iceTime.type,
				"regressionSettings": {
					"type": "linear",
					"color": "#00bb00",
					"name": "[placeholder]"
				},
				// "name": meta.series.iceTime.name,
				// "className": meta.series.iceTime.className,
				// "color": meta.series.iceTime.colour,
				"lineWidth": 0,
				"marker": {"radius": 2},
				"states": {"hover": {"lineWidthPlus": 0}},
				"promises": this.data(meta.stationDef.station, meta.tag.data),
				"visible": true,
				"tooltip": {"valueDecimals": meta.decimals}
			},
			meta)
	}
	"freeze" (){
		return (meta) => this.preset(
			meta.series.freeze,
			{
				"promises": this.data(meta.stationDef.station, meta.tag.data, 'shortValues'),
				"regression": false,
				"regressionSettings": {
					"type": "linear",
					"color": "#0000ee",
					"name": "[placeholder]"
				},
				"lineWidth": 0,
				"marker": {
					"enabled": true,
					"fillColor": meta.series.freeze.colour,
					"lineColor": meta.series.freeze.borderColour,
					"lineWidth": 1,
					"radius": 2
				},
				"states": {"hover": {"lineWidthPlus": 0}},
				"visible": true,
				"tooltip": {"valueDecimals": meta.decimals}
			},
			meta
		)
	}
	"breakup"(){
		return (meta) => this.preset(
			meta.series.breakup,
			{
				"promises": this.data(meta.stationDef.station, meta.tag.data, 'shortValues'),
				"stacking": "normal",
				"regression": false,
				"regressionSettings": {
					"type": "linear",
					"color": "#0000ee",
					"name": "[placeholder]"
				},
				"lineWidth": 0,
				"marker": {
					"enabled": true,
					"fillColor": meta.series.breakup.colour,
					"lineColor": meta.series.breakup.borderColour,
					"lineWidth": 1,
					"radius": 2
				},
				"states": {"hover": {"lineWidthPlus": 0}},
				"visible": true
			},
			meta
		)
	}
	get "iceThick" () {
		return (meta) => this.preset(
			meta.series.iceThick,
			{
				// "name": meta.series.iceThick.name,
				// "className": meta.series.iceThick.className,
				// "color": meta.series.iceThick.colour,
				"lineWidth": 0,
				"marker": {
					"radius": 2,
					"symbol": "circle"
				},
				// "promises": this.data(meta.stationDef.station, meta.tag.data, variables.date, 'shortValues'),
				"promises": this.data(meta.stationDef.station, meta.tag.data, 'shortValues'),
				// "promises": data.total != undefined
				// ? data.total.max(
				// 	meta,
				// 	data
				// ).values
				// : data(date = variables.date).values,
				// "visible": true,
				"tooltip": {"valueDecimals": meta.decimals}
			},
			meta)
	}
	get "iceThickDiff" () {
		return (meta) => this.preset(
			meta.series.iceThick,
			{
				// "name": meta.series.iceThickDiff.name,
				// "className": meta.series.iceTickDiff.className,
				// "color": meta.series.iceThickDiff.colour,
				"lineWidth": 0,
				"marker": {
					"radius": 2,
					"symbol": "circle"
				},
				"promises": this.data(meta.stationDef.station, meta.tag.data, 'difference'),
				"visible": true,
				"tooltip": {"valueDecimals": meta.decimals}
			},
			meta)
	}
	get "perma"(){
		return (meta) => {
			return this.preset(
				meta.series[Object.keys(meta.series)[this.callback]],
				{
					"name": Object.keys(meta.series)[this.callback],
					"color": meta.series[Object.keys(meta.series)[this.callback]].colour,
					"className": meta.series[Object.keys(meta.series)[this.callback]].className,
					"promises": this.data(Object.keys(meta.series)[this.callback].toLowerCase()
						.replace('ä','a').replace('å','a').replace('ö','o'),
						meta.tag.data,
						'yrly',
						'shortValues'),
					"visible": Object.keys(meta.series)[this.callback] === "Torneträsk",
					"opacity": 0.9,
				},
				meta)
		}
		// {
		// "type": meta.series[s].type,
		// "promises": data[s].values,
		// "tooltip": {"valueDecimals": meta.decimals}
		// }),
	}
	get "period" (){
		return (meta) => this.preset(
			meta.series[Object.keys(meta.series)[this.callback]],
			{
				"name": meta.series[Object.keys(meta.series)[this.callback]].name,
				"className": meta.series[Object.keys(meta.series)[this.callback]].className,
				"type": meta.series[Object.keys(meta.series)[this.callback]].type,
				"lineWidth": 1,
				"visible": true,
				"data": [0,0,0,0,0,0,0,0,0,0,0,0],
				"promises": this.data(this.station, this.tags),
				"dataSorting": {
					"enabled": true,
					"matchByName": true,
					"sortKey": 'sort'
				}
				// "tooltip": {"valueDecimals": meta.decimals}
			},
			meta)
	}

	get "co2" (){
		return (meta) => this.preset(
			meta.series.co2,
			{
				"name": meta.series.co2.name,
				"className": meta.series.co2.className,
				"color": meta.series.co2.colour,
				"type": meta.series.co2.type,
				"lineWidth": 0,
				"states": {"hover": {"lineWidthPlus": 0}},
				"turboThreshold": 4000,
				"fillOpacity": 0.2,
				"label": {
					"enabled": false
				},
				"marker": {
					"radius": 5,
					"lineColor": meta.series.co2.colour,
					"lineWidth": 1,
					"states": {
						"select": {
							"fillColor": "red",
							"lineWidth": 1,
							"radius": 5

						}

					}

				},
				"zIndex": 6,
				"tooltip": {"valueDecimals": meta.decimals},
				"promises": this.data(meta.stationDef.station,meta.tag.data, 'shortValues')
			}
			,meta)
	}
}
module.exports.Serie = Serie
