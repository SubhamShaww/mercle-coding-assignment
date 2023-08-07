import { useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import engagementHelper from "../utils/engagementHelper";

import messageCountList from "../messageCountList"
import channels from "../channels"

const EngagementMessagesOverTime = (props: HighchartsReact.Props)=>{
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const options = engagementHelper.engagementMessageOverTimeChartOptions(messageCountList, channels)

	return <HighchartsReact highcharts={Highcharts} options={options} ref={chartComponentRef} {...props} />
}

export default EngagementMessagesOverTime