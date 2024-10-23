/**
 * 时间格式转化
 * @param date 
 * @returns string
 */
export const dateParse = (date: string) => {
  const utcDate = new Date(date);
  const utcPlus8Date = new Date(utcDate.getTime());
  return (
    utcPlus8Date.getFullYear() +
    "-" +
    (utcPlus8Date.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    utcPlus8Date.getDate().toString().padStart(2, "0") +
    " " +
    utcPlus8Date.getHours().toString().padStart(2, "0") +
    ":" +
    utcPlus8Date.getMinutes().toString().padStart(2, "0") +
    ":" +
    utcPlus8Date.getSeconds().toString().padStart(2, "0")
  );
};
