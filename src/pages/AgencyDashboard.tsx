import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  getCurrentUser,
  loadData,
  addSchedule,
  updateSchedule,
  deleteSchedule,
  type Schedule,
  type Booking,
  type Agency,
} from "@/lib/storage"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Calendar,
  Clock,
  DollarSign,
  Users,
  Bus,
  Plus,
  Edit,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import Navbar from "@/components/Navbar"

export default function AgencyDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(getCurrentUser())
  const [agency, setAgency] = useState<Agency | null>(null)
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const [sortBy, setSortBy] = useState<"date" | "price" | "seats">("date")
  const [filterStatus, setFilterStatus] = useState<"all" | "upcoming" | "past">(
    "all"
  )

  useEffect(() => {
    if (!user || user.role !== "agency") {
      navigate("/auth")
      return
    }

    const data = loadData()
    const userAgency = data.agencies.find((a) => a.userId === user.id)
    if (!userAgency) {
      toast.error("No agency found for this account")
      navigate("/")
      return
    }

    setAgency(userAgency)
    setSchedules(data.schedules.filter((s) => s.agencyId === userAgency.id))
    setBookings(data.bookings.filter((b) => b.agencyId === userAgency.id))
  }, [user, navigate])

  const handleAddSchedule = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!agency) return

    const formData = new FormData(e.currentTarget)
    const newSchedule = addSchedule({
      agencyId: agency.id,
      from: formData.get("from") as string,
      to: formData.get("to") as string,
      departureTime: formData.get("departureTime") as string,
      arrivalTime: formData.get("arrivalTime") as string,
      price: Number(formData.get("price")),
      availableSeats: Number(formData.get("totalSeats")),
      totalSeats: Number(formData.get("totalSeats")),
      date: formData.get("date") as string,
      busNumber: formData.get("busNumber") as string,
    })

    setSchedules([...schedules, newSchedule])
    setIsAddDialogOpen(false)
    toast.success("Schedule added successfully")
    e.currentTarget.reset()
  }

  const handleEditSchedule = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingSchedule) return

    const formData = new FormData(e.currentTarget)
    updateSchedule(editingSchedule.id, {
      from: formData.get("from") as string,
      to: formData.get("to") as string,
      departureTime: formData.get("departureTime") as string,
      arrivalTime: formData.get("arrivalTime") as string,
      price: Number(formData.get("price")),
      totalSeats: Number(formData.get("totalSeats")),
      date: formData.get("date") as string,
      busNumber: formData.get("busNumber") as string,
    })

    const data = loadData()
    setSchedules(data.schedules.filter((s) => s.agencyId === agency?.id))
    setIsEditDialogOpen(false)
    setEditingSchedule(null)
    toast.success("Schedule updated successfully")
  }

  const handleDeleteSchedule = (id: string) => {
    if (confirm("Are you sure you want to delete this schedule?")) {
      deleteSchedule(id)
      setSchedules(schedules.filter((s) => s.id !== id))
      toast.success("Schedule deleted successfully")
    }
  }

  const getSortedAndFilteredSchedules = () => {
    let filtered = [...schedules]

    // Filter by status
    const now = new Date()
    if (filterStatus === "upcoming") {
      filtered = filtered.filter((s) => new Date(s.date) >= now)
    } else if (filterStatus === "past") {
      filtered = filtered.filter((s) => new Date(s.date) < now)
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      } else if (sortBy === "price") {
        return a.price - b.price
      } else {
        return a.availableSeats - b.availableSeats
      }
    })

    return filtered
  }

  const getSortedBookings = () => {
    return [...bookings].sort(
      (a, b) =>
        new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
    )
  }

  const getScheduleById = (id: string) => schedules.find((s) => s.id === id)

  const stats = {
    totalRevenue: bookings.reduce(
      (sum, b) => sum + (b.totalPrice - b.commission),
      0
    ),
    totalBookings: bookings.length,
    totalCommission: bookings.reduce((sum, b) => sum + b.commission, 0),
    activeSchedules: schedules.filter((s) => new Date(s.date) >= new Date())
      .length,
  }

  if (!agency) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{agency.name} Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your schedules and view booking reports
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalRevenue.toLocaleString()} Rwf
              </div>
              <p className="text-xs text-muted-foreground">
                After 2% commission
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Commission Paid
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalCommission.toLocaleString()} Rwf
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Schedules
              </CardTitle>
              <Bus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeSchedules}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="schedules" className="space-y-4">
          <TabsList>
            <TabsTrigger value="schedules">Schedule Management</TabsTrigger>
            <TabsTrigger value="bookings">Booking Reports</TabsTrigger>
          </TabsList>

          {/* Schedules Tab */}
          <TabsContent value="schedules">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Manage Schedules</CardTitle>
                    <CardDescription>
                      Add, edit, or remove your bus schedules
                    </CardDescription>
                  </div>
                  <Dialog
                    open={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Schedule
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Schedule</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleAddSchedule} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="from">From</Label>
                            <Input id="from" name="from" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="to">To</Label>
                            <Input id="to" name="to" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input id="date" name="date" type="date" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="busNumber">Bus Number</Label>
                            <Input id="busNumber" name="busNumber" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="departureTime">
                              Departure Time
                            </Label>
                            <Input
                              id="departureTime"
                              name="departureTime"
                              type="time"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="arrivalTime">Arrival Time</Label>
                            <Input
                              id="arrivalTime"
                              name="arrivalTime"
                              type="time"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="price">Price (Rwf)</Label>
                            <Input
                              id="price"
                              name="price"
                              type="number"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="totalSeats">Total Seats</Label>
                            <Input
                              id="totalSeats"
                              name="totalSeats"
                              type="number"
                              required
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsAddDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">Add Schedule</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex gap-4">
                  <Select
                    value={filterStatus}
                    onValueChange={(v: any) => setFilterStatus(v)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Schedules</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="past">Past</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={sortBy}
                    onValueChange={(v: any) => setSortBy(v)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="seats">Available Seats</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Route</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Bus Number</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Seats</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getSortedAndFilteredSchedules().map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell>
                          {schedule.from} → {schedule.to}
                        </TableCell>
                        <TableCell>
                          {new Date(schedule.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {schedule.departureTime} - {schedule.arrivalTime}
                        </TableCell>
                        <TableCell>{schedule.busNumber}</TableCell>
                        <TableCell>{schedule.price} Rwf</TableCell>
                        <TableCell>
                          {schedule.availableSeats}/{schedule.totalSeats}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingSchedule(schedule)
                                setIsEditDialogOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteSchedule(schedule.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Booking Reports</CardTitle>
                <CardDescription>
                  View all bookings and historical data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Passenger</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Seats</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Net Revenue</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getSortedBookings().map((booking) => {
                      const schedule = getScheduleById(booking.scheduleId)
                      return (
                        <TableRow key={booking.id}>
                          <TableCell className="font-mono text-xs">
                            {booking.id}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {booking.passengerName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {booking.passengerPhone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {schedule
                              ? `${schedule.from} → ${schedule.to}`
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {new Date(booking.bookingDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{booking.seats}</TableCell>
                          <TableCell>{booking.totalPrice} Rwf</TableCell>
                          <TableCell className="text-red-500">
                            -{booking.commission} Rwf
                          </TableCell>
                          <TableCell className="font-semibold">
                            {(
                              booking.totalPrice - booking.commission
                            ).toLocaleString()}{" "}
                            Rwf
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                booking.paymentStatus === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : booking.paymentStatus === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {booking.paymentStatus}
                            </span>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Schedule</DialogTitle>
            </DialogHeader>
            {editingSchedule && (
              <form onSubmit={handleEditSchedule} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-from">From</Label>
                    <Input
                      id="edit-from"
                      name="from"
                      defaultValue={editingSchedule.from}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-to">To</Label>
                    <Input
                      id="edit-to"
                      name="to"
                      defaultValue={editingSchedule.to}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-date">Date</Label>
                    <Input
                      id="edit-date"
                      name="date"
                      type="date"
                      defaultValue={editingSchedule.date}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-busNumber">Bus Number</Label>
                    <Input
                      id="edit-busNumber"
                      name="busNumber"
                      defaultValue={editingSchedule.busNumber}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-departureTime">Departure Time</Label>
                    <Input
                      id="edit-departureTime"
                      name="departureTime"
                      type="time"
                      defaultValue={editingSchedule.departureTime}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-arrivalTime">Arrival Time</Label>
                    <Input
                      id="edit-arrivalTime"
                      name="arrivalTime"
                      type="time"
                      defaultValue={editingSchedule.arrivalTime}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-price">Price (Rwf)</Label>
                    <Input
                      id="edit-price"
                      name="price"
                      type="number"
                      defaultValue={editingSchedule.price}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-totalSeats">Total Seats</Label>
                    <Input
                      id="edit-totalSeats"
                      name="totalSeats"
                      type="number"
                      defaultValue={editingSchedule.totalSeats}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditDialogOpen(false)
                      setEditingSchedule(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Update Schedule</Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
