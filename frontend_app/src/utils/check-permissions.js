import { CONFIG } from 'src/config-global';

export const verifyPermissions = (permissions, system, module, operation) => {
  if (!permissions) {
    return false;
  }
  return permissions?.some((permission) =>
    permission?.module_system?.system?.name.toLowerCase().includes(system.toLowerCase()) &&
    permission?.module_system?.name.toLowerCase().includes(module.toLowerCase()) &&
    permission?.name.toLowerCase().includes(operation.toLowerCase())
  );
}

export const verifyRole = (roles, role) => {
  if (!roles) {
    return false;
  }
  return roles?.some((r) => r.name.includes(role));
}


export const listRolesAndSubroles = (role) =>
  role?.toLowerCase().indexOf(CONFIG.roles.superadmin.toLowerCase()) !== -1 ?
    [
      CONFIG.roles.superadmin,
      CONFIG.roles.administrator,
      CONFIG.roles.client,
      CONFIG.roles.officeStaff,
    ] :
    role?.toLowerCase().indexOf(CONFIG.roles.administrator.toLowerCase()) !== -1 ?
      [
        CONFIG.roles.administrator,
        CONFIG.roles.client,
        CONFIG.roles.officeStaff,
      ] :
      role?.toLowerCase().indexOf(CONFIG.roles.client.toLowerCase()) !== -1 ?
        [CONFIG.roles.client] : 
        role?.toLowerCase().indexOf(CONFIG.roles.officeStaff.toLowerCase()) !== -1 ?
        [CONFIG.roles.officeStaff] : [];

export const isSuperAdmin = (role) => role?.toLowerCase().indexOf(CONFIG.roles.superadmin.toLowerCase()) !== -1;
export const isAdministrator = (role) => (
  role?.toLowerCase().indexOf(CONFIG.roles.administrator.toLowerCase()) !== -1 ||
  isSuperAdmin(role)
);
export const isClient = (role) => role?.toLowerCase().indexOf(CONFIG.roles.client.toLowerCase()) !== -1;
export const isOfficeStaff = (role) => role?.toLowerCase().indexOf(CONFIG.roles.officeStaff.toLowerCase()) !== -1;

export const belongsToWorkingStaff = (role) => (
  isSuperAdmin(role) || isAdministrator(role) || isOfficeStaff(role)
);