import { Time } from "../components/TimePicker";

export const combineDateAndTime = (date: Date, time: Time) => {
    if (!date || !time) return null;

    const hours = parseInt(time.hour, 10);
    const minutes = parseInt(time.minute, 10);

    const dateTime = new Date(date);
    dateTime.setHours(hours, minutes, 0, 0); // Sets hours and minutes, and resets seconds and milliseconds to 0

    return dateTime;
};
