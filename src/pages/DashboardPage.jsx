import { useEffect, useState } from "react";
import Dashboard from "../components/dashboard/Dashboard";
import api from "../services/api";

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch (error) {
        console.error("Unable to load current user", error);
      } finally {
        setIsLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }
   if (isUnauthorized) {
    return <Navigate to="/" replace />;
  }

  return <Dashboard user={user} />;
};

export default DashboardPage;