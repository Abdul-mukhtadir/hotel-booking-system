import {
  useEffect,
  useState,
  useContext,
} from "react";

import API from "../../services/api";

import {
  AuthContext,
} from "../../context/AuthContext";

import AdminLayout from "../../components/AdminLayout";

function AdminUsersPage() {

  const { user } =
    useContext(AuthContext);

  const [users, setUsers] =
    useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers =
    async () => {

      try {

        const response =
          await API.get(
            "/users/all",
            {
              headers: {
                Authorization:
                  `Bearer ${user.token}`,
              },
            }
          );

        setUsers(
          response.data
        );

      } catch (error) {
        console.log(error);
      }
    };

  return (
    <AdminLayout>

      <div>

        <h1 className="text-5xl font-bold mb-10">
          Users
        </h1>

        <div className="grid gap-6">

          {users.map((u) => (

            <div
              key={u._id}
              className="bg-white p-6 rounded-xl shadow-md"
            >

              <h2 className="text-2xl font-bold">
                {u.name}
              </h2>

              <p className="mt-2">
                {u.email}
              </p>

              <p className="mt-2">
                Role: {u.role}
              </p>

            </div>

          ))}

        </div>

      </div>

    </AdminLayout>
  );
}

export default AdminUsersPage;