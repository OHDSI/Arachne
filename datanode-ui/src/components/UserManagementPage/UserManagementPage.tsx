import React, { useCallback, useEffect, useState } from "react";
import {
  getUsers,
  updateUserRoles,
  enableUser,
  disableUser,
  createAdminUser,
  deleteUser,
  getAuthSettings,
  updateAuthSettings,
  AdminUserDTO,
  AuthSettingsDTO,
} from "../../api/admin";
import { useSelector } from "react-redux";

export function UserManagementPage() {
  const [users, setUsers] = useState<AdminUserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<AuthSettingsDTO | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("ROLE_USER");
  const authMode = useSelector<any, string | null>((state: any) => state.authMode.mode);
  const currentUsername = useSelector<any, string | undefined>((state: any) => state.user.data?.username);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
      setError(null);
    } catch (e: any) {
      setError(e?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const data = await getAuthSettings();
      setSettings(data);
    } catch {
      // Settings may not be available
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchSettings();
  }, [fetchUsers, fetchSettings]);

  const handleToggleRole = async (user: AdminUserDTO, role: string) => {
    const hasRole = user.roles.includes(role);
    const newRoles = hasRole
      ? user.roles.filter((r) => r !== role)
      : [...user.roles, role];
    if (newRoles.length === 0) return;
    try {
      await updateUserRoles(user.id, newRoles);
      await fetchUsers();
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to update roles");
    }
  };

  const handleToggleEnabled = async (user: AdminUserDTO) => {
    try {
      if (user.enabled === false) {
        await enableUser(user.id);
      } else {
        await disableUser(user.id);
      }
      await fetchUsers();
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to toggle user status");
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const roles = newRole === "ROLE_ADMIN" ? ["ROLE_ADMIN", "ROLE_USER"] : ["ROLE_USER"];
      await createAdminUser(newUsername, newPassword, roles);
      setNewUsername("");
      setNewPassword("");
      setNewRole("ROLE_USER");
      setShowCreateForm(false);
      await fetchUsers();
    } catch (e: any) {
      setError(e?.response?.data?.errors?.join(", ") || e?.message || "Failed to create user");
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      await fetchUsers();
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to delete user");
    }
  };

  const handleToggleSelfRegistration = async () => {
    if (!settings) return;
    try {
      const updated = await updateAuthSettings({
        ...settings,
        selfRegistrationEnabled: !settings.selfRegistrationEnabled,
      });
      setSettings(updated);
    } catch (e: any) {
      setError(e?.message || "Failed to update settings");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">User Management</h1>
        <div className="flex gap-2">
          {settings && (
            <button
              onClick={handleToggleSelfRegistration}
              className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                settings.selfRegistrationEnabled
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-secondary text-muted-foreground border-border"
              }`}
            >
              Self-Registration: {settings.selfRegistrationEnabled ? "On" : "Off"}
            </button>
          )}
          {authMode === "LOCAL" && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Create User
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-2 text-sm rounded-md mb-4">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">dismiss</button>
        </div>
      )}

      {showCreateForm && (
        <div className="mb-6 p-4 bg-card rounded-lg border border-border">
          <h2 className="text-lg font-medium mb-3">Create New User</h2>
          <form onSubmit={handleCreateUser} className="flex gap-3 items-end flex-wrap">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Username</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="px-3 py-1.5 text-sm rounded-md border border-border bg-background"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="px-3 py-1.5 text-sm rounded-md border border-border bg-background"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="px-3 py-1.5 text-sm rounded-md border border-border bg-background"
              >
                <option value="ROLE_USER">User</option>
                <option value="ROLE_ADMIN">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-3 py-1.5 text-sm rounded-md border border-border text-muted-foreground hover:bg-secondary"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Username</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Roles</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <div className="font-medium">{user.username}</div>
                  {user.email && <div className="text-xs text-muted-foreground">{user.email}</div>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {user.roles.map((role) => (
                      <span
                        key={role}
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          role === "ROLE_ADMIN"
                            ? "bg-primary/10 text-primary"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {role.replace("ROLE_", "")}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      user.enabled !== false
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.enabled !== false ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {user.username === currentUsername ? (
                    <span className="text-xs text-muted-foreground">You</span>
                  ) : (
                    <div className="flex gap-1 justify-end">
                      <button
                        onClick={() => handleToggleRole(user, "ROLE_ADMIN")}
                        className="px-2 py-1 text-xs rounded border border-border hover:bg-secondary transition-colors"
                        title={user.roles.includes("ROLE_ADMIN") ? "Remove Admin" : "Make Admin"}
                      >
                        {user.roles.includes("ROLE_ADMIN") ? "Remove Admin" : "Make Admin"}
                      </button>
                      <button
                        onClick={() => handleToggleEnabled(user)}
                        className="px-2 py-1 text-xs rounded border border-border hover:bg-secondary transition-colors"
                      >
                        {user.enabled !== false ? "Disable" : "Enable"}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="px-2 py-1 text-xs rounded border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">No users found</div>
        )}
      </div>
    </div>
  );
}
