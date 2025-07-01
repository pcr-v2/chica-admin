import customDayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

customDayjs.extend(utc);
customDayjs.extend(timezone);

export default customDayjs;
