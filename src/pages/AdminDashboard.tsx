import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  getCurrentUser,
  loadData,
  addAgency,
  addUser,
  updateAgency,
  deleteAgency,
  updateUser,
  deleteUser,
  type Agency,
  type User,
  type Booking,
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
import { Textarea } from "@/components/ui/textarea"
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
import { Users, Building2, Plus, Edit, Trash2, TrendingUp } from "lucide-react"
import { toast } from "sonner"
import Navbar from "@/components/Navbar"

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [user] = useState(getCurrentUser())
  const [agencies, setAgencies] = useState<Agency[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isAddAgencyOpen, setIsAddAgencyOpen] = useState(false)

  const [isEditAgencyOpen, setIsEditAgencyOpen] = useState(false)
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null)

  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  // LOAD INITIAL DATA
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/auth")
      return
    }

    const data = loadData()
    setAgencies(data.agencies)
    setUsers(data.users)
    setBookings(data.bookings)
  }, [])

  // ADD AGENCY
  const handleAddAgency = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)

    const email = form.get("email") as string
    const password = form.get("password") as string
    const agencyName = form.get("name") as string

    // Create user first
    const newUser = addUser({
      email,
      password,
      name: agencyName,
      role: "agency",
    })

    // Create agency
    const newAgency = addAgency({
      name: agencyName,
      description: form.get("description") as string,
      logo: form.get("logo") as string,
      rating: Number(form.get("rating")),
      totalTrips: 0,
      amenities: (form.get("amenities") as string)
        .split(",")
        .map((a) => a.trim()),
      userId: newUser.id,
    })

    // Link user to agency
    updateUser(newUser.id, { agencyId: newAgency.id })

    // Reload UI
    const data = loadData()
    setAgencies(data.agencies)
    setUsers(data.users)

    toast.success("Agency created successfully")
    setIsAddAgencyOpen(false)
    e.currentTarget.reset()
  }

  // EDIT AGENCY
  const handleEditAgency = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingAgency) return

    const form = new FormData(e.currentTarget)

    updateAgency(editingAgency.id, {
      name: form.get("name") as string,
      description: form.get("description") as string,
      logo: form.get("logo") as string,
      rating: Number(form.get("rating")),
      amenities: (form.get("amenities") as string)
        .split(",")
        .map((a) => a.trim()),
    })

    const data = loadData()
    setAgencies(data.agencies)

    toast.success("Agency updated successfully")
    setIsEditAgencyOpen(false)
    setEditingAgency(null)
  }

  // DELETE AGENCY
  const handleDeleteAgency = (id: string) => {
    const agency = agencies.find((a) => a.id === id)
    if (!agency) return

    if (!confirm("Delete this agency?")) return

    deleteAgency(id)

    if (agency.userId) deleteUser(agency.userId)

    const data = loadData()
    setAgencies(data.agencies)
    setUsers(data.users)

    toast.success("Agency deleted")
  }

  // EDIT USER
  const handleEditUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingUser) return

    const form = new FormData(e.currentTarget)

    updateUser(editingUser.id, {
      name: form.get("name") as string,
      email: form.get("email") as string,
    })

    const data = loadData()
    setUsers(data.users)

    toast.success("User updated")
    setIsEditUserOpen(false)
    setEditingUser(null)
  }

  // DELETE USER
  const handleDeleteUser = (id: string) => {
    if (!confirm("Delete user?")) return

    deleteUser(id)

    const data = loadData()
    setUsers(data.users)

    toast.success("User deleted")
  }

  const commissionStats = bookings.reduce((sum, b) => sum + b.commission, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Manage agencies, users and commission
        </p>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Commission</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl">
              {commissionStats} Rwf
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Bookings</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl">{bookings.length}</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Agencies</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl">{agencies.length}</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl">{users.length}</CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="agencies">
          <TabsList>
            <TabsTrigger value="agencies">Agencies</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          {/* Agencies Tab */}
          <TabsContent value="agencies">
            <Card>
              <CardHeader className="flex justify-between">
                <div>
                  <CardTitle>Agency Management</CardTitle>
                  <CardDescription>Manage bus agencies</CardDescription>
                </div>

                <Dialog
                  open={isAddAgencyOpen}
                  onOpenChange={setIsAddAgencyOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus /> Add Agency
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Agency</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleAddAgency} className="space-y-4">
                      <div>
                        <Label>Name</Label>
                        <Input name="name" required />
                      </div>

                      <div>
                        <Label>Email</Label>
                        <Input name="email" type="email" required />
                      </div>

                      <div>
                        <Label>Password</Label>
                        <Input name="password" type="password" required />
                      </div>

                      <div>
                        <Label>Description</Label>
                        <Textarea name="description" required />
                      </div>

                      <div>
                        <Label>Logo</Label>
                        <Input name="logo" defaultValue="🚌" required />
                      </div>

                      <div>
                        <Label>Rating</Label>
                        <Input
                          name="rating"
                          type="number"
                          defaultValue="4.0"
                          step="0.1"
                        />
                      </div>

                      <div>
                        <Label>Amenities</Label>
                        <Input
                          name="amenities"
                          placeholder="WiFi, AC"
                          required
                        />
                      </div>

                      <Button type="submit">Save</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>

              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Amenities</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {agencies.map((agency) => (
                      <TableRow key={agency.id}>
                        <TableCell>{agency.name}</TableCell>
                        <TableCell>{agency.description}</TableCell>
                        <TableCell>{agency.rating}</TableCell>
                        <TableCell>{agency.amenities.join(", ")}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingAgency(agency)
                              setIsEditAgencyOpen(true)
                            }}
                          >
                            <Edit />
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteAgency(agency.id)}
                          >
                            <Trash2 />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>{u.role}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingUser(u)
                              setIsEditUserOpen(true)
                            }}
                          >
                            <Edit />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteUser(u.id)}
                          >
                            <Trash2 />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Agency Dialog */}
        <Dialog open={isEditAgencyOpen} onOpenChange={setIsEditAgencyOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Agency</DialogTitle>
            </DialogHeader>

            {editingAgency && (
              <form onSubmit={handleEditAgency} className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    name="name"
                    defaultValue={editingAgency.name}
                    required
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    name="description"
                    defaultValue={editingAgency.description}
                    required
                  />
                </div>

                <div>
                  <Label>Logo</Label>
                  <Input
                    name="logo"
                    defaultValue={editingAgency.logo}
                    required
                  />
                </div>

                <div>
                  <Label>Rating</Label>
                  <Input
                    name="rating"
                    type="number"
                    step="0.1"
                    defaultValue={editingAgency.rating}
                  />
                </div>

                <div>
                  <Label>Amenities</Label>
                  <Input
                    name="amenities"
                    defaultValue={editingAgency.amenities.join(", ")}
                  />
                </div>

                <Button type="submit">Update</Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
        {/* Edit User Dialog */}
        <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>

            {editingUser && (
              <form onSubmit={handleEditUser} className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input name="name" defaultValue={editingUser.name} required />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    name="email"
                    type="email"
                    defaultValue={editingUser.email}
                    required
                  />
                </div>

                <Button type="submit">Save Changes</Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
