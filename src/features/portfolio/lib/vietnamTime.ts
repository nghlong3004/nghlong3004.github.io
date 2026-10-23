const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', hour12: false,
})

export function formatVietnamTime(date: Date = new Date()) {
  return formatter.format(date)
}
