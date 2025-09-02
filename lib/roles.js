const roleMap = {
  Admin: 'admin',
  User: 'user'
};

export function mapRoles(roles = []) {
  return roles.map((r) => roleMap[r]).filter(Boolean);
}
