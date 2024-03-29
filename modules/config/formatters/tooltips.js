// TODO create a builder instead of this mess
// class structure with module parts in clear structure
const dateFormats = require("./date").formats;

class tooltipHandler {
    constructor(meta) {
        this.meta = meta;
    }
}

exports.formatters = function (meta) {
    return {
        "winterDOY" () {
            try {
                let tooltip = `<span style="font-size: 10px">${this.x}/${this.x+1}</span><br/>`;
                this.points.forEach((point) => {
                    const dec = point.series.options.tooltip.valueDecimals;
                    tooltip += `<span style="color:${point.color}">\u25CF</span> ${point.series.name
                    }${meta.unitType
                        ? ` [${meta.units[meta.unitType].plural}]`
                        : ""
                    }: <b>${(point.point.date != undefined ? dateFormats.YYYYMMDD(new Date(point.point.date), true) : point.y.toFixed(dec))}</b><br/>`;

                });
                return tooltip;

            } catch (error) {

                return undefined;

            }

        },
        "winterValue" () {

            try {
		// TODO change from this.x-1/this.x to this.x/this.x+1
                let tooltip = `<span style="font-size: 10px">${this.x - 1}/${this.x}</span><br/>`;
                this.points.forEach((point) => {

                    const dec = point.series.options.tooltip.valueDecimals;
                    tooltip += `<span style="color:${point.color}">\u25CF</span> ${point.series.name
                    }${meta.unitType
                        ? ` [${meta.units[meta.unitType].plural}]`
                        : ""
                    }: <b>${point.y.toFixed(dec)}</b><br/>`;

                });
                return tooltip;

            } catch (error) {

                return undefined;

            }

        },
        "winterValueDate" () {
		
            try {
                let tooltip = `<span style="font-size: 10px">Winter ${this.x}-${this.x + 1}</span><br/>`;
                this.points.forEach((point) => {

                    const dec = point.series.options.tooltip.valueDecimals;

                    tooltip += `<span style="font-size: 10px">${point.point.date}</span><br/>`;
                    tooltip += `<span style="color:${
                        point.color
                    }">\u25CF</span> ${
                        point.series.name
                    }: <b>${
                        point.y.toFixed(dec)
                    }</b><br/>`;

                });
                return tooltip;

            } catch (error) {

                return undefined;

            }

        },
        "winterValueDateExtreme" () {

            try {

                let tooltip = `<span style="font-size: 10px">Winter ${this.x}-${this.x + 1}</span><br/>`;
                this.points.forEach((point) => {
                    tooltip += `<span style="color:${
                        point.color
                    }">\u25CF</span> ${
                        point.series.name
                    }: <b>${
                        // TODO fix fullDate tag
                        dateFormats.YYYYMMDD(new Date(point.point.date))
                    }</b><br/>`;

                });
                return tooltip;
            } catch (error) {
                return undefined;
            }
        },
        "valueDate" () {
            try {
                let tooltip = `<span style="font-size: 10px">${this.x}</span><br/>`;
                this.points.forEach((point) => {
                    const dec = point.series.options.tooltip.valueDecimals;
                    tooltip += `<span style="color:${
                        point.color
                    }">\u25CF</span> ${
                        point.series.name
                    }: <b>${
                        point.y.toFixed(dec)
                    }</b><br/>`;
			(Array.isArray(point.point.subX) ? point.point.subX.forEach((date) => {

                        tooltip += `${dateFormats.MMDD(new Date(date))}</b><br/>`;

                    }) : null)
                    tooltip += "<br/>";
                    tooltip += (point.point.options.date ? `<b>${dateFormats.MMDD(point.point.options.date, true)}</b><br/>` : '')

                });
                return tooltip;
            } catch (error) {
                return undefined;
            }
        },
        "valueWeek" () {
            try {
                let tooltip = `<span style="font-size: 10px">${this.x}</span><br/>`;
                this.points.forEach((point) => {
                    const dec = point.series.options.tooltip.valueDecimals;
                    tooltip += `<span style="color:${
                        point.color
                    }">\u25CF</span> ${
                        point.series.name
                    }: <b>${
                        point.y.toFixed(dec)
                    }</b><br/>`;

                    (Array.isArray(point.point.subX) ? point.point.subX.forEach((date) => {
                        tooltip += `v ${date}</b><br/>`;
                    }) : null)
                    tooltip += "<br/>";
                    tooltip += (point.point.options.week ? `<b>${meta.units[meta.unitType].singular} ${point.point.options.week}</b><br/>` : '')
                });
                return tooltip;
            } catch (error) {
                return undefined;
            }
        },
        "valueMonth" () {
            try {
                let tooltip = `<span style="font-size: 10px">${this.x}</span><br/>`;
                this.points.forEach((point) => {
                    const dec = point.series.options.tooltip.valueDecimals;
                    tooltip += `<span style="color:${
                        point.color
                    }">\u25CF</span> ${
                        point.series.name
                    }: <b>${
                        point.y.toFixed(dec)
                    }</b><br/>`;
			(Array.isArray(point.point.subX) ? point.point.subX.forEach((date) => {
                        tooltip += `${dateFormats.MM(new Date(0, date, 1))}</b><br/>`;

                    }) : null)
                    tooltip += "<br/>";
                    tooltip += (point.point.options.monthName ? `<b>${point.point.options.monthName}</b><br/>` : '')
                });
                return tooltip;
            } catch (error) {
                return undefined;
            }
        },
        "value" () {

            try {

                let tooltip = `<span style="font-size: 10px">${this.x}</span><br/>`;
                this.points.forEach((point) => {
                    const dec = point.series.options.tooltip.valueDecimals;
                    tooltip += `<span style="color:${
                        point.color
                    }">\u25CF</span> ${
                        point.series.name
                    }${meta.unitType
                        ? ` [${meta.units[meta.unitType].plural}]`
                        : ""
                    }: <b>${
                        point.y.toFixed(dec)
                    }</b><br/>`;
                    tooltip += "<br/>";

                });
                return tooltip;

            } catch (error) {

                return undefined;

            }

        },
        "datetimeToYYWW" () {
            try {
                let date = new Date(this.x)
                let tooltip = `<span style="font-size: 10px">${dateFormats.YYWW(date, meta.units.week.singular)}</span><br/>`;
                this.points.forEach((point) => {
                    const dec = point.series.options.tooltip.valueDecimals;
                    tooltip += `<span style="color:${
                        point.color
                    }">\u25CF</span> ${
                        point.series.name
                    }
                    </b>${meta.unitType
                        ? ` [${meta.units[meta.unitType].plural}]`
                        : ""
                    }: <b>${
                        point.y.toFixed(dec)
                    }</b><br/>`;
                    tooltip += "<br/>";

                });
                return tooltip;
            } catch (error) {
                return undefined;
            }
        },
        "default" () {
            try {
                let nameFormat = (point) => {
                    let format = "";
                    switch(point.series.name) {
                        case 'Min':
                        case 'Max':
                            format = `${point.series.name}: <br/>${dateFormats.MMDD(point.point.date)}<br/>`
                            break;
                        default:
                            format = point.series.name
                    }
                    return `${format}${meta.unitType
                        ? ` [${meta.units[meta.unitType].plural}]`
                        : ""
                    } <b>`
                }
                let tooltip = `<span style="font-size: 10px">${this.x}</span><br/>`;
                this.points.forEach((point) => {
                    const dec = point.series.options.tooltip.valueDecimals;
                    tooltip += `<span style="color:${
                        point.color
                    }">\u25CF</span> ${
                        nameFormat(point)
                    }${point.y.toFixed(dec)}</b><br/>`;
                    tooltip += "<br/>";
                });
                return tooltip;
            } catch (error) {
                return undefined;
            }
        }
    };

};
