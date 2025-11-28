// LocalStorage utilities for data persistence

export interface User {
  id: string
  email: string
  password: string
  name: string
  role: "client" | "admin" | "agency"
  agencyId?: string
  createdAt: string
}

export interface Agency {
  id: string
  name: string
  description: string
  logo: string
  rating: number
  totalTrips: number
  amenities: string[]
  userId?: string
}

export interface Schedule {
  id: string
  agencyId: string
  from: string
  to: string
  departureTime: string
  arrivalTime: string
  price: number
  availableSeats: number
  totalSeats: number
  date: string
  busNumber: string
}

export interface Booking {
  id: string
  userId: string
  scheduleId: string
  agencyId: string
  seats: number
  totalPrice: number
  commission: number
  paymentMethod: "mobile_money" | "visa"
  paymentStatus: "pending" | "completed" | "failed"
  bookingDate: string
  passengerName: string
  passengerPhone: string
  busLocation?: {
    lat: number
    lng: number
  }
}

export interface AppData {
  users: User[]
  agencies: Agency[]
  schedules: Schedule[]
  bookings: Booking[]
}

const STORAGE_KEY = "bus_booking_data"

// Initial Data
const initialData: AppData = {
  users: [
    {
      id: "1",
      email: "tendabaz.1@gmail.com",
      password: "1234",
      name: "BATENDA Olivier",
      role: "admin",
      createdAt: "2025-11-21T18:50:05.739Z",
    },
    {
      id: "2",
      email: "batenda@gmail.com",
      password: "1234",
      name: "Kagabo",
      role: "client",
      createdAt: "2025-11-21T18:50:05.739Z",
    },
    {
      email: "horizon@gmail.com",
      password: "1234",
      name: "Horizon Express",
      role: "agency",
      id: "1763751483395",
      createdAt: "2025-11-21T18:58:03.395Z",
      agencyId: "1763751483396",
    },
    {
      email: "volcano@gmail.com",
      password: "1234",
      name: "VOLCANO Express",
      role: "agency",
      id: "1763751590186",
      createdAt: "2025-11-21T18:59:50.186Z",
      agencyId: "1763751590187",
    },
    {
      email: "ritco@gmail.com",
      password: "1234",
      name: "RITCO Express",
      role: "agency",
      id: "1763751665200",
      createdAt: "2025-11-21T19:01:05.200Z",
      agencyId: "1763751665201",
    },
    {
      name: "CYIZA",
      email: "cyiza@gmail.com",
      password: "1234",
      role: "client",
      id: "1763757568208",
      createdAt: "2025-11-21T20:39:28.208Z",
    },
    {
      name: "QUEEN",
      email: "queen@gmail.com",
      password: "1234",
      role: "client",
      id: "1763757630118",
      createdAt: "2025-11-21T20:40:30.118Z",
    },
    {
      name: "CYUZUZO",
      email: "cyuzuzo@gmail.com",
      password: "1234",
      role: "client",
      id: "1763757716645",
      createdAt: "2025-11-21T20:41:56.645Z",
    },
    {
      email: "stella@gmail.com",
      password: "1234",
      name: "STELLA Express",
      role: "agency",
      id: "1763798609429",
      createdAt: "2025-11-22T08:03:29.429Z",
      agencyId: "1763798609431",
    },
  ],
  agencies: [
    {
      name: "Horizon Express",
      description: "Safe Journey",
      logo: "data:image/png;base64,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",
      rating: 4,
      totalTrips: 0,
      amenities: ["WiFi", "AC", "USB Charging", "Reclining Seats"],
      userId: "1763751483395",
      id: "1763751483396",
    },
    {
      name: "VOLCANO Express",
      description: "Beyond Transportation",
      logo: "data:image/png;base64,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",
      rating: 4,
      totalTrips: 0,
      amenities: ["AC", "Reclining Seats", "Snacks"],
      userId: "1763751590186",
      id: "1763751590187",
    },
    {
      name: "RITCO Express",
      description: "Unique Agency",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRvEgVrrGV0NcbsryG5VQ9WV2C6IeMRpkbXA&s",
      rating: 4,
      totalTrips: 0,
      amenities: ["WiFi", "AC", "Entertainment"],
      userId: "1763751665200",
      id: "1763751665201",
    },
    {
      name: "STELLA Express",
      description: "Smooth Journey",
      logo: "data:image/jpeg;base64,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BAQEBAQEBAQECL7T0tbp+bUlRuezFvrSocO7uyEAcyB1PnI2jsjaNxLmPZ3Q9TxsKylsHNXJbEaqrIrOPQ+I/iDZEdGJZWJDNv5J58pVWJiGetbRHhgajnaxg4mGuZfqlORZqiU2Hx0/7RiBQAaiSeE8vMgEtz38uT1RBM2iO6Sx9M7TWDTKb7tSqrd8kZNtVtJtpqZgKzYd/iYcyevIjznYi/Z2Iv2SBwu0a5+XvbmtSi3jHes47U3U+ARWNmcBbOLhP3d999ztO6vt3V9oh8LtT9gRQNRN65dh/wDEIGupCKq8R4+KsE8R5EjcHkOUjq+kdZNNl7x9IzMqjSPCxLMm3Gy6b8gKamYIqjjUsxAJJ+h28pO8TMQsyRMxCP1nA1XL1TT9QGBmVVqL6/BGWqmhwzLXa4DgKCCpYLvuARznJi0ztGYtNonTD7I6HrA1rBzNQxslrK6surKyrbKXQsTZwFNm3CbMo2A8zynKxbq3JSturcurZNHiLw8RXnzI23nc+GMtem0zr9NETpTGw66tyq/Eern4mP1MYcGPDXppGhkS4ICAgICAgICAgICAgICAgICAgICAgICBQqD1APzgICBWAgUgIFYCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH/9k=",
      rating: 4.7,
      totalTrips: 0,
      amenities: [
        "WiFi",
        "AC",
        "USB Charging",
        "Reclining Seats",
        "5% discount",
      ],
      userId: "1763798609429",
      id: "1763798609431",
    },
  ],
  schedules: [
    {
      agencyId: "1763751665201",
      from: "HUYE",
      to: "KIGALI",
      departureTime: "07:00",
      arrivalTime: "11:00",
      price: 3742,
      availableSeats: 57,
      totalSeats: 60,
      date: "2025-11-22",
      busNumber: "RAE005F",
      id: "1763751771379",
    },
    {
      agencyId: "1763751483396",
      from: "NYANZA",
      to: "MUHANGA",
      departureTime: "10:00",
      arrivalTime: "11:00",
      price: 980,
      availableSeats: 21,
      totalSeats: 29,
      date: "2025-11-22",
      busNumber: "RAD008N",
      id: "1763751870154",
    },
    {
      agencyId: "1763751590187",
      from: "KIGALI",
      to: "HUYE",
      departureTime: "13:30",
      arrivalTime: "16:30",
      price: 3742,
      availableSeats: 29,
      totalSeats: 29,
      date: "2025-11-22",
      busNumber: "RAD234E",
      id: "1763752168123",
    },
    {
      agencyId: "1763751590187",
      from: "HUYE",
      to: "MUHANGA",
      departureTime: "00:00",
      arrivalTime: "14:00",
      price: 2300,
      availableSeats: 29,
      totalSeats: 29,
      date: "2025-11-22",
      busNumber: "RAC009F",
      id: "1763752221501",
    },
    {
      agencyId: "1763751483396",
      from: "KIGALI",
      to: "RUSIZI",
      departureTime: "11:30",
      arrivalTime: "18:30",
      price: 8400,
      availableSeats: 60,
      totalSeats: 60,
      date: "2025-11-22",
      busNumber: "RAE201D",
      id: "1763757002380",
    },
    {
      agencyId: "1763751483396",
      from: "RUSIZI",
      to: "NYAGATARE",
      departureTime: "13:00",
      arrivalTime: "00:30",
      price: 14900,
      availableSeats: 22,
      totalSeats: 29,
      date: "2025-11-22",
      busNumber: "RAD100N",
      id: "1763757142061",
    },
    {
      agencyId: "1763751590187",
      from: "KIGALI",
      to: "RUBAVU",
      departureTime: "14:45",
      arrivalTime: "22:45",
      price: 5800,
      availableSeats: 56,
      totalSeats: 60,
      date: "2025-11-22",
      busNumber: "RAE003V",
      id: "1763757258289",
    },
    {
      agencyId: "1763751665201",
      from: "RUBAVU",
      to: "RUSUMO",
      departureTime: "12:30",
      arrivalTime: "10:40",
      price: 13400,
      availableSeats: 29,
      totalSeats: 29,
      date: "2025-11-22",
      busNumber: "RAF001S",
      id: "1763757380717",
    },
    {
      agencyId: "1763751665201",
      from: "KIGALI",
      to: "NYANZA",
      departureTime: "13:00",
      arrivalTime: "16:40",
      price: 2800,
      availableSeats: 29,
      totalSeats: 29,
      date: "2025-11-22",
      busNumber: "RAC002W",
      id: "1763757515682",
    },
    {
      agencyId: "1763798609431",
      from: "KIGALI",
      to: "GICUMBI",
      departureTime: "12:10",
      arrivalTime: "13:10",
      price: 1560,
      availableSeats: 29,
      totalSeats: 29,
      date: "2025-11-22",
      busNumber: "RAC004M",
      id: "1763798722188",
    },
  ],
  bookings: [],
}

export const loadData = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) return JSON.parse(stored)

  // store initial data
  saveData(initialData)
  return initialData
}

export const saveData = (data: AppData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem("current_user")
  return userStr ? JSON.parse(userStr) : null
}

export const setCurrentUser = (user: User | null): void => {
  if (user) localStorage.setItem("current_user", JSON.stringify(user))
  else localStorage.removeItem("current_user")
}

// USERS
export const addUser = (user: Omit<User, "id" | "createdAt">): User => {
  const data = loadData()
  const newUser: User = {
    ...user,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }

  data.users.push(newUser)
  saveData(data)
  return newUser
}

// AGENCIES
export const addAgency = (agency: Omit<Agency, "id">): Agency => {
  const data = loadData()
  const newAgency: Agency = {
    ...agency,
    id: Date.now().toString(),
  }

  data.agencies.push(newAgency)
  saveData(data)
  return newAgency
}

export const updateAgency = (id: string, updates: Partial<Agency>): void => {
  const data = loadData()
  const index = data.agencies.findIndex((a) => a.id === id)
  if (index !== -1) {
    data.agencies[index] = { ...data.agencies[index], ...updates }
    saveData(data)
  }
}

export const deleteAgency = (id: string): void => {
  const data = loadData()
  data.agencies = data.agencies.filter((a) => a.id !== id)
  saveData(data)
}

// SCHEDULES
export const addSchedule = (schedule: Omit<Schedule, "id">): Schedule => {
  const data = loadData()
  const newSchedule = { ...schedule, id: Date.now().toString() }
  data.schedules.push(newSchedule)
  saveData(data)
  return newSchedule
}

export const updateSchedule = (
  id: string,
  updates: Partial<Schedule>
): void => {
  const data = loadData()
  const index = data.schedules.findIndex((s) => s.id === id)
  if (index !== -1) {
    data.schedules[index] = { ...data.schedules[index], ...updates }
    saveData(data)
  }
}

export const deleteSchedule = (id: string) => {
  const data = loadData()
  data.schedules = data.schedules.filter((s) => s.id !== id)
  saveData(data)
}

// BOOKINGS
export const addBooking = (
  booking: Omit<Booking, "id" | "bookingDate" | "commission">
): Booking => {
  const data = loadData()
  const commission = booking.totalPrice * 0.02

  const newBooking: Booking = {
    ...booking,
    id: Date.now().toString(),
    bookingDate: new Date().toISOString(),
    commission,
  }

  data.bookings.push(newBooking)

  const schedule = data.schedules.find((s) => s.id === booking.scheduleId)
  if (schedule) schedule.availableSeats -= booking.seats

  saveData(data)
  return newBooking
}

export const updateBookingLocation = (
  bookingId: string,
  location: { lat: number; lng: number }
) => {
  const data = loadData()
  const booking = data.bookings.find((b) => b.id === bookingId)
  if (booking) {
    booking.busLocation = location
    saveData(data)
  }
}

// UPDATE USER
export const updateUser = (id: string, updates: Partial<User>) => {
  const data = loadData()
  const index = data.users.findIndex((u) => u.id === id)
  if (index !== -1) {
    data.users[index] = { ...data.users[index], ...updates }
    saveData(data)
  }
}

// DELETE USER
export const deleteUser = (id: string) => {
  const data = loadData()
  data.users = data.users.filter((u) => u.id !== id)
  saveData(data)
}
