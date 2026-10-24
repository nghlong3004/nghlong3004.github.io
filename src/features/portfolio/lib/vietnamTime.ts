const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', hour12: false,
})
const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: 'numeric', day: 'numeric',
})

export function formatVietnamTime(date: Date = new Date()) {
  return formatter.format(date)
}

export function getCompletedAgeInVietnam(date: Date = new Date()) {
  const parts = dateFormatter.formatToParts(date)
  const year = Number(parts.find(part => part.type === 'year')?.value)
  const month = Number(parts.find(part => part.type === 'month')?.value)
  const day = Number(parts.find(part => part.type === 'day')?.value)
  return year - 2005 - Number(month < 6 || (month === 6 && day < 6))
}
