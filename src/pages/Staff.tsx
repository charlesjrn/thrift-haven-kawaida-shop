
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Users, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSales } from '@/contexts/SalesContext';
import { toast } from 'sonner';

export default function Staff() {
  const { users, addUser, updateUser, deleteUser } = useAuth();
  const { getSalesByCashier } = useSales();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'cashier' as 'admin' | 'cashier'
  });

  // Fix cursor behavior by using direct state updates

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      role: 'cashier'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      updateUser(editingUser.id, formData);
      toast.success('Staff member updated successfully!');
      setEditingUser(null);
    } else {
      addUser(formData);
      toast.success('Staff member added successfully!');
      setIsAddDialogOpen(false);
    }
    
    resetForm();
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: '', // Don't pre-fill password for security
      role: user.role
    });
  };

  const handleDelete = (userId: string) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      deleteUser(userId);
      toast.success('Staff member deleted successfully!');
    }
  };

  const getUserSalesStats = (userId: string) => {
    const userSales = getSalesByCashier(userId);
    const totalRevenue = userSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    return {
      totalSales: userSales.length,
      totalRevenue
    };
  };

  const StaffForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={formData.username}
          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
          required={!editingUser}
          placeholder={editingUser ? "Leave blank to keep current password" : ""}
        />
      </div>

      <div>
        <Label htmlFor="role">Role</Label>
        <select
          id="role"
          value={formData.role}
          onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'cashier' }))}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="cashier">Cashier</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="flex space-x-2">
        <Button type="submit" className="flex-1">
          {editingUser ? 'Update Staff' : 'Add Staff'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            resetForm();
            setEditingUser(null);
            setIsAddDialogOpen(false);
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <p className="text-gray-600">Manage your team members and their access</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Staff</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
            </DialogHeader>
            <StaffForm />
          </DialogContent>
        </Dialog>
      </div>

      {editingUser && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Staff Member</CardTitle>
            <CardDescription>Update staff information</CardDescription>
          </CardHeader>
          <CardContent>
            <StaffForm />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Team Members</span>
          </CardTitle>
          <CardDescription>
            {users.length} staff members registered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => {
              const salesStats = getUserSalesStats(user.id);
              return (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{user.username}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span>KSh {salesStats.totalRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{salesStats.totalSales} sales</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
            
            {users.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No staff members added yet.</p>
                <p className="text-sm text-gray-400">Add your first team member to get started!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
