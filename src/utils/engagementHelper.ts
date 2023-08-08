import * as Highcharts from "highcharts";
import sampleMessageCountList from "../messageCountList"
import sampleChannels from "../channels"
import messageCountList from "../messageCountList";

// Helper function to generate parabolic data points
function generateSeriesData(channel: typeof sampleMessageCountList) {
    return channel.map((item) => {
        const x = Date.parse(item.timeBucket);
        const y = parseInt(item.count);
        return [x, y];
    });
}

// Helper function to filter channels with more than 1 date
function filterChannelsWithMultipleDates(messageCountList: typeof sampleMessageCountList) {
    // Group the message counts by channelId
    const groupedByChannel = messageCountList.reduce((acc: { [key: string]: (typeof item)[] }, item) => {
        if (item.channelId in acc) {
            acc[item.channelId].push(item);
        } else {
            acc[item.channelId] = [item];
        }
        return acc;
    }, {});

    // Filter channels that have messages for more than 1 date
    return Object.values(groupedByChannel).filter((channel) => channel.length > 1);
}

function handleMouseOver(this: Highcharts.Point): void {
    const chart = this.series.chart;
    const pointX = this.x; // Get x-coordinate of the hovered point
    updateHoverLine(chart, pointX);
}

function handleMouseOut(this: Highcharts.Point): void {
    const chart = this.series.chart;
    updateHoverLine(chart, null);
}

function updateHoverLine(chart: Highcharts.Chart, hoverLineValue: number | null): void {
    chart.xAxis[0].removePlotLine("hoverLine");
    if (typeof hoverLineValue === "number") { // Check for valid hoverLineValue
        chart.xAxis[0].addPlotLine({
            color: "gray",
            width: 1,
            id: "hoverLine",
            value: hoverLineValue,  // Specify the x-coordinate where the line should appear
        });
    }
}

// Generate HighchartReact options based on the filtered channels and channels data
function generateChartOptions(filteredChannels: typeof messageCountList[], channels: typeof sampleChannels): Highcharts.Options {
    const options: Highcharts.Options = {
        chart: {
            backgroundColor: "#22222c",
        },
        title: {
            text: "Engagement Over Time"
        },
        xAxis: {
            type: "datetime",
            lineColor: "#434a50",
            gridLineWidth: 0,
        },
        yAxis: {
            title: {
                text: "Number of Messages"
            },
            lineColor: "#434a50",
            gridLineWidth: 0,
        },
        legend: {
            backgroundColor: "#15161b",
            itemStyle: {
                color: "#a5a5a8",
                fontWeight: "bold",
            },
            itemHoverStyle: {
                color: "white"
            }
        },
        tooltip: {
            backgroundColor: "#0c0c0f",
            style: {
                opacity: 0.8
            },
            borderColor: "#0b7475",
            borderWidth: 1,
            padding: 4,
            borderRadius: 3,
            shared: true, // Show a shared tooltip for all series
            useHTML: true, // Allow HTML formatting in the tooltip
            formatter: function () {
                const formattedDate = Highcharts.dateFormat('%d %b', typeof this.x === "number" ? this.x : 0); // Format point.x as date-time
                return `
                <table>
                <tr><td style="color: white; font-size: 12px; font-weight: bold">${this.point.series.name}</td></tr>
                <tr><td style="font-size: 12px; color: #69696a">${this.y} ${this.y && typeof this.y === "number" && this.y > 1 ? 'messages' : 'message'} on ${formattedDate}</td></tr>
                </table>`;
            },
        },
        series: []
    };

    filteredChannels.forEach((channel) => {
        const channelData = channels.find((c) => c.value === channel[0].channelId);
        const seriesData = generateSeriesData(channel);

        options.series?.push({
            name: channelData ? channelData.name : channel[0].channelId,
            data: seriesData,
            type: "spline",
            color: "#0b7475",
            marker: {
                enabled: false,
                lineColor: "#0b7475",
            },
            point: {
                events: {
                    mouseOver: handleMouseOver,
                    mouseOut: handleMouseOut,
                },
            },
        });
    });

    return options;
}

const engagementHelper = {
    engagementMessageOverTimeChartOptions(messageCountList: typeof sampleMessageCountList, channels: typeof sampleChannels): Highcharts.Options {
        const filteredChannels = filterChannelsWithMultipleDates(messageCountList);
        return generateChartOptions(filteredChannels, channels);
    }
}

export default engagementHelper;
