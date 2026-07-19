import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthProvider from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// User Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminProfile from "./pages/AdminProfile";
import Temples from "./pages/Temples";
import TempleDetails from "./pages/TempleDetails";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import BookingConfirmation from "./pages/BookingConfirmation";
import MyBookings from "./pages/MyBookings";
import Donate from "./pages/Donate";
import Donations from "./pages/Donations";
import Feedback from "./pages/Feedback";
import Notifications from "./pages/Notifications";

// Organizer Pages
import OrganizerDashboard from "./pages/OrganizerDashboard";
import OrganizerHome from "./pages/OrganizerHome";
import OrganizerProfile from "./pages/OrganizerProfile";
import OrganizerBookings from "./pages/OrganizerBookings";
import MyTemple from "./pages/MyTemple";
import UpdateTemple from "./pages/UpdateTemple";
import MyDarshans from "./pages/MyDarshans";
import CreateDarshan from "./pages/CreateDarshan";
import OrganizeLogin from "./pages/OrganizeLogin";
import OrganizeRegister from "./pages/OrganizeRegister";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminAnalytics from "./pages/AdminAnalytics";
import Users from "./pages/Users";
import Organizers from "./pages/Organizers";

// Optional Pages
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";

function ProfileRoute() {
  const accountType = localStorage.getItem("accountType");

  if (accountType === "organizer") {
    return <Profile />;
  }

  return <AdminProfile />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/organizelogin" element={<OrganizeLogin />}/>
          <Route path="/organizeregister" element={<OrganizeRegister />}/>
          <Route path="/temples" element={<Temples />} />
          <Route path="/temples/:id" element={<TempleDetails />}/>
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />

          {/* User Routes */}
          <Route element={<ProtectedRoute roles={["user"]} />}>
            <Route path="/booking/:templeId/:slotId" element={<Booking />}/>
            <Route path="/payment/:bookingId" element={<Payment />}/>
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/mybookings"  element={<MyBookings />}/>
            <Route path="/donate/:templeId" element={<Donate />} />
            <Route path="/donations" element={<Donations />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route element={<ProtectedRoute roles={["user", "organizer"]} />}>
            <Route path="/profile" element={<ProfileRoute />} />
          </Route>

          {/* Organizer Routes */}
          <Route element={<ProtectedRoute role="organizer" />}>
            <Route path="/organizerhome" element={<OrganizerHome />} />
            <Route path="/organizerprofile" element={<OrganizerProfile />} />
            <Route path="/organizer-dashboard"element={<OrganizerDashboard />}/>
            <Route path="/mytemple/:id?" element={<MyTemple />}/>
            <Route path="/updatetemple/:id?" element={<UpdateTemple />}/>
            <Route path="/mydarshans" element={<MyDarshans />}/>
            <Route path="/createdarshan" element={<CreateDarshan />} />
            <Route path="/organizer-bookings" element={<OrganizerBookings />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute roles={["user", "admin"]} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-analytics" element={<AdminAnalytics />} />
            <Route path="/users" element={<Users />} />
            <Route path="/organizers" element={<Organizers />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;