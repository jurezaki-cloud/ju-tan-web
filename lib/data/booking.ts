export type BookingService = {
  id: string;
  title: string;
  duration: string;
};

export type BookingEmployee = {
  id: string;
  name: string;
  role: string;
  services: string[];
};

export const bookingServices: BookingService[] = [
  { id: "ai", title: "Posvet o umetni inteligenci", duration: "45 min" },
  { id: "web", title: "Spletna stran ali aplikacija", duration: "45 min" },
  { id: "software", title: "Programska rešitev po meri", duration: "60 min" },
  { id: "mobile", title: "Mobilna aplikacija", duration: "45 min" },
  { id: "design", title: "Oblikovanje in video", duration: "30 min" },
  { id: "auto", title: "Avtomatizacija procesov", duration: "45 min" },
  { id: "consult", title: "IT svetovanje", duration: "30 min" },
];

const allServiceIds = bookingServices.map((service) => service.id);

export const bookingEmployees: BookingEmployee[] = [
  {
    id: "tanja",
    name: "Tanja Hrup",
    role: "Svetovalka",
    services: allServiceIds,
  },
  {
    id: "jure",
    name: "Jure Zakrajšek",
    role: "Svetovalec",
    services: allServiceIds,
  },
];

export const defaultEmployeeId = bookingEmployees[0].id;

export const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
];

export function upcomingWeekdays(count = 10) {
  const days: string[] = [];
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);

  while (days.length < count) {
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) {
      days.push(cursor.toISOString().slice(0, 10));
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

export function formatDay(iso: string) {
  return new Intl.DateTimeFormat("sl-SI", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(`${iso}T12:00:00`));
}

export function isSlotOpen(employeeId: string, date: string, time: string) {
  const seed = [...`${employeeId}-${date}-${time}`].reduce(
    (sum, char) => sum + char.charCodeAt(0),
    0,
  );
  return seed % 7 !== 0;
}
