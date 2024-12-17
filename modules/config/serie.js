import axios from 'axios';

/**
const getBaseUrl = () => {
	// Change 'localhost' to the actual domain or IP if necessary.
	// Port can be dynamically adjusted if needed
	const hostname = window.location.hostname;  // This will take the domain or localhost
	const pythonPort = 80;  // Change this to the actual port where your Python API is running
	return `http://${hostname}:${pythonPort}/python/data`;
};
 */

const getBaseUrl = () => {
	const hostname = window.location.hostname;

	// Check if it's a live version (production)
	const isLive = window.location.protocol === 'https:' || hostname !== 'localhost';

	// Use HTTPS for live, HTTP for development
	const protocol = isLive ? 'https' : 'http';

	// Adjust port only for local development
	//const pythonPort = isLive ? '' : ':5000'; // Use port 5000 for development, none for live
	const pythonPort = ''
	return `${protocol}://${hostname}${pythonPort}/python/data`;
};

export class Serie {
	constructor(meta, type, key, id, callback) {
		this.meta = meta;
		this.type = type;
		this.key = key;
		this.id = id;
		this.callback = callback;
		this.coordinates = meta.stationDef.coordinates;
		this.dates = {
			start: global.startYear,
			end: global.endYear,
		};
		this.baseline = {
			start: global.baselineLower || 1961,
			end: global.baselineUpper || 1990,
		};
	}
	// Helper method to get the appropriate types based on meta.stationDef.set
	getTypesForSet() {
		const stationSet = this.meta.stationDef.plot;
		const types = [];
		switch (stationSet) {
			case 'temperature_glob':
				types.push('global_temperature')
				break
			case 'temperature_nhem':
				types.push('northern_hemisphere_temperature')
				break
			case 'temperature_64n-90n':
				types.push('64n90n_temperature')
				break
			case 'slideTemperatures':
			case 'annualTemperatures':
				types.push('annual_temperature')
				break
			case 'slideMonthlyTemperatures':
				types.push('annual_jan_temperature')
				break
			case 'TemperaturesSpring':
				types.push('annual_spring_temperature')
				break;
			case 'slideTemperaturesSummer':
			case 'TemperaturesSummer':
				types.push('annual_summer_temperature')
				break;
			case 'slideTemperaturesAutumn':
			case 'TemperaturesAutumn':
				types.push('annual_autumn_temperature')
                break
			case 'slideTemperaturesWinter':
            case 'TemperaturesWinter':
				types.push('annual_winter_temperature')
				break
			case 'slidePrecipitation':
				types.push('annual_precipitation')
				break
			case 'slideGrowingSeasonWeeks':
				types.push('growing_season_weeks')
				break
			case 'slideGrowingSeasonDays':
				types.push('growing_season_days')
                break
			case 'growingSeasonFrostFirst':
				types.push('first_frost_autumn')
				break
			case 'growingSeasonFrostLast':
				types.push('last_frost_spring')
				break
			case 'slideSpringPrecipitation':
				types.push('annual_spring_precipitation')
				break
			case 'slideSummerPrecipitation':
				types.push('annual_summer_precipitation')
				break
			case 'slideAutumnPrecipitation':
				types.push('annual_autumn_precipitation')
				break
			case 'slideWinterPrecipitation':
				types.push('annual_winter_precipitation')
				break
			case 'precipitation_jan_slide':
				types.push('annual_jan_precipitation')
				break
			case 'precipitation_feb_slide':
				types.push('annual_feb_precipitation')
				break
			case 'precipitation_mar_slide':
				types.push('annual_mar_precipitation')
				break
			case 'precipitation_apr_slide':
				types.push('annual_apr_precipitation')
				break
			case 'precipitation_may_slide':
				types.push('annual_may_precipitation')
				break
			case 'precipitation_jun_slide':
				types.push('annual_jun_precipitation')
				break
			case 'precipitation_jul_slide':
				types.push('annual_jul_precipitation')
				break
			case 'precipitation_aug_slide':
				types.push('annual_aug_precipitation')
				break
			case 'precipitation_sep_slide':
				types.push('annual_sep_precipitation')
				break
			case 'precipitation_oct_slide':
				types.push('annual_oct_precipitation')
				break
			case 'precipitation_nov_slide':
				types.push('annual_nov_precipitation')
				break
			case 'precipitation_dec_slide':
				types.push('annual_dec_precipitation')
				break
			case 'permaHistogramCALM':
				types.push('perma')
				break
			case 'slideLakeIceTime':
				types.push('annual_ice_time')
				break
			case 'slideLakeIceFreezeup':
				types.push('annual_freezeup')
				break
			case 'slideLakeIceBreakup':
				types.push('annual_breakup')
				break
			case 'iceThicknessYear':
				types.push('annual_ice_thickness')
				break
			case 'abiskoSnowDepthPeriodMeans':
			case 'abiskoSnowDepthPeriodMeans2':
				types.push('period_snowdepth')
				break
			case 'annualAvgSnowDepth':
				types.push('annual_snowdepth_single')
				break
			case 'weeklyCO2':
				types.push('weekly_co2')
				break
			default:
		}
		return types;
	}
	formatData(input, t) {
		// TODO - Add logic to format data based on the type
		let type = t
		switch (this.type) {
			case 'min':
			case 'max':
			case 'snow':
			case 'rain':
			case 'diff':
				type = `${this.type}_${t}`
				break
			default:
		}
		let getX = (x) => Number(x)
		switch (this.meta.tag.render) {
			case 'periodMeans':
				input = input.periods[this.key]
				getX = (x) => {
					let month = parseInt(x)
					let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
					return months[month-1]
				}
				break
			case 'decadeMeans':
				input = input.decades[this.key]
				getX = (x) => {
					let month = parseInt(x)
					let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
					return months[month-1]
				}
				break
			case 'weekly':
				input = input.raw[type]
				break
			default:
				input = input.annual
		}
		console.log('input', input)
		return Object.entries(input).map(([year, entry]) => {
			let y = entry[`${type}`]
			let x = getX(year)
			if (entry.date) {
				x = entry.date
			}
			return {
				compressed: true,
				y: y,
				x: x, // Assuming 'x' is the year
				week: null, // Add logic if available
				month: null, // Add logic if available
				year: parseInt(year),
				decade: Math.floor(parseInt(year) / 10) * 10, // Calculate the decade
				monthName: null, // Add logic if available
				xInterval: null, // Add logic if available
				name: Object.keys(this.meta.series)[this.callback],
			};
		});
	}
	// Main method to get data from Python server based on series type and tags
	async fetchData(){
		// Prepare query parameters
		let types = this.getTypesForSet();
		let params = {
			start_year: this.dates.start,
			end_year: this.dates.end,
			coordinates: Object.values(this.coordinates).join(','),
			types: types.join(','),
			baseline: `${this.baseline.start},${this.baseline.end}`,
			LnKod: this.meta.stationDef.LnKod,
			KnKod: this.meta.stationDef.KnKod,
		};
		switch (types[0]){
			case 'perma':
				params.radius = 100000
				if(this.callback !== 0) {
					params.station = Object.keys(this.meta.series)[this.callback].toLowerCase()
				}
			default:

		}
		try {
			// Fetch data from the Python API
			const response = await axios.get(getBaseUrl(), { params });
			let formated = this.formatData(response.data, types[0])
			return formated
		} catch (error) {
			console.error('Error fetching data:', error);
			return null;
		}
	}

	// Fetch data based on type (avg, max, min, etc.)
	async getSerie() {
		return await this.fetchData()
	}

	// Generate a preset with optional promises for highcharts or other uses
	preset(config, serie, meta) {
		const preset = {
			"label": false,
			"lineWidth": 0,
			"marker": {"radius": 2},
			"states": {"hover": {"lineWidthPlus": 0}},
			"visible": false,
			"tooltip": {
				"valueDecimals": (() => (serie.decimals !== undefined ? series.decimals : meta.decimals))()
			},
			zones: config.preset === 'diff' ? [{
					value: 0,  // Negative values
					color: 'blue'  // Color for negative values
				}, {
					color: 'red'  // Color for positive values
				}] : undefined,
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
		if (meta.period) {
			preset.data = Array(12).fill(0)
		}
		let complete = () => {
			const incomp = {};
			$.extend(true, incomp, preset)
			if(config.group !== undefined) incomp.visible = (meta.groups[config.group].prime === undefined ? false : meta.groups[config.group].prime) && config.visible;
			if(meta.period) incomp.visible = meta.period
			incomp.promises.then((promises) => {
				Promise.allSettled(promises).then(() => {
					$(`#${this.id}`).highcharts().hideLoading();
					$(`#${this.id}`).highcharts().redraw()
				})
				if(meta.tag.data[1] === 'all'){
					Promise.allSettled(promises).then(all => {
						all = all.map(each => each.value)
						incomp.data = all
						$(`#${this.id}`).highcharts().series[this.callback].update(incomp)
					})
				}else{
					let len = promises.length;
					promises.forEach((point, index) => {
							if(point === undefined || isNaN(point.y)){
							}else{
								len -= 1;
								switch (meta.period) {
									case true:
										point = [point.x, point.y]
										let i = 11 - ((index + 15)  % 12)
										$(`#${this.id}`).highcharts().series[this.callback].data[i].update(point)
										//$(`#${this.id}`).highcharts().series[this.callback].addPoint(point)
										break;
									default:
										let toUpdate = (len === 0) || (index % promises.length === 30)
										$(`#${this.id}`).highcharts().series[this.callback].addPoint(point, toUpdate)
								}
							}
					})
				}

			})
			return incomp
		};
		return {
			incomplete: preset,
			complete: complete()
		}
	}
	buildPreset(type) {
		return this.preset(
			this.meta.series[type],
			{ promises: this.getSerie()},
			this.meta
		)
	}

	// Example preset for max temperature series
	get max() {
		return this.buildPreset('max')
	}

	// Example preset for average temperature series
	get avg() {
		return this.buildPreset('avg')
	}

	// Example preset for minimum temperature series
	get min() {
		return this.buildPreset('min')
	}
	get diff() {
		return this.buildPreset('diff')
	}
	get snow() {
		return this.buildPreset('snow')
	}
	get rain() {
        return this.buildPreset('rain')
    }
	get co2() {
		return this.buildPreset('co2')
	}
	get perma() {
		return this.buildPreset(Object.keys(this.meta.series)[this.callback])
	}
	get iceThick() {
		return this.buildPreset('iceThick')
	}
	get period() {
		let type = Object.keys(this.meta.series)[this.callback]
		return this.buildPreset(type)
	}
}