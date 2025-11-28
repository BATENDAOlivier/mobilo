import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Bus } from "lucide-react"
import { loadData, addUser, setCurrentUser } from "@/lib/storage"
import Navbar from "@/components/Navbar"

const Auth = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const data = loadData()
    const user = data.users.find(
      (u) => u.email === email && u.password === password
    )

    setTimeout(() => {
      if (user) {
        setCurrentUser(user)
        toast.success("Welcome back!")
        if (user.role === "admin") {
          navigate("/admin")
        } else if (user.role === "agency") {
          navigate("/agency")
        } else {
          navigate("/dashboard")
        }
      } else {
        toast.error("Invalid email or password")
      }
      setIsLoading(false)
    }, 500)
  }

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      toast.error("Passwords don't match")
      setIsLoading(false)
      return
    }

    const data = loadData()
    const existingUser = data.users.find((u) => u.email === email)

    setTimeout(() => {
      if (existingUser) {
        toast.error("Email already registered")
        setIsLoading(false)
        return
      }

      const newUser = addUser({
        name,
        email,
        password,
        role: "client",
      })

      setCurrentUser(newUser)
      toast.success("Account created successfully!")
      navigate("/dashboard")
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="bg-gradient-primary p-3 rounded-xl inline-block mb-4">
              <Bus className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold">Welcome to BusTicket</h1>
            <p className="text-muted-foreground mt-2">
              Sign in or create an account to continue
            </p>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>Choose how you want to proceed</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-primary hover:opacity-90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-accent hover:opacity-90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Auth
