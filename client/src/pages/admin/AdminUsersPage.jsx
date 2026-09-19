import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Loader2, Users as UsersIcon, Download, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { exportCsv, USER_EXPORT } from '../../lib/exportCsv';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
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
    (u.userId?.toLowerCase() || '').includes(search.toLowerCase()),
  );

  const toggleAll = () =>
    setSelected(selected.length === filteredUsers.length ? [] : filteredUsers.map(u => u.userId));
  const toggleOne = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleExport = () => {
    const rows = selected.length > 0
      ? filteredUsers.filter(u => selected.includes(u.userId))
      : filteredUsers;
    exportCsv(
      selected.length > 0 ? 'users-selected' : 'users-all',
      USER_EXPORT.headers,
      USER_EXPORT.keys,
      rows,
    );
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-ink-strong">Registered Users</h1>
          <p className="text-muted-foreground mt-1">Manage platform users and their associated records.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 font-bold" onClick={handleExport}>
            <Download className="size-4" />
            {selected.length > 0 ? `Export Selected (${selected.length})` : 'Export All CSV'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
          <CardTitle className="text-base font-bold">
            User Database
            {selected.length > 0 && (
              <span className="ml-2 text-xs font-normal text-muted-foreground">{selected.length} selected</span>
            )}
          </CardTitle>
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
                    <th className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        className="rounded border-border"
                        checked={selected.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={toggleAll}
                      />
                    </th>
                    <th className="px-6 py-3 font-bold">User ID & Name</th>
                    <th className="px-6 py-3 font-bold">Contact</th>
                    <th className="px-6 py-3 font-bold">Nationality</th>
                    <th className="px-6 py-3 font-bold">Status</th>
                    <th className="px-6 py-3 font-bold">Joined</th>
                    <th className="px-6 py-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => {
                    const isSelected = selected.includes(user.userId);
                    return (
                      <tr
                        key={user.userId}
                        className={`border-b transition-colors ${isSelected ? 'bg-primary/5' : 'hover:bg-muted/30'}`}
                      >
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            className="rounded border-border"
                            checked={isSelected}
                            onChange={() => toggleOne(user.userId)}
                          />
                        </td>
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
                        <td className="px-6 py-4">{user.nationality || '—'}</td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={user.status === 'active' ? 'text-green-600 bg-green-50 border-green-200' : ''}>
                            {user.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {user.createdAt ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true }) : 'Unknown'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" asChild className="size-8 text-muted-foreground hover:text-primary">
                              <Link to={`/admin/users/${user.userId}`} title="View details">
                                <Eye className="size-4" />
                              </Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
