import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MoreVertical, Filter, Loader2, Users as UsersIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(data.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch users', err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    (u.name?.toLowerCase() || '').includes(search.toLowerCase()) || 
    (u.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (u.userId?.toLowerCase() || '').includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-ink-strong">Registered Users</h1>
          <p className="text-muted-foreground mt-1">Manage platform users and their associated records.</p>
        </div>
        <Button className="font-bold gap-2">
          <UsersIcon className="size-4" /> Add User
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
          <CardTitle className="text-base font-bold">User Database</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input 
                placeholder="Search users..." 
                className="pl-9 w-64 bg-background"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="size-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
              <Loader2 className="size-8 animate-spin mb-4" />
              <p>Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No users found matching your criteria.</p>
            </div>
          ) : (
            <div className="w-full overflow-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                  <tr>
                    <th className="px-6 py-3 font-bold">User ID & Name</th>
                    <th className="px-6 py-3 font-bold">Contact</th>
                    <th className="px-6 py-3 font-bold">Nationality</th>
                    <th className="px-6 py-3 font-bold">Status</th>
                    <th className="px-6 py-3 font-bold">Joined</th>
                    <th className="px-6 py-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.userId} className="border-b transition-colors hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <Link to={`/admin/users/${user.userId}`} className="font-bold text-primary hover:underline block">
                          {user.name}
                        </Link>
                        <span className="text-xs text-muted-foreground">{user.userId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-ink-strong">{user.email}</div>
                        <div className="text-xs text-muted-foreground">{user.phone || 'No phone'}</div>
                      </td>
                      <td className="px-6 py-4">
                        {user.nationality || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={user.status === 'active' ? 'text-green-600 bg-green-50 border-green-200' : ''}>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {user.createdAt ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true }) : 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/admin/users/${user.userId}`}>View Details</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
