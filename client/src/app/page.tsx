// app/page.jsx

import { fetchUsers } from "@/actions";

export default async function Page() {
  // Fetch data at the start
  const users = await fetchUsers();

  return (
    <div>
      {users.length > 0 ? (
        users.map((user: any) => (
          <div key={user.id}>
            <h3>Name: {user.username}</h3>
            <p>Email: {user.email}</p>
            <p>password: {user.password}</p>
          </div>
        ))
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
}
